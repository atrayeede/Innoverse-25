"use client";

import { useState, useEffect } from "react";
import QuestionPanel from "./QuestionPanel";
import TreeVisualization from "./TreeVisualization";
import { questionsData } from "./questions";
import "./GameScreen.css";

function GameScreen({ onRiddleCollected, onElimination, riddlesCollected }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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

  const handleAnswerSelected = (selectedOptionIndex, isCorrect) => {
    setSelectedPath((prevPath) => {
      const newNodeId = `${selectedOptionIndex + 1}-${prevPath.length}`;
      const updatedPath = [...prevPath, newNodeId];

      setTreeData((prevTree) => {
        const updatedTree = JSON.parse(JSON.stringify(prevTree)); // Deep copy of tree

        // Helper function to find a node
        const findNode = (node, id) => {
          if (node.id === id) return node;
          if (!node.children) return null;
          for (let child of node.children) {
            const found = findNode(child, id);
            if (found) return found;
          }
          return null;
        };

        // Find the correct parent node corresponding to the option
        const parentNode = findNode(updatedTree, `${selectedOptionIndex + 1}`);

        if (parentNode) {
          // Generate 4 new child nodes for the selected option
          const newChildren = Array.from({ length: 4 }, (_, i) => ({
            id: `${selectedOptionIndex + 1}-${prevPath.length}-${i + 1}`,
            name: `Step ${prevPath.length + 1} - Option ${i + 1}`,
            isChest: isCorrect && i === selectedOptionIndex, // Mark only the selected option as correct
            isFull: isCorrect && riddlesCollected >= 10, // Show full chest if riddles collected is 10
            children: [],
          }));

          parentNode.children = newChildren;
        }

        return updatedTree;
      });

      return updatedPath; 
    });

    if (isCorrect) {
      const riddleText = questions[currentQuestionIndex].riddle;
      onRiddleCollected(riddleText);
    }

    // Move to next question
    setCurrentQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= questions.length && riddlesCollected < 10) {
        onElimination();
      }
      return nextIndex;
    });
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