import React from 'react';
import logo from '../assets/logo.png';

import './styles/Footer.css';

const Footer = ({ t }) => {
  const footer = t?.footer || {};

  return (
    <footer className="metsafe-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img
            src={logo}
            alt=""
            className="footer-logo-img"
            aria-hidden="true"
          />

          <div className="footer-brand-copy">
            <p>{footer.description}</p>
          </div>
        </div>

        <div className="footer-meta">
          <span className="footer-meta-line" aria-hidden="true" />
          <p>
            © {new Date().getFullYear()} {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;