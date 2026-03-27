import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ProfilePreview = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const printRef = useRef()

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
    setUser(storedUser)
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:5000/api/candidate/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProfile(res.data)
    } catch (err) {
      setProfile(null)
    }
    setLoading(false)
  }

  const handleCopyLink = () => {
    const profileLink = `${window.location.origin}/profile/${user?.id}`
    navigator.clipboard.writeText(profileLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = () => {
    setDownloading(true)
    setTimeout(() => {
      window.print()
      setDownloading(false)
    }, 300)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold mb-2">No Profile Yet</h2>
          <p className="text-gray-400 mb-6">Build your profile first using the AI assistant</p>
          <button
            onClick={() => navigate('/profile-builder')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full font-semibold transition">
            Build My Profile →
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-section { background: white !important; color: black !important; border: 1px solid #e5e7eb !important; }
          .print-tag { background: #e0e7ff !important; color: #3730a3 !important; border: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-gray-950 text-white">

        {/* Top Bar */}
        <div className="no-print border-b border-gray-800 px-6 py-4 flex justify-between items-center bg-gray-900">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile-builder')}
              className="text-gray-400 hover:text-white transition text-sm">
              ← Back to Builder
            </button>
            <span className="text-gray-700">|</span>
            <span className="text-indigo-400 font-bold">HireAI 🤖</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                copied ? 'border-green-500 text-green-400' : 'border-gray-600 text-gray-300 hover:border-indigo-400'
              }`}>
              {copied ? '✅ Link Copied!' : '🔗 Share Profile'}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition disabled:opacity-60">
              {downloading ? '⏳ Preparing...' : '📄 Download PDF'}
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="max-w-4xl mx-auto px-6 py-10" ref={printRef}>

          {/* Header Card */}
          <div className="print-section bg-gray-900 rounded-2xl p-8 mb-6 border border-gray-800">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">{user?.name || 'Candidate'}</h1>
                <p className="text-indigo-400 text-sm mb-3">{user?.email}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="bg-green-900 text-green-300 text-xs px-3 py-1 rounded-full font-semibold">
                    ✅ Profile {profile.completionPercent || 100}% Complete
                  </span>
                  <span className="text-gray-500 text-xs">
                    Last updated: {new Date(profile.lastSaved).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            {profile.summary && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-2">Professional Summary</h3>
                <p className="text-gray-300 leading-relaxed">{profile.summary}</p>
              </div>
            )}
          </div>

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div className="print-section bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">⚡ Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={i} className="print-tag bg-indigo-900 text-indigo-300 text-sm px-3 py-1 rounded-full border border-indigo-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {profile.experience?.length > 0 && (
            <div className="print-section bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
              <h2 className="text-lg font-bold mb-4">💼 Experience</h2>
              <div className="space-y-5">
                {profile.experience.map((exp, i) => (
                  <div key={i} className={i > 0 ? 'pt-5 border-t border-gray-800' : ''}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-white">{exp.title}</h3>
                        <p className="text-indigo-400 text-sm">{exp.company}</p>
                      </div>
                      <span className="text-gray-500 text-sm bg-gray-800 px-3 py-1 rounded-full">{exp.duration}</span>
                    </div>
                    {exp.description && (
                      <p className="text-gray-400 text-sm mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {profile.projects?.length > 0 && (
            <div className="print-section bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
              <h2 className="text-lg font-bold mb-4">🚀 Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.projects.map((proj, i) => (
                  <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white">{proj.name}</h3>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer"
                          className="text-indigo-400 text-xs hover:underline">🔗 View</a>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3 leading-relaxed">{proj.description}</p>
                    {proj.techStack && (
                      <div className="flex flex-wrap gap-1">
                        {proj.techStack.split(',').map((t, j) => (
                          <span key={j} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profile.education?.length > 0 && (
            <div className="print-section bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
              <h2 className="text-lg font-bold mb-4">🎓 Education</h2>
              <div className="space-y-4">
                {profile.education.map((edu, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white">{edu.degree}</h3>
                      <p className="text-indigo-400 text-sm">{edu.institution}</p>
                    </div>
                    <span className="text-gray-500 text-sm bg-gray-800 px-3 py-1 rounded-full">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="no-print text-center py-4">
            <p className="text-gray-500 text-sm mb-4">Your profile is ready for recruiters to discover 🎉</p>
            <button
              onClick={handleCopyLink}
              className="px-6 py-2 border border-indigo-500 text-indigo-400 rounded-full text-sm hover:bg-indigo-900 transition">
              {copied ? '✅ Copied!' : '🔗 Copy & Share Profile Link'}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default ProfilePreview