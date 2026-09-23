import React, { useCallback, useEffect, useState } from 'react';
import {
  Users,
  UserRoundSearch,
  ClipboardCheck,
  Clock3,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import '../../components/styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalCandidates: 0,
    pendingCandidates: 0,
    completedAssessments: 0,
    pendingAssessments: 0
  });

  const [pendingCandidates, setPendingCandidates] = useState([]);
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
        const [
          employeesResult,
          candidatesResult,
          assessmentsResult,
          pendingCandidatesResult
        ] = await Promise.all([
          supabase
            .from('employees')
            .select('id, is_active', {
              count: 'exact'
            }),

          supabase
            .from('candidates')
            .select(
              'id, full_name, candidate_code, email, application_status, created_at',
              {
                count: 'exact'
              }
            ),

          supabase
            .from('assessments')
            .select('id, status', {
              count: 'exact'
            }),

          supabase
            .from('candidates')
            .select(
              'id, full_name, candidate_code, email, application_status, created_at'
            )
            .in('application_status', [
              'pending',
              'under_review'
            ])
            .order('created_at', {
              ascending: false
            })
            .limit(5)
        ]);

        const firstError =
          employeesResult.error ||
          candidatesResult.error ||
          assessmentsResult.error ||
          pendingCandidatesResult.error;

        if (firstError) {
          throw firstError;
        }

        const employees = employeesResult.data || [];
        const candidates = candidatesResult.data || [];
        const assessments = assessmentsResult.data || [];
        const attentionCandidates =
          pendingCandidatesResult.data || [];

        setStats({
          totalEmployees:
            employeesResult.count ?? employees.length,

          activeEmployees: employees.filter(
            (employee) => employee.is_active
          ).length,

          totalCandidates:
            candidatesResult.count ?? candidates.length,

          pendingCandidates: candidates.filter((candidate) =>
            ['pending', 'under_review'].includes(
              candidate.application_status
            )
          ).length,

          completedAssessments: assessments.filter(
            (assessment) =>
              assessment.status === 'completed'
          ).length,

          pendingAssessments: assessments.filter(
            (assessment) =>
              !['completed', 'cancelled'].includes(
                assessment.status
              )
          ).length
        });

        setPendingCandidates(attentionCandidates);
      } catch (loadError) {
        console.error(
          'Admin dashboard loading error:',
          loadError
        );

        setError(
          loadError?.message ||
            'Unable to load admin dashboard data.'
        );
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
      return 'Unknown';
    }

    return status
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (character) =>
        character.toUpperCase()
      );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return '—';
    }

    return new Intl.DateTimeFormat('en', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateValue));
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-loading">
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <header className="admin-dashboard-header">
        <div>
          <span className="admin-dashboard-eyebrow">
            Administration
          </span>

          <h1>Admin overview</h1>

          <p>
            Monitor people, assessments and pending actions
            across METSAFE.
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={() =>
            loadDashboard({ isRefresh: true })
          }
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={refreshing ? 'is-spinning' : ''}
          />

          {refreshing ? 'Refreshing...' : 'Refresh data'}
        </button>
      </header>

      {error && (
        <div
          className="admin-dashboard-error"
          role="alert"
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <section className="admin-kpi-grid">
        <button
          type="button"
          className="admin-kpi-card"
          onClick={() =>
            navigate('/dashboard/admin/employees')
          }
        >
          <div className="admin-kpi-icon">
            <Users size={21} />
          </div>

          <div className="admin-kpi-content">
            <span>Total employees</span>
            <strong>{stats.totalEmployees}</strong>
            <small>
              {stats.activeEmployees} active
            </small>
          </div>

          <ArrowRight
            size={18}
            className="admin-kpi-arrow"
          />
        </button>

        <button
          type="button"
          className="admin-kpi-card"
          onClick={() =>
            navigate('/dashboard/admin/candidates')
          }
        >
          <div className="admin-kpi-icon is-candidate">
            <UserRoundSearch size={21} />
          </div>

          <div className="admin-kpi-content">
            <span>Total candidates</span>
            <strong>{stats.totalCandidates}</strong>
            <small>
              {stats.pendingCandidates} need review
            </small>
          </div>

          <ArrowRight
            size={18}
            className="admin-kpi-arrow"
          />
        </button>

        <button
          type="button"
          className="admin-kpi-card"
          onClick={() =>
            navigate('/dashboard/assessment')
          }
        >
          <div className="admin-kpi-icon is-assessment">
            <ClipboardCheck size={21} />
          </div>

          <div className="admin-kpi-content">
            <span>Completed assessments</span>
            <strong>{stats.completedAssessments}</strong>
            <small>
              {stats.pendingAssessments} in progress
            </small>
          </div>

          <ArrowRight
            size={18}
            className="admin-kpi-arrow"
          />
        </button>

        <button
          type="button"
          className="admin-kpi-card is-attention"
          onClick={() =>
            navigate('/dashboard/admin/candidates')
          }
        >
          <div className="admin-kpi-icon is-warning">
            <Clock3 size={21} />
          </div>

          <div className="admin-kpi-content">
            <span>Pending actions</span>
            <strong>{stats.pendingCandidates}</strong>
            <small>Candidate applications</small>
          </div>

          <ArrowRight
            size={18}
            className="admin-kpi-arrow"
          />
        </button>
      </section>

      <section className="admin-dashboard-grid">
        <div className="admin-panel admin-attention-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-panel-kicker">
                Needs attention
              </span>

              <h2>Candidate applications</h2>
            </div>

            <button
              type="button"
              className="admin-text-button"
              onClick={() =>
                navigate('/dashboard/admin/candidates')
              }
            >
              View all
              <ArrowRight size={15} />
            </button>
          </div>

          {pendingCandidates.length === 0 ? (
            <div className="admin-empty-state">
              <ShieldCheck size={30} />
              <strong>Nothing needs attention</strong>
              <span>
                There are no pending candidate applications.
              </span>
            </div>
          ) : (
            <div className="admin-attention-list">
              {pendingCandidates.map((candidate) => (
                <div
                  className="admin-attention-item"
                  key={candidate.id}
                >
                  <div className="admin-person-avatar">
                    {candidate.full_name
                      ?.charAt(0)
                      .toUpperCase() || 'C'}
                  </div>

                  <div className="admin-attention-info">
                    <strong>
                      {candidate.full_name ||
                        'Unnamed candidate'}
                    </strong>

                    <span>
                      {candidate.candidate_code ||
                        candidate.email ||
                        'No candidate code'}
                    </span>
                  </div>

                  <div className="admin-attention-meta">
                    <span
                      className={`admin-status-badge status-${candidate.application_status}`}
                    >
                      {formatStatus(
                        candidate.application_status
                      )}
                    </span>

                    <small>
                      {formatDate(candidate.created_at)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-panel admin-actions-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-panel-kicker">
                Shortcuts
              </span>

              <h2>Quick actions</h2>
            </div>
          </div>

          <div className="admin-quick-actions">
            <button
              type="button"
              onClick={() =>
                navigate('/dashboard/admin/employees')
              }
            >
              <Users size={18} />
              Manage employees
              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              onClick={() =>
                navigate('/dashboard/admin/candidates')
              }
            >
              <UserRoundSearch size={18} />
              Review candidates
              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              onClick={() =>
                navigate('/dashboard/assessment')
              }
            >
              <ClipboardCheck size={18} />
              Open assessments
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;