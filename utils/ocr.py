from io import BytesIO
from typing import List

import easyocr
from PIL import Image
from functools import lru_cache


@lru_cache(maxsize=1)
def _get_reader():
    # English by default; extend as needed
    return easyocr.Reader(["en"], gpu=False)


def extract_text_from_image(image_bytes: bytes) -> str:
    try:
        Image.open(BytesIO(image_bytes)).convert("RGB")
    except Exception:
        return ""

    reader = _get_reader()
    try:
        results: List = reader.readtext(image_bytes)
    except Exception:
        return ""

    texts = [res[1] for res in results if len(res) >= 2]
    return " ".join(texts)

