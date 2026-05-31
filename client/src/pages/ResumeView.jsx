import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PDFDownloadLink } from '@react-pdf/renderer'
import api from '../utils/api'
import ResumePDF from '../components/ResumePDF'
import ResumePDFModern from '../components/ResumePDFModern'
import ResumePDFMinimal from '../components/ResumePDFMinimal'

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Indigo accents, clean sections',
    preview: (
      <div className="w-full h-full bg-white p-2 text-left">
        <div className="border-b-2 border-indigo-500 pb-1 mb-1.5">
          <div className="h-2.5 w-20 bg-indigo-500 rounded mb-1" />
          <div className="flex gap-1">
            <div className="h-1.5 w-10 bg-gray-300 rounded" />
            <div className="h-1.5 w-8 bg-gray-300 rounded" />
          </div>
        </div>
        <div className="mb-1.5">
          <div className="h-1.5 w-12 bg-indigo-400 rounded mb-1" />
          <div className="h-1 w-full bg-gray-200 rounded mb-0.5" />
          <div className="h-1 w-4/5 bg-gray-200 rounded" />
        </div>
        <div>
          <div className="h-1.5 w-14 bg-indigo-400 rounded mb-1" />
          <div className="flex gap-1 flex-wrap">
            <div className="h-2 w-8 bg-indigo-100 rounded" />
            <div className="h-2 w-10 bg-indigo-100 rounded" />
            <div className="h-2 w-7 bg-indigo-100 rounded" />
          </div>
        </div>
      </div>
    ),
    ring: 'ring-indigo-500',
    badge: 'bg-indigo-900/40 text-indigo-300 border-indigo-700/30',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Dark header, sky blue accents',
    preview: (
      <div className="w-full h-full bg-white text-left">
        <div className="bg-slate-900 px-2 py-1.5 mb-1.5">
          <div className="h-2.5 w-20 bg-white rounded mb-1 opacity-90" />
          <div className="flex gap-1">
            <div className="h-1.5 w-10 bg-slate-600 rounded" />
            <div className="h-1.5 w-8 bg-slate-600 rounded" />
          </div>
        </div>
        <div className="px-2">
          <div className="mb-1.5">
            <div className="h-1.5 w-14 bg-sky-400 rounded mb-1" />
            <div className="h-1 w-full bg-gray-200 rounded mb-0.5" />
            <div className="h-1 w-3/4 bg-gray-200 rounded" />
          </div>
          <div>
            <div className="h-1.5 w-10 bg-sky-400 rounded mb-1" />
            <div className="flex gap-1 flex-wrap">
              <div className="h-2 w-7 bg-sky-100 border border-sky-200 rounded" />
              <div className="h-2 w-9 bg-sky-100 border border-sky-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    ),
    ring: 'ring-sky-500',
    badge: 'bg-sky-900/40 text-sky-300 border-sky-700/30',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Black & white, ATS-friendly',
    preview: (
      <div className="w-full h-full bg-white p-2 text-left">
        <div className="border-b-2 border-black pb-1 mb-1.5">
          <div className="h-2.5 w-20 bg-black rounded mb-1" />
          <div className="flex gap-1">
            <div className="h-1.5 w-10 bg-gray-400 rounded" />
            <div className="h-1.5 w-8 bg-gray-400 rounded" />
          </div>
        </div>
        <div className="flex gap-2 mb-1.5">
          <div className="h-1.5 w-10 bg-black rounded flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="h-1 w-full bg-gray-200 rounded mb-0.5" />
            <div className="h-1 w-4/5 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-1.5 w-10 bg-black rounded flex-shrink-0 mt-0.5" />
          <div className="h-1 w-full bg-gray-200 rounded" />
        </div>
      </div>
    ),
    ring: 'ring-gray-400',
    badge: 'bg-gray-800 text-gray-300 border-gray-600/30',
  },
]

function getDocument(templateId, resume) {
  if (templateId === 'modern') return <ResumePDFModern resume={resume} />
  if (templateId === 'minimal') return <ResumePDFMinimal resume={resume} />
  return <ResumePDF resume={resume} />
}

export default function ResumeView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [docxLoading, setDocxLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('classic')

  const [shareLoading, setShareLoading] = useState(false)
  const [shareId, setShareId] = useState(null)
  const [isPublic, setIsPublic] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/resume/${id}`)
        setResume(data)
        if (data.isPublic && data.shareId) {
          setIsPublic(true)
          setShareId(data.shareId)
        }
      } catch {
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const getShareUrl = (sid) => `${window.location.origin}/r/${sid}`

  const handleShare = async () => {
    setShareLoading(true)
    try {
      const { data } = await api.post(`/resume/${id}/share`)
      setShareId(data.shareId)
      setIsPublic(true)
    } catch (err) {
      console.error(err)
    } finally {
      setShareLoading(false)
    }
  }

  const handleRevoke = async () => {
    if (!window.confirm('Revoke public link? Anyone with the link will no longer be able to view this resume.')) return
    setShareLoading(true)
    try {
      await api.delete(`/resume/${id}/share`)
      setShareId(null)
      setIsPublic(false)
    } catch (err) {
      console.error(err)
    } finally {
      setShareLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getShareUrl(shareId))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadDOCX = async () => {
    setDocxLoading(true)
    try {
      const response = await api.post(`/resume/${id}/export-docx`, {}, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${resume.title || 'resume'}.docx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error(err)
    } finally {
      setDocxLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-400">
        <span className="animate-spin w-5 h-5 border-2 border-gray-600 border-t-purple-500 rounded-full" />
        Loading...
      </div>
    </div>
  )
  if (!resume) return null

  const activeTemplate = TEMPLATES.find(t => t.id === selectedTemplate)

  return (
    <div className="min-h-screen bg-[#0f0f13]">
      <nav className="navbar-glass px-4 sm:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-purple-400 tracking-tight">Rezumi</h1>
        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-purple-400 font-medium text-sm transition-colors">
          ← Back
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 animate-fade-up">{resume.title}</h2>

        {/* Template Picker */}
        <div className="card p-5 mb-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <h3 className="text-sm font-semibold text-gray-200 mb-1">Choose a Template</h3>
          <p className="text-xs text-gray-500 mb-4">Pick a style before downloading your PDF</p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? `ring-2 ${template.ring} ring-offset-2 ring-offset-[#1a1a24] border-transparent scale-[1.02] shadow-lg`
                    : 'border-purple-900/20 hover:border-purple-600/40 hover:scale-[1.01]'
                }`}
              >
                <div className="h-20 sm:h-24 w-full overflow">{template.preview}</div>
                <div className="p-2 bg-[#22223a] text-left">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-gray-200 truncate">{template.name}</span>
                    {selectedTemplate === template.id && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium border flex-shrink-0 ${template.badge}`}>✓</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-tight hidden sm:block">{template.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <PDFDownloadLink
            key={selectedTemplate}
            document={getDocument(selectedTemplate, resume)}
            fileName={`${resume.title || 'resume'}-${selectedTemplate}.pdf`}
            className="btn-glow flex-1 sm:flex-none text-center bg-purple-600 text-white px-4 sm:px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition text-xs sm:text-sm shadow-lg shadow-purple-900/30"
          >
            {({ loading: pdfLoading }) => pdfLoading ? 'Preparing...' : `⬇ PDF — ${activeTemplate?.name}`}
          </PDFDownloadLink>
          <button
            onClick={downloadDOCX}
            disabled={docxLoading}
            className="btn-glow flex-1 sm:flex-none bg-[#1a1a24] border border-purple-900/30 text-gray-200 px-4 sm:px-6 py-2.5 rounded-xl font-semibold hover:border-purple-600/50 transition text-xs sm:text-sm disabled:opacity-40"
          >
            {docxLoading ? 'Preparing...' : '⬇ DOCX'}
          </button>
        </div>

        {/* Share Section */}
        <div className="card p-4 sm:p-5 mb-6 animate-fade-up" style={{ animationDelay: '130ms' }}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className="text-sm font-semibold text-gray-200">🔗 Public Share Link</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isPublic ? 'Anyone with the link can view this resume' : 'Generate a link to share your resume publicly'}
              </p>
            </div>
            {!isPublic ? (
              <button
                onClick={handleShare}
                disabled={shareLoading}
                className="btn-glow bg-purple-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-40 whitespace-nowrap"
              >
                {shareLoading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="animate-spin w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />
                    Generating...
                  </span>
                ) : 'Generate Link'}
              </button>
            ) : (
              <button
                onClick={handleRevoke}
                disabled={shareLoading}
                className="text-red-400 text-xs font-medium hover:text-red-300 transition-colors disabled:opacity-40 whitespace-nowrap"
              >
                {shareLoading ? 'Revoking...' : 'Revoke Link'}
              </button>
            )}
          </div>

          {isPublic && shareId && (
            <div className="mt-3 flex items-center gap-2 animate-scale-in">
              <div className="flex-1 bg-[#0f0f13] border border-purple-900/30 rounded-lg px-3 py-2 text-xs text-purple-300 font-mono truncate">
                {getShareUrl(shareId)}
              </div>
              <button
                onClick={handleCopy}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
              <a
                href={getShareUrl(shareId)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#22223a] border border-purple-900/30 text-gray-300 hover:text-purple-400 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
              >
                Preview ↗
              </a>
            </div>
          )}
        </div>

        {/* Resume Preview */}
        <div className="card p-5 sm:p-8 animate-fade-up" style={{ animationDelay: '160ms' }}>
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
            <div className="mb-5 sm:mb-6">
              <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Summary</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{resume.personalInfo.summary}</p>
            </div>
          )}
          {resume.education?.length > 0 && (
            <div className="mb-5 sm:mb-6">
              <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Education</h2>
              {resume.education.map((edu, i) => (
                <div key={i} className="mb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-semibold text-gray-200 text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                    <span className="text-xs text-gray-500">{edu.startYear} {edu.endYear && `– ${edu.endYear}`}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">{edu.institution} {edu.grade && `| ${edu.grade}`}</p>
                </div>
              ))}
            </div>
          )}
          {resume.experience?.some(e => e.company) && (
            <div className="mb-5 sm:mb-6">
              <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Experience</h2>
              {resume.experience.filter(e => e.company).map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-semibold text-gray-200 text-sm">{exp.role}</span>
                    <span className="text-xs text-gray-500">{exp.startDate} {exp.endDate && `– ${exp.endDate}`}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">{exp.company}</p>
                  {exp.description && <p className="text-xs sm:text-sm text-gray-400 mt-1 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}
          {resume.skills?.length > 0 && (
            <div className="mb-5 sm:mb-6">
              <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, i) => <span key={i} className="tag-purple">{skill}</span>)}
              </div>
            </div>
          )}
          {resume.projects?.some(p => p.name) && (
            <div>
              <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Projects</h2>
              {resume.projects.filter(p => p.name).map((proj, i) => (
                <div key={i} className="mb-4">
                  <span className="font-semibold text-gray-200 text-sm">{proj.name}</span>
                  {proj.techStack && <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Tech: {proj.techStack}</p>}
                  {proj.description && <p className="text-xs sm:text-sm text-gray-400 mt-1 leading-relaxed">{proj.description}</p>}
                  {proj.link && <p className="text-xs text-purple-400 mt-1">{proj.link}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}