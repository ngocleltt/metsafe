import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Info,
  Send,
  ShieldAlert
} from 'lucide-react';
import {
  useNavigate,
  useParams
} from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../../components/styles/CandidateTestDetail.css';

const CandidateTestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);
  const [pageState, setPageState] = useState('loading');
  const [error, setError] = useState('');
  const [showSubmitConfirm, setShowSubmitConfirm] =
    useState(false);

  const loadTest = useCallback(async () => {
    setPageState('loading');
    setError('');

    try {
      const {
        data: userData,
        error: userError
      } = await supabase.auth.getUser();

      if (userError) throw userError;

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
        .select('id, role, candidate_id')
        .eq('id', currentUser.id)
        .single();

      if (profileError) throw profileError;

      if (
        profile.role !== 'candidate' ||
        !profile.candidate_id
      ) {
        throw new Error(
          'Your candidate profile is not linked yet.'
        );
      }

      const {
        data: assessmentData,
        error: assessmentError
      } = await supabase
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
        .eq('id', id)
        .eq('candidate_id', profile.candidate_id)
        .maybeSingle();

      if (assessmentError) throw assessmentError;

      if (!assessmentData) {
        throw new Error(
          'This assessment is not available.'
        );
      }

      setAssessment(assessmentData);

      if (assessmentData.status === 'completed') {
        setPageState('completed');
        return;
      }

      const loadedQuestions =
        await loadAssessmentQuestions(id);

      setQuestions(loadedQuestions);

      if (
        assessmentData.status === 'in_progress' ||
        assessmentData.status === 'started'
      ) {
        setPageState('testing');
      } else {
        setPageState('instructions');
      }
    } catch (loadError) {
      console.error(
        'Candidate test loading error:',
        loadError
      );
      setError(
        loadError?.message ||
          'Unable to load this assessment.'
      );
      setPageState('error');
    }
  }, [id]);

  useEffect(() => {
    loadTest();
  }, [loadTest]);

  const currentQuestion =
    questions[currentQuestionIndex];

  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  const handleStart = async () => {
    if (!assessment?.id) return;

    setError('');

    const { error: updateError } = await supabase
      .from('assessments')
      .update({ status: 'in_progress' })
      .eq('id', assessment.id);

    if (updateError) {
      console.error(
        'Start assessment error:',
        updateError
      );
      setError(updateError.message);
      return;
    }

    setAssessment((currentAssessment) => ({
      ...currentAssessment,
      status: 'in_progress'
    }));
    setPageState('testing');
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(
        (currentIndex) => currentIndex + 1
      );
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(
        (currentIndex) => currentIndex - 1
      );
    }
  };

  const handleSubmit = async () => {
    if (!assessment?.id) return;

    setError('');

    try {
      const { error: submitError } = await supabase
        .from('assessments')
        .update({ status: 'completed' })
        .eq('id', assessment.id);

      if (submitError) throw submitError;

      setAssessment((currentAssessment) => ({
        ...currentAssessment,
        status: 'completed'
      }));
      setPageState('completed');
      setShowSubmitConfirm(false);
    } catch (submitError) {
      console.error(
        'Submit assessment error:',
        submitError
      );
      setError(
        submitError?.message ||
          'Unable to submit this assessment.'
      );
    }
  };

  if (pageState === 'loading') {
    return (
      <div className="candidate-test-detail-page">
        <div className="candidate-test-loading">
          Loading assessment...
        </div>
      </div>
    );
  }

  if (pageState === 'error') {
    return (
      <div className="candidate-test-detail-page">
        <div className="candidate-test-error-card">
          <ShieldAlert size={32} />
          <h1>Assessment unavailable</h1>
          <p>{error}</p>
          <button
            type="button"
            className="candidate-test-primary-button"
            onClick={() =>
              navigate('/dashboard/candidate/tests')
            }
          >
            Back to my tests
          </button>
        </div>
      </div>
    );
  }

  if (pageState === 'completed') {
    return (
      <CompletedState
        assessment={assessment}
        navigate={navigate}
      />
    );
  }

  if (pageState === 'instructions') {
    return (
      <InstructionsState
        assessment={assessment}
        questions={questions}
        onStart={handleStart}
        onBack={() =>
          navigate('/dashboard/candidate/tests')
        }
      />
    );
  }

  return (
    <div className="candidate-test-detail-page">
      <header className="candidate-test-topbar">
        <button
          type="button"
          className="candidate-test-back-button"
          onClick={() =>
            navigate('/dashboard/candidate/tests')
          }
        >
          <ArrowLeft size={17} />
          My tests
        </button>

        <div className="candidate-test-progress-summary">
          <span>
            Question {currentQuestionIndex + 1} of{' '}
            {questions.length}
          </span>
          <strong>
            {answeredCount}/{questions.length} answered
          </strong>
        </div>
      </header>

      {error && (
        <div className="candidate-test-error" role="alert">
          <ShieldAlert size={17} />
          <span>{error}</span>
        </div>
      )}

      <div className="candidate-test-progress-bar">
        <div
          style={{
            width: `${
              questions.length
                ? ((currentQuestionIndex + 1) /
                    questions.length) *
                  100
                : 0
            }%`
          }}
        />
      </div>

      {currentQuestion ? (
        <section className="candidate-test-question-card">
          <div className="candidate-question-meta">
            <span>
              {currentQuestion.code ||
                `Q${currentQuestionIndex + 1}`}
            </span>
            <span>
              {currentQuestion.category ||
                'Competence assessment'}
            </span>
          </div>

          <h1>{currentQuestion.question_text}</h1>

          {currentQuestion.description && (
            <p className="candidate-question-description">
              {currentQuestion.description}
            </p>
          )}

          <QuestionInput
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={(value) =>
              handleAnswerChange(
                currentQuestion.id,
                value
              )
            }
          />

          <div className="candidate-test-question-actions">
            <button
              type="button"
              className="candidate-test-secondary-button"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            {currentQuestionIndex <
            questions.length - 1 ? (
              <button
                type="button"
                className="candidate-test-primary-button"
                onClick={handleNext}
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="candidate-test-submit-button"
                onClick={() =>
                  setShowSubmitConfirm(true)
                }
              >
                <Send size={16} />
                Submit test
              </button>
            )}
          </div>
        </section>
      ) : (
        <div className="candidate-test-empty">
          <ClipboardCheck size={32} />
          <h2>No questions available</h2>
          <p>
            This assessment has not been configured yet.
          </p>
          <button
            type="button"
            className="candidate-test-secondary-button"
            onClick={() =>
              navigate('/dashboard/candidate/tests')
            }
          >
            Back to my tests
          </button>
        </div>
      )}

      {showSubmitConfirm && (
        <div className="candidate-test-modal-overlay">
          <div className="candidate-test-confirm-modal">
            <div className="candidate-test-confirm-icon">
              <Send size={22} />
            </div>
            <h2>Submit this assessment?</h2>
            <p>
              You have answered {answeredCount} of{' '}
              {questions.length} questions. After submission,
              you may not be able to edit your answers.
            </p>
            <div className="candidate-test-modal-actions">
              <button
                type="button"
                className="candidate-test-secondary-button"
                onClick={() =>
                  setShowSubmitConfirm(false)
                }
              >
                Continue testing
              </button>
              <button
                type="button"
                className="candidate-test-submit-button"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InstructionsState = ({
  assessment,
  questions,
  onStart,
  onBack
}) => (
  <div className="candidate-test-detail-page">
    <button
      type="button"
      className="candidate-test-back-button"
      onClick={onBack}
    >
      <ArrowLeft size={17} />
      My tests
    </button>

    <section className="candidate-test-instructions-card">
      <div className="candidate-test-instructions-icon">
        <ClipboardCheck size={30} />
      </div>

      <span className="candidate-test-eyebrow">
        METSAFE assessment
      </span>

      <h1>Competence and safety assessment</h1>

      <p>
        This assessment helps evaluate your knowledge,
        practical skills and safety behaviour.
      </p>

      <div className="candidate-test-instructions-grid">
        <InstructionItem
          icon={<ClipboardCheck size={18} />}
          label="Questions"
          value={`${questions.length} questions`}
        />
        <InstructionItem
          icon={<Clock3 size={18} />}
          label="Format"
          value="Knowledge and safety"
        />
        <InstructionItem
          icon={<Award size={18} />}
          label="Result"
          value="CI and Level 0–5"
        />
        <InstructionItem
          icon={<Info size={18} />}
          label="Assessment ID"
          value={assessment?.id || '—'}
        />
      </div>

      <div className="candidate-test-rules">
        <h2>Before you begin</h2>
        <ul>
          <li>Read every question carefully before answering.</li>
          <li>Choose the answer that best reflects safe and correct behaviour.</li>
          <li>Do not close the page while completing the assessment.</li>
          <li>Your result may contribute to your Competence Index.</li>
        </ul>
      </div>

      <div className="candidate-test-instructions-actions">
        <button
          type="button"
          className="candidate-test-secondary-button"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className="candidate-test-primary-button"
          onClick={onStart}
        >
          Start assessment
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  </div>
);

const InstructionItem = ({ icon, label, value }) => (
  <div className="candidate-test-instruction-item">
    <div>{icon}</div>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const QuestionInput = ({ question, value, onChange }) => {
  const options = getQuestionOptions(question);

  if (question.question_type === 'text' || options.length === 0) {
    return (
      <textarea
        className="candidate-question-textarea"
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Write your answer..."
        rows={6}
      />
    );
  }

  return (
    <div className="candidate-question-options">
      {options.map((option, index) => {
        const optionValue =
          typeof option === 'string'
            ? option
            : option.value || option.label;
        const optionLabel =
          typeof option === 'string'
            ? option
            : option.label || option.value;

        return (
          <label
            className={`candidate-question-option ${
              value === optionValue ? 'selected' : ''
            }`}
            key={`${optionValue}-${index}`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={optionValue}
              checked={value === optionValue}
              onChange={() => onChange(optionValue)}
            />
            <span className="candidate-question-radio" />
            <span>{optionLabel}</span>
          </label>
        );
      })}
    </div>
  );
};

const CompletedState = ({ assessment, navigate }) => (
  <div className="candidate-test-detail-page">
    <section className="candidate-test-completed-card">
      <div className="candidate-test-completed-icon">
        <CheckCircle2 size={38} />
      </div>
      <span className="candidate-test-eyebrow">
        Assessment completed
      </span>
      <h1>Your assessment was submitted</h1>
      <p>
        Your answers have been recorded. The result will be
        reflected in your candidate workspace after processing.
      </p>
      <div className="candidate-test-completed-summary">
        <div>
          <span>Status</span>
          <strong>Completed</strong>
        </div>
        <div>
          <span>Score</span>
          <strong>{formatScore(assessment?.total_score)}</strong>
        </div>
        <div>
          <span>Level</span>
          <strong>{assessment?.level || 'Pending'}</strong>
        </div>
      </div>
      <button
        type="button"
        className="candidate-test-primary-button"
        onClick={() => navigate('/dashboard/candidate/tests')}
      >
        Back to my tests
        <ArrowRight size={16} />
      </button>
    </section>
  </div>
);

const loadAssessmentQuestions = async (assessmentId) => {
  const { data, error } = await supabase
    .from('assessment_questions')
    .select(`
      id,
      assessment_id,
      question_text,
      description,
      question_type,
      options,
      code,
      category,
      sort_order
    `)
    .eq('assessment_id', assessmentId)
    .order('sort_order', { ascending: true });

  if (error) {
    if (error.code === '42P01' || error.code === 'PGRST205') {
      return [];
    }
    throw error;
  }

  return data || [];
};

const getQuestionOptions = (question) => {
  if (Array.isArray(question.options)) {
    return question.options;
  }

  if (typeof question.options === 'string') {
    try {
      const parsed = JSON.parse(question.options);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

const formatScore = (score) => {
  const numericScore = Number(score);
  return Number.isFinite(numericScore)
    ? numericScore.toFixed(1)
    : '—';
};

export default CandidateTestDetail;