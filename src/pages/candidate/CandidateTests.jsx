import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ClipboardCheck,
  Clock3,
  CheckCircle2,
  PlayCircle,
  Award,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  BookOpen,
  Timer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../../components/styles/CandidateTests.css';

const extraText = {
  en: {
    draft: 'Not started',
    cancelled: 'Cancelled',
    unavailable: 'Unavailable',
    noScore: '—'
  },
  vi: {
    draft: 'Chưa bắt đầu',
    cancelled: 'Đã hủy',
    unavailable: 'Không khả dụng',
    noScore: '—'
  },
  ru: {
    draft: 'Не начат',
    cancelled: 'Отменён',
    unavailable: 'Недоступен',
    noScore: '—'
  }
};

const CandidateTests = ({ t, currentLang = 'en' }) => {
  const navigate = useNavigate();
  const text = t.candidateTests;
  const labels = extraText[currentLang] || extraText.en;

  const [candidate, setCandidate] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const loadTests = useCallback(async ({ isRefresh = false } = {}) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError('');

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) throw userError;

      const currentUser = userData?.user;
      if (!currentUser?.id) {
        throw new Error('Your user session is not available.');
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, candidate_id')
        .eq('id', currentUser.id)
        .single();

      if (profileError) throw profileError;

      if (profile.role !== 'candidate' || !profile.candidate_id) {
        throw new Error('Your candidate profile is not linked yet.');
      }

      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .select('id, candidate_code, full_name, email, application_status')
        .eq('id', profile.candidate_id)
        .single();

      if (candidateError) throw candidateError;

      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select(`
          id,
          candidate_id,
          assessment_date,
          total_score,
          level,
          status,
          model_version_id
        `)
        .eq('candidate_id', profile.candidate_id)
        .order('assessment_date', { ascending: false });

      if (assessmentError) throw assessmentError;

      const assessments = assessmentData || [];
      const assessmentIds = assessments.map((item) => item.id);
      const testTitleByAssessment = {};

      if (assessmentIds.length > 0) {
        const { data: links, error: linksError } = await supabase
          .from('assessment_questions')
          .select('assessment_id, question_id')
          .in('assessment_id', assessmentIds);

        if (linksError) throw linksError;

        const questionIds = [
          ...new Set((links || []).map((link) => link.question_id))
        ];

        if (questionIds.length > 0) {
          const { data: questionRows, error: questionError } = await supabase
            .from('questions')
            .select('id, test_id')
            .in('id', questionIds);

          if (questionError) throw questionError;

          const testIds = [
            ...new Set((questionRows || []).map((question) => question.test_id))
          ];

          if (testIds.length > 0) {
            const { data: testRows, error: testsError } = await supabase
              .from('tests')
              .select('id, title')
              .in('id', testIds);

            if (testsError) throw testsError;

            const titleByTestId = Object.fromEntries(
              (testRows || []).map((test) => [test.id, test.title])
            );

            const testIdByQuestionId = Object.fromEntries(
              (questionRows || []).map((question) => [
                question.id,
                question.test_id
              ])
            );

            (links || []).forEach((link) => {
              const testId = testIdByQuestionId[link.question_id];
              const title = titleByTestId[testId];
              if (title && !testTitleByAssessment[link.assessment_id]) {
                testTitleByAssessment[link.assessment_id] = title;
              }
            });
          }
        }
      }

      setCandidate(candidateData);
      setTests(
        assessments.map((assessment) => ({
          ...assessment,
          testTitle: testTitleByAssessment[assessment.id] || null
        }))
      );
    } catch (loadError) {
      console.error('Candidate tests loading error:', loadError);
      setCandidate(null);
      setTests([]);
      setError(loadError?.message || 'Unable to load your tests.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTests();
  }, [loadTests]);

  const testItems = useMemo(
    () => tests.map((assessment) => ({
      ...assessment,
      title: assessment.testTitle || text.defaultAssessmentTitle,
      category: text.assessmentCategory,
      duration: text.assignedAssessment,
      status: assessment.status || 'draft'
    })),
    [tests, text]
  );

  const filteredTests = useMemo(() => {
    if (activeFilter === 'all') return testItems;

    if (activeFilter === 'pending') {
      return testItems.filter((test) => test.status === 'draft');
    }

    if (activeFilter === 'in_progress') {
      return [];
    }

    return testItems.filter((test) => test.status === activeFilter);
  }, [testItems, activeFilter]);

  const stats = useMemo(() => {
    const completed = testItems.filter(
      (test) => test.status === 'completed'
    );

    const scores = completed
      .filter(
        (test) =>
          test.total_score !== null &&
          test.total_score !== undefined &&
          test.total_score !== ''
      )
      .map((test) => Number(test.total_score))
      .filter(Number.isFinite);

    return {
      total: testItems.filter(
        (test) => test.status !== 'cancelled'
      ).length,
      completed: completed.length,
      inProgress: 0,
      averageScore: scores.length
        ? scores.reduce((total, score) => total + score, 0) / scores.length
        : null
    };
  }, [testItems]);

  const nextTest = useMemo(
    () => testItems.find((test) => test.status === 'draft'),
    [testItems]
  );

  const dateLocale =
    { en: 'en-US', vi: 'vi-VN', ru: 'ru-RU' }[currentLang] || 'en-US';

  const formatDate = (dateValue) => {
    if (!dateValue) return '—';

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat(dateLocale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const formatStatus = (status) => {
    if (status === 'draft') return labels.draft;
    if (status === 'cancelled') return labels.cancelled;
    return text.statuses?.[status] || status || labels.unavailable;
  };

  const handleTestAction = (test) => {
    if (test.status === 'cancelled') return;
    navigate(`/dashboard/candidate/tests/${test.id}`);
  };

  if (loading) {
    return (
      <div className="candidate-tests-page">
        <div className="candidate-tests-loading">{text.loading}</div>
      </div>
    );
  }

  if (error && !candidate) {
    return (
      <div className="candidate-tests-page">
        <div className="candidate-tests-error-card">
          <AlertCircle size={31} />
          <h1>{text.errorTitle}</h1>
          <p>{error}</p>
          <button
            type="button"
            className="candidate-tests-primary-button"
            onClick={() => loadTests()}
          >
            {text.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-tests-page">
      <header className="candidate-tests-header">
        <div>
          <span className="candidate-tests-eyebrow">{text.eyebrow}</span>
          <h1>{text.title}</h1>
          <p>{text.description}</p>
        </div>

        <button
          type="button"
          className="candidate-tests-refresh-button"
          onClick={() => loadTests({ isRefresh: true })}
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'is-spinning' : ''}
          />
          {refreshing ? text.refreshing : text.refresh}
        </button>
      </header>

      {error && (
        <div className="candidate-tests-error" role="alert">
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      <section className="candidate-tests-summary">
        <SummaryCard
          icon={<ClipboardCheck size={20} />}
          label={text.assignedTests}
          value={stats.total}
        />
        <SummaryCard
          icon={<PlayCircle size={20} />}
          label={text.inProgress}
          value={stats.inProgress}
          variant="progress"
        />
        <SummaryCard
          icon={<CheckCircle2 size={20} />}
          label={text.completed}
          value={stats.completed}
          variant="complete"
        />
        <SummaryCard
          icon={<Award size={20} />}
          label={text.averageScore}
          value={
            stats.averageScore === null
              ? labels.noScore
              : stats.averageScore.toFixed(1)
          }
          variant="score"
        />
      </section>

      {nextTest && (
        <section className="candidate-next-test-card">
          <div className="candidate-next-test-icon">
            <ShieldAlert size={23} />
          </div>

          <div className="candidate-next-test-content">
            <span>{text.recommendedAction}</span>
            <h2>{nextTest.title}</h2>
            <p>{text.startDescription}</p>
          </div>

          <button
            type="button"
            className="candidate-tests-primary-button"
            onClick={() => handleTestAction(nextTest)}
          >
            {text.startTest}
            <ArrowRight size={16} />
          </button>
        </section>
      )}

      <section className="candidate-tests-card">
        <div className="candidate-tests-card-header">
          <div>
            <span className="candidate-tests-card-kicker">
              {text.assessmentCentre}
            </span>
            <h2>{text.availableTests}</h2>
          </div>

          <span className="candidate-tests-code">
            {candidate?.candidate_code || text.candidateFallback}
          </span>
        </div>

        <div className="candidate-tests-filters">
          <FilterButton
            label={text.filters.all}
            value="all"
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          <FilterButton
            label={text.filters.pending}
            value="pending"
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          <FilterButton
            label={text.filters.inProgress}
            value="in_progress"
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          <FilterButton
            label={text.filters.completed}
            value="completed"
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>

        {filteredTests.length === 0 ? (
          <div className="candidate-tests-empty">
            <BookOpen size={32} />
            <h3>{text.emptyTitle}</h3>
            <p>{text.emptyDescription}</p>
          </div>
        ) : (
          <div className="candidate-test-list">
            {filteredTests.map((test) => (
              <TestRow
                key={test.id}
                test={test}
                onAction={() => handleTestAction(test)}
                text={text}
                labels={labels}
                formatStatus={formatStatus}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </section>

      <section className="candidate-ci-info">
        <div className="candidate-ci-info-icon">
          <Award size={22} />
        </div>
        <div>
          <h2>{text.howItWorks}</h2>
          <p>{text.howItWorksDescription}</p>
          <span>{text.ciExplanation}</span>
        </div>
      </section>
    </div>
  );
};

const SummaryCard = ({ icon, label, value, variant = '' }) => (
  <div className="candidate-test-summary-card">
    <div className={`candidate-test-summary-icon ${variant}`}>
      {icon}
    </div>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const FilterButton = ({
  label,
  value,
  activeFilter,
  setActiveFilter
}) => (
  <button
    type="button"
    className={`candidate-test-filter ${
      activeFilter === value ? 'active' : ''
    }`}
    onClick={() => setActiveFilter(value)}
  >
    {label}
  </button>
);

const TestRow = ({
  test,
  onAction,
  text,
  labels,
  formatStatus,
  formatDate
}) => {
  const isCompleted = test.status === 'completed';
  const isCancelled = test.status === 'cancelled';

  return (
    <article className="candidate-test-row">
      <div className="candidate-test-row-icon">
        <ClipboardCheck size={21} />
      </div>

      <div className="candidate-test-row-content">
        <div className="candidate-test-row-title">
          <h3>{test.title}</h3>
          <span
            className={`candidate-test-status status-${test.status}`}
          >
            {formatStatus(test.status)}
          </span>
        </div>

        <p>{test.category}</p>

        <div className="candidate-test-meta">
          <span>
            <Timer size={14} />
            {test.duration}
          </span>

          {test.assessment_date && (
            <span>
              <Clock3 size={14} />
              {formatDate(test.assessment_date)}
            </span>
          )}

          {isCompleted && (
            <span>
              <Award size={14} />
              {text.score}: {formatScore(test.total_score)}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        className="candidate-test-action"
        onClick={onAction}
        disabled={isCancelled}
      >
        {isCancelled
          ? labels.unavailable
          : isCompleted
            ? text.viewResult
            : text.start}
        <ArrowRight size={15} />
      </button>
    </article>
  );
};

const formatScore = (score) => {
  if (score === null || score === undefined || score === '') {
    return '—';
  }

  const numericScore = Number(score);
  return Number.isFinite(numericScore)
    ? numericScore.toFixed(1)
    : '—';
};

export default CandidateTests;