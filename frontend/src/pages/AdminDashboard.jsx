import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Modal from "../components/Modal";
import {
  getCertificates, issueCertificate, revokeCertificate,
  deleteCertificate, getTemplates,
} from "../lib/api";
import toast from "react-hot-toast";

function StatusPill({ status }) {
  const map = {
    active:  "badge-valid",
    revoked: "badge-revoked",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? "badge-expired"}`}>
      {status === "active" ? "Actif" : "Révoqué"}
    </span>
  );
}

function formatDate(val) {
  if (!val) return "—";
  const d = val?._seconds ? new Date(val._seconds * 1000) : new Date(val);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const EMPTY_FORM = { recipientName: "", recipientEmail: "", certificationId: "", validityMonths: "" };

export default function AdminDashboard() {
  const [certs, setCerts]         = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [busy, setBusy]           = useState(false);
  const [search, setSearch]       = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, t] = await Promise.all([getCertificates(), getTemplates()]);
      setCerts(Array.isArray(c) ? c : []);
      setTemplates(Array.isArray(t) ? t : []);
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleIssue(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await issueCertificate({
        ...form,
        validityMonths: form.validityMonths ? Number(form.validityMonths) : null,
      });
      if (result.error) throw new Error(result.error);
      toast.success(`Certificat émis — code : ${result.verifyCode}`);
      setShowModal(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      toast.error(err.message || "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function handleRevoke(id) {
    if (!confirm("Révoquer ce certificat ?")) return;
    await revokeCertificate(id);
    toast.success("Certificat révoqué");
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer définitivement ce certificat ?")) return;
    await deleteCertificate(id);
    toast.success("Supprimé");
    load();
  }

  const filtered = certs.filter(
    (c) =>
      c.recipientName?.toLowerCase().includes(search.toLowerCase()) ||
      c.recipientEmail?.toLowerCase().includes(search.toLowerCase()) ||
      c.certificationName?.toLowerCase().includes(search.toLowerCase()) ||
      c.verifyCode?.toLowerCase().includes(search.toLowerCase())
  );

  // KPIs
  const total   = certs.length;
  const active  = certs.filter((c) => c.status === "active").length;
  const revoked = certs.filter((c) => c.status === "revoked").length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-6">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-2xl text-slate-900">Dashboard</h1>
          <div className="flex gap-2">
            <Link to="/admin/templates"
              className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium hover:bg-slate-50 transition-colors">
              Certifications
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 transition-colors">
              + Émettre un certificat
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total",    value: total,   color: "text-slate-800" },
            { label: "Actifs",   value: active,  color: "text-green-600" },
            { label: "Révoqués", value: revoked, color: "text-red-600"   },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
              <p className={`font-display font-bold text-3xl ${color}`}>{value}</p>
              <p className="text-slate-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Rechercher par nom, email, code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {loading ? (
            <p className="text-center text-slate-400 py-12">Chargement…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-12">Aucun certificat trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                    <th className="px-4 py-3 text-left">Bénéficiaire</th>
                    <th className="px-4 py-3 text-left">Certification</th>
                    <th className="px-4 py-3 text-left">Code</th>
                    <th className="px-4 py-3 text-left">Émis le</th>
                    <th className="px-4 py-3 text-left">Expire</th>
                    <th className="px-4 py-3 text-left">Statut</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{c.recipientName}</p>
                        <p className="text-slate-400 text-xs">{c.recipientEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{c.certificationName}</td>
                      <td className="px-4 py-3 font-mono text-brand-600 text-xs">{c.verifyCode}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(c.issuedAt)}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(c.expiresAt)}</td>
                      <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {c.status === "active" && (
                            <button
                              onClick={() => handleRevoke(c.id)}
                              className="text-xs text-amber-600 hover:underline"
                            >
                              Révoquer
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal émission */}
      {showModal && (
        <Modal title="Émettre un certificat" onClose={() => setShowModal(false)}>
          <form onSubmit={handleIssue} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom du bénéficiaire *</label>
              <input
                required value={form.recipientName}
                onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
              <input
                type="email" required value={form.recipientEmail}
                onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Certification *</label>
              <select
                required value={form.certificationId}
                onChange={(e) => setForm({ ...form, certificationId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="">— Sélectionner —</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} — {t.issuer}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Durée de validité (mois) <span className="text-slate-400 font-normal">— optionnel</span>
              </label>
              <input
                type="number" min="1" value={form.validityMonths}
                onChange={(e) => setForm({ ...form, validityMonths: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                placeholder="Ex: 24"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm hover:bg-slate-50 transition-colors">
                Annuler
              </button>
              <button type="submit" disabled={busy}
                className="px-5 py-2 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-600 disabled:opacity-50 transition-colors">
                {busy ? "Émission…" : "Émettre"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
