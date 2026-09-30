import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Award, CheckCircle2, ClipboardCheck,
  Clock3, Info, Send, ShieldAlert
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../../components/styles/CandidateTestDetail.css';

const copy = {
  en: {
    loading: 'Loading assessment...', unavailable: 'Assessment unavailable',
    backToTests: 'Back to my tests', myTests: 'My tests', question: 'Question', of: 'of',
    answered: 'saved', competence: 'Competence assessment', previous: 'Previous', next: 'Next',
    submitTest: 'Submit test', emptyTitle: 'No questions available',
    emptyBody: 'This assessment has not been configured yet.',
    saving: 'Saving answer...', saved: 'Answer saved.', saveError: 'Could not save your answer.',
    confirmTitle: 'Submit this assessment?',
    confirmBody: 'Your saved answers will be graded and you will not be able to edit them afterwards.',
    cancelSubmit: 'Continue testing', confirmSubmit: 'Submit', submitting: 'Submitting...',
    answerAll: 'Save an answer for every question before submitting.',
    assessmentEyebrow: 'METSAFE assessment', assessmentTitle: 'Competence and safety assessment',
    assessmentDescription: 'This assessment evaluates your safety knowledge and decisions.',
    questions: 'Questions', format: 'Format', formatValue: 'Knowledge and safety',
    result: 'Result', resultValue: 'Test score after submission', assessmentId: 'Assessment ID',
    beforeBegin: 'Before you begin', rules: [
      'Read each question carefully before answering.',
      'Choose the option that best reflects safe and correct behaviour.',
      'Wait for the saved confirmation before navigating away.',
      'You must save all answers before submitting.'
    ],
    back: 'Back', startAssessment: 'Start assessment', starting: 'Starting...',
    completedEyebrow: 'Assessment completed', completedTitle: 'Your assessment was submitted',
    completedBody: 'Your answers were graded. This test score is not your overall Competence Index.',
    status: 'Status', completed: 'Completed', score: 'Test score', level: 'CI level', pending: 'Not calculated',
    sessionUnavailable: 'Your user session is not available.',
    profileUnavailable: 'Your candidate profile is not linked yet.',
    assessmentUnavailable: 'This assessment is not available.',
    loadFailed: 'Unable to load this assessment.', cancelled: 'This assessment was cancelled.',
    noQuestions: 'This assessment has no questions yet.',
    multipleTests: 'This page currently supports one test per assessment.',
    attemptClosed: 'This attempt can no longer be edited.',
    unsupportedQuestion: 'Answer saving is not supported for this question type.'
  },
  vi: {
    loading: 'Đang tải bài đánh giá...', unavailable: 'Không thể mở bài đánh giá',
    backToTests: 'Quay lại danh sách bài test', myTests: 'Bài test của tôi', question: 'Câu', of: 'trên',
    answered: 'đã lưu', competence: 'Đánh giá năng lực', previous: 'Câu trước', next: 'Câu tiếp',
    submitTest: 'Nộp bài', emptyTitle: 'Chưa có câu hỏi',
    emptyBody: 'Bài đánh giá này chưa được cấu hình câu hỏi.',
    saving: 'Đang lưu đáp án...', saved: 'Đã lưu đáp án.', saveError: 'Không lưu được đáp án.',
    confirmTitle: 'Nộp bài đánh giá này?',
    confirmBody: 'Các đáp án đã lưu sẽ được chấm điểm và bạn sẽ không thể sửa sau khi nộp.',
    cancelSubmit: 'Tiếp tục làm bài', confirmSubmit: 'Xác nhận nộp', submitting: 'Đang nộp...',
    answerAll: 'Hãy lưu đáp án cho tất cả câu hỏi trước khi nộp.',
    assessmentEyebrow: 'Bài đánh giá METSAFE', assessmentTitle: 'Đánh giá năng lực và an toàn',
    assessmentDescription: 'Bài đánh giá xem xét kiến thức và quyết định về an toàn của bạn.',
    questions: 'Câu hỏi', format: 'Hình thức', formatValue: 'Kiến thức và an toàn',
    result: 'Kết quả', resultValue: 'Điểm bài test sau khi nộp', assessmentId: 'Mã bài đánh giá',
    beforeBegin: 'Trước khi bắt đầu', rules: [
      'Đọc kỹ từng câu hỏi trước khi trả lời.',
      'Chọn phương án phản ánh hành vi an toàn và phù hợp nhất.',
      'Chờ thông báo đã lưu trước khi rời trang.',
      'Bạn cần lưu hết đáp án trước khi nộp.'
    ],
    back: 'Quay lại', startAssessment: 'Bắt đầu', starting: 'Đang bắt đầu...',
    completedEyebrow: 'Đã hoàn thành bài đánh giá', completedTitle: 'Bài đánh giá đã được nộp',
    completedBody: 'Đáp án đã được chấm. Điểm bài test này không phải Chỉ số năng lực CI tổng hợp.',
    status: 'Trạng thái', completed: 'Hoàn thành', score: 'Điểm bài test', level: 'Cấp CI', pending: 'Chưa tính',
    sessionUnavailable: 'Không tìm thấy phiên đăng nhập.',
    profileUnavailable: 'Hồ sơ ứng viên của bạn chưa được liên kết.',
    assessmentUnavailable: 'Bạn không thể truy cập bài đánh giá này.',
    loadFailed: 'Không thể tải bài đánh giá.', cancelled: 'Bài đánh giá này đã bị hủy.',
    noQuestions: 'Bài đánh giá này chưa có câu hỏi.',
    multipleTests: 'Trang hiện chỉ hỗ trợ một bộ test cho mỗi bài đánh giá.',
    attemptClosed: 'Không thể sửa bài làm này.',
    unsupportedQuestion: 'Chưa hỗ trợ lưu đáp án cho loại câu hỏi này.'
  },
  ru: {
    loading: 'Загрузка оценки...', unavailable: 'Оценка недоступна',
    backToTests: 'Вернуться к тестам', myTests: 'Мои тесты', question: 'Вопрос', of: 'из',
    answered: 'сохранено', competence: 'Оценка компетенций', previous: 'Назад', next: 'Далее',
    submitTest: 'Отправить тест', emptyTitle: 'Нет вопросов',
    emptyBody: 'Вопросы для этой оценки ещё не настроены.',
    saving: 'Сохранение ответа...', saved: 'Ответ сохранён.', saveError: 'Не удалось сохранить ответ.',
    confirmTitle: 'Отправить эту оценку?',
    confirmBody: 'Сохранённые ответы будут оценены, после отправки их нельзя будет изменить.',
    cancelSubmit: 'Продолжить тест', confirmSubmit: 'Отправить', submitting: 'Отправка...',
    answerAll: 'Сохраните ответы на все вопросы перед отправкой.',
    assessmentEyebrow: 'Оценка METSAFE', assessmentTitle: 'Оценка компетенций и безопасности',
    assessmentDescription: 'Эта оценка помогает оценить знания и решения в области безопасности.',
    questions: 'Вопросы', format: 'Формат', formatValue: 'Знания и безопасность',
    result: 'Результат', resultValue: 'Балл теста после отправки', assessmentId: 'ID оценки',
    beforeBegin: 'Перед началом', rules: [
      'Внимательно прочитайте каждый вопрос перед ответом.',
      'Выберите вариант, наиболее соответствующий безопасным действиям.',
      'Дождитесь подтверждения сохранения перед уходом со страницы.',
      'Перед отправкой необходимо сохранить все ответы.'
    ],
    back: 'Назад', startAssessment: 'Начать оценку', starting: 'Запуск...',
    completedEyebrow: 'Оценка завершена', completedTitle: 'Оценка отправлена',
    completedBody: 'Ответы оценены. Балл этого теста не является общим индексом компетенций CI.',
    status: 'Статус', completed: 'Завершена', score: 'Балл теста', level: 'Уровень CI', pending: 'Не рассчитан',
    sessionUnavailable: 'Сеанс пользователя недоступен.',
    profileUnavailable: 'Профиль кандидата ещё не привязан.',
    assessmentUnavailable: 'Эта оценка недоступна.',
    loadFailed: 'Не удалось загрузить оценку.', cancelled: 'Эта оценка отменена.',
    noQuestions: 'В этой оценке пока нет вопросов.',
    multipleTests: 'Страница пока поддерживает только один тест на оценку.',
    attemptClosed: 'Эту попытку нельзя редактировать.',
    unsupportedQuestion: 'Сохранение ответов для этого типа вопроса пока не поддерживается.'
  }
};

const parseOptions = (options) => {
  if (Array.isArray(options)) return options;
  if (typeof options === 'string') {
    try {
      const parsed = JSON.parse(options);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
  return [];
};

const localizeQuestion = (question, language) => {
  if (language === 'en') return question;
  const translatedOptions = parseOptions(question[`options_${language}`]);
  return {
    ...question,
    question_text: question[`question_text_${language}`]?.trim() || question.question_text,
    options: translatedOptions.length ? translatedOptions : question.options
  };
};

const friendlyError = (error, text) => ({
  SESSION_UNAVAILABLE: text.sessionUnavailable,
  PROFILE_UNAVAILABLE: text.profileUnavailable,
  ASSESSMENT_UNAVAILABLE: text.assessmentUnavailable,
  CANCELLED: text.cancelled,
  MULTIPLE_TESTS: text.multipleTests,
  ATTEMPT_CLOSED: text.attemptClosed,
  LOAD_FAILED: text.loadFailed
})[error] || error || text.loadFailed;

const loadAssessmentQuestions = async (assessmentId) => {
  const { data: links, error: linksError } = await supabase
    .from('assessment_questions')
    .select('assessment_id, question_id, sort_order')
    .eq('assessment_id', assessmentId)
    .order('sort_order', { ascending: true });
  if (linksError) throw linksError;
  if (!links?.length) return [];
  const { data: rows, error: questionsError } = await supabase
    .from('questions')
    .select('id, test_id, question_code, question_type, question_text, question_text_vi, question_text_ru, options, options_vi, options_ru')
    .in('id', links.map((link) => link.question_id));
  if (questionsError) throw questionsError;
  const byId = new Map((rows || []).map((question) => [question.id, question]));
  if (links.some((link) => !byId.has(link.question_id))) {
    throw new Error('Some assigned questions are not visible to this account.');
  }
  return links.map((link) => ({
    ...byId.get(link.question_id), assessment_sort_order: link.sort_order
  }));
};

const loadSavedAnswers = async (attemptId) => {
  const { data, error } = await supabase
    .from('answers').select('question_id, answer_value').eq('attempt_id', attemptId);
  if (error) throw error;
  return Object.fromEntries(
    (data || []).filter((row) => typeof row.answer_value === 'string')
      .map((row) => [row.question_id, row.answer_value])
  );
};

const formatScore = (score) => {
  if (score === null || score === undefined || score === '') return '—';
  const value = Number(score);
  return Number.isFinite(value) ? value.toFixed(1) : '—';
};

const CandidateTestDetail = ({ currentLang = 'en' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const language = copy[currentLang] ? currentLang : 'en';
  const text = copy[language];
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [pageState, setPageState] = useState('loading');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const loadTest = useCallback(async () => {
    setPageState('loading'); setError(''); setAssessment(null); setQuestions([]);
    setAnswers({}); setAttemptId(null); setCurrentQuestionIndex(0);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!userData?.user?.id) throw new Error('SESSION_UNAVAILABLE');
      const { data: profile, error: profileError } = await supabase
        .from('profiles').select('id, role, candidate_id')
        .eq('id', userData.user.id).single();
      if (profileError) throw profileError;
      if (profile.role !== 'candidate' || !profile.candidate_id) {
        throw new Error('PROFILE_UNAVAILABLE');
      }
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('id, candidate_id, assessment_date, total_score, level, status, model_version_id')
        .eq('id', id).eq('candidate_id', profile.candidate_id).maybeSingle();
      if (assessmentError) throw assessmentError;
      if (!assessmentData) throw new Error('ASSESSMENT_UNAVAILABLE');
      setAssessment(assessmentData);
      if (assessmentData.status === 'completed') { setPageState('completed'); return; }
      if (assessmentData.status === 'cancelled') throw new Error('CANCELLED');
      const loadedQuestions = await loadAssessmentQuestions(id);
      setQuestions(loadedQuestions);
      const testIds = [...new Set(loadedQuestions.map((question) => question.test_id))];
      if (testIds.length > 1) throw new Error('MULTIPLE_TESTS');
      if (!loadedQuestions.length) { setPageState('instructions'); return; }
      const { data: attempt, error: attemptError } = await supabase
        .from('test_attempts').select('id, status')
        .eq('assessment_id', id).eq('test_id', testIds[0]).maybeSingle();
      if (attemptError) throw attemptError;
      if (attempt) {
        if (attempt.status !== 'in_progress') throw new Error('ATTEMPT_CLOSED');
        const savedAnswers = await loadSavedAnswers(attempt.id);
        setAnswers(savedAnswers); setAttemptId(attempt.id); setPageState('testing');
      } else setPageState('instructions');
    } catch (loadError) {
      console.error('Candidate test loading error:', loadError);
      setError(loadError?.message || 'LOAD_FAILED'); setPageState('error');
    }
  }, [id]);

  useEffect(() => { loadTest(); }, [loadTest]);
  const displayedQuestions = useMemo(
    () => questions.map((question) => localizeQuestion(question, language)),
    [questions, language]
  );
  const currentQuestion = displayedQuestions[currentQuestionIndex];
  const answeredCount = useMemo(
    () => questions.filter((question) =>
      typeof answers[question.id] === 'string' && answers[question.id] !== ''
    ).length, [answers, questions]
  );
  const backToTests = () => navigate('/dashboard/candidate/tests');

  const handleStart = async () => {
    if (starting || !assessment?.id || !questions.length) return;
    setStarting(true); setError('');
    try {
      const { data: newAttemptId, error: startError } = await supabase.rpc(
        'start_candidate_attempt',
        { p_assessment_id: assessment.id, p_test_id: questions[0].test_id }
      );
      if (startError) throw startError;
      if (!newAttemptId) throw new Error('No attempt ID returned.');
      const savedAnswers = await loadSavedAnswers(newAttemptId);
      setAttemptId(newAttemptId); setAnswers(savedAnswers); setPageState('testing');
    } catch (startError) {
      console.error('Start attempt error:', startError);
      setError(startError?.message || text.loadFailed);
    } finally { setStarting(false); }
  };

  const handleAnswerChange = async (question, value) => {
    if (saving || submitting || !attemptId) return;
    if (question.question_type !== 'single_choice') {
      setError(text.unsupportedQuestion); return;
    }
    setSaving(true); setError(''); setSaveMessage('');
    try {
      const { data: answerId, error: saveError } = await supabase.rpc(
        'save_candidate_answer',
        { p_attempt_id: attemptId, p_question_id: question.id, p_answer_value: value }
      );
      if (saveError) throw saveError;
      if (!answerId) throw new Error(text.saveError);
      setAnswers((current) => ({ ...current, [question.id]: value }));
      setSaveMessage(text.saved);
    } catch (saveError) {
      console.error('Save answer error:', saveError);
      setError(saveError?.message || text.saveError);
    } finally { setSaving(false); }
  };

  const handleSubmit = async () => {
    if (submitting || saving || !attemptId || answeredCount !== questions.length || !questions.length) return;
    setSubmitting(true); setError('');
    try {
      const { data: score, error: submitError } = await supabase.rpc(
        'submit_candidate_attempt', { p_attempt_id: attemptId }
      );
      if (submitError) throw submitError;
      if (score === null || score === undefined || !Number.isFinite(Number(score))) {
        throw new Error('Submission returned no valid test score. Please refresh this page.');
      }
      setAssessment((current) => ({ ...current, status: 'completed', total_score: score }));
      setShowSubmitConfirm(false); setPageState('completed');
    } catch (submitError) {
      console.error('Submit assessment error:', submitError);
      setError(submitError?.message || text.loadFailed);
    } finally { setSubmitting(false); }
  };

  if (pageState === 'loading') return (
    <div className="candidate-test-detail-page"><div className="candidate-test-loading">{text.loading}</div></div>
  );
  if (pageState === 'error') return (
    <div className="candidate-test-detail-page"><div className="candidate-test-error-card">
      <ShieldAlert size={32} /><h1>{text.unavailable}</h1>
      <p>{friendlyError(error, text)}</p>
      <button type="button" className="candidate-test-primary-button" onClick={backToTests}>{text.backToTests}</button>
    </div></div>
  );
  if (pageState === 'completed') return (
    <CompletedState assessment={assessment} onBack={backToTests} text={text} />
  );
  if (pageState === 'instructions') return (
    <InstructionsState assessment={assessment} questionCount={questions.length}
      onStart={handleStart} onBack={backToTests} text={text} error={error} starting={starting} />
  );

  return (
    <div className="candidate-test-detail-page">
      <header className="candidate-test-topbar">
        <button type="button" className="candidate-test-back-button" onClick={backToTests} disabled={saving || submitting}>
          <ArrowLeft size={17} />{text.myTests}
        </button>
        <div className="candidate-test-progress-summary">
          <span>{text.question} {currentQuestionIndex + 1} {text.of} {questions.length}</span>
          <strong>{answeredCount}/{questions.length} {text.answered}</strong>
        </div>
      </header>
      {error && <div className="candidate-test-error" role="alert"><ShieldAlert size={17} /><span>{error}</span></div>}
      <div className="candidate-test-progress-bar">
        <div style={{ width: `${questions.length ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0}%` }} />
      </div>
      {currentQuestion ? (
        <section className="candidate-test-question-card">
          <div className="candidate-question-meta">
            <span>{currentQuestion.question_code || `Q${currentQuestionIndex + 1}`}</span>
            <span>{text.competence}</span>
          </div>
          <h1>{currentQuestion.question_text}</h1>
          <QuestionInput question={currentQuestion} value={answers[currentQuestion.id]}
            disabled={saving || submitting} onChange={(value) => handleAnswerChange(currentQuestion, value)} />
          <p role="status">{saving ? text.saving : saveMessage}</p>
          <div className="candidate-test-question-actions">
            <button type="button" className="candidate-test-secondary-button"
              disabled={saving || submitting || currentQuestionIndex === 0}
              onClick={() => { setSaveMessage(''); setCurrentQuestionIndex((index) => Math.max(0, index - 1)); }}>
              <ArrowLeft size={16} />{text.previous}
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button type="button" className="candidate-test-primary-button" disabled={saving || submitting}
                onClick={() => { setSaveMessage(''); setCurrentQuestionIndex((index) => Math.min(questions.length - 1, index + 1)); }}>
                {text.next}<ArrowRight size={16} />
              </button>
            ) : (
              <button type="button" className="candidate-test-submit-button"
                disabled={saving || submitting || answeredCount !== questions.length}
                onClick={() => { setError(''); setShowSubmitConfirm(true); }}>
                <Send size={16} />{text.submitTest}
              </button>
            )}
          </div>
          {answeredCount !== questions.length && <p role="status">{text.answerAll}</p>}
        </section>
      ) : (
        <div className="candidate-test-empty">
          <ClipboardCheck size={32} /><h2>{text.emptyTitle}</h2><p>{text.emptyBody}</p>
          <button type="button" className="candidate-test-secondary-button" onClick={backToTests}>{text.backToTests}</button>
        </div>
      )}
      {showSubmitConfirm && (
        <div className="candidate-test-modal-overlay">
          <div className="candidate-test-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="submit-confirm-title">
            <div className="candidate-test-confirm-icon"><Send size={22} /></div>
            <h2 id="submit-confirm-title">{text.confirmTitle}</h2>
            <p>{text.confirmBody}</p>
            {error && <div className="candidate-test-error" role="alert"><ShieldAlert size={17} /><span>{error}</span></div>}
            <div className="candidate-test-modal-actions">
              <button type="button" className="candidate-test-secondary-button"
                disabled={submitting} onClick={() => { setError(''); setShowSubmitConfirm(false); }}>
                {text.cancelSubmit}
              </button>
              <button type="button" className="candidate-test-submit-button"
                disabled={submitting || saving} onClick={handleSubmit}>
                {submitting ? text.submitting : text.confirmSubmit}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InstructionsState = ({ assessment, questionCount, onStart, onBack, text, error, starting }) => (
  <div className="candidate-test-detail-page">
    <button type="button" className="candidate-test-back-button" onClick={onBack}><ArrowLeft size={17} />{text.myTests}</button>
    {error && <div className="candidate-test-error" role="alert"><ShieldAlert size={17} /><span>{error}</span></div>}
    <section className="candidate-test-instructions-card">
      <div className="candidate-test-instructions-icon"><ClipboardCheck size={30} /></div>
      <span className="candidate-test-eyebrow">{text.assessmentEyebrow}</span>
      <h1>{text.assessmentTitle}</h1><p>{text.assessmentDescription}</p>
      <div className="candidate-test-instructions-grid">
        <InstructionItem icon={<ClipboardCheck size={18} />} label={text.questions} value={String(questionCount)} />
        <InstructionItem icon={<Clock3 size={18} />} label={text.format} value={text.formatValue} />
        <InstructionItem icon={<Award size={18} />} label={text.result} value={text.resultValue} />
        <InstructionItem icon={<Info size={18} />} label={text.assessmentId} value={assessment?.id || '—'} />
      </div>
      <div className="candidate-test-rules"><h2>{text.beforeBegin}</h2><ul>{text.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul></div>
      <div className="candidate-test-instructions-actions">
        <button type="button" className="candidate-test-secondary-button" onClick={onBack} disabled={starting}>{text.back}</button>
        <button type="button" className="candidate-test-primary-button" onClick={onStart} disabled={starting || !questionCount}>
          {starting ? text.starting : text.startAssessment}<ArrowRight size={16} />
        </button>
      </div>
    </section>
  </div>
);

const InstructionItem = ({ icon, label, value }) => (
  <div className="candidate-test-instruction-item"><div>{icon}</div><span>{label}</span><strong>{value}</strong></div>
);

const QuestionInput = ({ question, value, onChange, disabled }) => {
  const options = parseOptions(question.options);
  if (question.question_type !== 'single_choice' || !options.length) return null;
  return (
    <div className="candidate-question-options">
      {options.map((option) => {
        const optionValue = option?.value;
        return (
          <label className={`candidate-question-option ${value === optionValue ? 'selected' : ''}`} key={String(optionValue)}>
            <input type="radio" name={`question-${question.id}`} value={optionValue}
              checked={value === optionValue} disabled={disabled} onChange={() => onChange(optionValue)} />
            <span className="candidate-question-radio" /><span>{option?.label ?? optionValue}</span>
          </label>
        );
      })}
    </div>
  );
};

const CompletedState = ({ assessment, onBack, text }) => (
  <div className="candidate-test-detail-page">
    <section className="candidate-test-completed-card">
      <div className="candidate-test-completed-icon"><CheckCircle2 size={38} /></div>
      <span className="candidate-test-eyebrow">{text.completedEyebrow}</span>
      <h1>{text.completedTitle}</h1><p>{text.completedBody}</p>
      <div className="candidate-test-completed-summary">
        <div><span>{text.status}</span><strong>{text.completed}</strong></div>
        <div><span>{text.score}</span><strong>{formatScore(assessment?.total_score)}</strong></div>
        <div><span>{text.level}</span><strong>{assessment?.level ?? text.pending}</strong></div>
      </div>
      <button type="button" className="candidate-test-primary-button" onClick={onBack}>
        {text.backToTests}<ArrowRight size={16} />
      </button>
    </section>
  </div>
);

export default CandidateTestDetail;