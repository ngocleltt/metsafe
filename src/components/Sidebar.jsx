import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

  const role = user ? profile?.role : 'guest';

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const commonItems = [
    {
      key: 'home',
      path: '/',
      label: t?.nav?.home || 'Home',
      icon: LayoutDashboard,
      roles: ['guest', 'admin', 'employee', 'candidate']
    }
  ];

  const roleItems = {
    admin: [
      {
        key: 'dashboard',
        path: '/admin',
        label: t?.nav?.dashboard || 'Dashboard',
        icon: LayoutDashboard
      },
      {
        key: 'assessments',
        path: '/assessment',
        label: t?.nav?.assessment || 'Assessments',
        icon: BarChart3
      },
      {
        key: 'employees',
        path: '/admin/employees',
        label: t?.nav?.employees || 'Employees',
        icon: Users
      },
      {
        key: 'candidates',
        path: '/admin/candidates',
        label: t?.nav?.candidates || 'Candidates',
        icon: UserRoundSearch
      }
    ],
    employee: [
      {
        key: 'dashboard',
        path: '/employee',
        label: t?.nav?.myDashboard || 'My Dashboard',
        icon: LayoutDashboard
      },
      {
        key: 'competence',
        path: '/employee/competence',
        label: t?.nav?.myCompetence || 'My Competence',
        icon: Award
      },
      {
        key: 'tests',
        path: '/employee/tests',
        label: t?.nav?.myTests || 'My Tests',
        icon: ClipboardCheck
      },
      {
        key: 'training',
        path: '/employee/training',
        label: t?.nav?.training || 'Training',
        icon: BookOpen
      }
    ],
    candidate: [
      {
        key: 'dashboard',
        path: '/candidate',
        label: t?.nav?.myDashboard || 'My Dashboard',
        icon: LayoutDashboard
      },
      {
        key: 'application',
        path: '/candidate/application',
        label: t?.nav?.myApplication || 'My Application',
        icon: FileText
      },
      {
        key: 'tests',
        path: '/candidate/tests',
        label: t?.nav?.recruitmentTests || 'Recruitment Tests',
        icon: ClipboardCheck
      },
      {
        key: 'results',
        path: '/candidate/results',
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
          <span className="sidebar-title">
            METSAFE
          </span>

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
                    end={item.path === '/'}
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
          <span>
            {role === 'guest'
              ? 'Public area'
              : profile?.role}
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;