import React from 'react';

/**
 * Stats summary component displaying key metrics
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {Array} props.stats - Array of stat objects with label and value
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.className - Additional CSS classes
 */
const StatsSummary = ({ title, stats, icon, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-5">
        <div className="flex items-center mb-4">
          {icon && (
            <div className="mr-3 p-2 rounded-full bg-blue-100 text-blue-600">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-600">{stat.label}</span>
              <span className="font-medium text-gray-900">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
