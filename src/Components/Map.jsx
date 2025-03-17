import { Link } from "react-router-dom"
import "./Map.css"

function Map({ riddles }) {
  return (
    <div className="map-part">
      <h1>Your Collected Riddles</h1>

      {riddles.length === 0 ? (
        <p className="no-riddles">You haven't collected any riddles yet.</p>
      ) : (
        <div className="riddles-container">
          {riddles.map((riddle, index) => (
            <div key={index} className="riddle-card">
              <span className="riddle-number">{index + 1}</span>
              <p className="riddle-text">{riddle}</p>
            </div>
          ))}
        </div>
      )}

      <div className="map-actions">
        <Link to="/" className="back-button">
          Back to Game
        </Link>
      </div>
    </div>
  )
}

export default Map

