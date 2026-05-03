import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api.js'

function formatTime(seconds) {
  const safe = Math.max(0, Number(seconds) || 0)
  const mins = Math.floor(safe / 60)
  const secs = safe % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [totalMinutes, setTotalMinutes] = useState(0)

  const handleSessionComplete = useCallback(async () => {
    setIsRunning(false)

    if (!isBreak) {
      const minutes = 25

      setTotalMinutes((previous) => previous + minutes)
      setSessionCount((previous) => previous + 1)

      try {
        await api.post('/api/focus-sessions', { minutes })
      } catch {
        // Silent fallback; stats remain available locally.
      }

      setIsBreak(true)
      setTimeLeft(5 * 60)
      return
    }

    setIsBreak(false)
    setTimeLeft(25 * 60)
  }, [isBreak])

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return undefined

    const timer = setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, timeLeft])

  useEffect(() => {
    if (timeLeft !== 0 || !isRunning) return
    void handleSessionComplete()
  }, [timeLeft, isRunning, handleSessionComplete])

  function startTimer() {
    if (timeLeft <= 0) return
    setIsRunning(true)
  }

  function pauseTimer() {
    setIsRunning(false)
  }

  function resetTimer() {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(25 * 60)
  }

  return (
    <div className="card panel-grid" style={{ textAlign: 'center' }}>
      <h3>{isBreak ? 'Break' : 'Pomodoro Timer'}</h3>

      <div className="pomodoro-display" style={{ fontSize: 'clamp(2rem, 7vw, 3.8rem)' }}>
        {formatTime(timeLeft)}
      </div>

      <div className="inline-actions" style={{ justifyContent: 'center' }}>
        {!isRunning ? (
          <button className="btn btn-primary" onClick={startTimer}>Start</button>
        ) : (
          <button className="btn btn-secondary" onClick={pauseTimer}>Pause</button>
        )}
        <button className="btn btn-outline" onClick={resetTimer}>Reset</button>
      </div>

      <div className="pomodoro-stats">
        <div className="pomodoro-stat">
          <div className="pomodoro-stat-value">{sessionCount}</div>
          <div className="pomodoro-stat-label">Sessions</div>
        </div>
        <div className="pomodoro-stat">
          <div className="pomodoro-stat-value">{totalMinutes}</div>
          <div className="pomodoro-stat-label">Minutes</div>
        </div>
        <div className="pomodoro-stat">
          <div className="pomodoro-stat-value">{isRunning ? 'Active' : 'Ready'}</div>
          <div className="pomodoro-stat-label">Status</div>
        </div>
      </div>
    </div>
  )
}
