import React, { useCallback, useEffect, useState } from 'react';
import {
  FileText,
  Briefcase,
  Mail,
  Phone,
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../../components/styles/CandidateApplication.css';

const CandidateApplication = () => {
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadApplication = useCallback(
    async ({ isRefresh = false } = {}) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      try {
        const {
          data: userData,
          error: userError
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        const currentUser = userData?.user;

        if (!currentUser?.id) {
          throw new Error(
            'Your user session is not available.'
          );
        }

        const {
          data: profile,
          error: profileError
        } = await supabase
          .from('profiles')
          .select(`
            id,
            role,
            candidate_id
          `)
          .eq('id', currentUser.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (
          profile.role !== 'candidate' ||
          !profile.candidate_id
        ) {
          throw new Error(
            'Your candidate profile is not linked yet.'
          );
        }

        const {
          data: candidateData,
          error: candidateError
        } = await supabase
          .from('candidates')
          .select(`
            id,
            candidate_code,
            full_name,
            email,
            phone,
            application_status,
            position_id,
            created_at,
            updated_at
          `)
          .eq('id', profile.candidate_id)
          .single();

        if (candidateError) {
          throw candidateError;
        }

        setCandidate(candidateData);
      } catch (loadError) {
        console.error(
          'Candidate application loading error:',
          loadError
        );

        setCandidate(null);
        setError(
          loadError?.message ||
            'Unable to load your application.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadApplication();
  }, [loadApplication]);

  if (loading) {
    return (
      <div className="candidate-application-page">
        <div className="candidate-application-loading">
          Loading your application...
        </div>
      </div>
    );
  }

  if (error && !candidate) {
    return (
      <div className="candidate-application-page">
        <div className="candidate-application-error-card">
          <AlertCircle size={30} />

          <h1>Unable to load application</h1>

          <p>{error}</p>

          <button
            type="button"
            className="candidate-application-primary-button"
            onClick={() => loadApplication()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const status =
    candidate?.application_status || 'pending';

  return (
    <div className="candidate-application-page">
      <header className="candidate-application-header">
        <div>
          <span className="candidate-application-eyebrow">
            Candidate workspace
          </span>

          <h1>My application</h1>

          <p>
            Follow your application status and review your
            submitted information.
          </p>
        </div>

        <button
          type="button"
          className="candidate-application-refresh-button"
          onClick={() =>
            loadApplication({ isRefresh: true })
          }
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={
              refreshing ? 'is-spinning' : ''
            }
          />

          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </header>

      {error && (
        <div
          className="candidate-application-error"
          role="alert"
        >
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      <section className="candidate-application-status-card">
        <div className="candidate-application-status-icon">
          {getStatusIcon(status)}
        </div>

        <div className="candidate-application-status-content">
          <span>Current application status</span>

          <h2>{formatStatus(status)}</h2>

          <p>{getStatusDescription(status)}</p>
        </div>

        <span
          className={`candidate-application-status-badge status-${status}`}
        >
          {formatStatus(status)}
        </span>
      </section>

      <div className="candidate-application-grid">
        <section className="candidate-application-card">
          <div className="candidate-application-card-heading">
            <div>
              <span className="candidate-application-card-kicker">
                Progress
              </span>

              <h2>Application journey</h2>
            </div>

            <FileText size={21} />
          </div>

          <div className="candidate-application-timeline">
            <ApplicationStep
              title="Application submitted"
              description="Your candidate profile was created."
              isComplete
              date={candidate?.created_at}
            />

            <ApplicationStep
              title="Application under review"
              description="The recruitment team is reviewing your information."
              isComplete={[
                'under_review',
                'approved',
                'interview',
                'accepted',
                'rejected'
              ].includes(status)}
              isCurrent={status === 'pending'}
              date={
                ['pending'].includes(status)
                  ? null
                  : candidate?.updated_at
              }
            />

            <ApplicationStep
              title="Assessment stage"
              description="You may be invited to complete a competence assessment."
              isComplete={[
                'approved',
                'interview',
                'accepted'
              ].includes(status)}
              isCurrent={status === 'approved'}
            />

            <ApplicationStep
              title="Final decision"
              description="The recruitment team will communicate the final result."
              isComplete={[
                'accepted',
                'rejected'
              ].includes(status)}
              isCurrent={false}
              isLast
            />
          </div>
        </section>

        <section className="candidate-application-card">
          <div className="candidate-application-card-heading">
            <div>
              <span className="candidate-application-card-kicker">
                Application details
              </span>

              <h2>Submitted information</h2>
            </div>

            <Briefcase size={21} />
          </div>

          <div className="candidate-application-details">
            <ApplicationDetail
              icon={<FileText size={16} />}
              label="Candidate code"
              value={
                candidate?.candidate_code ||
                'Not assigned'
              }
            />

            <ApplicationDetail
              icon={<Mail size={16} />}
              label="Email address"
              value={
                candidate?.email || 'Not provided'
              }
            />

            <ApplicationDetail
              icon={<Phone size={16} />}
              label="Phone number"
              value={
                candidate?.phone || 'Not provided'
              }
            />

            <ApplicationDetail
              icon={<Briefcase size={16} />}
              label="Position"
              value={
                candidate?.position_id ||
                'Not specified'
              }
            />

            <ApplicationDetail
              icon={<CalendarDays size={16} />}
              label="Submitted on"
              value={formatDate(candidate?.created_at)}
            />
          </div>
        </section>
      </div>

      <section className="candidate-application-next-step">
        <div className="candidate-application-next-icon">
          <AlertCircle size={21} />
        </div>

        <div>
          <span>Next step</span>

          <h2>{getNextStepTitle(status)}</h2>

          <p>{getNextStepDescription(status)}</p>
        </div>

        <button
          type="button"
          className="candidate-application-next-button"
          onClick={() =>
            navigate('/dashboard/profile')
          }
        >
          Review profile
          <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
};

const ApplicationStep = ({
  title,
  description,
  isComplete,
  isCurrent,
  date,
  isLast
}) => {
  return (
    <div
      className={`candidate-application-step ${
        isComplete ? 'is-complete' : ''
      } ${isCurrent ? 'is-current' : ''}`}
    >
      <div className="candidate-application-step-marker">
        {isComplete ? (
          <CheckCircle2 size={18} />
        ) : isCurrent ? (
          <Clock3 size={17} />
        ) : (
          <span />
        )}
      </div>

      <div className="candidate-application-step-content">
        <div className="candidate-application-step-title">
          <strong>{title}</strong>

          {date && <small>{formatDate(date)}</small>}
        </div>

        <p>{description}</p>
      </div>

      {!isLast && (
        <div className="candidate-application-step-line" />
      )}
    </div>
  );
};

const ApplicationDetail = ({
  icon,
  label,
  value
}) => {
  return (
    <div className="candidate-application-detail">
      <div className="candidate-application-detail-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
};

const formatStatus = (status) => {
  if (!status) {
    return 'Unknown';
  }

  return status
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateValue));
};

const getStatusIcon = (status) => {
  if (
    ['accepted', 'approved'].includes(status)
  ) {
    return <CheckCircle2 size={25} />;
  }

  if (
    ['rejected', 'withdrawn'].includes(status)
  ) {
    return <XCircle size={25} />;
  }

  return <Clock3 size={25} />;
};

const getStatusDescription = (status) => {
  if (status === 'approved') {
    return 'Your application has passed the initial review.';
  }

  if (status === 'accepted') {
    return 'Congratulations. Your application has been accepted.';
  }

  if (status === 'rejected') {
    return 'Your application was not selected at this stage.';
  }

  if (status === 'withdrawn') {
    return 'This application is no longer active.';
  }

  if (status === 'under_review') {
    return 'The recruitment team is currently reviewing your application.';
  }

  return 'Your application has been submitted and is waiting for review.';
};

const getNextStepTitle = (status) => {
  if (status === 'pending') {
    return 'Wait for application review';
  }

  if (status === 'under_review') {
    return 'Application is being reviewed';
  }

  if (status === 'approved') {
    return 'Prepare for the assessment stage';
  }

  if (status === 'accepted') {
    return 'Review your next onboarding steps';
  }

  if (status === 'rejected') {
    return 'Review your profile for future applications';
  }

  return 'Keep your profile information up to date';
};

const getNextStepDescription = (status) => {
  if (status === 'pending') {
    return 'No action is required right now. We will update your application when the review begins.';
  }

  if (status === 'under_review') {
    return 'Please keep your contact details available in case the recruitment team needs more information.';
  }

  if (status === 'approved') {
    return 'Your next step may include a competence or safety assessment.';
  }

  if (status === 'accepted') {
    return 'The recruitment team will provide information about the next stage.';
  }

  if (status === 'rejected') {
    return 'You can keep your profile updated for future opportunities.';
  }

  return 'Review your personal information and keep it accurate.';
};

export default CandidateApplication;