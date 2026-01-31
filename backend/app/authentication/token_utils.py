import datetime

from app.config import KeyVault
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

SECRET_KEY = KeyVault.SECRET_KEY
ALGORITHM = KeyVault.ALGORITHM
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def create_access_token(user_id: int):
    try:
        print(f"Generating token for user_id: {user_id}")
        payload = {
            "sub": str(user_id),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2),
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

        if isinstance(token, bytes):
            token = token.decode("utf-8")

        return token
    except Exception as e:
        print(f"Error during token creation: {e}")
        raise


def get_user_id(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return user_id

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
