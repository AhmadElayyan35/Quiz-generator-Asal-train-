from app.authentication.token_utils import get_user_id
from app.crud.quiz_crud import QuizCrud
from app.database.connection_database import SessionLocal
from app.schemas.question_schema import QuestionRegen, QuestionSchema, QuizGenerateOut
from app.schemas.quiz_schema import (
    QuizDetailOut,
    QuizForm,
    QuizOut,
    QuizSaveIn,
)
from app.utils.quiz_utils import begin_quiz, change_question, create_quiz
from fastapi import APIRouter, Depends, HTTPException, Response, status

router = APIRouter()


@router.get(
    "/categories/{category_id}/quizzes",
    response_model=list[QuizOut],
    tags=["quizzes"],
)
def get_quizzes_by_category(category_id: int, user_id: int = Depends(get_user_id)):
    try:
        with SessionLocal() as db:
            quiz_crud = QuizCrud(db=db, user_id=user_id)
            quizzes = quiz_crud.get_quizzes_by_category_id(category_id)

        return [
            QuizOut(
                id=quiz.id,
                name=quiz.name,
                level=quiz.level,
                path=quiz.path,
                category_id=quiz.category_id,
                created_at=quiz.created_at,
            )
            for quiz in quizzes
        ]

    except Exception as e:
        print("Error fetching quizzes by category:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch quizzes.")


@router.get(
    "/categories/{category_id}/quizzes/{quiz_id}",
    response_model=QuizDetailOut,
    tags=["quizzes"],
)
def get_quiz_by_id(quiz_id: int, user_id: int = Depends(get_user_id)):
    try:
        with SessionLocal() as db:
            quiz_crud = QuizCrud(db=db, user_id=user_id)
            quiz = quiz_crud.get_quiz_with_questions(quiz_id, user_id)
            if not quiz:
                raise HTTPException(status_code=404, detail="Quiz not found.")
            return quiz

    except Exception as e:
        print("Error fetching quiz by ID:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch quiz.")


@router.post(
    "/categories/{category_id}/quizzes/generate",
    response_model=QuizGenerateOut,
    status_code=200,
    tags=["quizzes"],
)
def generate_quiz(
    category_id: int, data: QuizForm, user_id: int = Depends(get_user_id)
):
    try:
        with SessionLocal() as db:
            crud = QuizCrud(db=db, user_id=user_id)
            category = crud.get_category(category_id)
            return create_quiz(category, data)
    except Exception as e:
        print("Error generating quiz:", e)
        raise HTTPException(status_code=500, detail="Failed to generate quiz.")


@router.post(
    "/categories/{category_id}/quizzes",
    response_model=QuizDetailOut,
    status_code=status.HTTP_201_CREATED,
    tags=["quizzes"],
)
def save_quiz(category_id: int, data: QuizSaveIn, user_id: int = Depends(get_user_id)):
    try:
        with SessionLocal() as db:
            crud = QuizCrud(db=db, user_id=user_id)
            return crud.save_quiz(category_id, data)
    except Exception as e:
        print("Error saving quiz:", e)
        raise HTTPException(status_code=500, detail="Failed to save quiz.")


@router.post(
    "/quizzes/questions/regenerate",
    response_model=QuestionSchema,
    status_code=status.HTTP_200_OK,
    tags=["quizzes"],
)
def regenerate_question(data: QuestionRegen):
    try:
        return change_question(data)

    except HTTPException:
        raise

    except Exception as e:
        print("Error regenerating question:", e)
        raise HTTPException(status_code=500, detail="Failed to regenerate question.")


@router.post(
    "/quizzes/start",
    status_code=status.HTTP_200_OK,
    tags=["quizzes"],
)
def start_quiz(indexName: str):
    try:
        return begin_quiz(indexName)

    except HTTPException:
        raise

    except Exception as e:
        print("Error starting quiz:", e)
        raise HTTPException(status_code=500, detail="Failed to start quiz.")


@router.delete(
    "/quizzes/{quiz_id}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["quizzes"],
)
def delete_quiz(quiz_id: int, user_id: int = Depends(get_user_id)):
    try:
        with SessionLocal() as db:
            quiz_crud = QuizCrud(db=db, user_id=user_id)
            quiz_crud.delete_quiz_by_id(quiz_id)
            return Response(status_code=status.HTTP_204_NO_CONTENT)

    except Exception as e:
        print("Error deleting quiz:", e)
        raise HTTPException(status_code=500, detail="Failed to delete quiz.")
