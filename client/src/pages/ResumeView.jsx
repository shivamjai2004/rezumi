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
        <div className="mb-1.5">
          <div className="h-1.5 w-14 bg-indigo-400 rounded mb-1" />
          <div className="flex gap-1 flex-wrap">
            <div className="h-2 w-8 bg-indigo-100 rounded" />
            <div className="h-2 w-10 bg-indigo-100 rounded" />
            <div className="h-2 w-7 bg-indigo-100 rounded" />
          </div>
        </div>
      </div>
    ),
    accent: 'border-indigo-500',
    badge: 'bg-indigo-100 text-indigo-700',
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
              <div className="h-2 w-6 bg-sky-100 border border-sky-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    ),
    accent: 'border-sky-500',
    badge: 'bg-sky-100 text-sky-700',
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
    accent: 'border-gray-900',
    badge: 'bg-gray-100 text-gray-700',
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

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/resume/${id}`)
        setResume(data)
      } catch {
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (!resume) return null

  const activeTemplate = TEMPLATES.find(t => t.id === selectedTemplate)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-4 sm:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">Rezumi</h1>
        <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-indigo-600 font-medium text-sm sm:text-base">
          ← Back
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{resume.title}</h2>
        </div>

        {/* Template Picker */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Choose a Template</h3>
          <p className="text-xs text-gray-400 mb-4">Pick a style before downloading your PDF</p>
          <div className="grid grid-cols-3 gap-3">
            {TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`group relative rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? `${template.accent} shadow-md scale-[1.02]`
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="h-24 w-full overflow-hidden bg-gray-50">
                  {template.preview}
                </div>
                <div className="p-2 border-t border-gray-100 bg-white text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-800">{template.name}</span>
                    {selectedTemplate === template.id && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${template.badge}`}>✓</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{template.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Download Buttons */}
        <div className="flex gap-2 sm:gap-3 mb-6">
          <PDFDownloadLink
            key={selectedTemplate}
            document={getDocument(selectedTemplate, resume)}
            fileName={`${resume.title || 'resume'}-${selectedTemplate}.pdf`}
            className="flex-1 sm:flex-none text-center bg-indigo-600 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition text-xs sm:text-sm"
          >
            {({ loading: pdfLoading }) =>
              pdfLoading ? 'Preparing...' : `⬇ PDF (${activeTemplate?.name})`
            }
          </PDFDownloadLink>
          <button
            onClick={downloadDOCX}
            disabled={docxLoading}
            className="flex-1 sm:flex-none bg-green-600 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition text-xs sm:text-sm disabled:opacity-50"
          >
            {docxLoading ? 'Preparing...' : '⬇ DOCX'}
          </button>
        </div>

        {/* Resume Preview */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-8">
          <div className="border-b-2 border-indigo-500 pb-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600">{resume.personalInfo?.name}</h1>
            <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
              {resume.personalInfo?.email && <span>✉ {resume.personalInfo.email}</span>}
              {resume.personalInfo?.phone && <span>📞 {resume.personalInfo.phone}</span>}
              {resume.personalInfo?.location && <span>📍 {resume.personalInfo.location}</span>}
              {resume.personalInfo?.github && <span>GitHub: {resume.personalInfo.github}</span>}
              {resume.personalInfo?.linkedin && <span>LinkedIn: {resume.personalInfo.linkedin}</span>}
            </div>
          </div>

          {resume.personalInfo?.summary && (
            <div className="mb-5 sm:mb-6">
              <h2 className="text-xs sm:text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Summary</h2>
              <p className="text-gray-600 text-sm">{resume.personalInfo.summary}</p>
            </div>
          )}

          {resume.education?.length > 0 && (
            <div className="mb-5 sm:mb-6">
              <h2 className="text-xs sm:text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Education</h2>
              {resume.education.map((edu, i) => (
                <div key={i} className="mb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-semibold text-gray-800 text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                    <span className="text-xs text-gray-400">{edu.startYear} {edu.endYear && `- ${edu.endYear}`}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">{edu.institution} {edu.grade && `| ${edu.grade}`}</p>
                </div>
              ))}
            </div>
          )}

          {resume.experience?.some(e => e.company) && (
            <div className="mb-5 sm:mb-6">
              <h2 className="text-xs sm:text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Experience</h2>
              {resume.experience.filter(e => e.company).map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-semibold text-gray-800 text-sm">{exp.role}</span>
                    <span className="text-xs text-gray-400">{exp.startDate} {exp.endDate && `- ${exp.endDate}`}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">{exp.company}</p>
                  {exp.description && <p className="text-xs sm:text-sm text-gray-600 mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {resume.skills?.length > 0 && (
            <div className="mb-5 sm:mb-6">
              <h2 className="text-xs sm:text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {resume.projects?.some(p => p.name) && (
            <div className="mb-5 sm:mb-6">
              <h2 className="text-xs sm:text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Projects</h2>
              {resume.projects.filter(p => p.name).map((proj, i) => (
                <div key={i} className="mb-3">
                  <span className="font-semibold text-gray-800 text-sm">{proj.name}</span>
                  {proj.techStack && <p className="text-xs sm:text-sm text-gray-500">Tech: {proj.techStack}</p>}
                  {proj.description && <p className="text-xs sm:text-sm text-gray-600 mt-1">{proj.description}</p>}
                  {proj.link && <p className="text-xs sm:text-sm text-indigo-500 mt-1">{proj.link}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}