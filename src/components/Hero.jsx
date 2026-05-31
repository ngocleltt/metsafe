import React from 'react';
import './styles/Hero.css';
import heroImg from '../assets/hero.jpg';

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
            src= {heroImg}
            alt="Metallurgy" 
            className="hero-img"
          />
        </div>
      </div>
    </header>
  );
};

export default Hero;