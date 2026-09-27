import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';

const WelcomeLayout = ({
  t,
  currentLang,
  changeLanguage
}) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const openLoginModal = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
  };

  return (
    <div className="metsafe-app app-public is-welcome-page">
      <Navbar
        t={t}
        currentLang={currentLang}
        changeLanguage={changeLanguage}
        openLoginModal={openLoginModal}
      />

      <main className="metsafe-content">
        <Outlet context={{ openLoginModal }} />
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        authMode={authMode}
        setAuthMode={setAuthMode}
        t={t}
      />
    </div>
  );
};

export default WelcomeLayout;