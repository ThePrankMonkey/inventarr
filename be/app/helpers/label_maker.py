import logging
from tempfile import NamedTemporaryFile
from typing import Literal

from PIL import Image, ImageFont, ImageDraw
import segno

from app.config import settings

logger = logging.getLogger(__name__)


def make_label(
    entry_type: Literal["chest", "pocket"],
    entry_id: int,
    width: float,
    height: float,
    message: str,
) -> str:
    # create message portion
    logger.info("Create label message")
    width = min(width, settings.printer_max_label_width_inches)
    width_pixels = int(width * settings.printer_dpi)
    height_pixels = int(height * settings.printer_dpi)
    base_image = Image.new(
        "L",
        (width_pixels, height_pixels),
        color="white",
    )
    canvas = ImageDraw.Draw(base_image)
    logger.info(settings.label_font_path)
    font = ImageFont.truetype(settings.label_font_path, 36)
    canvas.text((0, 0), message, font=font, fill="black")
    # create QR portion
    logger.info("Create label qr")
    qr_data = f"{entry_type}/{entry_id}"
    qrcode = segno.make(qr_data)
    qr_image = qrcode.to_pil(scale=5)
    logger.info(f"QR is {qr_image.size}")
    # combine
    logger.info("Combine label parts")
    # top_left_offset = (0, 0)
    lower_right_offset = (
        base_image.size[0] - qr_image.size[0],
        base_image.size[1] - qr_image.size[1],
    )
    base_image.paste(qr_image, lower_right_offset)
    # write to temp file
    label_path = NamedTemporaryFile(suffix=".png", delete=False).name
    base_image.save(label_path, dpi=(settings.printer_dpi, settings.printer_dpi))
    return label_path
