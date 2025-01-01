"""
docker compose exec be poetry run app/helpers/load_test_data.py
"""

from sqlmodel import Session
from app.db import engine, create_db_and_tables, dump_db_and_tables
from app.models.pocket.model import Pocket
from app.models.chest.model import Chest
from app.models.room.model import Room
from app.models.item.model import Item


def add_and_commit(obj):
    with Session(engine) as session:
        session.add(obj)
        session.commit()
        session.refresh(obj)
        return obj


def create_demo_data():
    room_1 = add_and_commit(Room(name="Office", location="Office Room"))
    chest_1 = add_and_commit(
        Chest(
            name="Component Box 1",
            label_width=2.0,
            label_height=1.0,
            room_id=room_1.id,
        )
    )
    pocket_1 = add_and_commit(
        Pocket(
            name="Drawer A1",
            location="A1",
            room_id=room_1.id,
            chest_id=chest_1.id,
            label_width=1.0,
            label_height=1.0,
        )
    )
    item_1 = add_and_commit(
        Item(
            name="WaveShare 2.7in EPaper Display",
            item_type="component",
            quantity=1,
            unit="unit",
            room_id=room_1.id,
            chest_id=chest_1.id,
            pocket_id=pocket_1.id,
            image_file="/src/photos/8644da6e-f790-4d0b-b1b2-97bdab09d636.png",
            notes="link to drivers",
        )
    )
    room_2 = add_and_commit(Room(name="Kitchen", location="Kitchen Room"))
    chest_2 = add_and_commit(
        Chest(
            name="Pantry",
            label_width=2.0,
            label_height=1.0,
            room_id=room_2.id,
        )
    )
    pocket_2 = add_and_commit(
        Pocket(
            name="Shelf 1",
            location="Shelf 1",
            room_id=room_2.id,
            chest_id=chest_2.id,
            label_width=2.0,
            label_height=2.0,
        )
    )
    item_2 = add_and_commit(
        Item(
            name="All Purpose Flour",
            item_type="ingredient",
            quantity=60,
            unit="cup",
            room_id=room_2.id,
            chest_id=chest_2.id,
            pocket_id=pocket_2.id,
            image_file="/src/photos/8644da6e-f790-4d0b-b1b2-97bdab09d636.png",
            notes="Allergens: Gluten",
        )
    )


def reset_db(with_test_data: bool = False):
    dump_db_and_tables()
    create_db_and_tables()
    if with_test_data:
        create_demo_data()


if __name__ == "__main__":
    create_demo_data()
