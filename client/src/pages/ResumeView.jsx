import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PDFDownloadLink } from '@react-pdf/renderer'
import api from '../utils/api'
import ResumePDF from '../components/ResumePDF'

export default function ResumeView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [docxLoading, setDocxLoading] = useState(false)

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
          <div className="flex gap-2 sm:gap-3">
            <PDFDownloadLink
              document={<ResumePDF resume={resume} />}
              fileName={`${resume.title || 'resume'}.pdf`}
              className="flex-1 sm:flex-none text-center bg-indigo-600 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition text-xs sm:text-sm"
            >
              {({ loading }) => loading ? 'Preparing...' : '⬇ PDF'}
            </PDFDownloadLink>
            <button
              onClick={downloadDOCX}
              disabled={docxLoading}
              className="flex-1 sm:flex-none bg-green-600 text-white px-4 sm:px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition text-xs sm:text-sm disabled:opacity-50"
            >
              {docxLoading ? 'Preparing...' : '⬇ DOCX'}
            </button>
          </div>
        </div>

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