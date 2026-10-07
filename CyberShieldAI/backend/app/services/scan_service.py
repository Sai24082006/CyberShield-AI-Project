from pathlib import Path

import joblib
import pandas as pd

from app.database.database import db
from app.schemas.scan import ScanResponse
from ml.features import extract_features


# ============================================================
# MODEL PATH
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = (
    BASE_DIR
    / "ml"
    / "models"
    / "phishing_model_v2.pkl"
)


# ============================================================
# LOAD PHISHING MODEL
# ============================================================

print("==================================================")
print("Loading phishing detection model")
print("Model path:", MODEL_PATH)
print("==================================================")

try:
    model = joblib.load(MODEL_PATH)
    print("Phishing model loaded successfully!")
except Exception as e:
    print("ERROR loading phishing model:")
    print(str(e))
    model = None


# ============================================================
# SCAN URL
# ============================================================

async def scan_url(url: str, email: str = ""):
    """
    Analyze a URL using the CyberShield AI phishing model.

    Every successful scan is stored in scan_history with:
        - URL
        - Prediction
        - Confidence
    """

    # --------------------------------------------------------
    # Validate URL
    # --------------------------------------------------------

    if not url or not url.strip():
        raise ValueError("URL cannot be empty.")

    url = url.strip()

    # --------------------------------------------------------
    # Check model
    # --------------------------------------------------------

    if model is None:
        raise RuntimeError(
            "Phishing detection model is not loaded."
        )

    try:

        # ====================================================
        # EXTRACT FEATURES
        # ====================================================

        features = extract_features(url)

        # ====================================================
        # CREATE MODEL INPUT
        # ====================================================

        sample = pd.DataFrame(
            [
                {
                    "URL": url,
                    **features
                }
            ]
        )

        # ====================================================
        # MODEL PREDICTION
        # ====================================================

        prediction = model.predict(sample)[0]

        prediction_string = str(
            prediction
        ).lower().strip()

        # ----------------------------------------------------
        # Convert model output
        # ----------------------------------------------------

        if prediction_string in [
            "good",
            "safe",
            "benign",
            "legitimate",
            "0"
        ]:
            result = "Safe"
        else:
            result = "Phishing"

        # ====================================================
        # CONFIDENCE
        # ====================================================

        confidence = 95.0

        try:
            if hasattr(model, "predict_proba"):

                probabilities = model.predict_proba(
                    sample
                )[0]

                confidence = float(
                    max(probabilities) * 100
                )

        except Exception as e:

            print(
                "Confidence calculation warning:",
                str(e)
            )

        # Keep confidence between 0 and 100

        confidence = max(
            0.0,
            min(
                confidence,
                100.0
            )
        )

        # ====================================================
        # SAVE HISTORY
        # ====================================================

        try:

            history_document = {
                "url": url,
                "prediction": result,
                "confidence": round(confidence, 2)
            }

            await db.scan_history.insert_one(
                history_document
            )

            print(
                "Scan history saved successfully."
            )

        except Exception as e:

            print(
                "History save warning:",
                str(e)
            )

        # ====================================================
        # RETURN RESPONSE
        # ====================================================

        return ScanResponse(
            status="success",
            url=url,
            prediction=result,
            confidence=confidence
        )

    except Exception as e:

        print("\n========================================")
        print("SCAN ERROR")
        print("========================================")
        print("URL:", url)
        print("Error:", str(e))
        print("========================================\n")

        raise