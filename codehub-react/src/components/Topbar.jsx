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

export default function Topbar() {
  const { isAuthed, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const currentPage = pageTitles[location.pathname] || 'CodeHub';

  function onLogout() {
    logout();
    nav("/login");
  }

  return (
    <header className="topbar">
      <div className="topbar-title-group">
        <h1 className="topbar-title">{currentPage}</h1>
        <div className="topbar-subtitle">Planiraj, fokusiraj se i završi bez stresa.</div>
      </div>
      <div className="topbar-actions">
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
