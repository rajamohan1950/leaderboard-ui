import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://leaderboard-api.onrender.com";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/top/10`)
      .then((response) => setLeaderboard(response.data))
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Rank</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index} className="text-center border">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{entry.user}</td>
              <td className="p-2 border">{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;

