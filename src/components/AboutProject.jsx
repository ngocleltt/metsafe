import React from 'react';
import './styles/AboutProject.css';
import { ShieldCheck, Cpu, BarChart3, ArrowUpRight } from 'lucide-react';

const AboutProject = ({ t }) => {
  return (
    <section id="about" className="about-project-section">
      <div className="about-project-container">
        <div className="about-project-shell">
          <div className="about-project-intro">
            <span className="about-project-tag">
              {t?.aboutProject?.tag || 'About the Project'}
            </span>

            <h2 className="about-project-title">
              {t?.aboutProject?.title || 'Why METSAFE matters'}
            </h2>

            <p className="about-project-description">
              {t?.aboutProject?.description ||
                'METSAFE is designed to improve workplace safety in metallurgy through digital competency assessment, data-driven evaluation, and smarter risk prevention.'}
            </p>

            <div className="about-project-accent-line"></div>

            <div className="about-project-note">
              <span className="about-note-label">METSAFE</span>
              <p>
                A digital-first approach to competence evaluation, risk visibility,
                and safer industrial decision-making.
              </p>
            </div>
          </div>

          <div className="about-project-panel">
            <div className="about-feature-item">
              <div className="about-feature-top">
                <span className="about-feature-number">01</span>
                <div className="about-feature-icon green">
                  <ShieldCheck size={18} />
                </div>
              </div>
              <h3>
                {t?.aboutProject?.card1?.title || 'Safety-focused evaluation'}
              </h3>
              <p>
                {t?.aboutProject?.card1?.desc ||
                  'The system helps identify how prepared personnel are for safe operation and highlights potential safety gaps before incidents occur.'}
              </p>
            </div>

            <div className="about-feature-item">
              <div className="about-feature-top">
                <span className="about-feature-number">02</span>
                <div className="about-feature-icon orange">
                  <Cpu size={18} />
                </div>
              </div>
              <h3>
                {t?.aboutProject?.card2?.title || 'Digital transformation'}
              </h3>
              <p>
                {t?.aboutProject?.card2?.desc ||
                  'METSAFE replaces manual and fragmented assessment methods with a more structured, measurable, and modern digital model.'}
              </p>
            </div>

            <div className="about-feature-item">
              <div className="about-feature-top">
                <span className="about-feature-number">03</span>
                <div className="about-feature-icon blue">
                  <BarChart3 size={18} />
                </div>
              </div>
              <h3>
                {t?.aboutProject?.card3?.title || 'Data-driven decision making'}
              </h3>
              <p>
                {t?.aboutProject?.card3?.desc ||
                  'By combining competence indicators and weighted metrics, the project supports clearer decisions in training, monitoring, and risk control.'}
              </p>
            </div>

            <div className="about-panel-footer">
              <span>Project vision</span>
              <ArrowUpRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutProject;