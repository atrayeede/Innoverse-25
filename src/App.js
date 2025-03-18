

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import GameScreen from "./Components/GameScreen"
import Riddles from "./Components/Riddles"
import "./App.css"

function App() {
  const [riddles, setRiddles] = useState([])
  const [isGameCompleted, setIsGameCompleted] = useState(false)
  const [isEliminated, setIsEliminated] = useState(false)

  const handleRiddleCollected = (riddle) => {
    setRiddles((prevRiddles) => [...prevRiddles, riddle])

    if (riddles.length + 1 >= 10) {
      setIsGameCompleted(true)
    }
  }

  const handleElimination = () => {
    setIsEliminated(true)
  }

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
                <GameScreen
                  onRiddleCollected={handleRiddleCollected}
                  onElimination={handleElimination}
                  riddlesCollected={riddles.length}
                />
              )
            }
          />
          <Route path="/riddles" element={<Riddles/>} />

        </Routes>
      </div>
    </Router>
  )
}

export default App

