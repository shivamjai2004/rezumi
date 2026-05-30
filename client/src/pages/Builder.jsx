import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function Builder() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('form')
  const [loading, setLoading] = useState(false)
  const [pdfUploading, setPdfUploading] = useState(false)
  const [error, setError] = useState('')

  const [plainText, setPlainText] = useState('')
  const [title, setTitle] = useState('My Resume')

  const [form, setForm] = useState({
    title: 'My Resume',
    personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', summary: '' },
    education: [{ institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '' }],
    experience: [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
    skills: '',
    projects: [{ name: '', description: '', techStack: '', link: '' }]
  })

  const updatePersonal = (field, value) =>
    setForm({ ...form, personalInfo: { ...form.personalInfo, [field]: value } })

  const updateEducation = (index, field, value) => {
    const updated = [...form.education]
    updated[index][field] = value
    setForm({ ...form, education: updated })
  }

  const updateExperience = (index, field, value) => {
    const updated = [...form.experience]
    updated[index][field] = value
    setForm({ ...form, experience: updated })
  }

  const updateProject = (index, field, value) => {
    const updated = [...form.projects]
    updated[index][field] = value
    setForm({ ...form, projects: updated })
  }

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') return setError('Please upload a PDF file only')
    setPdfUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const { data } = await api.post('/analyze/extract-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const parsed = await api.post('/resume/parse-text', { plainText: data.text })
      setForm({
        ...form,
        personalInfo: parsed.data.personalInfo || form.personalInfo,
        education: parsed.data.education?.length > 0 ? parsed.data.education : form.education,
        experience: parsed.data.experience?.length > 0 ? parsed.data.experience : form.experience,
        skills: parsed.data.skills?.join(', ') || form.skills,
        projects: parsed.data.projects?.length > 0 ? parsed.data.projects : form.projects,
      })
      setMode('form')
    } catch {
      setError('Failed to extract resume data from PDF')
    } finally {
      setPdfUploading(false)
    }
  }

  const handleTextSubmit = async () => {
    if (!plainText.trim()) return setError('Please enter some text')
    setLoading(true)
    setError('')
    try {
      await api.post('/resume/text', { plainText, title })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) }
      await api.post('/resume/form', payload)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'input-dark'
  const sectionCls = 'card p-5 sm:p-6 animate-fade-up'

  return (
    <div className="min-h-screen bg-[#0f0f13]">

      {/* Navbar */}
      <nav className="navbar-glass px-4 sm:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-purple-400 tracking-tight">Rezumi</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-purple-400 font-medium text-sm transition-colors duration-150 flex items-center gap-1"
        >
          ← Dashboard
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Page heading */}
        <div className="mb-6 animate-fade-up">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Build Your Resume</h2>
          <p className="text-gray-500 text-sm mt-1">AI will enhance your content automatically</p>
        </div>

        {/* PDF Upload drop zone */}
        <div className="drop-zone p-5 mb-6 animate-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-200 text-sm">📤 Have an existing resume?</h3>
              <p className="text-xs text-gray-500 mt-1">Upload your PDF and AI will pre-fill the form</p>
            </div>
            <label className="btn-glow cursor-pointer bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-700 text-sm whitespace-nowrap flex items-center justify-center gap-2 min-h-[44px]">
              {pdfUploading ? (
                <><span className="animate-spin inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />Extracting...</>
              ) : '⬆ Upload PDF'}
              <input type="file" accept=".pdf" onChange={handlePDFUpload} className="hidden" />
            </label>
          </div>
          {pdfUploading && (
            <p className="mt-3 text-xs text-purple-400 animate-pulse">🤖 AI is reading your resume...</p>
          )}
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-[#1a1a24] border border-purple-900/20 rounded-xl p-1 mb-6 w-fit animate-fade-up" style={{ animationDelay: '100ms' }}>
          {[{ id: 'form', label: '📝 Form Mode' }, { id: 'text', label: '✍️ Text Mode' }].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                mode === id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700/30 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm animate-scale-in">
            {error}
          </div>
        )}

        {/* TEXT MODE */}
        {mode === 'text' && (
          <div className={sectionCls}>
            <h3 className="font-semibold text-gray-200 mb-4 text-sm">Describe yourself in plain text</h3>
            <input
              type="text"
              placeholder="Resume Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={`${inputCls} mb-4`}
            />
            <textarea
              rows={10}
              placeholder="Example: My name is Shivam Jaiswal. I am pursuing MCA in AI and ML. I know MERN stack, React, Node.js, MongoDB. I built a resume builder project..."
              value={plainText}
              onChange={e => setPlainText(e.target.value)}
              className="textarea-dark"
            />
            <button
              onClick={handleTextSubmit}
              disabled={loading}
              className="btn-glow mt-4 w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-40 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  AI is building your resume...
                </span>
              ) : 'Generate Resume with AI'}
            </button>
          </div>
        )}

        {/* FORM MODE */}
        {mode === 'form' && (
          <div className="space-y-4 stagger">

            {/* Title */}
            <div className={sectionCls}>
              <h3 className="font-semibold text-gray-200 mb-4 text-sm">Resume Title</h3>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className={inputCls}
                placeholder="My MCA Resume"
              />
            </div>

            {/* Personal Info */}
            <div className={sectionCls}>
              <h3 className="font-semibold text-gray-200 mb-4 text-sm">👤 Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {['name', 'email', 'phone', 'location', 'linkedin', 'github'].map(field => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form.personalInfo[field]}
                    onChange={e => updatePersonal(field, e.target.value)}
                    className={inputCls}
                  />
                ))}
                <textarea
                  placeholder="Summary (AI will enhance this)"
                  value={form.personalInfo.summary}
                  onChange={e => updatePersonal('summary', e.target.value)}
                  className="textarea-dark sm:col-span-2"
                  rows={3}
                />
              </div>
            </div>

            {/* Education */}
            <div className={sectionCls}>
              <h3 className="font-semibold text-gray-200 mb-4 text-sm">🎓 Education</h3>
              {form.education.map((edu, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 pb-4 border-b border-purple-900/20 last:border-0 last:mb-0 last:pb-0">
                  {['institution', 'degree', 'field', 'startYear', 'endYear', 'grade'].map(field => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={edu[field]}
                      onChange={e => updateEducation(i, field, e.target.value)}
                      className={inputCls}
                    />
                  ))}
                </div>
              ))}
              <button
                onClick={() => setForm({ ...form, education: [...form.education, { institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '' }] })}
                className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
              >
                + Add Education
              </button>
            </div>

            {/* Experience */}
            <div className={sectionCls}>
              <h3 className="font-semibold text-gray-200 mb-4 text-sm">💼 Experience</h3>
              {form.experience.map((exp, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 pb-4 border-b border-purple-900/20 last:border-0 last:mb-0 last:pb-0">
                  {['company', 'role', 'startDate', 'endDate'].map(field => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={exp[field]}
                      onChange={e => updateExperience(i, field, e.target.value)}
                      className={inputCls}
                    />
                  ))}
                  <textarea
                    placeholder="Description (AI will enhance this)"
                    value={exp.description}
                    onChange={e => updateExperience(i, 'description', e.target.value)}
                    className="textarea-dark sm:col-span-2"
                    rows={3}
                  />
                </div>
              ))}
              <button
                onClick={() => setForm({ ...form, experience: [...form.experience, { company: '', role: '', startDate: '', endDate: '', description: '' }] })}
                className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
              >
                + Add Experience
              </button>
            </div>

            {/* Skills */}
            <div className={sectionCls}>
              <h3 className="font-semibold text-gray-200 mb-4 text-sm">🛠️ Skills</h3>
              <input
                type="text"
                placeholder="React, Node.js, MongoDB, Python, ML (comma separated)"
                value={form.skills}
                onChange={e => setForm({ ...form, skills: e.target.value })}
                className={inputCls}
              />
            </div>

            {/* Projects */}
            <div className={sectionCls}>
              <h3 className="font-semibold text-gray-200 mb-4 text-sm">🚀 Projects</h3>
              {form.projects.map((proj, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 pb-4 border-b border-purple-900/20 last:border-0 last:mb-0 last:pb-0">
                  {['name', 'techStack', 'link'].map(field => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={proj[field]}
                      onChange={e => updateProject(i, field, e.target.value)}
                      className={inputCls}
                    />
                  ))}
                  <textarea
                    placeholder="Project description (AI will enhance this)"
                    value={proj.description}
                    onChange={e => updateProject(i, 'description', e.target.value)}
                    className="textarea-dark sm:col-span-2"
                    rows={3}
                  />
                </div>
              ))}
              <button
                onClick={() => setForm({ ...form, projects: [...form.projects, { name: '', description: '', techStack: '', link: '' }] })}
                className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
              >
                + Add Project
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={handleFormSubmit}
              disabled={loading}
              className="btn-glow w-full bg-purple-600 text-white py-3.5 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-40 text-sm sm:text-base animate-fade-up"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  AI is enhancing your resume...
                </span>
              ) : 'Generate Resume with AI'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}