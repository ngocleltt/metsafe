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
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../../components/styles/CandidateTestDetail.css';

const copy = {
  en: {
    loading: 'Loading assessment...',
    unavailable: 'Assessment unavailable',
    backToTests: 'Back to my tests',
    myTests: 'My tests',
    question: 'Question',
    of: 'of',
    answered: 'answered',
    competence: 'Competence assessment',
    previous: 'Previous',
    next: 'Next',
    submitTest: 'Submission is not ready',
    emptyTitle: 'No questions available',
    emptyBody: 'This assessment has not been configured yet.',
    notReady:
      'Answers are not saved yet. Submission is disabled so your answers cannot be lost.',
    assessmentEyebrow: 'METSAFE assessment',
    assessmentTitle: 'Competence and safety assessment',
    assessmentDescription:
      'This assessment helps evaluate your knowledge and safety decisions.',
    questions: 'Questions',
    format: 'Format',
    formatValue: 'Knowledge and safety',
    result: 'Result',
    resultValue: 'Pending implementation',
    assessmentId: 'Assessment ID',
    beforeBegin: 'Before you begin',
    rules: [
      'Read every question carefully before answering.',
      'Choose the answer that best reflects safe and correct behaviour.',
      'Answers are not saved if you close or reload this page.',
      'Submission will be enabled after answer saving is implemented.'
    ],
    back: 'Back',
    startAssessment: 'Start assessment',
    completedEyebrow: 'Assessment completed',
    completedTitle: 'Assessment completed',
    completedBody:
      'This assessment is marked as completed. The current page does not retrieve saved answers.',
    status: 'Status',
    completed: 'Completed',
    score: 'Score',
    level: 'Level',
    pending: 'Pending',
    textPlaceholder: 'Write your answer...',
    sessionUnavailable: 'Your user session is not available.',
    profileUnavailable: 'Your candidate profile is not linked yet.',
    assessmentUnavailable: 'This assessment is not available.',
    loadFailed: 'Unable to load this assessment.',
    cancelled: 'This assessment was cancelled.',
    noQuestions: 'This assessment has no questions yet.'
  },
  vi: {
    loading: 'Đang tải bài đánh giá...',
    unavailable: 'Không thể mở bài đánh giá',
    backToTests: 'Quay lại danh sách bài test',
    myTests: 'Bài test của tôi',
    question: 'Câu',
    of: 'trên',
    answered: 'đã trả lời',
    competence: 'Đánh giá năng lực',
    previous: 'Câu trước',
    next: 'Câu tiếp',
    submitTest: 'Chưa thể nộp bài',
    emptyTitle: 'Chưa có câu hỏi',
    emptyBody: 'Bài đánh giá này chưa được cấu hình câu hỏi.',
    notReady:
      'Đáp án chưa được lưu. Chức năng nộp bài đang bị khóa để tránh mất câu trả lời.',
    assessmentEyebrow: 'Bài đánh giá METSAFE',
    assessmentTitle: 'Đánh giá năng lực và an toàn',
    assessmentDescription:
      'Bài đánh giá giúp xem xét kiến thức và quyết định về an toàn của bạn.',
    questions: 'Câu hỏi',
    format: 'Hình thức',
    formatValue: 'Kiến thức và an toàn',
    result: 'Kết quả',
    resultValue: 'Chưa triển khai',
    assessmentId: 'Mã bài đánh giá',
    beforeBegin: 'Trước khi bắt đầu',
    rules: [
      'Đọc kỹ từng câu hỏi trước khi trả lời.',
      'Chọn phương án phản ánh hành vi an toàn và phù hợp nhất.',
      'Đáp án sẽ mất nếu bạn đóng hoặc tải lại trang.',
      'Chức năng nộp bài sẽ mở sau khi có tính năng lưu đáp án.'
    ],
    back: 'Quay lại',
    startAssessment: 'Bắt đầu',
    completedEyebrow: 'Bài đánh giá đã hoàn thành',
    completedTitle: 'Bài đánh giá đã hoàn thành',
    completedBody:
      'Bài này có trạng thái hoàn thành. Trang hiện chưa tải lại các đáp án đã lưu.',
    status: 'Trạng thái',
    completed: 'Hoàn thành',
    score: 'Điểm',
    level: 'Cấp độ',
    pending: 'Chưa có',
    textPlaceholder: 'Nhập câu trả lời...',
    sessionUnavailable: 'Không tìm thấy phiên đăng nhập.',
    profileUnavailable: 'Hồ sơ ứng viên của bạn chưa được liên kết.',
    assessmentUnavailable: 'Bạn không thể truy cập bài đánh giá này.',
    loadFailed: 'Không thể tải bài đánh giá.',
    cancelled: 'Bài đánh giá này đã bị hủy.',
    noQuestions: 'Bài đánh giá này chưa có câu hỏi.'
  },
  ru: {
    loading: 'Загрузка оценки...',
    unavailable: 'Оценка недоступна',
    backToTests: 'Вернуться к тестам',
    myTests: 'Мои тесты',
    question: 'Вопрос',
    of: 'из',
    answered: 'отвечено',
    competence: 'Оценка компетенций',
    previous: 'Назад',
    next: 'Далее',
    submitTest: 'Отправка пока недоступна',
    emptyTitle: 'Нет вопросов',
    emptyBody: 'Вопросы для этой оценки ещё не настроены.',
    notReady:
      'Ответы пока не сохраняются. Отправка отключена, чтобы не потерять ваши ответы.',
    assessmentEyebrow: 'Оценка METSAFE',
    assessmentTitle: 'Оценка компетенций и безопасности',
    assessmentDescription:
      'Эта оценка помогает оценить знания и решения в области безопасности.',
    questions: 'Вопросы',
    format: 'Формат',
    formatValue: 'Знания и безопасность',
    result: 'Результат',
    resultValue: 'Пока не реализовано',
    assessmentId: 'ID оценки',
    beforeBegin: 'Перед началом',
    rules: [
      'Внимательно прочитайте каждый вопрос перед ответом.',
      'Выберите вариант, наиболее соответствующий безопасным действиям.',
      'Ответы не сохраняются при закрытии или перезагрузке страницы.',
      'Отправка станет доступна после реализации сохранения ответов.'
    ],
    back: 'Назад',
    startAssessment: 'Начать оценку',
    completedEyebrow: 'Оценка завершена',
    completedTitle: 'Оценка завершена',
    completedBody:
      'Эта оценка имеет статус «Завершена». На этой странице пока нельзя загрузить сохранённые ответы.',
    status: 'Статус',
    completed: 'Завершена',
    score: 'Балл',
    level: 'Уровень',
    pending: 'Нет данных',
    textPlaceholder: 'Введите ответ...',
    sessionUnavailable: 'Сеанс пользователя недоступен.',
    profileUnavailable: 'Профиль кандидата ещё не привязан.',
    assessmentUnavailable: 'Эта оценка недоступна.',
    loadFailed: 'Не удалось загрузить оценку.',
    cancelled: 'Эта оценка отменена.',
    noQuestions: 'В этой оценке пока нет вопросов.'
  }
};

const CandidateTestDetail = ({ currentLang = 'en' }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const language = copy[currentLang] ? currentLang : 'en';
  const text = copy[language];

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [pageState, setPageState] = useState('loading');
  const [error, setError] = useState('');

  const loadTest = useCallback(async () => {
    setPageState('loading');
    setError('');
    setAssessment(null);
    setQuestions([]);
    setAnswers({});
    setCurrentQuestionIndex(0);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) throw userError;
      if (!userData?.user?.id) {
        throw new Error('SESSION_UNAVAILABLE');
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, candidate_id')
        .eq('id', userData.user.id)
        .single();

      if (profileError) throw profileError;

      if (profile.role !== 'candidate' || !profile.candidate_id) {
        throw new Error('PROFILE_UNAVAILABLE');
      }

      const { data: assessmentData, error: assessmentError } =
        await supabase
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
        throw new Error('ASSESSMENT_UNAVAILABLE');
      }

      setAssessment(assessmentData);

      if (assessmentData.status === 'completed') {
        setPageState('completed');
        return;
      }

      if (assessmentData.status === 'cancelled') {
        throw new Error('CANCELLED');
      }

      const loadedQuestions = await loadAssessmentQuestions(id);
      setQuestions(loadedQuestions);
      setPageState('instructions');
    } catch (loadError) {
      console.error('Candidate test loading error:', loadError);
      setError(loadError?.message || 'LOAD_FAILED');
      setPageState('error');
    }
  }, [id]);

  useEffect(() => {
    loadTest();
  }, [loadTest]);

  const displayedQuestions = useMemo(
    () => questions.map((question) =>
      localizeQuestion(question, language)
    ),
    [questions, language]
  );

  const currentQuestion = displayedQuestions[currentQuestionIndex];

  const answeredCount = useMemo(
    () => questions.filter((question) => {
      const answer = answers[question.id];

      return (
        answer !== undefined &&
        answer !== null &&
        String(answer).trim() !== ''
      );
    }).length,
    [answers, questions]
  );

  const getErrorMessage = (value) => {
    const knownErrors = {
      SESSION_UNAVAILABLE: text.sessionUnavailable,
      PROFILE_UNAVAILABLE: text.profileUnavailable,
      ASSESSMENT_UNAVAILABLE: text.assessmentUnavailable,
      CANCELLED: text.cancelled,
      LOAD_FAILED: text.loadFailed
    };

    return knownErrors[value] || value || text.loadFailed;
  };

  const backToTests = () => {
    navigate('/dashboard/candidate/tests');
  };

  const handleStart = () => {
    if (questions.length === 0) {
      setError(text.noQuestions);
      return;
    }

    // Status vẫn là draft: enum hiện chưa có in_progress.
    setError('');
    setPageState('testing');
  };

  const handleAnswerChange = (questionId, value) => {
    // Chỉ lưu tạm trong React state để thử giao diện.
    setAnswers((current) => ({
      ...current,
      [questionId]: value
    }));
  };

  if (pageState === 'loading') {
    return (
      <div className="candidate-test-detail-page">
        <div className="candidate-test-loading">
          {text.loading}
        </div>
      </div>
    );
  }

  if (pageState === 'error') {
    return (
      <div className="candidate-test-detail-page">
        <div className="candidate-test-error-card">
          <ShieldAlert size={32} />
          <h1>{text.unavailable}</h1>
          <p>{getErrorMessage(error)}</p>
          <button
            type="button"
            className="candidate-test-primary-button"
            onClick={backToTests}
          >
            {text.backToTests}
          </button>
        </div>
      </div>
    );
  }

  if (pageState === 'completed') {
    return (
      <CompletedState
        assessment={assessment}
        onBack={backToTests}
        text={text}
      />
    );
  }

  if (pageState === 'instructions') {
    return (
      <InstructionsState
        assessment={assessment}
        questionCount={questions.length}
        onStart={handleStart}
        onBack={backToTests}
        text={text}
        error={error}
      />
    );
  }

  return (
    <div className="candidate-test-detail-page">
      <header className="candidate-test-topbar">
        <button
          type="button"
          className="candidate-test-back-button"
          onClick={backToTests}
        >
          <ArrowLeft size={17} />
          {text.myTests}
        </button>

        <div className="candidate-test-progress-summary">
          <span>
            {text.question} {currentQuestionIndex + 1}{' '}
            {text.of} {questions.length}
          </span>
          <strong>
            {answeredCount}/{questions.length} {text.answered}
          </strong>
        </div>
      </header>

      <div className="candidate-test-progress-bar">
        <div
          style={{
            width: `${
              questions.length
                ? ((currentQuestionIndex + 1) / questions.length) * 100
                : 0
            }%`
          }}
        />
      </div>

      {currentQuestion ? (
        <section className="candidate-test-question-card">
          <div className="candidate-question-meta">
            <span>
              {currentQuestion.question_code ||
                `Q${currentQuestionIndex + 1}`}
            </span>
            <span>{text.competence}</span>
          </div>

          <h1>{currentQuestion.question_text}</h1>

          <QuestionInput
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={(value) =>
              handleAnswerChange(currentQuestion.id, value)
            }
            placeholder={text.textPlaceholder}
          />

          <div className="candidate-test-question-actions">
            <button
              type="button"
              className="candidate-test-secondary-button"
              disabled={currentQuestionIndex === 0}
              onClick={() =>
                setCurrentQuestionIndex((index) =>
                  Math.max(0, index - 1)
                )
              }
            >
              <ArrowLeft size={16} />
              {text.previous}
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                type="button"
                className="candidate-test-primary-button"
                onClick={() =>
                  setCurrentQuestionIndex((index) =>
                    Math.min(questions.length - 1, index + 1)
                  )
                }
              >
                {text.next}
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="candidate-test-submit-button"
                disabled
                title={text.notReady}
              >
                <Send size={16} />
                {text.submitTest}
              </button>
            )}
          </div>

          <p role="status">{text.notReady}</p>
        </section>
      ) : (
        <div className="candidate-test-empty">
          <ClipboardCheck size={32} />
          <h2>{text.emptyTitle}</h2>
          <p>{text.emptyBody}</p>
          <button
            type="button"
            className="candidate-test-secondary-button"
            onClick={backToTests}
          >
            {text.backToTests}
          </button>
        </div>
      )}
    </div>
  );
};

const InstructionsState = ({
  assessment,
  questionCount,
  onStart,
  onBack,
  text,
  error
}) => (
  <div className="candidate-test-detail-page">
    <button
      type="button"
      className="candidate-test-back-button"
      onClick={onBack}
    >
      <ArrowLeft size={17} />
      {text.myTests}
    </button>

    {error && (
      <div className="candidate-test-error" role="alert">
        <ShieldAlert size={17} />
        <span>{error}</span>
      </div>
    )}

    <section className="candidate-test-instructions-card">
      <div className="candidate-test-instructions-icon">
        <ClipboardCheck size={30} />
      </div>

      <span className="candidate-test-eyebrow">
        {text.assessmentEyebrow}
      </span>

      <h1>{text.assessmentTitle}</h1>
      <p>{text.assessmentDescription}</p>

      <div className="candidate-test-instructions-grid">
        <InstructionItem
          icon={<ClipboardCheck size={18} />}
          label={text.questions}
          value={String(questionCount)}
        />
        <InstructionItem
          icon={<Clock3 size={18} />}
          label={text.format}
          value={text.formatValue}
        />
        <InstructionItem
          icon={<Award size={18} />}
          label={text.result}
          value={text.resultValue}
        />
        <InstructionItem
          icon={<Info size={18} />}
          label={text.assessmentId}
          value={assessment?.id || '—'}
        />
      </div>

      <div className="candidate-test-rules">
        <h2>{text.beforeBegin}</h2>
        <ul>
          {text.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>

      <div className="candidate-test-instructions-actions">
        <button
          type="button"
          className="candidate-test-secondary-button"
          onClick={onBack}
        >
          {text.back}
        </button>
        <button
          type="button"
          className="candidate-test-primary-button"
          onClick={onStart}
          disabled={questionCount === 0}
        >
          {text.startAssessment}
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

const QuestionInput = ({
  question,
  value,
  onChange,
  placeholder
}) => {
  const options = getQuestionOptions(question);

  if (question.question_type === 'text' || options.length === 0) {
    return (
      <textarea
        className="candidate-question-textarea"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
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
            : option?.value ?? option?.label ?? '';

        const optionLabel =
          typeof option === 'string'
            ? option
            : option?.label ?? option?.value ?? '';

        return (
          <label
            className={`candidate-question-option ${
              value === optionValue ? 'selected' : ''
            }`}
            key={`${String(optionValue)}-${index}`}
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

const CompletedState = ({ assessment, onBack, text }) => (
  <div className="candidate-test-detail-page">
    <section className="candidate-test-completed-card">
      <div className="candidate-test-completed-icon">
        <CheckCircle2 size={38} />
      </div>

      <span className="candidate-test-eyebrow">
        {text.completedEyebrow}
      </span>

      <h1>{text.completedTitle}</h1>
      <p>{text.completedBody}</p>

      <div className="candidate-test-completed-summary">
        <div>
          <span>{text.status}</span>
          <strong>{text.completed}</strong>
        </div>
        <div>
          <span>{text.score}</span>
          <strong>{formatScore(assessment?.total_score)}</strong>
        </div>
        <div>
          <span>{text.level}</span>
          <strong>{assessment?.level ?? text.pending}</strong>
        </div>
      </div>

      <button
        type="button"
        className="candidate-test-primary-button"
        onClick={onBack}
      >
        {text.backToTests}
        <ArrowRight size={16} />
      </button>
    </section>
  </div>
);

const loadAssessmentQuestions = async (assessmentId) => {
    const { data: links, error: linksError } = await supabase
      .from('assessment_questions')
      .select('assessment_id, question_id, sort_order')
      .eq('assessment_id', assessmentId)
      .order('sort_order', { ascending: true });

    if (linksError) {
      console.error('Cannot load assessment-question links:', linksError);
      throw linksError;
    }

    console.log('Assessment ID:', assessmentId);
    console.log('Visible links:', links);

    if (!links?.length) {
      throw new Error(
        'Không thấy liên kết câu hỏi cho assessment này. Kiểm tra ID trên URL và quyền đọc assessment_questions.'
      );
    }

    const questionIds = links.map((link) => link.question_id);

    const { data: questionRows, error: questionsError } = await supabase
      .from('questions')
      .select(`
        id,
        question_code,
        question_type,
        question_text,
        question_text_vi,
        question_text_ru,
        options,
        options_vi,
        options_ru
      `)
      .in('id', questionIds);

    if (questionsError) {
      console.error('Cannot load questions:', questionsError);
      throw questionsError;
    }

    console.log('Visible questions:', questionRows);

    const questionsById = new Map(
      (questionRows || []).map((question) => [
        question.id,
        question
      ])
    );

    const result = links
      .map((link) => {
        const question = questionsById.get(link.question_id);

        if (!question) return null;

        return {
          ...question,
          assessment_id: link.assessment_id,
          assessment_sort_order: link.sort_order
        };
      })
      .filter(Boolean);

    if (result.length !== links.length) {
      throw new Error(
        'Có liên kết câu hỏi nhưng tài khoản hiện tại không đọc được nội dung questions.'
      );
    }

    return result;
  };

const localizeQuestion = (question, language) => {
  if (language === 'en') return question;

  const suffix = `_${language}`;
  const translatedOptions = getQuestionOptions({
    options: question[`options${suffix}`]
  });

  return {
    ...question,
    question_text:
      question[`question_text${suffix}`]?.trim() ||
      question.question_text,
    options:
      translatedOptions.length > 0
        ? translatedOptions
        : question.options
  };
};

const getQuestionOptions = (question) => {
  if (Array.isArray(question?.options)) {
    return question.options;
  }

  if (typeof question?.options === 'string') {
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
  if (score === null || score === undefined || score === '') {
    return '—';
  }

  const numericScore = Number(score);

  return Number.isFinite(numericScore)
    ? numericScore.toFixed(1)
    : '—';
};

export default CandidateTestDetail;