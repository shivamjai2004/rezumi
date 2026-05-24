import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function Builder() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('form') // 'form' or 'text'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Plain text mode
  const [plainText, setPlainText] = useState('')
  const [title, setTitle] = useState('My Resume')

  // Form mode
  const [form, setForm] = useState({
    title: 'My Resume',
    personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', summary: '' },
    education: [{ institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '' }],
    experience: [{ company: '', role: '', startDate: '', endDate: '', description: '' }],
    skills: '',
    projects: [{ name: '', description: '', techStack: '', link: '' }]
  })

  // Form helpers
  const updatePersonal = (field, value) => {
    setForm({ ...form, personalInfo: { ...form.personalInfo, [field]: value } })
  }

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
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean)
      }
      await api.post('/resume/form', payload)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Rezumi</h1>
        <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-indigo-600 font-medium">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Build Your Resume</h2>
        <p className="text-gray-500 mb-6">AI will enhance your content automatically</p>

        {/* Mode Toggle */}
        <div className="flex bg-gray-200 rounded-xl p-1 mb-8 w-fit">
          <button
            onClick={() => setMode('form')}
            className={`px-6 py-2 rounded-lg font-medium transition ${mode === 'form' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'}`}
          >
            📝 Form Mode
          </button>
          <button
            onClick={() => setMode('text')}
            className={`px-6 py-2 rounded-lg font-medium transition ${mode === 'text' ? 'bg-white text-indigo-600 shadow' : 'text-gray-600'}`}
          >
            ✍️ Text Mode
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>}

        {/* TEXT MODE */}
        {mode === 'text' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Describe yourself in plain text</h3>
            <input
              type="text"
              placeholder="Resume Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              rows={10}
              placeholder="Example: My name is Shivam Jaiswal. I am pursuing MCA in AI and ML from XYZ University. I know MERN stack, React, Node.js, MongoDB. I built a resume builder project. My email is shivam@gmail.com..."
              value={plainText}
              onChange={e => setPlainText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <button
              onClick={handleTextSubmit}
              disabled={loading}
              className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? '🤖 AI is building your resume...' : 'Generate Resume with AI'}
            </button>
          </div>
        )}

        {/* FORM MODE */}
        {mode === 'form' && (
          <div className="space-y-6">

            {/* Title */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4">Resume Title</h3>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="My MCA Resume"
              />
            </div>

            {/* Personal Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4">👤 Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['name', 'email', 'phone', 'location', 'linkedin', 'github'].map(field => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form.personalInfo[field]}
                    onChange={e => updatePersonal(field, e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ))}
                <textarea
                  placeholder="Summary (AI will enhance this)"
                  value={form.personalInfo.summary}
                  onChange={e => updatePersonal('summary', e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2 resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4">🎓 Education</h3>
              {form.education.map((edu, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {['institution', 'degree', 'field', 'startYear', 'endYear', 'grade'].map(field => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={edu[field]}
                      onChange={e => updateEducation(i, field, e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ))}
                </div>
              ))}
              <button
                onClick={() => setForm({ ...form, education: [...form.education, { institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '' }] })}
                className="text-indigo-600 text-sm font-medium hover:underline"
              >
                + Add Education
              </button>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4">💼 Experience</h3>
              {form.experience.map((exp, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {['company', 'role', 'startDate', 'endDate'].map(field => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={exp[field]}
                      onChange={e => updateExperience(i, field, e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ))}
                  <textarea
                    placeholder="Description (AI will enhance this)"
                    value={exp.description}
                    onChange={e => updateExperience(i, 'description', e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2 resize-none"
                    rows={3}
                  />
                </div>
              ))}
              <button
                onClick={() => setForm({ ...form, experience: [...form.experience, { company: '', role: '', startDate: '', endDate: '', description: '' }] })}
                className="text-indigo-600 text-sm font-medium hover:underline"
              >
                + Add Experience
              </button>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4">🛠️ Skills</h3>
              <input
                type="text"
                placeholder="React, Node.js, MongoDB, Python, ML (comma separated)"
                value={form.skills}
                onChange={e => setForm({ ...form, skills: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Projects */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-700 mb-4">🚀 Projects</h3>
              {form.projects.map((proj, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {['name', 'techStack', 'link'].map(field => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={proj[field]}
                      onChange={e => updateProject(i, field, e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ))}
                  <textarea
                    placeholder="Project description (AI will enhance this)"
                    value={proj.description}
                    onChange={e => updateProject(i, 'description', e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2 resize-none"
                    rows={3}
                  />
                </div>
              ))}
              <button
                onClick={() => setForm({ ...form, projects: [...form.projects, { name: '', description: '', techStack: '', link: '' }] })}
                className="text-indigo-600 text-sm font-medium hover:underline"
              >
                + Add Project
              </button>
            </div>

            {/* Submit */}
            <button
              onClick={handleFormSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? '🤖 AI is enhancing your resume...' : 'Generate Resume with AI'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}