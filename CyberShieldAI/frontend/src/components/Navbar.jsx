import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      style={{
        height: "80px",
        background: "#020617",
        borderBottom: "1px solid #1e293b",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 5%",
        boxSizing: "border-box",
      }}
    >
      {/* LOGO */}

      <Link
        to="/choose-scanner"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          textDecoration: "none",
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
          🛡️
        </div>

        <div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "white",
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

      {/* NAVIGATION */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "30px",
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
          🏠 Dashboard
        </Link>

        <Link
          to="/history"
          style={{
            color: "#cbd5e1",
            textDecoration: "none",
            fontSize: "15px",
          }}
        >
          📜 History
        </Link>

        <Link
          to="/profile"
          style={{
            color: "#cbd5e1",
            textDecoration: "none",
            fontSize: "15px",
          }}
        >
          👤 Profile
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
  );
}