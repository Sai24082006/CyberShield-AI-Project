import React from "react";
import { useNavigate } from "react-router-dom";

function ChooseScanner() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            CyberShield<span style={styles.ai}>AI</span>
          </h1>

          <p style={styles.subtitle}>
            What would you like to scan?
          </p>
        </div>

        {/* SCANNER CARDS */}
        <div style={styles.cards}>

          {/* URL SCANNER */}
          <div
            style={{
              ...styles.card,
              borderColor: "rgba(0, 198, 255, 0.25)",
            }}
          >
            <div
              style={{
                ...styles.iconBox,
                background: "rgba(0, 198, 255, 0.10)",
                borderColor: "rgba(0, 198, 255, 0.25)",
              }}
            >
              🔗
            </div>

            <h2 style={styles.cardTitle}>
              Scan URL
            </h2>

            <p style={styles.cardDescription}>
              Check a website URL using CyberShield AI's
              phishing detection model.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              style={{
                ...styles.scanButton,
                color: "#00d9ff",
              }}
            >
              Scan Website →
            </button>
          </div>

          {/* QR SCANNER */}
          <div
            style={{
              ...styles.card,
              borderColor: "rgba(180, 90, 255, 0.25)",
            }}
          >
            <div
              style={{
                ...styles.iconBox,
                background: "rgba(180, 90, 255, 0.10)",
                borderColor: "rgba(180, 90, 255, 0.25)",
              }}
            >
              📷
            </div>

            <h2 style={styles.cardTitle}>
              Scan QR Code
            </h2>

            <p style={styles.cardDescription}>
              Upload a QR code image and automatically check
              the embedded URL for phishing threats.
            </p>

            <button
              onClick={() => navigate("/qr-scanner")}
              style={{
                ...styles.scanButton,
                color: "#c86cff",
              }}
            >
              Scan QR Code →
            </button>
          </div>

          {/* EMAIL SCANNER */}
          <div
            style={{
              ...styles.card,
              borderColor: "rgba(0, 230, 118, 0.25)",
            }}
          >
            <div
              style={{
                ...styles.iconBox,
                background: "rgba(0, 230, 118, 0.10)",
                borderColor: "rgba(0, 230, 118, 0.25)",
              }}
            >
              📧
            </div>

            <h2 style={styles.cardTitle}>
              Scan Email
            </h2>

            <p style={styles.cardDescription}>
              Analyze email content for phishing indicators,
              suspicious links, credential requests and scams.
            </p>

            <button
              onClick={() => navigate("/scan-email")}
              style={{
                ...styles.scanButton,
                color: "#00e676",
              }}
            >
              Scan Email →
            </button>
          </div>

        </div>

        {/* DASHBOARD */}
        <button
          onClick={() => navigate("/dashboard")}
          style={styles.dashboardButton}
        >
          Go to Dashboard
        </button>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    color: "#ffffff",
    padding: "60px 20px",
    fontFamily: "Arial, Helvetica, sans-serif",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  header: {
    textAlign: "center",
    marginBottom: "50px",
  },

  title: {
    margin: 0,
    fontSize: "46px",
    fontWeight: "700",
    letterSpacing: "-1px",
  },

  ai: {
    color: "#00d9ff",
  },

  subtitle: {
    marginTop: "12px",
    color: "#94a3b8",
    fontSize: "18px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "32px",
  },

  card: {
    background: "#111827",
    border: "1px solid",
    borderRadius: "16px",
    padding: "32px",
    minHeight: "230px",
    boxSizing: "border-box",
    transition: "transform 0.2s ease",
  },

  iconBox: {
    width: "62px",
    height: "62px",
    borderRadius: "16px",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    marginBottom: "25px",
  },

  cardTitle: {
    margin: "0 0 14px",
    fontSize: "24px",
    fontWeight: "700",
  },

  cardDescription: {
    color: "#a7b1c2",
    fontSize: "15px",
    lineHeight: "1.7",
    minHeight: "52px",
    margin: "0 0 22px",
  },

  scanButton: {
    background: "transparent",
    border: "none",
    padding: 0,
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  dashboardButton: {
    display: "block",
    margin: "45px auto 0",
    background: "transparent",
    border: "none",
    color: "#64748b",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default ChooseScanner;