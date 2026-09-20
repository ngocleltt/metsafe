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
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const translations = { en, vi, ru };
  const t = translations[currentLang];

  return (
    <Router>
      <div className="metsafe-app">
        <Navbar
          t={t}
          currentLang={currentLang}
          changeLanguage={setCurrentLang}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        <Sidebar
          t={t}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="metsafe-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero t={t} />

                  <section className="metsafe-main">
                    <AboutProject t={t} />
                    <News t={t} />
                  </section>
                </>
              }
            />

            <Route
              path="/assessment"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Assessment t={t} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <div className="placeholder-page">
                    Admin Dashboard coming soon...
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/employee"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <div className="placeholder-page">
                    Employee Dashboard coming soon...
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/candidate"
              element={
                <ProtectedRoute allowedRoles={['candidate']}>
                  <div className="placeholder-page">
                    Candidate Dashboard coming soon...
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer t={t} />
      </div>
    </Router>
  );
}

export default App;