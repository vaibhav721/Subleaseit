import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
// import react bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import AdPost from "./pages/AddYourApartment";
import SubPosts from "./pages/ViewAdPostings";
import MyPostEdit from "./pages/MyPostEdit";
import LandingPage from "./pages/LandingPage";

import SingleSubPost from "./pages/ShowMoreDetails";
import MyPosts from "./pages/MyPosts";
import { Map, GoogleApiWrapper } from "google-maps-react";
import LoginSuccess from "./pages/auth/LoginSuccess";
import LoginFailure from "./pages/auth/loginFailure";

function App() {
  const [user, setUser] = useState(null);
  localStorage.setItem("searchKeyword", null);
  localStorage.setItem("pageNumbertogoback", null);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/adpost" element={<AdPost />} />
          <Route path="/subleaseposts" element={<SubPosts />} />
          <Route path="/subleaseposts/:id/edit" element={<MyPostEdit />} />
          <Route path="/subleaseposts/:id" element={<SingleSubPost />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/login/success" element={<LoginSuccess />} />
          <Route path="/login/failure" element={<LoginFailure />} />
        </Routes>
        {/* <Navbar /> */}
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
