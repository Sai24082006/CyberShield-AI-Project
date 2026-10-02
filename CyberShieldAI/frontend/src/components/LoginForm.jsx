import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import API from "../services/api";

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);

      alert("Login Successful ✅");

      navigate("/dashboard");

    } catch (err) {
      console.log(err);

      if (err.response) {
        setError(err.response.data.detail || "Login Failed");
      } else {
        setError("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-slate-900/70 border border-cyan-400/30 shadow-[0_0_40px_rgba(6,182,212,0.3)] backdrop-blur-xl p-8">

      <div className="flex flex-col items-center mb-8">

        <div className="w-20 h-20 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/50 mb-5">
          <FaShieldAlt className="text-white text-4xl" />
        </div>

        <h1 className="text-3xl font-bold text-white">
          CyberShieldAI
        </h1>

        <p className="text-gray-400 mt-2">
          AI Powered Threat Detection
        </p>

      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="relative">

          <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
          />

        </div>

        <div className="relative">

          <FaLock className="absolute left-4 top-4 text-gray-400" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4 text-gray-400 hover:text-cyan-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>

        </div>

        <div className="flex justify-end">

          <button
            type="button"
            className="text-sm text-cyan-400"
          >
            Forgot Password?
          </button>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex items-center">
          <div className="flex-1 border-t border-slate-700"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-slate-700"></div>
        </div>

        <p className="text-center text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-cyan-400 font-semibold"
          >
            Register
          </Link>
        </p>

      </form>

    </div>
  );
}