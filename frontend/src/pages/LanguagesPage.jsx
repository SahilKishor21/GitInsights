import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// Components
import LanguageBreakdown from '../components/languages/LanguageBreakdown';
import LanguageTrends from '../components/languages/LanguageTrends';
import Loader, { SectionLoader } from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

/**
 * Languages page with detailed language analysis
 */
const LanguagesPage = () => {
  const { username } = useParams();
  const { 
    userData, 
    languages, 
    languageTrends,
    loadUserData, 
    fetchLanguages,
    fetchLanguageTrends,
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
        // If we already have user data but not languages, fetch them
        if (!languages) {
          fetchLanguages(username);
        }
        if (!languageTrends) {
          fetchLanguageTrends(username);
        }
      }
    }
  }, [username, userData, languages, languageTrends, loadUserData, fetchLanguages, fetchLanguageTrends]);
  
  // Handle retry
  const handleRetry = () => {
    fetchLanguages(username);
    fetchLanguageTrends(username);
  };
  
  // If error, display error message
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <ErrorMessage 
          message={`Failed to load language data: ${error}`} 
          onRetry={handleRetry}
        />
      </div>
    );
  }
  
  // If loading, show loader
  if ((loadingStates.languages || loadingStates.trends) && !languages) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" text={`Loading language data for ${username}...`} />
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Language Analysis</h1>
        <p className="text-gray-600">
          Programming language breakdown and trends for {username}
        </p>
      </div>
      
      {/* Main language breakdown */}
      {languages ? (
        <LanguageBreakdown languages={languages} compact={false} />
      ) : (
        <SectionLoader rows={8} />
      )}
      
      {/* Language trends */}
      {languageTrends ? (
        <div className="mt-8">
          <LanguageTrends trends={languageTrends} />
        </div>
      ) : (
        <div className="mt-8">
          <SectionLoader rows={8} />
        </div>
      )}
    </div>
  );
};

export default LanguagesPage;
