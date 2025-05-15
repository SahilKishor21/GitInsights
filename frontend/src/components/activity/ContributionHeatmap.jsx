import React from 'react';

/**
 * Contribution heatmap component similar to GitHub's contribution graph
 * @param {Object} props
 * @param {Object} props.contributionData - Contribution data from API
 */
const ContributionHeatmap = ({ contributionData }) => {
  if (!contributionData || !contributionData.contributions) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">No contribution data available</p>
      </div>
    );
  }
  
  // Helper function to get color intensity based on contribution count
  const getContributionColor = (count) => {
    if (count === 0) return '#ebedf0';  // Light gray for no contributions
    
    const quartiles = contributionData.statistics.quartiles || [1, 2, 4];
    
    if (count <= quartiles[0]) return '#9be9a8';  // Light green
    if (count <= quartiles[1]) return '#40c463';  // Medium green
    if (count <= quartiles[2]) return '#30a14e';  // Dark green
    return '#216e39';  // Darkest green
  };
  
  // Get the last 365 days of contributions
  const contributions = contributionData.contributions;
  const sortedDates = Object.keys(contributions).sort().reverse().slice(0, 365).reverse();
  
  // Group contributions by week
  const weeks = [];
  let currentWeek = [];
  
  sortedDates.forEach(date => {
    currentWeek.push({
      date,
      count: contributions[date] || 0,
    });
    
    // If we have 7 days, start a new week
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  // Add the last partial week if it exists
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  // Get month labels
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthPositions = [];
  
  let currentMonth = null;
  weeks.forEach((week, weekIndex) => {
    const firstDate = new Date(week[0].date);
    const month = firstDate.getMonth();
    
    if (month !== currentMonth) {
      monthPositions.push({
        month: monthLabels[month],
        position: weekIndex * 13, // 13px per week
      });
      currentMonth = month;
    }
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contribution Activity</h3>
        
        {/* Stats summary */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-gray-800">
              {contributionData.statistics.total_contributions}
            </p>
            <p className="text-sm text-gray-600">Total Contributions</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-gray-800">
              {contributionData.statistics.current_streak}
            </p>
            <p className="text-sm text-gray-600">Current Streak</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-gray-800">
              {contributionData.statistics.longest_streak}
            </p>
            <p className="text-sm text-gray-600">Longest Streak</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-gray-800">
              {contributionData.statistics.days_with_contributions}
            </p>
            <p className="text-sm text-gray-600">Active Days</p>
          </div>
        </div>
        
        {/* Heatmap */}
        <div className="overflow-x-auto">
          <div className="inline-block">
            {/* Month labels */}
            <div className="mb-2" style={{ paddingLeft: '30px' }}>
              <svg width="700" height="16">
                {monthPositions.map((month, index) => (
                  <text
                    key={index}
                    x={month.position}
                    y="12"
                    className="text-xs fill-gray-600"
                  >
                    {month.month}
                  </text>
                ))}
              </svg>
            </div>
            
            {/* Day labels and heatmap */}
            <div className="flex">
              {/* Day of week labels */}
              <div className="pr-2 flex flex-col justify-around" style={{ height: '104px' }}>
                <span className="text-xs text-gray-600">Mon</span>
                <span className="text-xs text-gray-600">Wed</span>
                <span className="text-xs text-gray-600">Fri</span>
              </div>
              
              {/* Contribution squares */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: getContributionColor(day.count) }}
                        title={`${day.date}: ${day.count} contributions`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex items-center gap-2 justify-end">
          <span className="text-xs text-gray-600">Less</span>
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ebedf0' }}></div>
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#9be9a8' }}></div>
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#40c463' }}></div>
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#30a14e' }}></div>
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#216e39' }}></div>
          <span className="text-xs text-gray-600">More</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionHeatmap;
