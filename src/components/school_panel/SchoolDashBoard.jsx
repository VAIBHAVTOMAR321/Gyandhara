import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Modal,
  ListGroup,
  Table,
  Badge,
  Form,
  ProgressBar,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../assets/css/userleftnav.css";
import {
  FaUsers,
  FaUser,
  FaCheckCircle,
  FaClock,
  FaLayerGroup,
  FaBook,
  FaChartBar,
  FaChartPie,
  FaFilter,
  FaEye,
  FaLightbulb,
  FaSortAmountDown,
  FaSortAmountDownAlt,
  FaGraduationCap,
  FaTasks,
  FaCalendarCheck,
} from "react-icons/fa";

import { useAuth } from "../all_login/AuthContext";
import SchoolHeader from "./SchoolHeader";
import SchoolLeftNav from "./SchoolLeftNav";

const SchoolDashBoard = () => {
  // Device width state

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      return width >= 1024;
    }
    return true;
  });
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
  // Analytics state
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [analyticsStatusFilter, setAnalyticsStatusFilter] = useState("all");

  // Calculate analytics from enrollment data
  const calculateAnalytics = (enrollmentData, moduleData) => {
    if (!enrollmentData || enrollmentData.length === 0) {
      return {
        total: 0,
        uniqueStudents: 0,
        completed: 0,
        ongoing: 0,
        classDist: [],
        courseDist: [],
        avgModuleScore: 0,
      };
    }

    const filtered =
      analyticsStatusFilter === "all"
        ? enrollmentData
        : analyticsStatusFilter === "completed"
          ? enrollmentData.filter((e) => e.is_completed)
          : enrollmentData.filter((e) => !e.is_completed);

    const total = filtered.length;
    const completed = filtered.filter((e) => e.is_completed).length;
    const ongoing = total - completed;

    // Unique students
    const uniqueStudents = new Set(
      filtered.filter((e) => e.student_id).map((e) => e.student_id),
    ).size;

    // Class distribution
    const classMap = {};
    filtered.forEach((e) => {
      const cls = String(e.class_name || "Unknown");
      classMap[cls] = (classMap[cls] || 0) + 1;
    });
    const classDist = Object.entries(classMap)
      .sort(([, a], [, b]) => b - a)
      .map(([cls, count]) => [cls, count]);

    // Course distribution
    const courseMap = {};
    filtered.forEach((e) => {
      const course = e.course_name || "Unknown Course";
      courseMap[course] = (courseMap[course] || 0) + 1;
    });
    const courseDist = Object.entries(courseMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([course, count]) => [course, count]);

    // Average module score
    const avgModuleScore =
      moduleData && moduleData.length > 0
        ? Math.round(
            moduleData.reduce((sum, m) => sum + (m.test_score || 0), 0) /
              moduleData.length,
          )
        : 0;

    return {
      total,
      uniqueStudents,
      completed,
      ongoing,
      classDist,
      courseDist,
      avgModuleScore,
    };
  };

  const analytics = calculateAnalytics(enrollments, moduleProgress);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch enrollments and module progress
  useEffect(() => {
    if (accessToken && uniqueId) {
      const fetchData = async () => {
        // Fetch enrollments
        try {
          setEnrollmentLoading(true);
          console.log("Fetching enrollments for school_uni_id:", uniqueId);
          const enrollmentResponse = await axios.get(
            `https://brjobsedu.com/gyandhara/gyandhara_backend/api/enrollment-unpaid/?school_uni_id=${uniqueId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          console.log("Enrollment API Response:", enrollmentResponse.data);
          if (enrollmentResponse.data.success) {
            setEnrollments(enrollmentResponse.data.data);
          } else {
            setEnrollmentError("API returned success: false");
          }
        } catch (err) {
          console.error("Enrollment API Error:", err);
          setEnrollmentError("Failed to fetch enrollments: " + err.message);
        } finally {
          setEnrollmentLoading(false);
        }

        // Fetch module progress
        try {
          setModuleLoading(true);
          console.log("Fetching module progress for school_uni_id:", uniqueId);
          const moduleResponse = await axios.get(
            `https://brjobsedu.com/gyandhara/gyandhara_backend/api/module-progress-unpaid/?school_uni_id=${uniqueId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          console.log("Module Progress API Response:", moduleResponse.data);
          if (moduleResponse.data.success) {
            setModuleProgress(moduleResponse.data.data);
          } else {
            setModuleError("API returned success: false");
          }
        } catch (err) {
          console.error("Module Progress API Error:", err);
          setModuleError("Failed to fetch module progress: " + err.message);
        } finally {
          setModuleLoading(false);
        }
      };
      fetchData();
    } else {
      console.log("Missing accessToken or uniqueId:", {
        accessToken: !!accessToken,
        uniqueId,
      });
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
          <Row className="mb-4 align-items-center">
            <Col>
              <h4 className="font-weight-bold">School Dashboard</h4>
              <p className="text-muted mb-0">
                Manage student enrollments and track progress
              </p>
            </Col>
            <Col className="text-end"></Col>
          </Row>

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
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? "Hide Details" : "View Details"}
                    </Button>
                  </div>
                  {/* Simple Graph */}
                  <div className="mt-3">
                    <div className="progress" style={{ height: "20px" }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                          width: `${Math.min(enrollments.length * 10, 100)}%`,
                        }}
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
                    {/* <Button
                      variant="outline-secondary"
                      onClick={() => setShowModuleModal(true)}
                    >
                      View Module Progress
                    </Button> */}
                    <Button
                      variant="primary"
                      onClick={() => setShowAnalyticsModal(true)}
                      className="d-flex align-items-center ms-auto"
                    >
                      <FaChartBar className="me-2" /> View Analytics
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
                              <td>
                                {new Date(
                                  enrollment.enrolled_at,
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                {enrollment.is_completed ? (
                                  <span className="text-success">
                                    Completed
                                    <br />
                                    <small>
                                      {new Date(
                                        enrollment.completed_at,
                                      ).toLocaleDateString()}
                                    </small>
                                  </span>
                                ) : (
                                  <span className="text-warning">
                                    In Progress
                                  </span>
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
                                  View Analysis
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
          <Modal
            show={showModuleModal}
            onHide={() => {
              setShowModuleModal(false);
              setSelectedStudentId(null);
              setSelectedEnrollment(null);
            }}
            size="xl"
            centered
            className="progress-analysis-modal"
          >
            <Modal.Header
              closeButton
              className="bg-gradient text-white py-1 px-3"
              style={{
                background:
                  "linear-gradient(135deg, #2c3e50 0%, #000000 100%)",
              }}
            >
              <Modal.Title className="d-flex align-items-center gap-2 fs-6">
                <FaGraduationCap className="me-2" />
                Student Details & Progress Analysis
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-2">
              {selectedEnrollment && (
                <div
                  className="mb-2 p-2 rounded"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="fw-bold text-primary mb-0 d-flex align-items-center gap-2 small">
                      <FaUser className="text-info" />
                      Student Profile
                    </h6>
                    <Badge
                      bg={
                        selectedEnrollment.is_completed ? "success" : "warning"
                      }
                      className="py-1 px-2"
                      style={{ fontSize: '9px' }}
                    >
                      {selectedEnrollment.is_completed
                        ? "COMPLETED"
                        : "IN PROGRESS"}
                    </Badge>
                  </div>
                  <Row className="g-3 align-items-center">
                    <Col md={1} className="text-center">
                      <div
                        className="rounded-circle mx-auto"
                        style={{
                          width: "45px",
                          height: "45px",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        {selectedEnrollment.student_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "S"}
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-muted extra-small text-uppercase fw-bold mb-0">Name</div>
                      <div className="fw-bold mb-0 text-dark extra-small">{selectedEnrollment.student_name}</div>
                      <div className="text-muted extra-small mt-1">ID: <span className="text-primary fw-bold">{selectedEnrollment.student_id}</span></div>
                    </Col>
                    <Col md={4}>
                      <div className="text-muted extra-small text-uppercase fw-bold mb-0">Enrolled Course</div>
                      <div className="fw-bold mb-0 text-info extra-small"><FaBook className="me-1" />{selectedEnrollment.course_name}</div>
                      <div className="text-muted extra-small mt-1">Date: {new Date(selectedEnrollment.enrolled_at).toLocaleDateString()}</div>
                    </Col>
                    <Col md={4} className="text-md-end">
                      <div className="d-inline-block text-start">
                        <div className="text-muted extra-small text-uppercase fw-bold">Completion</div>
                        <div className="d-flex align-items-center gap-2">
                          <ProgressBar 
                            now={selectedEnrollment.is_completed ? 100 : 50} 
                            variant={selectedEnrollment.is_completed ? "success" : "warning"}
                            style={{ height: '6px', width: '80px' }}
                          />
                          <span className="fw-bold extra-small">{selectedEnrollment.is_completed ? '100%' : '50%'}</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}

              <h6 className="fw-bold text-primary d-flex align-items-center gap-2 mb-0 extra-small">
                <FaChartBar className="text-info" size={12} />
                Module Progress Analytics
              </h6>
              <p className="text-muted extra-small mb-2">
                Detailed breakdown of all module performance and completion
                metrics
              </p>

              {moduleLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="text-muted mt-3">
                    Loading module progress data...
                  </p>
                </div>
              ) : moduleError ? (
                <Alert variant="danger">{moduleError}</Alert>
              ) : (
                (() => {
                  const filteredProgress = selectedStudentId
                    ? moduleProgress.filter(
                        (progress) => progress.student_id === selectedStudentId,
                      )
                    : moduleProgress;

                  if (!filteredProgress || filteredProgress.length === 0) {
                    return (
                      <Alert variant="info" className="text-center py-4">
                        <FaLightbulb className="me-2" />
                        No module progress found for this student.
                      </Alert>
                    );
                  }

                  // Calculate statistics
                  const totalModules = filteredProgress.length;
                  const completedModules = filteredProgress.filter(
                    (p) => p.module_status === "completed",
                  ).length;
                  const inProgressModules = totalModules - completedModules;
                  
                  const scoredModules = filteredProgress.filter(p => p.test_score !== null && p.test_score !== undefined);
                  const avgScore =
                    scoredModules.length > 0 
                    ? Math.round(
                      scoredModules.reduce(
                        (sum, m) => sum + (m.test_score || 0),
                        0,
                      ) / scoredModules.length,
                    ) : 0;
                    
                  const passedModules = filteredProgress.filter(
                    (p) => p.test_status === "passed",
                  ).length;
                  const passRate =
                    Math.round((passedModules / totalModules) * 100) || 0;
                  
                  const maxScore = scoredModules.length > 0 
                    ? Math.max(...scoredModules.map((p) => p.test_score)) : 0;
                  
                  const minScore = scoredModules.length > 0 
                    ? Math.min(...scoredModules.map((p) => p.test_score)) : 0;

                  // Sort by score for better visualization
                  const sortedProgress = [...filteredProgress].sort(
                    (a, b) => (b.test_score || 0) - (a.test_score || 0),
                  );

                  return (
                    <>
                      {/* Statistics Cards */}
                      <Row className="g-1 mb-2">
                        <Col xs={6} sm={3}>
                          <Card className="shadow-sm border-0 h-100">
                            <Card.Body className="text-center py-2">
                              <div className="rounded-circle bg-primary bg-opacity-10 p-1 mb-1 d-inline-flex">
                                <FaBook className="text-primary" size={12} />
                              </div>
                              <h5 className="fw-bold text-primary mb-0 small">
                                {totalModules}
                              </h5>
                              <div className="text-muted extra-small">
                                Total Modules
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col xs={6} sm={3}>
                          <Card className="shadow-sm border-0 h-100">
                            <Card.Body className="text-center py-2">
                              <div className="rounded-circle bg-success bg-opacity-10 p-1 mb-1 d-inline-flex">
                                <FaCheckCircle className="text-success" size={12} />
                              </div>
                              <h5 className="fw-bold text-success mb-0 small">
                                {completedModules}
                              </h5>
                              <div className="text-muted extra-small">
                                Completed
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col xs={6} sm={3}>
                          <Card className="shadow-sm border-0 h-100">
                            <Card.Body className="text-center py-2">
                              <div className="rounded-circle bg-success bg-opacity-10 p-1 mb-1 d-inline-flex">
                                <FaGraduationCap className="text-success" size={12} />
                              </div>
                              <h5 className="fw-bold text-success mb-0 small">
                                {passRate}%
                              </h5>
                              <div className="text-muted extra-small">Pass Rate</div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col xs={6} sm={3}>
                          <Card className="shadow-sm border-0 h-100">
                            <Card.Body className="text-center py-2">
                              <div className="rounded-circle bg-info bg-opacity-10 p-1 mb-1 d-inline-flex">
                                <FaTasks className="text-info" size={12} />
                              </div>
                              <h5 className="fw-bold text-info mb-0 small">
                                {inProgressModules}
                              </h5>
                              <div className="text-muted extra-small">
                                In Progress
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      {/* Overall Progress & Score Analysis */}
                      <Row className="g-2 mb-2">
                        <Col md={7}>
                          <Card className="shadow-sm border-0 h-100">
                            <Card.Header className="bg-light py-1">
                              <h6 className="mb-0 fw-bold extra-small">
                                <FaCalendarCheck className="me-1" size={10} />
                                Completion Progress
                              </h6>
                            </Card.Header>
                            <Card.Body className="py-1">
                              <div className="text-center mb-2">
                                <div
                                  className="position-relative d-inline-block"
                                  style={{ width: "65px", height: "65px" }}
                                >
                                  <svg
                                    width="65"
                                    height="65"
                                    viewBox="0 0 120 120"
                                  >
                                    <circle
                                      cx="60"
                                      cy="60"
                                      r="50"
                                      fill="none"
                                      stroke="#e9ecef"
                                      strokeWidth="12"
                                    />
                                    <circle
                                      cx="60"
                                      cy="60"
                                      r="50"
                                      fill="none"
                                      stroke={
                                        passRate >= 75
                                          ? "#28a745"
                                          : passRate >= 50
                                          ? "#ffc107"
                                          : "#dc3545"
                                      }
                                      strokeWidth="12"
                                      strokeDasharray={`${
                                        (passRate / 100) * 314.16
                                      } ${314.16}`}
                                      transform="rotate(-90 60 60)"
                                      style={{
                                        transition: "stroke-dasharray 0.5s",
                                      }}
                                    />
                                    <text
                                      x="60"
                                      y="60"
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                      fontSize="20"
                                      fontWeight="bold"
                                      fill="#333"
                                    >
                                      {passRate}%
                                    </text>
                                  </svg>
                                </div>
                                <div className="mt-1">
                                  <div className="fw-bold text-primary mb-0 extra-small">
                                    Module Pass Rate
                                  </div>
                                  <p className="text-muted extra-small mb-0">
                                    {passedModules} of {totalModules} modules
                                    passed
                                  </p>
                                </div>
                              </div>
                              <div className="row align-items-center mt-3">
                                <div className="col-8">
                                  <div className="d-flex justify-content-between mb-1">
                                    <span className="extra-small text-muted">
                                      Avg. Score
                                    </span>
                                    <span className="fw-bold extra-small">
                                      {avgScore}%
                                    </span>
                                  </div>
                                  <ProgressBar
                                    now={avgScore}
                                    variant={
                                      avgScore >= 75
                                        ? "success"
                                        : avgScore >= 50
                                        ? "warning"
                                        : "danger"
                                    }
                                    className="rounded-pill"
                                    style={{ height: "6px" }}
                                  />
                                </div>
                                <Col className="mt-3 mt-md-0">
                                  <div className="d-flex gap-3">
                                    <div className="text-center">
                                      <div className="fw-bold text-success small">
                                        {maxScore}%
                                      </div>
                                      <div className="extra-small text-muted">
                                        Best Score
                                      </div>
                                    </div>
                                    <div className="text-center">
                                      <div className="fw-bold text-danger small">
                                        {minScore}%
                                      </div>
                                      <div className="extra-small text-muted">
                                        Lowest Score
                                      </div>
                                    </div>
                                  </div>
                                </Col>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={5}>
                          <Card className="shadow-sm border-0 h-100">
                            <Card.Header className="bg-light py-1">
                              <h6 className="mb-0 fw-bold extra-small">Status Split</h6>
                            </Card.Header>
                            <Card.Body className="py-1">
                              <div
                                className="d-flex justify-content-center"
                                style={{ height: "80px" }}
                              >
                                <svg
                                  width="80"
                                  height="80"
                                  viewBox="0 0 140 140"
                                >
                                  <circle
                                    cx="70"
                                    cy="70"
                                    r="55"
                                    fill="none"
                                    stroke="#e9ecef"
                                    strokeWidth="20"
                                  />
                                  {completedModules > 0 && (
                                    <circle
                                      cx="70"
                                      cy="70"
                                      r="55"
                                      fill="none"
                                      stroke="#28a745"
                                      strokeWidth="20"
                                      strokeDasharray={`${
                                        (completedModules / totalModules) * 345.58
                                      } 345.58`}
                                      transform="rotate(-90 70 70)"
                                    />
                                  )}
                                  {inProgressModules > 0 && (
                                    <circle
                                      cx="70"
                                      cy="70"
                                      r="55"
                                      fill="none"
                                      stroke="#ffc107"
                                      strokeWidth="20"
                                      strokeDasharray={`${
                                        (inProgressModules / totalModules) *
                                        345.58
                                      } 345.58`}
                                      transform="rotate(-90 70 70)"
                                      strokeDashoffset={
                                        -(completedModules / totalModules) *
                                        345.58
                                      }
                                    />
                                  )}
                                  <text
                                    x="70"
                                    y="70"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="12"
                                    fontWeight="bold"
                                    fill="#333"
                                  >
                                    {totalModules}
                                    <tspan
                                      x="70"
                                      dy="14"
                                      fontSize="10"
                                      fill="#6c757d"
                                    >
                                      modules
                                    </tspan>
                                  </text>
                                </svg>
                              </div>
                              <div className="d-flex gap-2 justify-content-center mt-2">
                                <div className="d-flex align-items-center gap-1">
                                  <span
                                    className="rounded"
                                    style={{ width: "6px", height: "6px", background: "#28a745" }}
                                  ></span>
                                  <small className="extra-small text-muted">
                                    {completedModules} Completed
                                  </small>
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                  <span
                                    className="rounded"
                                    style={{ width: "6px", height: "6px", background: "#ffc107" }}
                                  ></span>
                                  <small className="extra-small text-muted">
                                    {inProgressModules} In Progress
                                  </small>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      {/* Module Score Bar Chart */}
                      <Card className="shadow-sm border-0 mb-2">
                        <Card.Header className="bg-light py-1">
                          <h6 className="mb-0 fw-bold extra-small">
                            <FaChartBar className="me-1" size={10} />
                            Module Score Overview
                          </h6>
                        </Card.Header>
                        <Card.Body className="py-1">
                          <div
                            className="d-flex align-items-end justify-content-center gap-1"
                            style={{
                              height: "100px",
                              paddingBottom: "10px",
                              flexWrap: "wrap",
                            }}
                          >
                            {sortedProgress.map((progress, index) => {
                              const barColor =
                                progress.test_status === "passed"
                                  ? progress.test_score >= 80
                                    ? "#28a745"
                                    : "#ffc107"
                                  : "#dc3545";
                              return (
                                <div
                                  key={index}
                                  className="d-flex flex-column align-items-center"
                                  style={{ flex: "1 1 40px", minWidth: "36px" }}
                                >
                                  <div
                                    className="text-end w-100 pr-1 mb-1"
                                    style={{ fontSize: "9px" }}
                                  >
                                    <strong>{progress.test_score}%</strong>
                                  </div>
                                  <div
                                    className="rounded-top"
                                    title={`Module ${progress.module} - ${progress.module_status} - ${progress.test_score}%${
                                      progress.attempt_count > 1
                                        ? ` (${progress.attempt_count} attempts)`
                                        : ""
                                    }`}
                                    style={{
                                      height: `${Math.max(
                                        20,
                                        (progress.test_score * 180) / 100,
                                      )}px`,
                                      width: "100%",
                                      background: barColor,
                                      minHeight: "20px",
                                      borderRadius: "4px 4px 0 0",
                                      transition: "height 0.3s",
                                      cursor: "pointer",
                                    }}
                                  ></div>
                                  <small
                                    className="text-muted mt-1 fw-bold"
                                    style={{ fontSize: "9px" }}
                                  >
                                    M{progress.module}
                                  </small>
                                </div>
                              );
                            })}
                          </div>
                          <div className="d-flex justify-content-center gap-3 mt-1 flex-wrap">
                            <div className="d-flex align-items-center gap-1">
                              <span
                                className="rounded"
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  background: "#28a745",
                                }}
                              ></span>
                              <small className="extra-small text-muted">
                                High (&ge;80%)
                              </small>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <span
                                className="rounded"
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  background: "#ffc107",
                                }}
                              ></span>
                              <small className="extra-small text-muted">
                                Passed (&lt;80%)
                              </small>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <span
                                className="rounded"
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  background: "#dc3545",
                                }}
                              ></span>
                              <small className="extra-small text-muted">
                                Failed
                              </small>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>

                      {/* Detailed Module List */}
                      <Card className="shadow-sm border-0">
                        <Card.Header className="d-flex justify-content-between align-items-center bg-light py-1">
                          <h6 className="mb-0 fw-bold d-flex align-items-center gap-2 extra-small">
                            <FaTasks className="text-info" size={10} />
                            Module Details
                            <Badge bg="secondary" style={{ fontSize: '8px' }}>{totalModules}</Badge>
                          </h6>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="outline-secondary"
                              size="sm"
                              id="sort-dropdown"
                              style={{ fontSize: '10px' }}
                            >
                              <FaSortAmountDown className="me-1" />
                              Sort
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() =>
                                  filteredProgress.sort(
                                    (a, b) =>
                                      (b.test_score || 0) - (a.test_score || 0),
                                  )
                                }
                              >
                                Score (High to Low)
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() =>
                                  filteredProgress.sort(
                                    (a, b) =>
                                      (a.test_score || 0) - (b.test_score || 0),
                                  )
                                }
                              >
                                Score (Low to High)
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Card.Header>
                        <ListGroup variant="flush">
                          {sortedProgress.map((progress, index) => {
                            const statusColor =
                              progress.test_status === "passed"
                                ? "success"
                                : progress.test_status === "failed"
                                ? "danger"
                                : "warning";
                            const scoreColor =
                              progress.test_score >= 80
                                ? "success"
                                : progress.test_score >= 50
                                ? "warning"
                                : "danger";

                            return (
                              <ListGroup.Item
                                key={index}
                                className="border-0 border-bottom py-2"
                              >
                                <Row className="align-items-center">
                                  <Col xs={12} md={5} className="mb-2 mb-md-0">
                                    <div className="d-flex align-items-center gap-2">
                                      <div
                                        className="rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                          width: "24px",
                                          height: "24px",
                                          background:
                                            statusColor === "success"
                                              ? "#d4edda"
                                              : statusColor === "danger"
                                              ? "#f8d7da"
                                              : "#fff3cd",
                                        }}
                                      >
                                        <strong
                                          className="mb-0"
                                          style={{
                                            fontSize: '11px',
                                            color:
                                              statusColor === "success"
                                                ? "#155724"
                                                : statusColor === "danger"
                                                ? "#721c24"
                                                : "#856404",
                                          }}
                                        >
                                          M{progress.module}
                                        </strong>
                                      </div>
                                      <div className="ms-2">
                                        <div className="fw-bold small">
                                          Module {progress.module}
                                        </div>
                                        <div className="text-muted extra-small">
                                          Status:{" "}
                                          <Badge
                                            bg={statusColor}
                                            className="text-uppercase"
                                            style={{ fontSize: '8px' }}
                                          >
                                            {progress.module_status}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  </Col>
                                  <Col xs={12} md={4} className="mb-2 mb-md-0">
                                    <div className="d-flex align-items-center gap-2">
                                      <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between mb-1">
                                          <div className="extra-small text-muted">
                                            Test Score
                                          </div>
                                          <strong
                                            className={
                                              scoreColor === "success"
                                                ? "text-success"
                                                : scoreColor === "danger"
                                                ? "text-danger"
                                                : "text-warning"
                                            }
                                            style={{ fontSize: '11px' }}
                                          >
                                            {progress.test_score}%
                                          </strong>
                                        </div>
                                        <ProgressBar
                                          now={progress.test_score}
                                          variant={scoreColor}
                                          className="rounded-pill"
                                          style={{ height: "6px" }}
                                        />
                                      </div>
                                    </div>
                                     <div className="text-muted extra-small mt-1 d-block">
                                       Attempts: {progress.attempt_count}
                                     </div>
                                  </Col>
                                  <Col xs={12} md={3} className="text-md-end">
                                    <div className="d-flex flex-column gap-1">
                                      {progress.test_status === "passed" ? (
                                        <span className="text-success extra-small fw-bold">
                                          <FaCheckCircle className="me-1" /> Passed
                                        </span>
                                      ) : progress.test_status === "failed" ? (
                                        <span className="text-danger extra-small fw-bold">
                                          <FaTimesCircle className="me-1" /> Failed
                                        </span>
                                      ) : (
                                        <span className="text-muted extra-small fw-bold">
                                          <FaClock className="me-1" /> Pending
                                        </span>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            );
                          })}
                        </ListGroup>
                      </Card>
                    </>
                  );
                })()
              )}
            </Modal.Body>
            <Modal.Footer className="bg-light">
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setShowModuleModal(false);
                  setSelectedStudentId(null);
                  setSelectedEnrollment(null);
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Analytics Modal */}
          <Modal
            show={showAnalyticsModal}
            onHide={() => setShowAnalyticsModal(false)}
            size="lg"
            centered
          >
            <Modal.Header
              closeButton
              className="bg-gradient text-white"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <Modal.Title className="d-flex align-items-center gap-2">
                <FaChartBar className="me-2" /> School Analytics Dashboard
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              {(() => {
                const completionRate =
                  analytics.total > 0
                    ? Math.round((analytics.completed / analytics.total) * 100)
                    : 0;

                return (
                  <div>
                    {/* Header Actions */}
                    <div className="mb-4">
                      <h4 className="mb-1 fw-bold text-primary">
                        Analytics Overview
                      </h4>
                      <p className="text-muted small mb-3">
                        Comprehensive enrollment progress and module performance
                        analysis
                      </p>
                    </div>

                    {/* Status Filter */}
                    <Row className="mb-4">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            <FaFilter className="me-1" /> Filter by Status:
                          </Form.Label>
                          <Form.Select
                            value={analyticsStatusFilter}
                            onChange={(e) =>
                              setAnalyticsStatusFilter(e.target.value)
                            }
                            className="form-select-sm"
                          >
                            <option value="all">All Enrollments</option>
                            <option value="completed">Completed Only</option>
                            <option value="ongoing">Ongoing Only</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            <FaChartBar className="me-1" /> Completion Rate:
                          </Form.Label>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="progress flex-grow-1"
                              style={{ height: "24px", borderRadius: "12px" }}
                            >
                              <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${completionRate}%` }}
                              >
                                {completionRate}%
                              </div>
                            </div>
                            <Badge
                              bg={
                                completionRate >= 75
                                  ? "success"
                                  : completionRate >= 50
                                    ? "warning"
                                    : "danger"
                              }
                              className="fs-6"
                            >
                              {completionRate >= 75
                                ? "Excellent"
                                : completionRate >= 50
                                  ? "Good"
                                  : "Needs Improvement"}
                            </Badge>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Summary Cards */}
                    <Row className="g-3 mb-4">
                      <Col xs={12} sm={4}>
                        <Card className="shadow-sm border-0 h-100">
                          <Card.Body className="text-center py-4">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-3 mb-2 d-inline-flex">
                              <FaUsers className="text-primary fs-2" />
                            </div>
                            <h2 className="fw-bold text-primary mb-0">
                              {analytics.uniqueStudents}
                            </h2>
                            <p className="text-muted small mb-0 text-uppercase fw-bold">
                              Unique Students
                            </p>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col xs={12} sm={4}>
                        <Card className="shadow-sm border-0 h-100">
                          <Card.Body className="text-center py-4">
                            <div className="rounded-circle bg-success bg-opacity-10 p-3 mb-2 d-inline-flex">
                              <FaCheckCircle className="text-success fs-2" />
                            </div>
                            <h2 className="fw-bold text-success mb-0">
                              {analytics.completed}
                            </h2>
                            <p className="text-muted small mb-0 text-uppercase fw-bold">
                              Completed
                            </p>
                            <small className="text-success">
                              {completionRate}% enrollment completion rate
                            </small>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col xs={12} sm={4}>
                        <Card className="shadow-sm border-0 h-100">
                          <Card.Body className="text-center py-4">
                            <div className="rounded-circle bg-warning bg-opacity-10 p-3 mb-2 d-inline-flex">
                              <FaClock className="text-warning fs-2" />
                            </div>
                            <h2 className="fw-bold text-warning mb-0">
                              {analytics.ongoing}
                            </h2>
                            <p className="text-muted small mb-0 text-uppercase fw-bold">
                              Ongoing
                            </p>
                            <small className="text-warning">
                              {100 - completionRate}% enrollments still in
                              progress
                            </small>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    {/* Status Distribution Chart */}
                    <Card className="shadow-sm border-0 mb-4">
                      <Card.Header className="bg-light">
                        <h6 className="mb-0 fw-bold">
                          <FaChartPie className="me-2" /> Completion Status
                          Distribution
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <div className="row align-items-center">
                          <div className="col-md-6">
                            <div
                              className="d-flex justify-content-center position-relative"
                              style={{ height: "200px" }}
                            >
                              {/* Donut chart using SVG */}
                              <svg
                                width="200"
                                height="200"
                                viewBox="0 0 200 200"
                                className="mx-auto"
                              >
                                <circle
                                  cx="100"
                                  cy="100"
                                  r="80"
                                  fill="#e9ecef"
                                />
                                <circle
                                  cx="100"
                                  cy="100"
                                  r="80"
                                  fill="none"
                                  stroke="#28a745"
                                  strokeWidth="40"
                                  strokeDasharray={`${(completionRate / 100) * 502.65} ${502.65}`}
                                  transform="rotate(-90 100 100)"
                                />
                                <circle
                                  cx="100"
                                  cy="100"
                                  r="80"
                                  fill="none"
                                  stroke="#ffc107"
                                  strokeWidth="40"
                                  strokeDasharray={`${((100 - completionRate) / 100) * 502.65} ${502.65}`}
                                  transform="rotate(-90 100 100)"
                                  strokeDashoffset={`-${(completionRate / 100) * 502.65}`}
                                />
                                <text
                                  x="100"
                                  y="100"
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fontSize="24"
                                  fontWeight="bold"
                                  fill="#333"
                                >
                                  {completionRate}%
                                </text>
                              </svg>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="d-flex flex-column gap-3">
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2">
                                  <div
                                    className="rounded bg-success"
                                    style={{ width: "20px", height: "20px" }}
                                  ></div>
                                  <span className="fw-bold">Completed</span>
                                </div>
                                <div className="text-end">
                                  <h4 className="fw-bold text-success mb-0">
                                    {analytics.completed}
                                  </h4>
                                  <small className="text-muted">
                                    {analytics.total > 0
                                      ? Math.round(
                                          (analytics.completed /
                                            analytics.total) *
                                            100,
                                        )
                                      : 0}
                                    % of enrollments
                                  </small>
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2">
                                  <div
                                    className="rounded bg-warning"
                                    style={{ width: "20px", height: "20px" }}
                                  ></div>
                                  <span className="fw-bold">Ongoing</span>
                                </div>
                                <div className="text-end">
                                  <h4 className="fw-bold text-warning mb-0">
                                    {analytics.ongoing}
                                  </h4>
                                  <small className="text-muted">
                                    {analytics.total > 0
                                      ? Math.round(
                                          (analytics.ongoing /
                                            analytics.total) *
                                            100,
                                        )
                                      : 0}
                                    % of enrollments
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* Class & Course Distribution */}
                    <Row className="g-3 mb-4">
                      <Col md={6}>
                        <Card className="shadow-sm border-0 h-100">
                          <Card.Header className="bg-info text-white">
                            <h6 className="mb-0 fw-bold">
                              <FaLayerGroup className="me-2" /> Distribution by
                              Class
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            {analytics.classDist.length > 0 ? (
                              <div className="d-flex flex-column gap-2">
                                {analytics.classDist.map(([cls, count]) => {
                                  const percentage =
                                    analytics.uniqueStudents > 0
                                      ? Math.round(
                                          (count / analytics.uniqueStudents) *
                                            100,
                                        )
                                      : 0;
                                  return (
                                    <div
                                      key={cls}
                                      className="border-bottom pb-2"
                                    >
                                      <div className="d-flex justify-content-between align-items-center mb-1">
                                        <Badge bg="info" className="fs-6">
                                          Class {cls}
                                        </Badge>
                                        <span className="fw-bold">
                                          {count} students
                                        </span>
                                      </div>
                                      <div
                                        className="progress"
                                        style={{
                                          height: "8px",
                                          borderRadius: "4px",
                                        }}
                                      >
                                        <div
                                          className="progress-bar bg-info"
                                          style={{ width: `${percentage}%` }}
                                        ></div>
                                      </div>
                                      <small className="text-muted">
                                        {percentage}% of enrollments
                                      </small>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-muted text-center py-3 mb-0">
                                No class data available
                              </p>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="shadow-sm border-0 h-100">
                          <Card.Header
                            className="text-white"
                            style={{ backgroundColor: "#6f42c1" }}
                          >
                            <h6 className="mb-0 fw-bold">
                              <FaBook className="me-2" /> Top Courses
                            </h6>
                          </Card.Header>
                          <Card.Body>
                            {analytics.courseDist.length > 0 ? (
                              <div className="d-flex flex-column gap-2">
                                {analytics.courseDist.map(
                                  ([course, count], idx) => {
                                    const percentage =
                                      analytics.total > 0
                                        ? Math.round(
                                            (count / analytics.total) * 100,
                                          )
                                        : 0;
                                    return (
                                      <div
                                        key={course}
                                        className="border-bottom pb-2"
                                      >
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                          <span
                                            className="fw-bold small text-truncate"
                                            style={{ maxWidth: "120px" }}
                                            title={course}
                                          >
                                            {idx + 1}. {course}
                                          </span>
                                          <span className="fw-bold">
                                            {count} enrollments
                                          </span>
                                        </div>
                                        <div
                                          className="progress"
                                          style={{
                                            height: "8px",
                                            borderRadius: "4px",
                                          }}
                                        >
                                          <div
                                            className="progress-bar"
                                            style={{
                                              width: `${percentage}%`,
                                              backgroundColor: "#6f42c1",
                                            }}
                                          ></div>
                                        </div>
                                        <small className="text-muted">
                                          {percentage}% of total enrollments
                                        </small>
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            ) : (
                              <p className="text-muted text-center py-3 mb-0">
                                No course data available
                              </p>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    {/* Module Performance */}
                    <Card className="shadow-sm border-0">
                      <Card.Header className="bg-secondary text-white">
                        <h6 className="mb-0 fw-bold">
                          <FaChartBar className="me-2" /> Module Performance
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={4}>
                            <div className="text-center p-3 border rounded">
                              <h3 className="fw-bold text-success mb-0">
                                {analytics.avgModuleScore}%
                              </h3>
                              <p className="text-muted small mb-0">
                                Average Module Score
                              </p>
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="text-center p-3 border rounded">
                              <h3 className="fw-bold text-info mb-0">
                                {moduleProgress.length}
                              </h3>
                              <p className="text-muted small mb-0">
                                Total Module Attempts
                              </p>
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="text-center p-3 border rounded">
                              <h3 className="fw-bold text-warning mb-0">
                                {moduleProgress.length > 0
                                  ? Math.round(
                                      (moduleProgress.filter(
                                        (m) => m.test_status === "passed",
                                      ).length /
                                        moduleProgress.length) *
                                        100,
                                    )
                                  : 0}
                                %
                              </h3>
                              <p className="text-muted small mb-0">
                                Module Pass Rate
                              </p>
                            </div>
                          </Col>
                        </Row>
                        {moduleProgress.length > 0 && (
                          <div className="mt-4">
                            <h6 className="fw-bold mb-3">Score Distribution</h6>
                            <div className="bar-chart">
                              <div
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  justifyContent: "center",
                                  alignItems: "flex-end",
                                  height: "150px",
                                }}
                              >
                                {moduleProgress
                                  .slice(0, 10)
                                  .map((progress, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          height: `${progress.test_score}%`,
                                          width: "30px",
                                          backgroundColor:
                                            progress.test_status === "passed"
                                              ? "#28a745"
                                              : "#ffc107",
                                          borderRadius: "4px 4px 0 0",
                                          minHeight: "10px",
                                        }}
                                        title={`${progress.test_score}%`}
                                      ></div>
                                      <small
                                        style={{
                                          marginTop: "4px",
                                          fontSize: "10px",
                                        }}
                                      >
                                        M{progress.module}
                                      </small>
                                    </div>
                                  ))}
                              </div>
                            </div>
                            <small className="text-muted d-block text-center mt-2">
                              Showing first 10 modules (Green = Passed, Yellow =
                              Ongoing)
                            </small>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </div>
                );
              })()}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowAnalyticsModal(false)}
              >
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
