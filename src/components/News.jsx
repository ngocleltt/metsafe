import React from 'react';
import { Shield, BarChart3, BrainCircuit, Calendar, ArrowUpRight } from 'lucide-react';
import './styles/News.css';
import { newsData } from '../data/newsData';
import './styles/theme.css';

const iconMap = {
  shield: Shield,
  barchart: BarChart3,
  brain: BrainCircuit,
};

const News = ({ t }) => {
  return (
    <section id="news" className="news-section premium-news-section">
      <div className="news-shell">
        <div className="news-topbar">
          <div className="news-heading-block">
            <h2>{t?.news?.title || 'News & Seminars'}</h2>
          </div>
        </div>

        <div className="news-editorial-grid">
          {newsData.map((item) => {
            const Icon = iconMap[item.iconKey];
            const localizedCard = t?.news?.[item.id];

            return (
              <article className="editorial-card-light" key={item.id}>
                <div className="editorial-card-light-inner">
                  <div className="editorial-card-light-meta">
                    <div className="editorial-meta-left">
                      <span className="editorial-icon-light">
                        <Icon size={16} />
                      </span>
                      <span className="editorial-category-light">
                        {localizedCard?.category || item.category}
                      </span>
                    </div>

                    <div className="editorial-date-light">
                      <Calendar size={14} />
                      <span>{localizedCard?.date || item.date}</span>
                    </div>
                  </div>

                  <div className="editorial-content-light">
                    <h3>{localizedCard?.title || item.title}</h3>
                    <p>{localizedCard?.desc || item.desc}</p>
                  </div>

                  <div className="editorial-footer-light">
                    <button className="editorial-link-light" type="button">
                      <span>{t?.news?.readMore || 'Read More'}</span>
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default News;