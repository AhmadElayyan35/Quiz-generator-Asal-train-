from app.authentication.token_utils import get_user_id
from app.crud.category_crud import CategoryCrud
from app.database.connection_database import SessionLocal
from app.schemas.category_schema import CategoryDetailOut, CategoryForm, CategoryOut
from fastapi import APIRouter, Depends, HTTPException, Response, status

router = APIRouter()


@router.get(
    "/categories/{category_id}",
    response_model=CategoryDetailOut,
    tags=["categories"],
)
def get_category_content(category_id: int, user_id: int = Depends(get_user_id)):
    try:
        with SessionLocal() as db:
            crud = CategoryCrud(db=db, user_id=user_id)
            category = crud.fetch_category_content(category_id)

            return CategoryDetailOut(
                id=category.id,
                name=category.name,
                documents=category.documents,
                quizzes=category.quizzes,
            )

    except HTTPException:
        raise

    except Exception as e:
        print("Error fetching category details:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch category details.")


@router.post("/categories/", response_model=CategoryOut, tags=["categories"])
def insert_category(data: CategoryForm, user_id: int = Depends(get_user_id)):
    try:
        with SessionLocal() as db:
            category_crud = CategoryCrud(db=db, user_id=user_id)
            category = category_crud.insert_new_category(data)
            return CategoryOut(id=category.id, name=category.name)

    except HTTPException:
        raise

    except Exception as e:
        print("Error inserting category:", e)
        raise HTTPException(status_code=500, detail="Failed to insert category.")


@router.delete(
    "/categories/{category_id}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["categories"],
)
def delete_category(category_id: int, user_id: int = Depends(get_user_id)):
    try:
        with SessionLocal() as db:
            category_crud = CategoryCrud(db=db, user_id=user_id)
            category_crud.delete_category_by_id(category_id)
            return Response(status_code=status.HTTP_204_NO_CONTENT)

    except HTTPException:
        raise

    except Exception as e:
        print(f"Error deleting category: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete category.")
