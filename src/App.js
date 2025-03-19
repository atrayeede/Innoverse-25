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
import Crossword from "./Components/Crossword/Crossword";
import Intro from "./Components/Intro/Intro";
import AlterPage from "./Components/AlterPage/AlterPage";
import "./App.css";
import RulesPage from "./Components/RulesPages/RulesPage";
import Background from "./Components/Background";
import MainLayout from "./Components/Layouts/MainLayout";
import WinnerPage from "./Components/WinnerPages/WinnerPage";

function App() {
  const [riddles, setRiddles] = useState([]);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [isEliminated, setIsEliminated] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isLogin, setIsLogin] = useState(false)

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
                <MainLayout>
                  <GameScreen
                    onRiddleCollected={handleRiddleCollected}
                    isGameCompleted={isGameCompleted}
                    setIsEliminated={setIsEliminated}
                    setIsDone={setIsDone}
                    setIsLogin={setIsLogin}
                  />
                </MainLayout>
              }
            />
            <Route path="/eliminated" element={<EliminationPage />} />
            <Route
              path="/leaderboard"
              element={
                <MainLayout>
                  <Leaderboard />
                </MainLayout>
              }
            />
            <Route
              path="/crossword"
              element={
                <MainLayout>
                  <Background />
                  <Crossword />
                </MainLayout>
              }
            />
            <Route
              path="/winner"
              element={
                <MainLayout>
                  <Background />
                  <WinnerPage/>
                </MainLayout>
              }
            />
            <Route
              path="/Rules"
              element={
                <MainLayout>
                  <RulesPage />
                </MainLayout>
              }
            />
            <Route
              path="/riddles"
              element={
                isDone || 1 ? (
                  <MainLayout>
                    <Background />
                    <Riddles />
                  </MainLayout>
                ) : (
                  <Navigate to="/alter" />
                )
              }
            />
            <Route
              path="/alter"
              element={
                <MainLayout>
                  <AlterPage />
                </MainLayout>
              }
            />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
