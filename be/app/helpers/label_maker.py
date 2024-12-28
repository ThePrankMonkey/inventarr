from typing import Literal

from PIL import Image, ImageFont, ImageDraw
import segno


def make_label(
    entry_type: Literal["chest", "pocket"],
    entry_id: int,
    width: float,
    height: float,
    message: str,
):
    pass
    qr_data = f"{entry_type}/{entry_id}"
    qrcode = segno.make(qr_data)
    img = qrcode.to_pil()
    return img
