import React from 'react';
import Hero from '../components/Hero';

const WelcomePage = ({ t }) => {
  return (
    <div className="welcome-page">
      <Hero t={t} />
    </div>
  );
};

export default WelcomePage;