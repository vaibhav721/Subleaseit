import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Carousel,
  Accordion,
  ButtonToolbar,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "../styles/subposts.css";
import MapModal from "../components/usc/gmap";
import Button from "react-bootstrap/Button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Spinner from "../components/Spinner";
import NavScrollExample from "../components/Navbar";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Footer from "../components/footer";
import jwt from "jsonwebtoken";
//import mixpanel from "../components/mixpanelInit";
import moment from "moment";
import Loader from "react-bootstrap/Spinner";
import { parseISO, format } from "date-fns";

function ViewAdPostings() {
  const [subPosts, setSubPosts] = React.useState([]);
  const [showMap, setShowMap] = React.useState(false);
  const [mapAddressSelected, setMapAddressSelected] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageNumbers, setPageNumbers] = React.useState([]);
  const [searchKeyword, setSearchKeyword] = React.useState(null);
  const [loadingImages, setLoadingImages] = React.useState(false);
  const [spinnerActive, setSpinnerActive] = React.useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [searchLoader, setSearchLoader] = useState(false);

  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const location = useLocation();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleButtonClick = (uuid) => {

    localStorage.setItem("pageNumbertogoback", pageNumber);
    localStorage.setItem("searchKeyword", searchKeyword);
    navigate(`/subleaseposts/${uuid}`);
  };

  // Handler to toggle the map modal
  const handleToggleMap = (address) => {
    // mixpanel.track("Address Viewed", {
    //   address: address,
    // });
    //
    setMapAddressSelected(address);
    setShowMap(!showMap);
  };

  // Function to convert date to relative time
  const getRelativeTime = (dateString) => {
    return "~ " + moment(dateString).fromNow();
  };

  async function getSubPosts(pageNumber) {
    if (pageNumber <= 0) pageNumber = 1;
    try {
      //
      const res = await axios.get(
        baseUrl + `/api/v1/subleaseit/adpost?pageNumber=${pageNumber}`,
        {
          withCredentials: true,
        }
      );

      const sub = (await res) && res.data;
      //
      const subPosts = (await sub) && sub.paginatedResults;
      //
      const totalPageCount = (await sub) && sub.total;
      //

      setSubPosts(subPosts);

      setLoadingImages(false);
      localStorage.setItem("pageNumbertogoback", null);

      window.scrollTo(0, 0);
      if (localStorage.getItem("searchKeyword") != "null") {
        navigate(
          `/subleaseposts?page=${pageNumber}&searchKeyword=${localStorage.getItem(
            "searchKeyword"
          )}`
        );
      } else {
        navigate(`/subleaseposts?page=${pageNumber}`);
      }

      localStorage.setItem("searchKeyword", null);

      //

      const totalPages = Math.ceil(totalPageCount / 30);
      //

      const pn = Array.from({ length: totalPages }, (_, i) => i + 1);
      //

      setPageNumbers(pn);
    } catch (err) {
      setLoadingImages(false);
      toast.error(err);
      //
    } finally {
      setSpinnerActive(false);
    }
  }

  async function getKeywordBasedSubPosts(pageNumber, searchKeyword) {
    setSearchLoader(true);
    if (!searchKeyword) {
      getSubPosts(pageNumber);
      // toast.error("Enter something to search");
      setSearchKeyword(null);
      setSearchLoader(false);
      return;
    }

    setSearchKeyword(searchKeyword);
    try {
      const res = await axios.post(
        baseUrl +
        `/api/v1/subleaseit/adpost/search?keyword=${searchKeyword}&pageNumber=${pageNumber}`,
        {
          withCredentials: true,
        }
      );

      const sub = (await res) && res.data;

      const sub2 = (await sub) && sub.paginatedResults;

      const subPosts = (await sub2) && sub2.adPostings;

      const totalPageCount = (await sub2) && sub2.totalCount;

      setSubPosts(subPosts);
      navigate(`/subleaseposts?keyword=${searchKeyword}&page=${pageNumber}`);

      const totalPages = Math.ceil(totalPageCount / 30);
      //
      const pn = Array.from({ length: totalPages }, (_, i) => i + 1);
      //
      window.scrollTo(0, 0);
      setPageNumbers(pn);
      setSearchLoader(false);
    } catch (err) {
      //
    } finally {
      setSpinnerActive(false);
      setSearchLoader(false);
    }
  }

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
      // navigate("/myposts");
    } catch (err) {
      toast.error(err?.response?.data || "Could not login");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenDecoded");
      //
      // axios.get("https://subleaseit-help.wl.r.appspot.com/logout");
    }
  };

  //
  useEffect(async () => {
    let pageNumberToSearch = 1;
    let keywordSearchSetter = null;
    //
    //   "Page number to go back: ",
    //   localStorage.getItem("pageNumbertogoback")
    // );

    if (localStorage.getItem("searchKeyword") != "null") {
      // getKeywordBasedSubPosts(1, keywordSearchedFor);
      keywordSearchSetter = localStorage.getItem("searchKeyword");
    }
    if (localStorage.getItem("pageNumbertogoback") != "null") {
      pageNumberToSearch = Number(localStorage.getItem("pageNumbertogoback"));
      //convert string to number
      // getSubPosts(Number(localStorage.getItem("pageNumbertogoback")));
    }
    //
    const searchParams = new URLSearchParams(location.search);

    const pageSearchedFor = searchParams.get("page");
    //
    if (pageSearchedFor) {
      pageNumberToSearch = Number(pageSearchedFor);
    }
    //

    const keywordSearchedFor = searchParams.get("keyword");

    if (keywordSearchedFor) {
      keywordSearchSetter = keywordSearchedFor;
    }

    localStorage.setItem("searchKeyword", keywordSearchSetter);
    setSearchQuery(keywordSearchSetter);

    if (!keywordSearchSetter) {
      getSubPosts(pageNumberToSearch);
    } else {
      getKeywordBasedSubPosts(pageNumberToSearch, keywordSearchSetter);
    }
    setPageNumber(pageNumberToSearch);
    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      backToTop.remove();
    }

    try {
      // mixpanel.identify(JSON.parse(localStorage.getItem("tokenDecoded")).email);

    } catch (error) {
      //
    }
  }, [
    new URLSearchParams(location.search).get("page"),
    new URLSearchParams(location.search).get("keyword"),
  ]);

  const handlePreviousPage = () => {
    if (pageNumber > 1) {

      const newPageNumber = pageNumber - 1;
      //
      // setPageNumber(newPageNumber);
      // localStorage.setItem("pageNumbertogoback", newPageNumber);

      if (searchKeyword) {
        //
        getKeywordBasedSubPosts(newPageNumber, searchKeyword);
      } else {
        getSubPosts(newPageNumber);
      }
    }
  };
  const handleNextPage = () => {

    const newPageNumber = pageNumber + 1;
    setPageNumber(newPageNumber);
    // getSubPosts(newPageNumber);
    // localStorage.setItem("pageNumbertogoback", newPageNumber);
    if (searchKeyword) {
      //
      getKeywordBasedSubPosts(newPageNumber, searchKeyword);
    } else {
      getSubPosts(newPageNumber);
    }
  };

  const [searchQuery, setSearchQuery] = React.useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const performSearch = () => {
    // Access the searchQuery value here

    //
    // navigate("/subleaseposts?keyword=" + searchQuery);
    // navigate(`/subleaseposts?keyword=${searchQuery}&page=${pageNumber}`);
    getKeywordBasedSubPosts(1, searchQuery);

    // Call your desired method or function here
  };

  const formRef = useRef(null);
  const keywordCrossClick = () => {
    navigate("/subleaseposts");
    setSearchKeyword(null);
    localStorage.setItem("searchKeyword", null);
    localStorage.setItem("pageNumbertogoback", null);
    getSubPosts(1);
    setSearchQuery("");
  };

  const formatDateToReadableForm = (dateString) => {
    return format(parseISO(dateString), "MMMM d, yyyy");
  };

  const fullNameTooltip = (firstName, lastName) => (
    <Tooltip id="tooltip">
      {firstName} {lastName}
    </Tooltip>
  );

  const showDateInReadableForm = (dateFromDB) => {
    //
    <Tooltip id="tooltipAdPostDate">
      {formatDateToReadableForm(dateFromDB)}
    </Tooltip>;
  };

  if (spinnerActive) {
    return <Spinner />;
  }

  return (
    <React.Fragment>
      <NavScrollExample />
      {showMap && (
        <MapModal
          show={showMap}
          handleClose={handleToggleMap}
          className="map-modal"
          address={mapAddressSelected}
        />
      )}

      <div className="container-fluid d-flex flex-column justify-content-center align-items-center">
        <div className=" searchbox input-group mb-3 mt-4">
          <input
            type="text"
            className="form-control"
            aria-label="Search"
            placeholder="eg. '2b2b private male jain'"
            value={searchQuery}
            onChange={handleInputChange}
            style={{ borderStartStartRadius: "10px" }}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                performSearch();
              }
            }}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            onClick={performSearch}
            style={{ borderEndEndRadius: "10px" }}
          >
            Search
          </button>
        </div>
        {searchLoader && <Loader animation="border" size="sm" />}
      </div>
      <div>
        {searchKeyword && (
          <Button
            className="d-flex m-4"
            variant="danger"
            onClick={keywordCrossClick}
          >
            {searchKeyword} &#x2715; {/* Cross Button */}
          </Button>
        )}
      </div>

      <Container fluid>
        <Row xs={1} sm={2} md={2} lg={4} xl={4}>
          {Array.from(subPosts).map((item) => (
            <Col className="g-4 pb-3" key={item.uuid}>
              <Card style={{ borderRadius: 20, cursor: "pointer" }}>
                <Card.Header>
                  {loadingImages ? (
                    <Skeleton count={8} />
                  ) : JSON.parse(item.imageUrls) &&
                    JSON.parse(item.imageUrls).length > 1 ? (
                    <Carousel
                      className="mb-2"
                      variant="dark"
                      style={{ maxHeight: "300px", overflow: "hidden" }}
                    >
                      {JSON.parse(item.imageUrls).map((url) => (
                        <Carousel.Item key={url} style={{ borderRadius: 20 }}>
                          {process.env.REACT_APP_ENV === "production" ? (
                            <img
                              style={{
                                borderRadius: 20,
                                objectFit: "cover",
                                display: imageLoaded ? "block" : "none",
                              }}
                              onClick={() => handleButtonClick(item.uuid)}
                              className="d-block w-100 carousel-image"
                              src={`${url}`}
                              alt="Apartment images"
                              onLoad={handleImageLoad}
                            />
                          ) : (
                            <img
                              style={{
                                borderRadius: 20,
                                objectFit: "cover",
                                display: imageLoaded ? "block" : "none",
                              }}
                              onClick={() => handleButtonClick(item.uuid)}
                              className="d-block w-100 carousel-image"
                              src={
                                baseUrl +
                                `/${url
                                  .replace("static/", "public/")
                                  .replace(/\\/g, "/")}`
                              }
                              onLoad={handleImageLoad}
                              alt="Apartment images"
                            />
                          )}
                          {!imageLoaded && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                              }}
                            >
                              <p>Loading...</p>
                            </div>
                          )}
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : process.env.REACT_APP_ENV === "production" ? (
                    <img
                      style={{
                        borderRadius: 20,
                        objectFit: "cover",
                      }}
                      onClick={() => handleButtonClick(item.uuid)}
                      className="d-block w-100 carousel-image"
                      src={JSON.parse(item.imageUrls)[0]}
                      alt="Apartment images"
                    />
                  ) : (
                    <img
                      style={{
                        borderRadius: 20,
                        objectFit: "cover",
                      }}
                      onClick={() => handleButtonClick(item.uuid)}
                      className="d-block w-100 carousel-image"
                      src={
                        baseUrl +
                        `/${JSON.parse(item.imageUrls)[0]
                          .replace("static/", "public/")
                          .replace(/\\/g, "/")}`
                      }
                      alt="Apartment images"
                    />
                  )}
                </Card.Header>

                <Card.Body style={{ paddingBottom: "6px" }}>
                  <Card.Title
                    className="pt-1 mb-3 fs-4 d-flex justify-content-between"
                    onClick={() => handleToggleMap(item.street)}
                  >
                    <span
                      className="text-truncate"
                      style={{ maxWidth: "370px" }}
                      onClick={() => handleButtonClick(item.uuid)}
                    >
                      {item.street}
                    </span>

                    <span className="ms-3" style={{ cursor: "pointer" }}>
                      <i className="bi bi-geo-alt-fill"></i>
                    </span>
                  </Card.Title>
                  <div
                    className="mb-3"
                    onClick={() => handleButtonClick(item.uuid)}
                  >
                    <Card.Text>
                      <b>Rent: </b> {item.rent.toLocaleString()}$ /month (
                      <b>{item.type} Room</b>)
                    </Card.Text>
                    <Card.Text>
                      <div className="d-flex justify-content-start">
                        <span>
                          <b>Type: </b> {item.no_of_bed} Bed {item.no_of_bath}{" "}
                          Bath{" "}
                        </span>
                      </div>
                    </Card.Text>

                    <Card.Text>
                      <div className="d-flex justify-content-between flex-wrap">
                        <span>
                          <b>Start: </b>
                          {format(
                            parseISO(item.sublease_start_date),
                            "MMMM d, yyyy"
                          )}
                        </span>
                        <span style={{ float: "right" }}>
                          <b>End: </b>
                          {format(
                            parseISO(item.sublease_end_date),
                            "MMMM d, yyyy"
                          )}
                        </span>
                      </div>
                    </Card.Text>
                  </div>
                  {/* 
                  <Button
                    variant="outline-dark"
                    onClick={() => handleButtonClick(item.uuid)}
                  >
                    Show details...
                  </Button> */}
                </Card.Body>
                <Card.Footer
                  className="text-muted d-flex justify-content-between"
                  style={{ margin: "0", padding: "6px" }}
                >
                  <span className="me-auto">
                    <span
                      className="text-muted me-1 d-block text-truncate"
                      style={{
                        float: "right",
                        maxWidth: "100px",
                        fontSize: "small",
                        overflow: "-moz-hidden-unscrollable",
                        marginLeft: "10px",
                      }}
                    >
                      <OverlayTrigger
                        placement="bottom"
                        overlay={fullNameTooltip(
                          item["User.first_name"],
                          item["User.last_name"]
                        )}
                      >
                        <div>
                          {item["User.first_name"]}.
                          {item["User.last_name"] && item["User.last_name"][0]}
                        </div>
                      </OverlayTrigger>
                    </span>
                  </span>
                  <span
                    className="ms-auto"
                    style={{
                      fontSize: "small",
                      marginRight: "10px",
                    }}
                  >
                    <div>{"~ " + moment(item.createdAt).fromNow()}</div>
                  </span>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {subPosts.length !== 0 ? (
        <div className="d-flex justify-content-center mt-4 mb-5">
          <br />
          <nav>
            <ul className="pagination">
              <li className={`page-item ${pageNumber === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={handlePreviousPage}>
                  Previous
                </button>
              </li>
              {pageNumbers.map((number) => (
                <li
                  className={`page-item ${pageNumber === number ? "active" : ""
                    }`}
                  key={number}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      getKeywordBasedSubPosts(number, searchQuery) &&
                      setPageNumber(number)
                    }
                  >
                    {number}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${pageNumber === pageNumbers.length ? "disabled" : ""
                  }`}
              >
                <button className="page-link" onClick={handleNextPage}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center"
          style={{ marginBottom: "100px" }}
        >
          <div>
            <img
              src="assets/img/house.svg"
              class="img-fluid animated"
              alt=""
              width="300px"
            ></img>
            <br />
            <br />
            <br />
            <h2>No Sublease Posts Found!</h2>
            <h2>Check again soon!</h2>
          </div>
        </div>
      )}

      <a
        href="/adpost"
        className="plus-button d-flex align-items-center justify-content-center active"
      >
        <i className="bi bi-plus-lg"></i>
      </a>
      <Footer></Footer>
    </React.Fragment>
  );
}

export default ViewAdPostings;
