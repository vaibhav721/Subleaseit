import axios from "axios";
import React, { useEffect, useState } from "react";
import { Carousel, Tooltip, OverlayTrigger } from "react-bootstrap";
import "../styles/map/gmap-embedded.css";
import MapEmbedded from "../components/usc/gmap-embedded";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import "../styles/singlePost.css";
// import { REACT_APP_BASE_URL } from "process.env";
import Footer from "../components/footer";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Helmet } from "react-helmet";
import "../styles/singlePost.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "react-bootstrap/Spinner";

//import mixpanel from "../components/mixpanelInit";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { parseISO, format } from "date-fns";

import NavScrollExample from "../components/Navbar";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import { toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";

function ShowMoreDetails() {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [subPost, setSubPost] = React.useState(null);
  const [spinnerActive, setSpinnerActive] = React.useState(true);
  const [showMap, setShowMap] = React.useState(false);
  const [mapAddressSelected, setMapAddressSelected] = React.useState(false);
  const [isAdPostActive, setIsAdPostActive] = React.useState(true);
  const [contactData, setContactData] = React.useState({});
  const [imageURL, setImageURL] = React.useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const baseUrl = process.env.REACT_APP_BASE_URL;
  // Handler to toggle the map modal
  const handleToggleMap = (address) => {
    //
    setMapAddressSelected(address);
    setShowMap(true);
    //
  };

  /**
   *
   * @param {String} dateString
   * @returns date in readable format
   */
  const formatDate = (dateString) => {
    return format(parseISO(dateString), "MMMM d, yyyy");
  };

  //get the image url from the backend and set it to the state variable
  const getImageUrl = async () => {
    try {
      const res = await axios.get(baseUrl + "/api/v1/subleaseit/adpost/" + id, {
        withCredentials: true,
      });
      const sub = (await res) && res.data;
      setImageURL(JSON.parse(sub.imageUrls)[0]);
    } catch (err) {
      //
    }
  };

  // if (
  //   JSON.parse(localStorage.getItem("tokenDecoded")) != undefined &&
  //   JSON.parse(localStorage.getItem("tokenDecoded")).uuid === id
  // )
  useEffect(() => {
    // Show the tooltip after 7 seconds

    const tooltipTimeout = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    // Hide the tooltip after 2 seconds (if it was shown)
    const hideTooltipTimeout = setTimeout(() => {
      setShowTooltip(false);
    }, 11000);

    return () => {
      // Clear the timeouts to avoid memory leaks
      clearTimeout(tooltipTimeout);
      clearTimeout(hideTooltipTimeout);
    };
  }, []);
  //
  const tooltip = (
    <Tooltip id="tooltip">
      <strong>Click to share this Ad on Whatsapp to get more reach</strong>.
    </Tooltip>
  );

  const tooltipNormal = (
    <Tooltip id="tooltip">
      <strong>Click to share on Whatsapp</strong>.
    </Tooltip>
  );

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    setShowModal(true);
  };
  const tooltipPlacement = isMobile ? "top" : "right";
  const { id } = useParams();
  async function getSubPost() {
    try {
      const res = await axios.get(baseUrl + "/api/v1/subleaseit/adpost/" + id, {
        withCredentials: true,
      });
      //

      const sub = (await res) && res.data;
      //
      setSubPost(sub);
      setIsAdPostActive(sub.is_adpost_active);
      handleToggleMap(sub.street);
      //
      //
      setTextAndUniqueURL(sub);
    } catch (err) {
      //
    } finally {
      setSpinnerActive(false);
    }
  }

  const handleEmailClick = async () => {
    let tokenDecoded;
    try {
      tokenDecoded = localStorage.getItem("tokenDecoded");
      tokenDecoded = JSON.parse(tokenDecoded);
    } catch (err) { }
    const email = contactData.email;
    const subject = "[SubleaseIt] Query regarding " + subPost.street;
    let body =
      "Hi " +
      subPost["User.first_name"] +
      "," +
      "\n\n I am interested in the apartment at " +
      subPost.street +
      ", Apt number: " +
      subPost.appt_no +
      ".\n I hope it's available, can you please let me know the process of subleasing it? " +
      "\n\n" +
      "Thanks";
    if (tokenDecoded) {
      body =
        body +
        ", \n" +
        tokenDecoded.first_name +
        " " +
        tokenDecoded.last_name +
        "\n" +
        tokenDecoded.email;
    }



    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleShare = () => {
    //
    const message = encodeURIComponent(text);
    const sharedUrl = encodeURIComponent(uniqueUrl);
    const whatsappUrl = `https://wa.me/?text=${message}%20${sharedUrl}`;
    window.open(whatsappUrl);
  };

  const [text, setText] = useState("Find more details on subleaseit");
  const [uniqueUrl, setUniqueUrl] = useState("");

  const setTextAndUniqueURL = (sub) => {
    const startDate = formatDate(sub.sublease_start_date);
    const endDate = formatDate(sub.sublease_end_date);
    const text = `🏠 Subleasing ${sub.type} room for ${sub.rent
      }$ /month \n\n📅 ${startDate} to ${endDate}\n\n🛏 Bed/Bath: ${sub.no_of_bed
      }B${sub.no_of_bath}B\n\n${sub.tot_ppl_in_appt &&
      "👯 Total people in apartment: " +
      sub.tot_ppl_in_appt +
      " (including you)\n\n"
      }📍 Address: ${sub.appt_no}, ${sub.street}\n\n👤 Gender preference: ${sub.gender
      }\n\n🥘 Diet preference: ${sub.diet
      }\n\nℹ Find more images & details at subleaseit:`;
    // const baseUrlSocial = process.env.REACT_APP_BASE_URL_Social;
    setText(text);
    const url = `${process.env.REACT_APP_BASE_URL}/subleaseit/adpost/${sub["uuid"]}`;
    const uniqueUrl = `${url}?timestamp=${Date.now()}`;
    setUniqueUrl(uniqueUrl);
  };

  useEffect(() => {
    getSubPost();
    getImageUrl();
  }, []);

  useEffect(() => {
    // handleShare();
  }, [subPost, imageURL]);

  const [showMoreDetailsSpinner, setShowMoreDetailsSpinner] = useState(false);

  const contactRequest = async () => {
    try {
      setShowMoreDetailsSpinner(true);
      const res = await axios.get(
        baseUrl +
        "/api/v1/subleaseit/user/" +
        subPost["User.username"] +
        "/adPost/" +
        subPost["uuid"],
        {
          withCredentials: true,
        }
      );
      let response = (await res) && res.data;

      if (res.status === 401) {
        toast.error("We are facing issue getting contact details");
        setContactData(null);
      } else {
        let extractDataFromResponse = {
          email: response.email,
          phone: response["AdPostings.phone"],
          isWhatsappNumber: response["AdPostings.isWhatsappNumber"],
        };

        setContactData(extractDataFromResponse);
      }
      setShowMoreDetailsSpinner(false);
    } catch (err) {
      //
      setContactData(null);
      setShowMoreDetailsSpinner(false);
    }
  };

  const callThisNumber = (phoneNumberOfAdOwner) => {
    const phoneCallUrl = `tel:${phoneNumberOfAdOwner}`;
    window.open(phoneCallUrl);
  };

  const whatsappUserToGetApartment = (phoneNumberOfAdOwner) => {
    const shareUrl = uniqueUrl;
    let message = encodeURIComponent(
      `Hi ${subPost["User.first_name"]},\n\nI am interested in your apt listing at Subleaseit. Is the space still available?\n\n For reference, I am talking about this listing: `
    );
    message = message + `${shareUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumberOfAdOwner}&text=${message}`;
    window.open(whatsappUrl);
  };

  if (spinnerActive) {
    return <Spinner />;
  }

  return (
    <div>
      <Helmet>
        {/* <meta property="og:image:secure_url" content={imageURL} /> */}
        <meta property="og:image" content={imageURL} />
      </Helmet>
      <NavScrollExample />
      {subPost && (
        <div>
          {!isAdPostActive && (
            <div id="overlay">
              <div className="cover-up">
                <h2 className="cover-up-title">
                  {" "}
                  <span className="reddish-text">Apartment is subleased!</span>
                </h2>
                <p className="cover-up-message">
                  Sorry, the apartment has been subleased. Please check out our
                  other available listings.
                </p>
                <Link to="/subleaseposts" className="cover-up-link">
                  Show Available Listings
                </Link>
              </div>
            </div>
          )}

          <div className="container text-center">
            <div className="row">
              <div className="col">
                <div className="card mb-3 mt-3 border-0">
                  <div className="card-img-top">
                    {JSON.parse(subPost["imageUrls"]) &&
                      JSON.parse(subPost["imageUrls"]).length > 1 ? (
                      <Carousel
                        className="mb-2"
                        variant="dark"
                        data-bs-theme="dark"
                      >
                        {JSON.parse(subPost["imageUrls"]).map((url) => (
                          <Carousel.Item key={url} style={{ borderRadius: 20 }}>
                            {process.env.REACT_APP_ENV === "production" ? (
                              <img
                                className="d-block w-100 carousel-image"
                                src={`${url}`}
                                alt="Apartment images"
                                style={{
                                  objectFit: "contain",
                                  borderRadius: 20,
                                  height: "60vh",
                                }}
                              />
                            ) : (
                              <img
                                style={{
                                  objectFit: "contain",
                                  borderRadius: 20,
                                  height: "60vh",
                                }}
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
                    ) : (
                      <>
                        {process.env.REACT_APP_ENV === "production" ? (
                          <img
                            className="d-block w-100 "
                            src={JSON.parse(subPost["imageUrls"])[0]}
                            alt="Apartment images"
                            style={{
                              objectFit: "contain",
                              borderRadius: 20,
                              height: "60vh",
                            }}
                          />
                        ) : (
                          <img
                            style={{
                              objectFit: "contain",
                              borderRadius: 20,
                              height: "60vh",
                            }}
                            className="d-block w-100 "
                            src={
                              baseUrl +
                              `/${JSON.parse(subPost["imageUrls"])[0]
                                .replace("static/", "public/")
                                .replace(/\\/g, "/")}`
                            }
                            alt="Apartment images"
                          />
                        )}
                      </>
                    )}
                  </div>

                  <div className="card-body">
                    <h1 className="card-title">{subPost.street}</h1>
                    <hr></hr>
                    <p className="card-text mt-5">
                      <div className="property-summary ">
                        <div className="row outerbox">
                          <div className="col">
                            <div className="d-flex justify-content-between">
                              <div className="title-box-d section-t4">
                                <h3 className="title-d mt-2">
                                  Apartment Details
                                </h3>
                                {/* <p>Share the ad on:</p> */}
                              </div>

                              <div className="ms-3">
                                {/* <FacebookShareButton
                                  url={uniqueUrl}
                                  quote={
                                    "Checkout my sublease post on SubleaseIt! "
                                  }
                                  hashtag="#subleaseit"
                                >
                                  <FacebookIcon size={34} round />
                                </FacebookShareButton> */}
                                {/* <button type="button" className="btn-secondary">
                                  Share Ad */}
                                {JSON.parse(
                                  localStorage.getItem("tokenDecoded")
                                ) !== null &&
                                  JSON.parse(localStorage.getItem("tokenDecoded"))
                                    .uuid === subPost["User.username"] ? (
                                  <OverlayTrigger
                                    placement={tooltipPlacement}
                                    overlay={tooltip}
                                    show={showTooltip}
                                    trigger={["hover", "focus"]}
                                    onToggle={() => {
                                      setShowTooltip(!showTooltip);
                                    }}
                                  >
                                    <button className="whatsapp_button btn ">
                                      <WhatsappShareButton
                                        className="ms-2 me-1 whatsapp_inner"
                                        onClick={handleShare}
                                        url={uniqueUrl}
                                        title={text}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                      >
                                        <WhatsappIcon size={44} round />
                                        <span
                                          className="ms-1 me-1"
                                          style={{ fontSize: "1.3em" }}
                                        >
                                          Share
                                        </span>
                                      </WhatsappShareButton>
                                    </button>
                                  </OverlayTrigger>
                                ) : (
                                  <OverlayTrigger
                                    placement={tooltipPlacement}
                                    overlay={tooltipNormal}
                                    trigger={["hover", "focus"]}
                                    onToggle={() => {
                                      setShowTooltip(!showTooltip);
                                    }}
                                  >
                                    <button className="whatsapp_button btn ">
                                      <WhatsappShareButton
                                        className="ms-2 me-1 whatsapp_inner"
                                        onClick={handleShare}
                                        url={uniqueUrl}
                                        title={text}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                      >
                                        <WhatsappIcon size={44} round />
                                        <span
                                          className="ms-1 me-1"
                                          style={{ fontSize: "1.3em" }}
                                        >
                                          Share
                                        </span>
                                      </WhatsappShareButton>
                                    </button>
                                  </OverlayTrigger>
                                )}

                                {/* </button> */}
                              </div>
                            </div>
                            <hr></hr>
                          </div>
                        </div>
                        <div className="summary-list mt-3 ">
                          <div className="outerbox">
                            <ul className="list ps-0">
                              <li className="d-flex justify-content-between">
                                <span>Rent:</span>
                                <strong
                                  className="text-truncate"
                                  style={{ maxWidth: "250px" }}
                                >
                                  {subPost.rent.toLocaleString()}$ /month (
                                  <b>{subPost.type} Room</b>)
                                  {/* ${subPost.rent} /month ({subPost.type} Room) */}
                                </strong>
                              </li>
                              <li className="d-flex justify-content-between">
                                <span>Type:</span>
                                <strong
                                  className="text-truncate"
                                  style={{ maxWidth: "250px" }}
                                >
                                  {subPost.no_of_bed} Bed {subPost.no_of_bath}{" "}
                                  Bath{" "}
                                </strong>
                              </li>
                              {subPost.type !== "Private" && (
                                <li className="d-flex justify-content-between">
                                  <span>Room to be shared with:</span>
                                  <strong
                                    className="text-truncate"
                                    style={{ maxWidth: "250px" }}
                                  >
                                    {subPost.shared_with} others
                                  </strong>
                                </li>
                              )}
                              {subPost.tot_ppl_in_appt && (
                                <li className="d-flex justify-content-between">
                                  <span>Total people in apartment:</span>
                                  <strong
                                    className="text-truncate"
                                    style={{ maxWidth: "250px" }}
                                  >
                                    {subPost.tot_ppl_in_appt}
                                  </strong>
                                </li>
                              )}
                              <li className="d-flex justify-content-between">
                                <span>Sublease start:</span>
                                <strong
                                  className="text-truncate"
                                  style={{ maxWidth: "250px" }}
                                >
                                  {format(
                                    parseISO(subPost.sublease_start_date),
                                    "MMMM d, yyyy"
                                  )}
                                </strong>
                              </li>
                              <li className="d-flex justify-content-between">
                                <span>Sublease end:</span>
                                <strong
                                  className="text-truncate"
                                  style={{ maxWidth: "250px" }}
                                >
                                  {format(
                                    parseISO(subPost.sublease_end_date),
                                    "MMMM d, yyyy"
                                  )}
                                </strong>
                              </li>
                              <li className="d-flex justify-content-between">
                                <span>Apartment number:</span>
                                <strong
                                  className="text-truncate"
                                  style={{ maxWidth: "200px" }}
                                >
                                  {subPost.appt_no}
                                </strong>
                              </li>
                              <li className="d-flex justify-content-between">
                                <span>Gender Preference:</span>
                                <strong
                                  className="text-truncate"
                                  style={{ maxWidth: "200px" }}
                                >
                                  {subPost.gender}
                                </strong>
                              </li>
                              <li className="d-flex justify-content-between">
                                <span>Diet Preference:</span>
                                <strong
                                  className="text-truncate"
                                  style={{ maxWidth: "200px" }}
                                >
                                  {subPost.diet}
                                </strong>
                              </li>
                              <li className="d-flex justify-content-between">
                                <span>Posted by:</span>
                                <strong
                                  className="text-truncate"
                                  style={{ maxWidth: "200px" }}
                                >
                                  {subPost["User.first_name"]}{" "}
                                  {subPost["User.last_name"]}
                                </strong>
                              </li>

                              <li className="d-flex flex-column">
                                <>
                                  <p>
                                    <a
                                      className="btn  mt-2 btn-outline-dark"
                                      data-bs-toggle="collapse"
                                      href="#collapseExample"
                                      role="button"
                                      aria-expanded="false"
                                      aria-controls="collapseExample"
                                      style={{ float: "left" }}
                                      onClick={() => {

                                        contactRequest(subPost["uuid"]);
                                      }}
                                    >
                                      Contact Details
                                      {showMoreDetailsSpinner && (
                                        <Loader
                                          animation="border"
                                          size="sm"
                                          style={{ marginLeft: "5px" }}
                                        />
                                      )}
                                    </a>
                                  </p>

                                  {contactData !== null ? (
                                    <div
                                      className="collapse mb-4"
                                      id="collapseExample"
                                    >
                                      <div className="card card-body">
                                        {contactData.email !== undefined &&
                                          contactData.email !== "" && (
                                            <li
                                              className="d-flex justify-content-between show-cursor mb-2"
                                              onClick={() => handleEmailClick()}
                                            >
                                              <FontAwesomeIcon
                                                icon={faEnvelope}
                                              />{" "}
                                              {/* Email ID: */}
                                              <strong>
                                                <span>{contactData.email}</span>
                                              </strong>
                                            </li>
                                          )}
                                        {contactData.phone !== undefined &&
                                          contactData.phone !== "" && (
                                            <li
                                              className="d-flex justify-content-between mb-2 show-cursor"
                                              onClick={() =>
                                                callThisNumber(
                                                  contactData.phone
                                                )
                                              }
                                            >
                                              <FontAwesomeIcon icon={faPhone} />{" "}
                                              {/* Contact No: */}
                                              <strong>
                                                <span>{contactData.phone}</span>
                                              </strong>
                                            </li>
                                          )}
                                        {contactData.isWhatsappNumber && (
                                          <li
                                            className="d-flex justify-content-between show-cursor"
                                            onClick={() =>
                                              whatsappUserToGetApartment(
                                                contactData.phone
                                              )
                                            }
                                          >
                                            <FontAwesomeIcon
                                              icon={faWhatsapp}
                                            />{" "}
                                            <strong>
                                              <span>
                                                Click here to Whatsapp
                                              </span>
                                            </strong>
                                          </li>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    // <Spinner />
                                    <div>
                                      <span>
                                        Please Login with .edu email address
                                      </span>
                                      <a
                                        className="btn btn-success mt-2"
                                        role="button"
                                        aria-expanded="false"
                                        onClick={() => {
                                          // contactRequest(subPost["uuid"]);
                                        }}
                                      >
                                        Login
                                      </a>
                                    </div>
                                  )}
                                </>
                              </li>
                            </ul>

                            {subPost["notes"] !== undefined &&
                              subPost["notes"] != "" &&
                              subPost["notes"].length > 0 && (
                                <div class="notesSection">
                                  <h3 className="additional-notes-heading">
                                    Additional Notes
                                  </h3>
                                  <hr />

                                  <ReactQuill
                                    className="quilleditorcustom"
                                    value={subPost["notes"]}
                                    readOnly={true}
                                    theme="snow"
                                    modules={{}}
                                    toolbar={false}
                                  />
                                </div>
                              )}

                            <h3 className="additional-notes-heading">
                              Apartment Locator:
                            </h3>
                          </div>
                          <div className="row">
                            {showMap && (
                              <MapEmbedded
                                show={showMap}
                                handleClose={handleToggleMap}
                                className="map-modal"
                                address={mapAddressSelected}
                              />
                            )}
                          </div>
                          <div
                            className="text-muted"
                            style={{ marginTop: "-10px" }}
                          >
                            The Red Zone marked on map is the{" "}
                            <a
                              href="https://dps.usc.edu/patrol/"
                              target="_blank"
                              style={{ color: "#6c757d" }}
                            >
                              DPS Zone{" "}
                            </a>{" "}
                            (Safe Zone)
                          </div>
                        </div>
                      </div>
                    </p>
                  </div>

                  <section className="section-footer-bottom">
                    <hr
                      style={{
                        width: "400px",
                        margin: "0 auto",
                        marginBottom: "40px",
                      }}
                    />
                    <div className="container">
                      <div className="row">
                        <div className="col-sm-12 col-md-12">
                          <div className="widget-a">
                            {/* Add the custom class to the parent div */}
                            <div className="w-header-a text-muted left-align-content">
                              <h5 className="w-title-a text-brand">
                                Note from Sublease it Team
                              </h5>
                            </div>
                            <div className="w-body-a left-align-content">
                              <p className="w-text-a color-text-a text-muted small">
                                Sublease it does not guarantee the accuracy,
                                validity, or integrity of information shared on
                                this platform. Ad postings are exclusively
                                facilitated by students with @usc.edu email
                                addresses. We encourage users to exercise
                                caution and obtain all necessary documents, such
                                as the lease agreement, before making payments
                                or deposits. Sublease It disclaims any liability
                                for transactions or interactions between users.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Detailed View</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Image src={selectedImage} alt="Detailed View" fluid />
            </Modal.Body>
          </Modal>

          <a
            href="#"
            className="back-to-top d-flex align-items-center justify-content-center"
          >
            <i className="bi bi-arrow-up-short"></i>
          </a>
        </div>
      )}
      <Footer></Footer>
    </div>
  );
}

export default ShowMoreDetails;
