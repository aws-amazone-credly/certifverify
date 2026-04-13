// ============================================================
// Home.jsx — page d'accueil style AWS Training & Certification
// ============================================================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const AWS_NAVY   = "#232f3e";
const AWS_ORANGE = "#ff9900";

export default function Home() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  // --- Soumission du formulaire : redirige vers la page de vérification ---
  function handleVerify(e) {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed) navigate(`/verify/${trimmed}`);
  }

  // --- Cartes de fonctionnalités affichées sous la barre de recherche ---
  const features = [
    { icon: "⚡", label: "Instant",  desc: "Results in under a second" },
    { icon: "🔒", label: "Reliable", desc: "Data secured on Firebase" },
    { icon: "📱", label: "QR Code",  desc: "Scan directly from the badge" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f3f3f3" }}>
      <Header />

      {/* Section hero centrée — fond navy dégradé style AWS */}
      <div style={{
        background: `linear-gradient(160deg, ${AWS_NAVY} 0%, #37475a 100%)`,
        padding: "64px 16px 48px",
        textAlign: "center",
        borderBottom: `3px solid ${AWS_ORANGE}`,
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>

          {/* Tag catégorie style Credly */}
          <span style={{
            display: "inline-block", background: AWS_ORANGE, color: AWS_NAVY,
            fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
            padding: "3px 10px", borderRadius: 3, textTransform: "uppercase", marginBottom: 16,
          }}>
            AWS Training &amp; Certification
          </span>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 12 }}>
            Verify the authenticity<br />of an IT certification
          </h1>
          <p style={{ color: "#aaa", fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
            Enter the verification code printed on the certificate
            to confirm its authenticity in seconds.
          </p>

          {/* Barre de recherche du code de vérification */}
          <form
            onSubmit={handleVerify}
            style={{ display: "flex", gap: 8, maxWidth: 480, margin: "0 auto" }}
          >
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. V3rK2mXpQ8nL"
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 4,
                border: "1px solid #4a5568", background: "#1a2332",
                color: "#fff", fontSize: 13, fontFamily: "monospace",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={!code.trim()}
              style={{
                padding: "10px 20px", borderRadius: 4, fontWeight: 700,
                fontSize: 13, cursor: "pointer", border: "none",
                background: code.trim() ? AWS_ORANGE : "#4a5568",
                color: code.trim() ? AWS_NAVY : "#888",
                transition: "background .15s",
              }}
            >
              Verify
            </button>
          </form>
        </div>
      </div>

      {/* Grille des 3 cartes de fonctionnalités */}
      <main style={{ flex: 1, maxWidth: 720, margin: "40px auto", padding: "0 16px", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {features.map(({ icon, label, desc }) => (
            <div key={label} style={{
              background: "#fff", borderRadius: 6, padding: "20px 16px",
              textAlign: "center", border: "1px solid #ddd",
              borderTop: `3px solid ${AWS_ORANGE}`,
            }}>
              <span style={{ fontSize: 24 }}>{icon}</span>
              <p style={{ fontWeight: 700, color: AWS_NAVY, marginTop: 8, fontSize: 14 }}>{label}</p>
              <p style={{ color: "#666", fontSize: 12, marginTop: 4 }}>{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Pied de page style AWS */}
      <footer style={{
        textAlign: "center", fontSize: 11, color: "#888",
        padding: "16px", background: AWS_NAVY, borderTop: `2px solid ${AWS_ORANGE}`,
      }}>
        <span style={{ color: AWS_ORANGE, fontWeight: 700 }}>aws</span>
        {" "}· © {new Date().getFullYear()} CertVerify — IT Certification Verification Platform
      </footer>
    </div>
  );
}