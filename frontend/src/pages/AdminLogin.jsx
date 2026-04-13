import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const { authed, login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [shake, setShake]       = useState(false);

  if (authed) return <Navigate to="/admin" replace />;

  function handleSubmit(e) {
    e.preventDefault();
    const ok = login(password);
    if (ok) {
      toast.success("Bienvenue !");
      navigate("/admin");
    } else {
      setShake(true);
      setPassword("");
      toast.error("Mot de passe incorrect");
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div
        className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-8 w-full max-w-sm space-y-6
          ${shake ? "animate-shake" : ""}`}
      >
        <div className="text-center">
          <span className="text-4xl">🔐</span>
          <h1 className="font-display font-bold text-2xl text-slate-900 mt-2">CertVerify</h1>
          <p className="text-slate-500 text-sm mt-1">Espace administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mot de passe
            </label>
            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-400">
              <input
                type={show ? "text" : "password"}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow((p) => !p)}
                className="px-3 text-slate-400 hover:text-slate-600"
              >
                {show ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-brand-500 text-white font-semibold
                       hover:bg-brand-600 transition-colors"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
