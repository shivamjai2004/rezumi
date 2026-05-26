# Rezumi 🚀

> Build it. Analyze it. Land it.

An AI-powered resume builder and analyzer built with the MERN stack and Groq AI. Generate ATS-friendly resumes, analyze job description matches, and export to PDF or DOCX — all for free.

## 🌐 Live Demo
**[rezumi-peach.vercel.app](https://rezumi-peach.vercel.app)**

## ✨ Features

- 🔨 **Resume Builder** — Build from a form or plain text, AI enhances content automatically
- 📤 **PDF Upload** — Upload existing resume PDF, AI parses and pre-fills the form
- 🔍 **Resume Analyzer** — Paste or upload resume + job description, get instant AI match score
- 📊 **ATS Score** — Matched keywords, missing keywords, strengths and suggestions
- 📄 **Export PDF** — Download resume as a styled PDF
- 📝 **Export DOCX** — Download resume as a Word document
- 🔐 **Auth** — JWT-based register and login
- 📁 **Dashboard** — Manage all your resumes in one place

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| AI | Groq API (LLaMA 3.1 8B) |
| Auth | JWT + bcryptjs |
| PDF Export | @react-pdf/renderer |
| DOCX Export | docx npm package |
| PDF Parsing | pdf-parse + multer |
| Deployment | Vercel (FE) + Render (BE) |

## 📁 Project Structure



## 🚀 Run Locally

### Prerequisites
- Node.js
- MongoDB Atlas account
- API key 

### Backend
```bash
cd server
npm install
```

Create `server/.env`:

## 👨‍💻 Author
**Shivam Dilip Jaiswal**
- GitHub: [@shivamjai2004](https://github.com/shivamjai2004)
- MCA in AI & ML