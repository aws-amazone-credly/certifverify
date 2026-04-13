import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home           from "./pages/Home";
import Verify         from "./pages/Verify";
import AdminLogin     from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTemplates from "./pages/AdminTemplates";
import NotFound       from "./pages/NotFound";

function ProtectedRoute({ children }) {
  const { authed } = useAuth();
  return authed ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"             element={<Home />} />
      <Route path="/verify/:code" element={<Verify />} />

      {/* Auth */}
      <Route path="/admin/login"  element={<AdminLogin />} />

      {/* Admin protégé */}
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/templates" element={<ProtectedRoute><AdminTemplates /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
