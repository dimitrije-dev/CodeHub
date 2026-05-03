import { useEffect, useMemo, useState } from 'react'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { api } from '../services/api.js'

const ALL_ACHIEVEMENTS = [
  {
    id: 'first_task',
    title: 'First Step',
    description: 'Create your first task',
    icon: '🎯',
    rarity: 'common',
    tooltip: 'Kick off your productive workflow by creating your first task.',
    howToUnlock: 'Create your first task in the Tasks section.',
  },
  {
    id: 'task_master',
    title: 'Task Master',
    description: 'Complete 10 tasks',
    icon: '👑',
    rarity: 'rare',
    tooltip: 'You proved you can deliver tasks consistently.',
    howToUnlock: 'Complete 10 tasks and mark them as Done.',
  },
  {
    id: 'snippet_wizard',
    title: 'Snippet Wizard',
    description: 'Create 5 snippets',
    icon: '🧙',
    rarity: 'uncommon',
    tooltip: 'You are building a reliable personal code library.',
    howToUnlock: 'Create 5 snippets in the Snippets section.',
  },
  {
    id: 'focus_champion',
    title: 'Focus Champion',
    description: 'Complete 5 Pomodoro sessions',
    icon: '🍅',
    rarity: 'rare',
    tooltip: 'You are maintaining strong focus and delivery rhythm.',
    howToUnlock: 'Complete 5 pomodoro sessions.',
  },
  {
    id: 'streak_warrior',
    title: 'Streak Warrior',
    description: 'Stay active for 3 days in a row',
    icon: '🔥',
    rarity: 'epic',
    tooltip: 'Consistency is the core multiplier for real progress.',
    howToUnlock: 'Use the app 3 days in a row.',
  },
  {
    id: 'productivity_god',
    title: 'Productivity God',
    description: 'Complete 50 tasks',
    icon: '⚡',
    rarity: 'legendary',
    tooltip: 'You are entering an elite level of execution.',
    howToUnlock: 'Complete 50 tasks.',
  },
  {
    id: 'code_collector',
    title: 'Code Collector',
    description: 'Create 20 snippets',
    icon: '💎',
    rarity: 'epic',
    tooltip: 'Your code base is becoming a serious productivity asset.',
    howToUnlock: 'Create 20 snippets.',
  },
  {
    id: 'time_master',
    title: 'Time Master',
    description: 'Complete 25 Pomodoro sessions',
    icon: '⏰',
    rarity: 'epic',
    tooltip: 'You are mastering time management through focus discipline.',
    howToUnlock: 'Complete 25 pomodoro sessions.',
  },
  {
    id: 'consistency_king',
    title: 'Consistency King',
    description: 'Stay active for 7 days in a row',
    icon: '🛡️',
    rarity: 'legendary',
    tooltip: 'A full week of consistency is a major performance multiplier.',
    howToUnlock: 'Use the app 7 days in a row.',
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete 5 tasks in one day',
    icon: '🚀',
    rarity: 'rare',
    tooltip: 'Excellent pacing and delivery speed.',
    howToUnlock: 'Complete 5 tasks in one day.',
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Use the app after 10 PM',
    icon: '🦉',
    rarity: 'uncommon',
    tooltip: 'Night sessions: deep focus with fewer distractions.',
    howToUnlock: 'Use the app after 10 PM.',
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Use the app before 6 AM',
    icon: '🐦',
    rarity: 'uncommon',
    tooltip: 'Early sessions with fresh energy and clean concentration.',
    howToUnlock: 'Use the app before 6 AM.',
  },
]

const rarityConfig = {
  common: { label: 'Common', color: '#8d9caf' },
  uncommon: { label: 'Uncommon', color: '#2fba84' },
  rare: { label: 'Rare', color: '#2e8fff' },
  epic: { label: 'Epic', color: '#7d58d8' },
  legendary: { label: 'Legendary', color: '#de8c1c' },
}

export default function Achievements() {
  usePageTitle('Achievements')

  const [unlockedIds, setUnlockedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadAchievements() {
      try {
        const result = await api.get('/api/achievements')
        if (!mounted) return

        const ids = Array.isArray(result)
          ? result.map((item) => item.achievement_id).filter(Boolean)
          : []

        setUnlockedIds(ids)
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError.message || 'Failed to load achievement data.')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadAchievements()

    return () => {
      mounted = false
    }
  }, [])

  const unlocked = useMemo(
    () => ALL_ACHIEVEMENTS.filter((achievement) => unlockedIds.includes(achievement.id)),
    [unlockedIds],
  )

  const locked = useMemo(
    () => ALL_ACHIEVEMENTS.filter((achievement) => !unlockedIds.includes(achievement.id)),
    [unlockedIds],
  )

  const completion = Math.round((unlocked.length / ALL_ACHIEVEMENTS.length) * 100)

  if (loading) {
    return <div className="card">Loading achievements...</div>
  }

  return (
    <div className="panel-grid">
      <section className="card hero-card panel-grid">
        <div className="page-header">
          <div>
            <h1 className="page-title">Achievements</h1>
            <p className="page-subtitle">
              Track your progress through milestones and unlock the next level of productivity.
            </p>
          </div>
          <span className="tag tag-medium">{completion}% completed</span>
        </div>

        <div className="stat-grid achievements-stat-grid">
          <div className="stat-tile">
            <div className="stat-label">Unlocked</div>
            <div className="stat-value metric-green">{unlocked.length}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Locked</div>
            <div className="stat-value metric-orange">{locked.length}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Total</div>
            <div className="stat-value metric-blue">{ALL_ACHIEVEMENTS.length}</div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </section>

      <section className="card panel-grid">
        <div className="page-header">
          <h2>Unlocked</h2>
          <span className="page-subtitle">Earned badges</span>
        </div>

        {unlocked.length === 0 ? (
          <div className="empty-state">No achievements unlocked yet. Complete your first tasks to begin the streak.</div>
        ) : (
          <div className="achievement-grid">
            {unlocked.map((achievement) => (
              <article
                key={achievement.id}
                className="achievement achievement-unlocked"
                title={`${achievement.tooltip} ${achievement.howToUnlock}`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-content">
                  <div className="achievement-title">{achievement.title}</div>
                  <div className="achievement-description">{achievement.description}</div>
                  <div className="achievement-footnote">{achievement.howToUnlock}</div>
                  <div className="achievement-rarity" style={{ color: rarityConfig[achievement.rarity].color }}>
                    {rarityConfig[achievement.rarity].label}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card panel-grid">
        <div className="page-header">
          <h2>Locked</h2>
          <span className="page-subtitle">Next milestones</span>
        </div>

        <div className="achievement-grid">
          {locked.map((achievement) => (
            <article key={achievement.id} className="achievement achievement-locked" title={achievement.howToUnlock}>
              <div className="achievement-icon">🔒</div>
              <div className="achievement-content">
                <div className="achievement-title">{achievement.title}</div>
                <div className="achievement-description">{achievement.description}</div>
                <div className="achievement-footnote">{achievement.howToUnlock}</div>
                <div className="achievement-rarity">{rarityConfig[achievement.rarity].label}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
