import React, { useState } from 'react';
import { Calendar, ArrowUpRight, Sparkles } from 'lucide-react';
import './styles/News.css';
import { newsData } from '../data/newsData';
import './styles/theme.css';

const News = ({ t }) => {
  const [activeImage, setActiveImage] = useState(newsData[0]?.image || null);
  const [nextImage, setNextImage] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleImageChange = (image) => {
    if (image === activeImage) return;
    setNextImage(image);
    setIsTransitioning(true);

    setTimeout(() => {
      setActiveImage(image);
      setNextImage(null);
      setIsTransitioning(false);
    }, 360);
  };

  return (
    <section id="news" className="news-section">
      <div className="news-shell">
        <div className="news-topbar">
          <div className="news-heading-block">
            <h3>{t?.news?.title || 'News & Seminars'}</h3>
          </div>
        </div>

        <div className="news-layout">
          {/* Left: list */}
          <div className="news-list">
            {newsData.map((item) => {
              const localizedCard = t?.news?.[item.id];
              const isEvent = item.id === 'card4';

              return (
                <article
                  className={`news-card ${isEvent ? 'news-card--event' : ''}`}
                  key={item.id}
                  onMouseEnter={() => handleImageChange(item.image)}
                >
                  <div className="news-card-inner">
                    <div className="news-card-meta">
                      <div className="news-meta-left">
                        <span className="news-category">
                          {localizedCard?.category || item.category}
                        </span>
                        {isEvent && (
                          <span className="news-badge">
                            <Sparkles size={12} />
                            Featured event
                          </span>
                        )}
                      </div>

                      <div className="news-date">
                        <Calendar size={14} />
                        <span>
                          {localizedCard?.date || item.date}
                        </span>
                      </div>
                    </div>

                    <div className="news-card-content">
                      <h3>
                        {localizedCard?.title || item.title}
                      </h3>
                      <p>
                        {localizedCard?.desc || item.desc}
                      </p>
                    </div>

                    <div className="news-card-footer">
                      {localizedCard?.link ? (
                        <a
                          href={localizedCard.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="news-link news-link--external"
                          aria-label={`${
                            localizedCard?.linkLabel || 'Learn more'
                          } — Opens in a new tab`}
                        >
                          <span>
                            {localizedCard?.linkLabel || 'Learn more'}
                          </span>
                          <ArrowUpRight size={16} />
                        </a>
                      ) : (
                        <button
                          className="news-link"
                          type="button"
                        >
                          <span>
                            {t?.news?.readMore || 'Read More'}
                          </span>
                          <ArrowUpRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Right: large image with fade */}
          <div className="news-visual">
            <div className="news-image-wrapper">
              {/* Active image */}
              {activeImage && (
                <img
                  src={activeImage}
                  alt="News preview"
                  className={`news-image news-image--active ${
                    isTransitioning ? 'news-image--fading-out' : ''
                  }`}
                />
              )}

              {/* Next image (fade in) */}
              {nextImage && (
                <img
                  src={nextImage}
                  alt="News preview"
                  className="news-image news-image--next"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;