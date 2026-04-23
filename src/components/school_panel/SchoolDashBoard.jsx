import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, ListGroup, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../assets/css/userleftnav.css"

import { useAuth } from "../all_login/AuthContext";
import SchoolHeader from "./SchoolHeader";
import SchoolLeftNav from "./SchoolLeftNav";


const SchoolDashBoard = () => {
  // Device width state

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [queries, setQueries] = useState([]);
  // Always call hooks at the top level
  const { user, accessToken, uniqueId } = useAuth();
  // Service requests state
  const [serviceLoading, setServiceLoading] = useState(true);
  const [serviceError, setServiceError] = useState("");
  const [serviceRequests, setServiceRequests] = useState([]);
  // Enrollments state
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  const [enrollmentError, setEnrollmentError] = useState("");
  // Module progress state
  const [moduleProgress, setModuleProgress] = useState([]);
  const [moduleLoading, setModuleLoading] = useState(true);
  const [moduleError, setModuleError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
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

  // Fetch enrollments and module progress
  useEffect(() => {
    if (accessToken && uniqueId) {
      const fetchData = async () => {
        // Fetch enrollments
        try {
          setEnrollmentLoading(true);
          console.log('Fetching enrollments for school_uni_id:', uniqueId);
          const enrollmentResponse = await axios.get(
            `https://brjobsedu.com/gyandhara/gyandhara_backend/api/enrollment-unpaid/?school_uni_id=${uniqueId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log('Enrollment API Response:', enrollmentResponse.data);
          if (enrollmentResponse.data.success) {
            setEnrollments(enrollmentResponse.data.data);
          } else {
            setEnrollmentError("API returned success: false");
          }
        } catch (err) {
          console.error('Enrollment API Error:', err);
          setEnrollmentError("Failed to fetch enrollments: " + err.message);
        } finally {
          setEnrollmentLoading(false);
        }

        // Fetch module progress
        try {
          setModuleLoading(true);
          console.log('Fetching module progress for school_uni_id:', uniqueId);
          const moduleResponse = await axios.get(
            `https://brjobsedu.com/gyandhara/gyandhara_backend/api/module-progress-unpaid/?school_uni_id=${uniqueId}`,
           {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log('Module Progress API Response:', moduleResponse.data);
          if (moduleResponse.data.success) {
            setModuleProgress(moduleResponse.data.data);
          } else {
            setModuleError("API returned success: false");
          }
        } catch (err) {
          console.error('Module Progress API Error:', err);
          setModuleError("Failed to fetch module progress: " + err.message);
        } finally {
          setModuleLoading(false);
        }
      };
      fetchData();
    } else {
      console.log('Missing accessToken or uniqueId:', { accessToken: !!accessToken, uniqueId });
    }
  }, [accessToken, uniqueId]);

  const toggleSidebar = () => {
    if (isMobile || isTablet) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
   
  <div className="dashboard-container">
    <SchoolLeftNav
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      isMobile={isMobile}
      isTablet={isTablet}
    />
    <div className="main-content-dash">
      <SchoolHeader toggleSidebar={toggleSidebar} />

      {/*  Add container with shadow */}
      <Container className="dashboard-box mt-3">
        <Row>
          <Col md={6} lg={4}>
            <Card className="shadow-box">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5>Total Students</h5>
                    {enrollmentLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : enrollmentError ? (
                      <p className="text-danger small">{enrollmentError}</p>
                    ) : (
                      <h3 className="text-primary">{enrollments.length}</h3>
                    )}
                  </div>
                  <Button variant="outline-primary" onClick={() => setShowDetails(!showDetails)}>
                    {showDetails ? 'Hide Details' : 'View Details'}
                  </Button>
                </div>
                {/* Simple Graph */}
                <div className="mt-3">
                  <div className="progress" style={{ height: '20px' }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${Math.min(enrollments.length * 10, 100)}%` }}
                      aria-valuenow={enrollments.length}
                      aria-valuemin="0"
                      aria-valuemax="10"
                    >
                      {enrollments.length}
                    </div>
                  </div>
                  <small className="text-muted">Enrollment Progress</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Expandable Details Section */}
        {showDetails && (
          <Row className="mt-3">
            <Col>
              <Card className="shadow-box">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5>Enrolled Students</h5>
                  <Button variant="outline-secondary" onClick={() => setShowModuleModal(true)}>
                    View Module Progress
                  </Button>
                </Card.Header>
                <Card.Body>
                  {enrollmentLoading ? (
                    <Spinner animation="border" />
                  ) : enrollments.length > 0 ? (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Student Name</th>
                          <th>Course</th>
                          <th>Enrolled Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollments.map((enrollment, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{enrollment.student_name}</td>
                            <td>{enrollment.course_name}</td>
                            <td>{new Date(enrollment.enrolled_at).toLocaleDateString()}</td>
                            <td>
                              {enrollment.is_completed ? (
                                <span className="text-success">
                                  Completed<br />
                                  <small>{new Date(enrollment.completed_at).toLocaleDateString()}</small>
                                </span>
                              ) : (
                                <span className="text-warning">In Progress</span>
                              )}
                            </td>
                            <td>
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => {
                                  setSelectedStudentId(enrollment.student_id);
                                  setSelectedEnrollment(enrollment);
                                  setShowModuleModal(true);
                                }}
                              >
                                View Progress
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p>No enrollments found.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Module Progress Modal */}
        <Modal show={showModuleModal} onHide={() => { setShowModuleModal(false); setSelectedStudentId(null); setSelectedEnrollment(null); }} size="lg">
          <Modal.Header>
            <Modal.Title>Student Details & Progress</Modal.Title>
            <Button
              variant="light"
              className="close-btn-custom"
              onClick={() => { setShowModuleModal(false); setSelectedStudentId(null); setSelectedEnrollment(null); }}
            >
              <span aria-hidden="true">&times;</span>
            </Button>
          </Modal.Header>
          <Modal.Body>
            {selectedEnrollment && (
              <div className="mb-4">
                <h5>Student Information</h5>
                <Table striped bordered hover size="sm">
                  <tbody>
                    <tr>
                      <td><strong>Student ID:</strong></td>
                      <td>{selectedEnrollment.student_id}</td>
                    </tr>
                    <tr>
                      <td><strong>Student Name:</strong></td>
                      <td>{selectedEnrollment.student_name}</td>
                    </tr>
                    <tr>
                      <td><strong>Course:</strong></td>
                      <td>{selectedEnrollment.course_name}</td>
                    </tr>
                    <tr>
                      <td><strong>Enrolled Date:</strong></td>
                      <td>{new Date(selectedEnrollment.enrolled_at).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td><strong>Status:</strong></td>
                      <td>
                        {selectedEnrollment.is_completed ? (
                          <span className="text-success">
                            Completed on {new Date(selectedEnrollment.completed_at).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-warning">In Progress</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            )}

            <h5>Module Progress</h5>
            {moduleLoading ? (
              <Spinner animation="border" />
            ) : moduleError ? (
              <p className="text-danger">{moduleError}</p>
            ) : (() => {
              const filteredProgress = selectedStudentId
                ? moduleProgress.filter(progress => progress.student_id === selectedStudentId)
                : moduleProgress;

              return filteredProgress.length > 0 ? (
                <>
                  <div className="bar-chart mb-4">
                    {filteredProgress.map((progress, index) => (
                      <div key={index} className="bar-item">
                        <div className="bar-container">
                          <div
                            className="bar"
                            style={{ height: `${progress.test_score}%` }}
                          ></div>
                        </div>
                        <small>Mod {index + 1}</small>
                      </div>
                    ))}
                  </div>
                  <ListGroup>
                    {filteredProgress.map((progress, index) => (
                      <ListGroup.Item key={index}>
                        <strong>Module {progress.module}</strong> - Score: {progress.test_score}%
                        <br />
                        <small>Status: {progress.module_status} | Attempts: {progress.attempt_count}</small>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </>
              ) : (
                <p>No module progress found for this student.</p>
              );
            })()}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModuleModal(false); setSelectedStudentId(null); setSelectedEnrollment(null); }}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

    </div>
  </div>
);
    

};

export default SchoolDashBoard;