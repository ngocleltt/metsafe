import React from 'react';
import { Shield, BarChart3, BrainCircuit, Calendar, ArrowRight } from 'lucide-react';
import './styles/News.css';
import { newsData } from '../data/newsData';

const iconMap = {
  shield: Shield,
  barchart: BarChart3,
  brain: BrainCircuit,
};

const News = ({ t }) => {
  return (
    <section id="news" className="section-container">
      <div className="section-header">
        <h2>{t?.news?.title || 'News & Seminars'}</h2>
        <div className="header-line"></div>
      </div>

      <div className="news-grid">
        {newsData.map((item) => {
          const Icon = iconMap[item.iconKey];
          const localizedCard = t?.news?.[item.id];

          return (
            <div className="news-card" key={item.id}>
              <div className="news-card-header">
                <div className={`card-icon-wrapper ${item.blockClass}`}>
                  <Icon size={26} color={item.iconColor} />
                </div>
                <span className={`news-tag-label ${item.tagClass}`}>
                  {localizedCard?.category || item.category}
                </span>
              </div>

              <div className="news-card-body">
                <div className="news-date">
                  <Calendar size={14} />
                  <span>{localizedCard?.date || item.date}</span>
                </div>
                <h3>{localizedCard?.title}</h3>
                <p>{localizedCard?.desc}</p>
              </div>

              <div className="news-card-footer">
                <button className="read-more-btn" type="button">
                  <span>{t?.news?.readMore || 'Read More'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default News;