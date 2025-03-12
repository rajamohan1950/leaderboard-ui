import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8001";

const Leaderboard = ({ refreshTrigger }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setError(null);
        const response = await axios.get(`${API_URL}/top/10`);
        setLeaderboard(response.data);
      } catch (error) {
        setError("Error loading leaderboard");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchLeaderboard();

    // Set up auto-refresh interval (every 2 seconds)
    const intervalId = setInterval(fetchLeaderboard, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [refreshTrigger]); // Refresh when trigger changes

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return "bg-yellow-50 border-l-4 border-yellow-400 font-bold";
      case 1:
        return "bg-gray-50 border-l-4 border-gray-400 font-bold";
      case 2:
        return "bg-orange-50 border-l-4 border-orange-400 font-bold";
      default:
        return "hover:bg-gray-50";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Top 10 Players</h2>
      <div className="overflow-y-auto">
        <table className="w-full">
          <thead className="bg-white">
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 px-4">#</th>
              <th className="text-left py-2 px-4">Player</th>
              <th className="text-right py-2 px-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr 
                key={index} 
                className={`border-b ${getRankStyle(index)}`}
              >
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{entry.user}</td>
                <td className="py-3 px-4 text-right">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;

