import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import githubInsightsApi from '../../api/githubInsightsApi';
import Loader, { ChartLoader } from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

/**
 * Language trends component showing language usage over time
 * @param {Object} props
 * @param {Object} props.trends - Language trends data (if already loaded)
 * @param {string} props.username - GitHub username (if data needs to be loaded)
 */
const LanguageTrends = ({ trends: propsTrends, username }) => {
  const [trends, setTrends] = useState(propsTrends || null);
  const [loading, setLoading] = useState(!propsTrends);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('line'); // 'line' or 'bar'

  // Fetch language trends if not provided
  useEffect(() => {
    if (!propsTrends && username) {
      fetchLanguageTrends();
    }
  }, [propsTrends, username]);

  // Fetch language trends from API
  const fetchLanguageTrends = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await githubInsightsApi.getLanguageTrends(username);
      setTrends(data);
    } catch (error) {
      console.error('Error fetching language trends:', error);
      setError('Failed to load language trends. Please try again later.');
    } finally {
      setLoading(false);
    }
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

  // Format data for line chart
  const prepareLineChartData = () => {
    if (!trends || !trends.language_timeline) return [];

    const years = Object.keys(trends.language_timeline).sort();
    return years.map(year => {
      const yearData = { year };
      Object.entries(trends.top_languages).forEach(([lang]) => {
        yearData[lang] = trends.language_timeline[year][lang] || 0;
      });
      return yearData;
    });
  };

  // Format data for bar chart (stacked bars by year)
  const prepareBarChartData = () => {
    if (!trends || !trends.language_timeline) return [];

    const years = Object.keys(trends.language_timeline).sort();
    return years.map(year => {
      const yearData = { year };
      Object.entries(trends.top_languages).forEach(([lang]) => {
        yearData[lang] = trends.language_timeline[year][lang] || 0;
      });
      return yearData;
    });
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Filter out languages with 0 repos
      const nonZeroPayload = payload.filter(entry => entry.value > 0);
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
          <p className="font-medium text-gray-800">{label}</p>
          <div className="mt-1">
            {nonZeroPayload
              .sort((a, b) => b.value - a.value)
              .map((entry, index) => (
                <p 
                  key={index} 
                  className="text-sm" 
                  style={{ color: entry.color }}
                >
                  {entry.name}: {entry.value} {entry.value === 1 ? 'repo' : 'repos'}
                </p>
              ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // If loading, show loader
  if (loading) {
    return <ChartLoader height="h-96" />;
  }

  // If error, show error message
  if (error) {
    return <ErrorMessage message={error} />;
  }

  // If no data, show empty state
  if (!trends || !trends.language_timeline || Object.keys(trends.language_timeline).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">No language trends data available</p>
      </div>
    );
  }

  // Prepare chart data
  const lineChartData = prepareLineChartData();
  const barChartData = prepareBarChartData();
  const topLanguages = Object.entries(trends.top_languages).slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Language Trends Over Time</h3>
          
          {/* Chart type toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveChart('line')}
              className={`px-3 py-1 text-sm rounded ${
                activeChart === 'line'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setActiveChart('bar')}
              className={`px-3 py-1 text-sm rounded ${
                activeChart === 'bar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Bar Chart
            </button>
          </div>
        </div>
        
        {/* Language trend chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'line' ? (
              <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {topLanguages.slice(0, 5).map(([lang]) => (
                  <Line
                    key={lang}
                    type="monotone"
                    dataKey={lang}
                    name={lang}
                    stroke={getLanguageColor(lang)}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            ) : (
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {topLanguages.slice(0, 5).map(([lang], index) => (
                  <Bar
                    key={lang}
                    dataKey={lang}
                    name={lang}
                    stackId="a"
                    fill={getLanguageColor(lang)}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Top languages summary */}
        <div className="mt-8">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Top Languages by Repository Count</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topLanguages.map(([lang, count]) => (
              <div key={lang} className="bg-gray-50 rounded p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getLanguageColor(lang) }}
                    ></div>
                    <span className="text-gray-800 font-medium">{lang}</span>
                  </div>
                  <span className="text-gray-600">{count} {count === 1 ? 'repo' : 'repos'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Language diversity */}
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <div className="flex justify-between items-center">
            <span className="text-blue-900 font-medium">Language Diversity</span>
            <span className="text-blue-700">
              {Object.keys(trends.all_languages || {}).length} languages used
            </span>
          </div>
        </div>
        
        {/* Language growth analysis */}
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Language Growth Analysis</h4>
          <div className="p-4 border border-gray-200 rounded">
            {calculateLanguageGrowth(trends).map((item, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getLanguageColor(item.language) }}
                    ></div>
                    <span className="text-gray-800 font-medium">{item.language}</span>
                  </div>
                  <span 
                    className={`text-sm font-medium ${
                      item.growth > 0 ? 'text-green-600' : (item.growth < 0 ? 'text-red-600' : 'text-gray-600')
                    }`}
                  >
                    {item.growth > 0 ? '+' : ''}{item.growth} repos
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Calculate language growth and generate insights
 * @param {Object} trends - Language trends data
 * @returns {Array} Array of language growth insights
 */
const calculateLanguageGrowth = (trends) => {
  if (!trends || !trends.language_timeline) return [];

  const years = Object.keys(trends.language_timeline).sort();
  if (years.length < 2) return [];

  const firstYear = years[0];
  const lastYear = years[years.length - 1];
  const insights = [];

  // Calculate growth for top languages
  Object.entries(trends.top_languages).slice(0, 5).forEach(([lang, total]) => {
    const firstCount = trends.language_timeline[firstYear][lang] || 0;
    const lastCount = trends.language_timeline[lastYear][lang] || 0;
    const growth = lastCount - firstCount;
    
    let description;
    if (growth > 0) {
      description = `Increasing usage since ${firstYear}, with ${lastCount} repositories in ${lastYear}.`;
    } else if (growth < 0) {
      description = `Decreasing usage since ${firstYear}, with ${lastCount} repositories in ${lastYear}.`;
    } else {
      description = `Stable usage with ${lastCount} repositories in ${lastYear}.`;
    }
    
    insights.push({
      language: lang,
      growth,
      description
    });
  });
  
  // Sort by absolute growth, with highest growth (positive or negative) first
  return insights.sort((a, b) => Math.abs(b.growth) - Math.abs(a.growth));
};

export default LanguageTrends;
