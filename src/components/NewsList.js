import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import NewsArticle from './NewsArticle.js';
import './NewsList.css';

const NewsList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('general');

  const categories = [
    'general',
    'business',
    'entertainment',
    'health',
    'science',
    'sports',
    'technology',
  ];

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(false);
    setErrorMessage('');

    try {
      const response = await axios.get(
        `https://newsdata.io/api/1/news`, // NewsData API endpoint
        {
          params: {
            country: 'us',
            category: category,
            q: query || null,
            apikey: process.env.REACT_APP_NEWS_API_KEY, // Use your NewsData API key
          },
        }
      );
      setArticles(response.data.results);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(true);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, query]);

  useEffect(() => {
    fetchNews();
  }, [category, fetchNews]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchNews();
    }
  };

  return (
    <div className="news-list">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for news..."
          onKeyPress={handleSearch}
        />
      </div>

      {/* Category Buttons */}
      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={category === cat ? 'active' : ''}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* News Articles */}
      {loading ? (
        <p>Loading news for you...</p>
      ) : error ? (
        <p>Sorry, we couldn't fetch the news. {errorMessage}</p>
      ) : (
        <div className="articles">
          {articles.map((article) => (
            <NewsArticle key={article.link} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;
