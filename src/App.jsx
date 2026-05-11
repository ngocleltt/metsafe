import React, { useState } from 'react';
import { Shield, BarChart3 } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { en } from './locales/en';
import { vi } from './locales/vi'; 
import { ru } from './locales/ru'; 
import './App.css';

function App() {
  const [currentLang, setCurrentLang] = useState('en');
  
  const translations = { en, vi, ru };
  const t = translations[currentLang];

  return (
    <div className="metsafe-app">
      <Navbar 
        t={t} 
        currentLang={currentLang} 
        changeLanguage={setCurrentLang} 
      />

      <header className="metsafe-hero">
        <div className="hero-container">
          <div className="hero-text">
            <span className="hero-tag">Safety First • Innovation Always</span>
            <h1>{t.hero.title}</h1>
            <p>{t.hero.subtitle}</p>
            <br></br>
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

      <main className="metsafe-main">
        <section id="news" className="section-container">
          <div className="section-header">
            <h2>{t.news.title}</h2>
            <div className="header-line"></div>
          </div>
          
          <div className="news-grid">
            <div className="news-card">
              <div className="card-icon-wrapper">
                <Shield size={32} color="#f7941d" />
              </div>
              <h3>{t.news.card1.title}</h3>
              <p>{t.news.card1.desc}</p>
            </div>

            <div className="news-card">
              <div className="card-icon-wrapper">
                <BarChart3 size={32} color="#f7941d" />
              </div>
              <h3>{t.news.card2.title}</h3>
              <p>{t.news.card2.desc}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;