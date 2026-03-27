# HireAI 🤖 — AI-Powered Recruitment Platform

A modern recruitment platform where candidates build profiles using AI — no resume upload needed!

Built for **Anshumat Foundation Web Development Internship Assignment**.

---

## 🎯 Problem Statement

Traditional hiring platforms rely on resume uploads which cause:
- Poor parsing and inconsistent data
- Bias and inefficiency
- Bad candidate experience

**HireAI solves this by replacing resume uploads with AI-assisted profile building.**

---

## ✅ Features

### Candidate Side
- 🤖 AI-powered profile builder (chat interface)
- 💬 Natural language input — just talk, AI structures it
- ⚡ Auto skill suggestions and extraction
- 📝 AI-generated professional summary
- 💾 Auto-save with progress tracking
- 👁️ Profile preview
- ⬇️ Download profile as resume
- 🔗 Shareable profile link

### Recruiter Side
- 👥 View all candidates
- 🔍 Search by name or skill
- ⭐ Shortlist candidates
- 📊 Candidate comparison
- 📈 Profile completion stats

---

## 🛠️ Tech Stack

| Part | Technology | Why |
|------|-----------|-----|
| Frontend | React + Vite | Fast, modern, HMR support |
| Styling | Tailwind CSS | Utility-first, rapid UI development |
| Backend | Node.js + Express | Fast REST API development |
| Database | MongoDB (local) | Flexible schema for profiles |
| AI | Groq + LLaMA 3.3 | Free, fast AI inference |
| Auth | JWT Tokens | Secure, stateless authentication |
| HTTP | Axios | Clean API calls from frontend |

---

## 📁 Project Structure
```
AI-Powered-Recruitment/
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ProfileBuilder.jsx
│   │   │   ├── ProfilePreview.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   └── CandidateDetail.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/                  # Node.js + Express API
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── candidateController.js
│   │   └── recruiterController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Profile.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── candidate.js
│   │   └── recruiter.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── seed.js
│   └── server.js
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas
- Groq API key (free at console.groq.com)

### 1. Clone the repository
```bash
git clone https://github.com/Manasi-Mane/ai-recruiter.git
cd ai-recruiter
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create `backend/.env` file:
```
MONGO_URI=mongodb://localhost:27017/ai-recruiter
JWT_SECRET=mysecretkey123
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
```

Seed the demo user:
```bash
node config/seed.js
```

Start backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔑 Demo Login

| Field | Value |
|-------|-------|
| Email | hire-me@anshumat.org |
| Password | HireMe@2025! |
| Role | Candidate |

---

## 👤 Create Recruiter Account

To test recruiter features:
1. Go to `/signup`
2. Enter any name/email/password
3. Select **"Recruiter"** role
4. Login and view the recruiter dashboard

---

## 🤖 AI Interaction Flow
```
User: "Hi I'm John, looking for SDE jobs"
AI: "Great to meet you John! Exciting that you're
     looking for SDE roles. Tell me about your experience..."

User: "I worked at TCS for 1 year as a React developer"
AI: "Got it! I've captured:
     ✅ Role: React Developer
     ✅ Company: TCS
     ✅ Duration: 1 year
     Suggested skills: React, JavaScript, HTML/CSS..."
```

---

## 📊 Evaluation Coverage

| Criteria | Implementation |
|----------|---------------|
| UX Thinking (25%) | Guided 5-step flow, progress tracking |
| AI Interaction (20%) | Real Groq AI, skill suggestions, auto-summary |
| Problem Solving (20%) | No resume upload, structured data capture |
| Product Thinking (15%) | Auto-save, export, share link |
| Visual Design (10%) | Dark theme, modern UI |
| Originality (10%) | Unique chat-based profile builder |

---

## 📞 Contact

Built by Manasi Mane
For Anshumat Foundation Web Development Internship