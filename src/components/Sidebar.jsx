import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

import {
  LayoutDashboard,
  BarChart3,
  Users,
  UserRoundSearch,
  Award,
  ClipboardCheck,
  BookOpen,
  FileText,
  UserRound,
  X
} from 'lucide-react';

import './styles/Sidebar.css';

const Sidebar = ({ t, isOpen, onClose }) => {
  const { user, profile } = useAuth();

  const role = user ? profile?.role : null;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!user || !role) {
    return null;
  }

  const commonItems = [
    {
      key: 'home',
      path: '/dashboard',
      label: t.sidebar.home,
      icon: LayoutDashboard
    },
    {
      key: 'profile',
      path: '/dashboard/profile',
      label: t.sidebar.profile,
      icon: UserRound
    }
  ];

  const roleItems = {
    admin: [
      {
        key: 'dashboard',
        path: '/dashboard/admin',
        label: t.sidebar.dashboard,
        icon: LayoutDashboard
      },
      {
        key: 'assessments',
        path: '/dashboard/assessment',
        label: t.sidebar.assessments,
        icon: BarChart3
      },
      {
        key: 'employees',
        path: '/dashboard/admin/employees',
        label: t.sidebar.employees,
        icon: Users
      },
      {
        key: 'candidates',
        path: '/dashboard/admin/candidates',
        label: t.sidebar.candidates,
        icon: UserRoundSearch
      }
    ],

    employee: [
      {
        key: 'dashboard',
        path: '/dashboard/employee',
        label: t.sidebar.myDashboard,
        icon: LayoutDashboard
      },
      {
        key: 'competence',
        path: '/dashboard/employee/competence',
        label: t.sidebar.myCompetence,
        icon: Award
      },
      {
        key: 'tests',
        path: '/dashboard/employee/tests',
        label: t.sidebar.myTests,
        icon: ClipboardCheck
      },
      {
        key: 'training',
        path: '/dashboard/employee/training',
        label: t.sidebar.training,
        icon: BookOpen
      }
    ],

    candidate: [
      {
        key: 'dashboard',
        path: '/dashboard/candidate',
        label: t.sidebar.myDashboard,
        icon: LayoutDashboard
      },
      {
        key: 'application',
        path: '/dashboard/candidate/application',
        label: t.sidebar.myApplication,
        icon: FileText
      },
      {
        key: 'tests',
        path: '/dashboard/candidate/tests',
        label: t.sidebar.myTests,
        icon: ClipboardCheck
      },
      {
        key: 'results',
        path: '/dashboard/candidate/results',
        label: t.sidebar.myResults,
        icon: Award
      }
    ]
  };

  const visibleItems = [
    ...commonItems,
    ...(roleItems[role] || [])
  ];

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onClose}
          aria-label={t.sidebar.closeNavigation}
        />
      )}

      <aside
        id="metsafe-sidebar"
        className={`metsafe-sidebar ${isOpen ? 'is-open' : ''}`}
        aria-label={t.sidebar.mainNavigation}
      >
        <div className="sidebar-header">
          <NavLink
            to="/dashboard"
            className="sidebar-logo"
            onClick={onClose}
            aria-label={t.sidebar.goToDashboard}
          >
            <img
              src={logo}
              alt="METSAFE Logo"
              className="sidebar-logo-img"
            />
          </NavLink>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label={t.sidebar.closeNavigation}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-list">
            {visibleItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.key}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/dashboard'}
                    className={({ isActive }) =>
                      `sidebar-item ${isActive ? 'active' : ''}`
                    }
                    onClick={onClose}
                  >
                    <Icon size={19} aria-hidden="true" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <UserRound size={16} aria-hidden="true" />
          <span>{t.sidebar.roles[role] || role}</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;