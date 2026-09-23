import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  UserRoundSearch,
  UserPlus,
  MoreVertical
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import '../../components/styles/AdminCandidates.css';

const AdminCandidates = () => {
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

      if (!mounted) {
        return;
      }

      if (queryError) {
        console.error(
          'Load candidates error:',
          queryError
        );
        setError(
          queryError.message ||
            'Unable to load candidates.'
        );
        setCandidates([]);
      } else {
        setCandidates(data || []);
      }

      setLoading(false);
    };

    loadCandidates();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredCandidates = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

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
    return candidates.reduce(
      (counts, candidate) => {
        const status =
          candidate.application_status || 'unknown';

        counts[status] = (counts[status] || 0) + 1;

        return counts;
      },
      {}
    );
  }, [candidates]);

  const applicationStatuses = useMemo(() => {
    return [
      ...new Set(
        candidates
          .map(
            (candidate) =>
              candidate.application_status
          )
          .filter(Boolean)
      )
    ];
  }, [candidates]);

  return (
    <div className="admin-candidates-page">
      <div className="admin-candidates-header">
        <div>
          <span className="admin-page-eyebrow">
            Administration
          </span>

          <h1>Candidates</h1>

          <p>
            Review candidate accounts and application
            information.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={() => {
            // Add candidate modal will be added later.
          }}
        >
          <UserPlus size={17} />
          Add candidate
        </button>
      </div>

      <div className="candidate-stat-grid">
        <div className="candidate-stat-card">
          <div className="candidate-stat-icon">
            <UserRoundSearch size={20} />
          </div>

          <div>
            <span>Total candidates</span>
            <strong>{candidates.length}</strong>
          </div>
        </div>

        <div className="candidate-stat-card">
          <div className="candidate-stat-icon is-review">
            <UserRoundSearch size={20} />
          </div>

          <div>
            <span>Under review</span>
            <strong>
              {statusCounts.under_review || 0}
            </strong>
          </div>
        </div>

        <div className="candidate-stat-card">
          <div className="candidate-stat-icon is-approved">
            <UserRoundSearch size={20} />
          </div>

          <div>
            <span>Approved</span>
            <strong>
              {statusCounts.approved || 0}
            </strong>
          </div>
        </div>
      </div>

      <section className="candidate-table-card">
        <div className="candidate-toolbar">
          <div className="candidate-search-box">
            <Search size={18} />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search candidates..."
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="candidate-status-filter"
          >
            <option value="all">All statuses</option>

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
            Loading candidates...
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="candidate-empty-state">
            <UserRoundSearch size={32} />

            <h3>No candidates found</h3>

            <p>
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="candidate-table-wrapper">
            <table className="candidate-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Contact</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>

              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>
                      <div className="candidate-identity">
                        <div className="candidate-avatar">
                          {candidate.full_name
                            ?.charAt(0)
                            .toUpperCase() || 'C'}
                        </div>

                        <div>
                          <strong>
                            {candidate.full_name ||
                              'Unnamed candidate'}
                          </strong>

                          <span>
                            {candidate.candidate_code ||
                              'No candidate code'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="candidate-contact">
                        <span>
                          {candidate.email || 'No email'}
                        </span>

                        <span>
                          {candidate.phone || 'No phone'}
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
                        aria-label={`Actions for ${
                          candidate.full_name
                        }`}
                        onClick={() => {
                          // Candidate actions will be added later.
                        }}
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
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

const getStatusClass = (status) => {
  if (status === 'approved') {
    return 'is-approved';
  }

  if (
    status === 'rejected' ||
    status === 'withdrawn'
  ) {
    return 'is-rejected';
  }

  if (
    status === 'under_review' ||
    status === 'pending'
  ) {
    return 'is-review';
  }

  return 'is-default';
};

export default AdminCandidates;