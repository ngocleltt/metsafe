import React from 'react';
import AboutProject from '../components/AboutProject';
import News from '../components/News';

const Dashboard = ({ t }) => {
  return (
    <div className="dashboard-page">
      <section className="metsafe-main">
        <AboutProject t={t} />
        <News t={t} />
      </section>
    </div>
  );
};

export default Dashboard;