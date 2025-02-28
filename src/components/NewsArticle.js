import React from 'react';
import './NewsArticle.css';

const NewsArticle = ({ article }) => {
  console.log(article); // Log the article object to inspect its structure

  return (
    <div className="news-article">
      <h2>{article.title}</h2>
      {article.image_url && (
        <img src={article.image_url} alt={article.title} />
      )}
      <p>{article.description}</p>
      <a href={article.link} target="_blank" rel="noopener noreferrer">
        Read more ↗
      </a>
    </div>
  );
};

export default NewsArticle;
