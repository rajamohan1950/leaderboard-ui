
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Button, Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

//const API_URL = "http://0.0.0.0:10000"; // Ensure this matches your FastAPI URL

const API_URL = "https://leaderboard.onrender.com";

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [entries, setEntries] = useState([{ user: "", score: "" }]); // Dynamic rows for score submission

  // Fetch leaderboard data
  useEffect(() => {
    axios.get(`${API_URL}/top/10`)
      .then(response => setLeaderboard(response.data))
      .catch(error => console.error("Error fetching leaderboard:", error));
  }, []);

  // Handle input change for dynamic rows
  const handleChange = (index, event) => {
    const newEntries = [...entries];
    newEntries[index][event.target.name] = event.target.value;
    setEntries(newEntries);
  };

  // Add new row for input
  const addRow = () => {
    setEntries([...entries, { user: "", score: "" }]);
  };

  // Clone the last row for quick bulk addition
  const cloneLastRow = () => {
    if (entries.length > 0) {
      setEntries([...entries, { ...entries[entries.length - 1] }]);
    }
  };

  // Submit scores to API
  const submitScores = () => {
    entries.forEach(entry => {
      if (entry.user && entry.score) {
        axios.post(`${API_URL}/submit`, entry)
          .then(() => {
            console.log(`Submitted: ${entry.user} - ${entry.score}`);
            setEntries([{ user: "", score: "" }]); // Reset form after submission
            axios.get(`${API_URL}/top/10`).then(response => setLeaderboard(response.data));
          })
          .catch(error => console.error("Error submitting score:", error));
      }
    });
  };

  // Export leaderboard data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leaderboard);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leaderboard");

    // Save the file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, "leaderboard.xlsx");
  };

  // Import leaderboard data from Excel
  const importFromExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Format and add imported data
      const formattedData = sheetData.map(row => ({
        user: row["user"] || "",
        score: row["score"] || "",
      }));

      setEntries([...entries, ...formattedData]);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center">Leaderboard</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.user}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3 className="text-center mt-4">Submit New Scores</h3>
      <Table striped bordered>
        <thead>
          <tr>
            <th>User</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  type="text"
                  name="user"
                  value={entry.user}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Enter username"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  name="score"
                  value={entry.score}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Enter score"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="primary" className="m-2" onClick={addRow}>+ Add Row</Button>
      <Button variant="info" className="m-2" onClick={cloneLastRow}>Clone Last Row</Button>
      <Button variant="success" className="m-2" onClick={submitScores}>Submit Scores</Button>

      <hr />

      <h3 className="text-center mt-4">Bulk Upload & Download</h3>
      <Form.Group className="mb-3">
        <Form.Control type="file" accept=".xlsx" onChange={importFromExcel} />
      </Form.Group>
      <Button variant="warning" onClick={exportToExcel}>Download Leaderboard (Excel)</Button>
    </Container>
  );
}

export default App;

