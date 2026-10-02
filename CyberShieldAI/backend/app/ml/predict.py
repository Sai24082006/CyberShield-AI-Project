import joblib
import pandas as pd
from urllib.parse import urlparse
import re

# Load model only once when the server starts
model = joblib.load("app/ml/phishing_model_v2.pkl")

SUSPICIOUS_WORDS = [
    "login",
    "verify",
    "secure",
    "update",
    "account",
    "bank",
    "paypal",
    "signin",
    "password",
    "confirm",
]


def predict_url(url: str):
    parsed = urlparse(url)

    sample = {
        "URL": url,
        "url_length": len(url),
        "num_dots": url.count("."),
        "num_hyphens": url.count("-"),
        "num_digits": sum(c.isdigit() for c in url),
        "num_slashes": url.count("/"),
        "https": 1 if parsed.scheme == "https" else 0,
        "has_ip": 1 if re.search(r"\d+\.\d+\.\d+\.\d+", parsed.netloc) else 0,
        "subdomain_count": max(0, parsed.netloc.count(".") - 1),
        "suspicious_words": sum(
            word in url.lower() for word in SUSPICIOUS_WORDS
        ),
    }

    df = pd.DataFrame([sample])

    prediction = model.predict(df)[0]

    if prediction == "good":
        return "Safe", 98.0
    else:
        return "Phishing", 98.0