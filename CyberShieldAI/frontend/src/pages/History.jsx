import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await API.get("/history/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHistory(response.data.history || []);
      } catch (error) {
        console.error("History error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const totalScans = history.length;

  const safeScans = history.filter(
    (item) => item.prediction === "Safe"
  ).length;

  const phishingScans = history.filter(
    (item) => item.prediction !== "Safe"
  ).length;

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Scan History
          </h1>

          <p className="text-gray-400 mt-2">
            Track and review your previous security scans.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Total */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">
              Total Scans
            </p>

            <h2 className="text-4xl font-bold text-cyan-400 mt-2">
              {totalScans}
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              URLs analyzed
            </p>
          </div>

          {/* Safe */}
          <div className="bg-slate-900 border border-green-500/20 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">
              Safe URLs
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-2">
              {safeScans}
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              No threat detected
            </p>
          </div>

          {/* Phishing */}
          <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">
              Phishing URLs
            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-2">
              {phishingScans}
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Threat detected
            </p>
          </div>

        </div>

        {/* History Table */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">

          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold">
              Recent Scans
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Your latest URL security analysis results.
            </p>
          </div>

          {loading ? (

            <div className="p-8 text-center text-gray-400">
              Loading scan history...
            </div>

          ) : history.length === 0 ? (

            <div className="p-8 text-center">
              <p className="text-gray-400">
                No scan history found.
              </p>

              <p className="text-gray-600 text-sm mt-2">
                Start scanning URLs to see your history here.
              </p>
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-slate-800/60">

                  <tr className="text-gray-400 text-sm">

                    <th className="px-6 py-4">
                      URL
                    </th>

                    <th className="px-6 py-4">
                      Result
                    </th>

                    <th className="px-6 py-4">
                      Confidence
                    </th>

                    <th className="px-6 py-4">
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {history.map((item, index) => {

                    const isSafe =
                      item.prediction === "Safe";

                    return (

                      <tr
                        key={index}
                        className="border-t border-slate-800 hover:bg-slate-800/40 transition"
                      >

                        {/* URL */}
                        <td className="px-6 py-5">

                          <div
                            className="max-w-md truncate text-gray-300"
                            title={item.url}
                          >
                            {item.url}
                          </div>

                        </td>

                        {/* Result */}
                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                              isSafe
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {isSafe ? "✓ Safe" : "⚠ Phishing"}
                          </span>

                        </td>

                        {/* Confidence */}
                        <td className="px-6 py-5">

                          <span className="text-cyan-400 font-semibold">
                            {item.confidence ?? 0}%
                          </span>

                        </td>

                        {/* Date */}
                        <td className="px-6 py-5 text-gray-400 text-sm">

                          {item.created_at
                            ? new Date(
                                item.created_at
                              ).toLocaleString()
                            : "-"}

                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}