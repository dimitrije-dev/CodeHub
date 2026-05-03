import { useState } from 'react'
import { api } from '../services/api.js'

const ACHIEVEMENT_LABELS = {
  first_task: 'First Step',
  task_master: 'Task Master',
  snippet_wizard: 'Snippet Wizard',
  focus_champion: 'Focus Champion',
  productivity_god: 'Productivity God',
}

export default function QuickActions({ onTaskAdded }) {
  const [quickTask, setQuickTask] = useState('')
  const [loading, setLoading] = useState(false)
  const [achievementNotification, setAchievementNotification] = useState(null)

  async function addQuickTask(e) {
    e.preventDefault()
    if (!quickTask.trim()) return

    setLoading(true)
    try {
      const response = await api.post('/api/tasks', {
        title: quickTask.trim(),
        status: 'todo',
        priority: 'medium',
      })

      const task = response.task || response
      const newAchievements = response.newAchievements || []

      onTaskAdded?.(task)
      setQuickTask('')

      if (newAchievements.length > 0) {
        setAchievementNotification(newAchievements[0])
        setTimeout(() => setAchievementNotification(null), 4500)
      }
    } catch (error) {
      console.error('Failed to add quick task:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {achievementNotification && (
        <div className="achievement-notification" role="status">
          <div className="achievement-notification-content">
            <div style={{ fontSize: '1.2rem' }}>🏆</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.78rem' }}>NEW ACHIEVEMENT</div>
              <div style={{ fontWeight: 700 }}>{ACHIEVEMENT_LABELS[achievementNotification] || achievementNotification}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card quick-actions">
        <div className="dashboard-hero" style={{ gap: '10px' }}>
          <h3 style={{ fontSize: '1rem' }}>Quick action</h3>
          <p className="page-subtitle">Add a task in one move and keep your flow going.</p>
        </div>

        <form onSubmit={addQuickTask} className="quick-task-form" style={{ marginTop: '12px' }}>
          <input
            className="input"
            placeholder="e.g. Prepare sprint planning notes"
            value={quickTask}
            onChange={(e) => setQuickTask(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !quickTask.trim()}>
            {loading ? 'Adding...' : 'Add task'}
          </button>
        </form>
      </div>
    </>
  )
}
