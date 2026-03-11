from io import BytesIO
from typing import Optional

import cv2
import numpy as np
from PIL import Image


def decode_qr_from_image(image_bytes: bytes) -> Optional[str]:
    """
    Decode a QR code from raw image bytes using OpenCV's QRCodeDetector.
    Returns the decoded string, or None if nothing is detected.
    """
    try:
        pil_image = Image.open(BytesIO(image_bytes)).convert("RGB")
    except Exception:
        return None

    image_array = np.array(pil_image)
    if image_array.ndim == 3:
        image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)

    try:
        detector = cv2.QRCodeDetector()
        data, _, _ = detector.detectAndDecode(image_array)
    except Exception:
        return None

    if data:
        return data

    return None