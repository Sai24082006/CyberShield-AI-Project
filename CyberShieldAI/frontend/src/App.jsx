import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ============================================================
// PAGES
// ============================================================

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ChooseScanner from "./pages/ChooseScanner";
import QRScanner from "./pages/QRScanner";
import EmailScanner from "./pages/EmailScanner";
import History from "./pages/History";

// ============================================================
// APP
// ============================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* AUTHENTICATION */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* SCANNER SELECTION */}
        <Route
          path="/choose-scanner"
          element={<ChooseScanner />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* QR SCANNER */}
        <Route
          path="/qr-scanner"
          element={<QRScanner />}
        />

        {/* EMAIL SCANNER */}
        <Route
          path="/scan-email"
          element={<EmailScanner />}
        />

        {/* HISTORY */}
        <Route
          path="/history"
          element={<History />}
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* UNKNOWN ROUTE */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;