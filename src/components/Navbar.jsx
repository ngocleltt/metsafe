import React, { useState } from 'react';
import { Shield, BarChart3, Newspaper, Menu, X, Globe, UserCircle } from 'lucide-react';

const Navbar = ({ t, currentLang, changeLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const languages = [
    { code: 'vi', label: 'VN', flag: '🇻🇳' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'ru', label: 'RU', flag: '🇷🇺' }
  ];

  return (
    <nav className="metsafe-navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Shield size={32} color="#2e7d32" strokeWidth={2.5} />
          <span className="logo-text">METSAFE</span>
        </div>

        <div className="mobile-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        <div className={`nav-menu-wrapper ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li>
              <a href="#news" className="nav-item">
                <Newspaper size={18} />
                <span>{t.nav.home}</span>
              </a>
            </li>
            <li>
              <a href="#assessment" className="nav-item">
                <BarChart3 size={18} />
                <span>{t.nav.assessment}</span>
              </a>
            </li>
          </ul>

          <div className="nav-actions">
            <div className="lang-switcher">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-btn ${currentLang === lang.code ? 'active' : ''}`}
                  onClick={() => changeLanguage(lang.code)}
                  title={lang.label}
                >
                  <span className="flag-icon">{lang.flag}</span>
                </button>
              ))}
            </div>

            <button className="login-btn">
              <UserCircle size={20} />
              <span>Login / Signup</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;