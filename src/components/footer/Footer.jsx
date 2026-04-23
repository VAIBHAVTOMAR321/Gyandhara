import React from "react";
import { Link } from "react-router-dom";
import gyandharaLogo from "../../assets/images/gyandharalogo.jpeg";
import "../../assets/css/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          {/* Logo and Brand Section */}
          <div className="footer-brand-section">
            <div className="footer-logo-section">
              <img src={gyandharaLogo} alt="Gyandhara Logo" className="footer-logo" />
              <span className="footer-brand-text">
                Gyan<span className="brand-highlight">Dhara</span>
              </span>
            </div>
            <p className="footer-description">
              Your comprehensive educational platform delivering knowledge, career guidance, skill development, and academic excellence for students, schools, and administrators
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links-section">
            <h4 className="footer-section-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/login" className="footer-link">Login</Link></li>
              <li><Link to="/StudentRegistration" className="footer-link">Register</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-services-section">
            <h4 className="footer-section-title">Services</h4>
            <ul className="footer-links">
              <li><span className="footer-link-text">Career Guidance</span></li>
              <li><span className="footer-link-text">Government Schemes</span></li>
              <li><span className="footer-link-text">Grooming Classes</span></li>
              <li><span className="footer-link-text">Competitions</span></li>
              <li><span className="footer-link-text">Job Openings</span></li>
            </ul>
          </div>

          {/* Contact Info */}
           <div className="footer-services-section">
            <h4 className="footer-section-title">Contact Us</h4>
            <ul className="footer-links">
              <li><span className="footer-link-text">91-9876543210</span></li>
              <li><span className="footer-link-text">info@gyandhara.edu</span></li>
              <li><span className="footer-link-text">India</span></li>
            </ul>
          </div>
        
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 Gyandhara. All rights reserved. | Designed by BrainRock.
          </div>
          <div className="footer-social">
            {/* Add social media icons if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
