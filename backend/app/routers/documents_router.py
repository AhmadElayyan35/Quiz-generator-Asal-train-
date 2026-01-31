from app.authentication.token_utils import get_user_id
from app.crud.document_crud import DocumentCrud
from app.database.connection_database import SessionLocal
from app.schemas.document_schema import DocumentOut
from fastapi import APIRouter, Depends, HTTPException, Response, UploadFile, status

router = APIRouter()


@router.get(
    "/categories/{category_id}/documents",
    response_model=list[DocumentOut],
    tags=["documents"],
)
def get_documents_by_category(category_id: int, user_id: int = Depends(get_user_id)):
    try:
        with SessionLocal() as db:
            document_crud = DocumentCrud(db=db, user_id=user_id)
            documents = document_crud.get_documents_by_category_id(category_id)

            return [
                DocumentOut(
                    id=doc.id, name=doc.name, path=doc.path, category_id=doc.category_id
                )
                for doc in documents
            ]

    except Exception as e:
        print("Error fetching documents by category:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch documents.")


@router.post(
    "/categories/{category_id}/documents",
    response_model=list[DocumentOut],
    tags=["documents"],
)
def upload_documents(
    category_id: int,
    files: list[UploadFile],
    user_id: int = Depends(get_user_id),
    status_code=status.HTTP_201_CREATED,
):
    try:
        with SessionLocal() as db:
            document_crud = DocumentCrud(db=db, user_id=user_id)
            uploaded = document_crud.upload_documents_to_category(category_id, files)

            return [
                DocumentOut(
                    id=doc.id, name=doc.name, path=doc.path, category_id=doc.category_id
                )
                for doc in uploaded
            ]

    except Exception as e:
        print("Error uploading documents:", e)
        raise HTTPException(status_code=500, detail="Failed to upload documents.")


@router.delete(
    "/documents/{document_id}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["documents"],
)
def delete_document(document_id: int, user_id: int = Depends(get_user_id)):
    try:
        with SessionLocal() as db:
            document_crud = DocumentCrud(db=db, user_id=user_id)
            document_crud.delete_document_by_id(document_id)
            return Response(status_code=status.HTTP_204_NO_CONTENT)

    except Exception as e:
        print(f"Error deleting document: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete document.")
