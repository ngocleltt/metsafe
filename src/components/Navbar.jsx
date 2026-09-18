import React, { useState } from 'react';
import './styles/Navbar.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  BarChart3,
  Newspaper,
  Menu,
  X,
  UserCircle,
  ChevronDown,
  LogOut
} from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import './styles/theme.css';

const Navbar = ({ t, currentLang, changeLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const { user, profile, logout, loading } = useAuth();

  const languages = [
    { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
    { code: 'en', flag: '🇺🇸', label: 'English' },
    { code: 'ru', flag: '🇷🇺', label: 'Русский' }
  ];

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsLangOpen(false);
    setIsMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
    setIsLangOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const openLoginModal = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
    setIsMenuOpen(false);
  };

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    'User';

  return (
    <nav className="metsafe-navbar">
      <div className="nav-container">
        <Link
          to="/"
          className="nav-logo"
          style={{ textDecoration: 'none' }}
          onClick={handleNavClick}
        >
          <img
            src={logo}
            alt="METSAFE Logo"
            className="nav-logo-img"
          />
        </Link>

        <button
          type="button"
          className="mobile-icon"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div
          className={`nav-menu-wrapper ${
            isMenuOpen ? 'active' : ''
          }`}
        >
          <ul className="nav-links">
            <li>
              <Link
                to="/"
                className="nav-item"
                onClick={handleNavClick}
              >
                <Newspaper size={18} />
                <span>{t?.nav?.home || 'Home'}</span>
              </Link>
            </li>

            <li>
              <Link
                to="/assessment"
                className="nav-item"
                onClick={handleNavClick}
              >
                <BarChart3 size={18} />
                <span>
                  {t?.nav?.assessment || 'CI Assessment'}
                </span>
              </Link>
            </li>
          </ul>

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
                <span>Loading...</span>
              </div>
            ) : user ? (
              <div className="user-profile-group">
                <div className="user-info">
                  <UserCircle
                    size={22}
                    className="user-avatar"
                  />

                  <div className="user-text-wrapper">
                    <span className="username-text">
                      {displayName}
                    </span>

                    {profile?.role && (
                      <small className="user-role-text">
                        {profile.role}
                      </small>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="logout-btn"
                  onClick={handleLogout}
                  title="Logout"
                  aria-label="Logout"
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
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        authMode={authMode}
        setAuthMode={setAuthMode}
        t={t}
      />
    </nav>
  );
};

export default Navbar;