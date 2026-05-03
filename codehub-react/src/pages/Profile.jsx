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
      name: data.name || data.username || 'CodeHub korisnik',
      email: data.email || 'Nije definisano',
      bio: 'Fokus na čist kod, dobar ritam rada i jasne isporuke.',
    }
  } catch {
    return null
  }
}

export default function Profile() {
  usePageTitle('Profil')

  const { logout } = useAuth()
  const [user, setUser] = useState({
    name: 'CodeHub korisnik',
    email: 'Nije definisano',
    bio: 'Fokus na čist kod, dobar ritam rada i jasne isporuke.',
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
        if (mounted) setError(fetchError.message || 'Neuspešno učitavanje profila.')
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
      setError('Ime je obavezno.')
      return
    }

    setUser({ ...user, ...form })
    setEditMode(false)
    setNotice('Profil je sačuvan lokalno. Backend endpoint za profil može biti sledeći korak.')
  }

  async function handleChangePassword(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setError('Popuni sva polja za lozinku.')
      return
    }

    if (passwordForm.next.length < 6) {
      setError('Nova lozinka mora imati bar 6 karaktera.')
      return
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setError('Potvrda lozinke se ne poklapa.')
      return
    }

    setPasswordForm({ current: '', next: '', confirm: '' })
    setNotice('Forma za lozinku je validna. Backend endpoint za promenu lozinke još treba povezati.')
  }

  if (loading) {
    return <div className="card">Učitavanje profila...</div>
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
            <div className="stat-label">Taskovi</div>
            <div className="stat-value metric-blue">{stats.tasks}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Završeni</div>
            <div className="stat-value metric-green">{stats.completed}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Snippeti</div>
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
              <h2>Osnovne informacije</h2>
              <p className="page-subtitle">Ažuriraj prikaz imena, email i kratku bio sekciju.</p>
            </div>
            {!editMode ? (
              <button type="button" className="btn btn-outline" onClick={startEdit}>
                Izmeni
              </button>
            ) : (
              <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                Otkaži
              </button>
            )}
          </div>

          <form className="panel-grid" onSubmit={handleUpdateProfile}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="profile-name">Ime</label>
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
                placeholder="Dodaj kratki opis svog rada"
              />
            </div>

            {editMode && (
              <div className="inline-actions">
                <button type="submit" className="btn btn-primary">Sačuvaj profil</button>
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Vrati</button>
              </div>
            )}
          </form>
        </article>

        <article className="card panel-grid">
          <div>
            <h2>Bezbednost naloga</h2>
            <p className="page-subtitle">Pripremljena forma za promenu lozinke.</p>
          </div>

          <form className="panel-grid" onSubmit={handleChangePassword}>
            <div className="form-group">
              <label htmlFor="password-current">Trenutna lozinka</label>
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
                <label htmlFor="password-next">Nova lozinka</label>
                <input
                  id="password-next"
                  type="password"
                  className="input"
                  value={passwordForm.next}
                  onChange={(event) => setPasswordForm((previous) => ({ ...previous, next: event.target.value }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password-confirm">Potvrda nove lozinke</label>
                <input
                  id="password-confirm"
                  type="password"
                  className="input"
                  value={passwordForm.confirm}
                  onChange={(event) => setPasswordForm((previous) => ({ ...previous, confirm: event.target.value }))}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">Proveri podatke</button>
          </form>
        </article>
      </section>

      {error && <div className="error-message">{error}</div>}
      {notice && <div className="status-message">{notice}</div>}

      <section className="card danger-zone panel-grid">
        <div>
          <h3>Odjava</h3>
          <p className="page-subtitle">Sigurno zatvori sesiju i vrati se na login.</p>
        </div>
        <div className="inline-actions">
          <button type="button" className="btn btn-outline danger-button" onClick={logout}>
            Odjavi se
          </button>
        </div>
      </section>
    </div>
  )
}
