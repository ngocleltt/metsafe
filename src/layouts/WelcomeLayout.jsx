import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../components/Navbar';

const WelcomeLayout = ({
  t,
  currentLang,
  changeLanguage
}) => {
  return (
    <div className="metsafe-app app-public is-welcome-page">
      <Navbar
        t={t}
        currentLang={currentLang}
        changeLanguage={changeLanguage}
      />

      <main className="metsafe-content">
        <Outlet />
      </main>
    </div>
  );
};

export default WelcomeLayout;