import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.jpg';

import './styles/Hero.css';
import './styles/theme.css';

const Hero = ({ t, onStartAssessment}) => {

  const handleLearnMore = () => {
    document.getElementById('about')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <header className="metsafe-hero">
      <div className="hero-shell">
        <div className="hero-editorial-grid">
          <div className="hero-panel hero-copy-panel">
            <div className="hero-copy-panel__glow" aria-hidden="true" />

            <span className="hero-tag hero-reveal hero-delay-1">
              {t?.aboutProject?.tag}
            </span>

            <h1 className="hero-reveal hero-delay-2">
              {t?.hero?.title}
            </h1>

            <p className="hero-subtitle hero-reveal hero-delay-3">
              {t?.hero?.subtitle}
            </p>

            <div className="hero-btns hero-reveal hero-delay-4">
              <button
                type="button"
                className="cta-button primary"
                onClick={onStartAssessment}
              >
                {t?.hero?.cta}
                <span className="hero-button-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>

              <button
                type="button"
                className="cta-button secondary"
                onClick={handleLearnMore}
              >
                {t?.hero?.learnMore}
                <span className="hero-button-arrow" aria-hidden="true">
                  ↓
                </span>
              </button>
            </div>

            <div className="hero-copy-footer hero-reveal hero-delay-5" aria-hidden="true">
              <span className="hero-copy-footer__dot" />
              <span className="hero-copy-footer__line" />
              <span>METSAFE</span>
            </div>
          </div>

          <div className="hero-panel hero-image-panel hero-reveal hero-delay-3">
            <img
              src={heroImg}
              alt={t?.aboutProject?.imageAlt || ''}
              className="hero-img"
            />

            <div className="hero-image-panel__shade" aria-hidden="true" />
            <div className="hero-image-panel__scan" aria-hidden="true" />

            <div className="hero-image-panel__rings" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <div className="hero-image-panel__corner hero-image-panel__corner--tl" aria-hidden="true" />
            <div className="hero-image-panel__corner hero-image-panel__corner--tr" aria-hidden="true" />
            <div className="hero-image-panel__corner hero-image-panel__corner--bl" aria-hidden="true" />
            <div className="hero-image-panel__corner hero-image-panel__corner--br" aria-hidden="true" />

            <div className="hero-image-caption" aria-hidden="true">
              <span className="hero-image-caption__mark" />
              <span>METSAFE</span>
              <span className="hero-image-caption__line" />
              <span>01 / 02</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;