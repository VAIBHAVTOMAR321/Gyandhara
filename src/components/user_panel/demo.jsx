import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../assets/css/userleftnav.css"
import UserHeader from "./UserHeader";
import UserLeftNav from "./UserLeftNav";
import { useAuth } from "../all_login/AuthContext";



const demo = () => {
  // Device width state

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [queries, setQueries] = useState([]);
  // Always call hooks at the top level
  const { user, accessToken } = useAuth();
  // Service requests state
  const [serviceLoading, setServiceLoading] = useState(true);
  const [serviceError, setServiceError] = useState("");
  const [serviceRequests, setServiceRequests] = useState([]);
  // Fetch service requests for dashboard

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile || isTablet) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
   
  <div className="dashboard-container">
    <UserLeftNav
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      isMobile={isMobile}
      isTablet={isTablet}
    />
    <div className="main-content-dash">
      <UserHeader toggleSidebar={toggleSidebar} />

      {/*  Add container with shadow */}
      <Container className="dashboard-box mt-3">
        <Row>
          <Col>
            <Card className="shadow-box">
              <Card.Body>
                <h4>demo</h4>
                <p>Welcome to your demo</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

    </div>
  </div>
);
    

};

export default demo;