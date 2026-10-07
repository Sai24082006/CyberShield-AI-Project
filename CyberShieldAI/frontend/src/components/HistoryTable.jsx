import { useEffect, useState } from "react";
import API from "../services/api";

export default function HistoryTable() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.get("/history/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("History API response:", response.data);

      setHistory(response.data.history || []);
    } catch (error) {
      console.error("History error:", error);
      setError("Unable to load scan history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-6 shadow-lg">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Scan History
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            All URLs scanned using CyberShieldAI
          </p>
        </div>

        <button
          onClick={loadHistory}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold transition"
        >
          Refresh
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="py-10 text-center">
          <p className="text-cyan-400">
            Loading scan history...
          </p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="py-10 text-center">
          <p className="text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && history.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-5xl mb-4">
            🛡️
          </div>

          <h3 className="text-xl font-semibold text-white">
            No Scans Yet
          </h3>

          <p className="text-gray-400 mt-2">
            Your scanned URLs will appear here.
          </p>
        </div>
      )}

      {/* HISTORY TABLE */}
      {!loading && !error && history.length > 0 && (
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-700">

                <th className="text-left py-4 px-4 text-gray-400 font-semibold">
                  #
                </th>

                <th className="text-left py-4 px-4 text-gray-400 font-semibold">
                  URL
                </th>

                <th className="text-left py-4 px-4 text-gray-400 font-semibold">
                  Result
                </th>

                <th className="text-left py-4 px-4 text-gray-400 font-semibold">
                  Confidence
                </th>

              </tr>
            </thead>

            <tbody>

              {history.map((item, index) => {

                const isSafe =
                  item.prediction === "Safe";

                return (
                  <tr
                    key={item.id || index}
                    className="border-b border-slate-800 hover:bg-slate-800/60 transition"
                  >

                    {/* NUMBER */}
                    <td className="py-4 px-4 text-gray-500">
                      {index + 1}
                    </td>

                    {/* URL */}
                    <td className="py-4 px-4 max-w-xl">
                      <div
                        className="text-gray-200 truncate"
                        title={item.url}
                      >
                        {item.url}
                      </div>
                    </td>

                    {/* RESULT */}
                    <td className="py-4 px-4">

                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          isSafe
                            ? "bg-green-500/10 text-green-400 border border-green-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {isSafe ? "✓ Safe" : "⚠ Phishing"}
                      </span>

                    </td>

                    {/* CONFIDENCE */}
                    <td className="py-4 px-4">

                      <div className="flex items-center gap-3">

                        <span className="text-cyan-400 font-semibold">
                          {Number(item.confidence || 0).toFixed(2)}%
                        </span>

                        <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">

                          <div
                            className={`h-full rounded-full ${
                              isSafe
                                ? "bg-green-400"
                                : "bg-red-400"
                            }`}
                            style={{
                              width: `${Math.min(
                                Number(item.confidence || 0),
                                100
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}