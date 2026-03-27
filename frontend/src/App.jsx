import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProfileBuilder from './pages/ProfileBuilder'
import ProfilePreview from './pages/ProfilePreview'
import RecruiterDashboard from './pages/RecruiterDashboard'
import CandidateDetail from './pages/CandidateDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile-builder" element={<ProfileBuilder />} />
        <Route path="/profile-preview" element={<ProfilePreview />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruiter/candidate/:id" element={<CandidateDetail />} />
      </Routes>
    </Router>
  )
}

export default App