import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { api } from '../services/api.js'
import { usePageTitle } from '../hooks/usePageTitle.js'

function parseTokenProfile() {
  const token = localStorage.getItem('codehub_token')
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(normalized)
    const data = JSON.parse(json)

    return {
      name: data.name || data.username || 'CodeHub User',
      email: data.email || 'Not set',
      bio: 'Focused on clean code, consistent execution, and clear delivery.',
    }
  } catch {
    return null
  }
}

export default function Profile() {
  usePageTitle('Profile')

  const { logout } = useAuth()
  const [user, setUser] = useState({
    name: 'CodeHub User',
    email: 'Not set',
    bio: 'Focused on clean code, consistent execution, and clear delivery.',
  })
  const [stats, setStats] = useState({ snippets: 0, tasks: 0, completed: 0 })
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({ name: '', email: '', bio: '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        const [snippets, tasks] = await Promise.all([api.get('/api/snippets'), api.get('/api/tasks')])

        if (!mounted) return

        const parsedProfile = parseTokenProfile()
        if (parsedProfile) {
          setUser(parsedProfile)
          setForm(parsedProfile)
        }

        setStats({
          snippets: snippets.length,
          tasks: tasks.length,
          completed: tasks.filter((task) => task.status === 'done').length,
        })
      } catch (fetchError) {
        if (mounted) setError(fetchError.message || 'Failed to load profile.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      mounted = false
    }
  }, [])

  const completionRate = useMemo(() => {
    if (!stats.tasks) return 0
    return Math.round((stats.completed / stats.tasks) * 100)
  }, [stats])

  function startEdit() {
    setNotice('')
    setError('')
    setEditMode(true)
  }

  function cancelEdit() {
    setForm(user)
    setEditMode(false)
    setNotice('')
    setError('')
  }

  async function handleUpdateProfile(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!form.name.trim()) {
      setError('Name is required.')
      return
    }

    setUser({ ...user, ...form })
    setEditMode(false)
    setNotice('Profile saved locally. Backend profile update endpoint can be connected next.')
  }

  async function handleChangePassword(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setError('Please fill in all password fields.')
      return
    }

    if (passwordForm.next.length < 6) {
      setError('New password must have at least 6 characters.')
      return
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setError('Password confirmation does not match.')
      return
    }

    setPasswordForm({ current: '', next: '', confirm: '' })
    setNotice('Password form is valid. Backend password-change endpoint still needs to be connected.')
  }

  if (loading) {
    return <div className="card">Loading profile...</div>
  }

  return (
    <div className="panel-grid">
      <section className="card hero-card panel-grid">
        <div className="profile-header">
          <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="stat-grid profile-stat-grid">
          <div className="stat-tile">
            <div className="stat-label">Tasks</div>
            <div className="stat-value metric-blue">{stats.tasks}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Completed</div>
            <div className="stat-value metric-green">{stats.completed}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Snippets</div>
            <div className="stat-value metric-orange">{stats.snippets}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Completion</div>
            <div className="stat-value">{completionRate}%</div>
          </div>
        </div>
      </section>

      <section className="profile-layout">
        <article className="card panel-grid">
          <div className="page-header">
            <div>
              <h2>Basic information</h2>
              <p className="page-subtitle">Update your display name, email, and short bio.</p>
            </div>
            {!editMode ? (
              <button type="button" className="btn btn-outline" onClick={startEdit}>
                Edit
              </button>
            ) : (
              <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>

          <form className="panel-grid" onSubmit={handleUpdateProfile}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="profile-name">Name</label>
                <input
                  id="profile-name"
                  className="input"
                  value={form.name}
                  onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
                  disabled={!editMode}
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-email">Email</label>
                <input
                  id="profile-email"
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
                  disabled={!editMode}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="profile-bio">Bio</label>
              <textarea
                id="profile-bio"
                className="textarea"
                value={form.bio}
                onChange={(event) => setForm((previous) => ({ ...previous, bio: event.target.value }))}
                disabled={!editMode}
                placeholder="Add a short description of your work"
              />
            </div>

            {editMode && (
              <div className="inline-actions">
                <button type="submit" className="btn btn-primary">Save profile</button>
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Revert</button>
              </div>
            )}
          </form>
        </article>

        <article className="card panel-grid">
          <div>
            <h2>Account security</h2>
            <p className="page-subtitle">Prepared form for password updates.</p>
          </div>

          <form className="panel-grid" onSubmit={handleChangePassword}>
            <div className="form-group">
              <label htmlFor="password-current">Current password</label>
              <input
                id="password-current"
                type="password"
                className="input"
                value={passwordForm.current}
                onChange={(event) => setPasswordForm((previous) => ({ ...previous, current: event.target.value }))}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password-next">New password</label>
                <input
                  id="password-next"
                  type="password"
                  className="input"
                  value={passwordForm.next}
                  onChange={(event) => setPasswordForm((previous) => ({ ...previous, next: event.target.value }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password-confirm">Confirm new password</label>
                <input
                  id="password-confirm"
                  type="password"
                  className="input"
                  value={passwordForm.confirm}
                  onChange={(event) => setPasswordForm((previous) => ({ ...previous, confirm: event.target.value }))}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">Validate form</button>
          </form>
        </article>
      </section>

      {error && <div className="error-message">{error}</div>}
      {notice && <div className="status-message">{notice}</div>}

      <section className="card danger-zone panel-grid">
        <div>
          <h3>Sign out</h3>
          <p className="page-subtitle">Securely close your session and return to login.</p>
        </div>
        <div className="inline-actions">
          <button type="button" className="btn btn-outline danger-button" onClick={logout}>
            Sign out
          </button>
        </div>
      </section>
    </div>
  )
}
