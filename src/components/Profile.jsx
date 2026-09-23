import React from 'react';
import { UserCircle, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './styles/Profile.css';

const Profile = () => {
  const { user, profile } = useAuth();

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    'User';

  const roleLabel = {
    admin: 'Administrator',
    employee: 'Employee',
    candidate: 'Candidate'
  }[profile?.role] || 'User';

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <UserCircle size={64} />
        </div>

        <div className="profile-heading">
          <p className="profile-eyebrow">
            User profile
          </p>

          <h1>{displayName}</h1>

          <span className="profile-role-badge">
            <ShieldCheck size={15} />
            {roleLabel}
          </span>
        </div>
      </div>

      <div className="profile-section">
        <div className="profile-section-heading">
          <h2>Account information</h2>
          <p>Your basic account details.</p>
        </div>

        <div className="profile-info-grid">
          <div className="profile-info-item">
            <span className="profile-info-label">
              Full name
            </span>
            <span className="profile-info-value">
              {displayName}
            </span>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label">
              Email address
            </span>
            <span className="profile-info-value">
              <Mail size={16} />
              {user?.email || profile?.email || 'Not available'}
            </span>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label">
              Account role
            </span>
            <span className="profile-info-value">
              {roleLabel}
            </span>
          </div>

          <div className="profile-info-item">
            <span className="profile-info-label">
              Account status
            </span>
            <span className="profile-status-badge">
              {profile?.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {profile?.role === 'candidate' && (
        <div className="profile-section">
          <div className="profile-section-heading">
            <h2>Candidate information</h2>
            <p>Your recruitment profile.</p>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-info-label">
                Candidate code
              </span>
              <span className="profile-info-value">
                Not available yet
              </span>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">
                Desired position
              </span>
              <span className="profile-info-value">
                Not available yet
              </span>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">
                Application status
              </span>
              <span className="profile-info-value">
                Under review
              </span>
            </div>
          </div>
        </div>
      )}

      {profile?.role === 'employee' && (
        <div className="profile-section">
          <div className="profile-section-heading">
            <h2>Employee information</h2>
            <p>Your workplace and competence information.</p>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-info-label">
                Employee code
              </span>
              <span className="profile-info-value">
                Not available yet
              </span>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">
                Department
              </span>
              <span className="profile-info-value">
                Not available yet
              </span>
            </div>

            <div className="profile-info-item">
              <span className="profile-info-label">
                Position
              </span>
              <span className="profile-info-value">
                Not available yet
              </span>
            </div>
          </div>
        </div>
      )}

      {profile?.role === 'admin' && (
        <div className="profile-section">
          <div className="profile-section-heading">
            <h2>Administrator information</h2>
            <p>Your system access information.</p>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-info-label">
                Access level
              </span>
              <span className="profile-info-value">
                System administrator
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;