import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Shield, BarChart3 } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero'; 
import Footer from './components/Footer';
import Assessment from './components/Assessment';
import { en } from './locales/en';
import { vi } from './locales/vi'; 
import { ru } from './locales/ru'; 
import './App.css';

function App() {
  const [currentLang, setCurrentLang] = useState('en');
  
  const translations = { en, vi, ru };
  const t = translations[currentLang];

  return (
    <Router>
      <div className="metsafe-app">
        <Navbar 
          t={t} 
          currentLang={currentLang} 
          changeLanguage={setCurrentLang} 
        />

        <Routes>
          <Route path="/" element={
            <>
              {}
              <Hero t={t} /> 

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
            </>
          } />

          <Route path="/assessment" element={<Assessment t={t} />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;