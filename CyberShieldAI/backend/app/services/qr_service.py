import cv2
import numpy as np
from fastapi import UploadFile, HTTPException


async def decode_qr(file: UploadFile):
    """
    Decode a QR code from an uploaded image.

    Tries multiple image-processing methods:
    - Original
    - Grayscale
    - Upscaled
    - CLAHE
    - OTSU
    - Adaptive threshold
    - Sharpened
    - Multi QR detection
    """

    # ============================================================
    # READ UPLOADED FILE
    # ============================================================

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Empty image uploaded."
        )

    print("\n========================================")
    print("CYBERSHIELD AI - QR SCANNER")
    print("========================================")
    print("Filename:", file.filename)
    print("Content type:", file.content_type)
    print("File size:", len(contents), "bytes")

    # ============================================================
    # CONVERT BYTES -> OPENCV IMAGE
    # ============================================================

    image_array = np.frombuffer(
        contents,
        dtype=np.uint8
    )

    image = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR
    )

    if image is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid or corrupted image file."
        )

    height, width = image.shape[:2]

    print("Image resolution:", width, "x", height)

    # ============================================================
    # QR DETECTOR
    # ============================================================

    detector = cv2.QRCodeDetector()

    images = []

    # ============================================================
    # 1. ORIGINAL
    # ============================================================

    images.append(("original", image))

    # ============================================================
    # 2. GRAYSCALE
    # ============================================================

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    images.append(("grayscale", gray))

    # ============================================================
    # 3. UPSCALE 2X
    # ============================================================

    resized_2x = cv2.resize(
        gray,
        None,
        fx=2,
        fy=2,
        interpolation=cv2.INTER_CUBIC
    )

    images.append(("upscaled_2x", resized_2x))

    # ============================================================
    # 4. UPSCALE 3X
    # ============================================================

    resized_3x = cv2.resize(
        gray,
        None,
        fx=3,
        fy=3,
        interpolation=cv2.INTER_CUBIC
    )

    images.append(("upscaled_3x", resized_3x))

    # ============================================================
    # 5. CLAHE
    # ============================================================

    try:

        clahe = cv2.createCLAHE(
            clipLimit=2.0,
            tileGridSize=(8, 8)
        )

        enhanced = clahe.apply(gray)

        images.append(("clahe", enhanced))

    except Exception as e:

        print("CLAHE failed:", e)

    # ============================================================
    # 6. OTSU
    # ============================================================

    try:

        _, otsu = cv2.threshold(
            gray,
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )

        images.append(("otsu", otsu))

    except Exception as e:

        print("OTSU failed:", e)

    # ============================================================
    # 7. INVERTED OTSU
    # ============================================================

    try:

        _, inverted_otsu = cv2.threshold(
            gray,
            0,
            255,
            cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
        )

        images.append(
            ("inverted_otsu", inverted_otsu)
        )

    except Exception as e:

        print("Inverted OTSU failed:", e)

    # ============================================================
    # 8. ADAPTIVE THRESHOLD
    # ============================================================

    try:

        adaptive = cv2.adaptiveThreshold(
            gray,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            21,
            5
        )

        images.append(
            ("adaptive", adaptive)
        )

    except Exception as e:

        print("Adaptive threshold failed:", e)

    # ============================================================
    # 9. SHARPEN
    # ============================================================

    try:

        kernel = np.array([
            [0, -1, 0],
            [-1, 5, -1],
            [0, -1, 0]
        ])

        sharpened = cv2.filter2D(
            gray,
            -1,
            kernel
        )

        images.append(
            ("sharpened", sharpened)
        )

    except Exception as e:

        print("Sharpening failed:", e)

    # ============================================================
    # 10. SINGLE QR DETECTION
    # ============================================================

    for name, img in images:

        print(
            f"Trying QR detection: {name}"
        )

        try:

            data, points, _ = detector.detectAndDecode(img)

            if data and data.strip():

                data = data.strip()

                print("\n========================================")
                print("QR CODE DETECTED")
                print("========================================")
                print("Method:", name)
                print("QR DATA:", data)
                print("========================================\n")

                return data

        except Exception as e:

            print(
                f"Detection failed ({name}):",
                str(e)
            )

    # ============================================================
    # 11. MULTIPLE QR DETECTION
    # ============================================================

    for name, img in images:

        print(
            f"Trying multi QR detection: {name}"
        )

        try:

            result = detector.detectAndDecodeMulti(img)

            if result is None:
                continue

            retval = result[0]

            decoded_info = result[1]

            if retval and decoded_info:

                for data in decoded_info:

                    if data and data.strip():

                        data = data.strip()

                        print("\n========================================")
                        print("MULTIPLE QR CODE DETECTED")
                        print("========================================")
                        print("Method:", name)
                        print("QR DATA:", data)
                        print("========================================\n")

                        return data

        except Exception as e:

            print(
                f"Multi detection failed ({name}):",
                str(e)
            )

    # ============================================================
    # NOTHING DETECTED
    # ============================================================

    print("\n========================================")
    print("QR CODE NOT DETECTED")
    print("========================================\n")

    raise HTTPException(
        status_code=400,
        detail=(
            "No QR code detected. "
            "Please upload a clear QR-code image "
            "where the complete QR pattern is visible."
        )
    )