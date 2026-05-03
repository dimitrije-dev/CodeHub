import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../services/api.js'
import { usePageTitle } from '../hooks/usePageTitle.js'

export default function Tasks() {
  usePageTitle('Taskovi')

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedTask, setSelectedTask] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  })

  const location = useLocation()

  useEffect(() => {
    if (location.state?.filter) {
      setFilter(location.state.filter)
    }
  }, [location.state])

  useEffect(() => {
    let mounted = true

    async function loadTasks() {
      try {
        const data = await api.get('/api/tasks')
        if (mounted) setTasks(data)
      } catch (error) {
        if (mounted) setError(error.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadTasks()
    return () => {
      mounted = false
    }
  }, [])

  async function addTask(e) {
    e.preventDefault()
    if (!form.title.trim()) return

    try {
      const response = await api.post('/api/tasks', {
        title: form.title.trim(),
        description: form.description,
        priority: form.priority,
        due_date: form.dueDate || null,
        status: 'todo',
      })

      const created = response.task || response
      setTasks((previous) => [created, ...previous])
      setForm({ title: '', description: '', priority: 'medium', dueDate: '' })
      setShowForm(false)
      setError('')
    } catch (error) {
      setError(error.message)
    }
  }

  async function updateStatus(id, status) {
    try {
      const updated = await api.put(`/api/tasks/${id}`, { status })
      setTasks((previous) => previous.map((task) => (task.id === id ? updated : task)))
    } catch (error) {
      setError(error.message)
    }
  }

  async function toggleDone(id, currentStatus) {
    const nextStatus = currentStatus === 'done' ? 'todo' : 'done'
    await updateStatus(id, nextStatus)
  }

  async function removeTask(id) {
    try {
      await api.delete(`/api/tasks/${id}`)
      setTasks((previous) => previous.filter((task) => task.id !== id))
      if (selectedTask === id) setSelectedTask(null)
    } catch (error) {
      setError(error.message)
    }
  }

  const filteredTasks = tasks.filter((task) => (filter === 'all' ? true : task.status === filter))

  const counters = {
    all: tasks.length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    doing: tasks.filter((task) => task.status === 'doing').length,
    done: tasks.filter((task) => task.status === 'done').length,
  }

  return (
    <div className="panel-grid">
      <section className="card panel-grid">
        <div className="page-header">
          <div>
            <h1 className="page-title">Taskovi</h1>
            <p className="page-subtitle">Organizuj posao po prioritetu i statusu.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm((value) => !value)}>
            {showForm ? 'Zatvori formu' : 'Dodaj task'}
          </button>
        </div>

        <div className="inline-actions" style={{ gap: '8px' }}>
          {['all', 'todo', 'doing', 'done'].map((status) => (
            <button
              key={status}
              className={`status-chip ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'Svi' : status} ({counters[status]})
            </button>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}
      </section>

      {showForm && (
        <section className="card panel-grid">
          <h3>Novi task</h3>
          <form onSubmit={addTask} className="panel-grid">
            <input
              className="input"
              placeholder="Naslov taska"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />

            <textarea
              className="textarea"
              placeholder="Kratak opis ili sledeći koraci"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />

            <div className="form-row">
              <select
                className="input"
                value={form.priority}
                onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
              >
                <option value="low">Nizak prioritet</option>
                <option value="medium">Srednji prioritet</option>
                <option value="high">Visok prioritet</option>
              </select>
              <input
                type="date"
                className="input"
                value={form.dueDate}
                onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
              />
            </div>

            <button type="submit" className="btn btn-primary">Sačuvaj task</button>
          </form>
        </section>
      )}

      {loading ? (
        <div className="card">Učitavanje taskova...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="card empty-state">Nema taskova za odabrani filter.</div>
      ) : (
        <section className="data-grid">
          {filteredTasks.map((task) => (
            <article key={task.id} className="task-card">
              <div className="task-main-row">
                <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  onChange={() => toggleDone(task.id, task.status)}
                />

                <div>
                  <div className={`task-title ${task.status === 'done' ? 'done' : ''}`}>{task.title}</div>
                  {task.description && <p className="task-description">{task.description}</p>}
                  <div className="task-meta">
                    {task.due_date && <span>Rok: {new Date(task.due_date).toLocaleDateString('sr-RS')}</span>}
                    <span>Kreirano: {new Date(task.created_at).toLocaleDateString('sr-RS')}</span>
                  </div>
                </div>

                <span className={`tag tag-${task.priority || 'medium'}`}>{task.priority || 'medium'}</span>
              </div>

              <div className="task-actions">
                <select
                  className="input"
                  value={task.status}
                  onChange={(event) => updateStatus(task.id, event.target.value)}
                  style={{ width: '130px' }}
                >
                  <option value="todo">To-Do</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>

                <button
                  className="btn btn-outline"
                  onClick={() => setSelectedTask((prev) => (prev === task.id ? null : task.id))}
                >
                  {selectedTask === task.id ? 'Sakrij detalje' : 'Detalji'}
                </button>

                <button className="btn btn-outline" style={{ color: 'var(--danger)' }} onClick={() => removeTask(task.id)}>
                  Obriši
                </button>
              </div>

              {selectedTask === task.id && (
                <div className="task-details">
                  <div>Status: {task.status}</div>
                  <div>Prioritet: {task.priority}</div>
                  <div>Kreiran: {new Date(task.created_at).toLocaleString('sr-RS')}</div>
                  {task.updated_at && <div>Ažuriran: {new Date(task.updated_at).toLocaleString('sr-RS')}</div>}
                  {task.due_date && <div>Rok: {new Date(task.due_date).toLocaleDateString('sr-RS')}</div>}
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  )
}
