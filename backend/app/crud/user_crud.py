from app.authentication.password_utils import hash_password, verify_password
from app.authentication.token_utils import create_access_token
from app.models.db_models import Category, User
from app.schemas.user_schema import (
    LoginResponse,
    UserSignup,
    serializeAttempts,
    serializeCategories,
    serializeDocuments,
    serializeQuizzes,
    serializeUser,
)
from app.utils.string_utils import normalize_email
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from sqlalchemy.orm import Session, selectinload


class UserCrud:
    def __init__(self, db: Session):
        self.__db = db

    def create_user(self, user: UserSignup):
        user_in_db = self.__db.query(User).filter(User.email == user.email).first()
        if user_in_db:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        email = normalize_email(user.email)
        hashed_pwd = hash_password(user.password)
        new_user = User(name=user.name, email=email, hashed_password=hashed_pwd)

        self.__db.add(new_user)
        self.__db.commit()
        self.__db.refresh(new_user)
        return new_user

    def login_user(self, form_data: OAuth2PasswordRequestForm):
        user_in_db = (
            self.__db.query(User).filter(User.email == form_data.username).first()
        )
        if not user_in_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Email not found"
            )

        if not verify_password(form_data.password, user_in_db.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect password"
            )

        access_token = create_access_token(user_in_db.id)
        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user_id=user_in_db.id,
        )

    def get_user_with_categories_and_documents(self, user_id: int):
        result = self.__db.execute(
            select(User)
            .options(
                selectinload(User.categories).selectinload(Category.documents),
                selectinload(User.categories).selectinload(Category.quizzes),
            )
            .filter(User.id == user_id)
        )
        return result.scalars().first()

    def fetch_user_details(self, user_id: int):
        try:
            user = self.get_user_with_categories_and_documents(user_id)

            if not user:
                return {
                    "user": {},
                    "categories": [],
                    "documents": [],
                    "quizzes": [],
                }

            return {
                "user": serializeUser(user),
                "categories": serializeCategories(user.categories),
                "documents": serializeDocuments(user.categories),
                "quizzes": serializeQuizzes(user.categories),
                "attempts": serializeAttempts(user.categories),
            }

        except SQLAlchemyError as e:
            print("SQLAlchemy error fetching user details:", e)
            raise

        except Exception as e:
            print("Unexpected error fetching user details:", e)
            raise
