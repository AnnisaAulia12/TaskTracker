#mengimport library nya 
from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    String,
    Text,
    func,
)

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


#kita ada dua tabel tabel user dan tabel task 
#jadi satu user bisa memiliki banyak task , jadi user 1 ga bisa ngelihat task dari user 2

class User(Base):
    __tablename__ = "users"

    #definisikan sebegai primary key
    #kolom id dengan tpe data orimary key , jdi tiap user id nya beda"
    id: Mapped[int] = mapped_column(
        primary_key = True,
        index = True
    )

    name : Mapped[str] = mapped_column(
        String(50),
        nullable= False
    )

    #setiap user juga memiliki email
    email: Mapped[str] = mapped_column(
        String(255),
        unique = True,
        index = True,
        nullable = False
    )

    #passoword , ini pake hashd , karena nanti yang ke simpan di db bukan pw aslinya
    #jdi pw aslinya tetap terjaga
    hashed_password : Mapped[str] = mapped_column(
        String(255),
        nullable = False
    )

    #mencatat waktu data nya dibut kapan
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone = True),
        server_default = func.now(),
        nullable = False
    )

    #ini yang nagtur relasi antara user dan task
    # satu user punya banyak task makanya dia pakai list[Task]
    tasks: Mapped[list[Task]] = relationship(
    
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True
    )

#ini sekarang tabel task nya 

class Task(Base):
    __tablename__ = "tasks"

    __table_args__ = (
        #aturan nya , jadi  tabel task punya aturan 3 kondisi
        # pertama pending , in progress dan selesai
        #jadi db hanya ngasih isizin status nya itu cuma 3 type / kondisi : pending , progres , selesai

        CheckConstraint(
            "status IN ('Todo', 'In Progress', 'Done')",
            name ="check_task_status"
        ),

        #tambahin di kategorikn soal yang susah medium atau low
        CheckConstraint(
            "priority IN ('High', 'Medium', 'Low')",
            name="check_task_priority"
        ),
    )

    #data di task ada apa aja 
    #ini id buat membedain setiap task 1 dengan task lain nya
    id: Mapped[int] = mapped_column(
        primary_key = True,
        index = True
    )

    #ini digunain buat ngasih tau user dengan id mana yang punya ini task
    user_id: Mapped[int] = mapped_column(
        #jadi kenapa pakai foreign key , kan ini hubungan one to many ya
        #jadi Foreign key untuk ngasih tau hubungan antara tabel
        #kenapa ini cuma pake ondelete ? kenapa ga on update ?
        # karena ini posisi nya kan satu user bisa banyak task , nah kondiisnya 
        # nah aku maunya kalau user di delate itu ya semua task nya ilang , tapi kalau misalkaan user update nama 
        # task ga perlu ikut update.
        ForeignKey("users.id", ondelete="CASCADE"),
        #setap task harus ada pemilik
        nullable = False,
        index = True
    )

    title : Mapped[str] = mapped_column(
        String(100),
        nullable = False
    )

    description: Mapped[str | None] = mapped_column(
       Text, 
       nullable = True 
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default = "Todo",
        nullable = False
    )

    priority: Mapped[str] = mapped_column(
        String(10),
        nullable=False
    )

    deadline: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationship with User
    # satu task itu hanya dimili satu user , makanya dia ga ada List
    user: Mapped[User] = relationship(
        back_populates="tasks"
    )