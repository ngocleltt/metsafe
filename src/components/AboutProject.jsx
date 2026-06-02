import React from 'react';
import './styles/AboutProject.css';
import './styles/theme.css';

const AboutProject = ({ t }) => {
  const manifestoItems = [
    {
      number: '01',
      title: t?.aboutProject?.card1?.title || 'Evaluate real readiness',
      desc:
        t?.aboutProject?.card1?.desc ||
        'METSAFE helps reveal how prepared personnel are for safe operation before risk turns into incident.',
    },
    {
      number: '02',
      title: t?.aboutProject?.card2?.title || 'Replace fragmented checks',
      desc:
        t?.aboutProject?.card2?.desc ||
        'The project turns manual, inconsistent assessment practices into a more structured and measurable digital workflow.',
    },
    {
      number: '03',
      title: t?.aboutProject?.card3?.title || 'Support safer decisions',
      desc:
        t?.aboutProject?.card3?.desc ||
        'By combining competence indicators and weighted metrics, METSAFE supports clearer training, monitoring, and risk-control decisions.',
    },
  ];

  return (
    <section id="about" className="about-manifesto-section">
      <div className="about-manifesto-container">
        <div className="about-manifesto-top">
          <span className="about-manifesto-tag">
            {t?.aboutProject?.tag || 'About the Project'}
          </span>

          <div className="about-manifesto-headline-wrap">
            <h2 className="about-manifesto-title">
              {t?.aboutProject?.title || 'Safer decisions start with clearer competence signals.'}
            </h2>

            <p className="about-manifesto-description">
              {t?.aboutProject?.description ||
                'METSAFE is a digital-first framework for evaluating workplace competence, improving risk visibility, and supporting safer decision-making in metallurgy.'}
            </p>
          </div>
        </div>

        <div className="about-manifesto-divider"></div>

        <div className="about-manifesto-list">
          {manifestoItems.map((item) => (
            <article className="manifesto-row" key={item.number}>
              <span className="manifesto-number">{item.number}</span>

              <div className="manifesto-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutProject;