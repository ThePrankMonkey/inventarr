"""
docker compose exec be poetry run app/load_test_data.py
"""

from sqlmodel import Session
from app.db import engine
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
        chest_1 = add_and_commit(Chest(name="Component Box 1", room_id=room_1.id))
        pocket_1 = add_and_commit(Pocket(name="Drawer A1", location="A1", room_id=room_1.id, chest_id=chest_1.id))
        item_1 = add_and_commit(Item(name="WaveShare 2.7in EPaper Display", item_type="component", quantity=1, unit="unit", room_id=room_1.id, chest_id=chest_1.id, pocket_id=pocket_1.id))
        room_2 = add_and_commit(Room(name="Kitchen", location="Kitchen Room"))
        chest_2 = add_and_commit(Chest(name="Pantry", room_id=room_2.id))
        pocket_2 = add_and_commit(Pocket(name="Shelf 1", location="Shelf 1", room_id=room_2.id, chest_id=chest_2.id))
        item_2 = add_and_commit(Item(name="All Purpose Flour", item_type="ingredient", quantity=60, unit="cup", room_id=room_2.id, chest_id=chest_2.id, pocket_id=pocket_2.id))


if __name__ == "__main__":
    pass
    create_demo_data()