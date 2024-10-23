import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Image from "react-bootstrap/Image";
import MyPosts from "../pages/MyPosts";
//import mixpanel from "../components/mixpanelInit";
import "../styles/landingPage.css";
import { toast } from "react-toastify";

function NavScrollExample() {
  const location = useLocation();

  const showNavScrollExample = location.pathname !== "/";
  const [currentPage, setCurrentPage] = useState("");
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (location.pathname === "/") setCurrentPage("Home");
    if (location.pathname === "/subleaseposts")
      setCurrentPage("View Ad Postings");
    if (location.pathname === "/adpost") setCurrentPage("Add your Apartment");
    if (location.pathname === "/myposts") setCurrentPage("My Posts");
  }, [location]);

  const navigateToHome = (url) => {
    window.location.href = url;
  };

  const getUser = async () => {
    try {
      const response = await fetch(`${baseUrl}/request`, {
        method: "post",
      });
      const data = await response.json();

      navigateToHome(data.url);
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    // mixpanel.track("Login Attempt");
    getUser();
  };

  return (
    <>
      {/* {showNavScrollExample && ( */}
      <Navbar
        className="navbar-dark d-flex"
        expand="md"
        style={{
          backgroundImage: "linear-gradient(to right, #520821 , #C12D22)",
        }}
      >
        <Container fluid>
          {/* //only appears on small screens and disappears on medium screens and up
        (d-block d-md-none) */}
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "200px" }}
              navbarScroll
            >
              <Nav.Link
                href="/subleaseposts"
                //make the text #FFCC00 when clicked on it
                style={{
                  color:
                    currentPage === "View Ad Postings" ? "#FFCC00" : "white", //if the current page is equal to the text then make it active
                }}
              >
                <img src="/assets/img/logo_house.png" className="logo_house" />
              </Nav.Link>
              <Nav.Link
                href="/subleaseposts"
                //make the text #FFCC00 when clicked on it
                style={{
                  color:
                    currentPage === "View Ad Postings" ? "#FFCC00" : "white", //if the current page is equal to the text then make it active
                }}
              >
                View Ad Postings
              </Nav.Link>
              <Nav.Link
                href="/adpost"
                style={{
                  color:
                    currentPage === "Add your Apartment" ? "#FFCC00" : "white", //if the current page is equal to the text then make it active
                }}
              >
                Add your Apartment
              </Nav.Link>
              {JSON.parse(localStorage.getItem("tokenDecoded")) !=
                undefined && (
                  <Nav.Link
                    href="/myposts"
                    style={{
                      color: currentPage === "My Posts" ? "#FFCC00" : "white", //if the current page is equal to the text then make it active
                    }}
                  >
                    My Posts
                  </Nav.Link>
                )}
            </Nav>
          </Navbar.Collapse>
          {JSON.parse(localStorage.getItem("tokenDecoded")) != undefined && (
            <NavDropdown
              title={
                <span>
                  {JSON.parse(localStorage.getItem("tokenDecoded")) != null &&
                    JSON.parse(localStorage.getItem("tokenDecoded")).picture !=
                    undefined &&
                    JSON.parse(localStorage.getItem("tokenDecoded")).picture
                      .length > 1 && (
                      <img
                        src={
                          JSON.parse(localStorage.getItem("tokenDecoded"))
                            .picture
                        }
                        alt="Profile Photo"
                        className="profile-photo"
                        style={{
                          borderRadius: 20,
                          width: "30px",
                          height: "auto",
                        }}
                      />
                    )}
                  <span>
                    {" "}
                    {JSON.parse(localStorage.getItem("tokenDecoded")) != null &&
                      JSON.parse(localStorage.getItem("tokenDecoded"))[
                      "first_name"
                      ]}
                  </span>
                  <span>
                    {" "}
                    {JSON.parse(localStorage.getItem("tokenDecoded")) != null &&
                      JSON.parse(localStorage.getItem("tokenDecoded"))[
                      "last_name"
                      ]}
                  </span>
                </span>
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item
                href="/"

                style={{ color: "black" }}
              >
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          )}
          {JSON.parse(localStorage.getItem("tokenDecoded")) == undefined && (
            <Nav.Link
              // href="/myposts"
              onClick={handleClick}
              className="buy-btn getstarted"
              style={{
                color: currentPage === "My Posts" ? "#FFCC00" : "white",

                //if the current page is equal to the text then make it active
              }}
            >
              Login with @usc.edu
            </Nav.Link>
          )}
        </Container>
      </Navbar>
      {/* )} */}
    </>
  );
}

export default NavScrollExample;
