import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // On desktop, keep sidebar open by default
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close sidebar when clicking on main content (mobile only)
  const handleMainContentClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Close sidebar when clicking backdrop
  const handleBackdropClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: 'overview' },
    { name: 'Tasks', path: '/tasks', icon: 'tasks' },
    { name: 'Sync', path: '/sync', icon: 'sync' },
    { name: 'Explorer', path: '/explorer', icon: 'explorer' },
    { name: 'Production', path: '/stock', icon: 'production' },
    { name: 'Maturation', path: '/maturation', icon: 'maturation' },
    { name: 'Bottling', path: '/bottling', icon: 'bottling' },
    { name: 'Marketplace', path: '/orders', icon: 'marketplace' },
    { name: 'Connect', path: '/connect', icon: 'connect' },
  ];

  const renderIcon = (iconName: string): React.ReactElement => {
    const icons: { [key: string]: React.ReactElement } = {
      overview: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      tasks: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M6 10L8.5 12.5L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      sync: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M16 10C16 13.3137 13.3137 16 10 16M16 10C16 6.68629 13.3137 4 10 4M16 10H18M10 16C6.68629 16 4 13.3137 4 10M10 16V18M4 10C4 6.68629 6.68629 4 10 4M4 10H2M10 4V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      explorer: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M13.5 13.5L17.5 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      production: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 17H17M7 17V9L10 5L13 9V17M7 9H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      maturation: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="4" y="6" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7 6V4M13 6V4M4 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      bottling: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M8 3H12M10 3V6M7 6H13C13.5523 6 14 6.44772 14 7V16C14 16.5523 13.5523 17 13 17H7C6.44772 17 6 16.5523 6 16V7C6 6.44772 6.44772 6 7 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      marketplace: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 3H4L5 13H15L16 6H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="7" cy="16" r="1" fill="currentColor"/>
          <circle cx="13" cy="16" r="1" fill="currentColor"/>
        </svg>
      ),
      connect: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 5L10 15M5 10L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
    };
    return icons[iconName] || icons.overview;
  };

  return (
    <div className="layout-container">
      <nav className="top-navbar">
        <div className="nav-brand">
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <svg width="120" height="32" viewBox="0 0 120 32" fill="none" className="logo">
            <rect width="24" height="24" y="4" rx="4" fill="#1a1a1a"/>
            <text x="32" y="22" fill="#1a1a1a" fontSize="18" fontWeight="700" fontFamily="system-ui">PROOF 8</text>
          </svg>
        </div>

        <div className="nav-center">
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="6" stroke="#999" strokeWidth="1.5"/>
              <path d="M12.5 12.5L16 16" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <div className="nav-user">
          <button className="icon-btn" aria-label="Settings">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 2V4M10 16V18M18 10H16M4 10H2M15.5 4.5L14 6M6 14L4.5 15.5M15.5 15.5L14 14M6 6L4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="icon-btn" aria-label="View grid">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="12" y="3" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="3" y="12" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="12" y="12" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
          <button className="icon-btn" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C7.23858 2 5 4.23858 5 7V11L3 13V14H17V13L15 11V7C15 4.23858 12.7614 2 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 14V15C8 16.1046 8.89543 17 10 17C11.1046 17 12 16.1046 12 15V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="user-avatar">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
        </div>
      </nav>

      <div className="layout-content">
        {/* Backdrop for mobile when sidebar is open */}
        {isMobile && sidebarOpen && (
          <div className="sidebar-backdrop" onClick={handleBackdropClick} />
        )}

        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-brand">
            <div className="brand-icon">A</div>
            <span className="brand-name">A Distillery</span>
          </div>
          
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{renderIcon(item.icon)}</span>
                <span className="sidebar-text">{item.name}</span>
                {!sidebarOpen && <span className="sidebar-chevron">›</span>}
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <Link to="/reports" className="sidebar-link">
              <span className="sidebar-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 3H17V14H3V3Z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 7H14M6 10H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="sidebar-text">Reports</span>
            </Link>
            <Link to="/settings" className="sidebar-link">
              <span className="sidebar-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 2V4M10 16V18M18 10H16M4 10H2M15.5 4.5L14 6M6 14L4.5 15.5M15.5 15.5L14 14M6 6L4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="sidebar-text">Settings</span>
            </Link>
            <button onClick={handleLogout} className="sidebar-link">
              <span className="sidebar-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13 3H16C16.5523 3 17 3.44772 17 4V16C17 16.5523 16.5523 17 16 17H13M10 14L13 10M13 10L10 6M13 10H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="sidebar-text">Sign out</span>
            </button>
          </div>
        </aside>

        <main 
          className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
          onClick={handleMainContentClick}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
