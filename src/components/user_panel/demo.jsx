import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert, Collapse, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../assets/css/userleftnav.css"
import UserHeader from "./UserHeader";
import UserLeftNav from "./UserLeftNav";
import { useAuth } from "../all_login/AuthContext";

const Courses = () => {
  // Device width state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Always call hooks at the top level
  const { user, accessToken, role, uniqueId } = useAuth();
  
  // Courses state
  const [courseData, setCourseData] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedSubModule, setExpandedSubModule] = useState(null);

  // Map role to course ID based on student class/role
  const getRoleBasedCourseId = () => {
    // Map roles to course IDs - adjust these based on your backend role names
    const roleToCourseMappings = {
      "10th-student": "COUR-001",
      "10th_student": "COUR-001",
      "12th-student": "COUR-002",
      "12th_student": "COUR-002",
      "student": "COUR-001", // default
    };
    
    return roleToCourseMappings[role?.toLowerCase()] || "COUR-001";
  };

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
    const fetchCourses = async () => {
      if (!accessToken || !role) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const courseId = getRoleBasedCourseId();
        
        const response = await axios.get(
          `https://brjobsedu.com/gyandhara/gyandhara_backend/api/course-module/?course_id=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.success) {
          setCourseData(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [accessToken, role]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const toggleSubModule = (subModuleId) => {
    setExpandedSubModule(expandedSubModule === subModuleId ? null : subModuleId);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "success";
      case "unpaid":
        return "warning";
      case "pending":
        return "info";
      default:
        return "secondary";
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

        <Container className="dashboard-box mt-3">
          {loading ? (
            <div className="profile-loading">
              <Spinner animation="border" variant="primary" />
              <p>Loading courses...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : !courseData ? (
            <Alert variant="info">No courses available at the moment.</Alert>
          ) : (
            <>
              {/* Course Header Card */}
              <Row className="mb-4">
                <Col>
                  <Card className="shadow-box">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col md={8}>
                          <h2>{courseData.course_name}</h2>
                          <p className="text-muted mb-3">{courseData.course_id}</p>
                          <div className="course-info">
                            <Badge bg={getStatusBadgeVariant(courseData.course_status)} className="me-2">
                              {courseData.course_status?.toUpperCase()}
                            </Badge>
                            {courseData.price && (
                              <Badge bg="info">
                                Price: ₹{courseData.price}
                              </Badge>
                            )}
                          </div>
                        </Col>
                        <Col md={4} className="text-md-end">
                          <div className="course-dates">
                            <p><strong>Start:</strong> {new Date(courseData.start_date).toLocaleDateString()}</p>
                            <p><strong>End:</strong> {new Date(courseData.end_date).toLocaleDateString()}</p>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Modules Section */}
              <Row>
                <Col>
                  <h4 className="mb-3">Course Modules</h4>
                  {courseData.modules && courseData.modules.length > 0 ? (
                    courseData.modules.map((module, moduleIndex) => (
                      <Card key={moduleIndex} className="shadow-box mb-3">
                        <Card.Header
                          className="cursor-pointer bg-light"
                          onClick={() => toggleModule(module.module_id)}
                          style={{ cursor: "pointer" }}
                        >
                          <Row className="align-items-center">
                            <Col>
                              <h5 className="mb-0">
                                {module.order}. {module.mod_title}
                              </h5>
                              <small className="text-muted">{module.mod_title_hindi}</small>
                            </Col>
                            <Col md={3}>
                              {module.video_link && (
                                <a 
                                  href={module.video_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-primary"
                                >
                                  Watch Video
                                </a>
                              )}
                            </Col>
                          </Row>
                        </Card.Header>

                        <Collapse in={expandedModule === module.module_id}>
                          <Card.Body>
                            {/* Sub Modules */}
                            {module.sub_modules && module.sub_modules.length > 0 && (
                              <div className="sub-modules-section">
                                <h6 className="mb-3">Sub Modules</h6>
                                {module.sub_modules
                                  .sort((a, b) => a.order - b.order)
                                  .map((subModule, subIndex) => (
                                    <Card key={subIndex} className="mb-3 bg-light">
                                      <Card.Header
                                        className="cursor-pointer"
                                        onClick={() => toggleSubModule(subModule.sub_module_id)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <Row className="align-items-center">
                                          <Col>
                                            <h6 className="mb-0">
                                              {subModule.order}. {subModule.sub_modu_title}
                                            </h6>
                                            <small className="text-muted">
                                              {subModule.sub_modu_title_hindi}
                                            </small>
                                          </Col>
                                          {subModule.image && (
                                            <Col md={2} className="text-end">
                                              <img
                                                src={subModule.image}
                                                alt={subModule.sub_modu_title}
                                                style={{ maxWidth: "60px", maxHeight: "60px" }}
                                              />
                                            </Col>
                                          )}
                                        </Row>
                                      </Card.Header>

                                      <Collapse in={expandedSubModule === subModule.sub_module_id}>
                                        <Card.Body className="bg-white">
                                          <p className="mb-2">
                                            <strong>Description:</strong> {subModule.sub_modu_description}
                                          </p>
                                          <p className="mb-3">
                                            <strong>Hindi Description:</strong> {subModule.sub_modu_description_hindi}
                                          </p>

                                          {/* Sub Module Content */}
                                          <div className="content-section mb-3">
                                            <h6>Content</h6>
                                            {subModule.sub_mod && subModule.sub_mod.length > 0 && (
                                              <div className="mb-3">
                                                <h6 className="text-primary">English</h6>
                                                <ul>
                                                  {subModule.sub_mod.map((content, contentIdx) => (
                                                    <li key={contentIdx}>
                                                      <strong>{content.title}</strong>: {content.description}
                                                    </li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}

                                            {subModule.sub_mod_hindi && subModule.sub_mod_hindi.length > 0 && (
                                              <div>
                                                <h6 className="text-danger">हिंदी</h6>
                                                <ul>
                                                  {subModule.sub_mod_hindi.map((content, contentIdx) => (
                                                    <li key={contentIdx}>
                                                      <strong>{content.title}</strong>: {content.description}
                                                    </li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}
                                          </div>
                                        </Card.Body>
                                      </Collapse>
                                    </Card>
                                  ))}
                              </div>
                            )}

                            {/* Exercises */}
                            {module.exercises && module.exercises.length > 0 && (
                              <div className="exercises-section mt-4">
                                <h6 className="mb-3">Exercises</h6>
                                {module.exercises.map((exercise, exIndex) => (
                                  <Card key={exIndex} className="mb-2">
                                    <Card.Body>
                                      <p className="mb-0">{exercise.title}</p>
                                    </Card.Body>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </Card.Body>
                        </Collapse>
                      </Card>
                    ))
                  ) : (
                    <Alert variant="info">No modules available for this course.</Alert>
                  )}
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Courses;