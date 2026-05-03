import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import logo from "../assets/codehub-logo.png";

const menuItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    title: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    )
  },
  {
    to: "/tasks",
    label: "Tasks",
    title: "Tasks",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3l8-8"/>
        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9c1.5 0 2.91.37 4.15 1.02"/>
      </svg>
    )
  },
  {
    to: "/snippets",
    label: "Snippets",
    title: "Snippets",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16,18 22,12 16,6"/>
        <polyline points="8,6 2,12 8,18"/>
      </svg>
    )
  },
  {
    to: "/pomodoro",
    label: "Pomodoro",
    title: "Pomodoro",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
    )
  },
  {
    to: "/ai-prompts",
    label: "AI Prompts",
    title: "AI Prompts",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4"/>
        <path d="M12 18v4"/>
        <path d="M4.93 4.93l2.83 2.83"/>
        <path d="M16.24 16.24l2.83 2.83"/>
        <path d="M2 12h4"/>
        <path d="M18 12h4"/>
        <path d="M4.93 19.07l2.83-2.83"/>
        <path d="M16.24 7.76l2.83-2.83"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
    )
  },
  {
    to: "/achievements",
    label: "Achievements",
    title: "Achievements",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M12 14V22"/>
      </svg>
    )
  },
  {
    to: "/profile",
    label: "Profile",
    title: "Profile",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  }
];

export default function Sidebar({ isCollapsed, onToggle, isMobileOpen, onCloseMobile }) {
  const { isAuthed } = useAuth();

  if (!isAuthed) return null;

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <img
            className={`brand-logo ${isCollapsed ? 'brand-logo--collapsed' : 'brand-logo--sidebar'}`}
            src={logo}
            alt="CodeHub logo"
          />
          <div className="brand-copy">
            <div className="brand-title">CodeHub</div>
            <div className="brand-subtitle">Build Momentum Daily</div>
          </div>
        </div>
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          title={isCollapsed ? 'Expand menu' : 'Collapse menu'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isCollapsed ? (
              <path d="M3 12h18M3 6h18M3 18h18"/>
            ) : (
              <path d="M18 6L6 18M6 6l12 12"/>
            )}
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="sidebar-link"
            title={item.title}
            onClick={onCloseMobile}
          >
            {item.icon}
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
