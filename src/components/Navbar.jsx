import React, { useState } from 'react';
import './styles/Navbar.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  Menu,
  X,
  UserCircle,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './styles/theme.css';

const Navbar = ({
  t,
  currentLang,
  changeLanguage,
  isSidebarOpen,
  onOpenSidebar,
  onCloseSidebar, 
  openLoginModal
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);

  const { user, profile, logout, loading } = useAuth();

  const languages = [
    { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
    { code: 'en', flag: '🇺🇸', label: 'English' },
    { code: 'ru', flag: '🇷🇺', label: 'Русский' }
  ];

  const handleCloseMenus = () => {
    setIsLangOpen(false);

    if (onCloseSidebar) {
      onCloseSidebar();
    }
  };

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsLangOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    handleCloseMenus();
  };


  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    'User';

  const roleLabel = {
    admin: 'Admin',
    employee: 'Employee',
    candidate: 'Candidate'
  }[profile?.role] || '';

  const homePath = user ? '/dashboard' : '/';

  return (
    <header className="metsafe-navbar">
      <div className="nav-container">
        <Link
          to={homePath}
          className="nav-logo"
          onClick={handleCloseMenus}
        >
          <img
            src={logo}
            alt="METSAFE Logo"
            className="nav-logo-img"
          />
        </Link>

        {user && !loading && (
          <button
            type="button"
            className="mobile-icon"
            onClick={() => {
              if (isSidebarOpen) {
                onCloseSidebar();
              } else {
                onOpenSidebar();
              }
            }}
            aria-label={
              isSidebarOpen ? 'Close menu' : 'Open menu'
            }
            aria-expanded={isSidebarOpen}
            aria-controls="metsafe-sidebar"
          >
            {isSidebarOpen ? (
              <X size={26} />
            ) : (
              <Menu size={26} />
            )}
          </button>
        )}

        <div className="nav-right-group">
          <div className="lang-dropdown-container">
            <button
              type="button"
              className="lang-dropdown-btn"
              onClick={() => setIsLangOpen((value) => !value)}
              aria-label="Select language"
              aria-expanded={isLangOpen}
            >
              <span>
                {
                  languages.find(
                    (language) => language.code === currentLang
                  )?.flag
                }
              </span>

              <span
                className={`arrow ${
                  isLangOpen ? 'rotate' : ''
                }`}
              >
                <ChevronDown size={16} />
              </span>
            </button>

            {isLangOpen && (
              <div className="lang-dropdown-menu">
                {languages.map((language) => (
                  <button
                    type="button"
                    key={language.code}
                    className={`lang-option ${
                      currentLang === language.code
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() =>
                      handleLanguageChange(language.code)
                    }
                  >
                    <span>{language.flag}</span>
                    <span>{language.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="auth-loading">
              Loading...
            </div>
          ) : user ? (
            <div className="user-profile-group">
              <Link
                to="/dashboard/profile"
                className="user-info user-info-link"
                onClick={handleCloseMenus}
              >
                <UserCircle
                  size={22}
                  className="user-avatar"
                />

                <div className="user-text-wrapper">
                  <span className="username-text">
                    {displayName}
                  </span>

                  {roleLabel && (
                    <small className="user-role-text">
                      {roleLabel}
                    </small>
                  )}
                </div>
              </Link>

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
                aria-label="Logout"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="login-btn"
              onClick={openLoginModal}
            >
              <UserCircle size={20} />

              <span>
                {t?.nav?.login || 'Login / Signup'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;