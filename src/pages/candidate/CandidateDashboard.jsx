import React, { useCallback, useEffect, useState } from 'react';
import {
  UserRound,
  FileText,
  ClipboardCheck,
  Award,
  ArrowRight,
  Clock3,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../../components/styles/CandidateDashboard.css';

const CandidateDashboard = ({ t }) => {
  const navigate = useNavigate();
  const text = t.candidateDashboard;

  const [candidate, setCandidate] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(
    async ({ isRefresh = false } = {}) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      try {
        const {
          data: currentUserData,
          error: userError
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        const currentUser = currentUserData?.user;

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
            full_name,
            email,
            phone,
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
            created_at
          `)
          .eq('id', profile.candidate_id)
          .single();

        if (candidateError) {
          throw candidateError;
        }

        const {
          data: assessmentData,
          error: assessmentError
        } = await supabase
          .from('assessments')
          .select(`
            id,
            assessment_date,
            total_score,
            level,
            status
          `)
          .eq('candidate_id', profile.candidate_id)
          .order('assessment_date', {
            ascending: false
          })
          .limit(1)
          .maybeSingle();

        if (
          assessmentError &&
          assessmentError.code !== 'PGRST116'
        ) {
          throw assessmentError;
        }

        setCandidate({
          ...candidateData,
          profile_name: profile.full_name,
          profile_email: profile.email,
          profile_phone: profile.phone
        });

        setAssessment(assessmentData || null);
      } catch (loadError) {
        console.error(
          'Candidate dashboard loading error:',
          loadError
        );

        setError(
          loadError?.message ||
            'Unable to load your dashboard.'
        );

        setCandidate(null);
        setAssessment(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const formatStatus = (status) => {
    if (!status) {
      return text.statuses.unknown;
    }

    return (
      text.statuses[status] ||
      status
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (character) =>
          character.toUpperCase()
        )
    );
  };

  if (loading) {
    return (
      <div className="candidate-dashboard-page">
        <div className="candidate-dashboard-loading">
          {text.loading}
        </div>
      </div>
    );
  }

  if (error && !candidate) {
    return (
      <div className="candidate-dashboard-page">
        <div className="candidate-dashboard-error-card">
          <AlertCircle size={30} />

          <h1>{text.errorTitle}</h1>

          <p>{error}</p>

          <button
            type="button"
            className="candidate-primary-button"
            onClick={() => loadDashboard()}
          >
            {text.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  const applicationStatus =
    candidate?.application_status || 'pending';

  const statusLabel = formatStatus(applicationStatus);
  const assessmentLabel = assessment
    ? formatStatus(assessment.status)
    : text.notStarted;

  return (
    <div className="candidate-dashboard-page">
      <header className="candidate-dashboard-header">
        <div>
          <span className="candidate-dashboard-eyebrow">
            {text.eyebrow}
          </span>

          <h1>
            {text.welcomeBack}{' '}
            {candidate?.full_name || text.candidateFallback}
          </h1>

          <p>{text.description}</p>
        </div>

        <button
          type="button"
          className="candidate-refresh-button"
          onClick={() =>
            loadDashboard({ isRefresh: true })
          }
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={
              refreshing ? 'is-spinning' : ''
            }
          />

          {refreshing ? text.refreshing : text.refresh}
        </button>
      </header>

      {error && (
        <div
          className="candidate-dashboard-error"
          role="alert"
        >
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      <section className="candidate-summary-grid">
        <div className="candidate-summary-card">
          <div className="candidate-summary-icon">
            <FileText size={20} />
          </div>

          <span>{text.applicationStatus}</span>
          <strong>{statusLabel}</strong>
        </div>

        <div className="candidate-summary-card">
          <div className="candidate-summary-icon is-code">
            <UserRound size={20} />
          </div>

          <span>{text.candidateCode}</span>
          <strong>
            {candidate?.candidate_code || text.notAssigned}
          </strong>
        </div>

        <div className="candidate-summary-card">
          <div className="candidate-summary-icon is-assessment">
            <ClipboardCheck size={20} />
          </div>

          <span>{text.assessment}</span>
          <strong>{assessmentLabel}</strong>
        </div>
      </section>

      <section className="candidate-dashboard-grid">
        <div className="candidate-dashboard-panel candidate-progress-panel">
          <div className="candidate-panel-heading">
            <div>
              <span className="candidate-panel-kicker">
                {text.applicationJourney}
              </span>

              <h2>{text.applicationProgress}</h2>
            </div>

            <FileText size={20} />
          </div>

          <div className="candidate-progress-track">
            <ProgressStep
              label={text.steps.submitted}
              isComplete
            />

            <ProgressStep
              label={text.steps.underReview}
              isComplete={[
                'under_review',
                'approved',
                'interview',
                'accepted'
              ].includes(applicationStatus)}
              isCurrent={applicationStatus === 'pending'}
            />

            <ProgressStep
              label={text.steps.assessment}
              isComplete={
                assessment?.status === 'completed'
              }
              isCurrent={
                assessment &&
                assessment.status !== 'completed'
              }
            />

            <ProgressStep
              label={text.steps.finalDecision}
              isComplete={[
                'accepted',
                'rejected'
              ].includes(applicationStatus)}
              isCurrent={false}
              isLast
            />
          </div>
        </div>

        <div className="candidate-dashboard-panel candidate-action-panel">
          <div className="candidate-panel-heading">
            <div>
              <span className="candidate-panel-kicker">
                {text.nextStep}
              </span>

              <h2>{text.keepProfileReady}</h2>
            </div>

            <Clock3 size={20} />
          </div>

          <p>{text.contactReminder}</p>

          <button
            type="button"
            className="candidate-panel-button"
            onClick={() =>
              navigate('/dashboard/profile')
            }
          >
            {text.reviewProfile}
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="candidate-dashboard-panel candidate-assessment-panel">
        <div className="candidate-panel-heading">
          <div>
            <span className="candidate-panel-kicker">
              {text.competenceAssessment}
            </span>

            <h2>{text.latestAssessment}</h2>
          </div>

          <Award size={21} />
        </div>

        {!assessment ? (
          <div className="candidate-empty-state">
            <ClipboardCheck size={30} />

            <strong>{text.noAssessment}</strong>

            <span>{text.resultPending}</span>
          </div>
        ) : (
          <div className="candidate-result-row">
            <div>
              <span>{text.assessmentStatus}</span>
              <strong>
                {formatStatus(assessment.status)}
              </strong>
            </div>

            <div>
              <span>{text.totalScore}</span>
              <strong>
                {formatScore(assessment.total_score)}
              </strong>
            </div>

            <div>
              <span>{text.level}</span>
              <strong>
                {assessment.level || text.notClassified}
              </strong>
            </div>

            <button
              type="button"
              className="candidate-panel-button"
              onClick={() =>
                navigate('/dashboard/candidate/results')
              }
            >
              {text.viewResults}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

const ProgressStep = ({
  label,
  isComplete,
  isCurrent,
  isLast
}) => {
  return (
    <div
      className={`candidate-progress-step ${
        isComplete ? 'is-complete' : ''
      } ${isCurrent ? 'is-current' : ''}`}
    >
      <div className="candidate-progress-marker">
        {isComplete ? (
          <CheckCircle2 size={18} />
        ) : (
          <span />
        )}
      </div>

      <span>{label}</span>

      {!isLast && (
        <div className="candidate-progress-line" />
      )}
    </div>
  );
};

const formatScore = (score) => {
  const numericScore = Number(score);

  return Number.isFinite(numericScore)
    ? numericScore.toFixed(1)
    : '—';
};

export default CandidateDashboard;