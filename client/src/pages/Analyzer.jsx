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
    if (file.type !== 'application/pdf') return setError('Please upload a PDF file only')
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const { data } = await api.post('/analyze/extract-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setResumeText(data.text)
    } catch {
      setError('Failed to extract text from PDF')
    } finally {
      setUploading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return setError('Both fields are required')
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

  const getScoreColor = (score) => score >= 75 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'
  const getScoreBg = (score) => score >= 75 ? 'border-green-700/40 bg-green-900/10' : score >= 50 ? 'border-yellow-700/40 bg-yellow-900/10' : 'border-red-700/40 bg-red-900/10'

  return (
    <div className="min-h-screen bg-[#0f0f13]">
      <nav className="bg-[#1a1a24] border-b border-purple-900/30 px-4 sm:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-purple-400">Rezumi</h1>
        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-purple-400 font-medium text-sm transition">
          ← Dashboard
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Resume Analyzer</h2>
        <p className="text-gray-500 text-sm mb-8">Paste or upload your resume — AI will score your match instantly</p>

        {error && <div className="bg-red-900/30 border border-red-700/40 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="bg-[#1a1a24] border border-purple-900/30 rounded-2xl p-5 sm:p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-200 text-sm">📄 Your Resume</h3>
              <label className="cursor-pointer bg-purple-900/40 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-purple-900/60 transition border border-purple-700/30">
                {uploading ? 'Extracting...' : '⬆ Upload PDF'}
                <input type="file" accept=".pdf" onChange={handlePDFUpload} className="hidden" />
              </label>
            </div>
            <textarea
              rows={10}
              placeholder="Paste your resume text here or upload a PDF above..."
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              className="w-full bg-[#22223a] border border-purple-900/30 text-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm placeholder-gray-600"
            />
          </div>

          <div className="bg-[#1a1a24] border border-purple-900/30 rounded-2xl p-5 sm:p-6">
            <h3 className="font-semibold text-gray-200 mb-3 text-sm">💼 Job Description</h3>
            <textarea
              rows={10}
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              className="w-full bg-[#22223a] border border-purple-900/30 text-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm placeholder-gray-600"
            />
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 mb-8 shadow-lg shadow-purple-900/30"
        >
          {loading ? '🤖 AI is analyzing...' : 'Analyze Match'}
        </button>

        {result && (
          <div className="space-y-4 sm:space-y-6">
            <div className={`rounded-2xl border-2 p-8 text-center ${getScoreBg(result.matchScore)}`}>
              <p className="text-gray-400 font-medium mb-2 text-sm">Match Score</p>
              <p className={`text-7xl font-bold ${getScoreColor(result.matchScore)}`}>{result.matchScore}%</p>
              <p className="text-gray-400 mt-2 text-sm">
                {result.matchScore >= 75 ? '🎉 Great match!' : result.matchScore >= 50 ? '⚠️ Decent match, room to improve' : '❌ Low match, needs work'}
              </p>
            </div>

            {result.overallFeedback && (
              <div className="bg-[#1a1a24] border border-purple-900/30 rounded-2xl p-5 sm:p-6">
                <h3 className="font-semibold text-gray-200 mb-3 text-sm">📊 Overall Feedback</h3>
                <p className="text-gray-400 text-sm">{result.overallFeedback}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-[#1a1a24] border border-purple-900/30 rounded-2xl p-5 sm:p-6">
                <h3 className="font-semibold text-gray-200 mb-3 text-sm">✅ Matched Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords?.map((kw, i) => (
                    <span key={i} className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-700/30">{kw}</span>
                  ))}
                </div>
              </div>
              <div className="bg-[#1a1a24] border border-purple-900/30 rounded-2xl p-5 sm:p-6">
                <h3 className="font-semibold text-gray-200 mb-3 text-sm">❌ Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw, i) => (
                    <span key={i} className="bg-red-900/30 text-red-400 px-3 py-1 rounded-full text-xs font-medium border border-red-700/30">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            {result.strengths?.length > 0 && (
              <div className="bg-[#1a1a24] border border-purple-900/30 rounded-2xl p-5 sm:p-6">
                <h3 className="font-semibold text-gray-200 mb-3 text-sm">💪 Strengths</h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                      <span className="text-green-400 mt-0.5">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.suggestions?.length > 0 && (
              <div className="bg-[#1a1a24] border border-purple-900/30 rounded-2xl p-5 sm:p-6">
                <h3 className="font-semibold text-gray-200 mb-3 text-sm">💡 Suggestions</h3>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                      <span className="text-purple-400 mt-0.5">→</span> {s}
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