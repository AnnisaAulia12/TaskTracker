#mengatur validasi data , pokoknya data yang dikirim dr API di validasi dl disini
#bedanya model py dengan schemas apa ???
#model py : dia yang membuat struktur tabel , tipe data
# kalau schemas py : yang ngatur data API dan validasi input output , response dan request.

from datetime import date, datetime
from pydantic import ConfigDict
from typing import Literal #ini buat batasin nilai variable
from pydantic import model_validator

from pydantic import(
    BaseModel, 
    EmailStr, 
    Field,  #ini buat batasan data , jadi setiap data ada batasan min and max
    field_validator
)

#USER , buat register , aku mau ada login register.
class UserCreate(BaseModel):
    name : str = Field(min_length = 4, max_length = 50)
    email : EmailStr
    password : str = Field(min_length = 6, max_length = 20)

    #ini validasi tambahan 
    @field_validator("name", mode = "before")
    @classmethod
    #ini validasi nunjuk ke kelas cls = class UserCreate dengan value nya nama
    def validate_name(cls, value):
        #ini buat ngecek , misalkaan ada spasi , nah kalau spasi nya di hapus , apahkah ada value nya atau null ?
        if isinstance(value, str):
            value = value.strip()
            if not value:
                raise ValueError("Name cannot be empty")
        return value

#ini user pas mau login
class UserLogin(BaseModel):
    email :EmailStr
    password : str = Field(min_length = 6, max_length = 20)

#user respons , nentuin data yang dibalikin dari be ke fe
class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes = True)

    #ga nge balikin password ke fe nya , jadi cuma ngebalikin id user , nama dan gmail.
    id: int
    name : str
    email : EmailStr
    created_at : datetime


#sekarang kita ke auth , jadi ini kaya token kalau penguna udh berhasil login
#json buat JWT terus ngirim ke fe nya
class Token(BaseModel):
    access_token : str
    token_type: str = "bearer"

TaskStatus = Literal["Todo", "In Progress", "Done"]

TaskPriority = Literal["High", "Medium", "Low"]

class TaskCreate(BaseModel):
    title : str = Field(min_length= 5, max_length= 100)
    description : str | None = None
    status : TaskStatus
    priority : TaskPriority
    deadline : date

    @field_validator("title", mode = "before")
    @classmethod
    def validate_title(cls, value):
        if isinstance(value, str):
            value = value.strip()
            if not value:
                raise ValueError("Title Cannot be empty")
        return value

class TaskUpdate(BaseModel):
    title : str | None = Field(
        default = None,
        min_length= 5,
        max_length= 100
    )

    description : str | None = None
    status : TaskStatus | None = None
    priority: TaskPriority | None = None
    deadline : date | None = None

    @field_validator("title", mode="before")
    @classmethod
    def validate_title(cls, value):
        if isinstance(value, str):
            value = value.strip()

            if not value:
                raise ValueError("Title cannot be empty")

        return value

    @model_validator(mode="after")
    def validate_update(self):
        if not self.model_fields_set:
            raise ValueError("At least one field must be updated")

        for field in ("title", "status", "deadline", "priority"):
            if field in self.model_fields_set and getattr(self, field) is None:
                raise ValueError(f"{field} cannot be empty")

        return self

class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes= True)

    id : int
    title : str
    description : str | None
    status : TaskStatus
    priority: TaskPriority
    deadline : date
    created_at : datetime

