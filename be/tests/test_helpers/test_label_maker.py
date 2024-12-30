import pytest

from app.helpers.label_maker import generate_qr_data


def test_generate_qr_data():
    entry_type = "pocket"
    entry_id = 1
    real_qr_data = generate_qr_data(entry_type=entry_type, entry_id=entry_id)
    expected_qr_data = '{"type": "pocket", "id": 1}'
    assert real_qr_data == expected_qr_data
