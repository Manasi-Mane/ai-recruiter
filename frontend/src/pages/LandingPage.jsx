import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <div className="text-2xl font-bold text-indigo-400">HireAI 🤖</div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm border border-gray-600 rounded-full hover:border-indigo-400 transition">
            Login
          </button>
          <button onClick={() => navigate('/signup')}
            className="px-5 py-2 text-sm bg-indigo-600 rounded-full hover:bg-indigo-500 transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-28">
        <div className="bg-indigo-600 text-xs font-semibold px-4 py-1 rounded-full mb-6 uppercase tracking-widest">
          AI Powered Recruitment
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          Get Hired Without <br />
          <span className="text-indigo-400">Uploading a Resume</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          Build your professional profile using AI. Just talk about yourself —
          our AI structures your experience, skills, and projects automatically.
        </p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-indigo-600 rounded-full text-lg font-semibold hover:bg-indigo-500 transition">
            Build My Profile →
          </button>
          <button onClick={() => navigate('/login')}
            className="px-8 py-3 border border-gray-600 rounded-full text-lg hover:border-indigo-400 transition">
            I'm a Recruiter
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="px-10 py-16 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12">Why HireAI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: '🤖', title: 'AI Profile Builder', desc: 'Just describe your experience in plain English. AI structures it for you automatically.' },
            { icon: '⚡', title: 'No Resume Needed', desc: 'Skip the PDF uploads. Create a rich, structured profile in minutes.' },
            { icon: '🎯', title: 'Smart Matching', desc: 'Recruiters find the right candidates faster with AI-powered profiles.' },
          ].map((f, i) => (
            <div key={i} className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="px-10 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { step: '01', title: 'Sign Up', desc: 'Create your account in seconds' },
            { step: '02', title: 'Talk to AI', desc: 'Describe your experience naturally' },
            { step: '03', title: 'AI Structures It', desc: 'AI builds your profile automatically' },
            { step: '04', title: 'Get Hired', desc: 'Recruiters discover your profile' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl font-extrabold text-indigo-800 mb-3">{s.step}</div>
              <h3 className="text-lg font-bold mb-1">{s.title}</h3>
              <p className="text-gray-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-20 bg-gray-900">
        <h2 className="text-4xl font-bold mb-4">Ready to get hired?</h2>
        <p className="text-gray-400 mb-8">Join thousands of candidates building smarter profiles</p>
        <button onClick={() => navigate('/signup')}
          className="px-10 py-4 bg-indigo-600 rounded-full text-lg font-semibold hover:bg-indigo-500 transition">
          Start Building Free →
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600 border-t border-gray-800">
        © 2025 HireAI — Built for Anshumat Foundation Internship
      </footer>

    </div>
  )
}

export default LandingPage