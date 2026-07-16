import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Spinner,
  Row,
  Col,
  Card,
  Form,
  ProgressBar,
  Badge,
  Table,
  Modal,
  Button,
  Dropdown,
} from "react-bootstrap";
import AdminLeftNav from "./AdminLeftNav";
import AdminHeader from "./AdminHeader";
import "../../assets/css/admindashboard.css";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Legend,
  Cell,
} from "recharts";
import { useAuth } from "../all_login/AuthContext";


const Analysis = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      return width >= 1024;
    }
    return true;
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analysisType, setAnalysisType] = useState("course-wise");
  const [analyticsData, setAnalyticsData] = useState([]);
  const [courseSummary, setCourseSummary] = useState({});

  // New state for institution analytics
  const [institutionSummary, setInstitutionSummary] = useState({});
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const [selectedInstitutionSummary, setSelectedInstitutionSummary] = useState(null);

  const [showCourseStatusModal, setShowCourseStatusModal] = useState(false);
  const [selectedStudentForStatus, setSelectedStudentForStatus] = useState(null);


  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourseSummary, setSelectedCourseSummary] = useState(null);
  const [showOverallAnalysisModal, setShowOverallAnalysisModal] = useState(false);

  // New state for quiz institution analysis
  const [quizInstitutionSummary, setQuizInstitutionSummary] = useState({});
  const [showQuizInstitutionModal, setShowQuizInstitutionModal] = useState(false);
  const [selectedQuizInstitutionSummary, setSelectedQuizInstitutionSummary] = useState(null);

  // New state for quiz participant analysis
  const [quizParticipantData, setQuizParticipantData] = useState([]);
  const [showQuizAnalysisModal, setShowQuizAnalysisModal] = useState(false);
  const [selectedStudentForQuiz, setSelectedStudentForQuiz] = useState(null);

  // New state for quiz filter
  const [rawQuizData, setRawQuizData] = useState([]);
  const [quizItems, setQuizItems] = useState([]);
  const [quizTitleMap, setQuizTitleMap] = useState({});
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);


  const { accessToken } = useAuth();

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

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [courseResponse, quizResponse, quizItemsResponse] = await Promise.all([
            axios.get(
              "https://brjobsedu.com/gyandhara/gyandhara_backend/api/student/course-analytics/",
              { headers: { Authorization: `Bearer ${accessToken}` } }
            ),
            axios.get(
              "https://brjobsedu.com/gyandhara/gyandhara_backend/api/quiz-participants/",
              { headers: { Authorization: `Bearer ${accessToken}` } }
            ),
            axios.get(
              "https://brjobsedu.com/gyandhara/gyandhara_backend/api/quiz-items/",
              { headers: { Authorization: `Bearer ${accessToken}` } }
            ),
        ]);

        const studentData = courseResponse.data.results || [];
        setAnalyticsData(studentData);

        const fetchedQuizItems = quizItemsResponse.data?.data || quizItemsResponse.data || [];
        setQuizItems(fetchedQuizItems);

        const titleMap = {};
        if (Array.isArray(fetchedQuizItems)) {
            fetchedQuizItems.forEach(quiz => { titleMap[quiz.quiz_id] = quiz.title; });
        }
        setQuizTitleMap(titleMap);

        const fetchedRawQuizData = quizResponse.data.data || [];
        const processedQuizData = fetchedRawQuizData.reduce((acc, item) => {
          const studentId = item.student.student_id;
          if (!acc[studentId]) {
            acc[studentId] = { student: item.student, attempts: [] };
          }
          acc[studentId].attempts.push({ quiz_id: item.quiz_id, ...item.attempt[0] });
          return acc;
        }, {});
        setQuizParticipantData(Object.values(processedQuizData));
        setRawQuizData(fetchedRawQuizData);

        // New processing for quiz institution summary
        const quizInstSum = {};
        fetchedRawQuizData.forEach(item => {
            const schoolName = item.student.school_name;
            if (schoolName) {
                if (!quizInstSum[schoolName]) {
                    quizInstSum[schoolName] = {
                        name: schoolName,
                        participants: new Set(),
                        totalAttempts: 0,
                        totalScore: 0,
                    };
                }
                quizInstSum[schoolName].participants.add(item.student.student_id);
                if (item.attempt && item.attempt.length > 0) {
                    quizInstSum[schoolName].totalAttempts += item.attempt.length;
                    item.attempt.forEach(att => { quizInstSum[schoolName].totalScore += att.score || 0; });
                }
            }
        });

        // Process data for course summary cards
        const courseSum = {};
        const institutionSum = {};
        studentData.forEach((student) => {
          // Course-wise processing
          student.courses.forEach((course) => {
            if (!courseSum[course.course_id]) {
              courseSum[course.course_id] = {
                id: course.course_id,
                name: course.course_name,
                studentCount: 0,
                completedStudentCount: 0,
                totalModulesInCourse: course.modules.length,
              };
            }
            courseSum[course.course_id].studentCount++;
            const completedModules = course.modules.filter(
              (m) => m.module_status === "completed"
            ).length;
            if (completedModules === course.modules.length && course.modules.length > 0) {
              courseSum[course.course_id].completedStudentCount++;
            }
          });

          // Institution-wise processing
          if (student.school_name) {
            if (!institutionSum[student.school_name]) {
              institutionSum[student.school_name] = {
                name: student.school_name,
                studentCount: 0,
                completedStudentCount: 0,
              };
            }
            institutionSum[student.school_name].studentCount++;
            
            // A student is considered 'completed' for an institution if they completed ALL their courses.
            const allCoursesCompleted = student.courses.every(course => {
              const completedModules = course.modules.filter(m => m.module_status === "completed").length;
              return completedModules === course.modules.length && course.modules.length > 0;
            });

            if (student.courses.length > 0 && allCoursesCompleted) {
              institutionSum[student.school_name].completedStudentCount++;
            }
          }
        });
        setCourseSummary(courseSum);
        setInstitutionSummary(institutionSum);

        // Convert Set to count for quiz institution summary
        Object.keys(quizInstSum).forEach(key => {
            const summary = quizInstSum[key];
            summary.participantCount = summary.participants.size;
            summary.averageScore = summary.totalAttempts > 0 ? (summary.totalScore / summary.totalAttempts) : 0;
            delete summary.participants;
        });
        setQuizInstitutionSummary(quizInstSum);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [accessToken]);

  const filteredQuizData = useMemo(() => {
    // If no quizzes are selected, show all participants with all their attempts.
    if (selectedQuizzes.length === 0) {
      return quizParticipantData.map(studentData => ({
        ...studentData,
        bestRank: studentData.attempts.reduce((minRank, attempt) => (attempt.rank && (minRank === null || attempt.rank < minRank)) ? attempt.rank : minRank, null)
      })).sort((a, b) => (a.bestRank ?? Infinity) - (b.bestRank ?? Infinity));
    }

    // If quizzes are selected, filter attempts and then filter out students with no matching attempts.
    return quizParticipantData.map(studentData => {
      const filteredAttempts = studentData.attempts.filter(attempt => 
        selectedQuizzes.length === 0 || selectedQuizzes.includes(attempt.quiz_id)
      );

      // Find the best rank (lowest rank number) for the student from the filtered attempts
      const bestRank = filteredAttempts.reduce((minRank, attempt) => {
        if (attempt.rank && (minRank === null || attempt.rank < minRank)) {
          return attempt.rank;
        }
        return minRank;
      }, null);

      return { ...studentData, attempts: filteredAttempts, bestRank };
    })
    .filter(studentData => studentData.attempts.length > 0);
  }, [quizParticipantData, selectedQuizzes]);

  const filteredInstitutionSummary = useMemo(() => {
    const dataToProcess = selectedQuizzes.length > 0
      ? rawQuizData.filter(item => selectedQuizzes.includes(item.quiz_id))
      : rawQuizData;

    const summary = dataToProcess.reduce((acc, item) => {
      const schoolName = item.student.school_name;
      if (schoolName) {
        if (!acc[schoolName]) {
          acc[schoolName] = {
            name: schoolName,
            participants: new Set(),
          };
        }
        acc[schoolName].participants.add(item.student.student_id);
      }
      return acc;
    }, {});

    Object.values(summary).forEach(inst => { inst.participantCount = inst.participants.size; });
    return summary;
  }, [rawQuizData, selectedQuizzes]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleViewStudentAnalysis = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleViewCourseSummary = (courseKey) => {
    setSelectedCourseSummary(courseSummary[courseKey]);
    setShowCourseModal(true);
  };

  const handleViewInstitutionSummary = (institutionKey) => {
    setSelectedInstitutionSummary(institutionSummary[institutionKey]);
    setShowInstitutionModal(true);
  };

  const handleShowOverallAnalysis = () => {
    setShowOverallAnalysisModal(true);
  };

  const handleViewQuizInstitutionSummary = (institutionKey) => {
    setSelectedQuizInstitutionSummary(filteredInstitutionSummary[institutionKey]);
    setShowQuizInstitutionModal(true);
  };

  const handleViewQuizAnalysis = (studentData) => {
    setSelectedStudentForQuiz(studentData);
    setShowQuizAnalysisModal(true);
  };

  const handleQuizFilterChange = (quizId) => {
    setSelectedQuizzes(prev => {
      if (prev.includes(quizId)) {
        return prev.filter(id => id !== quizId);
      } else {
        return [...prev, quizId];
      }
    });
  };


  const handleViewCourseStatus = (student) => {
    setSelectedStudentForStatus(student);
    setShowCourseStatusModal(true);
  };

  return (
    <div className="dashboard-container">
      <AdminLeftNav
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      <div className="main-content-dash">
        <AdminHeader toggleSidebar={toggleSidebar} />
        <div className="dashboard-content">
          <Container fluid>
            <Card className="mb-4">
              <Card.Body className="pb-2">
                <Row className="align-items-end">
                  <Col md={4}>
                    <Form.Group controlId="analysisType">
                      <Form.Label>Analysis Type</Form.Label>
                      <Form.Select
                        value={analysisType}
                        onChange={(e) => setAnalysisType(e.target.value)}
                      >
                        <option value="course-wise">Course Wise Analysis</option>
                        <option value="quiz-participant-wise">Quiz Participant wise</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    {analysisType === 'quiz-participant-wise' && (
                      <Form.Group controlId="quizFilter">
                        <Form.Label>Filter by Quiz</Form.Label>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" id="quiz-filter-dropdown" className="w-100 text-start">
                            {selectedQuizzes.length === 0
                              ? 'All Quizzes'
                              : `${selectedQuizzes.length} quiz(zes) selected`}
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="quiz-filter-dropdown-menu">
                            <Dropdown.Item onClick={() => setSelectedQuizzes(quizItems.map(q => q.quiz_id))}>
                              Select All
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setSelectedQuizzes([])} className="text-danger">
                              Deselect All
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            {quizItems.map(quiz => (
                              <Dropdown.Item key={quiz.quiz_id} as="div" onClick={(e) => e.stopPropagation()}>
                                <Form.Check
                                  type="checkbox"
                                  id={`quiz-check-${quiz.quiz_id}`}
                                  label={quiz.title}
                                  checked={selectedQuizzes.includes(quiz.quiz_id)}
                                  onChange={() => handleQuizFilterChange(quiz.quiz_id)}
                                />
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Form.Group>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Course Summary Cards - Conditionally Rendered */}
            {analysisType === "course-wise" && !loading && Object.keys(courseSummary).length > 0 && (
              <>
                <h5 className="analysis-section-heading">Courses</h5>
                <Row className="mb-4">
                  {Object.keys(courseSummary).map((key) => (
                    <Col lg={3} md={4} sm={6} key={key} className="mb-3">
                      <Card
                        className="stat-card-hover clickable-rank-card"
                        onClick={() => handleViewCourseSummary(key)}
                      >
                        <Card.Body className="py-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 fw-bold">{courseSummary[key].name}</h6>
                            <Badge bg="primary" pill>{courseSummary[key].studentCount} Students</Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}

            {/* Institution Summary Cards - Conditionally Rendered */}
            {analysisType === "course-wise" && !loading && Object.keys(institutionSummary).length > 0 && (
              <>
                <h5 className="analysis-section-heading">Institutions</h5>
                <Row className="mb-4">
                  {Object.keys(institutionSummary).map((key) => (
                    <Col lg={3} md={4} sm={6} key={key} className="mb-3">
                      <Card className="stat-card-hover clickable-rank-card" onClick={() => handleViewInstitutionSummary(key)}>
                        <Card.Body className="py-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 fw-bold">{institutionSummary[key].name}</h6>
                            <Badge bg="success" pill>{institutionSummary[key].studentCount} Students</Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}

            {/* Quiz Institution Summary Cards - Conditionally Rendered */}
            {analysisType === "quiz-participant-wise" && !loading && Object.keys(filteredInstitutionSummary).length > 0 && (
              <>
                <h5 className="analysis-section-heading">Institutions</h5>
                <Row className="mb-4">
                  {Object.keys(filteredInstitutionSummary).map((key) => (
                    <Col lg={3} md={4} sm={6} key={key} className="mb-3">
                      <Card
                        className="stat-card-hover clickable-rank-card"
                        onClick={() => handleViewQuizInstitutionSummary(key)}
                      >
                        <Card.Body className="py-2">
                          <div className="d-flex justify-content-between align-items-center gap-2 w-100">
                            <h6 className="mb-0 fw-bold text-truncate" title={filteredInstitutionSummary[key].name} style={{ minWidth: 0 }}>{filteredInstitutionSummary[key].name}</h6>
                            <Badge bg="info" pill className="flex-shrink-0">{filteredInstitutionSummary[key].participantCount} Participants</Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}

            {loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>Loading Analytics...</p>
              </div>
            ) : analysisType === 'course-wise' ? (
              <>
                <div className="d-flex justify-content-end mb-3">
                  <Button variant="primary" onClick={handleShowOverallAnalysis}>
                    Overall Analysis
                  </Button>
                </div>
                <Card className="table-card">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Institution</th>
                      <th>District</th>
                      <th>Enrolled Courses</th>
                      <th>Completed Courses</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.map((student, index) => (
                      <tr key={student.student_id}>
                        <td>{index + 1}</td>
                        <td>{student.student_name}</td>
                        <td>{student.student_id}</td>
                        <td>{student.school_name}</td>
                        <td>{student.district}</td>
                        <td className="text-center">
                          <Badge bg="secondary">{student.courses.length}</Badge>
                        </td>
                        <td className="text-center">
                          <Badge
                            bg="success"
                            pill
                            style={{ cursor: "pointer" }}
                            onClick={() => handleViewCourseStatus(student)}
                          >
                            {
                              student.courses.filter(course =>
                                course.modules.length > 0 && course.modules.every(m => m.module_status === 'completed')
                              ).length
                            }
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewStudentAnalysis(student)}
                          >
                            View Analysis
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                </Card>
              </>
            ) : analysisType === 'quiz-participant-wise' ? (
              <Card className="table-card">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Institution</th>
                      <th>Rank</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuizData.map((data, index) => (
                      <tr key={data.student.student_id}>
                        <td>{index + 1}</td>
                        <td>{data.student.full_name}</td>
                        <td>{data.student.student_id}</td>
                        <td>{data.student.school_name}</td>
                        <td>
                          {data.attempts.length === 1 && data.bestRank !== null ? (
                            <Badge bg="primary">#{data.bestRank}</Badge>
                          ) : data.bestRank !== null ? (
                            <Badge bg="info">Best: #{data.bestRank}</Badge>
                          ) : (
                            <Badge bg="secondary">N/A</Badge>
                          )}
                        </td>
                        <td>
                          {data.attempts.length > 1 && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleViewQuizAnalysis(data)}
                            >
                              View Ranks
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">Please select an analysis type.</p>
              </div>
            )}
          </Container>

          {/* Student Detail Modal */}
          <Modal
            show={showStudentModal}
            onHide={() => setShowStudentModal(false)}
            size="xl"
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Analysis for: {selectedStudent?.student_name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedStudent?.courses.map((course) => {
                const completedModules = course.modules.filter(
                  (m) => m.module_status === "completed"
                ).length;
                const progress =
                  course.modules.length > 0
                    ? (completedModules / course.modules.length) * 100
                    : 0;

                return (
                  <Card key={course.course_id} className="mb-4">
                    <Card.Header>
                      <div className="d-flex justify-content-between">
                        <h5>{course.course_name}</h5>
                        <span className="fw-bold">{progress.toFixed(0)}% Complete</span>
                      </div>
                      <ProgressBar
                        now={progress}
                        label={`${progress.toFixed(0)}%`}
                      />
                    </Card.Header>
                    <Card.Body>
                      <Table striped bordered hover responsive size="sm">
                        <thead>
                          <tr>
                            <th>Module Name</th>
                            <th>Module Status</th>
                            <th>Test Status</th>
                            <th>Test Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {course.modules.map((module) => (
                            <tr key={module.module_id}>
                              <td>{module.module_name}</td>
                              <td>
                                <Badge
                                  bg={
                                    module.module_status === "completed"
                                      ? "success"
                                      : "secondary"
                                  }
                                >
                                  {module.module_status}
                                </Badge>
                              </td>
                              <td>
                                <Badge
                                  bg={
                                    module.test_status === "passed"
                                      ? "success"
                                      : module.test_status === "failed"
                                      ? "danger"
                                      : "secondary"
                                  }
                                >
                                  {module.test_status}
                                </Badge>
                              </td>
                              <td>
                                {module.test_score !== null ? (
                                  <Badge bg="info">{module.test_score}%</Badge>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                );
              })}
            </Modal.Body>
          </Modal>

          {/* Course Summary Modal */}
          {selectedCourseSummary && (
            <Modal
              show={showCourseModal}
              onHide={() => setShowCourseModal(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title className="fw-bold">{selectedCourseSummary.name} - Summary</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row className="align-items-center">
                  <Col md={5} className="text-center">
                    <div className="progress-ring-container">
                      <svg className="circular-progress" width="150" height="150">
                        <circle
                          className="circular-progress-bg"
                          strokeWidth="12"
                          r="60"
                          cx="75"
                          cy="75"
                        />
                        <circle
                          className="circular-progress-fill"
                          strokeWidth="12"
                          strokeDasharray={`${(selectedCourseSummary.completedStudentCount / selectedCourseSummary.studentCount) * 377}, 377`}
                          r="60"
                          cx="75"
                          cy="75"
                          style={{ stroke: '#28a745' }}
                        />
                      </svg>
                      <div className="progress-ring-text">
                        <span className="fw-bold fs-4">{`${((selectedCourseSummary.completedStudentCount / selectedCourseSummary.studentCount) * 100).toFixed(1)}%`}</span>
                        <small className="text-muted">Completion</small>
                      </div>
                    </div>
                  </Col>
                  <Col md={7}>
                    <Card className="mb-3 border-start border-primary border-4">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="text-muted mb-0">Total Students Enrolled</h6>
                          <h4 className="fw-bold mb-0">{selectedCourseSummary.studentCount}</h4>
                        </div>
                      </Card.Body>
                    </Card>
                    <Card className="border-start border-success border-4">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="text-muted mb-0">Students Who Completed</h6>
                          <h4 className="fw-bold mb-0 text-success">{selectedCourseSummary.completedStudentCount}</h4>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Modal.Body>
            </Modal>
          )}

          {/* Course Status Modal */}
          {selectedStudentForStatus && (
            <Modal
              show={showCourseStatusModal}
              onHide={() => setShowCourseStatusModal(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  Course Status: {selectedStudentForStatus.student_name}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ul className="list-group">
                  {selectedStudentForStatus.courses.map((course) => {
                    const isCompleted =
                      course.modules.length > 0 &&
                      course.modules.every(
                        (m) => m.module_status === "completed"
                      );
                    const completedModules = course.modules.filter(
                      (m) => m.module_status === "completed"
                    ).length;
                    const progress =
                      course.modules.length > 0
                        ? (completedModules / course.modules.length) * 100
                        : 0;

                    return (
                      <li
                        key={course.course_id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          {course.course_name}
                          <ProgressBar
                            now={progress}
                            label={`${progress.toFixed(0)}%`}
                            variant={isCompleted ? "success" : "primary"}
                            style={{ height: "10px", marginTop: "5px" }}
                          />
                        </div>
                        <Badge bg={isCompleted ? "success" : "warning"}>
                          {isCompleted ? "Completed" : "In Progress"}
                        </Badge>
                      </li>
                    );
                  })}
                </ul>
              </Modal.Body>
            </Modal>
          )}

          {/* Quiz Analysis Modal */}
          {selectedStudentForQuiz && (
            <Modal
              show={showQuizAnalysisModal}
              onHide={() => setShowQuizAnalysisModal(false)}
              size="xl"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  Quiz Analysis for: {selectedStudentForQuiz.student.full_name}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Quiz Title</th>
                      <th>Score</th>
                      <th>Total Questions</th>
                      <th>Status</th>
                      <th>Rank</th>
                      <th>Submitted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudentForQuiz.attempts.map((attempt, index) => (
                      <tr key={index}>
                        <td><Badge bg="secondary">{quizTitleMap[attempt.quiz_id] || attempt.quiz_id}</Badge></td>
                        <td>{attempt.score}</td>
                        <td>{attempt.total_questions}</td>
                        <td>
                          <Badge bg={attempt.status === 'passed' ? 'success' : 'danger'}>
                            {attempt.status}
                          </Badge>
                        </td>
                        <td><Badge bg="primary">#{attempt.rank}</Badge></td>
                        <td>{new Date(attempt.submitted_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Modal.Body>
            </Modal>
          )}


          {/* Institution Summary Modal */}
          {selectedInstitutionSummary && (
            <Modal
              show={showInstitutionModal}
              onHide={() => setShowInstitutionModal(false)}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title className="fw-bold">{selectedInstitutionSummary.name} - Summary</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row className="align-items-center">
                  <Col md={5} className="text-center">
                    <div className="progress-ring-container">
                      <svg className="circular-progress" width="150" height="150">
                        <circle
                          className="circular-progress-bg"
                          strokeWidth="12"
                          r="60"
                          cx="75"
                          cy="75"
                        />
                        <circle
                          className="circular-progress-fill"
                          strokeWidth="12"
                          strokeDasharray={`${(selectedInstitutionSummary.completedStudentCount / selectedInstitutionSummary.studentCount) * 377}, 377`}
                          r="60"
                          cx="75"
                          cy="75"
                          style={{ stroke: '#28a745' }}
                        />
                      </svg>
                      <div className="progress-ring-text">
                        <span className="fw-bold fs-4">{`${((selectedInstitutionSummary.completedStudentCount / selectedInstitutionSummary.studentCount) * 100).toFixed(1)}%`}</span>
                        <small className="text-muted">Completion</small>
                      </div>
                    </div>
                  </Col>
                  <Col md={7}>
                    <Card className="mb-3 border-start border-primary border-4">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="text-muted mb-0">Total Students Enrolled</h6>
                          <h4 className="fw-bold mb-0">{selectedInstitutionSummary.studentCount}</h4>
                        </div>
                      </Card.Body>
                    </Card>
                    <Card className="border-start border-success border-4">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="text-muted mb-0">Students Who Completed</h6>
                          <h4 className="fw-bold mb-0 text-success">{selectedInstitutionSummary.completedStudentCount}</h4>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Modal.Body>
            </Modal>
          )}

          {/* Overall Analysis Modal */}
          <Modal
            show={showOverallAnalysisModal}
            onHide={() => setShowOverallAnalysisModal(false)}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Overall Student & Course Analysis</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {(() => {
                const totalStudents = analyticsData.length;
                const totalCourses = Object.keys(courseSummary).length;
                const totalInstitutions = Object.keys(institutionSummary).length;
                const totalEnrollments = Object.values(courseSummary).reduce((sum, course) => sum + course.studentCount, 0);
                const totalCompletedEnrollments = Object.values(courseSummary).reduce((sum, course) => sum + course.completedStudentCount, 0);
                const overallCompletionRate = totalEnrollments > 0 ? (totalCompletedEnrollments / totalEnrollments) * 100 : 0;

                // Data for Top 5 Courses Chart
                const topCoursesData = Object.values(courseSummary)
                  .sort((a, b) => b.studentCount - a.studentCount)
                  .slice(0, 5)
                  .map(course => ({
                    name: course.name.length > 15 ? `${course.name.substring(0, 15)}...` : course.name,
                    students: course.studentCount,
                  }));

                // Data for Student Progress Distribution
                let completedStudents = 0;
                let inProgressStudents = 0;
                analyticsData.forEach(student => {
                  if (student.courses.length > 0) {
                    const allCoursesCompleted = student.courses.every(c => c.modules.length > 0 && c.modules.every(m => m.module_status === 'completed'));
                    if (allCoursesCompleted) {
                      completedStudents++;
                    } else {
                      inProgressStudents++;
                    }
                  }
                });
                const studentProgressData = [
                  { name: 'Completed All Courses', value: completedStudents, color: '#28a745' },
                  { name: 'In Progress', value: inProgressStudents, color: '#ffc107' },
                ];

                return (
                  <>
                    <Row className="mb-4">
                      <Col md={4}><Card className="text-center h-100"><Card.Body><h4 className="fw-bold">{totalStudents}</h4><small className="text-muted">Total Students</small></Card.Body></Card></Col>
                      <Col md={4}><Card className="text-center h-100"><Card.Body><h4 className="fw-bold">{totalCourses}</h4><small className="text-muted">Unique Courses</small></Card.Body></Card></Col>
                      <Col md={4}><Card className="text-center h-100"><Card.Body><h4 className="fw-bold">{totalInstitutions}</h4><small className="text-muted">Institutions</small></Card.Body></Card></Col>
                    </Row>

                    <Row className="g-4">
                      <Col md={6}>
                        <Card className="h-100">
                          <Card.Body>
                            <h6 className="fw-bold text-center mb-3">Top 5 Most Enrolled Courses</h6>
                            <ResponsiveContainer width="100%" height={250}>
                              <BarChart data={topCoursesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="students" fill="#8884d8" name="Students" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="h-100">
                          <Card.Body>
                            <h6 className="fw-bold text-center mb-3">Student Progress Distribution</h6>
                            <ResponsiveContainer width="100%" height={250}>
                              <PieChart>
                                <Pie
                                  data={studentProgressData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  dataKey="value"
                                >
                                  {studentProgressData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col className="text-center">
                        <h6 className="fw-bold">Overall Course Completion Rate</h6>
                        <div className="progress-ring-container">
                          <svg className="circular-progress" width="150" height="150">
                            <circle className="circular-progress-bg" strokeWidth="12" r="60" cx="75" cy="75" />
                            <circle
                              className="circular-progress-fill"
                              strokeWidth="12"
                              strokeDasharray={`${overallCompletionRate * 3.77}, 377`}
                              r="60"
                              cx="75"
                              cy="75"
                              style={{ stroke: '#0d6efd' }}
                            />
                          </svg>
                          <div className="progress-ring-text">
                            <span className="fw-bold fs-4">{`${overallCompletionRate.toFixed(1)}%`}</span>
                            <small className="text-muted">Of All Enrollments</small>
                          </div>
                        </div>
                        <p className="mt-2 text-muted">
                          <strong>{totalCompletedEnrollments}</strong> out of <strong>{totalEnrollments}</strong> total course enrollments are complete.
                        </p>
                      </Col>
                    </Row>
                  </>
                );
              })()}
            </Modal.Body>
          </Modal>

        </div>
      </div>
    </div>
  );
};

export default Analysis;