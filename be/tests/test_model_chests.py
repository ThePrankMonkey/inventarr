import pytest


def test_read_chest_not_found(client):
    response = client.get("/chests/100")
    assert response.status_code == 404
    assert response.json() == {"detail": "Chest not found"}


def test_create_chest(client):
    payload = {
        "name": "TestChest",
        "label_width": 2,
        "label_height": 1,
        "room_id": 1,
    }
    response = client.post("/chests", json=payload)
    assert response.status_code == 201


def test_read_chest(client):
    response = client.get("/chests/1")
    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "name": "TestChest",
        "label_width": 2,
        "label_height": 1,
        "room_id": 1,
    }
