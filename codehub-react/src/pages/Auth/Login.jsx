import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../services/auth.js'
import { useAuth } from '../../hooks/useAuth.js'
import logo from '../../assets/codehub-logo.png'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login: setAuth } = useAuth()

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))

    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await login(formData.email, formData.password)
      setAuth(response.token)
      navigate('/dashboard')
    } catch (error) {
      setError(error.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img className="brand-logo brand-logo--xlarge" src={logo} alt="CodeHub logo" />
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in and continue where you left off.</p>
        </div>

        <div className="auth-brand-highlight">
          <div className="auth-brand-item">Clear visibility over execution and focus in one place</div>
          <div className="auth-brand-item">Faster task delivery with less context switching</div>
          <div className="auth-brand-item">Reliable work rhythm powered by pomodoro and metrics</div>
        </div>

        <form onSubmit={handleSubmit} className="panel-grid">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input"
              placeholder="demo@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="auth-link">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>

        <div className="auth-demo">
          <strong>Demo account</strong>
          <br />
          Email: demo@example.com
          <br />
          Password: demo123
        </div>
      </div>
    </div>
  )
}
