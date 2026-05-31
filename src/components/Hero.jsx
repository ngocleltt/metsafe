import React from 'react';
import './styles/Hero.css';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.jpg';

const Hero = ({ t }) => {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    navigate('/assessment');
  };

  const handleLearnMore = () => {
    const newsSection = document.getElementById('news');
    if (newsSection) {
      newsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="metsafe-hero">
      <div className="hero-container">
        <div className="hero-text">
          <span className="hero-tag">Safety First • Innovation Always</span>
          <h1>{t?.hero?.title || 'METSAFE'}</h1>
          <p>{t?.hero?.subtitle || 'Digital model application for safety optimization and labor accident reduction'}</p>
          <br />
          <div className="hero-btns">
            <button className="cta-button primary" onClick={handleStartAssessment}>
              {t?.hero?.cta || 'Start Assessment'}
            </button>
            <button className="cta-button secondary" onClick={handleLearnMore}>
              {t?.hero?.learnMore || 'Learn More'}
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="abstract-shape-1"></div>
          <img 
            src={heroImg}
            alt="Metallurgy Industry" 
            className="hero-img"
          />
        </div>
      </div>
    </header>
  );
};

export default Hero;