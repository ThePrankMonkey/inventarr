import pytest


def test_read_pocket_not_found(client):
    response = client.get("/pockets/100")
    assert response.status_code == 404
    assert response.json() == {"detail": "Pocket not found"}


def test_create_pocket(client):
    payload = {
        "name": "TestPocket",
        "location": "Oz",
        "label_width": 2,
        "label_height": 1,
        "chest_id": 1,
        "room_id": 1,
    }
    response = client.post("/pockets", json=payload)
    assert response.status_code == 201


def test_read_pocket(client, test_data):
    data = test_data
    response = client.get("/pockets/1")
    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "name": data["pocket"].name,
        "location": data["pocket"].location,
        "label_width": data["pocket"].label_width,
        "label_height": data["pocket"].label_height,
        "chest_id": data["pocket"].chest_id,
        "room_id": data["pocket"].room_id,
    }
