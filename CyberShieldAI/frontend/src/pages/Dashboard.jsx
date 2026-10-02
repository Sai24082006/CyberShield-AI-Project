import { useState } from "react";

function Dashboard() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================================
  // URL SCANNER
  // =========================================================

  const handleUrlScan = async () => {
    if (!url.trim()) {
      alert("Please enter a URL.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/scan/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },

          body: JSON.stringify({
            url: url.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "URL scanning failed."
        );
      }

      console.log("URL scan result:", data);

      alert(
        `Prediction: ${
          data.prediction ||
          data.result ||
          "Unknown"
        }`
      );
    } catch (error) {
      console.error("URL scan error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <nav
        style={{
          height: "80px",
          borderBottom:
            "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 5%",
          boxSizing: "border-box",
        }}
      >
        {/* LOGO */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              border:
                "1px solid #0891b2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#22d3ee",
              fontSize: "20px",
            }}
          >
            🛡
          </div>

          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
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
        </div>

        {/* NAV LINKS */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "35px",
          }}
        >
          <a
            href="/dashboard"
            style={{
              color: "#22d3ee",
              textDecoration: "none",
            }}
          >
            🏠 Dashboard
          </a>

          <a
            href="/history"
            style={{
              color: "#cbd5e1",
              textDecoration: "none",
            }}
          >
            📜 History
          </a>

          <a
            href="/profile"
            style={{
              color: "#cbd5e1",
              textDecoration: "none",
            }}
          >
            👤 Profile
          </a>

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

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main
        style={{
          width: "90%",
          maxWidth: "1200px",
          margin: "35px auto",
        }}
      >
        {/* TITLE */}

        <h1
          style={{
            fontSize: "36px",
            marginBottom: "5px",
          }}
        >
          CyberShieldAI Dashboard
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "35px",
          }}
        >
          AI-Powered Threat Detection
        </p>

        {/* ================================================= */}
        {/* STAT CARDS */}
        {/* ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          {/* TOTAL */}

          <div
            style={{
              background: "#111827",
              border:
                "1px solid #155e75",
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            <div
              style={{
                color: "#94a3b8",
              }}
            >
              Total Scans
            </div>

            <div
              style={{
                color: "#22d3ee",
                fontSize: "36px",
                fontWeight: "700",
                marginTop: "10px",
              }}
            >
              25
            </div>
          </div>

          {/* SAFE */}

          <div
            style={{
              background: "#111827",
              border:
                "1px solid #065f46",
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            <div
              style={{
                color: "#94a3b8",
              }}
            >
              Safe URLs
            </div>

            <div
              style={{
                color: "#22c55e",
                fontSize: "36px",
                fontWeight: "700",
                marginTop: "10px",
              }}
            >
              20
            </div>
          </div>

          {/* PHISHING */}

          <div
            style={{
              background: "#111827",
              border:
                "1px solid #7f1d1d",
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            <div
              style={{
                color: "#94a3b8",
              }}
            >
              Phishing URLs
            </div>

            <div
              style={{
                color: "#ef4444",
                fontSize: "36px",
                fontWeight: "700",
                marginTop: "10px",
              }}
            >
              5
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* URL SCANNER ONLY */}
        {/* ================================================= */}

        <section
          style={{
            background: "#111827",
            border:
              "1px solid #155e75",
            borderRadius: "16px",
            padding: "28px",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
            }}
          >
            AI URL Scanner
          </h2>

          <p
            style={{
              color: "#94a3b8",
            }}
          >
            Analyze a URL for potential
            phishing threats.
          </p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "25px",
            }}
          >
            <input
              value={url}
              onChange={(e) =>
                setUrl(e.target.value)
              }
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
                border:
                  "1px solid #334155",
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
                width: "110px",
                border: "none",
                borderRadius: "10px",
                background: loading
                  ? "#475569"
                  : "#06b6d4",
                color: "white",
                fontWeight: "700",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {loading
                ? "Scanning..."
                : "Scan"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;