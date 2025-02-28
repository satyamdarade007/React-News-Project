
import React from 'react';
import './NewsArticle.css';

const NewsArticle = ({ article }) => {
  return (
    <div className="news-article">
      <h2>{article.title}</h2>
      {article.urlToImage && (
        <img src={article.urlToImage} alt={article.title} />
      )}
      <p>{article.description}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        Read more ↗
      </a>
    </div>
  );
};

export default NewsArticle;
