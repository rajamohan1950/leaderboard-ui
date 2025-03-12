import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = "http://localhost:8001";

const BulkDownload = () => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError("");
      
      const response = await axios.get(`${API_URL}/top/100`);
      const ws = XLSX.utils.json_to_sheet(response.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Leaderboard");
      
      const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([buffer], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      });
      
      saveAs(blob, `leaderboard_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (error) {
      setError("Error downloading data");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Download Scores</h2>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {downloading ? "Downloading..." : "Download Excel"}
      </button>
      {error && (
        <div className="mt-4 p-2 rounded bg-red-100 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default BulkDownload; 