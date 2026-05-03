import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../services/auth.js'
import logo from '../../assets/codehub-logo.png'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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

    if (formData.password !== formData.confirmPassword) {
      setError('Lozinke se ne poklapaju')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera')
      setLoading(false)
      return
    }

    try {
      await register(formData.username, formData.email, formData.password)
      navigate('/login')
    } catch (error) {
      setError(error.message || 'Neuspešna registracija')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img className="brand-logo brand-logo--xlarge" src={logo} alt="CodeHub logo" />
          <h1 className="auth-title">Napravi CodeHub nalog</h1>
          <p className="auth-subtitle">Organizuj zadatke, snippete i fokus sesije na jednom mestu.</p>
        </div>

        <form onSubmit={handleSubmit} className="panel-grid">
          <div className="form-group">
            <label htmlFor="username">Korisničko ime</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="input"
              placeholder="dimitrije"
              autoComplete="username"
            />
          </div>

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
              placeholder="ime@firma.com"
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
              placeholder="Minimum 6 karaktera"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Potvrda lozinke</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="input"
              placeholder="Ponovi lozinku"
              autoComplete="new-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Kreiranje...' : 'Kreiraj nalog'}
          </button>
        </form>

        <p className="auth-link">
          Već imaš nalog? <Link to="/login">Prijavi se</Link>
        </p>
      </div>
    </div>
  )
}
