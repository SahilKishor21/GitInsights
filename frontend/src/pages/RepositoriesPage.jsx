import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// Components
import RepositoryList from '../components/repositories/RepositoryList';
import StatsSummary from '../components/dashboard/StatsSummary';
import Loader, { SectionLoader } from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

/**
 * Repositories page with full list and statistics
 */
const RepositoriesPage = () => {
  const { username } = useParams();
  const { 
    userData, 
    repositories, 
    repoInsights,
    loadUserData, 
    fetchRepositories,
    isLoading, 
    loadingStates,
    error 
  } = useUser();
  
  // Load user data if not already loaded
  useEffect(() => {
    if (username && !userData) {
      loadUserData(username);
    }
  }, [username, userData, loadUserData]);
  
  // Handle retry
  const handleRetry = () => {
    fetchRepositories(username);
  };
  
  // If error, display error message
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <ErrorMessage 
          message={`Failed to load repositories: ${error}`} 
          onRetry={handleRetry}
        />
      </div>
    );
  }
  
  // If loading, show loader
  if (loadingStates.repositories && !repositories.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" text={`Loading repositories for ${username}...`} />
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Repositories</h1>
        <p className="text-gray-600">
          All public repositories for {username}
        </p>
      </div>
      
      {/* Repository statistics */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {repoInsights ? (
          <>
            <StatsSummary 
              title="Overview"
              stats={[
                { label: 'Total Repos', value: repoInsights.total_count || 0 },
                { label: 'Original', value: repoInsights.original_count || 0 },
                { label: 'Forked', value: repoInsights.fork_count || 0 },
              ]}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              }
            />
            
            <StatsSummary 
              title="Stars & Forks"
              stats={[
                { label: 'Total Stars', value: repoInsights.stars_count || 0 },
                { label: 'Most Starred', value: repoInsights.most_starred?.name || 'N/A' },
                { label: 'Total Forks', value: repoInsights.fork_count || 0 },
              ]}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
            />
            
            <StatsSummary 
              title="Language Distribution"
              stats={[
                { label: 'Languages', value: Object.keys(repoInsights.language_distribution || {}).length },
                { label: 'Top Language', value: Object.entries(repoInsights.language_distribution || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' },
                { label: 'Repos with Lang', value: Object.values(repoInsights.language_distribution || {}).reduce((a, b) => a + b, 0) },
              ]}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              }
            />
            
            <StatsSummary 
              title="Timeline"
              stats={[
                { label: 'Active Years', value: Object.keys(repoInsights.created_timeline || {}).length },
                { label: 'Best Year', value: Object.entries(repoInsights.created_timeline || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A' },
                { label: 'Latest Update', value: Object.keys(repoInsights.updated_timeline || {}).sort().reverse()[0] || 'N/A' },
              ]}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </>
        ) : (
          <>
            <SectionLoader />
            <SectionLoader />
            <SectionLoader />
            <SectionLoader />
          </>
        )}
      </div>
      
      {/* Repository list */}
      {isLoading && !repositories.length ? (
        <SectionLoader rows={10} />
      ) : (
        <RepositoryList 
          repositories={repositories} 
          compact={false}
        />
      )}
    </div>
  );
};

export default RepositoriesPage;
