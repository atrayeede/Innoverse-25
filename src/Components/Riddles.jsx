import React from 'react'
import './Riddles.css';
const riddles = [
  { question: "The more you take, the more you leave behind. What am I?" },
  { question: "I have keys but open no locks. What am I?" },
  { question: "The person who makes it has no need for it. What is it?" },
  { question: "I fly without wings. I cry without eyes. What am I?" },
  { question: "What has to be broken before you can use it?"},
  { question: "The more you remove from me, the bigger I become. What am I?"},
  { question: "I am always hungry, I must always be fed. The finger I touch, will soon turn red. What am I?"},
  { question: "I have cities, but no houses. I have mountains, but no trees. What am I?"},
  { question: "What can travel around the world while staying in the same spot?"},
  { question: "What has one eye but can't see?"},
];
const Riddles = () => {
  return (
    <div>
      <div className="riddle-container">
        <div className="header">
          <h1>Your Hints to reach the Tresures Keys</h1>
        </div>
        {riddles.map((riddle, index) => (
          <div key={index} className="riddle-card">
            <p className="question">{riddle.question}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Riddles
