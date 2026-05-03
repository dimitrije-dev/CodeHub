import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import VelocityChart from '../charts/VelocityChart.jsx'
import ProgressChart from '../charts/ProgressChart.jsx'
import QuickActions from '../components/QuickActions.jsx'
import Achievements from '../components/Achievements.jsx'
import { api } from '../services/api.js'
import { usePageTitle } from '../hooks/usePageTitle.js'

function MiniCalendar() {
  const now = new Date()
  const monthNames = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar']
  const weekDays = ['P', 'U', 'S', 'Č', 'P', 'S', 'N']

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay()
  const offset = firstDay === 0 ? 6 : firstDay - 1

  const cells = []
  for (let i = 0; i < offset; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day)

  return (
    <div className="card panel-grid">
      <h3>{monthNames[now.getMonth()]} {now.getFullYear()}</h3>
      <div className="mini-calendar-grid">
        {weekDays.map((day) => (
          <div key={day} className="mini-calendar-day">{day}</div>
        ))}
      </div>

      <div className="mini-calendar-grid">
        {cells.map((day, index) => (
          <div key={`${day || 'empty'}-${index}`} className={`mini-calendar-cell ${day === now.getDate() ? 'today' : ''}`}>
            {day || ''}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  usePageTitle('Dashboard')
  const navigate = useNavigate()

  const [velocity, setVelocity] = useState([])
  const [focus, setFocus] = useState([])
  const [taskCounts, setTaskCounts] = useState({ todo: 0, doing: 0, done: 0 })
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalSnippets: 0,
    focusMinutes: 0,
    currentStreak: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadDashboard() {
      try {
        const [velocityData, focusData, tasks, snippets] = await Promise.all([
          api.get('/api/metrics/velocity?days=7'),
          api.get('/api/metrics/focus'),
          api.get('/api/tasks'),
          api.get('/api/snippets'),
        ])

        if (!mounted) return

        const counts = {
          todo: tasks.filter((task) => task.status === 'todo').length,
          doing: tasks.filter((task) => task.status === 'doing').length,
          done: tasks.filter((task) => task.status === 'done').length,
        }

        const focusMinutes = focusData.reduce((acc, item) => acc + (parseInt(item.minutes, 10) || 0), 0)

        let streak = 0
        for (let i = focusData.length - 1; i >= 0; i -= 1) {
          const minutes = parseInt(focusData[i].minutes, 10) || 0
          if (minutes <= 0) break
          streak += 1
        }

        setVelocity(velocityData)
        setFocus(focusData)
        setTaskCounts(counts)
        setStats({
          totalTasks: tasks.length,
          completedTasks: counts.done,
          totalSnippets: snippets.length,
          focusMinutes,
          currentStreak: streak,
        })
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
        if (mounted) {
          setVelocity([])
          setFocus([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadDashboard()
    return () => {
      mounted = false
    }
  }, [])

  async function handleTaskAdded() {
    try {
      const tasks = await api.get('/api/tasks')
      const counts = {
        todo: tasks.filter((task) => task.status === 'todo').length,
        doing: tasks.filter((task) => task.status === 'doing').length,
        done: tasks.filter((task) => task.status === 'done').length,
      }

      setTaskCounts(counts)
      setStats((prev) => ({
        ...prev,
        totalTasks: tasks.length,
        completedTasks: counts.done,
      }))
    } catch (error) {
      console.error('Failed to refresh tasks:', error)
    }
  }

  return (
    <div className="panel-grid">
      <section className="card hero-card dashboard-hero">
        <div className="dashboard-hero-top">
          <div>
            <h1 className="dashboard-hero-title">Dobrodošao nazad</h1>
            <p className="dashboard-hero-text">Centralni pregled rada, fokusa i napretka za ovu nedelju.</p>
          </div>

          <div className="inline-actions">
            <button className="btn btn-outline" onClick={() => navigate('/pomodoro')}>
              Otvori pomodoro
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/tasks')}>
              Novi task
            </button>
          </div>
        </div>

        <QuickActions onTaskAdded={handleTaskAdded} />
      </section>

      <section className="stat-grid">
        <button className="stat-tile" onClick={() => navigate('/tasks', { state: { filter: 'todo' } })}>
          <div className="stat-label">To-Do</div>
          <div className="stat-value metric-orange">{taskCounts.todo}</div>
        </button>
        <button className="stat-tile" onClick={() => navigate('/tasks', { state: { filter: 'doing' } })}>
          <div className="stat-label">U radu</div>
          <div className="stat-value metric-blue">{taskCounts.doing}</div>
        </button>
        <button className="stat-tile" onClick={() => navigate('/tasks', { state: { filter: 'done' } })}>
          <div className="stat-label">Završeno</div>
          <div className="stat-value metric-green">{taskCounts.done}</div>
        </button>
        <div className="stat-tile">
          <div className="stat-label">Snippeti</div>
          <div className="stat-value">{stats.totalSnippets}</div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="task-summary card">
          <h3>Nedeljni sažetak</h3>
          <div className="task-summary-card">
            <div className="task-summary-item">
              <span className="task-summary-label">Ukupno taskova</span>
              <span className="task-summary-value">{stats.totalTasks}</span>
            </div>
            <div className="task-summary-item">
              <span className="task-summary-label">Završenih taskova</span>
              <span className="task-summary-value metric-green">{stats.completedTasks}</span>
            </div>
            <div className="task-summary-item">
              <span className="task-summary-label">Fokus minuta (7 dana)</span>
              <span className="task-summary-value metric-blue">{stats.focusMinutes}</span>
            </div>
            <div className="task-summary-item">
              <span className="task-summary-label">Aktivni streak</span>
              <span className="task-summary-value metric-orange">{stats.currentStreak} dana</span>
            </div>
          </div>
        </div>

        <MiniCalendar />
      </section>

      <section className="chart-grid">
        <VelocityChart data={velocity} loading={loading} />
        <ProgressChart data={focus} loading={loading} />
      </section>

      <section className="card panel-grid" style={{ background: 'linear-gradient(135deg, var(--surface-soft), var(--surface))' }}>
        <h2>Achievements</h2>
        <Achievements stats={stats} />
      </section>
    </div>
  )
}
