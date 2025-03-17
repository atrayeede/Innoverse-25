"use client"

import { useState, useEffect } from "react"
import "./Timer.css"

function Timer({ started, completed }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let interval = null

    if (started && !completed) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1)
      }, 1000)
    } else if (completed) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [started, completed])

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="timer">
      <div className="timer-icon">⏱️</div>
      <div className="timer-display">{formatTime(seconds)}</div>
    </div>
  )
}

export default Timer

