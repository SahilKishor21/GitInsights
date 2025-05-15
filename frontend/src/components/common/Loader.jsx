import React from 'react';

/**
 * Loading spinner component
 * @param {Object} props
 * @param {string} props.size - Size of the loader (sm, md, lg)
 * @param {string} props.text - Optional loading text
 */
const Loader = ({ size = 'md', text = 'Loading...' }) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`${sizeClasses[size]} rounded-full border-gray-300 border-t-blue-600 animate-spin`}
      ></div>
      {text && <p className="mt-2 text-gray-600">{text}</p>}
    </div>
  );
};

/**
 * Section loader with skeleton component
 */
export const SectionLoader = ({ rows = 3 }) => {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded mb-2.5"></div>
      ))}
      
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
};

/**
 * Card loader component
 */
export const CardLoader = ({ count = 1 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

/**
 * Chart loader component
 */
export const ChartLoader = ({ height = 'h-64' }) => {
  return (
    <div className={`${height} bg-white rounded-lg shadow-md p-4 animate-pulse`}>
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="flex items-end h-40 w-full space-x-2">
        <div className="bg-gray-200 rounded w-1/12 h-1/4"></div>
        <div className="bg-gray-200 rounded w-1/12 h-1/3"></div>
        <div className="bg-gray-200 rounded w-1/12 h-3/4"></div>
        <div className="bg-gray-200 rounded w-1/12 h-1/2"></div>
        <div className="bg-gray-200 rounded w-1/12 h-2/3"></div>
        <div className="bg-gray-200 rounded w-1/12 h-1/3"></div>
        <div className="bg-gray-200 rounded w-1/12 h-full"></div>
        <div className="bg-gray-200 rounded w-1/12 h-1/2"></div>
        <div className="bg-gray-200 rounded w-1/12 h-1/4"></div>
        <div className="bg-gray-200 rounded w-1/12 h-3/4"></div>
        <div className="bg-gray-200 rounded w-1/12 h-1/2"></div>
        <div className="bg-gray-200 rounded w-1/12 h-1/3"></div>
      </div>
    </div>
  );
};

export default Loader;
