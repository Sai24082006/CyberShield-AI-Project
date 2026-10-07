import re
from urllib.parse import urlparse
import tldextract


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
    "wallet",
    "credential",
    "recover",
    "authenticate",
]


def extract_features(url):
    url = str(url).strip()

    # Make sure urlparse receives something with a scheme
    parse_url = url if "://" in url else "http://" + url

    # Handle malformed URLs safely
    try:
        parsed = urlparse(parse_url)
        hostname = parsed.netloc.lower()
        path = parsed.path
        query = parsed.query
        scheme = parsed.scheme.lower()
    except ValueError:
        # If URL is malformed, still extract safe string-based features
        hostname = ""
        path = ""
        query = ""
        scheme = ""

    # tldextract is also protected against unusual input
    try:
        extracted = tldextract.extract(url)
        subdomain = extracted.subdomain
    except Exception:
        subdomain = ""

    # Remove port from hostname
    hostname_without_port = hostname.split(":")[0]

    return {
        # Basic URL features
        "url_length": len(url),
        "num_dots": url.count("."),
        "num_hyphens": url.count("-"),
        "num_digits": sum(c.isdigit() for c in url),
        "num_slashes": url.count("/"),

        # Security features
        "https": 1 if scheme == "https" else 0,

        "has_ip": 1 if re.search(
            r"^(?:\d{1,3}\.){3}\d{1,3}$",
            hostname_without_port
        ) else 0,

        # Domain structure
        "subdomain_count": (
            len(subdomain.split("."))
            if subdomain
            else 0
        ),

        "hostname_length": len(hostname),

        # Path / query
        "path_length": len(path),
        "query_length": len(query),
        "directory_count": path.count("/"),

        # Special characters
        "has_at": 1 if "@" in url else 0,
        "has_question": 1 if "?" in url else 0,
        "has_equal": 1 if "=" in url else 0,
        "has_ampersand": 1 if "&" in url else 0,
        "has_percent": 1 if "%" in url else 0,
        "has_hash": 1 if "#" in url else 0,

        # Character counts
        "num_at": url.count("@"),
        "num_question": url.count("?"),
        "num_equal": url.count("="),
        "num_ampersand": url.count("&"),
        "num_percent": url.count("%"),

        # Suspicious words
        "suspicious_words": sum(
            word in url.lower()
            for word in SUSPICIOUS_WORDS
        ),
    }