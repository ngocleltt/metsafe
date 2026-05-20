import React, { useState } from 'react';
import { candidates } from '../data/candidates';
import { User, ShieldAlert, Award, Briefcase, ChevronRight } from 'lucide-react';
import "./styles/Assessment.css";

const Assessment = ({ t }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0]);

  const calculateCI = (scores) => {
    const values = Object.values(scores);
    if (values.length === 0) return 0;
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    return average.toFixed(1);
  };

  const getLevel = (ci) => {
    if (ci >= 90) return { lv: 5, label: t.assessment.levels?.l5 || "Level 5 (Expert)" };
    if (ci >= 80) return { lv: 4, label: t.assessment.levels?.l4 || "Level 4 (Advanced)" };
    if (ci >= 70) return { lv: 3, label: t.assessment.levels?.l3 || "Level 3 (Intermediate)" };
    if (ci >= 60) return { lv: 2, label: t.assessment.levels?.l2 || "Level 2 (Basic)" };
    if (ci >= 50) return { lv: 1, label: t.assessment.levels?.l1 || "Level 1 (Novice)" };
    return { lv: 0, label: t.assessment.levels?.l0 || "Level 0 (Unqualified)" };
  };

  const currentCI = calculateCI(selectedCandidate.scores);
  const currentLevel = getLevel(currentCI);

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <h2>{t.assessment.title}</h2>
        <p>{t.assessment.description}</p>
      </div>

      <div className="assessment-dashboard">
        <div className="candidate-sidebar">
          <h3>Danh sách ứng viên ({candidates.length})</h3>
          <div className="candidate-list">
            {candidates.map((candidate) => {
              const ci = calculateCI(candidate.scores);
              const isSelected = selectedCandidate.id === candidate.id;
              return (
                <div
                  key={candidate.id}
                  className={`candidate-item ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <div className="candidate-info-mini">
                    <span className="candidate-name">{candidate.name}</span>
                    <span className="candidate-pos">{candidate.position}</span>
                  </div>
                  <div className="candidate-badge-mini">
                    <span className="badge-ci">{ci}</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="profile-display">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <User size={32} />
              </div>
              <div className="profile-title">
                <h3>{selectedCandidate.name}</h3>
                <p><Briefcase size={14} className="inline-icon" /> {selectedCandidate.position} • {selectedCandidate.experience} năm kinh nghiệm</p>
              </div>
            </div>

            <div className="score-summary-box">
              <div className="score-block">
                <span className="block-label">Competence Index (CI)</span>
                <span className="block-value text-primary">{currentCI}</span>
              </div>
              <div className="score-block">
                <span className="block-label">Phân loại Cấp độ</span>
                <span className={`block-value level-tag lv-${currentLevel.lv}`}>
                  <Award size={20} className="inline-icon" /> {currentLevel.label}
                </span>
              </div>
            </div>

            <div className="metrics-section">
              <h4><ShieldAlert size={18} className="inline-icon" /> Chi tiết tiêu chí năng lực</h4>
              
              <div className="metric-row">
                <div className="metric-info">
                  <span>{t.assessment.categories?.workplace || "An toàn Nơi làm việc"}</span>
                  <span className="metric-score">{selectedCandidate.scores.workplace}/100</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill bg-green" style={{ width: `${selectedCandidate.scores.workplace}%` }}></div>
                </div>
              </div>

              <div className="metric-row">
                <div className="metric-info">
                  <span>{t.assessment.categories?.equipment || "Vận hành Thiết bị"}</span>
                  <span className="metric-score">{selectedCandidate.scores.equipment}/100</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill bg-blue" style={{ width: `${selectedCandidate.scores.equipment}%` }}></div>
                </div>
              </div>

              <div className="metric-row">
                <div className="metric-info">
                  <span>{t.assessment.categories?.human || "Yếu tố Con người"}</span>
                  <span className="metric-score">{selectedCandidate.scores.human}/100</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill bg-orange" style={{ width: `${selectedCandidate.scores.human}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;