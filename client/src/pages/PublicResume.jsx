import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function PublicResume() {
  const { shareId } = useParams()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    axios.get(`${API_BASE}/resume/public/${shareId}`)
      .then(r => setResume(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [shareId])

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-400">
        <span className="animate-spin w-5 h-5 border-2 border-gray-600 border-t-purple-500 rounded-full" />
        Loading resume...
      </div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="text-xl font-bold text-white mb-2">Resume Not Found</h2>
      <p className="text-gray-500 text-sm mb-6">This resume is private or the link was revoked.</p>
      <Link to="/" className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition text-sm">
        Go to Rezumi
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0f0f13]">
      <nav className="navbar-glass px-4 sm:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-purple-400">Rezumi</Link>
        <Link to="/register" className="btn-glow bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition">
          Build Mine Free →
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center gap-2 mb-5">
          <span className="bg-green-900/30 text-green-400 border border-green-700/30 px-3 py-1 rounded-full text-xs font-medium">
            🔗 Shared Resume
          </span>
        </div>

        <div className="card p-5 sm:p-8 animate-fade-up">
          <div className="border-b-2 border-purple-600 pb-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-400">{resume.personalInfo?.name}</h1>
            <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
              {resume.personalInfo?.email    && <span>✉ {resume.personalInfo.email}</span>}
              {resume.personalInfo?.phone    && <span>📞 {resume.personalInfo.phone}</span>}
              {resume.personalInfo?.location && <span>📍 {resume.personalInfo.location}</span>}
              {resume.personalInfo?.github   && <span>GitHub: {resume.personalInfo.github}</span>}
              {resume.personalInfo?.linkedin && <span>LinkedIn: {resume.personalInfo.linkedin}</span>}
            </div>
          </div>

          {resume.personalInfo?.summary && (
            <div className="mb-5"><h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Summary</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{resume.personalInfo.summary}</p></div>
          )}
          {resume.education?.length > 0 && (
            <div className="mb-5"><h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Education</h2>
              {resume.education.map((edu, i) => (
                <div key={i} className="mb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-semibold text-gray-200 text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                    <span className="text-xs text-gray-500">{edu.startYear} {edu.endYear && `– ${edu.endYear}`}</span>
                  </div>
                  <p className="text-xs text-gray-500">{edu.institution} {edu.grade && `| ${edu.grade}`}</p>
                </div>
              ))}
            </div>
          )}
          {resume.experience?.some(e => e.company) && (
            <div className="mb-5"><h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Experience</h2>
              {resume.experience.filter(e => e.company).map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-semibold text-gray-200 text-sm">{exp.role}</span>
                    <span className="text-xs text-gray-500">{exp.startDate} {exp.endDate && `– ${exp.endDate}`}</span>
                  </div>
                  <p className="text-xs text-gray-500">{exp.company}</p>
                  {exp.description && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
          {resume.skills?.length > 0 && (
            <div className="mb-5"><h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((s, i) => <span key={i} className="tag-purple">{s}</span>)}
              </div>
            </div>
          )}
          {resume.projects?.some(p => p.name) && (
            <div><h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Projects</h2>
              {resume.projects.filter(p => p.name).map((proj, i) => (
                <div key={i} className="mb-4">
                  <span className="font-semibold text-gray-200 text-sm">{proj.name}</span>
                  {proj.techStack && <p className="text-xs text-gray-500 mt-0.5">Tech: {proj.techStack}</p>}
                  {proj.description && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{proj.description}</p>}
                  {proj.link && <p className="text-xs text-purple-400 mt-1">{proj.link}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-xs mb-3">Created with Rezumi — AI-powered resume builder</p>
          <Link to="/register" className="btn-glow inline-block bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition text-sm">
            🚀 Build your own resume — it's free
          </Link>
        </div>
      </div>
    </div>
  )
}