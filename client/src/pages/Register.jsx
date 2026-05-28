import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/register', form)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center px-4 py-8">
      <div className="bg-[#1a1a24] border border-purple-900/30 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-400">Rezumi</h1>
          <p className="text-gray-400 mt-1 text-sm">Create your account — it's free!</p>
        </div>

        {error && <div className="bg-red-900/30 border border-red-700/40 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[{ label: 'Full Name', field: 'name', type: 'text', placeholder: 'Shivam Jaiswal' },
            { label: 'Email', field: 'email', type: 'email', placeholder: 'shivam@example.com' },
            { label: 'Password', field: 'password', type: 'password', placeholder: '••••••••' }].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
              <input
                type={type}
                required
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                className="w-full bg-[#22223a] border border-purple-900/40 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm placeholder-gray-600"
                placeholder={placeholder}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 text-sm sm:text-base mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}