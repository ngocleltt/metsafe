import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  UserRoundSearch,
  UserPlus,
  MoreVertical
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import '../../components/styles/AdminCandidates.css';

const getStatusClass = (status) => {
  if (status === 'approved') {
    return 'is-approved';
  }

  if (status === 'rejected' || status === 'withdrawn') {
    return 'is-rejected';
  }

  if (status === 'under_review' || status === 'pending') {
    return 'is-review';
  }

  return 'is-default';
};

const AdminCandidates = ({ t }) => {
  const text = t.adminCandidates;

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let mounted = true;

    const loadCandidates = async () => {
      setLoading(true);
      setError('');

      try {
        const {
          data,
          error: queryError
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
          .order('created_at', {
            ascending: false
          });

        if (queryError) {
          throw queryError;
        }

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
      const status =
        candidate.application_status || 'unknown';

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
    return (
      text.statuses[status] ??
      text.statuses.unknown
    );
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
            <strong>
              {statusCounts.under_review || 0}
            </strong>
          </div>
        </div>

        <div className="candidate-stat-card">
          <div className="candidate-stat-icon is-approved">
            <UserRoundSearch size={20} aria-hidden="true" />
          </div>

          <div>
            <span>{text.approved}</span>
            <strong>
              {statusCounts.approved || 0}
            </strong>
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
              <option
                value={status}
                key={status}
              >
                {formatStatus(status)}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div
            className="admin-page-error"
            role="alert"
          >
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
                  <th aria-label={text.columns.actions} />
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
                            <strong>
                              {candidateName}
                            </strong>

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
                            {candidate.email ||
                              text.noEmail}
                          </span>

                          <span>
                            {candidate.phone ||
                              text.noPhone}
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
                        {/* Chưa có menu thao tác nên tạm khóa nút */}
                        <button
                          type="button"
                          className="candidate-action-button"
                          aria-label={text.actionsFor.replace(
                            '{name}',
                            candidateName
                          )}
                          disabled
                        >
                          <MoreVertical
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
    </div>
  );
};

export default AdminCandidates;