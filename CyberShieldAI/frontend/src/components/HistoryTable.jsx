import { useEffect, useState } from "react";
import API from "../services/api";

export default function HistoryTable() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="mt-10 bg-slate-900 border border-slate-700 rounded-2xl p-6">
      
      <h2 className="text-2xl font-bold text-white mb-6">
        Scan History
      </h2>

      {loading ? (
        <p className="text-gray-400">
          Loading history...
        </p>
      ) : history.length === 0 ? (
        <p className="text-gray-400">
          No scan history found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead>
              <tr className="border-b border-slate-700 text-gray-400">
                <th className="py-3 px-4">URL</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-800 hover:bg-slate-800/50"
                >

                  <td className="py-4 px-4 text-gray-300 max-w-md truncate">
                    {item.url}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={
                        item.prediction === "Safe"
                          ? "text-green-400 font-semibold"
                          : "text-red-400 font-semibold"
                      }
                    >
                      {item.prediction}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-cyan-400">
                    {item.confidence}%
                  </td>

                  <td className="py-4 px-4 text-gray-400">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : "-"}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}