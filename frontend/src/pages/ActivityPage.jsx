import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// Components
import ActivityTimeline from '../components/activity/ActivityTimeline';
import ContributionHeatmap from '../components/activity/ContributionHeatmap';
import EventBreakdown from '../components/activity/EventBreakdown';
import Loader, { SectionLoader } from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

/**
 * Activity page showing user's GitHub activity and contributions
 */
const ActivityPage = () => {
  const { username } = useParams();
  const { 
    userData, 
    activityData,
    contributionData,
    loadUserData, 
    fetchActivityData,
    fetchContributionData,
    isLoading, 
    loadingStates,
    error 
  } = useUser();
  
  // Load data on mount
  useEffect(() => {
    if (username) {
      if (!userData) {
        loadUserData(username);
      } else {
        // If we already have user data but not activity data, fetch it
        if (!activityData) {
          fetchActivityData(username);
        }
        if (!contributionData) {
          fetchContributionData(username);
        }
      }
    }
  }, [username, userData, activityData, contributionData, loadUserData, fetchActivityData, fetchContributionData]);
  
  // Handle retry
  const handleRetry = () => {
    fetchActivityData(username);
    fetchContributionData(username);
  };
  
  // If error, display error message
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <ErrorMessage 
          message={`Failed to load activity data: ${error}`} 
          onRetry={handleRetry}
        />
      </div>
    );
  }
  
  // If loading, show loader
  if ((loadingStates.activity || loadingStates.contributions) && !activityData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" text={`Loading activity data for ${username}...`} />
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Activity & Contributions</h1>
        <p className="text-gray-600">
          GitHub activity patterns and contribution history for {username}
        </p>
      </div>
      
      {/* Contribution heatmap */}
      {contributionData ? (
        <ContributionHeatmap contributionData={contributionData} />
      ) : (
        <SectionLoader rows={10} />
      )}
      
      {/* Activity timeline and event breakdown */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity timeline - 2/3 width */}
        <div className="lg:col-span-2">
          {activityData ? (
            <ActivityTimeline activityData={activityData} />
          ) : (
            <SectionLoader rows={8} />
          )}
        </div>
        
        {/* Event breakdown - 1/3 width */}
        <div>
          {activityData ? (
            <EventBreakdown activityData={activityData} />
          ) : (
            <SectionLoader rows={8} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
