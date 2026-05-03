import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate, useLocation } from "react-router-dom";

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tasks': 'Tasks',
  '/snippets': 'Snippets',
  '/profile': 'Profile',
  '/achievements': 'Achievements',
  '/pomodoro': 'Pomodoro',
  '/ai-prompts': 'AI Prompts'
}

const pageStatus = {
  '/dashboard': 'Overview',
  '/tasks': 'Execution',
  '/snippets': 'Knowledge',
  '/profile': 'Profile',
  '/achievements': 'Progress',
  '/pomodoro': 'Focus Mode',
  '/ai-prompts': 'AI Assistant'
}

export default function Topbar({ onMenuClick }) {
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
        {isAuthed && (
          <button className="mobile-menu-button" onClick={onMenuClick} aria-label="Open navigation">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        )}
        <div className="topbar-kicker">CodeHub Workspace / {currentPage}</div>
        <h1 className="topbar-title">{currentPage}</h1>
        <div className="topbar-subtitle">Plan clearly, stay focused, and ship with confidence.</div>
      </div>
      <div className="topbar-actions">
        <span className="status-pill">{currentStatus}</span>
        <ThemeToggle />
        {isAuthed && (
          <button className="btn btn-outline" onClick={onLogout}>
            Sign out
          </button>
        )}
      </div>
    </header>
  );
}
