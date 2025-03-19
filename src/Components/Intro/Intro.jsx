import "./Intro.css";
import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

const Intro = () => {
  const navigate = useNavigate();
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user profile data from Google API
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",        
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const userInfo = await userInfoResponse.json();
        console.log("Google User Info:", userInfo);

        // Save email and name to localStorage
        localStorage.setItem("name", userInfo.name);

        setIsGoogleAuth(true);
        navigate("/adventure");
      } catch (error) {
        console.error("Error during login:", error);
      }
    },
    onError: () => {
      console.log("Google Login Failed");
    },
  });

  return (
    <>
      <Navbar />
      <div className="treasure-map">
        {/* Animated background elements */}
        <div className="ocean-waves"></div>
        <div className="ship ship-1"></div>
        <div className="ship ship-2"></div>
        <div className="compass"></div>
        <div className="x-mark x-mark-1"></div>
        <div className="x-mark x-mark-2"></div>
        <div className="x-mark x-mark-3"></div>
        <div className="palm-tree palm-tree-1"></div>
        <div className="palm-tree palm-tree-2"></div>
        <div className="map-route"></div>

        {/* Content container */}
        <div className="content-container">
          <h1 className="main-title">TreeVerse-25</h1>
          <h2 className="sub-title">organized by SAE</h2>

          <button className="adventure-button" onClick={login}>
            Start the adventure
            <div className="ripple-effect"></div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Intro;