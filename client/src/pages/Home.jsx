import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f13]">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-4 bg-[#1a1a24] border-b border-purple-900/30">
        <h1 className="text-xl sm:text-2xl font-bold text-purple-400">Rezumi</h1>
        <div className="flex gap-2 sm:gap-4">
          <Link to="/login" className="text-gray-400 hover:text-purple-400 font-medium text-sm sm:text-base transition">Login</Link>
          <Link to="/register" className="bg-purple-600 text-white px-3 sm:px-5 py-2 rounded-lg hover:bg-purple-700 transition font-medium text-sm sm:text-base">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-16 sm:py-28">

        {/* Badge */}
        <span className="bg-purple-900/40 text-purple-300 text-xs sm:text-sm px-4 py-1.5 rounded-full font-medium mb-6 border border-purple-700/40">
          ✨ Powered by Groq AI + LLaMA 3.1
        </span>

        <h2 className="text-4xl sm:text-6xl font-bold text-white mb-4 leading-tight">
          Build your resume.<br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Land the job.
          </span>
        </h2>

        <p className="text-base sm:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
          AI-powered resume builder and analyzer. Generate ATS-friendly resumes and match them against any job description — for free.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link to="/register" className="bg-purple-600 text-white px-8 py-3.5 rounded-xl text-base sm:text-lg font-semibold hover:bg-purple-700 transition text-center shadow-lg shadow-purple-900/30">
            🚀 Build My Resume
          </Link>
          <Link to="/login" className="border border-purple-700 text-purple-300 px-8 py-3.5 rounded-xl text-base sm:text-lg font-semibold hover:bg-purple-900/30 transition text-center">
            Login
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-8 sm:gap-16 mt-12 sm:mt-16">
          {[['3', 'Build Modes'], ['AI', 'Enhanced'], ['Free', 'Forever']].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-purple-400">{val}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-16 sm:mt-24 max-w-4xl w-full">
          {[
            { icon: '🔨', title: 'Resume Builder', desc: 'Build from a form, plain text, or upload PDF — AI enhances everything automatically.' },
            { icon: '🔍', title: 'Resume Analyzer', desc: 'Paste resume + job description — get AI match score, missing keywords and suggestions.' },
            { icon: '📄', title: 'Export PDF & DOCX', desc: 'Download your polished resume in PDF or DOCX format, ready to send to recruiters.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-[#1a1a24] border border-purple-900/30 rounded-2xl p-5 sm:p-6 text-left hover:border-purple-600/50 transition">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-600 text-sm border-t border-purple-900/20">
        Built with ❤️ by Shivam Jaiswal · <a href="https://github.com/shivamjai2004/rezumi" className="text-purple-500 hover:underline">GitHub</a>
      </div>
    </div>
  )
}