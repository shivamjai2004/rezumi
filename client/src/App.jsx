import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ResumeView from './pages/ResumeView'
import PublicResume from './pages/PublicResume'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Builder from './pages/Builder'
import Analyzer from './pages/Analyzer'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/r/:shareId" element={<PublicResume />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/builder" element={<PrivateRoute><Builder /></PrivateRoute>} />
        <Route path="/analyzer" element={<PrivateRoute><Analyzer /></PrivateRoute>} />
        <Route path="/resume/:id" element={<PrivateRoute><ResumeView /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App