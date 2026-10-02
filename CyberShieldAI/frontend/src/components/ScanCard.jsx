import { useState } from "react";
import API from "../services/api";

export default function ScanCard() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scanUrl = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/scan/",
        { url: url.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      console.error("Scan error:", err);
      alert("Scan Failed");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------
  // Confidence level
  // ------------------------------------------

  const getConfidenceLevel = (confidence) => {
    if (confidence >= 80) {
      return {
        label: "High Confidence",
        text: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500/30",
      };
    }

    if (confidence >= 60) {
      return {
        label: "Medium Confidence",
        text: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
      };
    }

    return {
      label: "Low Confidence",
      text: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
    };
  };

  // ------------------------------------------
  // Result styling
  // ------------------------------------------

  const isPhishing =
    result?.prediction?.toLowerCase() === "phishing";

  const confidence = Number(result?.confidence || 0);

  const confidenceLevel = getConfidenceLevel(confidence);

  return (
    <div className="mt-10">
      {/* Scanner Card */}

      <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-6 shadow-xl">

        <h2 className="text-2xl text-white font-bold mb-2">
          AI URL Scanner
        </h2>

        <p className="text-gray-400 mb-6">
          Analyze a URL for potential phishing threats.
        </p>

        {/* Input */}

        <div className="flex flex-col md:flex-row gap-4">

          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                scanUrl();
              }
            }}
            placeholder="https://example.com"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-500 transition"
          />

          <button
            onClick={scanUrl}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:cursor-not-allowed px-8 py-3 rounded-xl text-white font-semibold transition"
          >
            {loading ? "Scanning..." : "Scan"}
          </button>

        </div>
      </div>


      {/* ======================================
          SCAN RESULT
      ====================================== */}

      {result && (
        <div className="mt-6 bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">

          {/* Result Header */}

          <div className="flex items-center justify-between mb-6">

            <div>
              <h3 className="text-2xl text-white font-bold">
                Scan Result
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                AI-powered URL analysis
              </p>
            </div>

            {/* Status */}

            <div
              className={`px-4 py-2 rounded-full border ${
                isPhishing
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-green-500/10 border-green-500/30 text-green-400"
              }`}
            >
              <span className="font-bold">
                {isPhishing ? "⚠ Phishing" : "✓ Safe"}
              </span>
            </div>

          </div>


          {/* URL */}

          <div className="mb-6">

            <p className="text-gray-500 text-sm mb-2">
              URL
            </p>

            <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">

              <p className="text-gray-200 break-all text-sm">
                {result.url}
              </p>

            </div>

          </div>


          {/* Result + Confidence */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Detection */}

            <div
              className={`rounded-xl border p-5 ${
                isPhishing
                  ? "bg-red-500/5 border-red-500/20"
                  : "bg-green-500/5 border-green-500/20"
              }`}
            >

              <p className="text-gray-500 text-sm mb-2">
                Detection
              </p>

              <p
                className={`text-3xl font-bold ${
                  isPhishing
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {result.prediction}
              </p>

            </div>


            {/* Confidence */}

            <div
              className={`rounded-xl border p-5 ${confidenceLevel.bg} ${confidenceLevel.border}`}
            >

              <div className="flex justify-between items-center">

                <div>
                  <p className="text-gray-500 text-sm mb-2">
                    Confidence
                  </p>

                  <p
                    className={`text-3xl font-bold ${confidenceLevel.text}`}
                  >
                    {confidence.toFixed(2)}%
                  </p>
                </div>

                <span
                  className={`text-sm font-semibold ${confidenceLevel.text}`}
                >
                  {confidenceLevel.label}
                </span>

              </div>


              {/* Progress Bar */}

              <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">

                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isPhishing
                      ? "bg-red-400"
                      : confidence >= 80
                      ? "bg-green-400"
                      : confidence >= 60
                      ? "bg-yellow-400"
                      : "bg-orange-400"
                  }`}
                  style={{
                    width: `${Math.min(confidence, 100)}%`,
                  }}
                />

              </div>

            </div>

          </div>


          {/* Warning */}

          {isPhishing && (
            <div className="mt-5 bg-red-500/10 border border-red-500/20 rounded-xl p-4">

              <p className="text-red-400 font-semibold">
                ⚠ Potential phishing threat detected
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Avoid entering passwords, payment information,
                or other sensitive data on this website.
              </p>

            </div>
          )}


          {/* Low Confidence Notice */}

          {!isPhishing && confidence < 60 && (
            <div className="mt-5 bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">

              <p className="text-orange-400 font-semibold">
                ⚠ Low confidence result
              </p>

              <p className="text-gray-400 text-sm mt-1">
                The AI is uncertain about this URL. Treat it
                cautiously and verify the website before entering
                sensitive information.
              </p>

            </div>
          )}

        </div>
      )}

    </div>
  );
}