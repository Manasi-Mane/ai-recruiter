import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const RecruiterDashboard = () => {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | shortlisted
  const [shortlistingId, setShortlistingId] = useState(null)

  useEffect(() => {
    // Redirect if not recruiter
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.role !== 'recruiter') navigate('/profile-builder')
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5000/api/recruiter/candidates', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCandidates(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleShortlist = async (id, e) => {
    e.stopPropagation()
    setShortlistingId(id)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.patch(
        `http://localhost:5000/api/recruiter/candidates/${id}/shortlist`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCandidates(prev =>
        prev.map(c => c._id === id ? { ...c, isShortlisted: res.data.profile.isShortlisted } : c)
      )
    } catch (err) {
      console.error(err)
    }
    setShortlistingId(null)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const filtered = candidates.filter(c => {
    const name = c.user?.name?.toLowerCase() || ''
    const email = c.user?.email?.toLowerCase() || ''
    const skills = (c.skills || []).join(' ').toLowerCase()
    const matchesSearch = name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      skills.includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || (filter === 'shortlisted' && c.isShortlisted)
    return matchesSearch && matchesFilter
  })

  const shortlistedCount = candidates.filter(c => c.isShortlisted).length

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-indigo-400">HireAI 🤖</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400 text-sm">Recruiter Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            🏢 {JSON.parse(localStorage.getItem('user') || '{}').name}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-400 transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Candidates', value: candidates.length, icon: '👥', color: 'indigo' },
            { label: 'Shortlisted', value: shortlistedCount, icon: '⭐', color: 'yellow' },
            { label: 'Avg. Completion', value: candidates.length ? Math.round(candidates.reduce((a, c) => a + (c.completionPercent || 0), 0) / candidates.length) + '%' : '0%', icon: '📊', color: 'green' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="flex-1 min-w-64">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Search by name, email, or skill..."
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'shortlisted'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition capitalize ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-900 border border-gray-700 text-gray-400 hover:border-indigo-500'
                }`}>
                {f === 'all' ? `All (${candidates.length})` : `⭐ Shortlisted (${shortlistedCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Candidate Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading candidates...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No candidates found</h3>
            <p className="text-gray-500">
              {search ? 'Try a different search term' : 'No candidates have built profiles yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(candidate => (
              <div
                key={candidate._id}
                onClick={() => navigate(`/recruiter/candidate/${candidate._id}`)}
                className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-indigo-500 cursor-pointer transition group">

                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-700 flex items-center justify-center font-bold text-lg">
                      {candidate.user?.name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-indigo-300 transition">
                        {candidate.user?.name || 'Candidate'}
                      </h3>
                      <p className="text-gray-500 text-xs">{candidate.user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleShortlist(candidate._id, e)}
                    disabled={shortlistingId === candidate._id}
                    className={`text-xl transition hover:scale-110 ${
                      candidate.isShortlisted ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'
                    }`}
                    title={candidate.isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}>
                    {shortlistingId === candidate._id ? '⏳' : candidate.isShortlisted ? '⭐' : '☆'}
                  </button>
                </div>

                {/* Summary */}
                {candidate.summary && (
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
                    {candidate.summary}
                  </p>
                )}

                {/* Skills preview */}
                {candidate.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {candidate.skills.slice(0, 4).map((skill, i) => (
                      <span key={i} className="text-xs bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-800">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 4 && (
                      <span className="text-xs text-gray-500 px-2 py-0.5">
                        +{candidate.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Bottom stats */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>💼 {candidate.experience?.length || 0} exp</span>
                    <span>🚀 {candidate.projects?.length || 0} projects</span>
                  </div>
                  {/* Completion bar */}
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-800 rounded-full h-1.5">
                      <div
                        className="bg-indigo-500 h-1.5 rounded-full"
                        style={{ width: `${candidate.completionPercent || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{candidate.completionPercent || 0}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecruiterDashboard