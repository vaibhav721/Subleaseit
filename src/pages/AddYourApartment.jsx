import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import NavScrollExample from "../components/Navbar";
import axios from "axios";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { useEffect, useState, useRef } from "react";
import FormData from "form-data";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/adpost.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faHandPointLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { REACT_APP_BASE_URL } from "process.env";
import Footer from "../components/footer";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS
import lottie from "lottie-web";
import mixpanel from "../components/mixpanelInit";
import PhoneInput from "react-phone-number-input";
// import { isValidPhoneNumber } from 'react-phone-number-input'
import isValidPhoneNumber from "libphonenumber-js";
import heic2any from "heic2any";

import "react-phone-number-input/style.css";

function AdPost() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [type, setType] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [filesCount, setFilesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const animationContainerRef = useRef(null);
  const [animationInstance, setAnimationInstance] = useState(null);
  const [isAnimationVisible, setIsAnimationVisible] = useState(false); // Add a state to control animation visibility

  const [gender, setGender] = useState("");
  const [diet, setDiet] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [arrayToShow, setArrayToShow] = useState([
    "Analyzing images",
    "Verifying extensions",
    "Compressing images",
    "Converting images",
    "Uploading to cloud",
    "Verifying upload",
    "Almost done",
    "Finishing up",
    "Hang on",
    "Please wait",
    "Sit tight",
    "Taking longer",
    "Almost there",
    "Be Patient",
    "Hang on",
    "Please wait",
    "Sit tight",
    "Taking longer",
    "Almost there",
    "Be Patient",
  ]);

  useEffect(() => {
    //
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % arrayToShow.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [arrayToShow]);

  useEffect(() => {
    // Simulate loading for 3 seconds
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(loadingTimeout);
  }, []);

  const navigate = useNavigate();

  const clearStorageAndRedirectToLandingPage = (errorMsg) => {
    localStorage.clear();
    navigate("/");
    toast.error(errorMsg);
    setIsFormSubmitting(false);
  };

  const logoutIfUserNotLoggedIn = () => {
    // if token exists, redirect
    let decodedToken = localStorage.getItem("tokenDecoded");
    if (!decodedToken)
      return clearStorageAndRedirectToLandingPage("Login to post Ad");
    decodedToken = JSON.parse(decodedToken);
    let currentDate = new Date();
    // JWT exp is in seconds
    if (decodedToken.exp * 1000 <= currentDate.getTime())
      clearStorageAndRedirectToLandingPage(
        "Session expired, please login to post Ad"
      );
  };

  useEffect(() => {
    logoutIfUserNotLoggedIn();
    // Load the Lottie animation and store the animation instance in the state
    // const animation = lottie.loadAnimation({
    //   container: animationContainerRef.current,
    //   renderer: "svg",
    //   loop: true,
    //   autoplay: true,
    //   path: "assets/Loader.json", // Replace with the path to your Lottie animation JSON file
    //   height: 200,
    //   width: 200,
    // });
    // setAnimationInstance(animation);
    // return () => {
    //   // Clean up the animation instance when the component unmounts
    //   animation.destroy();
    // };
  }, []);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const handleDeleteImage = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    setFilesCount(filesCount - 1);
  };
  const fileArray = [];

  const handleFileChange = async (e) => {
    const files = e.target.files;

    if (files.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      setCurrentIndex(0);
      setIsFormSubmitting(false);

      e.target.value = ""; // Clear the file input value
      return;
    }
    //check the file size of each file and if it is more than 15 mb, then show an error message and return from the function
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 15000000) {
        setCurrentIndex(0);
        toast.error(
          "Max image size allowed is 15 mb. (Don't choose big or RAW images)"
        );
        setCurrentIndex(0);
        setIsFormSubmitting(false);

        e.target.value = ""; // Clear the file input value
        return;
      }
    }
    setIsImageUploading(true);

    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "heic"];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const fileNameParts = file.name.split(".");
      const fileExtension =
        fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        setCurrentIndex(0);
        toast.error("Only JPG, JPEG, PNG, HEIC and GIF files are allowed");
        setIsFormSubmitting(false);

        e.target.value = "";
        return;
      }
      // Convert HEIC to JPEG if it is a HEIC file
      if (fileExtension === "heic") {
        //
        try {
          setIsFormSubmitting(true);
          const convertedBlob = await heic2any({
            blob: file,
            to: "image/jpeg",
          });
          const convertedFile = new File([convertedBlob], file.name, {
            type: "image/jpeg",
          });
          fileArray.push(convertedFile);
        } catch (error) {
          setCurrentIndex(0);
          toast.error("Error uploading HEIC image.");
          setIsFormSubmitting(false);

          // console.error("Error converting HEIC to JPEG:", error);
        }
      } else {
        // for (let i = 0; i < files.length; i++) {
        fileArray.push(files[i]);
      }
    }
    setIsFormSubmitting(false);
    setIsImageUploading(false);
    setSelectedFiles((prevFiles) => [...prevFiles, ...fileArray]);
    setFilesCount(filesCount + files.length);
  };
  //
  //
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handlePlusClick = (e) => {
    document.querySelector('input[type="file"]').click(); // Click on the checkbox
  };

  // setIsPrivate(type === "Private" ? true : false);
  const currentDate = new Date().toISOString().split("T")[0]; // Get current date in the format "YYYY-MM-DD"

  const handleSubmit = async (e) => {
    e.preventDefault();
    //
    setCurrentIndex(0);
    setIsFormSubmitting(true);
    const street = e.target.elements.formBasic1.value;
    const city = e.target.elements.formBasic2.value;
    const state = e.target.elements.formBasic3.value;
    const zipcode = e.target.elements.formBasic4.value;
    const typeSelected = type;
    const appt_no = e.target.elements.formBasic12.value;
    var shared_with;
    if (type === "Shared") {
      shared_with = e.target.elements.formBasic14.value;
    } else {
      shared_with = 0;
    }
    const tot_ppl_in_appt = e.target.elements.formBasic15.value;
    const no_of_bed = e.target.elements.formBasic16.value;
    const no_of_bath = e.target.elements.formBasic17.value;
    const sublease_start_date = e.target.elements.formBasic18.value;
    const sublease_end_date = e.target.elements.formBasic19.value;
    const rent = e.target.elements.formBasic11.value;
    // const notes = e.target.elements.formBasic10.value;
    // const phoneNumber = e.target.elements.phoneNumberControlId.value;
    const isWhatAppNumber = isChecked;

    //

    if (
      !street ||
      !city ||
      !state ||
      !zipcode ||
      !appt_no ||
      !sublease_start_date ||
      !sublease_end_date ||
      !rent ||
      !gender ||
      !diet
    ) {
      setCurrentIndex(0);
      toast.error("Please fill in all required fields.");
      setIsFormSubmitting(false);
      return;
    }
    // try {
    //   const response = await axios.get(
    //     `https://nominatim.openstreetmap.org/search?format=json&postalcode=${zipcode}&country=us&addressdetails=1&limit=1`
    //   );
    //   if (response.data.length > 0) {
    //     const extractedCity = response.data[0].address.city;
    //     const extractedState = response.data[0].address.state;

    //
    //
    //

    //
    //

    //     //convert to lowercase and remove spaces from the entered city and state and compare with extracted city and state
    //     if (
    //       city.toLowerCase().replace(/\s/g, "") !==
    //       extractedCity.toLowerCase().replace(/\s/g, "")
    //     ) {
    //       toast.error("City Name Incorrect");
    //       setIsLoading(false);

    //       return;
    //     }
    //     if (
    //       state.toLowerCase().replace(/\s/g, "") !==
    //       extractedState.toLowerCase().replace(/\s/g, "")
    //     ) {
    //       toast.error("State Name Incorrect");
    //       setIsLoading(false);

    //       return;
    //     }
    //   } else {
    //     toast.error("Invalid Pincode");
    //     setIsLoading(false);

    //     return;
    //   }
    // } catch (error) {
    //   console.error(
    //     "Error retrieving city and state information:",
    //     error.message
    //   );
    //   toast.error("Error retrieving city and state information");
    //   setIsLoading(false);

    //   return;
    // }
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("street", street);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("zipcode", zipcode);
    formData.append("type", typeSelected);
    formData.append("appt_no", appt_no);
    formData.append("shared_with", shared_with);
    formData.append("tot_ppl_in_appt", tot_ppl_in_appt);
    formData.append("no_of_bed", no_of_bed);
    formData.append("no_of_bath", no_of_bath);
    formData.append("sublease_start_date", sublease_start_date);
    formData.append("sublease_end_date", sublease_end_date);
    formData.append("rent", rent);
    formData.append("notes", editorContent);
    formData.append("phone", phoneNumber);
    formData.append("isWhatsappNumber", isWhatAppNumber);
    formData.append("gender", gender);
    formData.append("diet", diet);

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("imageUrls", selectedFiles[i]);
    }

    mixpanel.track("New Post Try", formData);

    setIsLoading(true);
    // document.getElementById("footer").classList.add("fixed-bottom");

    // setIsAnimationVisible(true);

    // animationInstance.play();

    axios
      .post(baseUrl + "/api/v1/subleaseit/adpost", formData, {
        headers: {
          // set content type for images to be sent
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        //
        // setIsAnimationVisible(false);
        // animationInstance.destroy();
        //set the to show on button after every 3 seconds to the next value in the array to show on button

        var id = res.data.data;
        navigate("/subleaseposts/" + id);
        toast.success("Congrats! Your ad is live now.");

        mixpanel.track("post created", formData);
        setIsLoading(false);
      })
      .catch((err) => {
        setCurrentIndex(0);

        toast.error(err.response.data[0]);
        setIsFormSubmitting(false);

        mixpanel.track("post update failed", formData);
        // setIsAnimationVisible(false);
        // animationInstance.destroy();
        // document.getElementById("footer").classList.remove("fixed-bottom");

        setIsLoading(false);
      });
  };

  const [zipcode, setZipcode] = useState("");

  const handlezipChange = (e) => {
    // Add a check to allow only 5 digits for zipcode and show a message to the user that max 5 digits are allowed for zipcode. If the user enters more than 5 digits and a hyphen, then allow up to four more digits after the hyphen.
    var zip = e.target.value;
    if (zip.length > 5 && zip[5] !== "-") {
      setCurrentIndex(0);
      toast.error("Max 5 digits are allowed for zipcode");
      setIsFormSubmitting(false);

      return;
    } else if (zip.length > 6 && zip[5] === "-" && zip.length > 11) {
      setCurrentIndex(0);
      toast.error("Max 10 digits are allowed for phone number");
      setIsFormSubmitting(false);

      return;
    } else {
      //
      setZipcode(e.target.value);
    }
  };

  const handlePhoneNumberChange = (value) => {
    // Convert the value to a string to ensure it's always a string
    const stringValue = value ?? "";

    //CHECK IF THE PHONE NUMBER LENGTH IS MORE LESS THAN 15 DIGITS OR NOT
    if (stringValue.length > 16) {
      setCurrentIndex(0);
      toast.error("Max 16 digits are allowed for phone number");
      setIsFormSubmitting(false);

      return;
    }
    //
    // If the phone number is possible, update the state
    setPhoneNumber(stringValue);
  };

  return (
    <>
      <NavScrollExample />
      <div className="App ">
        {/* {!isAnimationVisible && ( */}
        <div className="row d-flex justify-content-center mx-2">
          <div
            className="card adpostmob"
            style={{
              padding: "56px",
              border: "none",
              // marginTop: "10px",
              // marginBottom: "15px",
            }}
          >
            <div
              className=" card header"
              style={{
                marginTop: "20px",
                paddingBottom: "10px",
                backgroundImage: "linear-gradient(to right, #520821 , #C12D22)",
              }}
            >
              <h4
                style={{
                  textAlign: "start",
                  color: "whitesmoke",
                  paddingTop: "10px",
                  paddingLeft: "10px",
                }}
              >
                Sublease Apartment Details
              </h4>
            </div>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <div className="row" style={{ marginTop: "30px" }}>
                <div className="col-md-6">
                  <h1>Step 1</h1>
                  <div className="mt-4">
                    {/* <div className="col-md-6"> */}
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        className="mb-4"
                        controlId="formBasic12"
                      >
                        <Form.Label>
                          Appartment No.
                          <span className="required"> * </span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="E.g. 27"
                          required
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        className="mb-4"
                        controlId="formBasic1"
                      >
                        <Form.Label>
                          Street Name <span className="required"> * </span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          required
                          placeholder="1234 Ellendale Pl"
                        />
                      </Form.Group>
                    </Row>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="formBasic2"
                      >
                        <Form.Label>
                          City <span className="required"> * </span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          required
                          placeholder="Los Angeles"
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="formBasic3"
                      >
                        <Form.Label>
                          State <span className="required"> * </span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          required
                          placeholder="California"
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="formBasic4"
                      >
                        <Form.Label>
                          Zipcode<span className="required"> * </span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          required
                          value={zipcode}
                          onChange={handlezipChange}
                          placeholder="90007"
                        />
                      </Form.Group>
                    </Row>
                    <hr></hr>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="formBasic18"
                      >
                        <Form.Label>
                          Sub Lease Start Date
                          <span className="required"> * </span>
                        </Form.Label>
                        <Form.Control type="date" placeholder="15" required />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="formBasic19"
                      >
                        <Form.Label>
                          Sub Lease End Date
                          <span className="required"> * </span>
                        </Form.Label>
                        <Form.Control
                          type="date"
                          placeholder=""
                          required
                          min={currentDate}
                        />
                      </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="formBasic11">
                      <Form.Label>
                        Rent($) per month
                        <span className="required"> * </span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        placeholder="E.g. 1200"
                        required
                      />
                    </Form.Group>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="formBasic16"
                      >
                        <Form.Label>
                          No of bedrooms
                          <span className="required"> * </span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          onWheel={(e) => e.target.blur()}
                          placeholder="E.g. 2"
                          required
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        className="mb-3"
                        controlId="formBasic17"
                      >
                        <Form.Label>
                          No of bathrooms
                          <span className="required"> * </span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          onWheel={(e) => e.target.blur()}
                          placeholder="E.g. 1"
                          required
                        />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="phoneNumberControlId"
                      >
                        <Form.Label>
                          Your phone number <b>(Optional)</b>
                        </Form.Label>

                        <PhoneInput
                          country="US"
                          placeholder="Enter phone number"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          style={{
                            borderRadius: "5px",
                            border: "1px solid #ced4da",
                            padding: "10px",
                            fontSize: "16px",
                          }}
                        />
                        {/* <Form.Control
                          type="text"
                          pattern="[+]?[0-9]+"
                          value={phoneNumber}
                          onChange={handleChange}
                          placeholder="E.g. +1 1234567890"
                        /> */}
                        {phoneNumber && (
                          <Form.Check
                            type="checkbox"
                            id="whatsappCheckbox"
                            className="d-flex align-items-center"
                          >
                            <Form.Check.Input
                              type="checkbox"
                              checked={isChecked}
                              onChange={handleCheckboxChange}
                            />
                            <Form.Check.Label
                              htmlFor="whatsappCheckbox"
                              className="m-2"
                            >
                              <FontAwesomeIcon icon={faHandPointLeft} /> Click
                              if above contact is on WhatsApp{" "}
                              <FontAwesomeIcon
                                icon={faWhatsapp}
                                style={{ color: "green" }}
                              />
                            </Form.Check.Label>
                          </Form.Check>
                        )}
                      </Form.Group>
                    </Row>
                  </div>
                </div>
                <div className="col-md-6">
                  <h1>Step 2</h1>
                  <div className="mt-4">
                    <Form.Group className="mb-3" controlId="formBasic13">
                      <Form.Label>
                        Sharing Type
                        <span className="required"> * </span>
                      </Form.Label>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          label="Private"
                          name="sharingType"
                          id="privateRadio"
                          value="Private"
                          onChange={handleTypeChange}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="Shared"
                          name="sharingType"
                          id="sharedRadio"
                          value="Shared"
                          onChange={handleTypeChange}
                        />
                      </div>
                    </Form.Group>
                    {type === "Shared" ? (
                      <Form.Group className="mb-3" controlId="formBasic14">
                        <Form.Label>
                          No. of people to share room with
                        </Form.Label>
                        <span className="required"> * </span>
                        <Form.Control
                          type="number"
                          onWheel={(e) => e.target.blur()}
                          placeholder="E.g. 2"
                          required
                        />
                      </Form.Group>
                    ) : null}

                    <Form.Group className="mb-3" controlId="formBasic15">
                      <Form.Label>
                        Total no. of people in apartment <b>(Optional)</b>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        placeholder="E.g. 4"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="gender">
                      <Form.Label>Gender Preference</Form.Label>
                      <span className="required"> * </span>
                      <div>
                        <Form.Check
                          inline
                          label="Male"
                          name="gender"
                          type="radio"
                          value="Male"
                          id="inline-gender-1"
                          checked={gender === "Male"}
                          onClick={(e) => {
                            setGender(e.target.value);
                          }}
                        />
                        <Form.Check
                          inline
                          label="Female"
                          name="gender"
                          type="radio"
                          value="Female"
                          id="inline-gender-2"
                          checked={gender === "Female"}
                          onClick={(e) => {
                            setGender(e.target.value);
                          }}
                        />
                        <Form.Check
                          inline
                          label="Others"
                          name="gender"
                          type="radio"
                          value="Others"
                          id="inline-gender-3"
                          checked={gender === "Others"}
                          onClick={(e) => {
                            setGender(e.target.value);
                          }}
                        />
                        <Form.Check
                          inline
                          label="No Preference"
                          name="gender"
                          type="radio"
                          value="No Preference"
                          id="inline-gender-4"
                          checked={gender === "No Preference"}
                          onClick={(e) => {
                            setGender(e.target.value);
                          }}
                        />
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="diet">
                      <Form.Label>Diet Preference</Form.Label>
                      <span className="required"> * </span>
                      <div>
                        <Form.Check
                          inline
                          label="Jain"
                          name="diet"
                          type="radio"
                          value="Jain"
                          id="inline-diet-1"
                          checked={diet === "Jain"}
                          onClick={(e) => {
                            setDiet(e.target.value);
                          }}
                        />
                        <Form.Check
                          inline
                          label="Veg"
                          name="diet"
                          type="radio"
                          id="inline-diet-2"
                          value="Veg"
                          checked={diet === "Veg"}
                          onClick={(e) => {
                            setDiet(e.target.value);
                          }}
                        />
                        <Form.Check
                          inline
                          label="Non-Veg"
                          name="diet"
                          type="radio"
                          value="Non-Veg"
                          id="inline-diet-3"
                          checked={diet === "Non-Veg"}
                          onClick={(e) => {
                            setDiet(e.target.value);
                          }}
                        />
                        <Form.Check
                          inline
                          label="No Preference"
                          name="diet"
                          type="radio"
                          id="inline-diet-4"
                          value="No Preference"
                          checked={diet === "No Preference"}
                          onClick={(e) => {
                            setDiet(e.target.value);
                          }}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasic20">
                      <Form.Label>
                        Upload Images<span className="required"> * </span>{" "}
                        <span className="text-muted">
                          (Max 5 photos upto 15 mb each)
                        </span>
                        <br />
                      </Form.Label>
                      <div>
                        <Form.Control
                          type="file"
                          name="images"
                          multiple
                          onChange={handleFileChange}
                          style={{ marginBottom: "10px" }}
                        />
                        {filesCount > 0 && (
                          <span>
                            {filesCount}{" "}
                            {filesCount > 1 ? (
                              <span>images selected.</span>
                            ) : (
                              <span>image selected.</span>
                            )}
                          </span>
                        )}
                      </div>
                      {/* <div style={{ overflowX: "auto" }}> */}
                      <Row
                        style={{
                          backgroundColor: "aliceblue",
                          borderRadius: 10,
                          marginBottom: "5px",
                          overflowX: "auto",
                          marginTop: "10px",
                        }}
                      >
                        {/* <div
                            className="d-flex"
                            style={{
                              flexWrap: "nowrap", // Prevent flex items from wrapping to next line
                            }}
                          > */}
                        {isImageUploading ? (
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              top: 0,
                              left: 0,
                              backgroundColor: "rgba(255, 255, 255, 0.5)",
                            }}
                          >
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              style={{ marginRight: "5px" }}
                            />
                            Uploading...
                          </div>
                        ) : null}
                        {selectedFiles.map((image, index) => (
                          // <div
                          //   className="col-md-4 position-relative"
                          //   key={index}
                          // >
                          <Col
                            sm={4}
                            md={6}
                            lg={4}
                            key={index}
                            style={{ position: "relative" }}
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              alt=""
                              style={{
                                width: "80%",
                                height: "auto",
                                marginTop: "15px",
                                // marginRight: "5px",
                                marginBottom: "15px",
                              }}
                            />
                            <button
                              type="button"
                              className="btn position-absolute cross-mob"
                              style={{
                                top: "-1px",
                                right: "23px",

                                // borderRadius: "50%",
                              }}
                              onClick={() => handleDeleteImage(index)}
                            >
                              <i
                                className="fa fa-times-circle"
                                style={{
                                  fontSize: "35px",
                                  color: "red",
                                  backgroundColor: "white",
                                  borderRadius: "60%",
                                  padding: "0px",
                                }}
                              ></i>
                            </button>
                          </Col>
                        ))}
                        {/* </div> */}
                      </Row>
                      {/* </div> */}
                      {filesCount >= 1 ? (
                        <i
                          className="bi bi-plus-square"
                          style={{
                            fontSize: "45px",
                            // color: "red",
                          }}
                          onClick={handlePlusClick}
                        ></i>
                      ) : null}
                    </Form.Group>
                    {/* <Form.Group className="mb-3" controlId="formBasic10"> */}
                    <Form.Label>
                      Additional Notes <b>(Optional)</b>
                    </Form.Label>
                    {/* <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="E.g. Discuss ameneties, attractions, selling point"
                      />
                    </Form.Group> */}
                    <ReactQuill
                      value={editorContent}
                      onChange={setEditorContent}
                      placeholder="E.g. Discuss ameneties, attractions, selling point"
                      className="custom-editor"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, 4, 5, 6, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["link"],
                          ["clean"],
                        ],
                      }}
                      formats={[
                        "header",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "list",
                        "bullet",
                        "link",
                      ]}
                    />

                    <Form.Group as={Row} className="mb-3 pt-2">
                      <Col sm={{ span: 0, offset: 9 }}>
                        <Button
                          variant="secondary"
                          disabled={isFormSubmitting}
                          type="submit"
                          size="lg"
                          style={{
                            // borderRadius: "15px 15px",
                            borderStyle: "none",
                            marginTop: "20px",
                            backgroundImage:
                              "linear-gradient(to right, #520821 , #C12D22)",
                            // fontSize: "20px",
                            // marginLeft: "250px",
                          }}
                        >
                          {isLoading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                style={{ marginRight: "5px" }}
                              />
                              {arrayToShow[currentIndex]}
                            </>
                          ) : (
                            // Show the button label when not loading
                            "Post Ad"
                          )}
                        </Button>
                      </Col>
                    </Form.Group>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
        {/* )} */}
        {/* <div
          className="mr-2"
          ref={animationContainerRef}
          id="animationContainer"
          style={{ display: isAnimationVisible ? "block" : "none" }} // Hide the animation initially
        ></div> */}
        <Footer></Footer>
      </div>
    </>
  );
}

export default AdPost;
