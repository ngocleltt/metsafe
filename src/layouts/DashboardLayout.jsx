import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({
  t,
  currentLang,
  changeLanguage
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="protected-loading">
        Loading application...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="metsafe-app app-authenticated is-app-page">
      <Navbar
        t={t}
        currentLang={currentLang}
        changeLanguage={changeLanguage}
        isSidebarOpen={isSidebarOpen}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      <Sidebar
        t={t}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="metsafe-content">
        <Outlet />
      </main>

      <Footer t={t} />
    </div>
  );
};

export default DashboardLayout;