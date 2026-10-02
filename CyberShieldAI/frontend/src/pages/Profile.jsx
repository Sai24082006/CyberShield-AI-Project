import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    total_scans: 0,
    safe_urls: 0,
    phishing_urls: 0,
  });

  const [loading, setLoading] = useState(true);

  // ==============================
  // Load Profile
  // ==============================

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      /*
       * Change this endpoint if your backend
       * uses a different profile endpoint.
       */
      const response = await API.get("/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile response:", response.data);

      setProfile(response.data);

    } catch (error) {
      console.error("Profile error:", error);

      /*
       * If /profile/ doesn't exist yet,
       * we still show the profile page.
       */
      setProfile({
        name: "User",
        email: "User account",
      });

    } finally {
      setLoading(false);
    }
  };


  // ==============================
  // Load Dashboard Statistics
  // ==============================

  const loadStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/dashboard/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats({
        total_scans: response.data.total_scans || 0,
        safe_urls: response.data.safe_urls || 0,
        phishing_urls: response.data.phishing_urls || 0,
      });

    } catch (error) {
      console.error("Stats error:", error);
    }
  };


  // ==============================
  // Logout
  // ==============================

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };


  // ==============================
  // Load Data
  // ==============================

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);


  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">

        <p className="text-gray-400">
          Loading profile...
        </p>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-950 text-white">


      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">

        <div className="max-w-7xl mx-auto px-6 py-4">

          <div className="flex items-center justify-between">


            {/* Logo */}

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3"
            >

              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">

                <span className="text-cyan-400 text-xl">
                  🛡
                </span>

              </div>


              <div>

                <h1 className="text-lg font-bold text-white">
                  CyberShieldAI
                </h1>

                <p className="text-xs text-gray-500">
                  Threat Detection
                </p>

              </div>

            </button>


            {/* Navigation */}

            <div className="flex items-center gap-2">


              {/* Dashboard */}

              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition"
              >
                🏠 Dashboard
              </button>


              {/* Profile */}

              <button
                className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
              >
                👤 Profile
              </button>


              {/* Logout */}

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </nav>


      {/* =====================================
          PROFILE CONTENT
      ===================================== */}

      <main className="max-w-5xl mx-auto px-6 py-10">


        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-white">
            Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Manage your CyberShieldAI account
          </p>

        </div>


        {/* =====================================
            PROFILE CARD
        ===================================== */}

        <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-8 shadow-xl">


          {/* User Header */}

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">


            {/* Avatar */}

            <div className="w-24 h-24 rounded-full bg-cyan-500/10 border-2 border-cyan-500/30 flex items-center justify-center">

              <span className="text-4xl">
                👤
              </span>

            </div>


            {/* User Info */}

            <div>

              <h2 className="text-3xl font-bold text-white">
                {profile?.name || "User"}
              </h2>

              <p className="text-gray-400 mt-1">
                {profile?.email || "No email available"}
              </p>

              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">

                <span className="w-2 h-2 rounded-full bg-green-400" />

                <span className="text-green-400 text-sm font-semibold">
                  Active Account
                </span>

              </div>

            </div>

          </div>


          {/* Divider */}

          <div className="border-t border-slate-800 my-8" />


          {/* =====================================
              ACCOUNT INFORMATION
          ===================================== */}

          <h3 className="text-xl font-bold text-white mb-5">
            Account Information
          </h3>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


            {/* Name */}

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Full Name
              </p>

              <p className="text-white font-semibold mt-2">
                {profile?.name || "User"}
              </p>

            </div>


            {/* Email */}

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Email Address
              </p>

              <p className="text-white font-semibold mt-2 break-all">
                {profile?.email || "No email available"}
              </p>

            </div>


            {/* Account Type */}

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Account Type
              </p>

              <p className="text-cyan-400 font-semibold mt-2">
                Standard User
              </p>

            </div>


            {/* Status */}

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Account Status
              </p>

              <p className="text-green-400 font-semibold mt-2">
                Active
              </p>

            </div>

          </div>


          {/* =====================================
              SCAN STATISTICS
          ===================================== */}

          <div className="border-t border-slate-800 my-8" />


          <h3 className="text-xl font-bold text-white mb-5">
            Scan Statistics
          </h3>


          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">


            {/* Total */}

            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Total Scans
              </p>

              <p className="text-3xl font-bold text-cyan-400 mt-2">
                {stats.total_scans}
              </p>

            </div>


            {/* Safe */}

            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Safe URLs
              </p>

              <p className="text-3xl font-bold text-green-400 mt-2">
                {stats.safe_urls}
              </p>

            </div>


            {/* Phishing */}

            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">

              <p className="text-gray-500 text-sm">
                Phishing URLs
              </p>

              <p className="text-3xl font-bold text-red-400 mt-2">
                {stats.phishing_urls}
              </p>

            </div>

          </div>


          {/* =====================================
              SECURITY
          ===================================== */}

          <div className="border-t border-slate-800 my-8" />


          <h3 className="text-xl font-bold text-white mb-5">
            Security
          </h3>


          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 flex items-center justify-between">

            <div>

              <p className="text-white font-semibold">
                🔐 Password
              </p>

              <p className="text-gray-500 text-sm mt-1">
                Your password is securely stored.
              </p>

            </div>

            <span className="text-green-400 text-sm font-semibold">
              Protected
            </span>

          </div>


          {/* =====================================
              ACTIONS
          ===================================== */}

          <div className="border-t border-slate-800 my-8" />


          <div className="flex flex-col sm:flex-row gap-4">


            {/* Dashboard */}

            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold transition"
            >
              ← Back to Dashboard
            </button>


            {/* Logout */}

            <button
              onClick={handleLogout}
              className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-semibold transition"
            >
              Logout
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}