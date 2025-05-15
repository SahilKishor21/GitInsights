import React from 'react';

/**
 * User overview component displaying profile information
 * @param {Object} props
 * @param {Object} props.userData - User profile data
 */
const UserOverview = ({ userData }) => {
  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // If no user data, return empty
  if (!userData) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        {/* Avatar and basic info */}
        <div className="md:flex-shrink-0 p-6 bg-gray-50">
          <div className="flex flex-col items-center">
            <img
              src={userData.avatar_url}
              alt={`${userData.login}'s avatar`}
              className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
            />
            
            <h1 className="mt-4 text-2xl font-bold text-gray-800">
              {userData.name || userData.login}
            </h1>
            
            <p className="text-gray-600">@{userData.login}</p>
            
            <div className="mt-3 flex space-x-2">
              <a
                href={userData.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition"
              >
                GitHub Profile
              </a>
            </div>
          </div>
        </div>
        
        {/* User details */}
        <div className="p-6 md:p-8 flex-grow">
          <div className="mb-6">
            {userData.bio && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Bio
                </h3>
                <p className="text-gray-800">{userData.bio}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userData.company && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Company
                  </h3>
                  <p className="text-gray-800">{userData.company}</p>
                </div>
              )}
              
              {userData.location && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Location
                  </h3>
                  <p className="text-gray-800">{userData.location}</p>
                </div>
              )}
              
              {userData.blog && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Website
                  </h3>
                  <a
                    href={userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    {userData.blog}
                  </a>
                </div>
              )}
              
              {userData.email && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Email
                  </h3>
                  <a
                    href={`mailto:${userData.email}`}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    {userData.email}
                  </a>
                </div>
              )}
              
              {userData.twitter_username && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Twitter
                  </h3>
                  <a
                    href={`https://twitter.com/${userData.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    @{userData.twitter_username}
                  </a>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Joined
                </h3>
                <p className="text-gray-800">{formatDate(userData.created_at)}</p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800">
                  {userData.public_repos}
                </span>
                <span className="text-sm text-gray-600">Repositories</span>
              </div>
              
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800">
                  {userData.followers}
                </span>
                <span className="text-sm text-gray-600">Followers</span>
              </div>
              
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800">
                  {userData.following}
                </span>
                <span className="text-sm text-gray-600">Following</span>
              </div>
              
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-800">
                  {userData.public_gists || 0}
                </span>
                <span className="text-sm text-gray-600">Gists</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
