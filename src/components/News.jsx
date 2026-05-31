import React from 'react';
import { Shield, BarChart3, BrainCircuit, Calendar, ArrowRight } from 'lucide-react';
import './styles/News.css';

const News = ({ t }) => {
  return (
    <section id="news" className="section-container">
      <div className="section-header">
        <h2>{t?.news?.title || 'News & Seminars'}</h2>
        <div className="header-line"></div>
      </div>
      
      <div className="news-grid">
        <div className="news-card">
          <div className="news-card-header">
            <div className="card-icon-wrapper block-green">
              <Shield size={26} color="#2e7d32" />
            </div>
            <span className="news-tag-label tag-green">Research</span>
          </div>
          <div className="news-card-body">
            <div className="news-date">
              <Calendar size={14} />
              <span>May 28, 2026</span>
            </div>
            <h3>{t?.news?.card1?.title}</h3>
            <p>{t?.news?.card1?.desc}</p>
          </div>
          <div className="news-card-footer">
            <button className="read-more-btn">
              <span>Read More</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="news-card">
          <div className="news-card-header">
            <div className="card-icon-wrapper block-orange">
              <BarChart3 size={26} color="#f7941d" />
            </div>
            <span className="news-tag-label tag-orange">Innovation</span>
          </div>
          <div className="news-card-body">
            <div className="news-date">
              <Calendar size={14} />
              <span>May 15, 2026</span>
            </div>
            <h3>{t?.news?.card2?.title}</h3>
            <p>{t?.news?.card2?.desc}</p>
          </div>
          <div className="news-card-footer">
            <button className="read-more-btn">
              <span>Read More</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="news-card">
          <div className="news-card-header">
            <div className="card-icon-wrapper block-blue">
              <BrainCircuit size={26} color="#1565c0" />
            </div>
            <span className="news-tag-label tag-blue">Technology</span>
          </div>
          <div className="news-card-body">
            <div className="news-date">
              <Calendar size={14} />
              <span>May 02, 2026</span>
            </div>
            <h3>{t?.news?.card3?.title}</h3>
            <p>{t?.news?.card3?.desc}</p>
          </div>
          <div className="news-card-footer">
            <button className="read-more-btn">
              <span>Read More</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;