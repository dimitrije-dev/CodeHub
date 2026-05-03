import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api.js'
import { usePageTitle } from '../hooks/usePageTitle.js'

const STORAGE_KEY = 'codehub_pomodoro_state_v2'
const WORK_PRESETS = [15, 25, 50]
const BREAK_PRESETS = [5, 10, 15]

function safeMinutes(value, fallback) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 180) return fallback
  return Math.round(parsed)
}

function formatTime(seconds) {
  const safe = Math.max(0, Number(seconds) || 0)
  const mins = Math.floor(safe / 60)
  const secs = safe % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default function Pomodoro() {
  usePageTitle('Pomodoro')

  const [workMinutes, setWorkMinutes] = useState(25)
  const [breakMinutes, setBreakMinutes] = useState(5)
  const [mode, setMode] = useState('focus')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved)
      const nextWork = safeMinutes(parsed.workMinutes, 25)
      const nextBreak = safeMinutes(parsed.breakMinutes, 5)
      const nextMode = parsed.mode === 'break' ? 'break' : 'focus'
      const baseTime = nextMode === 'focus' ? nextWork * 60 : nextBreak * 60
      const savedTime = Number(parsed.timeLeft)
      const hasSavedTime = Number.isFinite(savedTime) && savedTime >= 0

      let restoredTime = hasSavedTime ? Math.min(savedTime, baseTime) : baseTime
      let restoredRunning = Boolean(parsed.isRunning)

      if (restoredRunning && Number.isFinite(parsed.lastTick)) {
        const elapsed = Math.max(0, Math.floor((Date.now() - parsed.lastTick) / 1000))
        restoredTime = Math.max(0, restoredTime - elapsed)
        if (restoredTime === 0) restoredRunning = false
      }

      setWorkMinutes(nextWork)
      setBreakMinutes(nextBreak)
      setMode(nextMode)
      setTimeLeft(restoredTime)
      setIsRunning(restoredRunning)
      setSessionCount(Math.max(0, Number(parsed.sessionCount) || 0))
      setTotalMinutes(Math.max(0, Number(parsed.totalMinutes) || 0))
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    const state = {
      workMinutes,
      breakMinutes,
      mode,
      timeLeft,
      isRunning,
      sessionCount,
      totalMinutes,
      lastTick: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [workMinutes, breakMinutes, mode, timeLeft, isRunning, sessionCount, totalMinutes])

  const handleSessionComplete = useCallback(async () => {
    if (mode === 'focus') {
      try {
        await api.post('/api/focus-sessions', { minutes: workMinutes })
      } catch {
        setError('Sesija je završena, ali čuvanje fokusa na server nije uspelo.')
      }

      setSessionCount((previous) => previous + 1)
      setTotalMinutes((previous) => previous + workMinutes)
      setMode('break')
      setTimeLeft(breakMinutes * 60)
      setIsRunning(true)
      return
    }

    setMode('focus')
    setTimeLeft(workMinutes * 60)
    setIsRunning(false)
  }, [mode, workMinutes, breakMinutes])

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return undefined

    const timer = setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, timeLeft])

  useEffect(() => {
    if (timeLeft !== 0 || !isRunning) return

    setIsRunning(false)
    void handleSessionComplete()
  }, [timeLeft, isRunning, handleSessionComplete])

  const totalSeconds = (mode === 'focus' ? workMinutes : breakMinutes) * 60
  const progress = useMemo(() => {
    if (totalSeconds <= 0) return 0
    return Math.min(100, Math.max(0, ((totalSeconds - timeLeft) / totalSeconds) * 100))
  }, [timeLeft, totalSeconds])

  function startTimer() {
    if (timeLeft <= 0) return
    setError('')
    setIsRunning(true)
  }

  function pauseTimer() {
    setIsRunning(false)
  }

  function resetTimer() {
    setIsRunning(false)
    setMode('focus')
    setTimeLeft(workMinutes * 60)
    setError('')
  }

  function chooseWorkMinutes(minutes) {
    if (isRunning || mode !== 'focus') return
    setWorkMinutes(minutes)
    setTimeLeft(minutes * 60)
  }

  function chooseBreakMinutes(minutes) {
    if (isRunning || mode !== 'break') {
      setBreakMinutes(minutes)
      return
    }

    setBreakMinutes(minutes)
    setTimeLeft(minutes * 60)
  }

  return (
    <div className="pomodoro-layout">
      <section className="card hero-card panel-grid">
        <div className="page-header">
          <div>
            <h1 className="page-title">Pomodoro fokus</h1>
            <p className="page-subtitle">
              Radi u jasnim intervalima i prati koliko fokusa si stvarno odradio.
            </p>
          </div>
          <span className={`tag ${mode === 'focus' ? 'tag-medium' : 'tag-low'}`}>
            {mode === 'focus' ? 'Radna sesija' : 'Pauza'}
          </span>
        </div>

        <div className="pomodoro-display">{formatTime(timeLeft)}</div>

        <div className="pomodoro-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <div style={{ width: `${progress}%` }} />
        </div>

        <div className="inline-actions" style={{ justifyContent: 'center' }}>
          {!isRunning ? (
            <button type="button" className="btn btn-primary" onClick={startTimer}>
              Pokreni
            </button>
          ) : (
            <button type="button" className="btn btn-secondary" onClick={pauseTimer}>
              Pauziraj
            </button>
          )}
          <button type="button" className="btn btn-outline" onClick={resetTimer}>
            Resetuj
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </section>

      <section className="card pomodoro-settings">
        <div className="panel-grid">
          <h3>Dužina rada</h3>
          <div className="pomodoro-row">
            {WORK_PRESETS.map((minutes) => (
              <button
                key={minutes}
                type="button"
                onClick={() => chooseWorkMinutes(minutes)}
                className={`btn ${workMinutes === minutes ? 'btn-primary' : 'btn-outline'}`}
                disabled={isRunning || mode !== 'focus'}
              >
                {minutes} min
              </button>
            ))}
          </div>
        </div>

        <div className="panel-grid">
          <h3>Dužina pauze</h3>
          <div className="pomodoro-row">
            {BREAK_PRESETS.map((minutes) => (
              <button
                key={minutes}
                type="button"
                onClick={() => chooseBreakMinutes(minutes)}
                className={`btn ${breakMinutes === minutes ? 'btn-primary' : 'btn-outline'}`}
                disabled={isRunning && mode === 'break'}
              >
                {minutes} min
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pomodoro-stats">
        <article className="pomodoro-stat card">
          <div className="pomodoro-stat-value">{sessionCount}</div>
          <div className="pomodoro-stat-label">Završene sesije</div>
        </article>

        <article className="pomodoro-stat card">
          <div className="pomodoro-stat-value">{totalMinutes}</div>
          <div className="pomodoro-stat-label">Ukupno fokus minuta</div>
        </article>

        <article className="pomodoro-stat card">
          <div className="pomodoro-stat-value">{isRunning ? 'Aktivan' : 'Spreman'}</div>
          <div className="pomodoro-stat-label">Status timera</div>
        </article>
      </section>

      <section className="card pomodoro-guide">
        <h3>Kako da koristiš ovaj režim</h3>
        <ul>
          <li>Izaberi trajanje rada i pauze pre pokretanja sesije.</li>
          <li>Tokom rada drži fokus na jednom zadatku bez prebacivanja.</li>
          <li>Kada sesija istekne, pauza počinje automatski.</li>
          <li>Po završetku pauze timer staje i čeka tvoj novi start.</li>
        </ul>
      </section>
    </div>
  )
}
