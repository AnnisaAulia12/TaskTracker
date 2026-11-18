
# Import library
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status
)

from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.dependencies import get_current_user

from app import models, schemas

from app.database import get_db

from app.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)



@router.post(
    "/register",
    response_model=schemas.UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    user_data: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(models.User).filter(
        models.User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    hashed_password = hash_password(user_data.password)

    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user



@router.post(
    "/login",
    response_model=schemas.Token
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = db.query(models.User).filter(
        models.User.email == form_data.username
    ).first()

    if user is None or not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    access_token = create_access_token(
        data={"sub": str(user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get(
    "/me",
    response_model=schemas.UserResponse
)
def read_current_user(
    current_user: models.User = Depends(get_current_user)
):
    return current_user

@router.delete(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_current_user(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        db.query(models.Task).filter(
            models.Task.user_id == current_user.id
        ).delete(synchronize_session=False)

        db.delete(current_user)

        db.commit()

    except SQLAlchemyError:

        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete account."
        )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )
