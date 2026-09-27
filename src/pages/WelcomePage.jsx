import React, { useEffect } from 'react';
import Hero from '../components/Hero';

import '../components/styles/WelcomePage.css'; // Đổi đường dẫn nếu cần

const WelcomePage = ({ t }) => {
  useEffect(() => {
    const elements = document.querySelectorAll('.welcome-reveal');

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="welcome-page">
      <Hero t={t} />

      <div className="welcome-signal" aria-hidden="true">
        <div className="welcome-signal__track">
          <span className="welcome-signal__line" />
        </div>
      </div>

      <section
        className="welcome-about"
        id="about"
        aria-labelledby="welcome-about-title"
      >
        <div className="welcome-container">
          <div className="welcome-about__heading welcome-reveal">
            <div className="welcome-section-label">
              <span className="welcome-section-label__line" />
              <span>{t?.aboutProject?.tag}</span>
            </div>

            <h2 id="welcome-about-title">
              {t?.aboutProject?.title}
            </h2>

            <p className="welcome-about__lead">
              {t?.aboutProject?.description}
            </p>
          </div>

          <div className="welcome-about__grid">
            <div className="welcome-visual welcome-reveal" aria-hidden="true">
              <div className="welcome-visual__orb welcome-visual__orb--one" />
              <div className="welcome-visual__orb welcome-visual__orb--two" />

              <div className="welcome-visual__frame">
                <div className="welcome-visual__top">
                  <span>METSAFE</span>
                  <span className="welcome-visual__spark" />
                </div>

                <div className="welcome-visual__center">
                  <span className="welcome-visual__ring welcome-visual__ring--outer" />
                  <span className="welcome-visual__ring welcome-visual__ring--middle" />
                  <span className="welcome-visual__ring welcome-visual__ring--inner" />

                  <span className="welcome-visual__core">
                    <span className="welcome-visual__core-mark" />
                  </span>

                  <span className="welcome-visual__point welcome-visual__point--one" />
                  <span className="welcome-visual__point welcome-visual__point--two" />
                  <span className="welcome-visual__point welcome-visual__point--three" />
                </div>

                <div className="welcome-visual__bottom">
                  <span>{t?.aboutProject?.sideLabel}</span>
                  <span className="welcome-visual__bottom-line" />
                  <span>METSAFE</span>
                </div>
              </div>
            </div>

            <div className="welcome-about__body welcome-reveal">
              <span className="welcome-about__index">
                01 — METSAFE
              </span>

              <p>{t?.aboutProject?.body1}</p>
              <p>{t?.aboutProject?.body2}</p>

              <div className="welcome-about__signature" aria-hidden="true">
                <span className="welcome-about__signature-line" />
                <span>METSAFE</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WelcomePage;