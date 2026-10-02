import { FaBell, FaUserCircle } from "react-icons/fa";

export default function Topbar() {
  return (
    <div className="h-20 bg-slate-900 border-b border-cyan-500/20 flex items-center justify-between px-8">

      {/* Left */}

      <div>

        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-gray-400 text-sm">
          AI Powered Phishing Detection System
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        {/* Notification */}

        <button className="relative text-gray-300 hover:text-cyan-400 transition">

          <FaBell size={22} />

          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>

        </button>

        {/* User */}

        <div className="flex items-center gap-3">

          <FaUserCircle
            size={40}
            className="text-cyan-400"
          />

          <div>

            <h2 className="text-white font-semibold">
              Sai
            </h2>

            <p className="text-gray-400 text-sm">
              Cyber Analyst
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}