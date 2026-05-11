import React, { useState } from 'react';
import { Shield, BarChart3, CloudSun, Newspaper, Menu, X } from 'lucide-react';

const Navbar = ({ t }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <a href="#news" className="nav-item">
              <Newspaper size={20} />
              <span>{t.nav.home}</span>
            </a>
          </li>
          <li>
            <a href="#assessment" className="nav-item active-link">
              <BarChart3 size={20} />
              <span>{t.nav.assessment}</span>
            </a>
          </li>
          <li>
            <a href="#weather" className="nav-item">
              <CloudSun size={20} />
              <span>{t.nav.weather}</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;