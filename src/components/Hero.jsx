import React from 'react';
import './styles/Hero.css';

const Hero = ({ t }) => {
  return (
    <header className="metsafe-hero">
      <div className="hero-container">
        <div className="hero-text">
          <span className="hero-tag">Safety First • Innovation Always</span>
          <h1>{t.hero.title}</h1>
          <p>{t.hero.subtitle}</p>
          <br />
          <div className="hero-btns">
            <button className="cta-button primary">{t.hero.cta}</button>
            <button className="cta-button secondary">Learn More</button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="abstract-shape-1"></div>
          <img 
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000" 
            alt="Metallurgy" 
            className="hero-img"
          />
        </div>
      </div>
    </header>
  );
};

export default Hero;