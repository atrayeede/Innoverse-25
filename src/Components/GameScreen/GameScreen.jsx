"use client";

import { useState, useEffect } from "react";
import QuestionPanel from "../QuestionPanel/QuestionPanel";
import TreeVisualization from "../TreeVisualization/TreeVisualization";
import { questionsData } from "../questions";
import "./GameScreen.css";
import Timer from "../Timer/Timer";

function GameScreen({ onRiddleCollected, onElimination, riddlesCollected }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
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
    setQuestions([...questionsData].sort(() => Math.random() - 0.5));
  }, []);

  // Get a random unanswered question
  const getNextQuestion = () => {
    if (answeredQuestions.size >= questions.length) {
      return null;
    }
    for (let i = 0; i < questions.length; i++) {
      if (!answeredQuestions.has(i)) {
        return i;
      }
    }
    return null;
  };

  const handleAnswerSelected = (optionIndex) => {
    if (!timerStarted) {
      setTimerStarted(true);
      setStartTime(Date.now());
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctAnswer;

    // Debugging logs
    console.log(`Selected Option Index: ${optionIndex}`);
    console.log(`Correct Answer Index: ${currentQuestion.correctAnswer}`);
    console.log(`Is Correct: ${isCorrect}`);

    // Mark this question as answered
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestionIndex]));

    // Update correct answers count only if the answer is correct
    if (isCorrect) {
      setCorrectAnswers((prev) => {
        const updatedCorrectAnswers = prev + 1;
        console.log(
          `Correct answer! Total correct answers: ${updatedCorrectAnswers}`
        ); // Debug log
        // Check if the player has reached 10 correct answers
        if (updatedCorrectAnswers === 10) {
          setTimeout(() => {
            alert("You win!");
            setGameCompleted(true);
          }, 300);
        }
        return updatedCorrectAnswers;
      });
    } else {
      console.log(`Incorrect answer! Total correct answers: ${correctAnswers}`); // Debug log
    }

    // Proceed with tree update logic
    let currentNode = treeData;
    const pathToUpdate = [...selectedPath];

    for (let i = 1; i < pathToUpdate.length; i++) {
      const childId = pathToUpdate[i];
      const childIndex = currentNode.children.findIndex(
        (child) => child.id === childId
      );
      if (childIndex !== -1) {
        currentNode = currentNode.children[childIndex];
      }
    }

    const selectedChild = currentNode.children[optionIndex];
    if (!selectedChild) return;

    const newPath = [...pathToUpdate, selectedChild.id];
    setSelectedPath(newPath);

    // Create four new nodes for the selected answer
    const newChildren = [
      { id: `${selectedChild.id}-1`, name: "A", children: [] },
      { id: `${selectedChild.id}-2`, name: "B", children: [] },
      { id: `${selectedChild.id}-3`, name: "C", children: [] },
      { id: `${selectedChild.id}-4`, name: "D", children: [] },
    ];

    // Add the new children to the selected child's children
    selectedChild.children.push(...newChildren);

    // Update the tree data
    setTreeData({ ...treeData });

    // Move to the next question
    const nextQuestionIndex = getNextQuestion();
    if (nextQuestionIndex !== null) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setGameCompleted(true);
    }
  };

  const handleTimeUpdate = (time) => {
    setElapsedTime(time);
  };

  const submitScore = async () => {
    if (correctAnswers < 10) {
      alert("You must answer 10 questions to submit!");
      return;
    }

    const playerData = {
      name: "Player", // Replace with actual player name if available
      time: elapsedTime,
      questions: [...answeredQuestions],
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/leaderboard/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playerData),
      });

      if (response.ok) {
        alert("Score submitted successfully!");
      } else {
        alert("Error submitting score.");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  useEffect(() => {
    if (gameCompleted) {
      submitScore(); // Submit score when game is completed
    }
  }, [gameCompleted]);

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
      <Timer
        gameOver={gameCompleted}
        startTime={startTime}
        onTimeUpdate={handleTimeUpdate}
      />

      <div className="game-content">
        <div className="question-panel-container">
          {questions.length > 0 && !gameCompleted && (
            <QuestionPanel
              question={questions[currentQuestionIndex]}
              onAnswerSelected={handleAnswerSelected}
            />
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
  );
}

export default GameScreen;
