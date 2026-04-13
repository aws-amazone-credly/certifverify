/**
 * api.js — Toutes les opérations Firestore en direct.
 * Plus de backend Node.js nécessaire.
 */
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, query, where, limit,
  serverTimestamp, orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Générateur de code unique ─────────────────────────────────────────────
function generateCode(length = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

// ─── PUBLIC ────────────────────────────────────────────────────────────────

export async function verifyCertificate(code) {
  const q = query(
    collection(db, "issued_certificates"),
    where("verifyCode", "==", code),
    limit(1)
  );
  const snap = await getDocs(q);

  if (snap.empty) {
    return { valid: false, message: "Certificat introuvable" };
  }

  const cert = { id: snap.docs[0].id, ...snap.docs[0].data() };

  if (cert.status === "revoked") {
    return { valid: false, message: "Ce certificat a été révoqué", cert };
  }

  if (cert.expiresAt) {
    const exp = cert.expiresAt.toDate ? cert.expiresAt.toDate() : new Date(cert.expiresAt);
    if (exp < new Date()) {
      return { valid: false, message: "Ce certificat est expiré", cert };
    }
  }

  return { valid: true, cert };
}

// ─── CERTIFICATS ───────────────────────────────────────────────────────────

export async function getCertificates() {
  const snap = await getDocs(
    query(collection(db, "issued_certificates"), orderBy("issuedAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function issueCertificate({ recipientName, recipientEmail, certificationId, validityMonths }) {
  const allTemplates = await getDocs(collection(db, "certifications"));
  const templateDoc  = allTemplates.docs.find((d) => d.id === certificationId);

  if (!templateDoc) throw new Error("Certification introuvable");
  const template = templateDoc.data();

  const months    = validityMonths ?? template.validityMonths ?? null;
  const expiresAt = months
    ? new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000)
    : null;

  const verifyCode = generateCode(12);

  const payload = {
    verifyCode,
    recipientName,
    recipientEmail,
    certificationId,
    certificationName: template.name,
    badgeUrl:          template.badgeUrl || null,
    issuedAt:          serverTimestamp(),
    expiresAt,
    status:            "active",
  };

  const ref = await addDoc(collection(db, "issued_certificates"), payload);
  return { id: ref.id, ...payload, verifyCode };
}

export async function revokeCertificate(id) {
  await updateDoc(doc(db, "issued_certificates", id), {
    status:    "revoked",
    revokedAt: serverTimestamp(),
  });
  return { success: true };
}

export async function deleteCertificate(id) {
  await deleteDoc(doc(db, "issued_certificates", id));
  return { success: true };
}

// ─── TEMPLATES ─────────────────────────────────────────────────────────────

export async function getTemplates() {
  const snap = await getDocs(
    query(collection(db, "certifications"), orderBy("name"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createTemplate({ name, issuer, description, badgeUrl, validityMonths }) {
  const ref = await addDoc(collection(db, "certifications"), {
    name,
    issuer,
    description:    description    || "",
    badgeUrl:       badgeUrl       || null,
    validityMonths: validityMonths || null,
    createdAt:      serverTimestamp(),
  });
  return { id: ref.id };
}
