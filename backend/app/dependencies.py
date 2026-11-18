#kan udh buat security , tdi itu buat jwt sama meriksa jwt
#nah ini buat ngeliat  user yang maana yang mau login
#misalkaan user A berhasil login dpt jwt tuh , terus user A mau liat task dia
# terus fe ngirim jwt ke backend, trs nah depedencies ini yang meriksa jwt nya 

# Import library
import jwt

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer #ambil jwt dr request user
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.security import decode_access_token #meriksa dan baca jwt

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)

def get_current_user(
    token: str = Depends(oauth2_scheme), #butuh token jwt yang dikirim user
    db: Session = Depends(get_db) #ini butuh session db buat nyari data user di db nya
):
        #error kalau misakaan token ga valid
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = decode_access_token(token)

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        user_id = int(user_id)

    except (jwt.InvalidTokenError, ValueError):
        raise credentials_exception

    #nyari user di db
    user = db.get(models.User, user_id)

    if user is None:
        raise credentials_exception

    return user