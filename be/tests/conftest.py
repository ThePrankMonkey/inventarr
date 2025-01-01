import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

import sys

sys.path.append(".")

from app.main import app
from app.db import get_session
from app.models.room.model import Room
from app.models.chest.model import Chest
from app.models.pocket.model import Pocket
from app.models.item.model import Item


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="test_data")
def test_data_fixture(session: Session):
    """Create test data."""
    room1 = Room(
        name="Test Room",
        location="Malkier",
    )
    chest1 = Chest(
        name="Test Chest",
        label_width=1.0,
        label_height=1.5,
        room_id=1,
    )
    pocket1 = Pocket(
        name="Test Pocket",
        location="top shelf",
        label_width=2.0,
        label_height=1.0,
        room_id=1,
        chest_id=1,
    )
    item1 = Item(
        name="TestItem",
        item_type="component",
        quantity=5,
        unit="unit",
        pocket_id=1,
        chest_id=1,
        room_id=1,
        upc="unit",
        image_file="/no/where.jpeg",
        thumb_file="/no/where-thumb.jpeg",
        notes="yadda yadda",
    )
    session.add(room1)
    session.add(chest1)
    session.add(pocket1)
    session.add(item1)
    session.commit()
    session.refresh(room1)
    session.refresh(chest1)
    session.refresh(pocket1)
    session.refresh(item1)
    return {
        "room": room1,
        "chest": chest1,
        "pocket": pocket1,
        "item": item1,
    }
