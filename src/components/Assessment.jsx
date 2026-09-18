import React, { useEffect, useMemo, useState } from 'react';
import { User, ShieldAlert, Award, Briefcase, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './styles/Assessment.css';
import './styles/theme.css';

const FALLBACK_LEVELS = {
  l0: 'Level 0',
  l1: 'Level 1',
  l2: 'Level 2',
  l3: 'Level 3',
  l4: 'Level 4',
  l5: 'Level 5'
};

const getLevel = (score, t) => {
  const levels = t?.assessment?.levels || FALLBACK_LEVELS;
  const value = Number(score) || 0;

  if (value >= 86) return { lv: 5, label: levels.l5 };
  if (value >= 71) return { lv: 4, label: levels.l4 };
  if (value >= 56) return { lv: 3, label: levels.l3 };
  if (value >= 41) return { lv: 2, label: levels.l2 };
  if (value >= 21) return { lv: 1, label: levels.l1 };
  return { lv: 0, label: levels.l0 };
};

const formatScore = (value) => {
  const score = Number(value);
  return Number.isFinite(score) ? score.toFixed(1) : '--';
};

const getGroupColor = (groupCode) => {
  if (groupCode === 'K' || groupCode === 'E') return 'bg-green';
  if (groupCode === 'S' || groupCode === 'Q') return 'bg-blue';
  if (groupCode === 'B' || groupCode === 'P') return 'bg-orange';
  return 'bg-purple';
};

const Assessment = ({ t }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const [error, setError] = useState('');

  const assessmentText = t?.assessment || {};

  useEffect(() => {
    let mounted = true;

    async function loadEmployees() {
      setLoadingEmployees(true);
      setError('');

      const { data, error: queryError } = await supabase
        .from('employee_latest_assessment')
        .select('*')
        .order('employee_code', { ascending: true });

      if (!mounted) return;

      if (queryError) {
        console.error('Load employees error:', queryError);
        setError(queryError.message);
        setLoadingEmployees(false);
        return;
      }

      setEmployees(data || []);
      setSelectedEmployeeId(data?.[0]?.employee_id || null);
      setLoadingEmployees(false);
    }

    loadEmployees();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadAssessment() {
      if (!selectedEmployeeId) {
        setSelectedAssessment(null);
        return;
      }

      setLoadingAssessment(true);
      setError('');

      const { data, error: queryError } = await supabase
        .from('assessments')
        .select(`
          id,
          employee_id,
          assessment_date,
          total_score,
          level,
          status,
          model_version_id,
          employees (
            id,
            employee_code,
            full_name,
            position_text,
            experience_years
          ),
          assessment_scores (
            id,
            raw_value,
            normalized_score,
            comment,
            indicator_id,
            indicators (
              id,
              code,
              name,
              name_vi,
              name_ru,
              description,
              weight,
              data_type,
              direction,
              group_id,
              competency_groups (
                code,
                name,
                name_vi,
                name_ru,
                weight,
                sort_order
              )
            )
          )
        `)
        .eq('employee_id', selectedEmployeeId)
        .eq('status', 'completed')
        .order('assessment_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!mounted) return;

      if (queryError) {
        console.error('Load assessment error:', queryError);
        setError(queryError.message);
        setSelectedAssessment(null);
        setLoadingAssessment(false);
        return;
      }

      setSelectedAssessment(data || null);
      setLoadingAssessment(false);
    }

    loadAssessment();
    return () => {
      mounted = false;
    };
  }, [selectedEmployeeId]);

  const groupedScores = useMemo(() => {
    const scores = selectedAssessment?.assessment_scores || [];
    const groups = new Map();

    scores.forEach((score) => {
      const indicator = score.indicators;
      const group = indicator?.competency_groups;
      if (!indicator || !group) return;

      const groupCode = group.code;
      if (!groups.has(groupCode)) {
        groups.set(groupCode, {
          code: groupCode,
          name: group.name,
          nameVi: group.name_vi,
          nameRu: group.name_ru,
          weight: group.weight,
          sortOrder: group.sort_order,
          scores: []
        });
      }

      groups.get(groupCode).scores.push({
        ...score,
        indicator
      });
    });

    return [...groups.values()].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [selectedAssessment]);

  const selectedEmployee = selectedAssessment?.employees;
  const currentCI = Number(selectedAssessment?.total_score || 0);
  const currentLevel = getLevel(currentCI, t);

  if (loadingEmployees) {
    return (
      <div className="assessment-container">
        <div className="assessment-header">
          <h2>{assessmentText.title || 'Assessment'}</h2>
          <p>Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <h2>{assessmentText.title || 'Competence Assessment'}</h2>
        <p>{assessmentText.description || 'Review employee competence and safety indicators.'}</p>
      </div>

      {error && (
        <div className="assessment-error" role="alert">
          {error}
        </div>
      )}

      <div className="assessment-dashboard">
        <div className="candidate-sidebar">
          <h3>
            {assessmentText.sidebarTitle || 'Employees'} ({employees.length})
          </h3>

          <div className="candidate-list">
            {employees.map((employee) => {
              const isSelected = selectedEmployeeId === employee.employee_id;
              const level = getLevel(employee.total_score, t);

              return (
                <button
                  type="button"
                  key={employee.employee_id}
                  className={`candidate-item ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedEmployeeId(employee.employee_id)}
                >
                  <div className="candidate-info-mini">
                    <span className="candidate-name">{employee.full_name}</span>
                    <span className="candidate-pos">
                      {employee.position_text || '—'}
                    </span>
                  </div>

                  <div className="candidate-badge-mini">
                    <span className={`badge-ci level-badge-${level.lv}`}>
                      {formatScore(employee.total_score)}
                    </span>
                    <ChevronRight size={16} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="profile-display">
          {loadingAssessment ? (
            <div className="profile-card">
              <p>Loading assessment...</p>
            </div>
          ) : !selectedAssessment || !selectedEmployee ? (
            <div className="profile-card">
              <p>No completed assessment found for this employee.</p>
            </div>
          ) : (
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <User size={32} />
                </div>

                <div className="profile-title">
                  <h3>{selectedEmployee.full_name}</h3>
                  <p>
                    <Briefcase size={14} className="inline-icon" />{' '}
                    {selectedEmployee.position_text || '—'} •{' '}
                    {selectedEmployee.experience_years ?? '—'}{' '}
                    {assessmentText.yearsExp || 'years'}
                  </p>
                </div>
              </div>

              <div className="score-summary-box">
                <div className="score-block">
                  <span className="block-label">Competence Index (CI)</span>
                  <span className="block-value text-primary">
                    {formatScore(currentCI)}
                  </span>
                </div>

                <div className="score-block">
                  <span className="block-label">
                    {assessmentText.classification || 'Classification'}
                  </span>
                  <span className={`block-value level-tag lv-${currentLevel.lv}`}>
                    <Award size={20} className="inline-icon" />{' '}
                    {currentLevel.label}
                  </span>
                </div>
              </div>

              <div className="metrics-section">
                <h4>
                  <ShieldAlert size={18} className="inline-icon" />{' '}
                  {assessmentText.metricsTitle || 'Competency Indicators'}
                </h4>

                {groupedScores.map((group) => (
                  <div className="category-group" key={group.code}>
                    <h5>
                      {group.nameVi || group.name} ({group.code})
                    </h5>

                    {group.scores
                      .sort((a, b) => a.indicator.sort_order - b.indicator.sort_order)
                      .map((score) => {
                        const indicator = score.indicator;
                        const normalizedScore = Number(score.normalized_score || 0);
                        const label =
                          indicator.name_vi ||
                          indicator.name ||
                          indicator.code;

                        return (
                          <div className="metric-row" key={score.id}>
                            <div className="metric-info">
                              <span>
                                {indicator.code}. {label}
                              </span>
                              <span>{formatScore(normalizedScore)}/100</span>
                            </div>

                            <div className="progress-bar-bg">
                              <div
                                className={`progress-bar-fill ${getGroupColor(group.code)}`}
                                style={{ width: `${Math.min(100, Math.max(0, normalizedScore))}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessment;