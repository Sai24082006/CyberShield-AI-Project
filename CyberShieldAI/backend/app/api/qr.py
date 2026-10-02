from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.qr_service import decode_qr
from app.services.scan_service import scan_url


router = APIRouter(
    prefix="/qr",
    tags=["QR Phishing Detection"]
)


@router.post("/scan")
async def scan_qr(
    file: UploadFile = File(...)
):
    """
    Public QR phishing scanner.

    Flow:

    QR Image
        ↓
    Decode QR
        ↓
    Extract URL
        ↓
    CyberShield AI phishing model
        ↓
    Safe / Phishing
    """

    # ============================================================
    # VALIDATE FILE
    # ============================================================

    if not file.content_type:

        raise HTTPException(
            status_code=400,
            detail="File type could not be determined."
        )

    if not file.content_type.startswith("image/"):

        raise HTTPException(
            status_code=400,
            detail="Please upload an image containing a QR code."
        )

    try:

        # ========================================================
        # DECODE QR
        # ========================================================

        qr_data = await decode_qr(file)

        qr_data = qr_data.strip()

        print("\n========================================")
        print("CYBERSHIELD AI - QR SCAN")
        print("========================================")
        print("QR DATA:")
        print(qr_data)

        # ========================================================
        # CHECK WHETHER QR CONTAINS URL
        # ========================================================

        is_url = (
            qr_data.lower().startswith("http://")
            or qr_data.lower().startswith("https://")
        )

        # ========================================================
        # QR CONTAINS TEXT
        # ========================================================

        if not is_url:

            return {
                "status": "success",
                "qr_detected": True,
                "qr_data": qr_data,
                "is_url": False,
                "prediction": "Unknown",
                "confidence": 0,
                "message": (
                    "QR code detected, but it does not "
                    "contain a website URL."
                )
            }

        # ========================================================
        # ANALYZE URL
        # ========================================================

        print("\nAnalyzing QR URL with CyberShield AI...")

        # IMPORTANT:
        # Your current scan_url() requires:
        #
        # scan_url(url, email)
        #
        # Since QR scanning does not have an email,
        # send an empty string.

        result = await scan_url(
            qr_data,
            ""
        )

        print("\nQR ANALYSIS RESULT:")
        print(result)

        # ========================================================
        # CONVERT RESULT TO DICT
        # ========================================================

        if hasattr(result, "model_dump"):

            result = result.model_dump()

        elif hasattr(result, "dict"):

            result = result.dict()

        elif not isinstance(result, dict):

            result = {
                "prediction": str(result),
                "confidence": 0
            }

        # ========================================================
        # GET PREDICTION
        # ========================================================

        prediction = result.get(
            "prediction",
            "Unknown"
        )

        confidence = result.get(
            "confidence",
            0
        )

        # ========================================================
        # FINAL RESPONSE
        # ========================================================

        message = (
            "Potential phishing website detected."
            if str(prediction).lower() == "phishing"
            else
            "QR code URL scanned successfully."
        )

        print("Prediction:", prediction)
        print("Confidence:", confidence)
        print("========================================\n")

        return {

            "status": "success",

            "qr_detected": True,

            "qr_data": qr_data,

            "url": qr_data,

            "is_url": True,

            "prediction": prediction,

            "confidence": confidence,

            "message": message
        }

    # ============================================================
    # HTTP ERRORS
    # ============================================================

    except HTTPException:

        raise

    # ============================================================
    # OTHER ERRORS
    # ============================================================

    except Exception as e:

        print("\n========================================")
        print("QR SCANNING ERROR")
        print("========================================")
        print(str(e))
        print("========================================\n")

        raise HTTPException(
            status_code=500,
            detail=f"QR scanning failed: {str(e)}"
        )