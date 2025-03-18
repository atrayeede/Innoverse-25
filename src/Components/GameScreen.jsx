"use client";

import { useState, useEffect } from "react";
import QuestionPanel from "./QuestionPanel";
import TreeVisualization from "./TreeVisualization";
import { questionsData } from "./questions";
import Leaderboard from "./LeaderBoard";
import "./GameScreen.css";

function GameScreen({ onRiddleCollected, onElimination, riddlesCollected }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [hasWrongAnswer, setHasWrongAnswer] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [timerStarted, setTimerStarted] = useState(false)
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

  useEffect(() => {
    setQuestions([...questionsData].sort(() => Math.random() - 0.5));
  }, []);

  const handleAnswerSelected = (optionIndex) => {
    if (!timerStarted) {
      setTimerStarted(true)
    }

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = optionIndex === currentQuestion.correctIndex

    // Update correct answers count
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1)
    } else {
      setHasWrongAnswer(true)
    }

    // Find the current node in the tree based on the selected path
    let currentNode = treeData
    const pathToUpdate = [...selectedPath]

    // Navigate to the current node in the tree
    for (let i = 1; i < pathToUpdate.length; i++) {
      const childId = pathToUpdate[i]
      const childIndex = currentNode.children.findIndex((child) => child.id === childId)
      if (childIndex !== -1) {
        currentNode = currentNode.children[childIndex]
      }
    }

    // Find the child node that corresponds to the selected option
    const selectedChild = currentNode.children[optionIndex]
    if (!selectedChild) return

    // Update the selected path
    const newPath = [...pathToUpdate, selectedChild.id]
    setSelectedPath(newPath)

    // Check if this is the final question
    const isFinalQuestion = currentQuestionIndex === 9

    // Add four new child nodes to the selected child if it doesn't have any and not the final question
    if (selectedChild.children.length === 0) {
      let newChildren = []

      if (isFinalQuestion) {
        // For the final node, add a treasure chest node
        newChildren = [
          {
            id: `${selectedChild.id}-treasure`,
            name: hasWrongAnswer || !isCorrect ? "Empty Chest" : "Gold Chest",
            isChest: true,
            isFull: !hasWrongAnswer && isCorrect,
            imagePath: hasWrongAnswer || !isCorrect ? "/empty-chest.png" : "/gold-chest.png",
            children: [],
          },
        ]
      } else {
        // Regular nodes
        newChildren = [
          { id: `${selectedChild.id}-0`, name: "A", children: [] },
          { id: `${selectedChild.id}-1`, name: "B", children: [] },
          { id: `${selectedChild.id}-2`, name: "C", children: [] },
          { id: `${selectedChild.id}-3`, name: "D", children: [] },
        ]
      }

      // Create a deep copy of the tree and update it
      const newTreeData = JSON.parse(JSON.stringify(treeData))
      let nodeToUpdate = newTreeData

      // Navigate to the node to update
      for (let i = 1; i < pathToUpdate.length; i++) {
        const childId = pathToUpdate[i]
        const childIndex = nodeToUpdate.children.findIndex((child) => child.id === childId)
        if (childIndex !== -1) {
          nodeToUpdate = nodeToUpdate.children[childIndex]
        }
      }

      // Find the child node that corresponds to the selected option
      const childIndex = nodeToUpdate.children.findIndex((child) => child.id === selectedChild.id)
      if (childIndex !== -1) {
        nodeToUpdate.children[childIndex].children = newChildren
      }

      setTreeData(newTreeData)
    }

    // Move to the next question or end the game
    if (isFinalQuestion) {
      setGameCompleted(true)
    } else {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const resetGame = () => {
    setQuestions(questionsData())
    setCurrentQuestionIndex(0)
    setCorrectAnswers(0)
    setHasWrongAnswer(false)
    setGameCompleted(false)
    setTreeData({
      id: "root",
      name: "Start",
      children: [
        { id: "0", name: "A", children: [] },
        { id: "1", name: "B", children: [] },
        { id: "2", name: "C", children: [] },
        { id: "3", name: "D", children: [] },
      ],
    })
    setSelectedPath(["root"])
    setTimerStarted(false)
  

  

    // Move to next question
    setCurrentQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= questions.length && riddlesCollected < 10) {
        onElimination();
      }
      return nextIndex;
    });
  };

  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [playerData, setPlayerData] = useState({
    name: "",
    time: 0,
    questions: [],
  });

  const submitScore = async () => {
    if (playerData.questions.length !== 10) {
      alert("You must answer 10 questions to submit!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/leaderboard/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playerData),
      });

      if (response.ok) {
        setUpdateTrigger((prev) => prev + 1); // Update leaderboard
        alert("Score submitted successfully!");
      } else {
        alert("Error submitting score.");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };


  return (
    <div className="game-screen">
      <div className="game-header">
        <h1>Quiz Tree Challenge</h1>
        <div className="progress-indicator">
          <span>Riddles: {riddlesCollected}/10</span>
          <span>Questions: {currentQuestionIndex + 1}/{questions.length}</span>
        </div>
      </div>

      <div className="game-content">
        <div className="question-panel-container">
          {questions.length > 0 && (
            <QuestionPanel question={questions[currentQuestionIndex]} onAnswerSelected={handleAnswerSelected} />
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