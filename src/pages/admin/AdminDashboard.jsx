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

const dateLocales = {
  en: 'en-US',
  vi: 'vi-VN',
  ru: 'ru-RU'
};

const AdminDashboard = ({ t, currentLang }) => {
  const navigate = useNavigate();
  const text = t.adminDashboard;
  const candidateText = t.adminCandidates;

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

        setError(text.loadError);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [text.loadError]
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const formatStatus = (status) => {
    return (
      candidateText.statuses[status] ??
      candidateText.statuses.unknown
    );
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return '—';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    return new Intl.DateTimeFormat(
      dateLocales[currentLang] || 'en-US',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(date);
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-loading">
          {text.loading}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <header className="admin-dashboard-header">
        <div>
          <span className="admin-dashboard-eyebrow">
            {text.eyebrow}
          </span>

          <h1>{text.title}</h1>

          <p>{text.description}</p>
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
            aria-hidden="true"
          />

          {refreshing ? text.refreshing : text.refresh}
        </button>
      </header>

      {error && (
        <div
          className="admin-dashboard-error"
          role="alert"
        >
          <AlertCircle size={18} aria-hidden="true" />
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
            <Users size={21} aria-hidden="true" />
          </div>

          <div className="admin-kpi-content">
            <span>{text.totalEmployees}</span>
            <strong>{stats.totalEmployees}</strong>
            <small>
              {stats.activeEmployees} {text.active}
            </small>
          </div>

          <ArrowRight
            size={18}
            className="admin-kpi-arrow"
            aria-hidden="true"
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
            <UserRoundSearch size={21} aria-hidden="true" />
          </div>

          <div className="admin-kpi-content">
            <span>{text.totalCandidates}</span>
            <strong>{stats.totalCandidates}</strong>
            <small>
              {stats.pendingCandidates} {text.needReview}
            </small>
          </div>

          <ArrowRight
            size={18}
            className="admin-kpi-arrow"
            aria-hidden="true"
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
            <ClipboardCheck size={21} aria-hidden="true" />
          </div>

          <div className="admin-kpi-content">
            <span>{text.completedAssessments}</span>
            <strong>{stats.completedAssessments}</strong>
            <small>
              {stats.pendingAssessments} {text.inProgress}
            </small>
          </div>

          <ArrowRight
            size={18}
            className="admin-kpi-arrow"
            aria-hidden="true"
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
            <Clock3 size={21} aria-hidden="true" />
          </div>

          <div className="admin-kpi-content">
            <span>{text.pendingActions}</span>
            <strong>{stats.pendingCandidates}</strong>
            <small>{text.candidateApplications}</small>
          </div>

          <ArrowRight
            size={18}
            className="admin-kpi-arrow"
            aria-hidden="true"
          />
        </button>
      </section>

      <section className="admin-dashboard-grid">
        <div className="admin-panel admin-attention-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-panel-kicker">
                {text.needsAttention}
              </span>

              <h2>{text.candidateApplications}</h2>
            </div>

            <button
              type="button"
              className="admin-text-button"
              onClick={() =>
                navigate('/dashboard/admin/candidates')
              }
            >
              {text.viewAll}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>

          {pendingCandidates.length === 0 ? (
            <div className="admin-empty-state">
              <ShieldCheck size={30} aria-hidden="true" />
              <strong>{text.nothingNeedsAttention}</strong>
              <span>{text.noPendingApplications}</span>
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
                      .toUpperCase() ||
                      candidateText.candidateInitial}
                  </div>

                  <div className="admin-attention-info">
                    <strong>
                      {candidate.full_name ||
                        candidateText.unnamedCandidate}
                    </strong>

                    <span>
                      {candidate.candidate_code ||
                        candidate.email ||
                        candidateText.noCandidateCode}
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
                {text.shortcuts}
              </span>

              <h2>{text.quickActions}</h2>
            </div>
          </div>

          <div className="admin-quick-actions">
            <button
              type="button"
              onClick={() =>
                navigate('/dashboard/admin/employees')
              }
            >
              <Users size={18} aria-hidden="true" />
              {text.manageEmployees}
              <ArrowRight size={15} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() =>
                navigate('/dashboard/admin/candidates')
              }
            >
              <UserRoundSearch size={18} aria-hidden="true" />
              {text.reviewCandidates}
              <ArrowRight size={15} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() =>
                navigate('/dashboard/assessment')
              }
            >
              <ClipboardCheck size={18} aria-hidden="true" />
              {text.openAssessments}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;