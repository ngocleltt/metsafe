import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Assessment from './components/Assessment';
import Profile from './components/Profile';

import WelcomeLayout from './layouts/WelcomeLayout';
import DashboardLayout from './layouts/DashboardLayout';

import WelcomePage from './pages/WelcomePage';
import Dashboard from './pages/Dashboard';

import AdminEmployees from './pages/admin/AdminEmployees';
import AdminCandidates from './pages/admin/AdminCandidates';
import AdminDashboard from './pages/admin/AdminDashboard';

import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateApplication from './pages/candidate/CandidateApplication';

import { en } from './locales/en';
import { vi } from './locales/vi';
import { ru } from './locales/ru';

import { useAuth } from './context/AuthContext';

import './App.css';

const AdminPage = ({ t }) => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <h1>Admin Dashboard</h1>
      <p>
        Welcome to the METSAFE administration area.
      </p>

      <button
        type="button"
        onClick={() => navigate('/dashboard/assessment')}
      >
        Open Assessment Management
      </button>
    </div>
  );
};

const EmployeePage = () => {
  return (
    <div className="dashboard-page">
      <h1>Employee Dashboard</h1>
      <p>
        Personal competence and safety workspace coming soon.
      </p>
    </div>
  );
};

const CandidatePage = () => {
  return (
    <div className="dashboard-page">
      <h1>Candidate Dashboard</h1>
      <p>
        Recruitment and testing workspace coming soon.
      </p>
    </div>
  );
};

const AppRoutes = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const { user } = useAuth();

  const translations = { en, vi, ru };
  const t = translations[currentLang];

  return (
    <Routes>
      <Route
        element={
          <WelcomeLayout
            t={t}
            currentLang={currentLang}
            changeLanguage={setCurrentLang}
          />
        }
      >
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <WelcomePage t={t} />
            )
          }
        />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout
              t={t}
              currentLang={currentLang}
              changeLanguage={setCurrentLang}
            />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={<Dashboard t={t} />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard/>
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/employees"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/candidates"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCandidates />
            </ProtectedRoute>
          }
        />

        <Route
          path="assessment"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Assessment t={t} />
            </ProtectedRoute>
          }
        />

        <Route
          path="employee"
          element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="candidate"
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <CandidateDashboard  />
            </ProtectedRoute>
          }
        />
        <Route
          path="candidate/application"
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <CandidateApplication />
            </ProtectedRoute>
          }
        />
        
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={user ? '/dashboard' : '/'}
            replace
          />
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;