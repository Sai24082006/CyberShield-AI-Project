import {
  FaShieldAlt,
  FaChartBar,
  FaSearch,
  FaHistory,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menu = [
    {
      name: "Dashboard",
      icon: <FaChartBar />,
      path: "/dashboard",
    },
    {
      name: "Scanner",
      icon: <FaSearch />,
      path: "/dashboard",
    },
    {
      name: "History",
      icon: <FaHistory />,
      path: "/history",
    },
    {
      name: "Profile",
      icon: <FaUser />,
      path: "/profile",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-cyan-500/20 flex flex-col">

      {/* LOGO */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center">
            <FaShieldAlt className="text-white text-xl" />
          </div>

          <div>
            <h2 className="text-white font-bold text-xl">
              CyberShieldAI
            </h2>

            <p className="text-cyan-400 text-sm">
              Threat Detection
            </p>
          </div>

        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-4">

        <p className="text-xs uppercase tracking-wider text-gray-500 px-4 mb-3">
          Navigation
        </p>

        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 mb-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                  : "text-gray-300 hover:bg-slate-800 hover:text-cyan-400"
              }`
            }
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span className="font-medium">
              {item.name}
            </span>
          </NavLink>
        ))}

      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-slate-700">

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition text-white font-medium"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </aside>
  );
}