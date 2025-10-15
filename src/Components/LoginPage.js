import React, { useEffect } from 'react';

function LoginPage() {
  const DJANGO_API_URL = 'http://127.0.0.1:8000'; // Your backend URL

  const handleLoginSuccess = (googleResponse) => {
    // 1. Get the Google ID token from the response
    const idToken = googleResponse.credential;
    console.log("Got Google ID token:", idToken);

    // 2. Send this token to your Django backend
    fetch(`${DJANGO_API_URL}/api/auth/google/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: idToken }),
    })
    .then(response => response.json())
    .then(data => {
      // 3. Receive access/refresh tokens from Django and store them
      console.log("Received tokens from Django:", data);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      // You can now redirect the user or update the UI
    })
    .catch(error => {
      console.error("Error sending token to backend:", error);
    });
  };

  useEffect(() => {
    /* global google */
    console.log("Reading Client ID:", process.env.REACT_APP_CLIENTID);
  
    if (window.google) {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENTID,
        callback: handleLoginSuccess,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  return (
    <div>
      <h2>Login with Google</h2>
      <div id="googleSignInButton"></div>
    </div>
  );
}

export default LoginPage;