import React, { useState } from 'react';
import { Shield, BarChart3, Newspaper, Menu, X, UserCircle, ChevronDown } from 'lucide-react';

const Navbar = ({ t, currentLang, changeLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
    { code: 'en', flag: '🇺🇸', label: 'English' },
    { code: 'ru', flag: '🇷🇺', label: 'Русский' }
  ];

  const currentFlag = languages.find(l => l.code === currentLang)?.flag;

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

          <div className="nav-right-group">
            <div className="lang-dropdown-container">
              <button 
                className="lang-dropdown-btn" 
                onClick={() => setIsLangOpen(!isLangOpen)}
              >
                <span className="current-flag">{currentFlag}</span>
                <ChevronDown size={14} className={`arrow ${isLangOpen ? 'rotate' : ''}`} />
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

            <button className="login-btn">
              <UserCircle size={20} />
              <span>{t.nav.login}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;