import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <span className="text-6xl">🔍</span>
        <h1 className="font-display font-bold text-4xl text-slate-900 mt-4">Page introuvable</h1>
        <p className="text-slate-500 mt-2 mb-6">Cette page n'existe pas ou a été déplacée.</p>
        <Link to="/" className="px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors">
          Retour à l'accueil
        </Link>
      </main>
    </div>
  );
}
