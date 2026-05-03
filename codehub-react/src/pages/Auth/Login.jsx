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
      setError(error.message || 'Neispravan email ili lozinka')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img className="brand-logo brand-logo--xlarge" src={logo} alt="CodeHub logo" />
          <h1 className="auth-title">Dobrodošao nazad</h1>
          <p className="auth-subtitle">Prijavi se i nastavi gde si stao.</p>
        </div>

        <div className="auth-brand-highlight">
          <div className="auth-brand-item">Jasan pregled rada i fokusa na jednom mestu</div>
          <div className="auth-brand-item">Brže izvršavanje taskova bez prebacivanja alata</div>
          <div className="auth-brand-item">Pouzdan ritam rada kroz pomodoro i metrike</div>
        </div>

        <form onSubmit={handleSubmit} className="panel-grid">
          <div className="form-group">
            <label htmlFor="email">Email adresa</label>
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
            <label htmlFor="password">Lozinka</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input"
              placeholder="Unesi lozinku"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Prijavljivanje...' : 'Prijavi se'}
          </button>
        </form>

        <p className="auth-link">
          Nemaš nalog? <Link to="/register">Napravi nalog</Link>
        </p>

        <div className="auth-demo">
          <strong>Demo nalog</strong>
          <br />
          Email: demo@example.com
          <br />
          Password: demo123
        </div>
      </div>
    </div>
  )
}
