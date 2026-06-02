import React from 'react';
import './styles/AboutProject.css';
import './styles/theme.css';
import aboutImage from '../assets/about-project.jpg';

const AboutProject = ({ t }) => {
  return (
    <section id="about" className="about-manifesto-section">
      <div className="about-manifesto-container">
        <div className="about-manifesto-grid">
          <div className="about-intro-panel">
            <span className="about-kicker">
              {t?.aboutProject?.tag || 'About the Project'}
            </span>

            <h2 className="about-intro-title">
              {t?.aboutProject?.title ||
                'Safer decisions start with clearer competence signals.'}
            </h2>

            <p className="about-intro-description">
              {t?.aboutProject?.description ||
                'METSAFE is a digital-first framework for evaluating workplace competence, improving risk visibility, and supporting safer decision-making in metallurgy.'}
            </p>
          </div>

          <div className="about-image-panel">
            <img
              src={aboutImage}
              alt={t?.aboutProject?.imageAlt || 'Industrial team working in a metallurgy environment'}
            />
          </div>

          <div className="about-bottom-strip">
            <div className="about-vertical-panel">
              <span>{t?.aboutProject?.sideLabel || 'About Us'}</span>
            </div>

            <div className="about-copy-panel">
              <div className="about-copy-inner">
                <p>
                  {t?.aboutProject?.body1 ||
                    'METSAFE was created to make competence evaluation more structured, visible, and useful in real industrial settings. Instead of relying on fragmented checks, the project brings assessment indicators into one clearer digital workflow.'}
                </p>

                <p>
                  {t?.aboutProject?.body2 ||
                    'By combining weighted metrics, operational criteria, and practical readiness signals, the platform supports better training priorities, stronger supervision, and safer workplace decisions across metallurgy contexts.'}
                </p>
              </div>
            </div>

            <div className="about-accent-panel" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutProject;