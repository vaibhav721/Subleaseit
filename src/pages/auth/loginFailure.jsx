import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../styles/auth/LoginFailure.css"; // Import the CSS file with custom styles

function LoginFailure() {
  const [showDots, setShowDots] = useState(true);

  // Redirect after 4 seconds
  useEffect(() => {
    toast.error("Entry restricted")
    const redirectTimer = setTimeout(() => {
      // Replace '/destination-page' with the URL of the page you want to redirect to
      window.location.href = "/";
    }, 5000);

    // Clear the timer when the component is unmounted
    return () => clearTimeout(redirectTimer);
  }, []);

  // Blinking dots effect
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setShowDots((prevShowDots) => !prevShowDots);
    }, 500);

    // Clear the interval when the component is unmounted
    return () => clearInterval(dotsInterval);
  }, []);

  return (
    <div style={centeredContainer}>
      <div>
        Only USC students are allowed to access this website currently.
        <hr />
        <b>
          Redirecting back
          <span className="blinking-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </b>
      </div>
    </div>
  );
}

// Centered container style
const centeredContainer = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

export default LoginFailure;
