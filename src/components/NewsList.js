import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';
import NewsArticle from './NewsArticle';
import './NewsList.css';

const NewsList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rateLimited, setRateLimited] = useState(false);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('science');

  const categories = [
    { id: 'general', name: '🌍 Top Headlines', color: '#4F46E5' },
    { id: 'business', name: '💼 Business', color: '#10B981' },
    { id: 'entertainment', name: '🎬 Entertainment', color: '#8B5CF6' },
    { id: 'health', name: '🏥 Health', color: '#EC4899' },
    { id: 'science', name: '🔬 Science', color: '#3B82F6' },
    { id: 'sports', name: '⚽ Sports', color: '#F59E0B' },
    { id: 'technology', name: '💻 Technology', color: '#6366F1' },
  ];

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(false);
    setErrorMessage('');

    try {
      // Using GNews API with environment variable for API key
      const apiKey = process.env.REACT_APP_GNEWS_API_KEY;
      if (!apiKey) {
        throw new Error('API key is not configured. Please check your .env file.');
      }

      const params = new URLSearchParams({
        country: 'in',
        ...(category !== 'general' && { category: category.toLowerCase() }),
        ...(query && { q: query }),
        max: 20,
        lang: 'en',
        apikey: apiKey,
      });

      const response = await axios.get(
        `https://gnews.io/api/v4/top-headlines?${params.toString()}`,
        { timeout: 10000 }
      );

      // Reset rate limit state on successful fetch
      setRateLimited(false);
      
      // Filter out articles without images
      const articlesWithImages = response.data.articles.filter(article => 
        article.image && 
        !article.image.endsWith('.svg') &&
        !article.image.includes('placeholder')
      );
      
      if (articlesWithImages.length === 0) {
        throw new Error('No articles with images found. Try a different category or search term.');
      }
      
      // Map GNews API fields to match our component's expected format
      const mappedArticles = articlesWithImages.map(article => ({
        ...article,
        image_url: article.image,
        link: article.url,
        source_id: article.source?.name || 'Unknown Source',
        pubDate: article.publishedAt || new Date().toISOString(),
        description: article.description || 'No description available',
        title: article.title || 'Untitled Article',
      }));

      setArticles(mappedArticles);
    } catch (err) {
      console.error('Error fetching news:', err);
      
      // Handle different types of errors
      if (err.response) {
        // The request was made and the server responded with a status code
        if (err.response.status === 429) {
          setRateLimited(true);
          setError(true);
          setErrorMessage('API rate limit reached. Please wait a few minutes and try again.');
        } else if (err.response.status === 401) {
          setError(true);
          setErrorMessage('Authentication failed. Please check your API key.');
        } else {
          setError(true);
          setErrorMessage(`Error: ${err.response.status} - ${err.response.statusText}`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError(true);
        setErrorMessage('No response from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        setError(true);
        setErrorMessage(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [category, query]);

  useEffect(() => {
    fetchNews();
  }, [category, fetchNews]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      fetchNews();
    }
  };

  return (
    <div className="news-app">
        <header className="app-header">
        <div className="header-content">
          <div className="header-text">
            <div className="logo-container">
              <span className="logo-icon">🚀</span>
              <h1>Quick<span>News</span></h1>
            </div>
            <p className="tagline">Stay updated in seconds</p>
          </div>
          <div className="header-highlights">
            <div className="highlight-item">
              <span className="highlight-icon">⚡</span>
              <span>Live Updates</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-icon">🌐</span>
              <span>Global Coverage</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-icon">🔔</span>
              <span>Breaking Alerts</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="search-container">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleSearch}
            placeholder="Search for news..."
            aria-label="Search news"
            disabled={loading}
          />
        </div>
      </div>

      <div className="categories-container">
        <div className="categories-wrapper">
          <div className="categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${category === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
                aria-label={`Show ${cat.name} news`}
                aria-pressed={category === cat.id}
                style={{
                  '--category-color': cat.color,
                  '--category-hover': `${cat.color}15`,
                  '--category-active': `${cat.color}20`
                }}
              >
                <span className="category-text">{cat.name}</span>
                <span className="category-icon">{cat.name.split(' ')[0]}</span>
                <span className="active-indicator"></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="main-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Fetching the latest news...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>⚠️ {rateLimited ? 'Too Many Requests' : 'Sorry, we couldn\'t fetch the news.'}</p>
            <p className="error-detail">{errorMessage}</p>
            {!rateLimited && (
              <button 
                onClick={() => fetchNews(0)} 
                className="retry-btn"
                disabled={loading}
              >
                {loading ? 'Retrying...' : 'Retry'}
              </button>
            )}
            {rateLimited && (
              <div className="rate-limit-message">
                <p>Please wait a few minutes before trying again.</p>
                <p>You can also try refreshing the page in a moment.</p>
              </div>
            )}
          </div>
        ) : articles.length > 0 ? (
          <div className="articles-grid">
            {articles.map((article, index) => (
              <NewsArticle key={index} article={article} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No articles found. Try a different search term or category.</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} QuickNews - Stay Informed</p>
      </footer>
    </div>
  );
};

export default NewsList;
