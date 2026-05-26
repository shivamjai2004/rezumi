import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function Analyzer() {
  const navigate = useNavigate()
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf')
      return setError('Please upload a PDF file only')

    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const { data } = await api.post('/analyze/extract-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResumeText(data.text)
    } catch (err) {
      setError('Failed to extract text from PDF')
    } finally {
      setUploading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim())
      return setError('Both fields are required')
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data } = await api.post('/analyze/text', { resumeText, jobDescription })
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score) => {
    if (score >= 75) return 'bg-green-50 border-green-200'
    if (score >= 50) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Rezumi</h1>
        <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-indigo-600 font-medium">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Resume Analyzer</h2>
        <p className="text-gray-500 mb-8">Paste or upload your resume — AI will score your match instantly</p>

        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Resume Text */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">📄 Your Resume</h3>
              {/* Upload PDF Button */}
              <label className="cursor-pointer bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">
                {uploading ? 'Extracting...' : '⬆ Upload PDF'}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePDFUpload}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              rows={12}
              placeholder="Paste your resume text here or upload a PDF above..."
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
            />
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-700 mb-3">💼 Job Description</h3>
            <textarea
              rows={12}
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 mb-8"
        >
          {loading ? '🤖 AI is analyzing...' : 'Analyze Match'}
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <div className={`rounded-2xl border-2 p-8 text-center ${getScoreBg(result.matchScore)}`}>
              <p className="text-gray-600 font-medium mb-2">Match Score</p>
              <p className={`text-7xl font-bold ${getScoreColor(result.matchScore)}`}>
                {result.matchScore}%
              </p>
              <p className="text-gray-500 mt-2">
                {result.matchScore >= 75 ? '🎉 Great match!' : result.matchScore >= 50 ? '⚠️ Decent match, room to improve' : '❌ Low match, needs work'}
              </p>
            </div>

            {result.overallFeedback && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-700 mb-3">📊 Overall Feedback</h3>
                <p className="text-gray-600">{result.overallFeedback}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-700 mb-3">✅ Matched Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords?.map((kw, i) => (
                    <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">{kw}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-700 mb-3">❌ Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw, i) => (
                    <span key={i} className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {result.strengths?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-700 mb-3">💪 Strengths</h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.suggestions?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-700 mb-3">💡 Suggestions to Improve</h3>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <span className="text-indigo-500 mt-0.5">→</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}