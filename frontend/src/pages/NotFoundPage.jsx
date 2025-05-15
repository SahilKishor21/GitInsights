import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * 404 Not Found page
 */
const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Sorry, the page you're looking for doesn't exist. It might have been removed, 
        or you may have typed the URL incorrectly.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Go Back
        </button>
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;