import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

/**
 * Header component with navigation and search
 */
const Header = () => {
  const [searchInput, setSearchInput] = useState('');
  const { username, loadUserData, isLoading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on a user page
  const isUserPage = location.pathname.includes('/user/');
  
  // Split the current username from the path if on a user page
  const currentUsername = isUserPage ? location.pathname.split('/')[2] : '';
  
  /**
   * Handle search form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!searchInput.trim()) return;
    
    try {
      await loadUserData(searchInput.trim());
      navigate(`/user/${searchInput.trim()}`);
      setSearchInput('');
    } catch (error) {
      console.error('Search error:', error);
    }
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              GitHub Insights
            </Link>
          </div>
          
          {/* Search form */}
          <form onSubmit={handleSubmit} className="flex w-full md:w-auto">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search GitHub username"
              className="px-3 py-2 w-full md:w-64 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
            >
              {isLoading ? 'Loading...' : 'Search'}
            </button>
          </form>
          
          {/* Navigation (only shown on user pages) */}
          {isUserPage && (
            <nav className="flex items-center space-x-1 overflow-x-auto md:space-x-4 whitespace-nowrap pb-2 md:pb-0">
              <Link
                to={`/user/${currentUsername}`}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === `/user/${currentUsername}`
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Overview
              </Link>
              <Link
                to={`/user/${currentUsername}/repositories`}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === `/user/${currentUsername}/repositories`
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Repositories
              </Link>
              <Link
                to={`/user/${currentUsername}/languages`}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === `/user/${currentUsername}/languages`
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Languages
              </Link>
              <Link
                to={`/user/${currentUsername}/activity`}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === `/user/${currentUsername}/activity`
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Activity
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
