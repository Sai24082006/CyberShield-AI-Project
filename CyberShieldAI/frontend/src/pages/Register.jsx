import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Registration failed."
        );
      }

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background effects */}

      <div className="grid-background"></div>

      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      {/* Brand */}

      <div className="brand">
        <h1>
          CyberShield<span>AI</span>
        </h1>

        <p>AI-Powered Phishing Detection</p>
      </div>

      {/* Register Card */}

      <div className="auth-card">
        <h2>Create Account</h2>

        <p className="subtitle">
          Create your CyberShieldAI account.
        </p>

        <form onSubmit={handleRegister}>
          {/* Name */}

          <label>Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
          />

          {/* Email */}

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />

          {/* Password */}

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
          />

          {/* Confirm Password */}

          <label>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />

          {/* Error */}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {/* Register */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* Login */}

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </div>

      {/* CSS */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #020617;
        }

        .auth-page {
          min-height: 100vh;
          background: #020617;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: 25px 20px 50px;
        }

        /* Grid */

        .grid-background {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(
              rgba(14, 165, 233, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(14, 165, 233, 0.08) 1px,
              transparent 1px
            );
          background-size: 50px 50px;
          pointer-events: none;
        }

        /* Glow */

        .glow {
          position: fixed;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          pointer-events: none;
        }

        .glow-one {
          background: #06b6d4;
          top: -100px;
          left: -100px;
        }

        .glow-two {
          background: #7c3aed;
          bottom: -120px;
          right: -100px;
        }

        /* Brand */

        .brand {
          text-align: center;
          position: relative;
          z-index: 2;
          margin-bottom: 30px;
        }

        .brand h1 {
          margin: 0;
          font-size: 38px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .brand h1 span {
          color: #06b6d4;
        }

        .brand p {
          margin-top: 8px;
          color: #94a3b8;
          font-size: 15px;
        }

        /* Card */

        .auth-card {
          width: 100%;
          max-width: 480px;
          background: rgba(15, 23, 42, 0.94);
          border: 1px solid #164e63;
          border-radius: 18px;
          padding: 32px;
          position: relative;
          z-index: 2;
          box-shadow:
            0 0 40px rgba(6, 182, 212, 0.08),
            0 20px 60px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
        }

        .auth-card h2 {
          margin: 0;
          font-size: 28px;
        }

        .subtitle {
          color: #94a3b8;
          margin: 10px 0 25px;
        }

        /* Form */

        form {
          display: flex;
          flex-direction: column;
        }

        label {
          margin-bottom: 8px;
          color: #e2e8f0;
          font-size: 14px;
        }

        input {
          width: 100%;
          padding: 14px 15px;
          margin-bottom: 18px;
          border-radius: 10px;
          border: 1px solid #334155;
          background: #1e293b;
          color: white;
          font-size: 15px;
          outline: none;
          transition: 0.2s;
        }

        input::placeholder {
          color: #64748b;
        }

        input:focus {
          border-color: #06b6d4;
          box-shadow:
            0 0 0 3px rgba(6, 182, 212, 0.1);
        }

        /* Button */

        button {
          margin-top: 8px;
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 10px;
          background: #06b6d4;
          color: #001018;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        button:hover {
          background: #22d3ee;
          transform: translateY(-1px);
          box-shadow:
            0 8px 25px rgba(6, 182, 212, 0.25);
        }

        button:disabled {
          background: #475569;
          color: #cbd5e1;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Messages */

        .error-message {
          background: rgba(127, 29, 29, 0.25);
          border: 1px solid #7f1d1d;
          color: #fca5a5;
          padding: 11px;
          border-radius: 8px;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .success-message {
          background: rgba(6, 95, 70, 0.25);
          border: 1px solid #047857;
          color: #6ee7b7;
          padding: 11px;
          border-radius: 8px;
          margin-bottom: 12px;
          font-size: 14px;
        }

        /* Login link */

        .login-link {
          text-align: center;
          color: #94a3b8;
          margin-top: 24px;
          margin-bottom: 0;
          font-size: 14px;
        }

        .login-link a {
          color: #22d3ee;
          font-weight: 700;
          text-decoration: none;
        }

        .login-link a:hover {
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .brand h1 {
            font-size: 32px;
          }

          .auth-card {
            padding: 25px;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;