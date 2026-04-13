// ============================================================
// Modal.jsx — style AWS/Credly : fond navy, bordure orange
// ============================================================
import { useEffect } from "react";

export default function Modal({ title, onClose, children }) {
  // --- Fermeture du modal avec la touche Escape ---
  useEffect(() => {
    function handler(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(35,47,62,.7)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-lg rounded-xl overflow-hidden shadow-2xl"
        style={{ background: "#fff", border: "1px solid #ddd" }}>

        {/* En-tête : bande navy avec titre blanc et croix de fermeture */}
        <div style={{
          background: "#232f3e",
          borderBottom: "3px solid #ff9900",
          padding: "14px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <h2 style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: ".01em" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              color: "#aaa", fontSize: 22, lineHeight: 1, background: "none",
              border: "none", cursor: "pointer", padding: "0 2px",
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Contenu du modal */}
        <div style={{ padding: "20px 24px" }}>{children}</div>
      </div>
    </div>
  );
}