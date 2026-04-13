// ============================================================
// Header.jsx — barre AWS : navy + logo orange + nav monospace
// ============================================================
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AWS_NAVY   = "#232f3e";
const AWS_ORANGE = "#ff9900";

export default function Header() {
  const { authed, logout } = useAuth();

  // --- Déconnexion + notification toast ---
  function handleLogout() {
    logout();
    toast.success("Signed out");
  }

  // --- Style partagé pour les liens de navigation ---
  const navLink = {
    padding: "5px 12px", borderRadius: 4,
    fontSize: 13, fontWeight: 500, fontFamily: "monospace",
    color: "#ccc", textDecoration: "none", letterSpacing: ".02em",
    transition: "color .15s",
  };

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: AWS_NAVY,
      borderBottom: `3px solid ${AWS_ORANGE}`,
    }}>
      <div style={{
        maxWidth: 1152, margin: "0 auto", padding: "0 16px",
        height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* Logo — "aws" orange + nom de la plateforme */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span style={{ color: AWS_ORANGE, fontWeight: 700, fontSize: 18, letterSpacing: "-.3px" }}>
            aws
          </span>
          <span style={{ width: 1, height: 18, background: "#4a5568" }} />
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, letterSpacing: ".01em" }}>
            CertVerify by HCLTech
          </span>
        </Link>

        {/* Navigation principale */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>

          {/* Lien Verify — toujours visible */}
          <Link to="/" style={navLink}>Verify</Link>

          {/* Liens réservés aux admins authentifiés */}
          {authed ? (
            <>
              <Link to="/admin"            style={navLink}>Dashboard</Link>
              <Link to="/admin/templates"  style={navLink}>Certifications</Link>

              {/* Séparateur vertical avant Sign out */}
              <span style={{ width: 1, height: 18, background: "#4a5568", margin: "0 6px" }} />

              <button
                onClick={handleLogout}
                style={{
                  padding: "5px 12px", borderRadius: 4, fontSize: 13,
                  fontFamily: "monospace", fontWeight: 600, cursor: "pointer",
                  background: "transparent", color: "#f87171",
                  border: "1px solid #7f1d1d", letterSpacing: ".02em",
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            // Bouton Admin — orange AWS, caché par défaut (hidden via display none)
            <Link
              to="/admin/login"
              style={{ display: "none" }}
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}