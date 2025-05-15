/**
 * Date handling utilities
 */

/**
 * Get dates for a date range
 * @param {number} daysAgo - Days to go back
 * @returns {Array} - Array of dates in YYYY-MM-DD format
 */
export const getDateRange = (daysAgo) => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < daysAgo; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(formatDate(date));
  }
  
  return dates.reverse();
};

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Get month name from month index
 * @param {number} index - Month index (0-11)
 * @param {boolean} short - Use short names
 * @returns {string} - Month name
 */
export const getMonthName = (index, short = false) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const shortMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return short ? shortMonths[index] : months[index];
};

/**
 * Get day name from day index
 * @param {number} index - Day index (0-6)
 * @param {boolean} short - Use short names
 * @returns {string} - Day name
 */
export const getDayName = (index, short = false) => {
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ];
  
  const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return short ? shortDays[index] : days[index];
};

/**
 * Group dates by week for a contribution heatmap
 * @param {Object} contributions - Object with dates as keys and counts as values
 * @returns {Array} - Array of week arrays
 */
export const groupDatesByWeek = (contributions) => {
  // Sort dates
  const sortedDates = Object.keys(contributions).sort();
  
  // Group by week
  const weeks = [];
  let currentWeek = [];
  
  sortedDates.forEach(date => {
    const dayOfWeek = new Date(date).getDay();
    
    // If it's Sunday (0) and we have dates in current week, start a new week
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
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
  
  return weeks;
};

/**
 * Calculate current streak from contributions
 * @param {Object} contributions - Object with dates as keys and counts as values
 * @returns {number} - Current streak
 */
export const calculateCurrentStreak = (contributions) => {
  const sortedDates = Object.keys(contributions).sort().reverse();
  let streak = 0;
  
  for (const date of sortedDates) {
    if (contributions[date] > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Calculate longest streak from contributions
 * @param {Object} contributions - Object with dates as keys and counts as values
 * @returns {number} - Longest streak
 */
export const calculateLongestStreak = (contributions) => {
  const sortedDates = Object.keys(contributions).sort();
  let currentStreak = 0;
  let longestStreak = 0;
  
  for (const date of sortedDates) {
    if (contributions[date] > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return longestStreak;
};
