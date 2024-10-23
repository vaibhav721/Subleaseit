import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useState } from "react";
import FormData from "form-data";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/adpost.css";
import { useParams } from "react-router-dom";
import Footer from "../components/footer";
import NavScrollExample from "../components/Navbar";
//import mixpanel from "../components/mixpanelInit";
import ReactQuill from "react-quill";
import heic2any from "heic2any";
import Spinner from "react-bootstrap/Spinner";

function MyPostEdit() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [type, setType] = useState("");
  const [subPost, setSubPost] = useState({});
  const [spinnerActive, setSpinnerActive] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [mapAddressSelected, setMapAddressSelected] = useState(false);
  const [showImageField, setShowImageField] = useState(false);
  const [isRoomPrivate, setIsRoomPrivate] = useState(true);
  const [streetSplit, setStreetSplit] = useState("");
  const privateRadioRef = useRef(null);
  const sharedRadioRef = useRef(null);
  const [genderE, editGender] = useState("");
  const [dietE, editDiet] = useState("");
  const [editorContent, setEditorContent] = useState("");
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
  const [isLoading, setIsLoading] = useState(false);

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
  var city = "";
  var state = "";
  var zipcode = "";
  var street = "";
  const fileArray = [];

  const handleFileChange = async (e) => {
    const files = e.target.files;

    if (files.length > 5) {
      setCurrentIndex(0);
      setIsFormSubmitting(false);
      toast.error("You can upload a maximum of 5 images.");
      e.target.value = ""; // Clear the file input value
      return;
    }

    //check the file size of each file and if it is more than 15 mb, then show an error message and return from the function
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 15000000) {
        setCurrentIndex(0);
        setIsFormSubmitting(false);
        toast.error("Max image size allowed is 15 mb");
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
        setIsFormSubmitting(false);
        toast.error("Only JPG, JPEG, PNG, HEIC and GIF files are allowed");
        e.target.value = ""; // Clear the file input value
        return;
      }
      if (fileExtension === "heic") {
        try {
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
          setIsFormSubmitting(false);
          toast.error("Error uploading HEIC image.");
          // console.error("Error converting HEIC to JPEG:", error);
        }
      } else {
        // for (let i = 0; i < files.length; i++) {
        fileArray.push(files[i]);
      }
    }
    setIsImageUploading(false);

    setSelectedFiles(fileArray);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  async function getSubleasePost() {
    try {
      const res = await axios.get(baseUrl + "/api/v1/subleaseit/adpost/" + id, {
        withCredentials: true,
      });
      // 

      const sub = (await res) && res.data;
      // 
      setSubPost(sub);
      const streetTemp = (await sub) && sub.street;
      // 
      const streetSplitTemp = (await streetTemp) && streetTemp.split(",");
      // 
      setStreetSplit(streetSplitTemp);
      setEditorContent((await sub) && sub.notes);
      editGender((await sub) && sub.gender);
      editDiet((await sub) && sub.diet);

      if (sub.type === "Private") {
        privateRadioRef.current.setAttribute("checked", true);
        setType("Private");
      } else {
        sharedRadioRef.current.setAttribute("checked", true);
        setType("Shared");
      }
    } catch (err) {
      setCurrentIndex(0);
      // 
    } finally {
      setSpinnerActive(false);
    }
  }
  street = streetSplit[0];
  city = streetSplit[1];
  state = streetSplit[2];
  zipcode = streetSplit[3];
  // 
  // 
  useEffect(() => {
    getSubleasePost();
  }, []);

  const handleImageFieldToggle = () => {
    setShowImageField(!showImageField);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 

    const street = e.target.elements.formBasic1.value;

    const city = e.target.elements.formBasic2.value;
    const state = e.target.elements.formBasic3.value;
    const zipcode = e.target.elements.formBasic4.value;
    const typeSelected = type;
    const appt_no = e.target.elements.formBasic12.value;
    const shared_with = e.target.elements.formBasic14.value;
    const tot_ppl_in_appt = e.target.elements.formBasic15.value;
    const no_of_bed = e.target.elements.formBasic16.value;
    const no_of_bath = e.target.elements.formBasic17.value;
    const sublease_start_date = e.target.elements.formBasic18.value;
    const sublease_end_date = e.target.elements.formBasic19.value;
    const rent = e.target.elements.formBasic11.value;

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
    formData.append("gender", genderE);
    formData.append("diet", dietE);

    if (
      !street ||
      !city ||
      !state ||
      !zipcode ||
      !appt_no ||
      !sublease_start_date ||
      !sublease_end_date ||
      !rent ||
      !genderE ||
      !dietE
    ) {
      setCurrentIndex(0);
      setIsFormSubmitting(false);
      toast.error("Please fill in all required fields.");
      return;
    }

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("imageUrls", selectedFiles[i]);
    }

    setIsLoading(true);

    axios
      .post(baseUrl + "/api/v1/subleaseit/adpost/" + id + "/edit", formData, {
        headers: {
          // set content type for images to be sent
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        // 
        // 
        navigate("/subleaseposts/" + id);
        toast.success("Ad Changed Successfully!");
        // mixpanel.track("post edited", formData);
        setIsLoading(false);
      })
      .catch((err) => {
        // 
        // 
        if (err.response && err.response.status === 404) {
          setCurrentIndex(0);
          setIsFormSubmitting(false);
          toast.error("Session expired. Please login again.");
          return;
        }
        setCurrentIndex(0);
        setIsFormSubmitting(false);
        // toast.error("Oops! Something went wrong.");
        setIsLoading(false);

        // mixpanel.track("post edit failed", formData);
        // toast.error("Oops! Something went wrong.");
      });
  };
  return (
    <>
      <NavScrollExample />
      <div className="App m-3 p-2">
        <h1 style={{ textAlign: "center" }}>Edit Apartment Details</h1>
        <div class="row d-flex justify-content-center">
          <div
            class="card adpostmob"
            style={{
              width: "80%",
              margin: "auto",
              padding: "26px",
              marginTop: "10px",
              marginBottom: "15px",
            }}
          >
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Row className="mb-3">
                <Form.Group as={Col} className="mb-4" controlId="formBasic12">
                  <Form.Label>Appartment No.</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="E.g. 27"
                    defaultValue={subPost.appt_no}
                  />
                </Form.Group>
                <Form.Group as={Col} className="mb-4" controlId="formBasic1">
                  <Form.Label>Street Name</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={street}
                    placeholder="1234 Ellendale Pl"
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} className="mb-3" controlId="formBasic2">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={city}
                    placeholder="Los Angeles"
                  />
                </Form.Group>
                <Form.Group as={Col} className="mb-3" controlId="formBasic3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={state}
                    placeholder="California"
                  />
                </Form.Group>
                <Form.Group as={Col} className="mb-3" controlId="formBasic4">
                  <Form.Label>Zipcode</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={zipcode}
                    // value={zipcode}
                    // onChange={handlezipChange}
                    placeholder="90007"
                  />
                </Form.Group>
              </Row>
              <hr></hr>

              <div className="d-flex justify-content-between">
                <Form.Group className="mb-3" controlId="formBasic13">
                  <Form.Label>Sharing Type</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Private"
                      name="sharingType"
                      id="privateRadio"
                      value="Private"
                      ref={privateRadioRef}
                      onChange={handleTypeChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Shared"
                      name="sharingType"
                      id="sharedRadio"
                      value="Shared"
                      ref={sharedRadioRef}
                      onChange={handleTypeChange}
                    />
                  </div>
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
                      checked={genderE === "Male"}
                      onClick={(e) => {
                        editGender(e.target.value);
                      }}
                    />
                    <Form.Check
                      inline
                      label="Female"
                      name="gender"
                      type="radio"
                      value="Female"
                      id="inline-gender-2"
                      checked={genderE === "Female"}
                      onClick={(e) => {
                        editGender(e.target.value);
                      }}
                    />
                    <Form.Check
                      inline
                      label="Others"
                      name="gender"
                      type="radio"
                      value="Others"
                      id="inline-gender-3"
                      checked={genderE === "Others"}
                      onClick={(e) => {
                        editGender(e.target.value);
                      }}
                    />
                    <Form.Check
                      inline
                      label="No Preference"
                      name="gender"
                      type="radio"
                      value="No Preference"
                      id="inline-gender-4"
                      checked={genderE === "No Preference"}
                      onClick={(e) => {
                        editGender(e.target.value);
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
                      checked={dietE === "Jain"}
                      onClick={(e) => {
                        editDiet(e.target.value);
                      }}
                    />
                    <Form.Check
                      inline
                      label="Veg"
                      name="diet"
                      type="radio"
                      id="inline-diet-2"
                      value="Veg"
                      checked={dietE === "Veg"}
                      onClick={(e) => {
                        editDiet(e.target.value);
                      }}
                    />
                    <Form.Check
                      inline
                      label="Non-Veg"
                      name="diet"
                      type="radio"
                      value="Non-Veg"
                      id="inline-diet-3"
                      checked={dietE === "Non-Veg"}
                      onClick={(e) => {
                        editDiet(e.target.value);
                      }}
                    />
                    <Form.Check
                      inline
                      label="No Preference"
                      name="diet"
                      type="radio"
                      id="inline-diet-4"
                      value="No Preference"
                      checked={dietE === "No Preference"}
                      onClick={(e) => {
                        editDiet(e.target.value);
                      }}
                    />
                  </div>
                </Form.Group>
              </div>

              <Form.Group className="mb-3" controlId="formBasic14">
                <Form.Label>No. of people to share room with</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 2"
                  defaultValue={subPost.shared_with}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasic15">
                <Form.Label>Total no. of people in apartment</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 4"
                  defaultValue={subPost.tot_ppl_in_appt}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasic16">
                <Form.Label>No of bedrooms</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 2"
                  defaultValue={subPost.no_of_bed}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasic17">
                <Form.Label>No of bathrooms</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 1"
                  defaultValue={subPost.no_of_bath}
                />
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col} className="mb-3" controlId="formBasic18">
                  <Form.Label>Sub Lease Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="15"
                    defaultValue={subPost.sublease_start_date}
                  />
                </Form.Group>

                <Form.Group as={Col} className="mb-3" controlId="formBasic19">
                  <Form.Label>Sub Lease End Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder=""
                    defaultValue={subPost.sublease_end_date}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </Form.Group>
              </Row>

              <Form.Group className="mb-3" controlId="formBasic11">
                <Form.Label>Rent($) per month</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g. 1200"
                  defaultValue={subPost.rent}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasic10">
                {/* <Form.Label>Additional Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="e.g. Discuss ameneties, attractions, selling point"
                  defaultValue={subPost.notes}
                /> */}
                <Form.Label>Additional Notes (Optional)</Form.Label>
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
              </Form.Group>

              <div className="mb-2">Existing Images</div>
              <Row
                style={{
                  backgroundColor: "aliceblue",
                  borderRadius: 10,
                  marginBottom: "5px",
                }}
              >
                {subPost.imageUrls &&
                  JSON.parse(subPost.imageUrls) &&
                  JSON.parse(subPost.imageUrls).map((image, index) => (
                    <Col sm={4} md={6} lg={4} key={index}>
                      {process.env.REACT_APP_ENV === "production" ? (
                        <img
                          className="d-block w-100 carousel-image"
                          src={`${image}`}
                          style={{
                            borderRadius: 10,
                            width: "80%",
                            height: "auto",
                            marginTop: "15px",
                            // marginRight: "5px",
                            marginBottom: "15px",
                          }}
                          alt="Apartment images"
                        />
                      ) : (
                        <img
                          style={{
                            borderRadius: 10,
                            width: "80%",
                            height: "auto",
                            marginTop: "15px",
                            // marginRight: "5px",
                            marginBottom: "15px",
                          }}
                          className="d-block w-100 carousel-image"
                          src={
                            baseUrl +
                            `/${image
                              .replace("static/", "public/")
                              .replace(/\\/g, "/")}`
                          }
                          alt="Apartment images"
                        />
                      )}
                    </Col>
                  ))}
              </Row>

              <Button
                variant="outline-dark mt-1 mb-3 small"
                onClick={handleImageFieldToggle}
                size="sm"
              >
                Replace Existing images?
              </Button>

              {showImageField && (
                <Form.Group className="mb-3" controlId="formBasic20">
                  <hr />
                  <Form.Label>
                    Upload Images
                    <br />
                    <span className="red-color-text">
                      <b>
                        Images shown above are already uploaded, these images
                        will be replaced if you choose new images again!
                      </b>
                    </span>
                  </Form.Label>

                  <Form.Control
                    type="file"
                    name="images"
                    multiple
                    onChange={handleFileChange}
                  />
                  <Row
                    style={{
                      marginTop: "10px",
                      backgroundColor: "aliceblue",
                      borderRadius: 10,
                      marginBottom: "5px",
                    }}
                  >
                    {/* <div className="row"> */}
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
                      // <div className="col-md-4">
                      <Col sm={4} md={6} lg={4} key={index}>
                        <img
                          src={URL.createObjectURL(image)}
                          alt=""
                          style={{
                            borderRadius: 10,
                            width: "80%",
                            height: "auto",
                            marginTop: "15px",
                            // marginRight: "5px",
                            marginBottom: "15px",
                          }}
                        />
                      </Col>
                      // </div>
                    ))}
                    {/* </div> */}
                  </Row>
                </Form.Group>
              )}

              <Form.Group as={Row} className="mb-3">
                <Col sm={{ span: 0, offset: 5 }}>
                  <Button
                    variant="outline-primary"
                    color="red"
                    type="submit"
                    style={{
                      marginTop: "20px",
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
                      "Save Changes"
                    )}
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default MyPostEdit;
