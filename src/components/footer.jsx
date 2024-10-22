import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faMeta,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import "../styles/components/footer.css";

function Footer(props) {
  return (
    <footer id="footer">
      <div className="footer-top">
        <div className="container" id="contact">
          <div className="row justify-content-start justify-content-md-between">
            <div className="col-lg-3 col-md-6 footer-contact">
              <h3>Contact Us</h3>
              <p>
                <strong>Email:</strong> subleaseit.help@gmail.com
                <br />
              </p>
            </div>

            <div className="col-lg-3 col-md-6 footer-social-media">
              {/* Add your code for social media icons */}
              <h3>SOCIAL MEDIA</h3>
              <p className="social-icons">
                <a
                  href="https://www.instagram.com/subleaseit/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faInstagram}
                    width={50}
                    size="2x"
                    style={{ color: "rgb(153, 0, 0)" }}
                  />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=100095174646349"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faMeta}
                    width={50}
                    size="2x"
                    style={{ color: "rgb(153, 0, 0)" }}
                  />
                </a>
                <a
                  href="https://www.linkedin.com/company/sublease-it"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    width={50}
                    size="2x"
                    style={{ color: "rgb(153, 0, 0)" }}
                  />
                </a>
              </p>
            </div>

            {/* <div className="col-lg-3 col-md-6 footer-links">
              <h3>IF NEED ONE MORE SECTION USE THIS</h3>
              <p>CONTENT HERE</p>
            </div> */}

            <div className="col-lg-3 col-md-6 footer-links">
              <h4>Note</h4>
              <p>
                While we exclusively serve University Students, exercise caution
                in all interactions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-bottom clearfix d-flex justify-content-between">
        <div className="credits">
          <span>Copyright © 2023</span>
          <span>
            {" "}
            <strong>Sublease it</strong>
          </span>
          . All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

export default Footer;
