import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Modal from "../components/Modal";
import { getTemplates, createTemplate } from "../lib/api";
import toast from "react-hot-toast";

const EMPTY = { name: "", issuer: "", description: "", badgeUrl: "", validityMonths: "" };

export default function AdminTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY);
  const [busy, setBusy]           = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await createTemplate({
        ...form,
        validityMonths: form.validityMonths ? Number(form.validityMonths) : null,
      });
      if (result.error) throw new Error(result.error);
      toast.success("Certification créée");
      setShowModal(false);
      setForm(EMPTY);
      load();
    } catch (err) {
      toast.error(err.message || "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-sm text-slate-500 hover:text-brand-600 transition-colors">← Dashboard</Link>
            <h1 className="font-display font-bold text-2xl text-slate-900">Types de certifications</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors">
            + Nouvelle certification
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <p className="text-center text-slate-400 py-16">Chargement…</p>
        ) : templates.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">🏅</span>
            <p className="text-slate-400 mt-3">Aucune certification créée.</p>
            <button onClick={() => setShowModal(true)}
              className="mt-4 px-5 py-2 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors">
              Créer la première
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex gap-4">
                <div className="flex-shrink-0">
                  {t.badgeUrl ? (
                    <img src={t.badgeUrl} alt="" className="w-14 h-14 object-contain" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-brand-50 border-2 border-brand-100 flex items-center justify-center text-2xl">
                      🏅
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.issuer}</p>
                  {t.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{t.description}</p>
                  )}
                  {t.validityMonths && (
                    <p className="text-xs text-brand-600 mt-1">⏱ {t.validityMonths} mois</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <Modal title="Nouvelle certification" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom de la certification *</label>
              <input
                required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="AWS Solutions Architect – Associate"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Émetteur *</label>
              <input
                required value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                placeholder="Amazon Web Services"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL du badge (image)</label>
              <input
                type="url" value={form.badgeUrl}
                onChange={(e) => setForm({ ...form, badgeUrl: e.target.value })}
                placeholder="https://…/badge.png"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Durée de validité par défaut (mois)</label>
              <input
                type="number" min="1" value={form.validityMonths}
                onChange={(e) => setForm({ ...form, validityMonths: e.target.value })}
                placeholder="24"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm hover:bg-slate-50 transition-colors">
                Annuler
              </button>
              <button type="submit" disabled={busy}
                className="px-5 py-2 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 disabled:opacity-50 transition-colors">
                {busy ? "Création…" : "Créer"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
