import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../all_login/AuthContext";
import "../../assets/css/userleftnav.css"
import UserHeader from "./UserHeader";
import UserLeftNav from "./UserLeftNav";
import "./UserProfile.css";

const UserProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      return width >= 1024;
    }
    return true;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  const { uniqueId, accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!uniqueId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://brjobsedu.com/gyandhara/gyandhara_backend/api/student-reg/?student_id=${uniqueId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.success) {
          setProfile(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [uniqueId, accessToken]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "status-approved";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-rejected";
      default:
        return "status-default";
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

        <Container fluid className="dashboard-box mt-3">
          {loading ? (
            <div className="profile-loading">
              <Spinner animation="border" variant="primary" />
              <p>Loading profile...</p>
            </div>
          ) : (
            <Row>
              <Col>
                <Card className="shadow-box mb-3">
                  <Card.Body className="profile-header-card">
                    <div className="profile-header-row">
                      <div className="profile-avatar">
                        {profile?.profile_picture ? (
                          <img src={profile.profile_picture} alt={profile.full_name} />
                        ) : (
                          <i className="bi bi-person-fill"></i>
                        )}
                      </div>
                      <div className="profile-info">
                        <h2>{profile?.full_name || "User"}</h2>
                        <p className="student-id">
                          <i className="bi bi-person-badge"></i>
                          {profile?.student_id}
                        </p>
                        <span className={`status-badge ${getStatusClass(profile?.status)}`}>
                          {profile?.status || "N/A"}
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {!loading && (
            <Row>
              <Col lg={8}>
                <Card className="shadow-box mb-3">
                  <Card.Body>
                    <h5 className="section-title">Personal Information</h5>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Full Name</label>
                        <span>{profile?.full_name || "-"}</span>
                      </div>
                      <div className="info-item">
                        <label>Aadhaar Number</label>
                        <span>{profile?.aadhaar_no || "-"}</span>
                      </div>
                      <div className="info-item">
                        <label>Phone</label>
                        <span>{profile?.phone || "-"}</span>
                      </div>
                      <div className="info-item">
                        <label>Email</label>
                        <span>{profile?.email || "-"}</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="shadow-box mb-3">
                  <Card.Body>
                    <h5 className="section-title">Academic Details</h5>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Class</label>
                        <span>{profile?.class_name || "-"}</span>
                      </div>
                      <div className="info-item">
                        <label>Associate Wing</label>
                        <span>{profile?.associate_wings || "-"}</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="shadow-box mb-3 location-card">
                  <Card.Body>
                    <h5 className="section-title">Location Details</h5>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>State</label>
                        <span>{profile?.state || "-"}</span>
                      </div>
                      <div className="info-item">
                        <label>District</label>
                        <span>{profile?.district || "-"}</span>
                      </div>
                      <div className="info-item">
                        <label>Block</label>
                        <span>{profile?.block || "-"}</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="shadow-box mb-3">
                  <Card.Body>
                    <h5 className="section-title">Account Info</h5>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Registered On</label>
                        <span>
                          {profile?.created_at
                            ? new Date(profile.created_at).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default UserProfile;