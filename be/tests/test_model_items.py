import pytest


def test_read_item_not_found(client):
    response = client.get("/items/100")
    assert response.status_code == 404
    assert response.json() == {"detail": "Item not found"}


def test_create_item(client):
    payload = {
        "name": "TestItem",
        "item_type": "component",
        "quantity": 5,
        "unit": "unit",
        "pocket_id": 1,
        "chest_id": 1,
        "room_id": 1,
        "upc": "unit",
        "image_file": "/no/where.jpeg",
        "thumb_file": "/no/where-thumb.jpeg",
        "notes": "yadda yadda",
    }
    response = client.post("/items", json=payload)
    assert response.status_code == 201


def test_read_item(client):
    response = client.get("/items/1")
    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "name": "TestItem",
        "item_type": "component",
        "quantity": 5,
        "unit": "unit",
        "pocket_id": 1,
        "chest_id": 1,
        "room_id": 1,
        "upc": "unit",
        "image_file": "/no/where.jpeg",
        "thumb_file": "/no/where-thumb.jpeg",
        "notes": "yadda yadda",
    }
