from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine
from typing import Annotated

from app.config import settings


sqlite_url = settings.database_url

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def dump_db_and_tables():
    SQLModel.metadata.drop_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
