import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import News from './components/News';
import AboutProject from './components/AboutProject';
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
          <Route
            path="/"
            element={
              <>
                <Hero t={t} />
                <main className="metsafe-main">
                  <AboutProject t={t} />
                  <News t={t} />
                </main>
              </>
            }
          />

          <Route path="/assessment" element={<Assessment t={t} />} />
        </Routes>

        <Footer t={t} />
      </div>
    </Router>
  );
}

export default App;