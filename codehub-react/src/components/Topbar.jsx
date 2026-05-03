import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate, useLocation } from "react-router-dom";

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Taskovi',
  '/snippets': 'Snippeti',
  '/profile': 'Profil',
  '/achievements': 'Achievements',
  '/pomodoro': 'Pomodoro'
}

const pageStatus = {
  '/dashboard': 'Overview',
  '/tasks': 'Execution',
  '/snippets': 'Knowledge',
  '/profile': 'Profile',
  '/achievements': 'Progress',
  '/pomodoro': 'Focus Mode'
}

export default function Topbar() {
  const { isAuthed, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const currentPage = pageTitles[location.pathname] || 'CodeHub';
  const currentStatus = pageStatus[location.pathname] || 'Workspace';

  function onLogout() {
    logout();
    nav("/login");
  }

  return (
    <header className="topbar">
      <div className="topbar-title-group">
        <div className="topbar-kicker">CodeHub Workspace / {currentPage}</div>
        <h1 className="topbar-title">{currentPage}</h1>
        <div className="topbar-subtitle">Planiraj, fokusiraj se i završi bez stresa.</div>
      </div>
      <div className="topbar-actions">
        <span className="status-pill">{currentStatus}</span>
        <ThemeToggle />
        {isAuthed && (
          <button className="btn btn-outline" onClick={onLogout}>
            Odjavi se
          </button>
        )}
      </div>
    </header>
  );
}
