# 🎙️ Sawtia AI Agent — Projet Complet

Stack : **React 18 + Vite** (frontend) · **Laravel 11** (backend API) · **MySQL** (base de données)

---

## 📁 Structure du projet

```
sawtia-project/
├── frontend/               ← Application React
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js          ← Axios + tous les appels API
│   │   ├── pages/
│   │   │   ├── WhatsAppSync.jsx   ← ✅ NOUVEAU : Sync WhatsApp QR
│   │   │   ├── AIParameters.jsx   ← ✅ NOUVEAU : Paramètres IA
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ApiKeys.jsx
│   │   │   ├── MonPlan.jsx
│   │   │   ├── WebScanner.jsx
│   │   │   ├── DataSources.jsx
│   │   │   ├── Recharge.jsx
│   │   │   ├── Factures.jsx
│   │   │   ├── Parametres.jsx
│   │   │   └── WooCommerce.jsx
│   │   ├── App.jsx                ← Layout + routing + sidebar
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── backend/                ← API Laravel
    ├── app/
    │   ├── Http/Controllers/
    │   │   ├── WhatsAppController.php    ← ✅ NOUVEAU
    │   │   └── AIParameterController.php ← ✅ NOUVEAU
    │   └── Models/
    │       ├── WhatsappSession.php       ← ✅ NOUVEAU
    │       └── AIParameter.php           ← ✅ NOUVEAU
    ├── routes/
    │   └── api.php                       ← Toutes les routes API
    └── database/migrations/
        └── 2024_01_01_create_sawtia_tables.php
```

---

## 🚀 Installation

### 1. Backend Laravel

```bash
cd backend

# Installer les dépendances
composer install

# Copier et configurer l'environnement
cp .env.example .env
php artisan key:generate

# Configurer .env
DB_DATABASE=sawtia_db
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe

# Paramètres WhatsApp (microservice Node.js)
WHATSAPP_SERVICE_URL=http://localhost:3001
WHATSAPP_WEBHOOK_SECRET=votre_secret_ici

# Clés LLM
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Migrations
php artisan migrate
php artisan db:seed

# Démarrer le serveur
php artisan serve
# → http://localhost:8000
```

### 2. Frontend React

```bash
cd frontend

npm install
npm run dev
# → http://localhost:3000
```

---

## ✅ Nouvelles fonctionnalités

### 📱 WhatsApp Sync (QR Code)

**Frontend** : `src/pages/WhatsAppSync.jsx`
- Affiche un QR code à scanner depuis l'application WhatsApp
- Compte à rebours de 60 secondes (actualisation automatique)
- Dashboard temps réel : messages traités, contacts actifs, uptime
- Instructions visuelles étape par étape
- Bouton de déconnexion

**Backend** : `WhatsAppController.php`
- `GET /api/whatsapp/status` — état de la session
- `GET /api/whatsapp/qr` — génère le QR code via microservice Node.js
- `POST /api/whatsapp/disconnect` — déconnecte la session
- `POST /api/whatsapp/send` — envoie un message
- `POST /api/whatsapp/webhook` — reçoit les événements du microservice

> **Note** : Pour la production, vous avez besoin d'un microservice Node.js
> basé sur [Baileys](https://github.com/WhiskeySockets/Baileys) ou 
> [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js).
> Voir ci-dessous pour le setup.

### 🧠 Paramètres IA

**Frontend** : `src/pages/AIParameters.jsx`

4 onglets de configuration :

| Onglet | Paramètres |
|--------|-----------|
| **Modèle IA** | Choix du modèle, température, max_tokens, top_p, penalties |
| **Comportement** | System prompt, persona, messages accueil/fallback, streaming, mémoire, RAG |
| **Langue & Voix** | Langue, voix TTS, vitesse parole, activation TTS/STT |
| **Limites & Sécurité** | Max tours conversation, délai réponse, filtre contenu, transfert humain |

**Backend** : `AIParameterController.php`
- `GET /api/ai-parameters` — liste les configs
- `GET /api/ai-parameters/models` — modèles disponibles avec coûts
- `PUT /api/ai-parameters/{id}` — mise à jour avec validation complète

---

## 🔧 Microservice WhatsApp (Node.js)

Créez un fichier `whatsapp-service/index.js` :

```javascript
const { makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const express = require('express')
const app = express()
app.use(express.json())

const sessions = {}

app.post('/session/:id/qr', async (req, res) => {
  const { id } = req.params
  const { state, saveCreds } = await useMultiFileAuthState(`sessions/${id}`)
  
  const socket = makeWASocket({ auth: state })
  sessions[id] = socket
  
  socket.ev.on('connection.update', ({ qr, connection, lastDisconnect }) => {
    if (qr) {
      // Envoyer le QR au webhook Laravel
      fetch(`${process.env.LARAVEL_URL}/api/whatsapp/webhook`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Webhook-Secret': process.env.WEBHOOK_SECRET 
        },
        body: JSON.stringify({ event: 'qr', data: { session_id: id, qr } })
      })
      res.json({ qr })
    }
    if (connection === 'open') {
      const phone = socket.user.id.split(':')[0]
      fetch(`${process.env.LARAVEL_URL}/api/whatsapp/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Webhook-Secret': process.env.WEBHOOK_SECRET },
        body: JSON.stringify({ event: 'connected', data: { session_id: id, phone } })
      })
    }
  })
  socket.ev.on('creds.update', saveCreds)
})

app.get('/session/:id/status', (req, res) => {
  const socket = sessions[req.params.id]
  res.json({ status: socket ? 'connected' : 'disconnected' })
})

app.post('/session/:id/send', async (req, res) => {
  const socket = sessions[req.params.id]
  const { to, message } = req.body
  await socket.sendMessage(to, { text: message })
  res.json({ success: true })
})

app.listen(3001, () => console.log('WhatsApp service running on :3001'))
```

```bash
npm install @whiskeysockets/baileys express node-fetch
node index.js
```

---

## 🗄️ Base de données

Deux nouvelles tables créées par la migration :

**`whatsapp_sessions`** : sessions WhatsApp par utilisateur  
**`ai_parameters`** : paramètres IA par agent (modèle, temp, prompt, voix...)

---

## 🌐 Variables d'environnement

```env
# Laravel .env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Base de données
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sawtia_db
DB_USERNAME=root
DB_PASSWORD=

# LLM APIs
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=...

# WhatsApp
WHATSAPP_SERVICE_URL=http://localhost:3001
WHATSAPP_WEBHOOK_SECRET=changeme_in_production

# Stripe (paiements)
STRIPE_KEY=pk_live_...
STRIPE_SECRET=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Broadcasting (temps réel QR)
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=...
PUSHER_APP_KEY=...
PUSHER_APP_SECRET=...
```

---

## 📡 Architecture temps réel (QR Code)

```
Téléphone WhatsApp
      ↓ scanne
   QR Code affiché dans React
      ↑ SSE / WebSocket
   Laravel (Pusher/Reverb)
      ↑ webhook POST
   Microservice Node.js (Baileys)
      ↑ génère le QR
```

Pour un déploiement production, utilisez **Laravel Reverb** (WebSocket natif) :
```bash
php artisan reverb:install
php artisan reverb:start
```
