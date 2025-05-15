/**
 * Color utilities for charts and visualizations
 */

/**
 * Get a language color from GitHub's language color scheme
 * @param {string} language - Programming language name
 * @returns {string} - Hex color code
 */
export const getLanguageColor = (language) => {
  // Color mapping based on GitHub's language colors
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
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    Scala: '#c22d40',
    Haskell: '#5e5086',
    Elixir: '#6e4a7e',
    Clojure: '#db5855',
    Lua: '#000080',
    Perl: '#0298c3',
    R: '#198CE7',
    Groovy: '#e69f56',
    'Objective-C': '#438eff',
    CoffeeScript: '#244776',
    Vue: '#2c3e50',
    Jupyter: '#DA5B0B',
    // Add more languages as needed
  };
  
  // Return color or default purple
  return colors[language] || '#8257e5';
};

/**
 * Generate a color palette with a specific length
 * @param {number} length - Number of colors needed
 * @returns {Array} - Array of hex color codes
 */
export const generateColorPalette = (length) => {
  // Base colors for small arrays
  const baseColors = [
    '#4285F4', // Blue
    '#EA4335', // Red
    '#FBBC05', // Yellow
    '#34A853', // Green
    '#00A1F1', // Light Blue
    '#7CBB00', // Lime
    '#F65314', // Orange
    '#FFBB00', // Amber
    '#5C2D91', // Purple
    '#0078D7', // Dark Blue
    '#008272', // Teal
    '#FFB900', // Gold
    '#B4A7D6', // Lavender
    '#A2C4C9', // Light Teal
    '#D5A6BD', // Pink
    '#C9DAF8', // Light Blue
  ];
  
  // If we have enough base colors, use those
  if (length <= baseColors.length) {
    return baseColors.slice(0, length);
  }
  
  // Otherwise, generate additional colors by interpolating hues
  const colors = [...baseColors];
  
  // Generate additional colors
  const additionalCount = length - baseColors.length;
  
  for (let i = 0; i < additionalCount; i++) {
    // Generate evenly spaced hues
    const hue = (i * 360 / additionalCount) % 360;
    
    // Vary saturation and lightness slightly for visual interest
    const saturation = 70 + (i % 3) * 10; // 70-90%
    const lightness = 45 + (i % 2) * 10;  // 45-55%
    
    // Create HSL color and convert to hex
    const color = hslToHex(hue, saturation, lightness);
    colors.push(color);
  }
  
  return colors;
};

/**
 * Convert HSL color to hex
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} - Hex color code
 */
export const hslToHex = (h, s, l) => {
  // Convert HSL to RGB
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  
  let r, g, b;
  
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  
  // Convert RGB to hex
  const toHex = (x) => {
    const hex = Math.round((x + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Get color for GitHub event type
 * @param {string} eventType - GitHub event type
 * @returns {string} - Hex color code
 */
export const getEventColor = (eventType) => {
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
    // Default color
    Default: '#6b7280',            // Gray
  };
  
  return colors[eventType] || colors.Default;
};

/**
 * Get contribution color based on count and quartiles
 * @param {number} count - Number of contributions
 * @param {Array} quartiles - Array of quartile values [q1, q2, q3]
 * @returns {string} - Hex color code
 */
export const getContributionColor = (count, quartiles = [1, 2, 4]) => {
  if (count === 0) return '#ebedf0';  // Light gray for no contributions
  
  if (count <= quartiles[0]) return '#9be9a8';  // Light green
  if (count <= quartiles[1]) return '#40c463';  // Medium green
  if (count <= quartiles[2]) return '#30a14e';  // Dark green
  return '#216e39';  // Darkest green
};