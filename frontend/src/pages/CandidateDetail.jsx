import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const CandidateDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCandidate()
  }, [])

  const fetchCandidate = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`http://localhost:5000/api/recruiter/candidates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCandidate(res.data)
    } catch (err) {
      console.log('Error fetching candidate')
    }
    setLoading(false)
  }

  const toggleShortlist = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.patch(`http://localhost:5000/api/recruiter/candidates/${id}/shortlist`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCandidate()
    } catch (err) {
      console.log('Error shortlisting')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-indigo-400 text-xl animate-pulse">Loading candidate...</div>
    </div>
  )

  if (!candidate) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-2">Candidate not found</h2>
        <button onClick={() => navigate('/recruiter')}
          className="mt-4 px-6 py-2 bg-indigo-600 rounded-full hover:bg-indigo-500 transition">
          ← Back to Dashboard
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <div className="text-2xl font-bold text-indigo-400">HireAI 🤖</div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/recruiter')}
            className="px-4 py-2 text-sm border border-gray-600 rounded-full hover:border-indigo-400 transition">
            ← Back to Dashboard
          </button>
          <button onClick={toggleShortlist}
            className={`px-4 py-2 text-sm rounded-full transition font-semibold ${
              candidate.isShortlisted
                ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                : 'bg-gray-800 border border-gray-600 hover:border-yellow-400 hover:text-yellow-400'
            }`}>
            {candidate.isShortlisted ? '⭐ Shortlisted' : '☆ Shortlist'}
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Profile Header */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold">
              {candidate.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{candidate.user?.name}</h1>
                  <p className="text-gray-400">{candidate.user?.email}</p>
                </div>
                {candidate.isShortlisted && (
                  <div className="bg-yellow-500 text-black text-sm font-bold px-4 py-2 rounded-full">
                    ⭐ Shortlisted
                  </div>
                )}
              </div>

              {/* Completion */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Profile Completion</span>
                  <span className="text-indigo-400 font-bold">{candidate.completionPercent || 0}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${candidate.completionPercent || 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {candidate.summary && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
            <h2 className="text-lg font-bold mb-3 text-indigo-400">📝 Summary</h2>
            <p className="text-gray-300 leading-relaxed">{candidate.summary}</p>
          </div>
        )}

        {/* Skills */}
        {candidate.skills?.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
            <h2 className="text-lg font-bold mb-4 text-indigo-400">⚡ Skills</h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, i) => (
                <span key={i} className="bg-indigo-900 border border-indigo-700 text-indigo-300 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {candidate.experience?.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
            <h2 className="text-lg font-bold mb-4 text-indigo-400">💼 Experience</h2>
            <div className="space-y-4">
              {candidate.experience.map((exp, i) => (
                <div key={i} className="border-l-2 border-indigo-600 pl-4">
                  <h3 className="font-bold">{exp.title}</h3>
                  <p className="text-indigo-400 text-sm">{exp.company} · {exp.duration}</p>
                  <p className="text-gray-400 text-sm mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {candidate.projects?.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
            <h2 className="text-lg font-bold mb-4 text-indigo-400">🚀 Projects</h2>
            <div className="space-y-4">
              {candidate.projects.map((proj, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-4">
                  <h3 className="font-bold">{proj.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">{proj.description}</p>
                  {proj.techStack && (
                    <p className="text-indigo-400 text-xs mt-2">🛠 {proj.techStack}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {candidate.education?.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
            <h2 className="text-lg font-bold mb-4 text-indigo-400">🎓 Education</h2>
            <div className="space-y-3">
              {candidate.education.map((edu, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-900 rounded-full flex items-center justify-center">🎓</div>
                  <div>
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-gray-400 text-sm">{edu.institution} · {edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button onClick={toggleShortlist}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              candidate.isShortlisted
                ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                : 'bg-gray-800 border border-gray-700 hover:border-yellow-400 hover:text-yellow-400'
            }`}>
            {candidate.isShortlisted ? '⭐ Remove from Shortlist' : '☆ Add to Shortlist'}
          </button>
          <button onClick={() => navigate('/recruiter')}
            className="flex-1 py-3 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 transition">
            ← Back to All Candidates
          </button>
        </div>

      </div>
    </div>
  )
}

export default CandidateDetail