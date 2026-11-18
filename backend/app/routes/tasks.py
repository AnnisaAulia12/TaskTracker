#buat get post put delete , CRUD nya 
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import case

from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user


#buat router buat setiap task dl
# Router untuk Task
router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"] #ngelompokin end point task
)

#end point GET , ngambil daftar task dr db nya dan nampilih milik user
#alamat endpointnya GET/tasks

@router.get(
        #nandain kalau end point pakai get , makanya router get
    "",
    response_model=list[schemas.TaskResponse]
)
def get_tasks(
    db: Session = Depends(get_db),
 
    current_user: models.User = Depends(get_current_user) #buat info user yang lagi login
):

    tasks = db.query(models.Task).filter(
        models.Task.user_id == current_user.id
    ).order_by(
        models.Task.deadline.asc(),
        case(
            (models.Task.priority == "High", 1),
            (models.Task.priority == "Medium", 2),
            (models.Task.priority == "Low", 3),
            else_= 4,
        )
    ).all()

    return tasks

@router.post(
    "",
    response_model=schemas.TaskResponse,
    status_code=status.HTTP_201_CREATED
)
def create_task(
    task_data: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    
    new_task = models.Task(
        user_id=current_user.id,
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
        deadline=task_data.deadline
    )

    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

@router.put(
    "/{task_id}",
    response_model=schemas.TaskResponse
)
def update_task(
    task_id: int,
    task_data: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
   
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.user_id == current_user.id
    ).first()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    update_data = task_data.model_dump(exclude_unset=True)


    for key, value in update_data.items():
        setattr(task, key, value)


    db.commit()
    db.refresh(task)

    return task

@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.user_id == current_user.id
    ).first()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )


    db.delete(task)
    db.commit()

    return None