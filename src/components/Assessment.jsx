import React, { useState } from 'react';
import { candidates } from '../data/candidates';
import { User, ShieldAlert, Award, Briefcase, ChevronRight } from 'lucide-react';
import "./styles/Assessment.css";

const weights = {
  workplace: { risk: 0.4, emergency: 0.4, hygiene: 0.2 },
  equipment: { operation: 0.5, ppe: 0.3, maintenance: 0.2 },
  human: { health: 0.3, focus: 0.4, teamwork: 0.3 },
  categories: { workplace: 0.35, equipment: 0.4, human: 0.25 }
};

const Assessment = ({ t }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0]);

  const calculateCI = (candidateScores) => {
    let finalScore = 0;
    
    Object.keys(candidateScores).forEach(categoryKey => {
      let categorySum = 0;
      const categoryScores = candidateScores[categoryKey];
      const categoryWeights = weights[categoryKey];
      
      Object.keys(categoryScores).forEach(metricKey => {
        categorySum += categoryScores[metricKey] * categoryWeights[metricKey];
      });
      
      finalScore += categorySum * weights.categories[categoryKey];
    });
    
    return finalScore.toFixed(1);
  };

  const getLevel = (ci) => {
    const score = parseFloat(ci);
    if (score >= 90) return { lv: 5, label: t.assessment.levels?.l5 || "Level 5 (Expert)" };
    if (score >= 80) return { lv: 4, label: t.assessment.levels?.l4 || "Level 4 (Advanced)" };
    if (score >= 70) return { lv: 3, label: t.assessment.levels?.l3 || "Level 3 (Intermediate)" };
    if (score >= 60) return { lv: 2, label: t.assessment.levels?.l2 || "Level 2 (Basic)" };
    if (score >= 50) return { lv: 1, label: t.assessment.levels?.l1 || "Level 1 (Novice)" };
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
          <h3>{t.assessment.sidebarTitle || "Danh sách ứng viên"} ({candidates.length})</h3>
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
                <p>
                  <Briefcase size={14} className="inline-icon" /> {selectedCandidate.position} • {selectedCandidate.experience} {t.assessment.yearsExp || "năm kinh nghiệm"}
                </p>
              </div>
            </div>

            <div className="score-summary-box">
              <div className="score-block">
                <span className="block-label">Competence Index (CI)</span>
                <span className="block-value text-primary">{currentCI}</span>
              </div>
              <div className="score-block">
                <span className="block-label">{t.assessment.classification || "Phân loại Cấp độ"}</span>
                <span className={`block-value level-tag lv-${currentLevel.lv}`}>
                  <Award size={20} className="inline-icon" /> {currentLevel.label}
                </span>
              </div>
            </div>

            <div className="metrics-section">
              <h4><ShieldAlert size={18} className="inline-icon" /> {t.assessment.metricsTitle || "Bảng điểm chỉ tiêu chi tiết"}</h4>
              
              <div className="category-group">
                <h5>{t.assessment.categories?.workplace || "An toàn Nơi làm việc"}</h5>
                <div className="metric-row">
                  <div className="metric-info"><span>{t.assessment.metrics?.risk || "Nhận diện rủi ro"}</span><span>{selectedCandidate.scores.workplace.risk}/100</span></div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill bg-green" style={{ width: `${selectedCandidate.scores.workplace.risk}%` }}></div></div>
                </div>
                <div className="metric-row">
                  <div className="metric-info"><span>{t.assessment.metrics?.emergency || "Ứng phó khẩn cấp"}</span><span>{selectedCandidate.scores.workplace.emergency}/100</span></div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill bg-green" style={{ width: `${selectedCandidate.scores.workplace.emergency}%` }}></div></div>
                </div>
                <div className="metric-row">
                  <div className="metric-info"><span>{t.assessment.metrics?.hygiene || "Vệ sinh công nghiệp"}</span><span>{selectedCandidate.scores.workplace.hygiene}/100</span></div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill bg-green" style={{ width: `${selectedCandidate.scores.workplace.hygiene}%` }}></div></div>
                </div>
              </div>

              <div className="category-group">
                <h5>{t.assessment.categories?.equipment || "Vận hành Thiết bị"}</h5>
                <div className="metric-row">
                  <div className="metric-info"><span>{t.assessment.metrics?.operation || "Vận hành lò đúc"}</span><span>{selectedCandidate.scores.equipment.operation}/100</span></div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill bg-blue" style={{ width: `${selectedCandidate.scores.equipment.operation}%` }}></div></div>
                </div>
                <div className="metric-row">
                  <div className="metric-info"><span>{t.assessment.metrics?.ppe || "Sử dụng trang bị PPE"}</span><span>{selectedCandidate.scores.equipment.ppe}/100</span></div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill bg-blue" style={{ width: `${selectedCandidate.scores.equipment.ppe}%` }}></div></div>
                </div>
                <div className="metric-row">
                  <div className="metric-info"><span>{t.assessment.metrics?.maintenance || "Bảo trì thiết bị"}</span><span>{selectedCandidate.scores.equipment.maintenance}/100</span></div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill bg-blue" style={{ width: `${selectedCandidate.scores.equipment.maintenance}%` }}></div></div>
                </div>
              </div>

              <div className="category-group">
                <h5>{t.assessment.categories?.human || "Yếu tố Con người"}</h5>
                <div className="metric-row">
                  <div className="metric-info"><span>{t.assessment.metrics?.health || "Sức khỏe thể chất"}</span><span>{selectedCandidate.scores.human.health}/100</span></div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill bg-orange" style={{ width: `${selectedCandidate.scores.human.health}%` }}></div></div>
                </div>
                <div className="metric-row">
                  <div className="metric-info"><span>{t.assessment.metrics?.focus || "Mức độ tập trung"}</span><span>{selectedCandidate.scores.human.focus}/100</span></div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill bg-orange" style={{ width: `${selectedCandidate.scores.human.focus}%` }}></div></div>
                </div>
                <div className="metric-row">
                  <div className="metric-info"><span>{t.assessment.metrics?.teamwork || "Phối hợp đồng đội"}</span><span>{selectedCandidate.scores.human.teamwork}/100</span></div>
                  <div className="progress-bar-bg"><div className="progress-bar-fill bg-orange" style={{ width: `${selectedCandidate.scores.human.teamwork}%` }}></div></div>
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