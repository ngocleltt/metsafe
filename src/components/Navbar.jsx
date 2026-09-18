import React, { useMemo, useState } from 'react';
import './styles/Navbar.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  BarChart3,
  Newspaper,
  Menu,
  X,
  UserCircle,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Users,
  UserRoundSearch,
  ClipboardCheck,
  Award,
  FileText,
  UserRound,
  BookOpen
} from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import './styles/theme.css';

const Navbar = ({ t, currentLang, changeLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const { user, profile, logout, loading } = useAuth();

  const languages = [
    { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
    { code: 'en', flag: '🇺🇸', label: 'English' },
    { code: 'ru', flag: '🇷🇺', label: 'Русский' }
  ];

  const currentRole = user ? profile?.role || 'candidate' : 'guest';

  const menuItems = useMemo(() => {
    const commonItems = [
      {
        key: 'home',
        path: '/',
        label: t?.nav?.home || 'Home',
        icon: Newspaper,
        roles: ['guest', 'admin', 'employee', 'candidate']
      }
    ];

    const roleItems = {
      admin: [
        {
          key: 'admin-dashboard',
          path: '/admin',
          label: t?.nav?.dashboard || 'Dashboard',
          icon: LayoutDashboard
        },
        {
          key: 'admin-assessments',
          path: '/assessment',
          label: t?.nav?.assessment || 'Assessments',
          icon: BarChart3
        },
        {
          key: 'admin-employees',
          path: '/admin/employees',
          label: t?.nav?.employees || 'Employees',
          icon: Users
        },
        {
          key: 'admin-candidates',
          path: '/admin/candidates',
          label: t?.nav?.candidates || 'Candidates',
          icon: UserRoundSearch
        }
      ],
      employee: [
        {
          key: 'employee-dashboard',
          path: '/employee',
          label: t?.nav?.myDashboard || 'My Dashboard',
          icon: LayoutDashboard
        },
        {
          key: 'employee-competence',
          path: '/employee/competence',
          label: t?.nav?.myCompetence || 'My Competence',
          icon: Award
        },
        {
          key: 'employee-tests',
          path: '/employee/tests',
          label: t?.nav?.myTests || 'My Tests',
          icon: ClipboardCheck
        },
        {
          key: 'employee-training',
          path: '/employee/training',
          label: t?.nav?.training || 'Training',
          icon: BookOpen
        }
      ],
      candidate: [
        {
          key: 'candidate-dashboard',
          path: '/candidate',
          label: t?.nav?.myDashboard || 'My Dashboard',
          icon: LayoutDashboard
        },
        {
          key: 'candidate-application',
          path: '/candidate/application',
          label: t?.nav?.myApplication || 'My Application',
          icon: FileText
        },
        {
          key: 'candidate-tests',
          path: '/candidate/tests',
          label: t?.nav?.recruitmentTests || 'Recruitment Tests',
          icon: ClipboardCheck
        },
        {
          key: 'candidate-results',
          path: '/candidate/results',
          label: t?.nav?.myResults || 'My Results',
          icon: Award
        }
      ]
    };

    const selectedRoleItems = (roleItems[currentRole] || []).map(
      (item) => ({
        ...item,
        roles: [currentRole]
      })
    );

    return [...commonItems, ...selectedRoleItems];
  }, [currentRole, t]);

  const handleNavClick = () => {
    setIsMenuOpen(false);
    setIsLangOpen(false);
  };

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    handleNavClick();
  };

  const openLoginModal = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    handleNavClick();
  };

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    'User';

  const roleLabel = {
    admin: 'Admin',
    employee: 'Employee',
    candidate: 'Candidate',
    guest: 'Guest'
  }[currentRole];

  return (
    <nav className="metsafe-navbar">
      <div className="nav-container">
        <Link
          to="/"
          className="nav-logo"
          style={{ textDecoration: 'none' }}
          onClick={handleNavClick}
        >
          <img
            src={logo}
            alt="METSAFE Logo"
            className="nav-logo-img"
          />
        </Link>

        <button
          type="button"
          className="mobile-icon"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div
          className={`nav-menu-wrapper ${
            isMenuOpen ? 'active' : ''
          }`}
        >
          <ul className="nav-links">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.key}>
                  <Link
                    to={item.path}
                    className="nav-item"
                    onClick={handleNavClick}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="nav-right-group">
            <div className="lang-dropdown-container">
              <button
                type="button"
                className="lang-dropdown-btn"
                onClick={() => setIsLangOpen((value) => !value)}
                aria-label="Select language"
                aria-expanded={isLangOpen}
              >
                <span>
                  {
                    languages.find(
                      (language) => language.code === currentLang
                    )?.flag
                  }
                </span>

                <span
                  className={`arrow ${
                    isLangOpen ? 'rotate' : ''
                  }`}
                >
                  <ChevronDown size={16} />
                </span>
              </button>

              {isLangOpen && (
                <div className="lang-dropdown-menu">
                  {languages.map((language) => (
                    <button
                      type="button"
                      key={language.code}
                      className={`lang-option ${
                        currentLang === language.code
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        handleLanguageChange(language.code)
                      }
                    >
                      <span>{language.flag}</span>
                      <span>{language.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <div className="auth-loading">
                <span>Loading...</span>
              </div>
            ) : user ? (
              <div className="user-profile-group">
                <div className="user-info">
                  <UserCircle
                    size={22}
                    className="user-avatar"
                  />

                  <div className="user-text-wrapper">
                    <span className="username-text">
                      {displayName}
                    </span>

                    <small className="user-role-text">
                      {roleLabel || profile?.role || 'User'}
                    </small>
                  </div>
                </div>

                <button
                  type="button"
                  className="logout-btn"
                  onClick={handleLogout}
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="login-btn"
                onClick={openLoginModal}
              >
                <UserCircle size={20} />
                <span>
                  {t?.nav?.login || 'Login / Signup'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        authMode={authMode}
        setAuthMode={setAuthMode}
        t={t}
      />
    </nav>
  );
};

export default Navbar;