import re
from uuid import uuid4

from app.azure.storage_account_azure import AzureBlobStorage
from app.models.db_models import Category, Document
from app.utils.file_checks import check_file_extension, check_file_size
from fastapi import HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session


class DocumentCrud:

    def __init__(self, db: Session, user_id: int):
        self.__db = db
        self.__user_id = user_id

    def _clean(self, name: str):
        return re.sub(r"[^A-Za-z0-9_.-]", "_", name)

    def __category(self, category_id: int):
        category = self.__db.execute(
            select(Category).where(Category.id == category_id)
        ).scalar_one_or_none()

        if not category:
            raise HTTPException(status_code=404, detail="Category not found.")

        if category.user_id != self.__user_id:
            raise HTTPException(
                status_code=403,
                detail="Access Denied.",
            )

        return category

    def get_documents_by_category_id(self, category_id: int):
        return self.__category(category_id).documents

    def upload_documents_to_category(self, category_id: int, files: list[UploadFile]):
        category = self.__category(category_id)
        user_folder = self._clean(category.owner.name)
        category_folder = self._clean(category.name)

        uploaded_docs = []
        azure_blob_storage = AzureBlobStorage()

        for file in files:
            if not check_file_extension(file.filename):
                raise HTTPException(status_code=400, detail="File type not allowed.")
            if not check_file_size(file):
                raise HTTPException(
                    status_code=400, detail="File size exceeds the limit."
                )

            blob_filename = f"{uuid4()}_{self._clean(file.filename)}"
            blob_name = f"{user_folder}/{category_folder}/documents/{blob_filename}"
            blob_url = azure_blob_storage.upload_file(file, blob_name)

            document = Document(
                name=file.filename, path=blob_url, category_id=category_id
            )
            self.__db.add(document)
            uploaded_docs.append(document)

        self.__db.commit()
        return uploaded_docs

    def delete_document_by_id(self, document_id: int):
        document = self.__db.get(Document, document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found.")

        self.__category(document.category_id)

        azure_blob_storage = AzureBlobStorage()
        azure_blob_storage.delete_blob(document.path, is_full=True)

        self.__db.delete(document)
        self.__db.commit()
