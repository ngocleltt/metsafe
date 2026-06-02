import React from 'react';
import './styles/Footer.css';
import logo from '../assets/logo.png';

const Footer = ({ t }) => {
  const footer = t?.footer || {};

  return (
    <footer className="metsafe-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo-wrapper">
            <img src={logo} alt="METSAFE Logo" className="footer-logo-img" />
            <br />
            <p className="footer-description">{footer.description}</p>
          </div>
        </div>

        <div className="footer-links">
          <h4>{footer.quickLinks}</h4>
          <ul>
            <li><a href="/about">{footer.about}</a></li>
            <li><a href="/assessment">{footer.assessment}</a></li>
            <li><a href="/contact">{footer.contact}</a></li>
          </ul>
        </div>

        <div className="footer-support">
          <h4>{footer.support}</h4>
          <ul>
            <li><a href="/faq">{footer.faq}</a></li>
            <li><a href="/privacy">{footer.privacy}</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} {footer.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;