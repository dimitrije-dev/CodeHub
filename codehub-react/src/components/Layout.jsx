import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sidebar_collapsed', false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  function toggleSidebar() {
    setSidebarCollapsed(!sidebarCollapsed);
  }

  function openMobileSidebar() {
    setMobileSidebarOpen(true)
  }

  function closeMobileSidebar() {
    setMobileSidebarOpen(false)
  }

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileSidebarOpen ? 'mobile-nav-open' : ''}`}>
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={closeMobileSidebar}
      />
      <div className="app-main">
        <Topbar onMenuClick={openMobileSidebar} />
        <main className="container-page">
          <Outlet />
        </main>
      </div>
      {mobileSidebarOpen && <button className="mobile-nav-overlay" onClick={closeMobileSidebar} aria-label="Close navigation" />}
    </div>
  );
}
