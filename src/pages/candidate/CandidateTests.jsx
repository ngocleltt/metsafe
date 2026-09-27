import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ClipboardCheck, Clock3, CheckCircle2, PlayCircle, Award, RefreshCw,
  AlertCircle, ArrowRight, ShieldAlert, BookOpen, Timer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../../components/styles/CandidateTests.css';

const CandidateTests = ({ t, currentLang }) => {
  const navigate = useNavigate();
  const text = t.candidateTests;
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
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const currentUser = userData?.user;
      if (!currentUser?.id) throw new Error('Your user session is not available.');

      const { data: profile, error: profileError } = await supabase
        .from('profiles').select('id, role, candidate_id')
        .eq('id', currentUser.id).single();
      if (profileError) throw profileError;
      if (profile.role !== 'candidate' || !profile.candidate_id) {
        throw new Error('Your candidate profile is not linked yet.');
      }

      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .select('id, candidate_code, full_name, email, application_status')
        .eq('id', profile.candidate_id).single();
      if (candidateError) throw candidateError;

      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('id, candidate_id, assessment_date, total_score, level, status, model_version_id')
        .eq('candidate_id', profile.candidate_id)
        .order('assessment_date', { ascending: false });
      if (assessmentError) throw assessmentError;
      setCandidate(candidateData);
      setTests(assessmentData || []);
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

  useEffect(() => { loadTests(); }, [loadTests]);

  const testItems = useMemo(() => tests.map((assessment) => ({
    ...assessment,
    title: getAssessmentTitle(assessment, text),
    category: text.assessmentCategory,
    duration: text.assignedAssessment,
    status: normalizeStatus(assessment.status)
  })), [tests, text]);

  const filteredTests = useMemo(() => {
    if (activeFilter === 'all') return testItems;
    return testItems.filter((test) => test.status === activeFilter);
  }, [testItems, activeFilter]);

  const stats = useMemo(() => {
    const completed = testItems.filter((test) => test.status === 'completed');
    const inProgress = testItems.filter((test) =>
      test.status === 'in_progress' || test.status === 'started');
    const pending = testItems.filter((test) =>
      test.status === 'pending' || test.status === 'assigned');
    const scores = completed.map((test) => Number(test.total_score))
      .filter((score) => Number.isFinite(score));
    const averageScore = scores.length
      ? scores.reduce((total, score) => total + score, 0) / scores.length
      : null;
    return {
      total: testItems.length,
      completed: completed.length,
      inProgress: inProgress.length,
      pending: pending.length,
      averageScore
    };
  }, [testItems]);

  const nextTest = useMemo(() => testItems.find((test) =>
    test.status === 'in_progress' || test.status === 'started' ||
    test.status === 'pending' || test.status === 'assigned'
  ), [testItems]);

  const dateLocale = { en: 'en-US', vi: 'vi-VN', ru: 'ru-RU' }[currentLang] || 'en-US';
  const formatDate = (dateValue) => {
    if (!dateValue) return '—';
    return new Intl.DateTimeFormat(dateLocale, {
      day: '2-digit', month: 'short', year: 'numeric'
    }).format(new Date(dateValue));
  };
  const formatStatus = (status) => text.statuses[status] ||
    (status ? status.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : text.statuses.pending);

  if (loading) return (
    <div className="candidate-tests-page">
      <div className="candidate-tests-loading">{text.loading}</div>
    </div>
  );

  if (error && !candidate) return (
    <div className="candidate-tests-page">
      <div className="candidate-tests-error-card">
        <AlertCircle size={31} />
        <h1>{text.errorTitle}</h1>
        <p>{error}</p>
        <button type="button" className="candidate-tests-primary-button" onClick={() => loadTests()}>
          {text.tryAgain}
        </button>
      </div>
    </div>
  );

  return (
    <div className="candidate-tests-page">
      <header className="candidate-tests-header">
        <div>
          <span className="candidate-tests-eyebrow">{text.eyebrow}</span>
          <h1>{text.title}</h1>
          <p>{text.description}</p>
        </div>
        <button type="button" className="candidate-tests-refresh-button"
          onClick={() => loadTests({ isRefresh: true })} disabled={refreshing}>
          <RefreshCw size={16} className={refreshing ? 'is-spinning' : ''} />
          {refreshing ? text.refreshing : text.refresh}
        </button>
      </header>

      {error && <div className="candidate-tests-error" role="alert">
        <AlertCircle size={17} /><span>{error}</span>
      </div>}

      <section className="candidate-tests-summary">
        <SummaryCard icon={<ClipboardCheck size={20} />} label={text.assignedTests} value={stats.total} />
        <SummaryCard icon={<PlayCircle size={20} />} label={text.inProgress} value={stats.inProgress} variant="progress" />
        <SummaryCard icon={<CheckCircle2 size={20} />} label={text.completed} value={stats.completed} variant="complete" />
        <SummaryCard icon={<Award size={20} />} label={text.averageScore}
          value={stats.averageScore === null ? '—' : stats.averageScore.toFixed(1)} variant="score" />
      </section>

      {nextTest && <section className="candidate-next-test-card">
        <div className="candidate-next-test-icon"><ShieldAlert size={23} /></div>
        <div className="candidate-next-test-content">
          <span>{text.recommendedAction}</span>
          <h2>{nextTest.title}</h2>
          <p>{nextTest.status === 'in_progress' || nextTest.status === 'started'
            ? text.continueDescription : text.startDescription}</p>
        </div>
        <button type="button" className="candidate-tests-primary-button"
          onClick={() => handleTestAction(nextTest, navigate)}>
          {nextTest.status === 'in_progress' || nextTest.status === 'started'
            ? text.continueTest : text.startTest}
          <ArrowRight size={16} />
        </button>
      </section>}

      <section className="candidate-tests-card">
        <div className="candidate-tests-card-header">
          <div>
            <span className="candidate-tests-card-kicker">{text.assessmentCentre}</span>
            <h2>{text.availableTests}</h2>
          </div>
          <span className="candidate-tests-code">{candidate?.candidate_code || text.candidateFallback}</span>
        </div>
        <div className="candidate-tests-filters">
          <FilterButton label={text.filters.all} value="all" activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          <FilterButton label={text.filters.pending} value="pending" activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          <FilterButton label={text.filters.inProgress} value="in_progress" activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          <FilterButton label={text.filters.completed} value="completed" activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        </div>
        {filteredTests.length === 0 ? <div className="candidate-tests-empty">
          <BookOpen size={32} />
          <h3>{text.emptyTitle}</h3>
          <p>{text.emptyDescription}</p>
        </div> : <div className="candidate-test-list">
          {filteredTests.map((test) => <TestRow key={test.id} test={test}
            onAction={() => handleTestAction(test, navigate)} text={text}
            formatStatus={formatStatus} formatDate={formatDate} />)}
        </div>}
      </section>

      <section className="candidate-ci-info">
        <div className="candidate-ci-info-icon"><Award size={22} /></div>
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
    <div className={`candidate-test-summary-icon ${variant}`}>{icon}</div>
    <span>{label}</span><strong>{value}</strong>
  </div>
);

const FilterButton = ({ label, value, activeFilter, setActiveFilter }) => (
  <button type="button" className={`candidate-test-filter ${activeFilter === value ? 'active' : ''}`}
    onClick={() => setActiveFilter(value)}>{label}</button>
);

const TestRow = ({ test, onAction, text, formatStatus, formatDate }) => {
  const isCompleted = test.status === 'completed';
  const isInProgress = test.status === 'in_progress' || test.status === 'started';
  return (
    <article className="candidate-test-row">
      <div className="candidate-test-row-icon"><ClipboardCheck size={21} /></div>
      <div className="candidate-test-row-content">
        <div className="candidate-test-row-title">
          <h3>{test.title}</h3>
          <span className={`candidate-test-status status-${test.status}`}>
            {formatStatus(test.status)}
          </span>
        </div>
        <p>{test.category}</p>
        <div className="candidate-test-meta">
          <span><Timer size={14} />{test.duration}</span>
          {test.assessment_date && <span><Clock3 size={14} />{formatDate(test.assessment_date)}</span>}
          {isCompleted && <span><Award size={14} />{text.score}: {formatScore(test.total_score)}</span>}
        </div>
      </div>
      <button type="button" className="candidate-test-action" onClick={onAction}>
        {isCompleted ? text.viewResult : isInProgress ? text.continue : text.start}
        <ArrowRight size={15} />
      </button>
    </article>
  );
};

const normalizeStatus = (status) => status ? status.toLowerCase().replaceAll(' ', '_') : 'pending';
const formatScore = (score) => {
  const numericScore = Number(score);
  return Number.isFinite(numericScore) ? numericScore.toFixed(1) : '—';
};
const getAssessmentTitle = (assessment, text) => assessment.model_version_id
  ? `${text.assessmentTitle} ${assessment.model_version_id}` : text.defaultAssessmentTitle;
const handleTestAction = (test, navigate) => {
  if (test.status === 'completed') {
    navigate(`/dashboard/candidate/results/${test.id}`);
    return;
  }
  navigate(`/dashboard/candidate/tests/${test.id}`);
};

export default CandidateTests;