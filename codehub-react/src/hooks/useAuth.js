import { useSyncExternalStore } from 'react'

const key = 'codehub_token'
const listeners = new Set()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function getSnapshot() {
  return !!localStorage.getItem(key)
}

function subscribe(callback) {
  listeners.add(callback)

  function onStorage(event) {
    if (!event || event.key === key) callback()
  }

  window.addEventListener('storage', onStorage)

  return () => {
    listeners.delete(callback)
    window.removeEventListener('storage', onStorage)
  }
}

export function useAuth() {
  const isAuthed = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const login = (token) => {
    if (!token) return
    localStorage.setItem(key, token)
    emitChange()
  }

  const logout = () => {
    localStorage.removeItem(key)
    localStorage.removeItem('codehub_user')
    emitChange()
  }

  return { isAuthed, login, logout }
}
