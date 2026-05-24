import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export default function Dashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [resumes, setResumes] = useState([])
    const [loading, setLoading] = useState(true)

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

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resume?')) return
        try {
            await api.delete(`/resume/${id}`)
            setResumes(resumes.filter(r => r._id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-indigo-600">Rezumi</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Hi, {user?.name} 👋</span>
                    <Link to="/analyzer" className="text-indigo-600 font-medium hover:underline">Analyzer</Link>
                    <button onClick={handleLogout} className="text-red-500 font-medium hover:underline">Logout</button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">My Resumes</h2>
                        <p className="text-gray-500">Manage and export your resumes</p>
                    </div>
                    <Link to="/builder" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition">
                        + New Resume
                    </Link>
                </div>

                {/* Resumes Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading...</div>
                ) : resumes.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📄</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No resumes yet</h3>
                        <p className="text-gray-500 mb-6">Create your first AI-powered resume</p>
                        <Link to="/builder" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition">
                            Build My Resume
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume) => (
                            <div key={resume._id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{resume.title}</h3>
                                        <p className="text-sm text-gray-500">{resume.personalInfo?.name}</p>
                                    </div>
                                    <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full font-medium">
                                        {resume.template}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 mb-4">
                                    <p>📚 {resume.education?.length || 0} education</p>
                                    <p>💼 {resume.experience?.length || 0} experience</p>
                                    <p>🛠️ {resume.skills?.length || 0} skills</p>
                                </div>
                                <p className="text-xs text-gray-400 mb-4">
                                    Created {new Date(resume.createdAt).toLocaleDateString()}
                                </p>
                                <div className="flex gap-2">
                                    <Link
                                        to={`/resume/${resume._id}`}
                                        className="flex-1 text-center bg-indigo-50 text-indigo-600 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
                                    >
                                        View
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(resume._id)}
                                        className="flex-1 bg-red-50 text-red-500 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                                    >
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