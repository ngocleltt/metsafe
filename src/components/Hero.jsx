import React from 'react';
import './styles/Hero.css';
import './styles/theme.css';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.jpg';

const Hero = ({ t }) => {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    navigate('/assessment');
  };

  const handleLearnMore = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="metsafe-hero">
      <div className="hero-shell">
        <div className="hero-editorial-grid">
          <div className="hero-panel hero-copy-panel">
            <span className="hero-tag hero-reveal hero-delay-1">
              {t?.hero?.tag || 'Safety First • Digital Insight'}
            </span>

            <h1 className="hero-reveal hero-delay-2">
              {t?.hero?.title || 'METSAFE'}
            </h1>

            <p className="hero-reveal hero-delay-3">
              {t?.hero?.subtitle ||
                'Digital model application for safety optimization and labor accident reduction in metallurgy'}
            </p>

            <div className="hero-btns hero-reveal hero-delay-4">
              <button className="cta-button primary" onClick={handleStartAssessment}>
                {t?.hero?.cta || 'Start Assessment'}
              </button>

              <button className="cta-button secondary" onClick={handleLearnMore}>
                {t?.hero?.learnMore || 'Learn More'}
              </button>
            </div>
          </div>

          <div className="hero-panel hero-image-panel hero-reveal hero-delay-3">
            <img
              src={heroImg}
              alt={t?.hero?.imageAlt || 'Metallurgy industry working environment'}
              className="hero-img"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;