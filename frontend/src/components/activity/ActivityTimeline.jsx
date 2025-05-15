import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Activity timeline component showing activity over time
 * @param {Object} props
 * @param {Object} props.activityData - Activity data from API
 */
const ActivityTimeline = ({ activityData }) => {
  if (!activityData || !activityData.daily_activity) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">No activity data available</p>
      </div>
    );
  }
  
  // Sort dates for the chart
  const sortedDates = Object.keys(activityData.daily_activity).sort();
  
  // Prepare chart data
  const chartData = sortedDates.map(date => {
    const activity = activityData.daily_activity[date];
    return {
      date,
      total: activity.total || 0,
      push: activity.PushEvent || 0,
      pullRequest: activity.PullRequestEvent || 0,
      issues: activity.IssuesEvent || 0,
      create: activity.CreateEvent || 0,
    };
  });
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Timeline</h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => value.slice(5)} // Show only MM-DD
                stroke="#6b7280"
              />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                name="Total Events"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="push" 
                stroke="#10b981" 
                strokeWidth={1.5} 
                name="Push Events"
                strokeDasharray="5 5"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="pullRequest" 
                stroke="#8b5cf6" 
                strokeWidth={1.5} 
                name="Pull Requests"
                strokeDasharray="5 5"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="issues" 
                stroke="#f97316" 
                strokeWidth={1.5} 
                name="Issues"
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-600"></div>
            <span className="text-xs text-gray-600">Total Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-green-500 border-dashed"></div>
            <span className="text-xs text-gray-600">Push Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-purple-600 border-dashed"></div>
            <span className="text-xs text-gray-600">Pull Requests</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-orange-600 border-dashed"></div>
            <span className="text-xs text-gray-600">Issues</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline; 
