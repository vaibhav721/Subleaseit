import { useEffect } from "react";
import "../../styles/auth/auth-related.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import jwt from "jsonwebtoken";
const baseUrl = process.env.REACT_APP_BASE_URL;
let navigate;

const getUserDataAfterLoggingIn = async (data) => {
  try {
    const decodedToken = jwt.decode(data);
    localStorage.setItem("token", data);

    
    localStorage.setItem("tokenDecoded", JSON.stringify(decodedToken));
    toast.success("You are logged in!");
    navigate("/subleaseposts");
  } catch (err) {
    toast.error(err?.response?.data || "Could not login");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenDecoded");
    
  }
};

function LoginSuccess() {
  navigate = useNavigate();

  useEffect(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const access_token = urlParams.get("access_token");
    await getUserDataAfterLoggingIn(access_token);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>
          Credentials are correct!
        </p>
        <p style={{ fontSize: "18px" }}>Checking authorization...</p>
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
}

export default LoginSuccess;
