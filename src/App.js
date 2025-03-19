import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import GameScreen from "./Components/GameScreen";
import Leaderboard from "./Components/LeaderBoard";
import EliminationPage from "./Components/EliminationPage";
import Riddles from "./Components/Riddles";
import Crossword from "./Components/Crossword";
import "./App.css";

function App() {
  const [riddles, setRiddles] = useState([]);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [isEliminated, setIsEliminated] = useState(false);

  const handleRiddleCollected = (riddle) => {
    setRiddles((prev) => [...prev, riddle]);
    if (riddles.length + 1 >= 10) {
      setIsGameCompleted(true);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              isEliminated ? (
                <Navigate to="/eliminated" />
              ) : isGameCompleted ? (
                <Navigate to="/map" />
              ) : (
                <GameScreen onRiddleCollected={handleRiddleCollected} riddlesCollected={riddles.length} />
              )
            }
          />
          <Route path="/eliminated" element={<EliminationPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/riddles" element={<Riddles />} />
          <Route path="/crossword" element={<Crossword/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
