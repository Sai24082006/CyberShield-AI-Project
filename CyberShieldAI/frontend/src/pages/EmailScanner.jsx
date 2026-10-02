import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/email/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: sender,
          subject: subject,
          body: body,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Email scanning failed.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Unable to connect to CyberShield AI.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setSender("");
    setSubject("");
    setBody("");
    setResult(null);
    setError("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <button
            onClick={() => navigate("/choose-scanner")}
            style={styles.backButton}
          >
            ← Back
          </button>

          <div style={styles.logoSection}>
            <div style={styles.logo}>🛡️</div>

            <div>
              <h1 style={styles.title}>CyberShield AI</h1>
              <p style={styles.subtitle}>Email Phishing Scanner</p>
            </div>
          </div>
        </div>

        {/* MAIN CARD */}
        <div style={styles.card}>

          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                📧 Analyze Suspicious Email
              </h2>

              <p style={styles.cardDescription}>
                Check an email for common phishing indicators,
                suspicious links, credential requests and financial scams.
              </p>
            </div>
          </div>

          {/* SENDER */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Sender Email
            </label>

            <input
              type="email"
              placeholder="example@domain.com"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* SUBJECT */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Email Subject
            </label>

            <input
              type="text"
              placeholder="Enter email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* BODY */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Email Content
            </label>

            <textarea
              placeholder="Paste the email content here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={styles.textarea}
            />
          </div>

          {/* ERROR */}
          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          {/* BUTTONS */}
          <div style={styles.buttonRow}>

            <button
              onClick={scanEmail}
              disabled={loading}
              style={{
                ...styles.scanButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "🔍 Scanning..." : "🔍 Scan Email"}
            </button>

            <button
              onClick={clearAll}
              style={styles.clearButton}
            >
              Clear
            </button>

          </div>
        </div>

        {/* RESULT */}
        {result && (
          <div style={styles.resultCard}>

            <h2 style={styles.resultTitle}>
              🛡️ Scan Result
            </h2>

            {/* PREDICTION */}
            <div style={styles.resultGrid}>

              <div style={styles.resultBox}>
                <span style={styles.resultLabel}>
                  Prediction
                </span>

                <span
                  style={{
                    ...styles.prediction,
                    color:
                      result.prediction === "Phishing"
                        ? "#ff4d6d"
                        : result.prediction === "Suspicious"
                        ? "#ffb703"
                        : "#00e676",
                  }}
                >
                  {result.prediction}
                </span>
              </div>

              {/* RISK */}
              <div style={styles.resultBox}>
                <span style={styles.resultLabel}>
                  Risk Level
                </span>

                <span
                  style={{
                    ...styles.risk,
                    color:
                      result.risk_level === "High"
                        ? "#ff4d6d"
                        : result.risk_level === "Medium"
                        ? "#ffb703"
                        : "#00e676",
                  }}
                >
                  {result.risk_level}
                </span>
              </div>

              {/* CONFIDENCE */}
              <div style={styles.resultBox}>
                <span style={styles.resultLabel}>
                  Confidence
                </span>

                <span style={styles.confidence}>
                  {result.confidence}%
                </span>
              </div>
            </div>

            {/* MESSAGE */}
            <div style={styles.messageBox}>
              <h3 style={styles.sectionTitle}>
                Analysis
              </h3>

              <p style={styles.message}>
                {result.message}
              </p>
            </div>

            {/* INDICATORS */}
            {result.indicators && result.indicators.length > 0 && (
              <div style={styles.indicatorSection}>

                <h3 style={styles.sectionTitle}>
                  ⚠️ Detected Indicators
                </h3>

                <div style={styles.indicatorList}>
                  {result.indicators.map((indicator, index) => (
                    <div
                      key={index}
                      style={styles.indicator}
                    >
                      <span style={styles.indicatorIcon}>
                        ⚠
                      </span>

                      <span>
                        {indicator}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* URLS */}
            {result.urls && result.urls.length > 0 && (
              <div style={styles.urlSection}>

                <h3 style={styles.sectionTitle}>
                  🔗 URLs Detected
                </h3>

                {result.urls.map((url, index) => (
                  <div
                    key={index}
                    style={styles.urlBox}
                  >
                    {url}
                  </div>
                ))}

              </div>
            )}

            {/* ANALYSIS TYPE */}
            {result.analysis_type && (
              <div style={styles.analysisType}>
                <span>
                  Analysis Type:
                </span>

                <strong>
                  {result.analysis_type}
                </strong>
              </div>
            )}

          </div>
        )}

        {/* FOOTER */}
        <div style={styles.footer}>
          <p>
            🛡️ CyberShield AI • AI-Powered Phishing Detection
          </p>
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #020617 0%, #07152d 50%, #020617 100%)",
    color: "#ffffff",
    padding: "30px 20px",
    fontFamily:
      "Inter, Arial, Helvetica, sans-serif",
  },

  container: {
    maxWidth: "950px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "15px",
  },

  backButton: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#ffffff",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
  },

  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logo: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #00c6ff, #0072ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
  },

  title: {
    margin: 0,
    fontSize: "25px",
    fontWeight: "700",
  },

  subtitle: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: "14px",
  },

  card: {
    background: "rgba(15, 23, 42, 0.92)",
    border:
      "1px solid rgba(148,163,184,0.15)",
    borderRadius: "18px",
    padding: "30px",
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.35)",
  },

  cardHeader: {
    marginBottom: "25px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "22px",
  },

  cardDescription: {
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "1.6",
    marginTop: "8px",
  },

  inputGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#e2e8f0",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#020617",
    border:
      "1px solid rgba(148,163,184,0.2)",
    borderRadius: "10px",
    padding: "13px 14px",
    color: "#ffffff",
    outline: "none",
    fontSize: "14px",
  },

  textarea: {
    width: "100%",
    minHeight: "190px",
    boxSizing: "border-box",
    resize: "vertical",
    background: "#020617",
    border:
      "1px solid rgba(148,163,184,0.2)",
    borderRadius: "10px",
    padding: "14px",
    color: "#ffffff",
    outline: "none",
    fontSize: "14px",
    lineHeight: "1.6",
    fontFamily: "inherit",
  },

  errorBox: {
    background:
      "rgba(239,68,68,0.1)",
    border:
      "1px solid rgba(239,68,68,0.3)",
    color: "#ff7b8f",
    padding: "12px 15px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
  },

  buttonRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  scanButton: {
    flex: 1,
    minWidth: "180px",
    border: "none",
    borderRadius: "10px",
    padding: "14px 20px",
    background:
      "linear-gradient(135deg, #00c6ff, #0072ff)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  clearButton: {
    border:
      "1px solid rgba(148,163,184,0.25)",
    borderRadius: "10px",
    padding: "14px 25px",
    background: "transparent",
    color: "#cbd5e1",
    fontSize: "15px",
    cursor: "pointer",
  },

  resultCard: {
    marginTop: "25px",
    background: "rgba(15,23,42,0.95)",
    border:
      "1px solid rgba(0,198,255,0.18)",
    borderRadius: "18px",
    padding: "30px",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.3)",
  },

  resultTitle: {
    marginTop: 0,
    marginBottom: "25px",
    fontSize: "21px",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
  },

  resultBox: {
    background: "#020617",
    borderRadius: "12px",
    padding: "18px",
    border:
      "1px solid rgba(148,163,184,0.12)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  resultLabel: {
    color: "#94a3b8",
    fontSize: "13px",
  },

  prediction: {
    fontSize: "20px",
    fontWeight: "700",
  },

  risk: {
    fontSize: "20px",
    fontWeight: "700",
  },

  confidence: {
    color: "#38bdf8",
    fontSize: "20px",
    fontWeight: "700",
  },

  messageBox: {
    marginTop: "20px",
    padding: "18px",
    background:
      "rgba(56,189,248,0.06)",
    border:
      "1px solid rgba(56,189,248,0.12)",
    borderRadius: "12px",
  },

  sectionTitle: {
    margin: "0 0 10px",
    fontSize: "16px",
  },

  message: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  indicatorSection: {
    marginTop: "25px",
  },

  indicatorList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  indicator: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "12px 14px",
    background:
      "rgba(255,77,109,0.06)",
    border:
      "1px solid rgba(255,77,109,0.12)",
    borderRadius: "10px",
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  indicatorIcon: {
    color: "#ff4d6d",
    fontWeight: "bold",
  },

  urlSection: {
    marginTop: "25px",
  },

  urlBox: {
    background: "#020617",
    border:
      "1px solid rgba(148,163,184,0.15)",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "8px",
    color: "#38bdf8",
    fontSize: "13px",
    wordBreak: "break-all",
  },

  analysisType: {
    marginTop: "25px",
    paddingTop: "18px",
    borderTop:
      "1px solid rgba(148,163,184,0.12)",
    color: "#64748b",
    fontSize: "12px",
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },

  footer: {
    textAlign: "center",
    marginTop: "30px",
    color: "#64748b",
    fontSize: "12px",
  },
};

export default EmailScanner;