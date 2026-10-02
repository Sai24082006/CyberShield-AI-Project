import re
from urllib.parse import urlparse
import tldextract

SUSPICIOUS_WORDS = [
    "login", "verify", "secure", "update", "account",
    "bank", "paypal", "signin", "password", "confirm"
]

def extract_features(url):
    parsed = urlparse(url)
    extracted = tldextract.extract(url)

    hostname = parsed.netloc

    return {
        "url_length": len(url),
        "num_dots": url.count("."),
        "num_hyphens": url.count("-"),
        "num_digits": sum(c.isdigit() for c in url),
        "num_slashes": url.count("/"),
        "https": 1 if parsed.scheme == "https" else 0,
        "has_ip": 1 if re.search(r"\d+\.\d+\.\d+\.\d+", hostname) else 0,
        "subdomain_count": len(extracted.subdomain.split(".")) if extracted.subdomain else 0,
        "suspicious_words": sum(word in url.lower() for word in SUSPICIOUS_WORDS)
    }