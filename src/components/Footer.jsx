import React from 'react';
import './styles/Footer.css';
import logo from '../assets/logo.png';
import { en } from '../locales/en.js'; 

const Footer = () => {
  const t = en.footer; 

  return (
    <footer className="metsafe-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo-wrapper">
            <img src={logo} alt="METSAFE Logo" className="footer-logo-img" />
            <br></br>
            <p className="footer-description">{t.description}</p>
          </div>
          
        </div>

        <div className="footer-links">
          <h4>{t.quickLinks}</h4>
          <ul>
            <li><a href="/about">{t.about}</a></li>
            <li><a href="/assessment">{t.assessment}</a></li>
            <li><a href="/contact">{t.contact}</a></li>
          </ul>
        </div>
        

        <div className="footer-support">
          <h4>{t.support}</h4>
          <ul>
            <li><a href="/faq">{t.faq}</a></li>
            <li><a href="/privacy">{t.privacy}</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {t.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;