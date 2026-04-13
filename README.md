# CertVerify — Plateforme de vérification de certifications IT

Plateforme de type Credly pour émettre et vérifier l'authenticité des certifications IT.

## Stack
- **Frontend** : React + Vite + Tailwind CSS
- **Backend** : Node.js + Express
- **Base de données** : Firebase Firestore + Firebase Storage (images badges)
- **Auth** : Firebase Authentication (admins)

## Structure du projet
```
certverify/
├── frontend/   # React + Vite
└── backend/    # Node.js + Express + Firebase Admin SDK
```

## Collections Firestore
| Collection | Description |
|---|---|
| `certifications` | Modèles de certifications (ex: AWS SAA, CompTIA A+) |
| `issued_certificates` | Certificats émis aux individus |

## Lancer en local

### Backend
```bash
cd backend
cp .env.example .env   # remplir avec vos clés Firebase
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env   # remplir avec vos clés Firebase
npm install
npm run dev
```

## Variables d'environnement

### `backend/.env`
```
PORT=5000
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### `frontend/.env`
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_URL=http://localhost:5000
```

## Déploiement
- Frontend : Vercel / Firebase Hosting
- Backend : Railway / Render / Cloud Run
