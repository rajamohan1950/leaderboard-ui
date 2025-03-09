
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Leaderboard, BulkUpload, Metrics, Docs } from "./pages";
import { ChartPieIcon, TableCellsIcon, UploadIcon, BookOpenIcon } from "@heroicons/react/24/outline";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-lg p-4">
          <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
          <ul className="mt-4 space-y-4">
            <li>
              <Link to="/" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
                <ChartPieIcon className="h-5 w-5" /> <span>Metrics</span>
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
                <TableCellsIcon className="h-5 w-5" /> <span>Leaderboard</span>
              </Link>
            </li>
            <li>
              <Link to="/bulk-upload" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
                <UploadIcon className="h-5 w-5" /> <span>Bulk Upload</span>
              </Link>
            </li>
            <li>
              <Link to="/docs" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
                <BookOpenIcon className="h-5 w-5" /> <span>API Docs</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<Metrics />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/bulk-upload" element={<BulkUpload />} />
            <Route path="/docs" element={<Docs />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

