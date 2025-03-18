"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LeaderBoard.css"; 

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/leaderboard/");
        if (response.ok) {
          const data = await response.json();
          setPlayers(data.sort((a, b) => a.time - b.time));
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []); 

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Time (seconds)</th>
            <th>Questions & Answers</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>{player.name}</td>
              <td>{player.time.toFixed(2)}s</td>
              <td>
                <ul>
                  {player.questions.map((q, i) => (
                    <li key={i}>
                      <strong>Q:</strong> {q.question} <br />
                      <strong>A:</strong> {q.answer}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/" className="back-link">Back to Game</Link>
    </div>
  );
};

export default Leaderboard;
