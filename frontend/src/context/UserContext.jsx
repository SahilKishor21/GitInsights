import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import githubInsightsApi from '../api/githubInsightsApi';

// Create context
const UserContext = createContext();

/**
 * Provider component for GitHub user data
 */
export const UserProvider = ({ children }) => {
  // State for user data
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [languages, setLanguages] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [repoInsights, setRepoInsights] = useState(null);
  const [languageTrends, setLanguageTrends] = useState(null);
  const [contributionData, setContributionData] = useState(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    profile: false,
    repositories: false,
    languages: false,
    activity: false,
    insights: false,
    trends: false,
    contributions: false,
  });
  
  // Error state
  const [error, setError] = useState(null);
  
  // Ref to track if we're already loading data to prevent duplicate calls
  const isLoadingRef = useRef(false);
  
  // Recent searches
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading recent searches from localStorage', e);
      return [];
    }
  });
  
  // Save recent searches to localStorage
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
  }, [recentSearches]);
  
  /**
   * Update a specific loading state
   */
  const updateLoadingState = (key, value) => {
    setLoadingStates(prevStates => {
      const updatedStates = { ...prevStates, [key]: value };
      // Update overall loading state
      const anyLoading = Object.values(updatedStates).some(Boolean);
      setIsLoading(anyLoading);
      return updatedStates;
    });
  };
  
  /**
   * Clear all user data
   */
  const clearUserData = () => {
    setUserData(null);
    setRepositories([]);
    setLanguages(null);
    setActivityData(null);
    setRepoInsights(null);
    setLanguageTrends(null);
    setContributionData(null);
    setError(null);
  };
  
  /**
   * Fetch user profile data with better error handling
   */
  const fetchUserProfile = async (username) => {
    updateLoadingState('profile', true);
    try {
      const data = await githubInsightsApi.getUserProfile(username);
      if (data) {
        setUserData(data);
        return data;
      } else {
        console.warn('No user profile data returned for', username);
        setError(`User ${username} not found`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(`Failed to load user profile: ${error.message || 'Unknown error'}`);
      return null;
    } finally {
      updateLoadingState('profile', false);
    }
  };
  
  /**
   * Fetch user repositories with better error handling
   */
  const fetchRepositories = async (username) => {
    updateLoadingState('repositories', true);
    try {
      const data = await githubInsightsApi.getUserRepositories(username);
      if (data) {
        setRepositories(data);
        return data;
      } else {
        console.warn('No repository data returned');
        setRepositories([]);
        return [];
      }
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setRepositories([]);
      return [];
    } finally {
      updateLoadingState('repositories', false);
    }
  };
  
  /**
   * Fetch user language data with better error handling
   */
  const fetchLanguages = async (username) => {
    updateLoadingState('languages', true);
    try {
      const data = await githubInsightsApi.getUserLanguages(username);
      if (data) {
        setLanguages(data);
        return data;
      } else {
        console.warn('No language data returned');
        setLanguages(null);
        return null;
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
      setLanguages(null);
      return null;
    } finally {
      updateLoadingState('languages', false);
    }
  };
  
  /**
   * Fetch user activity data with better error handling
   */
  const fetchActivityData = async (username, days = 30) => {
    updateLoadingState('activity', true);
    try {
      const data = await githubInsightsApi.getActivityTimeline(username, days);
      if (data) {
        setActivityData(data);
        return data;
      } else {
        console.warn('No activity data returned');
        setActivityData(null);
        return null;
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
      setActivityData(null);
      return null;
    } finally {
      updateLoadingState('activity', false);
    }
  };
  
  /**
   * Fetch repository insights with better error handling
   */
  const fetchRepoInsights = async (username) => {
    updateLoadingState('insights', true);
    try {
      const data = await githubInsightsApi.getRepositoryInsights(username);
      if (data) {
        setRepoInsights(data);
        return data;
      } else {
        console.warn('No repository insights returned');
        setRepoInsights(null);
        return null;
      }
    } catch (error) {
      console.error('Error fetching repository insights:', error);
      setRepoInsights(null);
      return null;
    } finally {
      updateLoadingState('insights', false);
    }
  };
  
  /**
   * Fetch language trends with better error handling
   */
  const fetchLanguageTrends = async (username) => {
    updateLoadingState('trends', true);
    try {
      const data = await githubInsightsApi.getLanguageTrends(username);
      if (data) {
        setLanguageTrends(data);
        return data;
      } else {
        console.warn('No language trends returned');
        setLanguageTrends(null);
        return null;
      }
    } catch (error) {
      console.error('Error fetching language trends:', error);
      setLanguageTrends(null);
      return null;
    } finally {
      updateLoadingState('trends', false);
    }
  };
  
  /**
   * Fetch contribution heatmap with better error handling
   */
  const fetchContributionData = async (username, days = 365) => {
    updateLoadingState('contributions', true);
    try {
      const data = await githubInsightsApi.getContributionHeatmap(username, days);
      if (data) {
        setContributionData(data);
        return data;
      } else {
        console.warn('No contribution data returned');
        setContributionData(null);
        return null;
      }
    } catch (error) {
      console.error('Error fetching contribution data:', error);
      setContributionData(null);
      return null;
    } finally {
      updateLoadingState('contributions', false);
    }
  };
  
  /**
   * Load all data for a user with improved error handling and loop prevention
   */
  const loadUserData = async (newUsername) => {
    if (!newUsername) {
      setError("Username is required");
      return;
    }
    
    // Prevent duplicate loads
    if (isLoadingRef.current) {
      console.log('Already loading data, skipping new request');
      return;
    }
    
    isLoadingRef.current = true;
    
    // Clear previous data
    clearUserData();
    
    // Set the current username
    setUsername(newUsername);
    
    // Add to recent searches
    if (newUsername) {
      setRecentSearches(prev => {
        const filtered = prev.filter(name => name !== newUsername);
        return [newUsername, ...filtered].slice(0, 5); // Keep only 5 most recent
      });
    }
    
    // Fetch data with better error handling
    setIsLoading(true);
    setError(null);
    
    try {
      // First fetch the user profile to validate the user exists
      const profile = await fetchUserProfile(newUsername);
      
      if (!profile) {
        setError(`User ${newUsername} not found or API error occurred`);
        isLoadingRef.current = false;
        return;
      }
      
      // Then fetch the rest of the data in parallel
      await Promise.allSettled([
        fetchRepositories(newUsername),
        fetchLanguages(newUsername),
        fetchActivityData(newUsername),
        fetchRepoInsights(newUsername),
        fetchLanguageTrends(newUsername),
        fetchContributionData(newUsername),
      ]);
      
    } catch (error) {
      console.error("Error in loadUserData:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };
  
  // Context value
  const contextValue = {
    username,
    userData,
    repositories,
    languages,
    activityData,
    repoInsights,
    languageTrends,
    contributionData,
    isLoading,
    loadingStates,
    error,
    recentSearches,
    setUsername,
    loadUserData,
    fetchUserProfile,
    fetchRepositories,
    fetchLanguages,
    fetchActivityData,
    fetchRepoInsights,
    fetchLanguageTrends,
    fetchContributionData,
    clearUserData,
  };
  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to use the user context
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;