import { useState, useEffect } from "react"
import "./Timer.css"

function Timer({ gameOver, winTime, startTime }) {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (gameOver || !startTime) return;

    const interval = setInterval(() => {
      const currentTime = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, startTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="timer">
      <div className="timer-icon">⏱</div>
      <div className="timer-display">{formatTime(elapsedTime)}</div>
    </div>
  );
}

export default Timer;
