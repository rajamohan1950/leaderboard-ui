import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8001";

const AddScore = ({ onScoreAdded }) => {
  const [user, setUser] = useState("");
  const [score, setScore] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/submit`, {
        user,
        score: parseInt(score),
      });
      setMessage("Score added successfully!");
      setIsError(false);
      setUser("");
      setScore("");
      onScoreAdded(); // Trigger leaderboard refresh
    } catch (error) {
      setMessage("Error adding score");
      setIsError(true);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add New Score</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Player name"
            required
            className="w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="Score"
            required
            min="0"
            className="w-full p-2 border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Add Score
        </button>
      </form>
      {message && (
        <div className={`mt-4 p-2 rounded ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AddScore; 