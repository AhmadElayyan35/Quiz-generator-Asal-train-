from app.azure.storage_account_azure import AzureBlobStorage
from app.models.db_models import Category
from app.schemas.category_schema import CategoryDetailOut, CategoryForm
from app.schemas.user_schema import serializeDocuments, serializeQuizzes
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload


class CategoryCrud:
    def __init__(self, db: Session, user_id: int):
        self.__db = db
        self.__user_id = user_id

    def insert_new_category(self, data: CategoryForm):
        category = self.__db.execute(
            select(Category).where(
                Category.name == data.name, Category.user_id == self.__user_id
            )
        ).scalar_one_or_none()

        if category:
            raise HTTPException(
                status_code=400, detail="Category with this name already exists."
            )

        category = Category(name=data.name, user_id=self.__user_id)
        self.__db.add(category)
        self.__db.commit()
        self.__db.refresh(category)
        return category

    def delete_category_by_id(self, category_id: int):
        # Creating an instance of the azure blob storage class to get access to the delete blob function
        azure_blob_storage = AzureBlobStorage()
        category = self.__db.get(Category, category_id)

        if not category:
            raise HTTPException(status_code=404, detail="Category not found.")

        if category.user_id != self.__user_id:
            raise HTTPException(
                status_code=403, detail="Not authorized to delete this category."
            )

        for quiz_attempt in category.quiz_attempts:
            try:
                azure_blob_storage.delete_blob(quiz_attempt.path)
            except Exception as e:
                print("Warning: Failed to delete attempts", e)

        for doc in category.documents:
            try:
                azure_blob_storage.delete_blob(doc.path, is_full=True)
            except Exception as e:
                print("Warning: Failed to delete document", e)

        for quiz in category.quizzes:
            try:
                azure_blob_storage.delete_blob(quiz.path, is_full=True)
            except Exception as e:
                print("Warning: Failed to delete quiz", e)

        self.__db.delete(category)
        self.__db.commit()
        return True

    def fetch_category_content(self, category_id: int):
        category = (
            self.__db.execute(
                select(Category)
                .where(Category.id == category_id)
                .options(
                    selectinload(Category.documents),
                    selectinload(Category.quizzes),
                )
            )
            .scalars()
            .one_or_none()
        )

        if not category:
            raise HTTPException(404, "Category not found.")
        if category.user_id != self.__user_id:
            raise HTTPException(403, "No permission to access this category.")

        return CategoryDetailOut(
            id=category.id,
            name=category.name,
            documents=serializeDocuments([category]),
            quizzes=serializeQuizzes([category]),
        )
