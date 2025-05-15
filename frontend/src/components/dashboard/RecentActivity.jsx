import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Recent activity component showing user activity over time
 * @param {Object} props
 * @param {Object} props.activityData - Activity data
 */
const RecentActivity = ({ activityData }) => {
  // If no activity data, return empty state
  if (!activityData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">No activity data available</p>
      </div>
    );
  }
  
  // Sort dates for the chart
  const sortedDates = Object.keys(activityData.daily_activity).sort();
  
  // Format event type for display
  const formatEventType = (eventType) => {
    return eventType.replace('Event', '');
  };
  
  // Prepare chart data
  const chartData = sortedDates.map(date => ({
    date,
    events: activityData.daily_activity[date].total || 0,
  }));
  
  // Sort events by count
  const sortedEvents = Object.entries(activityData.event_counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5 events
  
  // Get active repositories
  const activeRepos = activityData.repos_active.slice(0, 5); // Top 5 repos
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Over Time</h3>
        
        {/* Activity chart */}
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => value.slice(5)} // Show only MM-DD
                stroke="#9CA3AF"
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="events" 
                stroke="#3B82F6" 
                strokeWidth={2} 
                dot={{ r: 2 }} 
                activeDot={{ r: 5 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top event types */}
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-3">Top Event Types</h3>
            <div className="space-y-2">
              {sortedEvents.map(([eventType, count]) => (
                <div key={eventType} className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {formatEventType(eventType)}
                  </span>
                  <span className="text-gray-800 font-medium">
                    {count} events
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Active repositories */}
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-3">Active Repositories</h3>
            <div className="space-y-2">
              {activeRepos.map((repo) => {
                const repoName = repo.split('/')[1];
                return (
                  <div key={repo} className="flex justify-between items-center">
                    <span className="text-gray-600 truncate" style={{ maxWidth: '180px' }}>
                      {repoName}
                    </span>
                    <a 
                      href={`https://github.com/${repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
