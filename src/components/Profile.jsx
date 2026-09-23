import React, { useEffect, useState } from 'react';
import {
  Mail,
  Phone,
  ShieldCheck,
  Pencil,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import './styles/Profile.css';

const Profile = () => {
  const {
    user,
    profile,
    refreshProfile
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    phone: ''
  });

  useEffect(() => {
    setForm({
      fullName: profile?.full_name || '',
      phone: profile?.phone || ''
    });
  }, [profile]);

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

  const updateField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value
    }));
  };

  const handleCancel = () => {
    setForm({
      fullName: profile?.full_name || '',
      phone: profile?.phone || ''
    });

    setError('');
    setSuccess('');
    setIsEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const fullName = form.fullName.trim();
    const phone = form.phone.trim();

    if (!fullName) {
      setError('Please enter your full name.');
      return;
    }

    if (!user?.id) {
      setError('User session is not available.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const {
        data: updatedProfile,
        error: profileError
      } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select(`
          id,
          full_name,
          email,
          role,
          phone,
          is_active,
          candidate_id,
          employee_id
        `)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (
        updatedProfile?.role === 'candidate' &&
        updatedProfile?.candidate_id
      ) {
        const {
          error: candidateError
        } = await supabase
          .from('candidates')
          .update({
            full_name: fullName,
            phone: phone || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', updatedProfile.candidate_id);

        if (candidateError) {
          throw candidateError;
        }
      }

      const {
        error: metadataError
      } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          phone: phone || null
        }
      });

      if (metadataError) {
        console.warn(
          'User metadata update warning:',
          metadataError
        );
      }

      if (refreshProfile) {
        await refreshProfile();
      }

      setForm({
        fullName: updatedProfile.full_name || '',
        phone: updatedProfile.phone || ''
      });

      setSuccess('Your profile has been updated.');
      setIsEditing(false);
    } catch (saveError) {
      console.error('Profile update error:', saveError);

      setError(
        saveError?.message ||
          'Unable to update your profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <section className="profile-hero-card">
        <div className="profile-avatar">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <div className="profile-heading">
          <span className="profile-eyebrow">
            Personal profile
          </span>

          <h1>{displayName}</h1>

          <p>
            Manage your METSAFE account information.
          </p>

          <span className="profile-role-badge">
            <ShieldCheck size={15} />
            {roleLabel}
          </span>
        </div>
        {!isEditing && (
          <button
            type="button"
            className="profile-edit-button"
            onClick={() => {
              setError('');
              setSuccess('');
              setIsEditing(true);
            }}
          >
            <Pencil size={17} />
            Edit profile
          </button>
        )}
      </section>

      <form
        className="profile-card"
        onSubmit={handleSave}
      >
        <div className="profile-card-heading">
          <div>
            <h2>Account information</h2>
            <p>
              Update the information shown on your profile.
            </p>
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button
                type="button"
                className="profile-cancel-button"
                onClick={handleCancel}
                disabled={saving}
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          )}
        </div>

        <div className="profile-form-grid">
          <div className="profile-field profile-field-wide">
            <label htmlFor="profile-full-name">
              Full name
            </label>

            {isEditing ? (
              <input
                id="profile-full-name"
                type="text"
                value={form.fullName}
                onChange={(event) =>
                  updateField(
                    'fullName',
                    event.target.value
                  )
                }
                disabled={saving}
              />
            ) : (
              <div className="profile-value">
                {displayName}
              </div>
            )}
          </div>

          <div className="profile-field">
            <label htmlFor="profile-email">
              Email address
            </label>

            <div className="profile-value profile-value-muted">
              <Mail size={16} />
              {user?.email ||
                profile?.email ||
                'Not available'}
            </div>

            <small>
              Email changes require confirmation.
            </small>
          </div>

          <div className="profile-field">
            <label htmlFor="profile-phone">
              Phone number
            </label>

            {isEditing ? (
              <input
                id="profile-phone"
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  updateField(
                    'phone',
                    event.target.value
                  )
                }
                placeholder="+84 912 345 678"
                disabled={saving}
              />
            ) : (
              <div className="profile-value">
                <Phone size={16} />
                {profile?.phone || 'Not provided'}
              </div>
            )}
          </div>

          <div className="profile-field">
            <label>Account role</label>

            <div className="profile-value">
              <ShieldCheck size={16} />
              {roleLabel}
            </div>
          </div>

          <div className="profile-field">
            <label>Account status</label>

            <div
              className={`profile-status ${
                profile?.is_active
                  ? 'is-active'
                  : 'is-inactive'
              }`}
            >
              {profile?.is_active
                ? 'Active'
                : 'Inactive'}
            </div>
          </div>
        </div>

        {error && (
          <p className="profile-message profile-message-error">
            {error}
          </p>
        )}

        {success && (
          <p className="profile-message profile-message-success">
            {success}
          </p>
        )}
      </form>

      <section className="profile-card">
        <div className="profile-card-heading">
          <div>
            <h2>Role information</h2>
            <p>
              Information specific to your METSAFE role.
            </p>
          </div>
        </div>

        {profile?.role === 'candidate' && (
          <div className="role-info-grid">
            <div>
              <span>Candidate code</span>
              <strong>Not available yet</strong>
            </div>

            <div>
              <span>Application status</span>
              <strong>Under review</strong>
            </div>
          </div>
        )}

        {profile?.role === 'employee' && (
          <div className="role-info-grid">
            <div>
              <span>Employee code</span>
              <strong>Not available yet</strong>
            </div>

            <div>
              <span>Department</span>
              <strong>Not available yet</strong>
            </div>
          </div>
        )}

        {profile?.role === 'admin' && (
          <div className="role-info-grid">
            <div>
              <span>Access level</span>
              <strong>System administrator</strong>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;