import React from 'react';

/**
 * Footer component
 */
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">GitHub Insights Dashboard</h3>
            <p className="text-gray-400 text-sm">
              Analyze and visualize GitHub profiles and repositories
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <a 
                href="https://github.com/features/actions" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                GitHub API
              </a>
              <span className="text-gray-500">|</span>
              <a 
                href="https://docs.github.com/en/rest" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                Docs
              </a>
              <span className="text-gray-500">|</span>
              <a 
                href="https://github.com/octokit/octokit.js" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
          <p>
            GitHub Insights Dashboard &copy; {new Date().getFullYear()}. 
            Built with FastAPI and React.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
