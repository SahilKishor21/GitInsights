/**
 * GitHub Insights API client
 * Handles all communication with the backend API
 */

// Use direct URL to the backend instead of relying on proxy
const BACKEND_URL = 'http://localhost:8000';
const API_BASE_URL = `${BACKEND_URL}/api/v1`;

/**
 * Fetch data from the API with error handling
 * @param {string} endpoint - API endpoint path
 * @param {Object} options - Fetch options
 * @returns {Promise<Object|null>} - JSON response or null on error
 */
const fetchApi = async (endpoint, options = {}) => {
  try {
    // Log the request for debugging
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Requesting: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      mode: 'cors', // Enable CORS
      credentials: 'omit', // Don't send cookies
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `API Error: ${response.status}`;
      console.error(`API Error: ${endpoint}`, errorMessage);
      return null; // Return null instead of throwing
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    return null; // Return null instead of throwing to prevent infinite loop
  }
};

/**
 * GitHub Insights API methods
 */
const githubInsightsApi = {
  /**
   * Get a user's GitHub profile
   * @param {string} username - GitHub username
   * @returns {Promise<Object|null>} - User profile data
   */
  getUserProfile: (username) => fetchApi(`/users/${username}`),

  /**
   * Get a comprehensive summary of a user's GitHub presence
   * @param {string} username - GitHub username
   * @returns {Promise<Object|null>} - User summary data
   */
  getUserSummary: (username) => fetchApi(`/users/${username}/summary`),

  /**
   * Get a user's repositories
   * @param {string} username - GitHub username
   * @param {string} sort - Sort field (updated, created, pushed, full_name)
   * @param {string} direction - Sort direction (asc, desc)
   * @returns {Promise<Array|null>} - Repository data
   */
  getUserRepositories: (username, sort = "updated", direction = "desc") => 
    fetchApi(`/users/${username}/repositories?sort=${sort}&direction=${direction}`),

  /**
   * Get a user's language breakdown
   * @param {string} username - GitHub username
   * @returns {Promise<Object|null>} - Language data
   */
  getUserLanguages: (username) => fetchApi(`/users/${username}/languages`),

  /**
   * Get a user's activity timeline
   * @param {string} username - GitHub username
   * @param {number} days - Number of days to include (default: 30)
   * @returns {Promise<Object|null>} - Activity timeline data
   */
  getActivityTimeline: (username, days = 30) => 
    fetchApi(`/users/${username}/activity-timeline?days=${days}`),

  /**
   * Get a repository's details
   * @param {string} username - GitHub username
   * @param {string} repo - Repository name
   * @returns {Promise<Object|null>} - Repository data
   */
  getRepositoryStats: (username, repo) => fetchApi(`/users/${username}/${repo}/stats`),

  /**
   * Get repository insights for a user
   * @param {string} username - GitHub username
   * @returns {Promise<Object|null>} - Repository insights
   */
  getRepositoryInsights: (username) => fetchApi(`/users/${username}/repository-insights`),

  /**
   * Get language usage trends for a user
   * @param {string} username - GitHub username
   * @returns {Promise<Object|null>} - Language trends data
   */
  getLanguageTrends: (username) => fetchApi(`/users/${username}/language-trends`),

  /**
   * Get contribution heatmap data
   * @param {string} username - GitHub username
   * @param {number} days - Number of days to include (default: 365)
   * @returns {Promise<Object|null>} - Contribution heatmap data
   */
  getContributionHeatmap: (username, days = 365) => 
    fetchApi(`/users/${username}/contribution-heatmap?days=${days}`),
};

export default githubInsightsApi;