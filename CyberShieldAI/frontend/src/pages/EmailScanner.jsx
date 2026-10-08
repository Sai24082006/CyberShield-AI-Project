import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function EmailScanner() {
  const navigate = useNavigate();

  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scanEmail = async () => {
    if (!subject.trim() && !body.trim()) {
      setError("Please enter an email subject or body.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await API.post(
        "/email/scan",
        {
          sender: sender,
          subject: subject,
          body: body,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      console.log("Email scan result:", data);

      setResult(data);
    } catch (err) {
      console.error("Email scan error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Unable to scan email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        paddingBottom: "50px",
      }}
    >
      {/* NAVBAR */}

      <nav
        style={{
          height: "80px",
          background: "#020617",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 5%",
        }}
      >
        <button
          onClick={() => navigate("/choose-scanner")}
          style={{
            background: "none",
            border: "none",
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ??? CyberShieldAI
        </button>

        <button
          onClick={() => navigate("/choose-scanner")}
          style={{
            background: "none",
            border: "none",
            color: "#22d3ee",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          ? Back
        </button>
      </nav>

      {/* MAIN */}

      <main
        style={{
          width: "90%",
          maxWidth: "1000px",
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
            ?? Email Phishing Scanner
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Analyze an email for potential phishing threats.
          </p>

          {/* SENDER */}

          <label
            style={{
              display: "block",
              marginTop: "25px",
              marginBottom: "8px",
              color: "#cbd5e1",
            }}
          >
            Sender Email
          </label>

          <input
            type="email"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="example@gmail.com"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #334155",
              background: "#1e293b",
              color: "white",
              outline: "none",
            }}
          />

          {/* SUBJECT */}

          <label
            style={{
              display: "block",
              marginTop: "20px",
              marginBottom: "8px",
              color: "#cbd5e1",
            }}
          >
            Email Subject
          </label>

          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #334155",
              background: "#1e293b",
              color: "white",
              outline: "none",
            }}
          />

          {/* BODY */}

          <label
            style={{
              display: "block",
              marginTop: "20px",
              marginBottom: "8px",
              color: "#cbd5e1",
            }}
          >
            Email Content
          </label>

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste the email content here..."
            style={{
              width: "100%",
              minHeight: "220px",
              boxSizing: "border-box",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #334155",
              background: "#1e293b",
              color: "white",
              outline: "none",
              resize: "vertical",
              fontFamily: "Arial, sans-serif",
              lineHeight: "1.5",
            }}
          />

          {/* ERROR */}

          {error && (
            <div
              style={{
                marginTop: "20px",
                padding: "12px",
                borderRadius: "8px",
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.4)",
                color: "#f87171",
              }}
            >
              {error}
            </div>
          )}

          {/* BUTTON */}

          <button
            onClick={scanEmail}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "25px",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              background: loading
                ? "#475569"
                : "#06b6d4",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading ? "Scanning Email..." : "Scan Email"}
          </button>

          {/* RESULT */}

          {result && (
            <div
              style={{
                marginTop: "30px",
                padding: "25px",
                borderRadius: "14px",
                background: "#0f172a",
                border: "1px solid #155e75",
              }}
            >
              <h2>Scan Result</h2>

              {Object.entries(result).map(
                ([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "20px",
                      padding: "12px 0",
                      borderBottom:
                        "1px solid #1e293b",
                    }}
                  >
                    <span
                      style={{
                        color: "#94a3b8",
                        textTransform: "capitalize",
                      }}
                    >
                      {key.replace(/_/g, " ")}
                    </span>

                    <strong
                      style={{
                        color: "#22d3ee",
                        textAlign: "right",
                        wordBreak: "break-word",
                      }}
                    >
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </strong>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default EmailScanner;
