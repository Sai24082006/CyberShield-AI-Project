import re
from urllib.parse import urlparse


URGENCY_WORDS = [
    "urgent",
    "immediately",
    "act now",
    "action required",
    "verify now",
    "verify immediately",
    "account suspended",
    "account will be suspended",
    "account blocked",
    "final warning",
    "last warning",
    "within 24 hours",
    "within 48 hours",
]

CREDENTIAL_WORDS = [
    "password",
    "username",
    "login",
    "log in",
    "otp",
    "one time password",
    "verification code",
    "security code",
    "pin",
    "passcode",
]

FINANCIAL_WORDS = [
    "bank",
    "credit card",
    "debit card",
    "payment",
    "refund",
    "invoice",
    "transaction",
    "wallet",
    "upi",
    "account number",
    "billing",
]

SUSPICIOUS_URL_WORDS = [
    "login",
    "verify",
    "secure",
    "account",
    "update",
    "wallet",
    "payment",
    "signin",
    "confirm",
]

URL_SHORTENERS = [
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "is.gd",
    "cutt.ly",
    "shorturl.at",
]


def extract_urls(text: str):
    """Extract URLs from email text."""
    pattern = r"https?://[^\s<>\"]+"
    return re.findall(pattern, text or "", re.IGNORECASE)


def contains_any(text: str, words):
    """Return matching suspicious keywords."""
    text = text.lower()

    return [
        word
        for word in words
        if word.lower() in text
    ]


def analyze_url(url: str):
    """Check a URL for common phishing indicators."""
    indicators = []

    try:
        parsed = urlparse(url)
        domain = parsed.netloc.lower()

        # HTTP instead of HTTPS
        if parsed.scheme == "http":
            indicators.append(
                "URL uses unencrypted HTTP"
            )

        # IP address instead of domain
        if re.match(
            r"^\d{1,3}(\.\d{1,3}){3}$",
            domain
        ):
            indicators.append(
                "URL uses an IP address instead of a domain name"
            )

        # Punycode
        if "xn--" in domain:
            indicators.append(
                "Domain uses punycode"
            )

        # Too many subdomains
        if len(domain.split(".")) >= 4:
            indicators.append(
                "URL contains an unusually deep subdomain structure"
            )

        # Suspicious words in domain
        if any(
            word in domain
            for word in SUSPICIOUS_URL_WORDS
        ):
            indicators.append(
                "URL domain contains phishing-related keywords"
            )

        # URL shorteners
        if any(
            shortener in domain
            for shortener in URL_SHORTENERS
        ):
            indicators.append(
                "URL uses a known URL-shortening service"
            )

    except Exception:
        indicators.append(
            "URL could not be parsed safely"
        )

    return indicators


def analyze_email(sender: str, subject: str, body: str):
    """
    Analyze an email using rule-based phishing indicators.

    This is a heuristic analysis and not an ML probability.
    """

    sender = (sender or "").strip()
    subject = (subject or "").strip()
    body = (body or "").strip()

    full_text = f"{subject} {body}"

    score = 0
    indicators = []

    # --------------------------------
    # 1. Urgency detection
    # --------------------------------

    urgency_matches = contains_any(
        full_text,
        URGENCY_WORDS
    )

    if urgency_matches:
        score += min(
            len(urgency_matches) * 12,
            30
        )

        indicators.append(
            "Email uses urgent or threatening language"
        )

    # --------------------------------
    # 2. Credential detection
    # --------------------------------

    credential_matches = contains_any(
        full_text,
        CREDENTIAL_WORDS
    )

    if credential_matches:
        score += min(
            len(credential_matches) * 8,
            25
        )

        indicators.append(
            "Email requests or discusses login credentials or security codes"
        )

    # --------------------------------
    # 3. Financial information
    # --------------------------------

    financial_matches = contains_any(
        full_text,
        FINANCIAL_WORDS
    )

    if financial_matches:
        score += min(
            len(financial_matches) * 7,
            20
        )

        indicators.append(
            "Email contains financial or payment-related language"
        )

    # --------------------------------
    # 4. URL analysis
    # --------------------------------

    urls = extract_urls(full_text)

    for url in urls:

        url_indicators = analyze_url(url)

        if url_indicators:

            score += min(
                len(url_indicators) * 10,
                30
            )

            for indicator in url_indicators:

                if indicator not in indicators:
                    indicators.append(indicator)

    # --------------------------------
    # 5. Sender validation
    # --------------------------------

    if sender:

        sender_lower = sender.lower()

        if "@" not in sender:
            score += 15

            indicators.append(
                "Sender address does not appear to be valid"
            )

        elif any(
            word in sender_lower
            for word in SUSPICIOUS_URL_WORDS
        ):
            score += 10

            indicators.append(
                "Sender address contains suspicious keywords"
            )

    # --------------------------------
    # 6. Excessive punctuation
    # --------------------------------

    if re.search(
        r"!{2,}",
        full_text
    ):
        score += 5

        indicators.append(
            "Email contains excessive exclamation marks"
        )

    # --------------------------------
    # Limit score
    # --------------------------------

    score = min(score, 100)

    # --------------------------------
    # Classification
    # --------------------------------

    if score >= 60:

        prediction = "Phishing"
        risk_level = "High"

        message = (
            "This email contains multiple "
            "phishing indicators."
        )

    elif score >= 30:

        prediction = "Suspicious"
        risk_level = "Medium"

        message = (
            "This email contains some "
            "suspicious characteristics."
        )

    else:

        prediction = "Safe"
        risk_level = "Low"

        message = (
            "No major phishing indicators "
            "were detected."
        )

    # --------------------------------
    # Heuristic confidence
    # --------------------------------

    if prediction == "Phishing":

        confidence = max(
            score,
            60
        )

    elif prediction == "Suspicious":

        confidence = max(
            50,
            100 - abs(score - 45)
        )

    else:

        confidence = max(
            60,
            100 - score
        )

    return {
        "status": "success",
        "prediction": prediction,
        "confidence": round(
            float(confidence),
            2
        ),
        "risk_level": risk_level,
        "indicators": indicators,
        "urls": urls,
        "message": message,
        "analysis_type": "Rule-based email phishing analysis"
    }