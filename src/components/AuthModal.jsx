import React from 'react';
import { X, UserCircle, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const AuthModal = ({ 
  isOpen, 
  onClose, 
  authMode, 
  setAuthMode, 
  showPassword, 
  setShowPassword, 
  onSubmit,
  t
}) => {
  if (!isOpen) return null;

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${authMode === 'login' ? 'active' : ''}`} 
            onClick={() => setAuthMode('login')}
          >
            {t?.auth?.signIn || 'Sign In'}
          </button>
          <button 
            className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`} 
            onClick={() => setAuthMode('signup')}
          >
            {t?.auth?.register || 'Register'}
          </button>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          {authMode === 'signup' && (
            <div className="input-group">
              <label>{t?.auth?.fullName || 'Full Name'}</label>
              <div className="input-wrapper">
                <UserCircle className="input-icon" size={18} />
                <input type="text" placeholder="Huynh Tran An Binh" required />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>{t?.auth?.emailAddress || 'Email Address'}</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input type="email" placeholder="name@misis.ru" required />
            </div>
          </div>

          <div className="input-group">
            <label>{t?.auth?.password || 'Password'}</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {authMode === 'login' && (
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>{t?.auth?.rememberMe || 'Remember me'}</span>
              </label>
              <a href="#forgot" className="forgot-link">{t?.auth?.forgotPassword || 'Forgot password?'}</a>
            </div>
          )}

          <button type="submit" className="auth-submit-btn">
            {authMode === 'login' ? (t?.auth?.signIn || 'Sign In') : (t?.auth?.createAccount || 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;