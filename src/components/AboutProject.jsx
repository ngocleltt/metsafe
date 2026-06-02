import React from 'react';
import './styles/AboutProject.css';
import { ShieldCheck, Cpu, BarChart3 } from 'lucide-react';

const AboutProject = ({ t }) => {
  return (
    <section id="about" className="about-project-section">
      <div className="about-project-container">
        <div className="about-project-header">
          <span className="about-project-tag">
            {t?.aboutProject?.tag || 'About the Project'}
          </span>

          <h2>
            {t?.aboutProject?.title || 'Why METSAFE matters'}
          </h2>

          <p>
            {t?.aboutProject?.description ||
              'METSAFE is designed to improve workplace safety in metallurgy through digital competency assessment, data-driven evaluation, and smarter risk prevention.'}
          </p>
        </div>

        <div className="about-project-grid">
          <div className="about-card">
            <div className="about-card-icon green">
              <ShieldCheck size={24} />
            </div>
            <h3>
              {t?.aboutProject?.card1?.title || 'Safety-focused evaluation'}
            </h3>
            <p>
              {t?.aboutProject?.card1?.desc ||
                'The system helps identify how prepared personnel are for safe operation and highlights potential safety gaps before incidents occur.'}
            </p>
          </div>

          <div className="about-card">
            <div className="about-card-icon orange">
              <Cpu size={24} />
            </div>
            <h3>
              {t?.aboutProject?.card2?.title || 'Digital transformation'}
            </h3>
            <p>
              {t?.aboutProject?.card2?.desc ||
                'METSAFE replaces manual and fragmented assessment methods with a more structured, measurable, and modern digital model.'}
            </p>
          </div>

          <div className="about-card">
            <div className="about-card-icon blue">
              <BarChart3 size={24} />
            </div>
            <h3>
              {t?.aboutProject?.card3?.title || 'Data-driven decision making'}
            </h3>
            <p>
              {t?.aboutProject?.card3?.desc ||
                'By combining competence indicators and weighted metrics, the project supports clearer decisions in training, monitoring, and risk control.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutProject;