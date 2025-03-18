"use client"

import { useState, useEffect } from "react";
import QuestionPanel from "./QuestionPanel";
import TreeVisualization from "./TreeVisualization";
import { questionsData } from "./questions";
import Leaderboard from "./LeaderBoard";
import "./GameScreen.css";
import Timer from "./Timer"
import "./GameScreen.css"


function GameScreen({ onRiddleCollected, onElimination, riddlesCollected }) {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set())
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [score, setScore] = useState(0)
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
  })
  const [selectedPath, setSelectedPath] = useState(["root"])

  // Shuffle questions on component mount
  useEffect(() => {
    setQuestions([...questionsData].sort(() => Math.random() - 0.5))
  }, [])

  // Get a random unanswered question
  const getNextQuestion = () => {
    // If we've already answered all questions, return null
    if (answeredQuestions.size >= questions.length) {
      return null
    }

    // Find the next unanswered question
    for (let i = 0; i < questions.length; i++) {
      if (!answeredQuestions.has(i)) {
        return i
      }
    }

    return null
  }

  const handleAnswerSelected = (optionIndex) => {
    if (!timerStarted) {
      setTimerStarted(true)
    }

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = optionIndex === currentQuestion.correctIndex

    // Mark this question as answered
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestionIndex]))

    if (isCorrect) {
      setCorrectAnswers((prev) => {
        const updatedCorrectAnswers = prev + 1
        if (updatedCorrectAnswers === 10) {
          setTimeout(() => {
            alert("You win!")
            setGameCompleted(true)
          }, 300)
        }
        return updatedCorrectAnswers
      })
    } else {
      setHasWrongAnswer(true)
    }

    // Proceed with tree update logic
    let currentNode = treeData
    const pathToUpdate = [...selectedPath]

    for (let i = 1; i < pathToUpdate.length; i++) {
      const childId = pathToUpdate[i]
      const childIndex = currentNode.children.findIndex((child) => child.id === childId)
      if (childIndex !== -1) {
        currentNode = currentNode.children[childIndex]
      }
    }

    const selectedChild = currentNode.children[optionIndex]
    if (!selectedChild) return

    const newPath = [...pathToUpdate, selectedChild.id]
    setSelectedPath(newPath)

    if (selectedChild.children.length === 0) {
      let newChildren = []

      // Only show chest at the end of the game
      if (gameCompleted || correctAnswers + (isCorrect ? 1 : 0) >= 10) {
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
        newChildren = [
          { id: `${selectedChild.id}-0`, name: "A", children: [] },
          { id: `${selectedChild.id}-1`, name: "B", children: [] },
          { id: `${selectedChild.id}-2`, name: "C", children: [] },
          { id: `${selectedChild.id}-3`, name: "D", children: [] },
        ]
      }

      const newTreeData = JSON.parse(JSON.stringify(treeData))
      let nodeToUpdate = newTreeData

      for (let i = 1; i < pathToUpdate.length; i++) {
        const childId = pathToUpdate[i]
        const childIndex = nodeToUpdate.children.findIndex((child) => child.id === childId)
        if (childIndex !== -1) {
          nodeToUpdate = nodeToUpdate.children[childIndex]
        }
      }

      const childIndex = nodeToUpdate.children.findIndex((child) => child.id === selectedChild.id)
      if (childIndex !== -1) {
        nodeToUpdate.children[childIndex].children = newChildren
      }

      setTreeData(newTreeData)
    }

    // Check if we've answered all questions or reached 10 correct answers
    if (correctAnswers + (isCorrect ? 1 : 0) >= 10) {
      setGameCompleted(true)
    } else {
      // Check if we've answered all questions without getting 10 correct
      if (answeredQuestions.size + 1 >= questions.length) {
        setTimeout(() => {
          alert("You terminated!")
          setGameCompleted(true)
        }, 300)
      } else {
        // Get the next question
        const nextQuestionIndex = getNextQuestion()
        if (nextQuestionIndex !== null) {
          setCurrentQuestionIndex(nextQuestionIndex)
        } else {
          setTimeout(() => {
            alert("You terminated!")
            setGameCompleted(true)
          }, 300)
        }
      }
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
        <h1>
          <span style={{ color: "red" }}>TreeVerse </span>Round-1
        </h1>
        <div className="progress-indicator">
          <span>
            Questions: {answeredQuestions.size}/{questions.length}
          </span>
          <span>Correct Answers: {correctAnswers}/10</span>
        </div>
      </div>
      <Timer />

      <div className="game-content">
        <div className="question-panel-container">
          {questions.length > 0 && !gameCompleted && (
            <QuestionPanel question={questions[currentQuestionIndex]} onAnswerSelected={handleAnswerSelected} />
          )}
          {gameCompleted && (
            <div className="game-result">
              <h2>{correctAnswers >= 10 ? "Congratulations!" : "Game Over"}</h2>
              <p>
                {correctAnswers >= 10
                  ? "You've successfully collected 10 correct answers!"
                  : "You couldn't collect 10 correct answers."}
              </p>
              <p>Your final score: {correctAnswers}/10</p>
            </div>
          )}
        </div>

        <div className="tree-visualization-container">
          <TreeVisualization treeData={treeData} selectedPath={selectedPath} />
        </div>
      </div>
    </div>
  )
}

export default GameScreen

