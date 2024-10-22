import axios from "axios";
import React, { Component, useEffect } from "react";
import {
  Card,
  Carousel,
  CardGroup,
  Accordion,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "../styles/subposts.css";
import { GoogleApiWrapper } from "google-maps-react";
import MapModal from "../components/usc/gmap";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Toast } from "react-bootstrap";
import Spinner from "../components/Spinner";
import Modal from "react-bootstrap/Modal";
import Footer from "../components/footer";
import NavScrollExample from "../components/Navbar";
import mixpanel from "../components/mixpanelInit";
import moment from "moment";
import { parseISO, format } from "date-fns";

// import { REACT_APP_BASE_URL } from "process.env";

function MyPosts() {
  const [subPosts, setSubPosts] = React.useState([]);
  const [showMap, setShowMap] = React.useState(false);
  const [mapAddressSelected, setMapAddressSelected] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageNumbers, setPageNumbers] = React.useState([]);
  const [loadingImages, setLoadingImages] = React.useState(true);
  const [spinnerActive, setSpinnerActive] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [aptUUID, setAptUUID] = React.useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let tokenDecoded = localStorage.getItem("tokenDecoded");
  tokenDecoded = JSON.parse(tokenDecoded);
  //

  const headers = {
    Authorization: "Bearer " + token,
    uuid: tokenDecoded !== null && tokenDecoded.uuid,
  };
  //
  const handleButtonClick = (uuid) => {
    navigate(`/subleaseposts/${uuid}`);
  };

  const editButtonClick = (aptUUID) => {
    mixpanel.track("Edit post try", { post_id: aptUUID });
    navigate(`/subleaseposts/${aptUUID}/edit`);
  };
  //

  const deleteButtonClick = (aptUUID) => {
    mixpanel.track("Delete post try", { post_id: aptUUID });
    //

    setShowModal(true);
    // if (delete)
    // deleteButtonModal(aptUUID);
    setAptUUID(aptUUID);
  };
  //
  const deleteButtonModal = () => {
    //
    //

    axios
      .get(baseUrl + "/api/v1/subleaseit/adpost/delete/" + aptUUID, {
        headers: { withCredentials: true, Authorization: "Bearer " + token },
      })
      .then((res) => {
        //
        //
        setShowModal(false);
        toast.success("Ad deleted Successfully");
        mixpanel.track("post deleted", { post_id: aptUUID });
        getSubPosts(pageNumber);
      })
      .catch((err) => {
        //
        // toast.error("Oops! Something went wrong.");
        // navigate("/");
      });
  };

  // Handler to toggle the map modal
  const handleToggleMap = (address) => {
    //
    setMapAddressSelected(address);
    setShowMap(!showMap);
  };

  async function getSubPosts(pageNumber = 1) {
    try {
      let tokenDecoded = localStorage.getItem("tokenDecoded");
      tokenDecoded = JSON.parse(tokenDecoded);
      //
      const res = await axios.get(
        baseUrl + `/api/v1/subleaseit/adpost/my?pageNumber=${pageNumber}`,
        {
          withCredentials: true,
          headers: headers,
        }
      );

      const sub = (await res) && res.data;
      //
      const sub2 = (await sub) && sub.paginatedResults;
      //
      const subPosts = (await sub2) && sub2.adPostings;
      //
      const totalPageCount = (await sub2) && sub2.totalCount;

      setSubPosts(subPosts);
      setLoadingImages(false);

      const totalPages = Math.ceil(totalPageCount / 10);
      const pn = Array.from({ length: totalPages }, (_, i) => i + 1);
      //
      setPageNumbers(pn);
      //
    } catch (err) {
      //
      if (err.response.data.statusCode == "401") {
        toast.error("Session Ended, Logging you out");
        localStorage.clear();
        navigate("/");
      }
    } finally {
      setSpinnerActive(false);
    }
  }

  const fullNameTooltip = (firstName, lastName) => (
    <Tooltip id="tooltip">You posted this Ad</Tooltip>
  );

  useEffect(() => {
    getSubPosts(1);
    mixpanel.track("Edit Ads page visit");
  }, []);

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      const newPageNumber = pageNumber - 1;
      getSubPosts(newPageNumber);
      setPageNumber(newPageNumber);
    }
  };
  const handleNextPage = () => {
    const newPageNumber = pageNumber + 1;
    getSubPosts(newPageNumber);
    setPageNumber(newPageNumber);
  };

  const handleClose = (event) => {
    setShowModal(false);
  };

  //
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
      {showModal && (
        <Modal
          show={showModal}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          // aria-labelledby="contained-modal-title-vcenter"
          // centered
        >
          <Modal.Header>
            <Modal.Title>Confirm delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <br />
            <h5 style={{ textAlign: "center" }}>
              Are you sure you want to delete this post?
            </h5>
          </Modal.Body>
          <Modal.Footer>
            <button
              variant="secondary "
              class="btn btn-dark"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-danger"
              onClick={deleteButtonModal}
            >
              Delete
            </button>
          </Modal.Footer>
        </Modal>
      )}
      <Container fluid>
        <Row xs={1} sm={2} md={2} lg={4} xl={4}>
          {Array.from(subPosts).map((item, key) => (
            <Col className="g-4 pb-3" key={key}>
              <Card style={{ borderRadius: 20, cursor: "pointer" }}>
                <Card.Header>
                  {loadingImages ? (
                    <Skeleton count={8} />
                  ) : (
                    <Carousel
                      className="mb-2"
                      variant="dark"
                      style={{ maxHeight: "300px", overflow: "hidden" }}
                    >
                      {JSON.parse(item.imageUrls) &&
                        JSON.parse(item.imageUrls).map((url) => (
                          <Carousel.Item key={url} style={{ borderRadius: 20 }}>
                            {process.env.REACT_APP_ENV === "production" ? (
                              <img
                                style={{
                                  borderRadius: 20,
                                  objectFit: "cover",
                                }}
                                className="d-block w-100 carousel-image"
                                src={`${url}`}
                                alt="Apartment images"
                                onClick={() => handleButtonClick(item.uuid)}
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
                                  `/${url
                                    .replace("static/", "public/")
                                    .replace(/\\/g, "/")}`
                                }
                                alt="Apartment images"
                              />
                            )}
                          </Carousel.Item>
                        ))}
                    </Carousel>
                  )}
                </Card.Header>
                <Card.Body>
                  <Card.Title className="pt-1 mb-3 fs-4">
                    <div className="d-flex flex-column mt-2">
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="dark"
                          onClick={() => editButtonClick(item.uuid)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => deleteButtonClick(item.uuid)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card.Title>

                  <Card.Title className="pt-1 mb-3 fs-4 d-flex justify-content-between">
                    <span
                      className="text-truncate"
                      style={{ maxWidth: "350px" }}
                      onClick={() => handleButtonClick(item.uuid)}
                    >
                      {item.street}
                    </span>

                    <span
                      className="ms-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleToggleMap(item.street)}
                    >
                      <i className="bi bi-geo-alt-fill"></i>
                    </span>
                  </Card.Title>
                  <Card.Text onClick={() => handleButtonClick(item.uuid)}>
                    <b>Rent: </b>${item.rent}/month (<b>{item.type} Room</b>)
                  </Card.Text>
                  <Card.Text onClick={() => handleButtonClick(item.uuid)}>
                    <div className="d-flex justify-content-start">
                      <span>
                        <b>Type: </b> {item.no_of_bed} Bed {item.no_of_bath}{" "}
                        Bath{" "}
                      </span>
                    </div>
                  </Card.Text>
                  <Card.Text onClick={() => handleButtonClick(item.uuid)}>
                    <div className="d-flex justify-content-start">
                      <span>
                        <b>Start: </b>
                        {format(
                          parseISO(item.sublease_start_date),
                          "MMMM d, yyyy"
                        )}
                      </span>
                      <span className="ms-2" style={{ float: "right" }}>
                        <b>End: </b>
                        {format(
                          parseISO(item.sublease_end_date),
                          "MMMM d, yyyy"
                        )}
                      </span>
                    </div>
                  </Card.Text>
                  {/* <Button
                    variant="outline-dark"
                    onClick={() => handleButtonClick(item.uuid)}
                  >
                    Show more detail...
                  </Button> */}
                  {/* <span
                    className="text-muted mt-2 me-1 d-block text-truncate"
                    style={{ float: "right", maxWidth: "150px" }}
                  >
                    - {item["User.first_name"]} {item["User.last_name"]}
                  </span> */}
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

      {/* ------------------------------------------Code Block for Pagination ----------------------------- */}
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
              {/* <li className="page-item">
              <button className="page-link" disabled>
                Page {pageNumber}
              </button>
            </li> */}
              {pageNumbers.map((number) => (
                <li
                  className={`page-item ${
                    pageNumber === number ? "active" : ""
                  }`}
                  key={number}
                >
                  <button
                    className="page-link"
                    onClick={() => getSubPosts(number) && setPageNumber(number)}
                  >
                    {number}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  pageNumber === pageNumbers.length ? "disabled" : ""
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
        <div style={{ marginBottom: "100px" }}>
          <div className="d-flex justify-content-center mt-5">
            <img
              src="assets/img/house.svg"
              class="img-fluid animated"
              alt=""
              width="300px"
            ></img>
          </div>
          <div className="d-flex justify-content-center mt-2">
            <h2 className="mt-4">No Active Posts By You!</h2>
          </div>
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="primary"
              type="button"
              onClick={() => navigate("/adpost")}
              size="lg"
              text-align="center"
              style={{
                borderStyle: "none",
                backgroundImage: "linear-gradient(to right, #520821 , #C12D22)",
              }}
            >
              Create one now!
            </Button>
          </div>
        </div>
      )}
      <Footer></Footer>
    </React.Fragment>
  );
}

export default MyPosts;
