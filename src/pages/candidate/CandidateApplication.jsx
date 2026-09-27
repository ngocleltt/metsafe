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

const dateLocales = {
  en: 'en-US',
  vi: 'vi-VN',
  ru: 'ru-RU'
};

const getStatusIcon = (status) => {
  if (['accepted', 'approved'].includes(status)) {
    return <CheckCircle2 size={25} aria-hidden="true" />;
  }

  if (['rejected', 'withdrawn'].includes(status)) {
    return <XCircle size={25} aria-hidden="true" />;
  }

  return <Clock3 size={25} aria-hidden="true" />;
};

const ApplicationStep = ({
  title,
  description,
  isComplete,
  isCurrent,
  date,
  isLast,
  formatDate
}) => {
  return (
    <div
      className={`candidate-application-step ${
        isComplete ? 'is-complete' : ''
      } ${isCurrent ? 'is-current' : ''}`}
    >
      <div className="candidate-application-step-marker">
        {isComplete ? (
          <CheckCircle2 size={18} aria-hidden="true" />
        ) : isCurrent ? (
          <Clock3 size={17} aria-hidden="true" />
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

const ApplicationDetail = ({ icon, label, value }) => {
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

const CandidateApplication = ({ t, currentLang }) => {
  const navigate = useNavigate();
  const text = t.candidateApplication;

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorKey, setErrorKey] = useState('');

  const loadApplication = useCallback(
    async ({ isRefresh = false } = {}) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorKey('');

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
          setErrorKey('sessionUnavailable');
          setCandidate(null);
          return;
        }

        const {
          data: profile,
          error: profileError
        } = await supabase
          .from('profiles')
          .select('id, role, candidate_id')
          .eq('id', currentUser.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (
          profile?.role !== 'candidate' ||
          !profile?.candidate_id
        ) {
          setErrorKey('profileNotLinked');
          setCandidate(null);
          return;
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
        setErrorKey('loadError');
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

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return text.notAvailable;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return text.notAvailable;
    }

    return new Intl.DateTimeFormat(
      dateLocales[currentLang] || 'en-US',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(date);
  };

  if (loading) {
    return (
      <div className="candidate-application-page">
        <div className="candidate-application-loading">
          {text.loading}
        </div>
      </div>
    );
  }

  if (errorKey && !candidate) {
    return (
      <div className="candidate-application-page">
        <div className="candidate-application-error-card">
          <AlertCircle size={30} aria-hidden="true" />

          <h1>{text.errorTitle}</h1>

          <p>{text.errors[errorKey]}</p>

          <button
            type="button"
            className="candidate-application-primary-button"
            onClick={() => loadApplication()}
          >
            {text.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  const status = candidate?.application_status || 'unknown';
  const statusLabel =
    text.statuses[status] || text.statuses.unknown;
  const statusDescription =
    text.statusDescriptions[status] ||
    text.statusDescriptions.unknown;
  const nextStep =
    text.nextSteps[status] ||
    text.nextSteps.unknown;

  return (
    <div className="candidate-application-page">
      <header className="candidate-application-header">
        <div>
          <span className="candidate-application-eyebrow">
            {text.eyebrow}
          </span>

          <h1>{text.title}</h1>

          <p>{text.description}</p>
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
            className={refreshing ? 'is-spinning' : ''}
            aria-hidden="true"
          />

          {refreshing ? text.refreshing : text.refresh}
        </button>
      </header>

      {errorKey && (
        <div
          className="candidate-application-error"
          role="alert"
        >
          <AlertCircle size={17} aria-hidden="true" />
          <span>{text.errors[errorKey]}</span>
        </div>
      )}

      <section className="candidate-application-status-card">
        <div className="candidate-application-status-icon">
          {getStatusIcon(status)}
        </div>

        <div className="candidate-application-status-content">
          <span>{text.currentStatus}</span>
          <h2>{statusLabel}</h2>
          <p>{statusDescription}</p>
        </div>

        <span
          className={`candidate-application-status-badge status-${status}`}
        >
          {statusLabel}
        </span>
      </section>

      <div className="candidate-application-grid">
        <section className="candidate-application-card">
          <div className="candidate-application-card-heading">
            <div>
              <span className="candidate-application-card-kicker">
                {text.progress}
              </span>

              <h2>{text.journey}</h2>
            </div>

            <FileText size={21} aria-hidden="true" />
          </div>

          <div className="candidate-application-timeline">
            <ApplicationStep
              title={text.steps.submitted.title}
              description={text.steps.submitted.description}
              isComplete={Boolean(candidate?.created_at)}
              date={candidate?.created_at}
              formatDate={formatDate}
            />

            <ApplicationStep
              title={text.steps.review.title}
              description={text.steps.review.description}
              isComplete={[
                'under_review',
                'approved',
                'interview',
                'accepted',
                'rejected'
              ].includes(status)}
              isCurrent={status === 'pending'}
              date={
                status === 'pending'
                  ? null
                  : candidate?.updated_at
              }
              formatDate={formatDate}
            />

            <ApplicationStep
              title={text.steps.assessment.title}
              description={text.steps.assessment.description}
              isComplete={[
                'approved',
                'interview',
                'accepted'
              ].includes(status)}
              isCurrent={status === 'approved'}
              formatDate={formatDate}
            />

            <ApplicationStep
              title={text.steps.decision.title}
              description={text.steps.decision.description}
              isComplete={[
                'accepted',
                'rejected'
              ].includes(status)}
              isLast
              formatDate={formatDate}
            />
          </div>
        </section>

        <section className="candidate-application-card">
          <div className="candidate-application-card-heading">
            <div>
              <span className="candidate-application-card-kicker">
                {text.applicationDetails}
              </span>

              <h2>{text.submittedInformation}</h2>
            </div>

            <Briefcase size={21} aria-hidden="true" />
          </div>

          <div className="candidate-application-details">
            <ApplicationDetail
              icon={<FileText size={16} aria-hidden="true" />}
              label={text.candidateCode}
              value={
                candidate?.candidate_code ||
                text.notAssigned
              }
            />

            <ApplicationDetail
              icon={<Mail size={16} aria-hidden="true" />}
              label={text.emailAddress}
              value={
                candidate?.email ||
                text.notProvided
              }
            />

            <ApplicationDetail
              icon={<Phone size={16} aria-hidden="true" />}
              label={text.phoneNumber}
              value={
                candidate?.phone ||
                text.notProvided
              }
            />

            <ApplicationDetail
              icon={<Briefcase size={16} aria-hidden="true" />}
              label={text.position}
              value={
                candidate?.position_id ||
                text.notSpecified
              }
            />

            <ApplicationDetail
              icon={
                <CalendarDays size={16} aria-hidden="true" />
              }
              label={text.submittedOn}
              value={formatDate(candidate?.created_at)}
            />
          </div>
        </section>
      </div>

      <section className="candidate-application-next-step">
        <div className="candidate-application-next-icon">
          <AlertCircle size={21} aria-hidden="true" />
        </div>

        <div>
          <span>{text.nextStep}</span>
          <h2>{nextStep.title}</h2>
          <p>{nextStep.description}</p>
        </div>

        <button
          type="button"
          className="candidate-application-next-button"
          onClick={() =>
            navigate('/dashboard/profile')
          }
        >
          {text.reviewProfile}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </section>
    </div>
  );
};

export default CandidateApplication;