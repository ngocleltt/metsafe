import React, { useEffect, useState } from 'react';
import {
  Mail,
  Phone,
  ShieldCheck,
  Pencil,
  Save,
  X,
  FileText,
  ClipboardCheck,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { pdf } from '@react-pdf/renderer';
import CandidateCV from '../components/CandidateCV';
import './styles/Profile.css';

const Profile = ({ t, locale }) => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const text = t.profile;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorKey, setErrorKey] = useState('');
  const [successKey, setSuccessKey] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    phone: ''
  });

  const [candidate, setCandidate] = useState(null);
  const [testStats, setTestStats] = useState(null);
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [loadingExtra, setLoadingExtra] = useState(true);
  const [extraError, setExtraError] = useState('');

  useEffect(() => {
    setForm({
      fullName: profile?.full_name || '',
      phone: profile?.phone || ''
    });
  }, [profile]);

  useEffect(() => {
    let cancelled = false;

    const loadExtraData = async () => {
      if (!user?.id || !profile?.candidate_id) {
        setLoadingExtra(false);
        return;
      }

      try {
        const { data: candidateData, error: candidateError } =
          await supabase
            .from('candidates')
            .select(`
              id,
              candidate_code,
              full_name,
              email,
              phone,
              desired_position,
              application_status,
              cv_url,
              notes
            `)
            .eq('id', profile.candidate_id)
            .maybeSingle();

        if (candidateError) throw candidateError;
        if (cancelled) return;
        setCandidate(candidateData);

        const { data: statsData, error: statsError } = await supabase
          .from('assessments')
          .select(`
            status,
            id
          `)
          .eq('candidate_id', profile.candidate_id);

        if (statsError) throw statsError;
        if (cancelled) return;

        const stats = (statsData || []).reduce(
          (acc, row) => {
            acc[row.status] = (acc[row.status] || 0) + 1;
            acc.total = (acc.total || 0) + 1;
            return acc;
          },
          { total: 0 }
        );
        setTestStats(stats);

        const { data: latestData, error: latestError } = await supabase
          .from('assessments')
          .select(`
            id,
            assessment_type,
            assessment_date,
            total_score,
            level,
            status
          `)
          .eq('candidate_id', profile.candidate_id)
          .order('assessment_date', { ascending: false })
          .limit(1);

        if (latestError) throw latestError;
        if (cancelled) return;
        setLatestAssessment(latestData?.[0] || null);
      } catch (err) {
        console.error('Load extra profile data error:', err);
        if (!cancelled) {
          setExtraError(err?.message || 'Unable to load additional data.');
        }
      } finally {
        if (!cancelled) {
          setLoadingExtra(false);
        }
      }
    };

    loadExtraData();

    return () => {
      cancelled = true;
    };
  }, [user?.id, profile?.candidate_id]);

  const displayName =
    candidate?.full_name ||
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    text.userFallback;

  const roleLabel =
    t.sidebar.roles[profile?.role] || text.userFallback;

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
      const { data: updatedProfile, error: profileError } =
        await supabase
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

      if (profileError) throw profileError;

      if (
        updatedProfile?.role === 'candidate' &&
        updatedProfile?.candidate_id
      ) {
        const { error: candidateError } = await supabase
          .from('candidates')
          .update({
            full_name: fullName,
            phone: phone || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', updatedProfile.candidate_id);

        if (candidateError) throw candidateError;

        setCandidate((current) => ({
          ...current,
          full_name: fullName,
          phone: phone || null
        }));
      }

      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          phone: phone || null
        }
      });

      if (metadataError) {
        console.warn('User metadata update warning:', metadataError);
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

  const handleDownloadCV = async () => {
    try {
      const doc = (
        <CandidateCV
          profile={profile}
          candidate={candidate}
          testStats={testStats}
          latestAssessment={latestAssessment}
          t={t}
          locale={locale}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `METSAFE_CV_${candidate?.candidate_code?.replace(/\W/g, '') || 'CANDIDATE'}.pdf`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download CV error:', err);
    }
  };

  return (
    <div className="profile-page">
      <section className="profile-hero-card">
        <div className="profile-avatar">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <div className="profile-heading">
          <span className="profile-eyebrow">{text.eyebrow}</span>

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

      <form className="profile-card" onSubmit={handleSave}>
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
                {saving ? text.saving : text.saveChanges}
              </button>
            </div>
          )}
        </div>

        <div className="profile-form-grid">
          <div className="profile-field profile-field-wide">
            <label htmlFor="profile-full-name">{text.fullName}</label>

            {isEditing ? (
              <input
                id="profile-full-name"
                type="text"
                value={form.fullName}
                onChange={(event) =>
                  updateField('fullName', event.target.value)
                }
                disabled={saving}
              />
            ) : (
              <div className="profile-value">{displayName}</div>
            )}
          </div>

          <div className="profile-field">
            <span className="profile-field-label">{text.emailAddress}</span>

            <div className="profile-value profile-value-muted">
              <Mail size={16} aria-hidden="true" />
              {candidate?.email || profile?.email || text.notAvailable}
            </div>

            <small>{text.emailConfirmation}</small>
          </div>

          <div className="profile-field">
            <label htmlFor="profile-phone">{text.phoneNumber}</label>

            {isEditing ? (
              <input
                id="profile-phone"
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  updateField('phone', event.target.value)
                }
                placeholder={text.phonePlaceholder}
                disabled={saving}
              />
            ) : (
              <div className="profile-value">
                <Phone size={16} aria-hidden="true" />
                {candidate?.phone || profile?.phone || text.notProvided}
              </div>
            )}
          </div>

          <div className="profile-field">
            <span className="profile-field-label">{text.accountRole}</span>

            <div className="profile-value">
              <ShieldCheck size={16} aria-hidden="true" />
              {roleLabel}
            </div>
          </div>

          <div className="profile-field">
            <span className="profile-field-label">{text.accountStatus}</span>

            <div
              className={`profile-status ${
                profile?.is_active === true ? 'is-active' : 'is-inactive'
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

      {profile?.role === 'candidate' && (
        <>
          <section className="profile-card">
            <div className="profile-card-heading">
              <div>
                <h2>{text.candidateInformation}</h2>
                <p>{text.candidateDescription}</p>
              </div>

              <button
                type="button"
                className="profile-save-button"
                onClick={handleDownloadCV}
                disabled={loadingExtra || !!extraError || !candidate}
              >
                <FileText size={16} />
                {text.downloadCv || 'Download CV'}
              </button>
            </div>

            {loadingExtra ? (
              <div className="profile-loading">{text.loading}</div>
            ) : extraError ? (
              <div className="profile-message profile-message-error" role="alert">
                {extraError}
              </div>
            ) : (
              <div className="role-info-grid">
                <div>
                  <span>{text.candidateCode}</span>
                  <strong>
                    {candidate?.candidate_code || text.notAvailable}
                  </strong>
                </div>

                <div>
                  <span>{text.applicationStatus}</span>
                  <strong>
                    {candidate?.application_status
                      ? t.candidate.status[candidate.application_status] ||
                        candidate.application_status
                      : text.notAvailable}
                  </strong>
                </div>

                {candidate?.desired_position && (
                  <div>
                    <span>{text.desiredPosition}</span>
                    <strong>{candidate.desired_position}</strong>
                  </div>
                )}

                {candidate?.cv_url && (
                  <div className="profile-field-full">
                    <span>{text.cv}</span>
                    <div>
                      <a
                        href={candidate.cv_url}
                        target="_blank"
                        rel="noreferrer"
                        className="profile-link"
                      >
                        <FileText size={16} />
                        {text.viewCv}
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                )}

                {candidate?.notes && (
                  <div className="profile-field-full">
                    <span>{text.notes}</span>
                    <div className="profile-value">{candidate.notes}</div>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="profile-card">
            <div className="profile-card-heading">
              <div>
                <h2>{text.assessmentsTitle}</h2>
                <p>{text.assessmentsDescription}</p>
              </div>
            </div>

            {loadingExtra ? (
              <div className="profile-loading">{text.loading}</div>
            ) : extraError ? (
              <div className="profile-message profile-message-error" role="alert">
                {extraError}
              </div>
            ) : (
              <>
                {testStats ? (
                  <div className="role-info-grid">
                    <div>
                      <span>{text.totalTests}</span>
                      <strong>{testStats.total || 0}</strong>
                    </div>

                    {testStats.draft !== undefined && (
                      <div>
                        <span>{text.draftTests}</span>
                        <strong>{testStats.draft}</strong>
                      </div>
                    )}

                    {testStats.completed !== undefined && (
                      <div>
                        <span>{text.completedTests}</span>
                        <strong>{testStats.completed}</strong>
                      </div>
                    )}

                    {testStats.cancelled !== undefined && (
                      <div>
                        <span>{text.cancelledTests}</span>
                        <strong>{testStats.cancelled}</strong>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="profile-empty">
                    <ClipboardCheck size={32} />
                    <p>{text.noAssessments}</p>
                  </div>
                )}

                {latestAssessment && (
                  <div className="latest-assessment-block">
                    <div className="latest-assessment-heading">
                      <Award size={20} />
                      <strong>{text.latestAssessment}</strong>
                    </div>

                    <div className="role-info-grid">
                      <div>
                        <span>{text.type}</span>
                        <strong>
                          {t.assessment?.type?.[latestAssessment.assessment_type] ||
                            latestAssessment.assessment_type}
                        </strong>
                      </div>

                      <div>
                        <span>{text.status}</span>
                        <strong>
                          {t.assessment?.status?.[latestAssessment.status] ||
                            latestAssessment.status}
                        </strong>
                      </div>

                      <div>
                        <span>{text.score}</span>
                        <strong>
                          {latestAssessment.total_score != null
                            ? Number(latestAssessment.total_score).toFixed(1)
                            : text.notAvailable}
                        </strong>
                      </div>

                      <div>
                        <span>{text.level}</span>
                        <strong>
                          {latestAssessment.level != null
                            ? `Level ${latestAssessment.level}`
                            : text.notAvailable}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </>
      )}

      {profile?.role === 'employee' && (
        <section className="profile-card">
          <div className="profile-card-heading">
            <div>
              <h2>{text.roleInformation}</h2>
              <p>{text.roleDescription}</p>
            </div>
          </div>

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
        </section>
      )}

      {profile?.role === 'admin' && (
        <section className="profile-card">
          <div className="profile-card-heading">
            <div>
              <h2>{text.roleInformation}</h2>
              <p>{text.roleDescription}</p>
            </div>
          </div>

          <div className="role-info-grid">
            <div>
              <span>{text.accessLevel}</span>
              <strong>{text.systemAdministrator}</strong>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Profile;