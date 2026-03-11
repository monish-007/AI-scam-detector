from functools import lru_cache
from typing import Tuple

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline


SCAM_LABEL = "scam"
SAFE_LABEL = "safe"


def _build_training_data():
    texts = [
        "Congratulations, you have won a free iPhone! Click here to claim your prize now.",
        "Your account has been locked. Verify your identity immediately by logging in here.",
        "Urgent: Your bank transfer is on hold. Confirm your details in this secure link.",
        "You have an unclaimed lottery reward, respond with your full name and address.",
        "We detected suspicious login attempts. Update your password using this link.",
        "Final notice: pending tax refund, submit your personal information today.",
        "Hi, are we still on for the meeting tomorrow?",
        "Please find attached the report from last week.",
        "Let me know if you have any questions about the project.",
        "Thank you for your payment, your order has been processed.",
        "Lunch at 1pm today?",
        "Your package has been shipped and will arrive tomorrow.",
    ]
    labels = [
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
    ]
    return texts, labels


@lru_cache(maxsize=1)
def get_model() -> Pipeline:
    texts, labels = _build_training_data()
    pipeline = Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    ngram_range=(1, 2),
                    stop_words="english",
                    max_features=5000,
                ),
            ),
            (
                "clf",
                LogisticRegression(
                    max_iter=1000,
                    class_weight="balanced",
                ),
            ),
        ]
    )
    pipeline.fit(texts, labels)
    return pipeline


def get_text_scam_risk(text: str) -> Tuple[float, str, str]:
    """
    Returns (risk_probability, label, explanation).
    risk_probability: probability that the text is a scam (0.0 - 1.0)
    """
    model = get_model()
    proba = model.predict_proba([text])[0]
    scam_prob = float(proba[1])
    label = SCAM_LABEL if scam_prob >= 0.5 else SAFE_LABEL

    explanation_parts = []

    lowered = text.lower()
    red_flags = [
        "click here",
        "free iphone",
        "urgent",
        "verify your identity",
        "unclaimed lottery",
        "tax refund",
        "confirm your details",
        "suspicious login",
    ]
    matched_flags = [w for w in red_flags if w in lowered]

    if matched_flags:
        explanation_parts.append(
            f"Detected common scam phrases: {', '.join(matched_flags)}."
        )

    explanation_parts.append(
        f"Statistical model scam probability: {scam_prob:.2f}."
    )

    if label == SCAM_LABEL:
        explanation_parts.append(
            "Overall, this message is likely a scam. Be cautious before clicking links or sharing information."
        )
    else:
        explanation_parts.append(
            "Overall, this message appears typical and not strongly indicative of a scam, but always verify the sender."
        )

    explanation = " ".join(explanation_parts)

    return scam_prob, label, explanation

