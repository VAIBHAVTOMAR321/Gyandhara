import React, { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useLanguage } from "../all_login/LanguageContext";
import "../../assets/css/navbar.css"
import gyandharaLogo from "../../assets/images/gyandharalogo.png";

function NavBar() {
  const [expanded, setExpanded] = useState(false);
  const { language, setLanguage } = useLanguage();

  return (
    <Navbar expand="lg" expanded={expanded} onToggle={setExpanded} fixed="top" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo-wrapper">
          <img 
            src={gyandharaLogo} 
            alt="Gyandhara Logo" 
            className="navbar-logo"
          />
          {/* <span className="brand-text">
            Gyan<span className="brand-highlight">Dhara</span>
          </span> */}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler-custom">
          <span className="toggler-line"></span>
          <span className="toggler-line"></span>
          <span className="toggler-line"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-links">
            <Nav.Link as={Link} to="/" className="nav-link-item" onClick={() => setExpanded(false)}>
              <span className="nav-link-dot"></span>
              {language === 'hi' ? 'होम' : 'Home'}
            </Nav.Link>

            {/* <Nav.Link as={Link} to="/about" className="nav-link-item" onClick={() => setExpanded(false)}>
              <span className="nav-link-dot"></span>
              About Us
            </Nav.Link> */}

            <Nav.Link as={Link} to="/login" className="nav-link-item" onClick={() => setExpanded(false)}>
              <span className="nav-link-dot"></span>
              {language === 'hi' ? 'लॉगिन' : 'Login'}
            </Nav.Link>

            <Nav.Link as={Link} to="/StudentRegistration" className="register-btn" onClick={() => setExpanded(false)}>
              {language === 'hi' ? 'अभी पंजीकरण करें' : 'Register Now'}
              <span className="register-btn-arrow">→</span>
            </Nav.Link>

            <Button 
              variant="outline-primary" 
              size="sm" 
              className="ms-lg-3 mt-2 mt-lg-0 language-toggle-btn"
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              style={{ borderRadius: '20px', fontWeight: 'bold' }}
            >
              <i className="bi bi-translate me-1"></i>
              {language === 'en' ? 'हिन्दी' : 'English'}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;