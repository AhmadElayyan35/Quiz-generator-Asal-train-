from app.authentication.token_utils import get_user_id
from app.crud.quiz_attempt_crud import QuizAttemptCrud
from app.database.connection_database import SessionLocal
from app.models.db_models import User
from app.schemas.quiz_attempt_schema import (
    AttemptCreateRequest,
    QuizAttemptDetailOut,
    QuizAttemptOut,
)
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()


@router.get(
    "/attempts",
    response_model=list[QuizAttemptOut],
    tags=["quiz_attempts"],
    summary="Get all attempts of specifc category made by the current user",
)
def get_user_attempts(category_id: int, user_id: int = Depends(get_user_id)):
    try:
        with SessionLocal() as db:
            crud = QuizAttemptCrud(db)
            return crud.get_user_attempts(user_id, category_id)
    except Exception as e:
        print("Error retrieving attempts:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch attempts.")


@router.get(
    "/attempts/{attempt_id}",
    response_model=QuizAttemptDetailOut,
    tags=["quiz_attempts"],
    summary="Get detailed view of a specific attempt",
)
def get_attempt_detail(attempt_id: int, user_id: int = Depends(get_user_id)):
    try:
        with SessionLocal() as db:
            crud = QuizAttemptCrud(db)
            return crud.get_attempt_details(attempt_id, user_id)
    except HTTPException:
        raise
    except Exception as e:
        print("Error retrieving attempt detail:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch attempt detail.")


@router.post("/attempts", response_model=QuizAttemptOut, tags=["quiz_attempts"])
def submit_quiz_attempt(
    payload: AttemptCreateRequest,
    user_id: int = Depends(get_user_id),
):
    try:
        with SessionLocal() as db:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            crud = QuizAttemptCrud(db)
            return crud.create_attempt(payload.answers, user.name, payload.category_id)

    except Exception as e:
        print("Error submitting attempt:", e)
        raise HTTPException(status_code=500, detail="Failed to submit attempt.")


@router.delete(
    "/attempts/{attempt_id}",
    tags=["quiz_attempts"],
    summary="Delete a specific attempt",
)
def delete_attempt(attempt_id: int, user_id: int = Depends(get_user_id)):
    try:
        with SessionLocal() as db:
            crud = QuizAttemptCrud(db)
            crud.delete_attempt(attempt_id, user_id)
            return {"message": "Attempt deleted successfully."}
    except HTTPException:
        raise
    except Exception as e:
        print("Error deleting attempt:", e)
        raise HTTPException(status_code=500, detail="Failed to delete attempt.")
