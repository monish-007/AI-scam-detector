from dataclasses import dataclass
from urllib.parse import urlparse


@dataclass
class UrlRiskResult:
    risk_score: float
    explanation: str


SUSPICIOUS_KEYWORDS = [
    "login",
    "verify",
    "update",
    "secure",
    "gift",
    "prize",
    "free",
    "bonus",
    "reward",
    "lottery",
]

KNOWN_TRUSTED_DOMAINS = [
    "google.com",
    "microsoft.com",
    "github.com",
    "paypal.com",
    "amazon.com",
]


def analyze_url_risk(url: str) -> UrlRiskResult:
    risk = 0.0
    explanations = []

    parsed = urlparse(url.strip())
    hostname = parsed.hostname or ""
    full_url = url.strip()

    if not parsed.scheme or not hostname:
        return UrlRiskResult(
            risk_score=80.0,
            explanation="URL appears malformed or missing scheme; this is a strong red flag.",
        )

    if parsed.scheme != "https":
        risk += 25
        explanations.append("URL is not using HTTPS.")

    labels = hostname.split(".")
    if len(labels) > 3:
        risk += 15
        explanations.append(
            "Domain has many subdomains, which is sometimes used to impersonate brands."
        )

    if "-" in hostname:
        risk += 10
        explanations.append("Domain contains hyphens, sometimes seen in phishing sites.")

    tld = labels[-1] if labels else ""
    suspicious_tlds = {"zip", "xyz", "top", "click", "info"}
    if tld in suspicious_tlds:
        risk += 15
        explanations.append(
            f"Top-level domain '.{tld}' is commonly abused in phishing campaigns."
        )

    for kw in SUSPICIOUS_KEYWORDS:
        if kw in full_url.lower():
            risk += 8
            explanations.append(f"URL contains suspicious keyword '{kw}'.")

    trusted = any(hostname.endswith(td) for td in KNOWN_TRUSTED_DOMAINS)
    if trusted:
        risk -= 20
        explanations.append(
            "Domain is in a list of commonly trusted providers (heuristic only)."
        )

    if parsed.port and parsed.port not in (80, 443):
        risk += 10
        explanations.append(
            f"URL uses uncommon port {parsed.port}, which can indicate a non-standard service."
        )

    if not explanations:
        explanations.append(
            "No strong phishing indicators detected using simple heuristic rules."
        )

    risk = max(0.0, min(100.0, risk))

    explanation_text = " ".join(explanations)
    return UrlRiskResult(risk_score=risk, explanation=explanation_text)

