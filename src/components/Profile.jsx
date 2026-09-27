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

const Profile = ({ t }) => {
  const {
    user,
    profile,
    refreshProfile
  } = useAuth();

  const text = t.profile;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Lưu mã thông báo thay vì lưu câu tiếng Anh để đổi locale ngay khi chuyển ngôn ngữ.
  const [errorKey, setErrorKey] = useState('');
  const [successKey, setSuccessKey] = useState('');

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
    text.userFallback;

  const roleLabel =
    t.sidebar.roles[profile?.role] ||
    text.userFallback;

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

    setErrorKey('');
    setSuccessKey('');
    setIsEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const fullName = form.fullName.trim();
    const phone = form.phone.trim();

    if (!fullName) {
      setErrorKey('nameRequired');
      return;
    }

    if (!user?.id) {
      setErrorKey('sessionUnavailable');
      return;
    }

    setSaving(true);
    setErrorKey('');
    setSuccessKey('');

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

      setSuccessKey('updated');
      setIsEditing(false);
    } catch (saveError) {
      console.error('Profile update error:', saveError);
      setErrorKey('updateFailed');
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
            {text.eyebrow}
          </span>

          <h1>{displayName}</h1>

          <p>{text.description}</p>

          <span className="profile-role-badge">
            <ShieldCheck size={15} aria-hidden="true" />
            {roleLabel}
          </span>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="profile-edit-button"
            onClick={() => {
              setErrorKey('');
              setSuccessKey('');
              setIsEditing(true);
            }}
          >
            <Pencil size={17} aria-hidden="true" />
            {text.editProfile}
          </button>
        )}
      </section>

      <form
        className="profile-card"
        onSubmit={handleSave}
      >
        <div className="profile-card-heading">
          <div>
            <h2>{text.accountInformation}</h2>
            <p>{text.accountDescription}</p>
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button
                type="button"
                className="profile-cancel-button"
                onClick={handleCancel}
                disabled={saving}
              >
                <X size={16} aria-hidden="true" />
                {text.cancel}
              </button>

              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >
                <Save size={16} aria-hidden="true" />
                {saving
                  ? text.saving
                  : text.saveChanges}
              </button>
            </div>
          )}
        </div>

        <div className="profile-form-grid">
          <div className="profile-field profile-field-wide">
            <label htmlFor="profile-full-name">
              {text.fullName}
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
            <span className="profile-field-label">
              {text.emailAddress}
            </span>

            <div className="profile-value profile-value-muted">
              <Mail size={16} aria-hidden="true" />
              {user?.email ||
                profile?.email ||
                text.notAvailable}
            </div>

            <small>
              {text.emailConfirmation}
            </small>
          </div>

          <div className="profile-field">
            <label htmlFor="profile-phone">
              {text.phoneNumber}
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
                placeholder={text.phonePlaceholder}
                disabled={saving}
              />
            ) : (
              <div className="profile-value">
                <Phone size={16} aria-hidden="true" />
                {profile?.phone || text.notProvided}
              </div>
            )}
          </div>

          <div className="profile-field">
            <span className="profile-field-label">
              {text.accountRole}
            </span>

            <div className="profile-value">
              <ShieldCheck size={16} aria-hidden="true" />
              {roleLabel}
            </div>
          </div>

          <div className="profile-field">
            <span className="profile-field-label">
              {text.accountStatus}
            </span>

            <div
              className={`profile-status ${
                profile?.is_active === true
                  ? 'is-active'
                  : 'is-inactive'
              }`}
            >
              {profile?.is_active === true
                ? text.active
                : profile?.is_active === false
                  ? text.inactive
                  : text.notAvailable}
            </div>
          </div>
        </div>

        {errorKey && (
          <p
            className="profile-message profile-message-error"
            role="alert"
          >
            {text.messages[errorKey]}
          </p>
        )}

        {successKey && (
          <p
            className="profile-message profile-message-success"
            role="status"
          >
            {text.messages[successKey]}
          </p>
        )}
      </form>

      <section className="profile-card">
        <div className="profile-card-heading">
          <div>
            <h2>{text.roleInformation}</h2>
            <p>{text.roleDescription}</p>
          </div>
        </div>

        {profile?.role === 'candidate' && (
          <div className="role-info-grid">
            <div>
              <span>{text.candidateCode}</span>
              <strong>{text.notAvailableYet}</strong>
            </div>

            <div>
              <span>{text.applicationStatus}</span>
              <strong>{text.notAvailableYet}</strong>
            </div>
          </div>
        )}

        {profile?.role === 'employee' && (
          <div className="role-info-grid">
            <div>
              <span>{text.employeeCode}</span>
              <strong>{text.notAvailableYet}</strong>
            </div>

            <div>
              <span>{text.department}</span>
              <strong>{text.notAvailableYet}</strong>
            </div>
          </div>
        )}

        {profile?.role === 'admin' && (
          <div className="role-info-grid">
            <div>
              <span>{text.accessLevel}</span>
              <strong>{text.systemAdministrator}</strong>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;