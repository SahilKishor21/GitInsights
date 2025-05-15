import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useParams } from 'react-router-dom';

/**
 * Language breakdown component with pie chart
 * @param {Object} props
 * @param {Object} props.languages - Language data
 * @param {boolean} props.compact - Display in compact mode
 */
const LanguageBreakdown = ({ languages, compact = false }) => {
  const { username } = useParams();
  
  // If no language data, show empty state
  if (!languages || !languages.percentages || Object.keys(languages.percentages).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">No language data available</p>
      </div>
    );
  }
  
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
  
  // Format bytes to human-readable format
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Prepare data for chart
  const chartData = Object.entries(languages.percentages)
    .map(([name, percentage]) => ({
      name,
      value: percentage,
      bytes: languages.languages[name],
    }))
    .sort((a, b) => b.value - a.value);
  
  // Limit to top 8 languages for chart
  const topLanguages = chartData.slice(0, 8);
  
  // If there are more languages, add an "Other" category
  if (chartData.length > 8) {
    const otherValue = chartData
      .slice(8)
      .reduce((sum, item) => sum + item.value, 0);
    
    const otherBytes = chartData
      .slice(8)
      .reduce((sum, item) => sum + item.bytes, 0);
    
    topLanguages.push({
      name: 'Other',
      value: otherValue,
      bytes: otherBytes,
    });
  }
  
  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-gray-600">{data.value.toFixed(1)}%</p>
          <p className="text-gray-600">{formatBytes(data.bytes)}</p>
        </div>
      );
    }
    
    return null;
  };
  
  // Render compact version
  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-5">
          {/* Pie chart */}
          <div className="h-48 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topLanguages}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={1}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {topLanguages.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getLanguageColor(entry.name)} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Top languages list */}
          <div className="space-y-2">
            {topLanguages.slice(0, 5).map(({ name, value, bytes }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getLanguageColor(name) }}
                  ></span>
                  <span className="text-gray-800">{name}</span>
                </div>
                <span className="text-gray-600 text-sm">{value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          
          {/* View all link */}
          {chartData.length > 5 && username && (
            <div className="mt-4 text-center">
              <Link
                to={`/user/${username}/languages`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View all languages
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Render full version
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Language Breakdown</h3>
        
        <div className="md:flex">
          {/* Pie chart */}
          <div className="md:w-1/2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topLanguages}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={1}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {topLanguages.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getLanguageColor(entry.name)} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Language details */}
          <div className="md:w-1/2 mt-6 md:mt-0">
            <div className="space-y-3">
              {chartData.map(({ name, value, bytes }) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getLanguageColor(name) }}
                    ></span>
                    <span className="text-gray-800">{name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">{formatBytes(bytes)}</span>
                    <span className="text-gray-800 font-medium">{value.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Code Size</span>
                <span className="text-gray-800 font-medium">
                  {formatBytes(languages.total_bytes)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageBreakdown;
