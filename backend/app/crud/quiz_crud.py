import datetime
import json
import uuid

from app.azure.search_index import Index
from app.azure.storage_account_azure import AzureBlobStorage
from app.models.db_models import Category, Quiz
from app.schemas.question_schema import QuestionSchema
from app.schemas.quiz_schema import QuizDetailOut, QuizSaveIn
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session


class QuizCrud:
    def __init__(self, db: Session, user_id: int):
        self.__db = db
        self.__user_id = user_id

    def get_category(self, category_id: int):
        category = self.__db.execute(
            select(Category).where(Category.id == category_id)
        ).scalar_one_or_none()

        if not category:
            raise HTTPException(status_code=404, detail="Category not found.")

        if category.user_id != self.__user_id:
            raise HTTPException(
                status_code=403,
                detail="No permission to access this category's quizzes.",
            )

        return category

    def delete_quiz_by_id(self, quiz_id: int):
        quiz = self.__db.get(Quiz, quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found.")

        category = self.get_category(quiz.category_id)
        if not category:
            raise HTTPException(
                status_code=404, detail="Associated category not found."
            )

        if category.user_id != self.__user_id:
            raise HTTPException(
                status_code=403, detail="No permission to delete this quiz."
            )

        azure_blob_storage = AzureBlobStorage()
        azure_blob_storage.delete_blob(quiz.path, is_full=True)

        self.__db.delete(quiz)
        self.__db.commit()

    def save_quiz(self, category_id: int, data: QuizSaveIn):
        category = self.get_category(category_id)

        blob = AzureBlobStorage()
        random = uuid.uuid4()
        filename = (
            f"{category.owner.name}/{category.name}/quizzes/{random}_{data.name}.json"
        )
        blob_path = blob.upload_json(
            [q.dict() for q in data.questions], filename.replace(" ", "_")
        )

        quiz = Quiz(
            name=data.name,
            level=data.level,
            category_id=category_id,
            path=blob_path,
            created_at=datetime.datetime.utcnow(),
        )

        self.__db.add(quiz)
        self.__db.commit()
        self.__db.refresh(quiz)

        Index().delete_index(data.index_name)

        return QuizDetailOut(
            id=quiz.id,
            name=quiz.name,
            level=quiz.level,
            category_id=quiz.category_id,
            path=quiz.path,
            created_at=quiz.created_at,
            questions=data.questions,
        )

    def get_quizzes_by_category_id(self, category_id: int):
        return self.get_category(category_id).quizzes

    def get_quiz_with_questions(self, quiz_id: int, user_id: int):
        quiz = self.__db.get(Quiz, quiz_id)
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found.")

        if not quiz.category or quiz.category.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Not authorized to access this quiz."
            )

        blob_service = AzureBlobStorage()
        questions_data = blob_service.retrieve_blob(quiz.path)
        try:
            if isinstance(questions_data, str):
                questions_data = json.loads(questions_data)
            questions = [QuestionSchema(**q) for q in questions_data]

            questions = sorted(questions, key=lambda q: q.question_number)

        except Exception as e:
            print("Warning: Failed to parse quiz file from blob:", e)
            questions = None

        return QuizDetailOut(
            id=quiz.id,
            name=quiz.name,
            level=quiz.level,
            path=quiz.path,
            category_id=quiz.category_id,
            created_at=quiz.created_at,
            questions=questions,
        )
