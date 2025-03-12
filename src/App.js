import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Leaderboard, BulkUpload, AddScore, BulkDownload } from "./pages";

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md ${
        isActive
          ? "bg-blue-500 text-white"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  );
};

const App = () => {
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(0);

  const handleScoreAdded = () => {
    setRefreshLeaderboard(prev => prev + 1);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Simple Header */}
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex space-x-4">
              <NavLink to="/add-score">Add Score</NavLink>
              <NavLink to="/bulk-upload">Upload</NavLink>
              <NavLink to="/bulk-download">Download</NavLink>
            </div>
          </div>
        </nav>

        {/* Main Content with Split View */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Leaderboard - Always Visible */}
            <div className="w-1/2 bg-white rounded-lg shadow p-6">
              <Leaderboard refreshTrigger={refreshLeaderboard} />
            </div>

            {/* Right Panel - Dynamic Content */}
            <div className="w-1/2 bg-white rounded-lg shadow p-6">
              <Routes>
                <Route path="/" element={<AddScore onScoreAdded={handleScoreAdded} />} />
                <Route path="/add-score" element={<AddScore onScoreAdded={handleScoreAdded} />} />
                <Route path="/bulk-upload" element={<BulkUpload onScoreAdded={handleScoreAdded} />} />
                <Route path="/bulk-download" element={<BulkDownload />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;

