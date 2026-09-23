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
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!user || !profile?.role) {
    return null;
  }

  const commonItems = [
    {
      key: 'home',
      path: '/dashboard',
      label: t?.nav?.home || 'Home',
      icon: LayoutDashboard
    },
    {
      key: 'profile',
      path: '/dashboard/profile',
      label: t?.nav?.profile || 'Profile',
      icon: UserRound
    }
  ];

  const roleItems = {
    admin: [
      {
        key: 'dashboard',
        path: '/dashboard/admin',
        label: t?.nav?.dashboard || 'Dashboard',
        icon: LayoutDashboard
      },
      {
        key: 'assessments',
        path: '/dashboard/assessment',
        label: t?.nav?.assessment || 'Assessments',
        icon: BarChart3
      },
      {
        key: 'employees',
        path: '/dashboard/admin/employees',
        label: t?.nav?.employees || 'Employees',
        icon: Users
      },
      {
        key: 'candidates',
        path: '/dashboard/admin/candidates',
        label: t?.nav?.candidates || 'Candidates',
        icon: UserRoundSearch
      }
    ],

    employee: [
      {
        key: 'dashboard',
        path: '/dashboard/employee',
        label: t?.nav?.myDashboard || 'My Dashboard',
        icon: LayoutDashboard
      },
      {
        key: 'competence',
        path: '/dashboard/employee/competence',
        label: t?.nav?.myCompetence || 'My Competence',
        icon: Award
      },
      {
        key: 'tests',
        path: '/dashboard/employee/tests',
        label: t?.nav?.myTests || 'My Tests',
        icon: ClipboardCheck
      },
      {
        key: 'training',
        path: '/dashboard/employee/training',
        label: t?.nav?.training || 'Training',
        icon: BookOpen
      }
    ],

    candidate: [
      {
        key: 'dashboard',
        path: '/dashboard/candidate',
        label: t?.nav?.myDashboard || 'My Dashboard',
        icon: LayoutDashboard
      },
      {
        key: 'application',
        path: '/dashboard/candidate/application',
        label: t?.nav?.myApplication || 'My Application',
        icon: FileText
      },
      {
        key: 'tests',
        path: '/dashboard/candidate/tests',
        label: t?.nav?.myTests || 'My Tests',
        icon: ClipboardCheck
      },
      {
        key: 'results',
        path: '/dashboard/candidate/results',
        label: t?.nav?.myResults || 'My Results',
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
          aria-label="Close navigation"
        />
      )}

      <aside
        id="metsafe-sidebar"
        className={`metsafe-sidebar ${
          isOpen ? 'is-open' : ''
        }`}
        aria-label="Main navigation"
      >
        <div className="sidebar-header">
          <NavLink
            to="/dashboard"
            className="sidebar-logo"
            onClick={onClose}
            aria-label="Go to dashboard"
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
            aria-label="Close navigation"
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
                    end={
                      item.path === '/dashboard'
                    }
                    className={({ isActive }) =>
                      `sidebar-item ${
                        isActive ? 'active' : ''
                      }`
                    }
                    onClick={onClose}
                  >
                    <Icon size={19} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <UserRound size={16} />
          <span>{role}</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;