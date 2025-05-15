import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * Event breakdown component showing distribution of GitHub events
 * @param {Object} props
 * @param {Object} props.activityData - Activity data from API
 */
const EventBreakdown = ({ activityData }) => {
  if (!activityData || !activityData.event_counts) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">No event data available</p>
      </div>
    );
  }
  
  // Format event type for display
  const formatEventType = (eventType) => {
    return eventType.replace('Event', '');
  };
  
  // Get event type color
  const getEventColor = (eventType) => {
    const colors = {
      PushEvent: '#10b981',          // Green
      PullRequestEvent: '#8b5cf6',   // Purple
      IssuesEvent: '#f97316',        // Orange
      CreateEvent: '#3b82f6',        // Blue
      DeleteEvent: '#ef4444',        // Red
      WatchEvent: '#f59e0b',         // Amber
      ForkEvent: '#06b6d4',          // Cyan
      CommitCommentEvent: '#ec4899', // Pink
      IssueCommentEvent: '#84cc16',  // Lime
      ReleaseEvent: '#14b8a6',       // Teal
      Default: '#6b7280',            // Gray
    };
    
    return colors[eventType] || colors.Default;
  };
  
  // Prepare data for pie chart
  const chartData = Object.entries(activityData.event_counts)
    .map(([type, count]) => ({
      name: formatEventType(type),
      value: count,
      fullName: type,
    }))
    .sort((a, b) => b.value - a.value);
  
  // Custom label for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show label for small slices
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-gray-600">{data.value} events</p>
          <p className="text-gray-600">{((data.value / activityData.total_events) * 100).toFixed(1)}%</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Breakdown</h3>
        
        {/* Pie chart */}
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getEventColor(entry.fullName)} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Event list */}
        <div className="space-y-3">
          {chartData.map(({ name, value, fullName }) => (
            <div key={fullName} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getEventColor(fullName) }}
                ></div>
                <span className="text-gray-800">{name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">{value}</span>
                <span className="text-gray-500 text-xs">
                  ({((value / activityData.total_events) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Total events */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Events</span>
            <span className="text-gray-800 font-bold">{activityData.total_events}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBreakdown;
