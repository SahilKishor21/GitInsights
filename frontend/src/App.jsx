import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';

// Pages
import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import RepositoriesPage from './pages/RepositoriesPage';
import LanguagesPage from './pages/LanguagesPage';
import ActivityPage from './pages/ActivityPage';
import NotFoundPage from './pages/NotFoundPage';

// Common components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

/**
 * Main application component
 */
function App() {
  return (
    <UserProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/user/:username" element={<UserPage />} />
              <Route path="/user/:username/repositories" element={<RepositoriesPage />} />
              <Route path="/user/:username/languages" element={<LanguagesPage />} />
              <Route path="/user/:username/activity" element={<ActivityPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;