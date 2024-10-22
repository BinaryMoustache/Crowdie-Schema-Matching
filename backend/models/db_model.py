from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Float,
    Boolean,
    Text,
    func,
)
from sqlalchemy.orm import relationship
from dependencies import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)
    cs_background = Column(Boolean, nullable=False)
    study_level = Column(String, nullable=True)
    experience = Column(String, nullable=True)

    tasks = relationship("Task", back_populates="user")
    answers = relationship("MicroTaskAnswers", back_populates="user")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    threshold = Column(Float, nullable=False)
    status = Column(String, default="pending", nullable=False)
    num_of_tables = Column(String, nullable=False)
    num_microtasks = Column(Integer, default=0, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    is_experience_required = Column(Boolean, default=False, nullable=False)

    tables = relationship(
        "TaskTable", back_populates="task", cascade="all, delete-orphan"
    )
    user = relationship("User", back_populates="tasks")
    microtasks = relationship(
        "MicroTask", back_populates="task", cascade="all, delete-orphan"
    )


class TaskTable(Base):
    __tablename__ = "task_tables"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=False)
    table_name = Column(String, nullable=False)
    num_of_columns = Column(Integer, nullable=True)

    task = relationship("Task", back_populates="tables")


class MicroTask(Base):
    __tablename__ = "microtasks"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    table_1 = Column(String)
    table_2 = Column(String)
    column_1 = Column(String)
    column_2 = Column(String)
    rows_1 = Column(Text)
    rows_2 = Column(Text)
    required_answers = Column(Integer, default=3, nullable=False)
    yes_count = Column(Integer, default=0, nullable=False)
    no_count = Column(Integer, default=0, nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)

    task = relationship("Task", back_populates="microtasks")
    answers = relationship(
        "MicroTaskAnswers", back_populates="microtask", cascade="all, delete-orphan"
    )


class MicroTaskAnswers(Base):
    __tablename__ = "microtask_answers"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    microtask_id = Column(Integer, ForeignKey("microtasks.id"), primary_key=True)
    answer = Column(String, nullable=True)
    time_taken = Column(Float, nullable=True)

    user = relationship("User", back_populates="answers")
    microtask = relationship("MicroTask", back_populates="answers")
