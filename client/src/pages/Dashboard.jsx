import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await api.get('/resume')
        setResumes(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchResumes()
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return
    try {
      await api.delete(`/resume/${id}`)
      setResumes(resumes.filter(r => r._id !== id))
    } catch (err) { console.error(err) }
  }

  return (
    <div className="min-h-screen bg-[#0f0f13]">

      {/* Navbar */}
      <nav className="bg-[#1a1a24] border-b border-purple-900/30 px-4 sm:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-purple-400">Rezumi</h1>
          <div className="hidden sm:flex items-center gap-6">
            <span className="text-gray-400 text-sm">Hi, {user?.name} 👋</span>
            <Link to="/analyzer" className="text-purple-400 font-medium hover:underline text-sm">Analyzer</Link>
            <button onClick={handleLogout} className="text-red-400 font-medium hover:underline text-sm">Logout</button>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-gray-400 text-2xl">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        {menuOpen && (
          <div className="sm:hidden mt-3 pb-3 border-t border-purple-900/30 pt-3 flex flex-col gap-3">
            <span className="text-gray-400 text-sm">Hi, {user?.name} 👋</span>
            <Link to="/analyzer" className="text-purple-400 font-medium text-sm">Analyzer</Link>
            <button onClick={handleLogout} className="text-red-400 font-medium text-left text-sm">Logout</button>
          </div>
        )}
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">My Resumes</h2>
            <p className="text-gray-500 text-sm mt-1">Manage and export your AI-generated resumes</p>
          </div>
          <Link to="/builder" className="bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition text-center text-sm sm:text-base shadow-lg shadow-purple-900/30">
            + New Resume
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-white mb-2">No resumes yet</h3>
            <p className="text-gray-500 mb-6 text-sm">Create your first AI-powered resume</p>
            <Link to="/builder" className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition text-sm">
              Build My Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {resumes.map((resume) => (
              <div key={resume._id} className="bg-[#1a1a24] border border-purple-900/30 rounded-2xl p-5 sm:p-6 hover:border-purple-600/50 transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base">{resume.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{resume.personalInfo?.name}</p>
                  </div>
                  <span className="bg-purple-900/40 text-purple-300 text-xs px-2 py-1 rounded-full font-medium border border-purple-700/30">
                    {resume.template}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mb-4 space-y-1">
                  <p>📚 {resume.education?.length || 0} education</p>
                  <p>💼 {resume.experience?.length || 0} experience</p>
                  <p>🛠️ {resume.skills?.length || 0} skills</p>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  Created {new Date(resume.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Link to={`/resume/${resume._id}`} className="flex-1 text-center bg-purple-900/40 text-purple-300 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-purple-900/60 transition border border-purple-700/30">
                    View
                  </Link>
                  <button onClick={() => handleDelete(resume._id)} className="flex-1 bg-red-900/20 text-red-400 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-900/40 transition border border-red-700/20">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}