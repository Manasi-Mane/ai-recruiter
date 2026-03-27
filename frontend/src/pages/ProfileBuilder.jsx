import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ProfileBuilder = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm your AI profile assistant. I'll help you build a professional profile without uploading a resume!\n\nLet's start simple — **What's your name and what kind of work are you looking for?**"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    summary: '', skills: [], experience: [], projects: [], education: []
  })
  const [step, setStep] = useState(1)
  const [saved, setSaved] = useState(false)
  const [completionPercent, setCompletionPercent] = useState(10)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const steps = [
    { id: 1, label: 'Introduction', icon: '👋' },
    { id: 2, label: 'Experience', icon: '💼' },
    { id: 3, label: 'Skills', icon: '⚡' },
    { id: 4, label: 'Projects', icon: '🚀' },
    { id: 5, label: 'Education', icon: '🎓' },
  ]

  const stepPrompts = {
    1: "Great! Now tell me about your **work experience**. Describe any jobs, internships, or freelance work you've done. Don't worry about formatting — just talk naturally!",
    2: "Excellent! Now let's talk about your **skills**. What technologies, tools, or soft skills do you have? Just list them or describe them naturally.",
    3: "Amazing! Tell me about any **projects** you've built or worked on. Include personal projects, college projects, or open source contributions.",
    4: "Almost done! Tell me about your **education** — your degree, college name, and year of graduation.",
    5: "🎉 Your profile is complete! Let me generate a professional summary for you."
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        'http://localhost:5000/api/candidate/ai-process',
        { message: input, step, profile },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const aiReply = res.data.reply
      const updatedProfile = res.data.profile

      setProfile(updatedProfile)
      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }])

      // Move to next step
      if (step < 5) {
        const nextStep = step + 1
        setStep(nextStep)
        setCompletionPercent(nextStep * 20)
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: stepPrompts[step]
          }])
        }, 1000)
      }

      // Auto save
      await axios.post(
        'http://localhost:5000/api/candidate/profile',
        { ...updatedProfile, completionPercent },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Something went wrong. Please try again.'
      }])
    }
    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Left Sidebar */}
      <div className="w-72 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
        <div className="text-xl font-bold text-indigo-400 mb-2">HireAI 🤖</div>
        <p className="text-gray-400 text-sm mb-8">AI Profile Builder</p>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {steps.map(s => (
            <div key={s.id} className={`flex items-center gap-3 p-3 rounded-lg transition ${
              step === s.id ? 'bg-indigo-600' :
              step > s.id ? 'bg-gray-800 text-green-400' : 'text-gray-500'
            }`}>
              <span>{step > s.id ? '✅' : s.icon}</span>
              <span className="text-sm font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Profile Completion</span>
            <span className="text-indigo-400 font-bold">{completionPercent}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>

          {/* Auto save indicator */}
          <div className={`mt-4 text-xs text-center transition ${saved ? 'text-green-400' : 'text-gray-600'}`}>
            {saved ? '✅ Profile saved!' : '🔄 Auto-saving...'}
          </div>

          <button
            onClick={() => navigate('/profile-preview')}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2 rounded-lg transition">
            Preview Profile →
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">AI Profile Builder</h1>
            <p className="text-gray-400 text-sm">Step {step} of 5 — {steps[step-1]?.label}</p>
          </div>
          <div className="text-sm text-gray-500">
            Press <kbd className="bg-gray-800 px-2 py-1 rounded text-xs">Enter</kbd> to send
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-gray-800 text-gray-100 rounded-bl-none'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🤖</span>
                    <span className="text-xs text-indigo-400 font-semibold">HireAI Assistant</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex items-center gap-2">
                  <span>🤖</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Tell me about yourself... (Press Enter to send)"
              rows={3}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition">
              Send →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProfileBuilder