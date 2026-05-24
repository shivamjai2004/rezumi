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
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Rezumi</h1>
        <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-indigo-600 font-medium">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{resume.title}</h2>
          <div className="flex gap-3">
            {/* PDF Download */}
            <PDFDownloadLink
              document={<ResumePDF resume={resume} />}
              fileName={`${resume.title || 'resume'}.pdf`}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition text-sm"
            >
              {({ loading }) => loading ? 'Preparing PDF...' : '⬇ Download PDF'}
            </PDFDownloadLink>

            {/* DOCX Download */}
            <button
              onClick={downloadDOCX}
              disabled={docxLoading}
              className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition text-sm disabled:opacity-50"
            >
              {docxLoading ? 'Preparing...' : '⬇ Download DOCX'}
            </button>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="bg-white rounded-2xl shadow-sm p-8">

          {/* Header */}
          <div className="border-b-2 border-indigo-500 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-indigo-600">{resume.personalInfo?.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              {resume.personalInfo?.email && <span>✉ {resume.personalInfo.email}</span>}
              {resume.personalInfo?.phone && <span>📞 {resume.personalInfo.phone}</span>}
              {resume.personalInfo?.location && <span>📍 {resume.personalInfo.location}</span>}
              {resume.personalInfo?.github && <span>GitHub: {resume.personalInfo.github}</span>}
              {resume.personalInfo?.linkedin && <span>LinkedIn: {resume.personalInfo.linkedin}</span>}
            </div>
          </div>

          {/* Summary */}
          {resume.personalInfo?.summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Summary</h2>
              <p className="text-gray-600">{resume.personalInfo.summary}</p>
            </div>
          )}

          {/* Education */}
          {resume.education?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Education</h2>
              {resume.education.map((edu, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                    <span className="text-sm text-gray-400">{edu.startYear} {edu.endYear && `- ${edu.endYear}`}</span>
                  </div>
                  <p className="text-sm text-gray-500">{edu.institution} {edu.grade && `| ${edu.grade}`}</p>
                </div>
              ))}
            </div>
          )}

          {/* Experience */}
          {resume.experience?.some(e => e.company) && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Experience</h2>
              {resume.experience.filter(e => e.company).map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">{exp.role}</span>
                    <span className="text-sm text-gray-400">{exp.startDate} {exp.endDate && `- ${exp.endDate}`}</span>
                  </div>
                  <p className="text-sm text-gray-500">{exp.company}</p>
                  {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {resume.skills?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects?.some(p => p.name) && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Projects</h2>
              {resume.projects.filter(p => p.name).map((proj, i) => (
                <div key={i} className="mb-3">
                  <span className="font-semibold text-gray-800">{proj.name}</span>
                  {proj.techStack && <p className="text-sm text-gray-500">Tech: {proj.techStack}</p>}
                  {proj.description && <p className="text-sm text-gray-600 mt-1">{proj.description}</p>}
                  {proj.link && <p className="text-sm text-indigo-500 mt-1">{proj.link}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}