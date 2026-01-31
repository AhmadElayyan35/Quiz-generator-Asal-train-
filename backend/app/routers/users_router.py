from app.authentication.token_utils import get_user_id
from app.crud.user_crud import UserCrud
from app.database.connection_database import SessionLocal
from app.schemas.user_schema import (
    LoginResponse,
    SignupResponse,
    UserDetailsResponse,
    UserSignup,
)
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()


@router.post(
    "/signup",
    response_model=SignupResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["users"],
)
def signup(user: UserSignup):
    try:
        with SessionLocal() as db:
            user_crud = UserCrud(db=db)
            new_user = user_crud.create_user(user)

            return SignupResponse(
                id=new_user.id,
                name=new_user.name,
                email=new_user.email,
                created_at=new_user.created_at,
            )

    except HTTPException:
        raise

    except Exception as e:
        print("Error signing up user:", e)
        raise HTTPException(status_code=500, detail="Failed to create user")


@router.post("/login", response_model=LoginResponse, tags=["users"])
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        with SessionLocal() as db:
            user_crud = UserCrud(db=db)
            login_data = user_crud.login_user(form_data)
            return login_data

    except HTTPException:
        raise

    except Exception as e:
        print("Error logging in user:", e)
        raise HTTPException(status_code=500, detail="Login failed")


@router.get("/user/details", response_model=UserDetailsResponse, tags=["users"])
def get_user_details(user_id: int = Depends(get_user_id)):
    try:
        with SessionLocal() as db:
            user_crud = UserCrud(db=db)
            user_details = user_crud.fetch_user_details(user_id)

            if not user_details["user"]:
                raise HTTPException(status_code=404, detail="User not found.")

            return user_details

    except Exception as e:
        print("Error fetching user details:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch user details.")
