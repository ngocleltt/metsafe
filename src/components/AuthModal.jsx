import React, { useState } from 'react';
import './styles/AuthModal.css';
import './styles/theme.css';
import { X, UserCircle, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AuthModal = ({
  isOpen,
  onClose,
  authMode,
  setAuthMode,
  t
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const authText = t?.auth || {};

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (authMode === 'login') {
        const { error: loginError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password
          });

        if (loginError) {
          throw loginError;
        }

        onClose();
        return;
      }

      const { data, error: signupError } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim()
            }
          }
        });

      if (signupError) {
        throw signupError;
      }

      if (data.user && !data.session) {
        setSuccess(
          'Registration successful. Please check your email to confirm the account.'
        );
      } else {
        setSuccess('Registration successful.');
      }
    } catch (submitError) {
      console.error('Authentication error:', submitError);
      setError(submitError.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div
        className="auth-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="auth-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${
              authMode === 'login' ? 'active' : ''
            }`}
            onClick={() => {
              setAuthMode('login');
              setError('');
              setSuccess('');
            }}
          >
            {authText.signIn || 'Sign In'}
          </button>

          <button
            type="button"
            className={`auth-tab ${
              authMode === 'signup' ? 'active' : ''
            }`}
            onClick={() => {
              setAuthMode('signup');
              setError('');
              setSuccess('');
            }}
          >
            {authText.register || 'Register'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {authMode === 'signup' && (
            <div className="input-group">
              <label>{authText.fullName || 'Full Name'}</label>

              <div className="input-wrapper">
                <UserCircle className="input-icon" size={18} />

                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>{authText.emailAddress || 'Email Address'}</label>

            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>{authText.password || 'Password'}</label>

            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete={
                  authMode === 'login'
                    ? 'current-password'
                    : 'new-password'
                }
                minLength={6}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label="Toggle password visibility"
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
              : authMode === 'login'
                ? authText.signIn || 'Sign In'
                : authText.createAccount || 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;