import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Signup = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      if (res.data.user.role === 'recruiter') navigate('/recruiter')
      else navigate('/profile-builder')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-indigo-400 mb-2">HireAI 🤖</div>
          <h2 className="text-2xl font-bold">Create your account</h2>
          <p className="text-gray-400 mt-1">Start building your AI-powered profile</p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setForm({ ...form, role: 'candidate' })}
                className={`py-3 rounded-lg border text-sm font-semibold transition ${
                  form.role === 'candidate'
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-indigo-500'
                }`}>
                👨‍💼 Candidate
              </button>
              <button
                onClick={() => setForm({ ...form, role: 'recruiter' })}
                className={`py-3 rounded-lg border text-sm font-semibold transition ${
                  form.role === 'recruiter'
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-indigo-500'
                }`}>
                🏢 Recruiter
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition">
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>

        </div>

        <p className="text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className="text-indigo-400 cursor-pointer hover:underline">
            Login
          </span>
        </p>

      </div>
    </div>
  )
}

export default Signup