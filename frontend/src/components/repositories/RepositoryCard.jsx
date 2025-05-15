import React from 'react';

/**
 * Repository card component
 * @param {Object} props
 * @param {Object} props.repository - Repository data
 * @param {boolean} props.compact - Display in compact mode
 */
const RepositoryCard = ({ repository, compact = false }) => {
  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get language color
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      Go: '#00ADD8',
      Ruby: '#701516',
      PHP: '#4F5D95',
      C: '#555555',
      'C++': '#f34b7d',
      'C#': '#178600',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Shell: '#89e051',
      Rust: '#dea584',
    };
    
    return colors[language] || '#8257e5'; // Default purple
  };
  
  // Render compact version if requested
  if (compact) {
    return (
      <div className="p-4 hover:bg-gray-50 transition">
        <div className="flex items-center justify-between">
          <div className="flex-grow">
            <a 
              href={repository.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {repository.name}
            </a>
            {repository.description && (
              <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                {repository.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {repository.language && (
              <div className="flex items-center space-x-1">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: getLanguageColor(repository.language) }}
                ></span>
                <span className="text-xs text-gray-600">{repository.language}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 16 16" 
                width="16" 
                height="16" 
                fill="#6B7280"
              >
                <path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z" />
              </svg>
              <span className="text-xs text-gray-600">{repository.stargazers_count}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 16 16" 
                width="16" 
                height="16" 
                fill="#6B7280"
              >
                <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              </svg>
              <span className="text-xs text-gray-600">{repository.forks_count}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Full repository card
  return (
    <div className="p-6 hover:bg-gray-50 transition">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="flex-grow mb-4 md:mb-0 md:mr-8">
          <div className="flex items-start">
            <div>
              <a 
                href={repository.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lg text-blue-600 hover:text-blue-800 font-semibold"
              >
                {repository.name}
              </a>
              
              {repository.fork && (
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  Fork
                </span>
              )}
              
              {repository.description && (
                <p className="text-gray-700 mt-2">
                  {repository.description}
                </p>
              )}
              
              <div className="mt-3 flex flex-wrap items-center space-x-4 text-sm">
                {repository.language && (
                  <div className="flex items-center space-x-1">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getLanguageColor(repository.language) }}
                    ></span>
                    <span className="text-gray-600">{repository.language}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 16 16" 
                    width="16" 
                    height="16" 
                    fill="#6B7280"
                  >
                    <path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z" />
                  </svg>
                  <span className="text-gray-600">{repository.stargazers_count}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 16 16" 
                    width="16" 
                    height="16" 
                    fill="#6B7280"
                  >
                    <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                  </svg>
                  <span className="text-gray-600">{repository.forks_count}</span>
                </div>
                
                {repository.license && (
                  <div className="flex items-center space-x-1">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 16 16" 
                      width="16" 
                      height="16" 
                      fill="#6B7280"
                    >
                      <path fillRule="evenodd" d="M8.75.75a.75.75 0 00-1.5 0V2h-.984c-.305 0-.604.08-.869.23l-1.288.737A.25.25 0 013.984 3H1.75a.75.75 0 000 1.5h.428L.066 9.192a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.514 3.514 0 00.686.45A4.492 4.492 0 003 11c.88 0 1.556-.22 2.023-.454a3.515 3.515 0 00.686-.45l.045-.04.016-.015.006-.006.002-.002.001-.002L5.25 9.5l.53.53a.75.75 0 00.154-.838L3.822 4.5h.162c.305 0 .604-.08.869-.23l1.289-.737a.25.25 0 01.124-.033h.984V13h-2.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-2.5V3.5h.984a.25.25 0 01.124.033l1.29.736c.264.152.563.231.868.231h.162l-2.112 4.692a.75.75 0 00.154.838l.53-.53-.53.53v.001l.002.002.002.002.006.006.016.015.045.04a3.517 3.517 0 00.686.45A4.492 4.492 0 0013 11c.88 0 1.556-.22 2.023-.454a3.512 3.512 0 00.686-.45l.045-.04.01-.01.006-.005.006-.006.002-.002.001-.002-.529-.531.53.53a.75.75 0 00.154-.838L13.823 4.5h.427a.75.75 0 000-1.5h-2.234a.25.25 0 01-.124-.033l-1.29-.736A1.75 1.75 0 009.735 2H8.75V.75zM1.695 9.227c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327l-1.305 2.9zm10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327l-1.305 2.9z" />
                    </svg>
                    <span className="text-gray-600">{repository.license.name}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 16 16" 
                    width="16" 
                    height="16" 
                    fill="#6B7280"
                  >
                    <path fillRule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z" />
                  </svg>
                  <span className="text-gray-600">
                    Updated {formatDate(repository.updated_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <a 
            href={repository.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition text-center"
          >
            View on GitHub
          </a>
          
          {repository.homepage && (
            <a 
              href={repository.homepage} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-medium rounded hover:bg-gray-200 transition text-center"
            >
              View Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepositoryCard;
