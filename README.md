# Prism — AI Legal Assistant



**Prism** is a full-stack AI-powered legal assistant that analyzes documents, explains clauses, highlights risks, generates summaries, and answers natural-language legal questions using an intelligent agent system.

---

## 🚀 Quick Snapshot

- **Frontend:** React + Vite + Tailwind CSS + Clerk Auth
- **Backend:** Node.js (ESM) + Express + MongoDB + OpenAI/Groq
- **Storage:** MongoDB Atlas (Metadata & User Vault)
- **Authentication:** Clerk (Secure login & session management)

---

## ✨ Key Features

### 📄 Document Vault
- **Upload Support:** Handle PDFs for contracts, agreements, receipts, and forms.
- **Organized Grid:** View all uploaded documents in a clean, organized UI.
- **Dashboard:** One-click access to full legal analysis dashboards.

### 🤖 AI Legal Engine
For every uploaded document, Prism automates:
- **📝 Summary:** Concise overview of the document.
- **📚 Clause Analysis:** Detailed breakdown of specific clauses.
- **⚠️ Risk Detection:** Highlights potential pitfalls and risks.
- **💡 Recommendations:** Actionable advice based on document content.
- **🕵️ Fine Print Detection:** Uncovers hidden terms.
- **🔍 Deep Dive:** Explains complex legal jargon in simple terms.

### 🗣️ Argus Chat Assistant
A context-aware chatbot that helps with:
- General legal questions.
- Specific queries regarding your uploaded documents.
- Clarifications on confusing or risky clauses.

### 🔐 Security & UI
- **Authentication:** Powered by Clerk with user-level vault separation.
- **Modern UI:** Futuristic neon glass aesthetic with responsive mobile layout.
- **UX:** Smooth card animations and transitions.

---

## 📁 Repository Structure

```bash
Prism/
├─ Backend/
│  ├─ server.js                      # Main Express server entry point
│  ├─ routes/
│  │  ├─ analysis.js                 # Legal analysis endpoints
│  │  ├─ chat.js                     # Chatbot/Agent endpoints
│  │  └─ docs.js                     # Document upload & metadata handling
│  ├─ utils/
│  │  └─ ai.js                       # AI Model integration (OpenAI/Groq)
│  └─ models/
│     └─ Document.js                 # MongoDB Mongoose Schema
│
├─ Frontend/
│  ├─ public/
│  └─ src/
│     ├─ pages/                      # Home, Vault, Dashboard, Chat, Upload
│     ├─ components/                 # Navbar, Cards, Argus Chat UI
│     ├─ context/                    # Global state management
│     ├─ assets/                     # Images & Logos
│     ├─ App.jsx                     # Main App Component
│     └─ main.jsx                    # Entry point
│
└─ README.md
```

---

## 🧩 Prerequisites

Ensure you have the following installed or set up:

- **[Node.js](https://nodejs.org/)** (v18 or higher)
- **npm** or **[yarn](https://yarnpkg.com/)**
- **[MongoDB Atlas](https://www.mongodb.com/atlas)** Cluster
- **[Clerk](https://clerk.com/)** Account (for Auth)
- **[OpenAI](https://openai.com/)** or **[Groq](https://groq.com/)** API Key
- **[Vercel](https://vercel.com/)** & **[Render](https://render.com/)** accounts (for deployment)

---

## 🔧 Environment Variables

### Backend (`.env`)

```env
MONGO_URI=your_mongodb_uri
AI_API_KEY=your_openai_or_groq_key
PORT=8080
CLERK_SECRET_KEY=your_clerk_backend_key
```

### Frontend (`.env`):

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxx
VITE_API_BASE=https://your-backend.onrender.com
```
---

## 🛠️ Local Development

### 1. Start Backend

```bash
cd Backend
npm install
npm start
```

### 2. Start Frontend

```bash
cd Frontend
npm install
npm run dev
```

**Frontend opens at:**
👉 [http://localhost:5173](http://localhost:5173)

---

## 🔌 API Endpoints Overview

### Documents
- `POST /docs/upload` — Upload a PDF
- `GET /docs/all` — List uploaded docs
- `GET /docs/:id` — Fetch AI analysis

### AI / Chat
- `POST /analyses/run` — Run full legal analysis on document
- `POST /chats/query` — Ask a natural-language question

---

## ⚠️ Notes on Deployment

### Frontend (Vercel)
Add a `vercel.json` file in your root directory to fix SPA (Single Page Application) routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Backend (Render)
- Set env vars for **MongoDB**, **AI key**, and **Clerk key**.
- Enable **CORS** for your Vercel origin.
- Use dynamic port binding:
  ```javascript
  const PORT = process.env.PORT || 8080;

---

## 🧪 Debugging Tips

- **Render Logs:** Check AI route errors in Render logs (often related to timeouts or memory).
- **File Size:** Ensure PDF upload limit is properly set in both frontend and backend.
- **CORS:** Always verify the allowed CORS origin in the backend matches your Vercel URL.
- **Manual Testing:** Use `/analyses/run` in **Postman** to test analysis logic without the frontend.

---

## 🙌 Contribution

PRs and issues are welcome! Feel free to fork the repository and submit pull requests.

**Ideas for future improvements:**
- [ ] Multi-document comparative analysis
- [ ] Exportable legal reports (PDF)
- [ ] Real-time collaboration
- [ ] Agent multi-step reasoning
- [ ] Clause similarity search

---

## 📜 License

**MIT** — open for personal and commercial use.

---

## 👤 Author

**Shubham Das**
*Full-Stack Developer • AI Systems • Legal Tech*

GitHub: [https://github.com/psykickguy](https://github.com/psykickguy)
