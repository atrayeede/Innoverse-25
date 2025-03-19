import { useState, useEffect } from "react";
import QuestionPanel from "../QuestionPanel/QuestionPanel";
import TreeVisualization from "../TreeVisualization/TreeVisualization";
import { questionsData } from "../questions";
import "./GameScreen.css";
import Timer from "../Timer/Timer";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

function GameScreen({ onRiddleCollected, onElimination, riddlesCollected, setIsDone }) {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(Number(localStorage.getItem("user_score")) || 0);
  const name = localStorage.getItem("name");
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime, setStartTime] = useState(Number(localStorage.getItem("start_time")) || Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [treeData, setTreeData] = useState({
    id: "root",
    name: "Start",
    children: [
      { id: "1", name: "A", children: [] },
      { id: "2", name: "B", children: [] },
      { id: "3", name: "C", children: [] },
      { id: "4", name: "D", children: [] },
    ],
  });
  const [selectedPath, setSelectedPath] = useState(["root"]);

  // Shuffle questions on component mount
  useEffect(() => {
    const shuffledQuestions = [...questionsData].sort(() => Math.random() - 0.5).slice(0, 20);
    setQuestions(shuffledQuestions);
  }, []);

  useEffect(() => {
    localStorage.setItem("user_score", score);
    localStorage.setItem("start_time", startTime);
  }, [score, startTime]);

  const handleAnswerSelected = async (optionIndex) => {
    if (questions.length === 0) return; // Prevent errors if questions haven't loaded

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    const isFinalQuestion = currentQuestionIndex === 19;

    // Tree Traversal Logic
    let currentNode = treeData;
    const pathToUpdate = [...selectedPath];

    // Traverse tree
    for (let i = 1; i < pathToUpdate.length; i++) {
      const childId = pathToUpdate[i];
      const childIndex = currentNode.children.findIndex((child) => child.id === childId);
      if (childIndex !== -1) {
        currentNode = currentNode.children[childIndex];
      }
    }

    const selectedChild = currentNode.children[optionIndex];
    if (!selectedChild) return;

    const newPath = [...pathToUpdate, selectedChild.id];
    setSelectedPath(newPath);

    // Generate new children if none exist
    if (selectedChild.children.length === 0) {
      const newChildren = [
        { id: `${selectedChild.id}-0`, name: "A", children: [] },
        { id: `${selectedChild.id}-1`, name: "B", children: [] },
        { id: `${selectedChild.id}-2`, name: "C", children: [] },
        { id: `${selectedChild.id}-3`, name: "D", children: [] },
      ];

      const newTreeData = JSON.parse(JSON.stringify(treeData));
      let nodeToUpdate = newTreeData;

      for (let i = 1; i < pathToUpdate.length; i++) {
        const childId = pathToUpdate[i];
        const childIndex = nodeToUpdate.children.findIndex((child) => child.id === childId);
        if (childIndex !== -1) {
          nodeToUpdate = nodeToUpdate.children[childIndex];
        }
      }

      const childIndex = nodeToUpdate.children.findIndex((child) => child.id === selectedChild.id);
      if (childIndex !== -1) {
        nodeToUpdate.children[childIndex].children = newChildren;
      }

      setTreeData(newTreeData);
    }

    if (isCorrect) {
      setScore(prevScore => {
        const newScore = prevScore + 1;

        if (newScore === 10) {
          setIsDone(true);
          navigate("/riddles");
          alert("You have collected all the keys. Now you can proceed to the next round.");

          const playerData = {
            name: name,
            time: Date.now() - startTime,
          };

          fetch("http://127.0.0.1:8000/api/leaderboard/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playerData),
          })
            .then((response) => {
              if (!response.ok) throw new Error("Error submitting score");
              console.log("Score submitted successfully!");
            })
            .catch((error) => console.error("Submission error:", error));
        }

        return newScore;
      });
    } else {
      alert("Wrong answer! Try again.");
    }

    if (isFinalQuestion) {
      setGameCompleted(true);
      navigate("/eliminated");
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleTimeUpdate = (time) => {
    setElapsedTime(time);
  };

  return (
    <div className="game-screen">
      
      <div className="game-header">
        <h1><span style={{ color: "red" }}>TreeVerse</span> Round-1</h1>
        <div className="progress-indicator">
          <span>Questions: {currentQuestionIndex + 1}/{questions.length}</span>
        </div>
      </div>
      <Timer gameOver={gameCompleted} startTime={startTime} onTimeUpdate={handleTimeUpdate} />
      <div className="game-content">
        <div className="question-panel-container">
          {questions.length > 0 && (
            <QuestionPanel
              question={questions[currentQuestionIndex] || { text: "", options: [] }}
              onAnswerSelected={handleAnswerSelected}
            />
          )}
        </div>
        <div className="tree-visualization-container">
          <TreeVisualization treeData={treeData} selectedPath={selectedPath} />
        </div>
      </div>
    </div>
  );
}

export default GameScreen;
