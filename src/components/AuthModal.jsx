import React, { useEffect, useState } from 'react';
import './styles/AuthModal.css';
import './styles/theme.css';
import {
  X,
  UserCircle,
  Lock,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const initialForm = {
  email: '',
  password: '',
  fullName: ''
};

const AuthModal = ({
  isOpen,
  onClose,
  authMode,
  setAuthMode,
  t
}) => {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const authText = t?.auth || {};
  const isLogin = authMode === 'login';

  useEffect(() => {
    if (!isOpen) return;

    setError('');
    setSuccess('');
    setShowPassword(false);
  }, [isOpen, authMode]);

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setShowPassword(false);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    if (submitting) return;

    resetForm();
    onClose();
  };

  const handleModeChange = (mode) => {
    if (submitting) return;

    setAuthMode(mode);
    setForm((currentForm) => ({
      ...currentForm,
      password: ''
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const fullName = form.fullName.trim();

    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (!isLogin && !fullName) {
      setError('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      if (isLogin) {
        const { error: loginError } =
          await supabase.auth.signInWithPassword({
            email,
            password
          });

        if (loginError) {
          throw loginError;
        }

        resetForm();
        onClose();
        return;
      }

      const { data, error: signupError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });

      if (signupError) {
        throw signupError;
      }

      if (!data?.user) {
        throw new Error('The account could not be created.');
      }

      if (data.session) {
        setForm(initialForm);
        setShowPassword(false);
        setError('');
        setSuccess('');
        onClose();
      } else {
        setForm(initialForm);
        setShowPassword(false);
        setSuccess(
          'Registration successful. Please check your email to confirm your account.'
        );
      }
    } catch (submitError) {
      console.error('Authentication error:', submitError);
      setError(
        submitError?.message ||
          'Authentication failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-overlay" onClick={handleClose}>
      <div
        className="auth-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          type="button"
          className="auth-close"
          onClick={handleClose}
          disabled={submitting}
          aria-label="Close authentication dialog"
        >
          <X size={24} />
        </button>

        <h2 id="auth-modal-title" className="auth-modal-title">
          {isLogin
            ? authText.signIn || 'Sign In'
            : authText.register || 'Register'}
        </h2>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={isLogin}
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => handleModeChange('login')}
            disabled={submitting}
          >
            {authText.signIn || 'Sign In'}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={!isLogin}
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => handleModeChange('signup')}
            disabled={submitting}
          >
            {authText.register || 'Register'}
          </button>
        </div>

        {!isLogin && (
          <p className="auth-helper-text">
            New accounts are created as candidate accounts and can be reviewed by an administrator.
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="auth-full-name">
                {authText.fullName || 'Full Name'}
              </label>

              <div className="input-wrapper">
                <UserCircle className="input-icon" size={18} />

                <input
                  id="auth-full-name"
                  type="text"
                  value={form.fullName}
                  onChange={(event) =>
                    updateField('fullName', event.target.value)
                  }
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                  disabled={submitting}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="auth-email">
              {authText.emailAddress || 'Email Address'}
            </label>

            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />

              <input
                id="auth-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField('email', event.target.value)
                }
                placeholder="name@example.com"
                autoComplete="email"
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="auth-password">
              {authText.password || 'Password'}
            </label>

            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />

              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) =>
                  updateField('password', event.target.value)
                }
                placeholder="••••••••"
                autoComplete={
                  isLogin ? 'current-password' : 'new-password'
                }
                minLength={6}
                disabled={submitting}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword((currentValue) => !currentValue)
                }
                disabled={submitting}
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="auth-success" role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={submitting}
          >
            {submitting
              ? 'Processing...'
              : isLogin
                ? authText.signIn || 'Sign In'
                : authText.createAccount || 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;