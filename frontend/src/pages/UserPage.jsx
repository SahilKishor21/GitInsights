import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// Components
import UserOverview from '../components/dashboard/UserOverview';
import StatsSummary from '../components/dashboard/StatsSummary';
import RecentActivity from '../components/dashboard/RecentActivity';
import RepositoryList from '../components/repositories/RepositoryList';
import LanguageBreakdown from '../components/languages/LanguageBreakdown';
import Loader, { SectionLoader } from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

/**
 * User profile overview page with stabilized rendering
 */
const UserPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  
  const { 
    userData, 
    repositories, 
    languages, 
    activityData,
    repoInsights,
    loadUserData, 
    isLoading, 
    error 
  } = useUser();
  
  // Load user data only once on mount or when username changes
  useEffect(() => {
    const loadData = async () => {
      if (username && !hasAttemptedLoad) {
        setHasAttemptedLoad(true);
        await loadUserData(username);
      }
    };
    
    loadData();
  }, [username, loadUserData, hasAttemptedLoad]);
  
  // Handle retry - prevent multiple retries
  const handleRetry = () => {
    setHasAttemptedLoad(false); // Reset so we can try loading again
  };
  
  // If error and we've attempted to load, display error message
  if (error && hasAttemptedLoad) {
    return (
      <div className="max-w-4xl mx-auto">
        <ErrorMessage 
          message={`Failed to load data for user "${username}": ${error}`} 
          onRetry={handleRetry}
        />
      </div>
    );
  }
  
  // If loading and we haven't loaded any data yet, show full page loader
  if (isLoading && !userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" text={`Loading profile for ${username}...`} />
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* User overview - only render if we have user data */}
      {userData ? (
        <UserOverview userData={userData} />
      ) : hasAttemptedLoad ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">User profile not available</p>
        </div>
      ) : (
        <SectionLoader />
      )}
      
      {/* Stats grid - only show if we have insights or show placeholder if attempted load */}
      {repoInsights && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Repository stats */}
          <StatsSummary 
            title="Repository Stats"
            stats={[
              { label: 'Total Repos', value: repoInsights.total_count || 0 },
              { label: 'Total Stars', value: repoInsights.stars_count || 0 },
              { label: 'Forks', value: repoInsights.fork_count || 0 },
              { label: 'Original Repos', value: repoInsights.original_count || 0 },
            ]}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            }
          />
          
          {/* Language stats */}
          {languages && (
            <StatsSummary 
              title="Language Stats"
              stats={[
                { label: 'Languages Used', value: Object.keys(languages.languages).length },
                { label: 'Total Code', value: `${(languages.total_bytes / 1024 / 1024).toFixed(2)} MB` },
                { label: 'Top Language', value: Object.entries(languages.percentages).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' },
              ]}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              }
            />
          )}
          
          {/* Activity stats */}
          {activityData && (
            <StatsSummary 
              title="Activity Stats"
              stats={[
                { label: 'Events (30d)', value: activityData.total_events },
                { label: 'Active Repos', value: activityData.repos_active.length },
                { label: 'Most Common', value: Object.entries(activityData.event_counts).sort((a, b) => b[1] - a[1])[0]?.[0]?.replace('Event', '') || 'N/A' },
              ]}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          )}
        </div>
      )}
      
      {/* Main content sections */}
      {repositories && repositories.length > 0 && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top repositories section - 2/3 width */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Repositories</h2>
            
            <RepositoryList 
              repositories={repositories.slice(0, 5)} 
              compact
              showViewAllLink={repositories.length > 5}
              viewAllUrl={`/user/${username}/repositories`}
            />
          </div>
          
          {/* Language breakdown section - 1/3 width */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Language Breakdown</h2>
            
            {languages ? (
              <LanguageBreakdown languages={languages} compact />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-500">No language data available</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Recent activity section */}
      {activityData && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <RecentActivity activityData={activityData} />
        </div>
      )}
      
      {/* Placeholder for when we've attempted to load but have no data */}
      {hasAttemptedLoad && !isLoading && !repositories?.length && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-center">No repositories or data found for this user.</p>
        </div>
      )}
    </div>
  );
};

export default UserPage;