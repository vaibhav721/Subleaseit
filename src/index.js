import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import dotenv from "dotenv";

// for post requests
axios.interceptors.response.use(
  (res) => {
    // 
    return res;
  },
  (err) => {
    // 
    // 
    if (err.response && err.response.status === 403) {
      toast.error("You are not authorized to perform this action.");
    } else if (err.response && err.response.status === 401) {
      toast.error("Session expired! Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenDecoded");
      //check if url contains adpost, if yes then redirect to login page
      if (window.location.href.includes("adpost")) {
        window.location.href = "/";
      }

      // Wait for 5 seconds before redirecting
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } else {
      // 
      if (err?.response?.data?.error) toast.error(err.response.data.error);
      else toast.error("Something went wrong");
    }

    return Promise.reject(err); // Reject the promise so that the error is passed to the next catch block
  }
);

// For GET requests
axios.interceptors.request.use(
  (config) => {
    // Add authorization header
    if (config.url.includes("login")) {
      return config;
    }
    //if url includes adpost, then add token to header

    var td = localStorage.getItem("token");
    const token = td;
    // 
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    // 

    return Promise.reject(error);
  }
);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
