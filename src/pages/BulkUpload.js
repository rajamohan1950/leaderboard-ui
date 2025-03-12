import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const API_URL = "http://localhost:8001";

const BulkUpload = ({ onScoreAdded }) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage("");
    setIsError(false);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      await axios.post(`${API_URL}/bulk-submit`, data);
      setMessage("Scores uploaded successfully!");
      setIsError(false);
      onScoreAdded(); // Trigger leaderboard refresh
    } catch (error) {
      setMessage("Error uploading scores");
      setIsError(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upload Scores</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? "Uploading..." : "Choose Excel File"}
        </label>
        <p className="mt-2 text-sm text-gray-600">
          Upload an Excel file with columns: user, score
        </p>
      </div>
      {message && (
        <div
          className={`mt-4 p-2 rounded ${
            isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default BulkUpload;

