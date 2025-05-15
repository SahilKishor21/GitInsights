import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RepositoryCard from './RepositoryCard';

/**
 * Repository list component with filtering and sorting
 * @param {Object} props
 * @param {Array} props.repositories - List of repositories
 * @param {boolean} props.compact - Display in compact mode
 * @param {boolean} props.showViewAllLink - Show view all link
 * @param {string} props.viewAllUrl - URL for view all link
 */
const RepositoryList = ({ 
  repositories, 
  compact = false, 
  showViewAllLink = false,
  viewAllUrl = ''
}) => {
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterLanguage, setFilterLanguage] = useState('');
  
  // If no repositories, show empty state
  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">No repositories found</p>
      </div>
    );
  }
  
  // Get unique languages
  const languages = [...new Set(
    repositories
      .map(repo => repo.language)
      .filter(Boolean)
  )].sort();
  
  // Sort and filter repositories
  const sortedRepositories = [...repositories]
    .filter(repo => !filterLanguage || repo.language === filterLanguage)
    .sort((a, b) => {
      // Handle different sort fields
      const aValue = sortBy === 'name' ? a[sortBy]?.toLowerCase() : a[sortBy];
      const bValue = sortBy === 'name' ? b[sortBy]?.toLowerCase() : b[sortBy];
      
      // Handle null values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      // Handle dates
      if (sortBy.includes('_at')) {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      // Handle numbers and strings
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Default string comparison
      return sortOrder === 'asc' 
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
  
  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc'); // Default to descending
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Controls - only show if not in compact mode */}
      {!compact && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0">
            {/* Sort controls */}
            <div className="flex items-center space-x-2">
              <label htmlFor="sortBy" className="text-sm text-gray-600">
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  // Reset sort order to desc for stars and forks
                  if (['stargazers_count', 'forks_count'].includes(e.target.value)) {
                    setSortOrder('desc');
                  }
                }}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="updated_at">Last Updated</option>
                <option value="created_at">Created Date</option>
                <option value="name">Name</option>
                <option value="stargazers_count">Stars</option>
                <option value="forks_count">Forks</option>
              </select>
              
              <button
                onClick={() => toggleSort(sortBy)}
                className="text-sm flex items-center space-x-1 text-gray-600 hover:text-gray-800"
              >
                <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {sortOrder === 'asc' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  )}
                </svg>
              </button>
            </div>
            
            {/* Filter controls */}
            <div className="flex items-center space-x-2">
              <label htmlFor="filterLanguage" className="text-sm text-gray-600">
                Filter by language:
              </label>
              <select
                id="filterLanguage"
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              
              {filterLanguage && (
                <button
                  onClick={() => setFilterLanguage('')}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Repository list */}
      <div className="divide-y divide-gray-200">
        {sortedRepositories.map(repo => (
          <RepositoryCard key={repo.id} repository={repo} compact={compact} />
        ))}
      </div>
      
      {/* View all link */}
      {showViewAllLink && viewAllUrl && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
          <Link 
            to={viewAllUrl} 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View all repositories
          </Link>
        </div>
      )}
    </div>
  );
};

export default RepositoryList;
