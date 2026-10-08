import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const navigate = useNavigate();

  const handleUrlScan = async () => {
    if (!url.trim()) {
      alert("Please enter a URL.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setScanResult(null);

    try {
      const response = await API.post(
        "/scan/",
        {
          url: url.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      console.log("Scan result:", data);

      setScanResult(data);
    } catch (error) {
      console.error("Scan error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <nav
        style={{
          minHeight: "80px",
          background: "#020617",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 5%",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <Link
          to="/choose-scanner"
          style={{
            textDecoration: "none",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              border: "1px solid #0891b2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "21px",
            }}
          >
            ???
          </div>

          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              CyberShieldAI
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              Threat Detection
            </div>
          </div>
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/choose-scanner"
            style={{
              color: "#22d3ee",
              textDecoration: "none",
              fontSize: "15px",
            }}
          >
            ?? Dashboard
          </Link>

          <Link
            to="/history"
            style={{
              color: "#cbd5e1",
              textDecoration: "none",
              fontSize: "15px",
            }}
          >
            ?? History
          </Link>

          <Link
            to="/profile"
            style={{
              color: "#cbd5e1",
              textDecoration: "none",
              fontSize: "15px",
            }}
          >
            ?? Profile
          </Link>

          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "#f87171",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main
        style={{
          width: "90%",
          maxWidth: "1200px",
          margin: "50px auto",
        }}
      >
        <section
          style={{
            background: "#111827",
            border: "1px solid #155e75",
            borderRadius: "16px",
            padding: "30px",
          }}
        >
          <h1 style={{ marginTop: 0 }}>
            ?? AI URL Scanner
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Analyze a website URL for potential phishing threats.
          </p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "25px",
            }}
          >
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUrlScan();
                }
              }}
              placeholder="https://example.com"
              style={{
                flex: 1,
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #334155",
                background: "#1e293b",
                color: "white",
                fontSize: "15px",
                outline: "none",
              }}
            />

            <button
              onClick={handleUrlScan}
              disabled={loading}
              style={{
                width: "120px",
                border: "none",
                borderRadius: "10px",
                background: loading
                  ? "#475569"
                  : "#06b6d4",
                color: "white",
                fontWeight: "bold",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {loading ? "Scanning..." : "Scan"}
            </button>
          </div>

          {scanResult && (
            <div
              style={{
                marginTop: "30px",
                padding: "25px",
                borderRadius: "14px",
                background: "#0f172a",
                border:
                  scanResult.prediction === "Safe"
                    ? "1px solid #166534"
                    : "1px solid #991b1b",
              }}
            >
              <h2>Scan Result</h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "1px solid #1e293b",
                }}
              >
                <span style={{ color: "#94a3b8" }}>
                  Status
                </span>

                <strong style={{ color: "#22d3ee" }}>
                  {scanResult.status}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  padding: "12px 0",
                  borderBottom: "1px solid #1e293b",
                }}
              >
                <span style={{ color: "#94a3b8" }}>
                  URL
                </span>

                <strong
                  style={{
                    color: "#e2e8f0",
                    wordBreak: "break-all",
                    textAlign: "right",
                  }}
                >
                  {scanResult.url}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "1px solid #1e293b",
                }}
              >
                <span style={{ color: "#94a3b8" }}>
                  Prediction
                </span>

                <strong
                  style={{
                    color:
                      scanResult.prediction === "Safe"
                        ? "#22c55e"
                        : "#ef4444",
                    fontSize: "18px",
                  }}
                >
                  {scanResult.prediction}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                <span style={{ color: "#94a3b8" }}>
                  Confidence
                </span>

                <strong
                  style={{
                    color: "#22d3ee",
                    fontSize: "18px",
                  }}
                >
                  {Number(
                    scanResult.confidence || 0
                  ).toFixed(2)}
                  %
                </strong>
              </div>

              <div
                style={{
                  marginTop: "15px",
                  height: "10px",
                  background: "#1e293b",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      Number(scanResult.confidence || 0),
                      100
                    )}%`,
                    height: "100%",
                    background:
                      scanResult.prediction === "Safe"
                        ? "#22c55e"
                        : "#ef4444",
                    borderRadius: "10px",
                  }}
                />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
