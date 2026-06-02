# Rezumi 🚀

> Build it. Score it. Share it. Land it.

An AI-powered resume builder and analyzer built with the MERN stack and Groq AI. Generate ATS-friendly resumes, analyze job description matches, score your resume with AI, share it publicly, and export to PDF or DOCX — all for free.

## 🌐 Live Demo
**[rezumi-peach.vercel.app](https://rezumi-peach.vercel.app)**

---

## ✨ Features

### 📝 Resume Builder
- **Form Mode** — Fill in structured fields, AI enhances all content automatically
- **Text Mode** — Describe yourself in plain text, AI structures it into a full resume
- **PDF Upload** — Upload an existing resume PDF, AI parses and pre-fills the form

### 🔍 Resume Analyzer
- Paste resume + job description → instant AI match score (0–100%)
- Matched keywords, missing keywords, strengths, and actionable suggestions

### 📊 AI Resume Score Card *(New)*
- One-click AI scoring on 5 criteria:
  - 🤖 ATS Compatibility
  - 🎯 Impact & Achievements
  - 🛠️ Skills Relevance
  - 📖 Clarity & Readability
  - 📐 Format & Structure
- Animated score bars, circular overall score, and top improvement suggestions

### 🔗 Public Share Link *(New)*
- Generate a unique shareable link for any resume
- Anyone with the link can view it — no login required
- Revoke the link anytime to make it private again

### 🎨 3 PDF Templates *(New)*
- **Classic** — Indigo accents, clean professional layout
- **Modern** — Dark navy header, sky-blue accents
- **Minimal** — Black & white, ATS-optimized two-column style

### 📄 Export Options
- Download as **PDF** (pick from 3 templates)
- Download as **DOCX** (Word document)

### 🔐 Auth & Dashboard
- JWT-based register and login
- Dashboard to manage, view, and delete all resumes

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| AI | Groq API (LLaMA 3.1 8B Instant) |
| Auth | JWT + bcryptjs |
| PDF Export | @react-pdf/renderer |
| DOCX Export | docx npm package |
| PDF Parsing | pdf-parse + multer |
| Deployment | Vercel (Frontend) + Render (Backend) |

---

## 📁 Project Structure