import json
from datetime import datetime
from uuid import uuid4

from app.azure.storage_account_azure import AzureBlobStorage
from app.models.db_models import Category, QuizAttempt
from app.schemas.quiz_attempt_schema import (
    DetailedAnswerItem,
    QuizAttemptDetailOut,
    QuizAttemptOut,
)
from fastapi import HTTPException
from sqlalchemy.orm import Session


class QuizAttemptCrud:
    def __init__(self, db: Session):
        self.__db = db

    def _clean_name(self, name: str) -> str:
        return name.replace(" ", "_")

    def create_attempt(
        self,
        answers: list[DetailedAnswerItem],
        username: str,
        category_id: int,
    ) -> QuizAttemptOut:
        parsed_answers = [
            DetailedAnswerItem(**a) if isinstance(a, dict) else a for a in answers
        ]

        full_attempt = {
            "submitted_at": datetime.utcnow().isoformat(),
            "answers": [a.dict() for a in parsed_answers],
        }
        category = self.__db.query(Category).filter(Category.id == category_id).first()
        category_name = category.name

        blob_service = AzureBlobStorage()
        safe_username = self._clean_name(username)
        safe_category = self._clean_name(category_name)
        filename = f"{uuid4()}.json"
        blob_path = f"{safe_username}/{safe_category}/attempts/{filename}"
        blob_service.upload_json(full_attempt, blob_path)

        attempt = QuizAttempt(
            category_id=category_id,
            submitted_at=datetime.utcnow(),
            path=blob_path,
        )
        self.__db.add(attempt)
        self.__db.commit()
        self.__db.refresh(attempt)

        return QuizAttemptOut(
            id=attempt.id,
            submitted_at=attempt.submitted_at,
            category_id=attempt.category_id,
            path=attempt.path,
        )

    def get_attempt_details(
        self, attempt_id: int, user_id: int
    ) -> QuizAttemptDetailOut:
        attempt = (
            self.__db.query(QuizAttempt)
            .join(Category, QuizAttempt.category_id == Category.id)
            .filter(
                QuizAttempt.id == attempt_id,
                Category.user_id == user_id,
            )
            .first()
        )

        if not attempt:
            raise HTTPException(status_code=404, detail="Attempt not found.")

        try:
            blob_service = AzureBlobStorage()
            data = blob_service.retrieve_blob(attempt.path)
            if isinstance(data, str):
                data = json.loads(data)
        except Exception:
            raise HTTPException(status_code=500, detail="Failed to load attempt data.")

        return QuizAttemptDetailOut(
            id=attempt.id,
            submitted_at=attempt.submitted_at,
            category_id=attempt.category_id,
            path=attempt.path,
            answers=[DetailedAnswerItem(**a) for a in data["answers"]],
        )

    def get_user_attempts(self, user_id: int, category_id: int) -> list[QuizAttemptOut]:
        category = (
            self.__db.query(Category)
            .filter(Category.id == category_id, Category.user_id == user_id)
            .first()
        )

        if not category:
            raise HTTPException(
                status_code=403,
                detail="This category does not belong to the current user.",
            )
        attempts = (
            self.__db.query(QuizAttempt)
            .join(Category, QuizAttempt.category_id == Category.id)
            .filter(Category.user_id == user_id, QuizAttempt.category_id == category_id)
            .all()
        )

        return [
            QuizAttemptOut(
                id=att.id,
                submitted_at=att.submitted_at,
                category_id=att.category_id,
                path=att.path,
            )
            for att in attempts
        ]

    def delete_attempt(self, attempt_id: int, user_id: int):
        attempt = (
            self.__db.query(QuizAttempt)
            .join(Category, QuizAttempt.category_id == Category.id)
            .filter(
                QuizAttempt.id == attempt_id,
                Category.user_id == user_id,
            )
            .first()
        )

        if not attempt:
            raise HTTPException(
                status_code=404, detail="Attempt not found or not authorized."
            )

        blob_service = AzureBlobStorage()
        blob_service.delete_blob(attempt.path)

        self.__db.delete(attempt)
        self.__db.commit()
