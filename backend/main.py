import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from backend.ai_models.text_classifier import get_text_scam_risk
from backend.utils.phishing import analyze_url_risk
from backend.utils.ocr import extract_text_from_image
from backend.utils.qr_decoder import decode_qr_from_image


class MessageRequest(BaseModel):
    message: str


class LinkRequest(BaseModel):
    url: str


class ScanResponse(BaseModel):
    risk_score: int
    scam_type: str
    explanation: str


app = FastAPI(title="AI Scam Shield", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def clamp_score(score: float) -> int:
    return max(0, min(100, int(round(score))))


@app.post("/scan-message", response_model=ScanResponse)
async def scan_message(payload: MessageRequest):
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    risk_prob, label, explanation = get_text_scam_risk(payload.message)
    risk_score = clamp_score(risk_prob * 100)

    return ScanResponse(
        risk_score=risk_score,
        scam_type=label,
        explanation=explanation,
    )


@app.post("/scan-link", response_model=ScanResponse)
async def scan_link(payload: LinkRequest):
    if not payload.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty.")

    result = analyze_url_risk(payload.url)
    risk_score = clamp_score(result.risk_score)
    scam_type = "phishing" if risk_score >= 50 else "safe"

    return ScanResponse(
        risk_score=risk_score,
        scam_type=scam_type,
        explanation=result.explanation,
    )


@app.post("/scan-image", response_model=ScanResponse)
async def scan_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    content = await file.read()
    text = extract_text_from_image(content)

    if not text.strip():
        return ScanResponse(
            risk_score=0,
            scam_type="unknown",
            explanation="No readable text detected in the image.",
        )

    risk_prob, label, explanation = get_text_scam_risk(text)
    risk_score = clamp_score(risk_prob * 100)

    return ScanResponse(
        risk_score=risk_score,
        scam_type=label,
        explanation=f"Extracted text: {text[:200]}... | Analysis: {explanation}",
    )


@app.post("/scan-qr", response_model=ScanResponse)
async def scan_qr(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    content = await file.read()
    decoded_text = decode_qr_from_image(content)

    if not decoded_text:
        return ScanResponse(
            risk_score=0,
            scam_type="unknown",
            explanation="No QR code detected in the image.",
        )

    # If the QR decodes to a URL, run phishing analysis; otherwise run text classifier
    if decoded_text.lower().startswith(("http://", "https://")):
        result = analyze_url_risk(decoded_text)
        risk_score = clamp_score(result.risk_score)
        scam_type = "phishing" if risk_score >= 50 else "safe"
        explanation = (
            f"QR decoded to URL: {decoded_text} | {result.explanation}"
        )
    else:
        risk_prob, label, text_explanation = get_text_scam_risk(decoded_text)
        risk_score = clamp_score(risk_prob * 100)
        scam_type = label
        explanation = (
            f"QR decoded to text: {decoded_text[:200]}... | {text_explanation}"
        )

    return ScanResponse(
        risk_score=risk_score,
        scam_type=scam_type,
        explanation=explanation,
    )


@app.get("/health")
async def health():
    return {"status": "ok"}

