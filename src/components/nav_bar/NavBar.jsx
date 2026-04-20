import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import "../../assets/css/navbar.css"
import gyandharaLogo from "../../assets/images/gyandharalogo.jpeg";

function NavBar() {
  return (
    <Navbar expand="lg" fixed="top" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo-wrapper">
          <img 
            src={gyandharaLogo} 
            alt="Gyandhara Logo" 
            className="navbar-logo"
          />
          <span className="brand-text">
            Gyan<span className="brand-highlight">Dhara</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler-custom">
          <span className="toggler-line"></span>
          <span className="toggler-line"></span>
          <span className="toggler-line"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-links">
            <Nav.Link as={Link} to="/" className="nav-link-item">
              <span className="nav-link-dot"></span>
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="#" className="nav-link-item">
              <span className="nav-link-dot"></span>
              About Us
            </Nav.Link>

            <Nav.Link as={Link} to="/login" className="nav-link-item">
              <span className="nav-link-dot"></span>
              Login
            </Nav.Link>

            <Nav.Link as={Link} to="/StudentRegistration" className="register-btn">
              Register Now
              <span className="register-btn-arrow">→</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;