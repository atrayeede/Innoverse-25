import React, { useState } from "react";
import "./SubmitPage.css";

const EpicFinalCode = () => {
  const [code, setCode] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const correctCode = "GODMODE2025"; // Change this as needed

  const checkCode = () => {
    setIsSuccess(code === correctCode);
    setShowPopup(true);
  };

  return (
    <div className="epic-container">
      <div className="glowing-box">
        <h1 className="epic-heading">🔐 Enter Access Code</h1>
        <input
          type="text"
          placeholder="Enter secret code..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="epic-textarea"
        />
        <button onClick={checkCode} className="epic-btn">
          ✅ Validate Code
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div
            className={`epic-popup ${
              isSuccess ? "success-popup" : "error-popup"
            }`}
          >
            <span className="icon">{isSuccess ? "✅" : "❌"}</span>
            <h2>{isSuccess ? "ACCESS GRANTED!" : "ACCESS DENIED!"}</h2>
            <p>
              {isSuccess
                ? "Welcome to the exclusive zone! 🔥"
                : "Oops! That’s not the correct code. Try again."}
            </p>
            <button onClick={() => setShowPopup(false)} className="close-popup">
              ✖ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpicFinalCode;
