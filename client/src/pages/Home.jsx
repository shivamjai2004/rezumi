import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-4 bg-white shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">Rezumi</h1>
        <div className="flex gap-2 sm:gap-4">
          <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium text-sm sm:text-base">Login</Link>
          <Link to="/register" className="bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium text-sm sm:text-base">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-12 sm:py-24">
        <h2 className="text-3xl sm:text-5xl font-bold text-gray-800 mb-4">
          Build your resume.<br />
          <span className="text-indigo-600">Land the job.</span>
        </h2>
        <p className="text-base sm:text-xl text-gray-500 mb-8 max-w-xl">
          AI-powered resume builder and analyzer. Generate ATS-friendly resumes and match them against any job description.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link to="/register" className="bg-indigo-600 text-white px-6 sm:px-8 py-3 rounded-xl text-base sm:text-lg font-semibold hover:bg-indigo-700 transition text-center">
            Build My Resume
          </Link>
          <Link to="/login" className="border border-indigo-600 text-indigo-600 px-6 sm:px-8 py-3 rounded-xl text-base sm:text-lg font-semibold hover:bg-indigo-50 transition text-center">
            Login
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-20 max-w-4xl w-full">
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="text-3xl mb-3">🔨</div>
            <h3 className="font-bold text-gray-800 mb-2">Resume Builder</h3>
            <p className="text-gray-500 text-sm">Build from a form or plain text — AI enhances your content automatically.</p>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-gray-800 mb-2">Resume Analyzer</h3>
            <p className="text-gray-500 text-sm">Upload your resume and a job description — get an instant match score.</p>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="font-bold text-gray-800 mb-2">Export PDF & DOCX</h3>
            <p className="text-gray-500 text-sm">Download your resume in PDF or DOCX format, ready to send.</p>
          </div>
        </div>
      </div>
    </div>
  )
}