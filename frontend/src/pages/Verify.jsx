// ============================================================
// Verify.jsx — page de résultat style AWS Training & Credly
// ============================================================
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import CertCard from "../components/CertCard";
import { verifyCertificate } from "../lib/api";

const AWS_NAVY   = "#232f3e";
const AWS_ORANGE = "#ff9900";

export default function Verify() {
  const { code } = useParams();
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // --- Appel API de vérification au chargement ou changement de code ---
  useEffect(() => {
    setLoading(true);
    setError(null);
    verifyCertificate(code)
      .then(setResult)
      .catch(() => setError("Unable to reach the server. Please try again."))
      .finally(() => setLoading(false));
  }, [code]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f3f3f3" }}>
      <Header />

      <main style={{ flex: 1, maxWidth: 1152, margin: "0 auto", width: "100%", padding: "32px 16px" }}>

        {/* Lien retour + breadcrumb style AWS console */}
        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/" style={{
            fontSize: 13, color: "#0073bb", textDecoration: "none", fontWeight: 500,
          }}>
            ← New verification
          </Link>
          <span style={{ color: "#aaa", fontSize: 12 }}>/</span>
          <span style={{ fontSize: 13, color: "#555", fontFamily: "monospace" }}>{code}</span>
        </div>

        {/* Titre de la page style AWS console */}
        <div style={{
          background: "#fff", border: "1px solid #ddd", borderRadius: 6,
          borderTop: `3px solid ${AWS_ORANGE}`,
          padding: "14px 20px", marginBottom: 24,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ color: AWS_ORANGE, fontWeight: 700, fontSize: 16 }}>aws</span>
          <span style={{ width: 1, height: 18, background: "#ddd" }} />
          <h2 style={{ fontSize: 15, fontWeight: 700, color: AWS_NAVY, margin: 0 }}>
            Certificate Verification
          </h2>
          <span style={{
            marginLeft: "auto", fontFamily: "monospace", fontSize: 12,
            color: "#0073bb", background: "#e8f4fb", padding: "2px 8px",
            borderRadius: 3, border: "1px solid #b8d9ee",
          }}>
            {code}
          </span>
        </div>

        {/* État de chargement — spinner style AWS */}
        {loading && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "80px 0", color: "#555", gap: 12,
          }}>
            <svg className="animate-spin" style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#ddd" strokeWidth="4" />
              <path fill={AWS_ORANGE} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span style={{ fontSize: 14, fontFamily: "monospace" }}>Processing request…</span>
          </div>
        )}

        {/* État d'erreur — bandeau rouge style AWS */}
        {error && (
          <div style={{
            background: "#fde8e8", border: "1px solid #f5c6c6",
            borderLeft: "4px solid #b91c1c", borderRadius: 4,
            padding: "14px 18px", display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <p style={{ color: "#b91c1c", fontSize: 13, fontWeight: 500 }}>{error}</p>
          </div>
        )}

        {/* Résultat : carte certificat style Credly/AWS */}
        {!loading && !error && result && <CertCard result={result} />}
      </main>

      {/* Pied de page AWS */}
      <footer style={{
        textAlign: "center", fontSize: 11, color: "#888",
        padding: "14px", background: AWS_NAVY, borderTop: `2px solid ${AWS_ORANGE}`,
      }}>
        <span style={{ color: AWS_ORANGE, fontWeight: 700 }}>aws</span>
        {" "}· © {new Date().getFullYear()} CertVerify — IT Certification Verification Platform
      </footer>
    </div>
  );
}