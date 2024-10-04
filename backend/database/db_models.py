from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)
    cs_background = Column(String, nullable=False)
    study_level = Column(String, nullable=True)
    experience = Column(String, nullable=True)
    tasks = relationship("Task", back_populates="user")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    threshold = Column(Float, nullable=False)
    table_names = Column(String, nullable=False)
    status = Column(String, default='pending')
    num_microtasks = Column(Integer, nullable=True, default=None)

    user = relationship("User", back_populates="tasks")
    microtasks = relationship("MicroTask", back_populates="task")


class MicroTask(Base):
    __tablename__ = 'microtasks'

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey('tasks.id'))
    table_1 = Column(String)
    table_2 = Column(String)
    column_1 = Column(String)
    column_2 = Column(String)
    rows_1 = Column(Text)
    rows_2 = Column(Text)
    users_ids = Column(String, default="")
    yes_count = Column(Integer, default=0)
    no_count = Column(Integer, default=0)

    task = relationship("Task", back_populates="microtasks")
