import { useEffect, useMemo, useState } from 'react'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { api } from '../services/api.js'

const ALL_ACHIEVEMENTS = [
  {
    id: 'first_task',
    title: 'Prvi korak',
    description: 'Kreirao si svoj prvi task',
    icon: '🎯',
    rarity: 'common',
    tooltip: 'Počni svoju produktivnu putanju kreiranjem prvog taska.',
    howToUnlock: 'Kreiraj svoj prvi task u Taskovi sekciji.',
  },
  {
    id: 'task_master',
    title: 'Task Master',
    description: 'Završio si 10 taskova',
    icon: '👑',
    rarity: 'rare',
    tooltip: 'Dokazao si da možeš da završavaš taskove konzistentno.',
    howToUnlock: 'Završi 10 taskova i označi ih kao Done.',
  },
  {
    id: 'snippet_wizard',
    title: 'Snippet Wizard',
    description: 'Kreirao si 5 snippeta',
    icon: '🧙',
    rarity: 'uncommon',
    tooltip: 'Postao si majstor čuvanja korisnog koda.',
    howToUnlock: 'Kreiraj 5 snippeta u Snippeti sekciji.',
  },
  {
    id: 'focus_champion',
    title: 'Focus Champion',
    description: 'Završio si 5 Pomodoro sesija',
    icon: '🍅',
    rarity: 'rare',
    tooltip: 'Uspešno održavaš fokus i tempo rada.',
    howToUnlock: 'Završi 5 pomodoro sesija.',
  },
  {
    id: 'streak_warrior',
    title: 'Streak Warrior',
    description: 'Radio si 3 dana zaredom',
    icon: '🔥',
    rarity: 'epic',
    tooltip: 'Konzistentnost je ključ svakog napretka.',
    howToUnlock: 'Koristi aplikaciju 3 dana zaredom.',
  },
  {
    id: 'productivity_god',
    title: 'Productivity God',
    description: 'Završio si 50 taskova',
    icon: '⚡',
    rarity: 'legendary',
    tooltip: 'Ulaziš u elitni nivo produktivnosti.',
    howToUnlock: 'Završi 50 taskova.',
  },
  {
    id: 'code_collector',
    title: 'Code Collector',
    description: 'Kreirao si 20 snippeta',
    icon: '💎',
    rarity: 'epic',
    tooltip: 'Tvoja baza koda postaje ozbiljan resurs.',
    howToUnlock: 'Kreiraj 20 snippeta.',
  },
  {
    id: 'time_master',
    title: 'Time Master',
    description: 'Završio si 25 Pomodoro sesija',
    icon: '⏰',
    rarity: 'epic',
    tooltip: 'Savladao si upravljanje vremenom.',
    howToUnlock: 'Završi 25 pomodoro sesija.',
  },
  {
    id: 'consistency_king',
    title: 'Consistency King',
    description: 'Radio si 7 dana zaredom',
    icon: '🛡️',
    rarity: 'legendary',
    tooltip: 'Nedeljna konzistentnost je najveći multiplikator.',
    howToUnlock: 'Koristi aplikaciju 7 dana zaredom.',
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Završio si 5 taskova u jednom danu',
    icon: '🚀',
    rarity: 'rare',
    tooltip: 'Odličan ritam i brzina isporuke.',
    howToUnlock: 'Završi 5 taskova u jednom danu.',
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Radio si posle 22h',
    icon: '🦉',
    rarity: 'uncommon',
    tooltip: 'Noćni rad - fokus bez buke.',
    howToUnlock: 'Koristi aplikaciju posle 22h.',
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Radio si pre 6h ujutru',
    icon: '🐦',
    rarity: 'uncommon',
    tooltip: 'Jutarnji ritam i čist fokus.',
    howToUnlock: 'Koristi aplikaciju pre 6h.',
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
          setError(fetchError.message || 'Neuspešno učitavanje achievement podataka.')
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
    return <div className="card">Učitavanje achievement sekcije...</div>
  }

  return (
    <div className="panel-grid">
      <section className="card hero-card panel-grid">
        <div className="page-header">
          <div>
            <h1 className="page-title">Achievements</h1>
            <p className="page-subtitle">
              Prati napredak kroz ciljeve i otključavaj sledeće nivoe produktivnosti.
            </p>
          </div>
          <span className="tag tag-medium">{completion}% kompletirano</span>
        </div>

        <div className="stat-grid achievements-stat-grid">
          <div className="stat-tile">
            <div className="stat-label">Otključani</div>
            <div className="stat-value metric-green">{unlocked.length}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Zaključani</div>
            <div className="stat-value metric-orange">{locked.length}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Ukupno</div>
            <div className="stat-value metric-blue">{ALL_ACHIEVEMENTS.length}</div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </section>

      <section className="card panel-grid">
        <div className="page-header">
          <h2>Otključani</h2>
          <span className="page-subtitle">Zarađeni bedževi</span>
        </div>

        {unlocked.length === 0 ? (
          <div className="empty-state">Još nema otključanih achievement-a. Dodaj task i kreni seriju.</div>
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
          <h2>Zaključani</h2>
          <span className="page-subtitle">Sledeći ciljevi</span>
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
