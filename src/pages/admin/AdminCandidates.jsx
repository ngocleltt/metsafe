import React, { useEffect, useMemo, useState } from 'react';
import {
  ClipboardList,
  Search,
  UserPlus,
  UserRoundSearch
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import '../../components/styles/AdminCandidates.css';

const getStatusClass = (status) => {
  if (status === 'approved') return 'is-approved';
  if (status === 'rejected' || status === 'withdrawn') return 'is-rejected';
  if (status === 'under_review' || status === 'pending') return 'is-review';
  return 'is-default';
};

const dialogOverlayStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  background: 'rgba(15, 23, 42, 0.65)'
};

const dialogPanelStyle = {
  width: '100%',
  maxWidth: 480,
  maxHeight: '90vh',
  overflowY: 'auto',
  padding: 24,
  borderRadius: 16,
  background: '#fff',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
};

const AdminCandidates = ({ t }) => {
  const text = t.adminCandidates;

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [tests, setTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(true);
  const [testsError, setTestsError] = useState('');

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadCandidates = async () => {
      setLoading(true);
      setError('');

      try {
        const { data, error: queryError } = await supabase
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
          .order('created_at', { ascending: false });

        if (queryError) throw queryError;

        if (mounted) {
          setCandidates(data || []);
        }
      } catch (queryError) {
        console.error('Load candidates error:', queryError);

        if (mounted) {
          setError(text.loadError);
          setCandidates([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCandidates();

    return () => {
      mounted = false;
    };
  }, [text.loadError]);

  useEffect(() => {
    let mounted = true;

    const loadTests = async () => {
      setTestsLoading(true);
      setTestsError('');

      try {
        const { data, error: queryError } = await supabase
          .from('tests')
          .select(`
            id,
            code,
            title,
            model_version_id,
            questions(count)
          `)
          .eq('is_active', true)
          .order('title', { ascending: true });

        if (queryError) throw queryError;

        if (mounted) {
          setTests(data || []);
        }
      } catch (queryError) {
        console.error('Load tests error:', queryError);

        if (mounted) {
          setTestsError(text.testsError);
          setTests([]);
        }
      } finally {
        if (mounted) {
          setTestsLoading(false);
        }
      }
    };

    loadTests();

    return () => {
      mounted = false;
    };
  }, [text.testsError]);

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return candidates.filter((candidate) => {
      const matchesSearch =
        !normalizedSearch ||
        candidate.full_name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        candidate.candidate_code
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        candidate.email
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        candidate.phone
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' ||
        candidate.application_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => {
    return candidates.reduce((counts, candidate) => {
      const status = candidate.application_status || 'unknown';
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});
  }, [candidates]);

  const applicationStatuses = useMemo(() => {
    return [
      ...new Set(
        candidates
          .map((candidate) => candidate.application_status)
          .filter(Boolean)
      )
    ];
  }, [candidates]);

  const formatStatus = (status) => {
    return text.statuses[status] ?? text.statuses.unknown;
  };

  const getQuestionCount = (test) => {
    return Number(test.questions?.[0]?.count || 0);
  };

  const selectedTest = tests.find(
    (test) => test.id === selectedTestId
  );

  const canAssign = Boolean(
    selectedCandidate &&
    selectedTest &&
    selectedTest.model_version_id &&
    getQuestionCount(selectedTest) > 0 &&
    !assigning &&
    !testsLoading
  );

  const openAssignDialog = (candidate) => {
    setSelectedCandidate(candidate);
    setSelectedTestId('');
    setAssignError('');
    setSuccess('');
  };

  const closeAssignDialog = () => {
    if (assigning) return;

    setSelectedCandidate(null);
    setSelectedTestId('');
    setAssignError('');
  };

  const handleAssign = async () => {
    if (!canAssign) return;

    setAssigning(true);
    setAssignError('');
    setSuccess('');

    try {
      const { data: assessmentId, error: rpcError } =
        await supabase.rpc('assign_candidate_test', {
          p_test_id: selectedTest.id,
          p_candidate_id: selectedCandidate.id
        });

      if (rpcError) throw rpcError;
      if (!assessmentId) throw new Error(text.assignError);

      const candidateName =
        selectedCandidate.full_name || text.unnamedCandidate;

      const testTitle =
        selectedTest.title || selectedTest.code;

      setSuccess(
        text.assignSuccess
          .replace('{name}', candidateName)
          .replace('{test}', testTitle)
      );

      setSelectedCandidate(null);
      setSelectedTestId('');
    } catch (rpcError) {
      console.error('Assign candidate test error:', rpcError);

      setAssignError(
        rpcError?.message || text.assignError
      );
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="admin-candidates-page">
      <div className="admin-candidates-header">
        <div>
          <span className="admin-page-eyebrow">
            {text.eyebrow}
          </span>

          <h1>{text.title}</h1>
          <p>{text.description}</p>
        </div>

        {/* Chưa có modal thêm ứng viên nên tạm khóa nút */}
        <button
          type="button"
          className="admin-primary-button"
          disabled
        >
          <UserPlus size={17} aria-hidden="true" />
          {text.addCandidate}
        </button>
      </div>

      {success && (
        <div
          className="admin-page-success"
          role="status"
          style={{
            padding: 12,
            marginBottom: 16,
            background: '#dcfce7',
            color: '#166534',
            borderRadius: 8
          }}
        >
          {success}
        </div>
      )}

      <div className="candidate-stat-grid">
        <div className="candidate-stat-card">
          <div className="candidate-stat-icon">
            <UserRoundSearch size={20} aria-hidden="true" />
          </div>

          <div>
            <span>{text.totalCandidates}</span>
            <strong>{candidates.length}</strong>
          </div>
        </div>

        <div className="candidate-stat-card">
          <div className="candidate-stat-icon is-review">
            <UserRoundSearch size={20} aria-hidden="true" />
          </div>

          <div>
            <span>{text.underReview}</span>
            <strong>{statusCounts.under_review || 0}</strong>
          </div>
        </div>

        <div className="candidate-stat-card">
          <div className="candidate-stat-icon is-approved">
            <UserRoundSearch size={20} aria-hidden="true" />
          </div>

          <div>
            <span>{text.approved}</span>
            <strong>{statusCounts.approved || 0}</strong>
          </div>
        </div>
      </div>

      <section className="candidate-table-card">
        <div className="candidate-toolbar">
          <div className="candidate-search-box">
            <Search size={18} aria-hidden="true" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder={text.searchPlaceholder}
              aria-label={text.searchPlaceholder}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="candidate-status-filter"
            aria-label={text.allStatuses}
          >
            <option value="all">
              {text.allStatuses}
            </option>

            {applicationStatuses.map((status) => (
              <option value={status} key={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="admin-page-error" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="candidate-empty-state">
            {text.loading}
          </div>
        ) : error ? null : filteredCandidates.length === 0 ? (
          <div className="candidate-empty-state">
            <UserRoundSearch
              size={32}
              aria-hidden="true"
            />

            <h3>{text.emptyTitle}</h3>
            <p>{text.emptyDescription}</p>
          </div>
        ) : (
          <div className="candidate-table-wrapper">
            <table className="candidate-table">
              <thead>
                <tr>
                  <th>{text.columns.candidate}</th>
                  <th>{text.columns.contact}</th>
                  <th>{text.columns.position}</th>
                  <th>{text.columns.status}</th>
                  <th>{text.assignTest}</th>
                </tr>
              </thead>

              <tbody>
                {filteredCandidates.map((candidate) => {
                  const candidateName =
                    candidate.full_name ||
                    text.unnamedCandidate;

                  return (
                    <tr key={candidate.id}>
                      <td>
                        <div className="candidate-identity">
                          <div className="candidate-avatar">
                            {candidate.full_name
                              ?.charAt(0)
                              .toUpperCase() ||
                              text.candidateInitial}
                          </div>

                          <div>
                            <strong>{candidateName}</strong>
                            <span>
                              {candidate.candidate_code ||
                                text.noCandidateCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="candidate-contact">
                          <span>
                            {candidate.email || text.noEmail}
                          </span>
                          <span>
                            {candidate.phone || text.noPhone}
                          </span>
                        </div>
                      </td>

                      <td>
                        {candidate.position_id || '—'}
                      </td>

                      <td>
                        <span
                          className={`candidate-status ${getStatusClass(
                            candidate.application_status
                          )}`}
                        >
                          {formatStatus(
                            candidate.application_status
                          )}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="candidate-action-button"
                          onClick={() =>
                            openAssignDialog(candidate)
                          }
                          aria-label={`${text.assignTest}: ${candidateName}`}
                          title={`${text.assignTest}: ${candidateName}`}
                        >
                          <ClipboardList
                            size={18}
                            aria-hidden="true"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedCandidate && (
        <div style={dialogOverlayStyle}>
          <div
            style={dialogPanelStyle}
            role="dialog"
            aria-modal="true"
            aria-labelledby="assign-test-heading"
          >
            <h2
              id="assign-test-heading"
              style={{ marginTop: 0 }}
            >
              {text.assignTitle}
            </h2>

            <p>
              <strong>
                {selectedCandidate.full_name ||
                  text.unnamedCandidate}
              </strong>
              {' · '}
              {selectedCandidate.candidate_code ||
                text.noCandidateCode}
            </p>

            <label
              htmlFor="admin-assign-test-select"
              style={{
                display: 'block',
                marginBottom: 8
              }}
            >
              {text.chooseTest}
            </label>

            {testsLoading ? (
              <p>{text.loadingTests}</p>
            ) : (
              <select
                id="admin-assign-test-select"
                className="candidate-status-filter"
                style={{
                  width: '100%',
                  maxWidth: '100%'
                }}
                value={selectedTestId}
                onChange={(event) => {
                  setSelectedTestId(event.target.value);
                  setAssignError('');
                }}
              >
                <option value="">
                  {text.choosePlaceholder}
                </option>

                {tests.map((test) => {
                  const count = getQuestionCount(test);

                  const unavailable =
                    !test.model_version_id ||
                    count === 0;

                  const reason = !test.model_version_id
                    ? text.noModel
                    : text.noQuestions;

                  return (
                    <option
                      key={test.id}
                      value={test.id}
                      disabled={unavailable}
                    >
                      {test.title} ({test.code})
                      {' · '}
                      {count} {text.questionCount}
                      {unavailable
                        ? ` — ${reason}`
                        : ''}
                    </option>
                  );
                })}
              </select>
            )}

            {!testsLoading &&
              !testsError &&
              tests.length === 0 && (
                <p>{text.noTests}</p>
              )}

            {testsError && (
              <div
                className="admin-page-error"
                role="alert"
                style={{ marginTop: 12 }}
              >
                {testsError}
              </div>
            )}

            {assignError && (
              <div
                className="admin-page-error"
                role="alert"
                style={{ marginTop: 12 }}
              >
                {assignError}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                flexWrap: 'wrap',
                gap: 12,
                marginTop: 24
              }}
            >
              <button
                type="button"
                className="candidate-action-button"
                disabled={assigning}
                onClick={closeAssignDialog}
              >
                {text.cancelAssign}
              </button>

              <button
                type="button"
                className="admin-primary-button"
                disabled={!canAssign}
                onClick={handleAssign}
              >
                {assigning
                  ? text.assigning
                  : text.confirmAssign}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCandidates;