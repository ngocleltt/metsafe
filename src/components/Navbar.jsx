import React, { useState } from 'react';
import './styles/Navbar.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import { BarChart3, Newspaper, Menu, X, UserCircle, ChevronDown, Lock, Mail, Eye, EyeOff, LogOut } from 'lucide-react';

const Navbar = ({ t, currentLang, changeLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('An Bình');

  const languages = [
    { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
    { code: 'en', flag: '🇺🇸', label: 'English' },
    { code: 'ru', flag: '🇷🇺', label: 'Русский' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <nav className="metsafe-navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
          <img src={logo} alt="METSAFE Logo" className="nav-logo-img" />
        </Link>

        <div className="mobile-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        <div className={`nav-menu-wrapper ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-item">
                <Newspaper size={18} />
                <span>{t?.nav?.home || 'Home'}</span>
              </Link>
            </li>
            <li>
              <Link to="/assessment" className="nav-item">
                <BarChart3 size={18} />
                <span>{t?.nav?.assessment || 'CI Assessment'}</span>
              </Link>
            </li>
          </ul>

          <div className="nav-right-group">
            <div className="lang-dropdown-container">
              <button className="lang-dropdown-btn" onClick={() => setIsLangOpen(!isLangOpen)}>
                <span>{languages.find(l => l.code === currentLang)?.flag}</span>
                <span className={`arrow ${isLangOpen ? 'rotate' : ''}`}>
                  <ChevronDown size={16} />
                </span>
              </button>

              {isLangOpen && (
                <div className="lang-dropdown-menu">
                  {languages.map((lang) => (
                    <div 
                      key={lang.code}
                      className={`lang-option ${currentLang === lang.code ? 'selected' : ''}`}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="user-profile-group">
                <div className="user-info">
                  <UserCircle size={22} className="user-avatar" />
                  <span className="username-text">{username}</span>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button className="login-btn" onClick={() => { setIsAuthOpen(true); setAuthMode('login'); }}>
                <UserCircle size={20} />
                <span>{t?.nav?.login || 'Login / Signup'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isAuthOpen && (
        <div className="auth-overlay" onClick={() => setIsAuthOpen(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button className="auth-close" onClick={() => setIsAuthOpen(false)}>
              <X size={24} />
            </button>
            
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${authMode === 'login' ? 'active' : ''}`} 
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </button>
              <button 
                className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`} 
                onClick={() => setAuthMode('signup')}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {authMode === 'signup' && (
                <div className="input-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <UserCircle className="input-icon" size={18} />
                    <input type="text" placeholder="Huynh Tran An Binh" required />
                  </div>
                </div>
              )}

              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input type="email" placeholder="name@misis.ru" required />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    required 
                  />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {authMode === 'login' && (
                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#forgot" className="forgot-link">Forgot password?</a>
                </div>
              )}

              <button type="submit" className="auth-submit-btn">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;