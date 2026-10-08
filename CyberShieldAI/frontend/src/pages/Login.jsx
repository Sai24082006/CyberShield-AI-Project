import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      if (data.status !== "success" || !data.access_token) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.access_token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/choose-scanner");
    } catch (err) {
      console.error("Login error:", err);

      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      <div style={styles.grid}></div>

      <div style={{ ...styles.particle, top: "15%", left: "10%" }}></div>
      <div style={{ ...styles.particle, top: "30%", left: "85%" }}></div>
      <div style={{ ...styles.particle, top: "70%", left: "15%" }}></div>
      <div style={{ ...styles.particle, top: "80%", left: "80%" }}></div>

      <div style={styles.brand}>
        <h1>
          CyberShield<span>AI</span>
        </h1>

        <p>AI-Powered Phishing Detection</p>
      </div>

      <div style={styles.card}>

        <h2>Welcome Back</h2>

        <p style={styles.subtitle}>
          Login to protect yourself from online threats.
        </p>

        <form onSubmit={handleLogin}>

          <label style={styles.label}>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            autoComplete="email"
          />

          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            autoComplete="current-password"
          />

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div style={styles.register}>
          Don't have an account?

          <button
            type="button"
            onClick={() => navigate("/register")}
            style={styles.registerButton}
          >
            Create Account
          </button>
        </div>

      </div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background:
      "radial-gradient(circle at 50% 20%, #071b35 0%, #020617 45%, #01030b 100%)",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  grid: {
    position: "absolute",
    inset: 0,
    opacity: 0.22,
    backgroundImage:
      "linear-gradient(rgba(0, 200, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 200, 255, 0.15) 1px, transparent 1px)",
    backgroundSize: "45px 45px",
    maskImage:
      "linear-gradient(to bottom, black, transparent 90%)",
    WebkitMaskImage:
      "linear-gradient(to bottom, black, transparent 90%)",
    pointerEvents: "none",
  },

  particle: {
    position: "absolute",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "#00d9ff",
    boxShadow: "0 0 15px #00d9ff",
    opacity: 0.7,
    pointerEvents: "none",
  },

  brand: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    marginTop: "25px",
    marginBottom: "30px",
  },

  card: {
    position: "relative",
    zIndex: 2,
    width: "min(420px, calc(100% - 40px))",
    padding: "34px",
    borderRadius: "18px",
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(0, 200, 255, 0.35)",
    boxShadow:
      "0 0 35px rgba(0, 200, 255, 0.08), 0 20px 60px rgba(0,0,0,0.4)",
    backdropFilter: "blur(14px)",
  },

  subtitle: {
    color: "#94a3b8",
    marginBottom: "28px",
    fontSize: "15px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "18px",
    color: "#e2e8f0",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#ffffff",
    fontSize: "15px",
    outline: "none",
  },

  button: {
    width: "100%",
    marginTop: "25px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #06b6d4, #0891b2)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(6, 182, 212, 0.25)",
  },

  error: {
    marginTop: "15px",
    padding: "10px",
    borderRadius: "8px",
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    color: "#f87171",
    fontSize: "14px",
  },

  register: {
    textAlign: "center",
    marginTop: "25px",
    color: "#94a3b8",
    fontSize: "14px",
  },

  registerButton: {
    marginLeft: "5px",
    border: "none",
    background: "transparent",
    color: "#00d9ff",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Login;
