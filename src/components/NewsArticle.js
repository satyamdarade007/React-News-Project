import React from 'react';
import { FiClock, FiExternalLink } from 'react-icons/fi';
import './NewsArticle.css';

const NewsArticle = ({ article }) => {
  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get source name from URL
  const getSourceName = (url) => {
    if (!url) return 'Unknown Source';
    try {
      const { hostname } = new URL(url);
      return hostname.replace('www.', '').split('.')[0];
    } catch {
      return 'Source';
    }
  };

  return (
    <article className="article-card">
      {article.image_url && (
        <div className="article-image">
          <img 
            src={article.image_url} 
            alt={article.title} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
            }}
          />
        </div>
      )}
      
      <div className="article-content">
        <div className="article-meta">
          <span className="source">{article.source_id || getSourceName(article.link)}</span>
          {article.pubDate && (
            <span className="date">
              <FiClock size={14} /> {formatDate(article.pubDate)}
            </span>
          )}
        </div>
        
        <h2 className="article-title">
          <a href={article.link} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h2>
        
        {article.description && (
          <p className="article-description">
            {article.description.length > 150 
              ? `${article.description.substring(0, 150)}...` 
              : article.description}
          </p>
        )}
        
        <div className="article-footer">
          {article.category && article.category.length > 0 && (
            <span className="category-tag">
              {article.category[0]}
            </span>
          )}
          
          <a 
            href={article.link} 
            className="read-more"
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={`Read more about ${article.title}`}
          >
            Read More <FiExternalLink size={14} />
          </a>
        </div>
      </div>
    </article>
  );
};

export default NewsArticle;
