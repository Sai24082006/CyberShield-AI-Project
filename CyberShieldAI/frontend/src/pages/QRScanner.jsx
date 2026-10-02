import { useState } from "react";
import API from "../services/api";

export default function QRScanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  };

  const scanQR = async () => {
    if (!file) {
      setError("Please upload a QR code image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await API.post("/qr/scan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("QR Scan Response:", response.data);

      setResult(response.data);
    } catch (err) {
      console.error("QR Scan Error:", err);

      setError(
        err.response?.data?.detail ||
          "QR scanning failed. Please try another image."
      );
    } finally {
      setLoading(false);
    }
  };

  const getResultStyle = () => {
    if (!result) return "";

    if (result.prediction?.toLowerCase() === "phishing") {
      return "border-red-500/40 bg-red-500/10";
    }

    if (result.prediction?.toLowerCase() === "safe") {
      return "border-green-500/40 bg-green-500/10";
    }

    return "border-yellow-500/40 bg-yellow-500/10";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-bold">
          QR Phishing Scanner
        </h1>

        <p className="text-gray-400 mt-2">
          Scan a QR code and check whether its URL is safe or potentially
          malicious.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* UPLOAD CARD */}
        <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-8">

          <h2 className="text-xl font-semibold mb-6">
            📷 Upload QR Code
          </h2>

          <label
            htmlFor="qr-upload"
            className="block cursor-pointer"
          >
            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl p-8 text-center transition">

              {preview ? (
                <img
                  src={preview}
                  alt="QR Preview"
                  className="max-h-72 mx-auto rounded-xl object-contain"
                />
              ) : (
                <>
                  <div className="text-5xl mb-4">
                    📷
                  </div>

                  <p className="text-gray-300">
                    Click to upload QR image
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    PNG, JPG, JPEG
                  </p>
                </>
              )}

            </div>
          </label>

          <input
            id="qr-upload"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />

          {file && (
            <p className="text-sm text-gray-400 mt-4 text-center">
              Selected: {file.name}
            </p>
          )}

          {/* SCAN BUTTON */}
          <button
            onClick={scanQR}
            disabled={!file || loading}
            className="w-full mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-gray-500 text-black font-semibold py-3 rounded-xl transition"
          >
            {loading ? "Scanning QR..." : "🔍 Scan QR Code"}
          </button>

          {/* ERROR */}
          {error && (
            <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
              {error}
            </div>
          )}
        </div>

        {/* RESULT CARD */}
        <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-8">

          <h2 className="text-xl font-semibold mb-6">
            🛡️ Security Analysis
          </h2>

          {!result && !loading && (
            <div className="h-64 flex items-center justify-center text-center">
              <div>
                <div className="text-5xl mb-4">
                  🔐
                </div>

                <p className="text-gray-400">
                  Upload a QR code to begin analysis.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">

                <div className="text-5xl mb-4 animate-pulse">
                  🔎
                </div>

                <p className="text-cyan-400">
                  Analyzing QR code...
                </p>

              </div>
            </div>
          )}

          {result && (
            <div className={`rounded-2xl border p-6 ${getResultStyle()}`}>

              {/* STATUS */}
              <div className="text-center mb-6">

                {result.prediction?.toLowerCase() === "phishing" ? (
                  <>
                    <div className="text-6xl mb-3">
                      🚨
                    </div>

                    <h3 className="text-3xl font-bold text-red-400">
                      PHISHING DETECTED
                    </h3>
                  </>
                ) : result.prediction?.toLowerCase() === "safe" ? (
                  <>
                    <div className="text-6xl mb-3">
                      🟢
                    </div>

                    <h3 className="text-3xl font-bold text-green-400">
                      SAFE
                    </h3>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-3">
                      ⚠️
                    </div>

                    <h3 className="text-3xl font-bold text-yellow-400">
                      UNKNOWN
                    </h3>
                  </>
                )}

              </div>

              {/* QR DATA */}
              <div className="mb-5">

                <p className="text-gray-400 text-sm mb-2">
                  Detected URL
                </p>

                <div className="bg-slate-950 rounded-xl p-4 break-all text-cyan-300">
                  {result.url || result.qr_data || "No URL detected"}
                </div>

              </div>

              {/* CONFIDENCE */}
              {result.is_url && (
                <div>

                  <div className="flex justify-between mb-2">

                    <span className="text-gray-400">
                      Confidence
                    </span>

                    <span className="font-semibold">
                      {Number(result.confidence || 0).toFixed(2)}%
                    </span>

                  </div>

                  <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden">

                    <div
                      className="bg-cyan-400 h-3 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          Number(result.confidence || 0),
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>
              )}

              {/* MESSAGE */}
              <div className="mt-6 text-center text-gray-300">
                {result.message}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}