import React from 'react';

/**
 * Error message component
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {function} props.onRetry - Optional retry function
 */
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
      <div className="flex items-start">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-red-500 mt-0.5 mr-2" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
            clipRule="evenodd" 
          />
        </svg>
        <div>
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-700 mt-1">{message}</p>
          
          {onRetry && (
            <button 
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Section error component
 */
export const SectionError = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-2">
      <div className="flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-red-500 mr-2" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
            clipRule="evenodd" 
          />
        </svg>
        <span className="text-red-700 text-sm">{message}</span>
        
        {onRetry && (
          <button 
            onClick={onRetry}
            className="ml-auto text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage; 
