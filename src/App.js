import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GameScreen from "./Components/GameScreen/GameScreen";
import Leaderboard from "./Components/LeaderBoard/LeaderBoard";
import EliminationPage from "./Components/EliminationPage/EliminationPage";
import Riddles from "./Components/Riddles/Riddles";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import AlterPage from "./Components/AlterPage/AlterPage";
import Crossword from "./Components/Crossword/Crossword";
import Intro from "./Components/Intro/Intro";
import "./App.css";
import AlterPage from "./Components/AlterPage/AlterPage";

function App() {
  const [riddles, setRiddles] = useState([]);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [isEliminated, setIsEliminated] = useState(false);
  const [isDone, setIsDone] = useState(true);

  const handleRiddleCollected = (riddle) => {
    setRiddles((prev) => [...prev, riddle]);
    if (riddles.length + 1 >= 10) {
      setIsGameCompleted(true);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENTID}>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route
              path="/adventure"
              element={
                <GameScreen
                  onRiddleCollected={handleRiddleCollected}
                  riddlesCollected={riddles.length}
                  setIsDone={setIsDone}
                />
              }
            />
            <Route path="/eliminated" element={<EliminationPage />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            {/* <Route path="/riddles" element={<Riddles />} /> */}
            <Route path="/crossword" element={<Crossword />} />
            <Route
              path="/riddles"
              element={isDone ? <Riddles /> : <Navigate to="/alter" />}
            />
            <Route path="/alter" element={<AlterPage />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
