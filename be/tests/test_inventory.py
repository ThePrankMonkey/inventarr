import pytest
from fastapi import HTTPException
from sqlmodel import Session

from app.inventory.route import check_inventory, InventoryScan
from app.models.chest.model import ChestScan
from app.models.pocket.model import PocketScan


def test_check_inventory_chest(session: Session, test_data):
    scan = InventoryScan(scan='{"type": "chest", "id": 1}')
    response = check_inventory(scan, session)
    assert isinstance(response, ChestScan)
    assert response.id == 1
    assert response.name == "Test Chest"


def test_check_inventory_pocket(session: Session, test_data):
    scan = InventoryScan(scan='{"type": "pocket", "id": 1}')
    response = check_inventory(scan, session)
    assert isinstance(response, PocketScan)
    assert response.id == 1
    assert response.name == "Test Pocket"


def test_check_inventory_invalid_type(session: Session):
    scan = InventoryScan(scan='{"type": "invalid", "id": 3}')
    with pytest.raises(HTTPException) as excinfo:
        check_inventory(scan, session)
    assert excinfo.value.status_code == 400
    assert "Entry Type [invalid] not permitted" in excinfo.value.detail


def test_check_inventory_not_found(session: Session):
    scan = InventoryScan(scan='{"type": "chest", "id": 999}')
    with pytest.raises(HTTPException) as excinfo:
        check_inventory(scan, session)
    assert excinfo.value.status_code == 404
    assert "chest 999 not found" in excinfo.value.detail


def test_check_inventory_invalid_json(session: Session):
    scan = InventoryScan(scan="invalid json")
    with pytest.raises(HTTPException) as excinfo:
        check_inventory(scan, session)
    assert excinfo.value.status_code == 400
    assert "Invalid JSON data" in excinfo.value.detail


def test_check_inventory_missing_type(session: Session, test_data):
    scan = InventoryScan(scan='{"id": 1}')  # Missing "type"
    with pytest.raises(KeyError):  # Expect a KeyError
        check_inventory(scan, session)


def test_check_inventory_missing_id(session: Session, test_data):
    scan = InventoryScan(scan='{"type": "chest"}')  # Missing "id"
    with pytest.raises(KeyError):  # Expect a KeyError
        check_inventory(scan, session)
