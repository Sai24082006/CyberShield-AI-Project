import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

export default function QRScanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // --------------------------------------------------
  // Select image
  // --------------------------------------------------

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setResult(null);
    setError("");

    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid QR-code image.");
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);

    const imageURL = URL.createObjectURL(selectedFile);
    setPreview(imageURL);
  };

  // --------------------------------------------------
  // Scan QR
  // --------------------------------------------------

  const handleScan = async () => {
    if (!file) {
      setError("Please select a QR-code image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await API.post(
        "/qr/scan",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("QR Scan Response:", response.data);

      setResult(response.data);
    } catch (err) {
      console.error("QR scan error:", err);

      const message =
        err?.response?.data?.detail ||
        "QR scanning failed. Please try another image.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  };

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // --------------------------------------------------
  // Result helpers
  // --------------------------------------------------

  const prediction =
    result?.prediction?.toString().toLowerCase() || "";

  const isPhishing = prediction === "phishing";
  const isSafe = prediction === "safe";

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav
        className="
          h-20
          bg-slate-950
          border-b border-slate-800
          flex items-center
          justify-between
          px-[5%]
        "
      >
        {/* LOGO */}

        <Link
          to="/choose-scanner"
          className="
            no-underline
            text-white
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              w-11
              h-11
              rounded-xl
              border
              border-cyan-600
              flex
              items-center
              justify-center
              text-xl
            "
          >
            🛡️
          </div>

          <div>
            <div className="text-lg font-bold">
              CyberShieldAI
            </div>

            <div className="text-xs text-slate-500">
              Threat Detection
            </div>
          </div>
        </Link>

        {/* NAVIGATION */}

        <div className="flex items-center gap-8">

          <Link
            to="/choose-scanner"
            className="
              text-cyan-400
              no-underline
              text-sm
              font-medium
            "
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/history"
            className="
              text-slate-300
              no-underline
              text-sm
              font-medium
              hover:text-cyan-400
            "
          >
            📜 History
          </Link>

          <Link
            to="/profile"
            className="
              text-slate-300
              no-underline
              text-sm
              font-medium
              hover:text-cyan-400
            "
          >
            👤 Profile
          </Link>

          <button
            onClick={handleLogout}
            className="
              bg-transparent
              border-none
              text-red-400
              cursor-pointer
              text-sm
              font-medium
            "
          >
            Logout
          </button>

        </div>
      </nav>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="w-[90%] max-w-5xl mx-auto py-12">

        <div
          className="
            bg-slate-900
            border
            border-purple-500/20
            rounded-2xl
            p-6
          "
        >

          {/* HEADER */}

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-white">
              📱 QR Phishing Scanner
            </h2>

            <p className="text-gray-400 mt-2">
              Upload a QR-code image and check whether its
              embedded URL is safe or potentially phishing.
            </p>

          </div>

          {/* ==================================================
              UPLOAD AREA
          ================================================== */}

          {!result && (
            <>
              <label
                htmlFor="qr-upload"
                className="
                  block
                  border-2
                  border-dashed
                  border-slate-700
                  rounded-xl
                  p-8
                  text-center
                  cursor-pointer
                  hover:border-cyan-400
                  hover:bg-slate-800/50
                  transition
                "
              >

                {preview ? (
                  <div className="flex flex-col items-center">

                    <img
                      src={preview}
                      alt="QR Preview"
                      className="
                        max-h-64
                        max-w-full
                        rounded-lg
                        object-contain
                        mb-4
                      "
                    />

                    <p className="text-cyan-400 font-medium">
                      {file?.name}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      Click to choose another image
                    </p>

                  </div>
                ) : (
                  <div>

                    <div className="text-5xl mb-4">
                      📷
                    </div>

                    <p className="text-white font-semibold">
                      Upload QR Code Image
                    </p>

                    <p className="text-gray-500 text-sm mt-2">
                      PNG, JPG or JPEG
                    </p>

                  </div>
                )}

              </label>

              <input
                id="qr-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* ERROR */}

              {error && (
                <div
                  className="
                    mt-4
                    p-4
                    rounded-lg
                    bg-red-500/10
                    border
                    border-red-500/30
                    text-red-400
                  "
                >
                  ⚠️ {error}
                </div>
              )}

              {/* BUTTONS */}

              <div className="flex gap-3 mt-6">

                <button
                  onClick={handleScan}
                  disabled={!file || loading}
                  className="
                    flex-1
                    bg-cyan-500
                    hover:bg-cyan-400
                    disabled:bg-slate-700
                    disabled:text-gray-500
                    text-white
                    font-semibold
                    py-3
                    rounded-xl
                    transition
                  "
                >
                  {loading
                    ? "🔍 Scanning QR..."
                    : "🔍 Scan QR Code"}
                </button>

                {file && (
                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="
                      px-6
                      py-3
                      rounded-xl
                      bg-slate-800
                      hover:bg-slate-700
                      text-gray-300
                      transition
                    "
                  >
                    Clear
                  </button>
                )}

              </div>
            </>
          )}

          {/* ==================================================
              RESULT
          ================================================== */}

          {result && (
            <div className="space-y-5">

              {/* RESULT HEADER */}

              <div
                className={`
                  rounded-xl
                  p-5
                  border
                  ${
                    isPhishing
                      ? "bg-red-500/10 border-red-500/30"
                      : isSafe
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-yellow-500/10 border-yellow-500/30"
                  }
                `}
              >

                <div className="flex items-center gap-4">

                  <div className="text-4xl">
                    {isPhishing
                      ? "🚨"
                      : isSafe
                      ? "🛡️"
                      : "⚠️"}
                  </div>

                  <div>

                    <p className="text-gray-400 text-sm">
                      QR Security Result
                    </p>

                    <h3
                      className={`
                        text-2xl
                        font-bold
                        ${
                          isPhishing
                            ? "text-red-400"
                            : isSafe
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      `}
                    >
                      {result.prediction || "Unknown"}
                    </h3>

                  </div>

                </div>

              </div>

              {/* QR DATA */}

              <div className="bg-slate-800 rounded-xl p-5">

                <p className="text-gray-400 text-sm mb-2">
                  QR Data
                </p>

                <p className="text-white break-all">
                  {result.qr_data || "No data"}
                </p>

              </div>

              {/* URL */}

              {result.is_url && (
                <div className="bg-slate-800 rounded-xl p-5">

                  <p className="text-gray-400 text-sm mb-2">
                    Extracted URL
                  </p>

                  <p className="text-cyan-400 break-all">
                    {result.url || result.qr_data}
                  </p>

                </div>
              )}

              {/* CONFIDENCE */}

              {typeof result.confidence === "number" && (
                <div className="bg-slate-800 rounded-xl p-5">

                  <div className="flex justify-between mb-3">

                    <span className="text-gray-400">
                      AI Confidence
                    </span>

                    <span className="text-white font-semibold">
                      {result.confidence.toFixed(2)}%
                    </span>

                  </div>

                  <div className="w-full bg-slate-700 rounded-full h-3">

                    <div
                      className="bg-cyan-400 h-3 rounded-full"
                      style={{
                        width: `${Math.min(
                          Math.max(result.confidence, 0),
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>
              )}

              {/* MESSAGE */}

              {result.message && (
                <div className="text-gray-400 text-sm">
                  {result.message}
                </div>
              )}

              {/* SCAN AGAIN */}

              <button
                onClick={handleReset}
                className="
                  w-full
                  bg-slate-800
                  hover:bg-slate-700
                  text-white
                  font-semibold
                  py-3
                  rounded-xl
                  transition
                "
              >
                🔄 Scan Another QR Code
              </button>

            </div>
          )}

        </div>

      </main>

    </div>
  );
}