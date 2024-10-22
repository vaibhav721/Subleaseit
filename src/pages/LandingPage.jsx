import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// import GoogleButton from "react-google-button";
import { toast } from "react-toastify";
import { useEffect } from "react";
import jwt, { decode } from "jsonwebtoken";
import "../styles/landingPage.css";
import Footer from "../components/footer";
import mixpanel from "mixpanel-browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { Spinner as Loader } from "react-bootstrap";
// import LinkedInIcon from "@material-ui/icons/LinkedIn";
// import CollegeIcon from "@material-ui/icons/School";

function LandingPage() {
  const teamMembers = [
    {
      name: "Ashutosh Tiwari",
      photo: "assets/img/team/ashutosh.jpg",
      college: "University of Southern California (USC)",
      linkedinURL: "https://www.linkedin.com/in/ashutosh3309",
      description: "Full Stack Developer",
    },
    {
      name: "Vaibhav Gupta",
      photo: "assets/img/team/Vaibhav.jpg",
      college: "University of California, Riverside (UCR)",
      linkedinURL: "https://www.linkedin.com/in/vaibhav-gupta007",
      description: "Backend Developer",
    },
    {
      name: "Vighnesh Dhuri",
      photo: "assets/img/team/vighnesh.jpeg",
      college: "University of Southern California (USC)",
      linkedinURL: "https://www.linkedin.com/in/vighnesh-dhuri",
      description: "Product Manage & React Developer",
    },
    {
      name: "Suryakant Kashyap",
      photo: "assets/img/team/Suryakant.jpg",
      college: "University of Southern California (USC)",
      linkedinURL:
        "https://www.linkedin.com/in/suryakant-kumar-kashyap-551001157",
      description: "Frontend Developer",
    },
    // Add more members here
  ];

  const [loginLoader, setLoginLoader] = useState(false);

  const navigate = useNavigate();

  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const ifJWTTokenExistsRedirectToHome = () => {
    // if token exists, redirect
    let decodedToken = localStorage.getItem("tokenDecoded");
    if (!decodedToken) return;
    decodedToken = JSON.parse(decodedToken);
    let currentDate = new Date();
    setLoginLoader(false);
    // JWT exp is in seconds
    if (decodedToken.exp * 1000 >= currentDate.getTime()) {
      navigate("/subleaseposts");
    }
  };

  useEffect(() => {
    ifJWTTokenExistsRedirectToHome();
    mixpanel.track("Visitor", {
      Visitor: "Landing Page Visitor",
    });
    setLoginLoader(false);
  }, []);

  const handleMobileNavToggle = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  let fetchUserAuthenticated = async () => {};

  const getUserDataAfterLoggingIn = async () => {
    try {
      const url = baseUrl + "/login/success";
      const { data } = await axios.get(url, { withCredentials: true });
      //
      toast.success("You are logged in!");
      const decodedToken = jwt.decode(data);
      localStorage.setItem("token", data);

      //
      localStorage.setItem("tokenDecoded", JSON.stringify(decodedToken));
      navigate("/subleaseposts");
    } catch (err) {
      toast.error(err?.response?.data || "Could not login");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenDecoded");
      //
      // axios.get("https://subleaseit-help.wl.r.appspot.com/logout");
    }
  };

  const navigateToHome = (url) => {
    window.location.href = url;
  };

  const getUser = async () => {
    try {
      const response = await fetch(`${baseUrl}/request`, {
        method: "post",
      });
      const data = await response.json();
      //
      navigateToHome(data.url);
    } catch (error) {
      toast.error("Could not authorize with Google");
      setLoginLoader(false);
    }
  };

  const handleClick = (event) => {
    try {
      event.preventDefault();
      setLoginLoader(true);
      mixpanel.track("Login Attempt");
      getUser();
    } catch (_err) {
      setLoginLoader(false);
    }
  };

  return (
    <>
      <div>
        {/* <header id="header" className="fixed-top ">
          <div className="container d-flex align-items-center">
            <p className="logo me-auto">
              <a href="/" style={{ textDecoration: "none" }}>
                University Sublease @USC
              </a>
            </p>

            <a href="/" className="logo me-auto">
              <img src="assets/img/logo.png" alt="" className="img-fluid" />
            </a>
            <nav
              id="navbar"
              className={`navbar ${isMobileNavOpen ? "mobile-nav-open" : ""}`}
            >
              <ul
                className={`nav-menu ${
                  isMobileNavOpen ? "mobile-nav-menu" : ""
                }`}
              >
                <li>
                  <a className="nav-link scrollto" href="#overview">
                    Overview
                  </a>
                </li>
                <li>
                  <a className="nav-link scrollto" href="#team">
                    Features
                  </a>
                </li>
                <li>
                  <a className="nav-link scrollto" href="#contact">
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    className="getstarted scrollto"
                    onClick={handleClick}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                  >
                    Login
                  </a>
                </li>
              </ul>
              <i
                className="bi bi-list mobile-nav-toggle"
                onClick={handleMobileNavToggle}
              ></i>
            </nav>
          </div>
        </header> */}

        <nav
          className="navbar navbar-expand-lg navbar-dark"
          style={{
            backgroundImage: "linear-gradient(to right, #520821, #C12D22)",
          }}
        >
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <img className="img-fluid logo" src="/assets/img/logo.png" />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav ms-auto me-3">
                <a className="nav-link " href="#overview">
                  Overview
                </a>
                <a className="nav-link" href="#team">
                  Features
                </a>
                <a className="nav-link" href="#contact">
                  Contact
                </a>
                <a
                  href="#"
                  className="nav-link getstarted"
                  onClick={handleClick}
                  style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    borderRadius: "20",
                  }}
                >
                  Login with @usc.edu {loginLoader && <Loader size="sm" />}
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/*               
                <!-- ======= Hero Section ======= --> */}
        <section
          id="hero"
          className="d-flex align-items-center"
          style={{
            backgroundImage: "linear-gradient(to right, #520821 , #C12D22)",
          }}
        >
          <div className="container">
            <div className="row">
              <div
                className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <h1>
                  Discover Lease/Sublease around
                  <span style={{ color: "#ffc72c" }}> USC</span> - University of
                  Southern California
                </h1>
                <h2>
                  Find safe property deals posted by university students.
                  Product by USC and UCR students.
                </h2>
                <div className="d-flex justify-content-center justify-content-lg-start">
                  <a
                    // href="#login_interest"
                    className="btn-get-started "
                    onClick={handleClick}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                  >
                    Share your listing with .edu email
                    {loginLoader && <Loader size="sm" />}
                  </a>
                  <a
                    // href="#login_interest"
                    className="btn-get-started ms-3 "
                    onClick={() => {
                      navigate("/subleaseposts");
                    }}
                    style={{
                      cursor: "pointer",
                      textDecoration: "none",
                      backgroundColor: "white",
                      color: "black",
                    }}
                  >
                    View listings
                  </a>
                  {/* <a href="https://www.youtube.com/watch?v=jDDaplaOz7Q" className="glightbox btn-watch-video"><i
                className="bi bi-play-circle"></i><span>Watch Video</span></a> */}
                </div>
                <h2 className="d-flex m-2 mt-3">
                  Please login with USC credentials to post your listing.
                </h2>
              </div>
              <div
                className="col-lg-6 order-1 order-lg-2 hero-img"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <img
                  src="assets/img/house.svg"
                  className="img-fluid animated"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
        {/* <!-- End Hero --> */}

        <main id="main">
          <section id="overview" className="overview">
            <div className="container" data-aos="fade-up">
              <div className="row">
                <div
                  className="col-lg-6 d-flex align-items-center"
                  data-aos="fade-right"
                  data-aos-delay="100"
                >
                  <img
                    src="assets/img/secure.svg"
                    className="img-fluid h-75 w-75"
                    alt=""
                  />
                </div>
                <div
                  className="col-lg-6 pt-5 content"
                  data-aos="fade-left"
                  data-aos-delay="100"
                >
                  <h1>
                    Authentication through{" "}
                    <strong style={{ color: "#990000" }}>University</strong>
                    <strong style={{ color: "#FFC72C" }}> credential</strong>
                  </h1>
                  <br />
                  <h4>Post Lease/Sublease deals using your university email</h4>
                </div>
              </div>
            </div>
          </section>

          <section id="why-us" className="why-us section-bg">
            <div className="container" data-aos="fade-up">
              <div className="row">
                <div className="col-lg-6 d-flexcontent flex-column justify-content-between align-items-start  order-2 order-lg-1">
                  <h1>
                    <strong style={{ color: "#990000" }}>Add</strong> /{" "}
                    <strong style={{ color: "#FFC72C" }}>Search</strong>
                    <strong> Sub-Lease</strong>
                  </h1>
                  <br />

                  <br />
                  <h4>
                    No seniors to get you deals? Not active on 10+ whatsapp,
                    telegram groups?
                  </h4>
                  <br />
                  <h4>
                    <strong style={{ color: "#FFC72C" }}>
                      Find them all at one place
                    </strong>
                  </h4>
                </div>

                <div
                  className="col-lg-6 align-items-center order-1 order-lg-2 img"
                  data-aos="fade-right"
                  data-aos-delay="100"
                >
                  <img
                    src="assets/img/search.svg"
                    className="img-fluid h-75 w-75"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </section>

          <section id="overview" className="overview">
            <div className="container" data-aos="fade-up">
              <div className="row">
                <div
                  className="col-lg-6 d-flex align-items-center"
                  data-aos="fade-right"
                  data-aos-delay="100"
                >
                  <img
                    src="assets/img/notification.svg"
                    className="img-fluid w-75 h-75"
                    alt=""
                  />
                </div>
                <div
                  className="col-lg-6 pt-5 content"
                  data-aos="fade-left"
                  data-aos-delay="100"
                >
                  <h1>
                    Get <strong>Connected</strong>
                  </h1>
                  <br />
                  <h4>Struck a deal ? </h4>
                  <h4>
                    {" "}
                    <strong style={{ color: "#990000" }}>
                      Reach directly with the email and contact provided without saving contact details
                    </strong>
                  </h4>
                  <br />
                  <h4>Want to still share on Chat Groups ? </h4>
                  <h4>
                    {" "}
                    <strong style={{ color: "#FFC72C" }}>
                      Experience our automatic Ad creation feature using your listing data, makes it easy to share images 🏡 /location 📍
                    </strong>
                  </h4>
                </div>
              </div>
            </div>
          </section>

          <section id="team" className="team section-bg">
            <div className="container" data-aos="fade-up">
              <div className="section-title">
                <h2>Features</h2>
              </div>

              <div className="row" id="features">
                <div
                  className="col-lg-4"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                >
                  <div className="member d-flex align-items-start">
                    <div className="pic">
                      <img
                        src="assets/img/verified.svg"
                        className="img-fluid"
                        alt=""
                      />
                    </div>
                    <div className="member-info">
                      <h3>Verified Student Listing</h3>
                      <span>Only .edu users can post ads</span>
                    </div>
                  </div>
                </div>

                <div
                  className="col-lg-4 mt-4 mt-lg-0"
                  data-aos="zoom-in"
                  data-aos-delay="200"
                >
                  <div className="member d-flex align-items-start">
                    <div className="pic">
                      <img
                        src="assets/img/notified.svg"
                        className="img-fluid"
                        alt=""
                      />
                    </div>
                    <div className="member-info">
                      <h3>Global Coverage</h3>
                      <span>Share your ads globally</span>
                    </div>
                  </div>
                </div>

                <div
                  className="col-lg-4 mt-4 mt-lg-0"
                  data-aos="zoom-in"
                  data-aos-delay="300"
                >
                  <div className="member d-flex align-items-start">
                    <div className="pic">
                      <img
                        src="assets/img/photos.svg"
                        className="img-fluid"
                        alt=""
                      />
                    </div>
                    <div className="member-info">
                      <h3>Photos / Reviews</h3>
                      <span>No more boring long text templates</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="about-us" className="about-us">
            <div className="container" data-aos="fade-up">
              <div className="section-title">
                <h2>About Us</h2>
              </div>

              <div className="row">
                {teamMembers.map((member, index) => (
                  <div
                    className="col-lg-3 col-md-6 align-items-stretch"
                    key={index}
                    data-aos="zoom-in"
                    data-aos-delay={40 * index}
                    style={{ marginBottom: "50px" }}
                  >
                    <div className="member">
                      <div className="member-img">
                        <a
                          href={member.linkedinURL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={member.photo}
                            className="img-fluid member-photo"
                            alt={member.name}
                            style={{ borderRadius: "10%" }}
                          />
                        </a>
                      </div>
                      <div className="member-info pt-2">
                        <h4>
                          <a
                            href={member.linkedinURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            {member.name}
                          </a>
                          <span className="social m-2">
                            <a
                              href={member.linkedinURL}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FontAwesomeIcon
                                icon={faLinkedin}
                                size="1x"
                                style={{ color: "#0077B5" }}
                              />
                            </a>
                          </span>
                        </h4>
                        <span>
                          {/* <CollegeIcon style={{ fontSize: "1.2rem" }} />{" "} */}
                          {member.description}
                        </span>
                        <p style={{ fontFamily: "Roboto Slab" }}>
                          {member.college}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer></Footer>
      </div>

      {/* <GoogleButton onClick={handleClick} /> */}
    </>
  );
}

export default LandingPage;
