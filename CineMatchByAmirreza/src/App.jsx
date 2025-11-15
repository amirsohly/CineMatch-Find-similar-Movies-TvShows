import { useState } from 'react';
import './App.css';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 
const BASE_URL = 'https://api.themoviedb.org/3';

function App() {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [movies, setMovies] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [selectedMovie, setSelectedMovie] = useState(null); 
  const [similarMovies, setSimilarMovies] = useState([]); 
  
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };
  
  const [searchType, setSearchType] = useState('movie'); 

  const handleInputChange = async (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    setSelectedMovie(null);
    setSimilarMovies([]);
    
    if (!newSearchTerm.trim()) {
      setMovies([]);
      setError(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const typeEndpoint = searchType === 'movie' ? 'movie' : 
                         searchType === 'tv' ? 'tv' : 'multi';
                         
    const url = `${BASE_URL}/search/${typeEndpoint}?api_key=${API_KEY}&query=${encodeURIComponent(newSearchTerm)}&language=en-US`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('API connection error.');
      const data = await response.json();
      
      if (data.results) {
        const filteredResults = data.results.filter(item => item.media_type !== 'person');
        setMovies(filteredResults.slice(0, 10)); 
      } else {
        setMovies([]);
      }

    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleMovieSelect = async (id, title, mediaType) => { 
    setMovies([]); 
    setSearchTerm(title); 
    setSelectedMovie(null); 
    setSimilarMovies([]); 
    setLoading(true);
    setError(null);

    const detailsEndpoint = mediaType === 'tv' ? 'tv' : 'movie'; 
    
    const recommendationsUrl = `${BASE_URL}/${detailsEndpoint}/${id}/recommendations?api_key=${API_KEY}&language=en-US`;
    const detailsUrl = `${BASE_URL}/${detailsEndpoint}/${id}?api_key=${API_KEY}&language=en-US`; 

    try {
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();
      
      detailsData.title = detailsData.title || detailsData.name; 
      detailsData.media_type = detailsEndpoint; 
      setSelectedMovie(detailsData);
      
      const recommendationsResponse = await fetch(recommendationsUrl);
      const recommendationsData = await recommendationsResponse.json();
      
      if (recommendationsData.results && recommendationsData.results.length > 0) {
        let recommendedMovies = recommendationsData.results;
        
        recommendedMovies.sort((a, b) => {
          if (b.vote_average !== a.vote_average) {
            return b.vote_average - a.vote_average;
          }
          const dateA = new Date(a.release_date || a.first_air_date || 0);
          const dateB = new Date(b.release_date || b.first_air_date || 0);
          return dateB - dateA; 
        });
        
        setSimilarMovies(recommendedMovies.slice(0, 20)); 
      }

    } catch (err) {
      setError('Failed to fetch media details or recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`App ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      
      <div className="top-bar">
        <a href="https://github.com/amirsohly" target="_blank" rel="noopener noreferrer" className="developer-link" dir="rtl">
        🔗 Developer: Amirreza - About Me
        </a>
        <button onClick={toggleTheme} className="theme-toggle">
          {isDarkTheme ? '☀️' : '🌙'}
        </button>
      </div>

      <h1>🎬 CineMatch</h1>
      {!searchTerm && movies.length === 0 && (
          <p className="app-tagline">
            Search and find your favorite movie or TV show by title, and we'll match you with the best recommendations.
          </p>
      )}
      
      <div className="search-type-toggle">
        <button 
          className={searchType === 'movie' ? 'active' : ''} 
          onClick={() => setSearchType('movie')}
        >
          Movies
        </button>
        <button 
          className={searchType === 'tv' ? 'active' : ''} 
          onClick={() => setSearchType('tv')}
        >
          TV Shows
        </button>
        <button 
          className={searchType === 'all' ? 'active' : ''} 
          onClick={() => setSearchType('all')}
        >
          All
        </button>
      </div>


      <div className="search-bar"> 
        <input
          type="text"
          placeholder={`Search ${searchType}...`} 
          value={searchTerm}
          onChange={handleInputChange} 
        />
        
        {movies.length > 0 && !loading && (
          <div className="suggestions-list">
            {movies.map((movie) => (
              <div 
                key={movie.id} 
                className="suggestion-card"
                // ✅ ارسال media_type یا searchType
                onClick={() => handleMovieSelect(movie.id, movie.title || movie.name, movie.media_type || searchType)} 
              >
                <img 
                  src={
                    movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : 'https://via.placeholder.com/40x60?text=N/A' 
                  } 
                  alt={movie.title || movie.name} 
                />
                <div className="suggestion-info">
                  <h4>{movie.title || movie.name}</h4>
                  <p>{movie.release_date ? `(${movie.release_date.substring(0, 4)})` : movie.first_air_date ? `(${movie.first_air_date.substring(0, 4)})` : 'N/A'} - {movie.media_type || searchType}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="status-container">
        {loading && <p>Searching...</p>}
        {error && <p style={{ color: 'red' }}>⚠️ Error: {error}</p>}
      </div>

      {selectedMovie && (
        <div className="similar-section">
          <div className="selected-movie-details">
              <img 
                src={
                  selectedMovie.poster_path 
                    ? `https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`
                    : 'https://via.placeholder.com/200x300?text=N/A' 
                } 
                alt={selectedMovie.title} 
              />
              <div className="info">
                <h2>Recommendations for: {selectedMovie.title} ({selectedMovie.media_type === 'tv' ? 'TV Show' : 'Movie'})</h2>
                <p>
                  <strong>Rating:</strong> {selectedMovie.vote_average ? selectedMovie.vote_average.toFixed(1) : 'N/A'}/10 | 
                  <strong> Year:</strong> {selectedMovie.release_date ? selectedMovie.release_date.substring(0, 4) : selectedMovie.first_air_date ? selectedMovie.first_air_date.substring(0, 4) : 'N/A'}
                </p>
              </div>
            </div>

          {similarMovies.length > 0 ? (
            <div className="movie-grid"> 
              {similarMovies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <img 
                    src={
                      movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                        : 'https://via.placeholder.com/200x300?text=N/A' 
                    } 
                    alt={movie.title || movie.name} 
                  />
                  <h3>{movie.title || movie.name}</h3>
                  <p>
                    Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
                    {(movie.release_date || movie.first_air_date) ? ` (${(movie.release_date || movie.first_air_date).substring(0, 4)})` : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            !loading && <p>No recommendations found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;