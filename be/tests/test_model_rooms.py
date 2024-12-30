import pytest


def test_read_room_not_found(client):
    response = client.get("/rooms/100")
    assert response.status_code == 404
    assert response.json() == {"detail": "Room not found"}


def test_create_room(client):
    payload = {
        "name": "TestRoom",
        "location": "Narnia",
    }
    response = client.post("/rooms", json=payload)
    assert response.status_code == 201


def test_read_room(client):
    response = client.get("/rooms/1")
    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "name": "TestRoom",
        "location": "Narnia",
    }
