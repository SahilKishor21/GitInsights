import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

/**
 * Home page component with user search
 */
const HomePage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');
  const { recentSearches, loadUserData, isLoading } = useUser();
  const navigate = useNavigate();

  /**
   * Handle search form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!searchInput.trim()) {
      setSearchError('Please enter a GitHub username');
      return;
    }
    
    setSearchError('');
    
    try {
      // Try to load user data
      await loadUserData(searchInput.trim());
      
      // Navigate to user page
      navigate(`/user/${searchInput.trim()}`);
    } catch (error) {
      setSearchError(`Error: ${error.message}`);
    }
  };

  /**
   * Handle recent search click
   */
  const handleRecentSearchClick = (username) => {
    setSearchInput(username);
    loadUserData(username);
    navigate(`/user/${username}`);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">GitHub Insights Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover detailed analytics and insights for any GitHub user.
          Explore repositories, language usage, activity patterns, and more.
        </p>
        
        {/* Search form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col md:flex-row gap-2 justify-center">
            <div className="flex-grow max-w-md">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter GitHub username"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={isLoading}
              />
              {searchError && (
                <p className="text-red-500 text-sm mt-1 text-left">{searchError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
            >
              {isLoading ? 'Loading...' : 'Analyze Profile'}
            </button>
          </div>
        </form>
        
        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Recent Searches</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {recentSearches.map((username) => (
                <button
                  key={username}
                  onClick={() => handleRecentSearchClick(username)}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition"
                >
                  {username}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Feature highlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Repository Analytics</h3>
            <p className="text-gray-600">
              Analyze repository statistics, stars, forks, and activity.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Language Breakdown</h3>
            <p className="text-gray-600">
              Visualize language usage across all repositories.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Activity Patterns</h3>
            <p className="text-gray-600">
              Track contributions and GitHub activity over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
