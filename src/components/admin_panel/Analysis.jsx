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
  Pagination,
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
  // This state will now hold all data for the comprehensive student modal
  const [overallStudentAnalysis, setOverallStudentAnalysis] = useState(null);
  const [showOverallStudentModal, setShowOverallStudentModal] = useState(false);

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

  const [showQuizParticipantOverallAnalysisModal, setShowQuizParticipantOverallAnalysisModal] = useState(false);
  // State for Competition Quiz Analysis
  const [competitionQuizData, setCompetitionQuizData] = useState([]);
  const [selectedCompetitionQuizzes, setSelectedCompetitionQuizzes] = useState([]);
  const [competitionQuizTitles, setCompetitionQuizTitles] = useState([]);
  const [competitionQuizInstitutionSummary, setCompetitionQuizInstitutionSummary] = useState({});
  const [showCompetitionQuizInstitutionModal, setShowCompetitionQuizInstitutionModal] = useState(false);
  const [selectedCompetitionQuizInstitutionSummary, setSelectedCompetitionQuizInstitutionSummary] = useState(null);
  const [showCompetitionQuizOverallAnalysisModal, setShowCompetitionQuizOverallAnalysisModal] = useState(false);

  // State for Test Series Quiz Analysis
  const [testSeriesQuizData, setTestSeriesQuizData] = useState([]);
  const [selectedTestSeriesQuizzes, setSelectedTestSeriesQuizzes] = useState([]);
  const [testSeriesQuizTitles, setTestSeriesQuizTitles] = useState([]);
  const [testSeriesQuizInstitutionSummary, setTestSeriesQuizInstitutionSummary] = useState({});
  const [testSeriesCurrentPage, setTestSeriesCurrentPage] = useState(1);
  const [showTestSeriesInstitutionSummaryModal, setShowTestSeriesInstitutionSummaryModal] = useState(false);
  const [selectedTestSeriesInstitution, setSelectedTestSeriesInstitution] = useState(null);
  const [testSeriesRecordsPerPage] = useState(10);
  const [showTestSeriesQuizOverallAnalysisModal, setShowTestSeriesQuizOverallAnalysisModal] = useState(false);


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
        const [
          courseResponse, quizResponse, quizItemsResponse, 
          competitionQuizResponse, testSeriesQuizResponse
        ] = await Promise.all([
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
            axios.get(
              "https://brjobsedu.com/gyandhara/gyandhara_backend/api/competition-quiz/rank/all/",
              { headers: { Authorization: `Bearer ${accessToken}` } }
            ),
            axios.get(
              "https://brjobsedu.com/gyandhara/gyandhara_backend/api/test-series-quiz/register/",
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

        // Process Test Series Quiz Data
        if (testSeriesQuizResponse.data && testSeriesQuizResponse.data.status) {
          const flattenedTestSeriesParticipants = [];
          (testSeriesQuizResponse.data.data || []).forEach(entry => {
            if (entry.student && entry.attempt) {
              flattenedTestSeriesParticipants.push({
                ...entry.student,
                quiz_id: entry.quiz_id,
                quiz_title: entry.title,
                joined_at: entry.joined_at,
                attempt_id: entry.attempt.id,
                total_questions: entry.attempt.total_questions,
                score: entry.attempt.score,
                status: entry.attempt.status,
                rank: entry.attempt.rank,
                started_at: entry.attempt.started_at,
                submitted_at: entry.attempt.submitted_at,
              });
            }
          });

          setTestSeriesQuizData(flattenedTestSeriesParticipants);
          setTestSeriesQuizTitles([...new Set(flattenedTestSeriesParticipants.map(p => p.quiz_title))]);

          const testSeriesInstSum = {};
          flattenedTestSeriesParticipants.forEach(p => {
            if (p.school_name) {
              if (!testSeriesInstSum[p.school_name]) {
                testSeriesInstSum[p.school_name] = { name: p.school_name, participants: new Set() };
              }
              testSeriesInstSum[p.school_name].participants.add(p.student_id);
            }
          });
          Object.values(testSeriesInstSum).forEach(inst => { inst.participantCount = inst.participants.size; });
          setTestSeriesQuizInstitutionSummary(testSeriesInstSum);
        }

        // Process Competition Quiz Data
        if (competitionQuizResponse.data.success) {
          const flattenedParticipants = [];
          (competitionQuizResponse.data.data || []).forEach(quiz => {
            if (quiz.students && Array.isArray(quiz.students)) {
              quiz.students.forEach(student => {
                flattenedParticipants.push({
                  ...student,
                  quiz_id: quiz.quiz_id,
                  quiz_title: quiz.title,
                  quiz_category: quiz.quiz_category,
                });
              });
            }
          });
          
          setCompetitionQuizData(flattenedParticipants);
          setCompetitionQuizTitles([...new Set(flattenedParticipants.map(p => p.quiz_title))]);
        }
        
        // Process Competition Quiz Institution Summary
        const compQuizInstSum = {};
        competitionQuizData.forEach(item => {
            const schoolName = item.school_name;
            if (schoolName) {
                if (!compQuizInstSum[schoolName]) {
                    compQuizInstSum[schoolName] = {
                        name: schoolName,
                        participants: new Set(),
                    };
                }
                compQuizInstSum[schoolName].participants.add(item.student_id);
            }
        });

        Object.keys(compQuizInstSum).forEach(key => {
            const summary = compQuizInstSum[key];
            summary.participantCount = summary.participants.size;
        });
        setCompetitionQuizInstitutionSummary(compQuizInstSum);

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

  const filteredTestSeriesQuizParticipants = useMemo(() => {
    const allAttempts = testSeriesQuizData || [];

    // 1. Filter attempts based on selected quizzes
    const filteredAttempts = selectedTestSeriesQuizzes.length === 0
      ? allAttempts
      : allAttempts.filter(participant =>
      selectedTestSeriesQuizzes.includes(participant.quiz_title)
    );

    // 2. Group by student and find the best rank
    const uniqueStudents = new Map();
    filteredAttempts.forEach(attempt => {
      if (!uniqueStudents.has(attempt.student_id)) {
        uniqueStudents.set(attempt.student_id, {
          ...attempt, // Use the first attempt for basic student info
          bestRank: attempt.rank,
          attemptCount: 1,
        });
      } else {
        const existing = uniqueStudents.get(attempt.student_id);
        if (attempt.rank < existing.bestRank) {
          existing.bestRank = attempt.rank;
        }
        existing.attemptCount += 1;
      }
    });

    // 3. Convert map to array and sort by best rank
    return Array.from(uniqueStudents.values())
      .sort((a, b) => (a.bestRank || Infinity) - (b.bestRank || Infinity));
  }, [testSeriesQuizData, selectedTestSeriesQuizzes]);

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

  const filteredCompetitionQuizParticipants = useMemo(() => {
    if (selectedCompetitionQuizzes.length === 0) {
      return competitionQuizData;
    }
    return competitionQuizData.filter(participant =>
      selectedCompetitionQuizzes.includes(participant.quiz_title)
    );
  }, [competitionQuizData, selectedCompetitionQuizzes]);

  const filteredCompetitionInstitutionSummary = useMemo(() => {
    const dataToProcess = selectedCompetitionQuizzes.length > 0
      ? filteredCompetitionQuizParticipants
      : competitionQuizData;

    const summary = dataToProcess.reduce((acc, participant) => {
      const schoolName = participant.school_name;
      if (schoolName) {
        if (!acc[schoolName]) {
          acc[schoolName] = {
            name: schoolName,
            participants: new Set(),
            totalScore: 0,
            totalAttempts: 0,
          };
        }
        acc[schoolName].participants.add(participant.student_id);
        acc[schoolName].totalScore += participant.score || 0;
        acc[schoolName].totalAttempts += 1;
      }
      return acc;
    }, {});

    Object.values(summary).forEach(inst => {
      inst.participantCount = inst.participants.size;
      inst.averageScore = inst.totalAttempts > 0 ? (inst.totalScore / inst.totalAttempts) : 0;
      delete inst.participants;
    });
    return summary;
  }, [competitionQuizData, selectedCompetitionQuizzes, filteredCompetitionQuizParticipants]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleShowOverallPerformance = () => {
    switch (analysisType) {
      case 'course-wise':
        return handleShowOverallAnalysis();
      case 'quiz-participant-wise':
        return handleShowQuizParticipantOverallAnalysis();
      case 'competition-quiz-analysis':
        return handleShowCompetitionQuizOverallAnalysis();
      case 'test-series-quiz-analysis':
        return handleShowTestSeriesQuizOverallAnalysis();
      default:
        return;
    }
  };

  const handleTestSeriesPageChange = (page) => {
    setTestSeriesCurrentPage(page);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleViewStudentAnalysis = (studentIdentifier) => {
    const studentId = studentIdentifier.student_id || studentIdentifier.student?.student_id;
    if (!studentId) return;

    const courseData = analyticsData.find(s => s.student_id === studentId);
    const quizData = quizParticipantData.find(s => s.student.student_id === studentId);
    const competitionData = competitionQuizData.filter(s => s.student_id === studentId);
    const testSeriesData = testSeriesQuizData.filter(s => s.student_id === studentId);

    // Consolidate student details from any available source
    const studentDetails = 
      courseData || 
      quizData?.student || 
      competitionData[0] || 
      testSeriesData[0] ||
      {};

    const consolidatedData = {
      student: {
        student_id: studentId,
        full_name: studentDetails.student_name || studentDetails.full_name,
        school_name: studentDetails.school_name,
        district: studentDetails.district,
      },
      courses: courseData?.courses || [],
      quizzes: quizData?.attempts || [],
      competitionQuizzes: competitionData,
      testSeries: testSeriesData,
    };

    console.log("Consolidated Student Data:", consolidatedData);

    setOverallStudentAnalysis(consolidatedData);
    setShowOverallStudentModal(true);
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

  const handleShowQuizParticipantOverallAnalysis = () => {
    setShowQuizParticipantOverallAnalysisModal(true);
  };

  const handleViewTestSeriesInstitutionSummary = (institutionName) => {
    const institutionData = testSeriesQuizInstitutionSummary[institutionName];
    setSelectedTestSeriesInstitution(institutionData);
    setShowTestSeriesInstitutionSummaryModal(true);
  };

  const handleShowTestSeriesQuizOverallAnalysis = () => {
    setShowTestSeriesQuizOverallAnalysisModal(true);
  };

  const handleViewQuizInstitutionSummary = (institutionKey) => {
    setSelectedQuizInstitutionSummary(filteredInstitutionSummary[institutionKey]);
    setShowQuizInstitutionModal(true);
  };

  const handleViewQuizAnalysis = (studentData) => {
    handleViewStudentAnalysis(studentData);
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

  const handleTestSeriesQuizFilterChange = (quizTitle) => {
    setSelectedTestSeriesQuizzes(prevTitles => {
      if (prevTitles.includes(quizTitle)) {
        return prevTitles.filter(title => title !== quizTitle);
      } else {
        return [...prevTitles, quizTitle];
      }
    });
  };

  const handleCompetitionQuizFilterChange = (quizTitle) => {
    setSelectedCompetitionQuizzes(prev => {
      if (prev.includes(quizTitle)) {
        return prev.filter(title => title !== quizTitle);
      } else {
        return [...prev, quizTitle];
      }
    });
  };

  const handleViewCompetitionQuizInstitutionSummary = (institutionKey) => {
    setSelectedCompetitionQuizInstitutionSummary(filteredCompetitionInstitutionSummary[institutionKey]);
    setShowCompetitionQuizInstitutionModal(true);
  };

  const handleShowCompetitionQuizOverallAnalysis = () => {
    setShowCompetitionQuizOverallAnalysisModal(true);
  };


  const handleViewCourseStatus = (student) => {
    // Re-routing to the main analysis view
    handleViewStudentAnalysis(student);
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
                  <Col md={5}>
                    <Form.Group controlId="analysisType">
                      <Form.Label>Analysis Type</Form.Label>
                      <Form.Select
                        value={analysisType}
                        onChange={(e) => setAnalysisType(e.target.value)}
                      >
                        <option value="course-wise">Course Wise Analysis</option>
                        <option value="quiz-participant-wise">Quiz Participant wise</option>
                        <option value="competition-quiz-analysis">Competition Quiz Analysis</option>
                        <option value="test-series-quiz-analysis">Test Series Quiz Analysis</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={5}>
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
                    {analysisType === 'competition-quiz-analysis' && (
                      <Form.Group controlId="competitionQuizFilter">
                        <Form.Label>Filter by Competition Quiz</Form.Label>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" id="competition-quiz-filter-dropdown" className="w-100 text-start">
                            {selectedCompetitionQuizzes.length === 0
                              ? 'All Competition Quizzes'
                              : `${selectedCompetitionQuizzes.length} quiz(zes) selected`}
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="quiz-filter-dropdown-menu">
                            <Dropdown.Item onClick={() => setSelectedCompetitionQuizzes(competitionQuizTitles)}>
                              Select All
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setSelectedCompetitionQuizzes([])} className="text-danger">
                              Deselect All
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            {competitionQuizTitles.map(title => (
                              <Dropdown.Item key={title} as="div" onClick={(e) => e.stopPropagation()}>
                                <Form.Check
                                  type="checkbox"
                                  label={title}
                                  checked={selectedCompetitionQuizzes.includes(title)}
                                  onChange={() => handleCompetitionQuizFilterChange(title)} />
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Form.Group>
                    )}
                    {analysisType === 'test-series-quiz-analysis' && (
                      <Form.Group controlId="testSeriesQuizFilter">
                        <Form.Label>Filter by Test Series Quiz</Form.Label>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" id="test-series-quiz-filter-dropdown" className="w-100 text-start">
                            {selectedTestSeriesQuizzes.length === 0
                              ? 'All Test Series Quizzes'
                              : `${selectedTestSeriesQuizzes.length} quiz(zes) selected`}
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="quiz-filter-dropdown-menu">
                            <Dropdown.Item onClick={() => setSelectedTestSeriesQuizzes(testSeriesQuizTitles)}>
                              Select All
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setSelectedTestSeriesQuizzes([])} className="text-danger">
                              Deselect All
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            {testSeriesQuizTitles.map(title => (
                              <Dropdown.Item key={title} as="div" onClick={(e) => e.stopPropagation()}>
                                <Form.Check
                                  type="checkbox"
                                  label={title}
                                  checked={selectedTestSeriesQuizzes.includes(title)}
                                  onChange={() => handleTestSeriesQuizFilterChange(title)} />
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Form.Group>
                    )}
                  </Col>
                  <Col md={2} className="d-flex justify-content-end">
                    <Button variant="primary" onClick={handleShowOverallPerformance} className="w-100">
                      Overall Performance
                    </Button>
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
              </div>
            ) : analysisType === 'course-wise' ? (
              <>
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
                            bg="success" pill>
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
                              onClick={() => handleViewStudentAnalysis(data)}
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
            ) : analysisType === 'competition-quiz-analysis' ? (
              <>
                {!loading && Object.keys(filteredCompetitionInstitutionSummary).length > 0 && (
                  <>
                    <h5 className="analysis-section-heading">Institutions</h5>
                    <Row className="mb-4">
                      {Object.keys(filteredCompetitionInstitutionSummary).map((key) => (
                        <Col lg={3} md={4} sm={6} key={key} className="mb-3">
                          <Card
                            className="stat-card-hover clickable-rank-card"
                            onClick={() => handleViewCompetitionQuizInstitutionSummary(key)}
                          >
                            <Card.Body className="py-2">
                              <div className="d-flex justify-content-between align-items-center gap-2 w-100">
                                <h6 className="mb-0 fw-bold text-truncate" title={filteredCompetitionInstitutionSummary[key].name} style={{ minWidth: 0 }}>{filteredCompetitionInstitutionSummary[key].name}</h6>
                                <Badge bg="info" pill className="flex-shrink-0">{filteredCompetitionInstitutionSummary[key].participantCount} Participants</Badge>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </>
                )}
                <Card className="table-card">
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Institution</th>
                        <th>Rank</th>
                        <th>Attempts</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompetitionQuizParticipants.length > 0 ? (
                        filteredCompetitionQuizParticipants.map((participant, index) => (
                          <tr key={`${participant.student_id}-${index}`}>
                            <td>{index + 1}</td>
                            <td>{participant.student_name}</td>
                            <td>{participant.student_id}</td>
                            <td>{participant.school_name}</td>
                            <td>
                              <Badge bg={participant.rank <= 10 ? "primary" : "secondary"}>
                                #{participant.rank}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg="secondary">{participant.attemptCount}</Badge>
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleViewStudentAnalysis(participant)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="6" className="text-center">No participants found for the selected competition quizzes.</td></tr>
                      )}
                    </tbody>
                  </Table>
                </Card>
              </>
            ) : analysisType === 'test-series-quiz-analysis' ? (
              <>
                {!loading && Object.keys(testSeriesQuizInstitutionSummary).length > 0 && (
                  <>
                    <h5 className="analysis-section-heading">Institutions</h5>
                    <Row className="mb-4">
                      {Object.keys(testSeriesQuizInstitutionSummary).map((key) => (
                        <Col lg={3} md={4} sm={6} key={key} className="mb-3">
                          <Card
                            className="stat-card-hover clickable-rank-card"
                            onClick={() => handleViewTestSeriesInstitutionSummary(key)}
                          >
                            <Card.Body className="py-2">
                              <div className="d-flex justify-content-between align-items-center gap-2 w-100">
                                <h6 className="mb-0 fw-bold text-truncate" title={testSeriesQuizInstitutionSummary[key].name} style={{ minWidth: 0 }}>{testSeriesQuizInstitutionSummary[key].name}</h6>
                                <Badge bg="info" pill className="flex-shrink-0">{testSeriesQuizInstitutionSummary[key].participantCount} Participants</Badge>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </>
                )}
                <Card className="table-card">
                  <Card.Header className="bg-white border-bottom py-3 px-3 d-flex justify-content-between align-items-center">
                    <span className="text-muted small">
                      Showing {filteredTestSeriesQuizParticipants.slice((testSeriesCurrentPage - 1) * testSeriesRecordsPerPage, testSeriesCurrentPage * testSeriesRecordsPerPage).length} of {filteredTestSeriesQuizParticipants.length} records
                    </span>
                  </Card.Header>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Institution</th>
                        <th>Rank</th>
                        <th>Attempts</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTestSeriesQuizParticipants.length > 0 ? (
                        filteredTestSeriesQuizParticipants
                          .slice((testSeriesCurrentPage - 1) * testSeriesRecordsPerPage, testSeriesCurrentPage * testSeriesRecordsPerPage)
                          .map((participant, index) => (
                            <tr
                              key={`${participant.student_id}-${(testSeriesCurrentPage - 1) * testSeriesRecordsPerPage + index}`}
                              className={
                                participant.bestRank === 1 ? 'table-success' :
                                participant.bestRank === 2 ? 'table-primary' :
                                participant.bestRank === 3 ? 'table-info' : ''
                              }
                            >
                            <td>{(testSeriesCurrentPage - 1) * testSeriesRecordsPerPage + index + 1}</td>
                            <td>{participant.full_name}</td>
                            <td>{participant.student_id}</td>
                            <td>{participant.school_name}</td>
                            <td>
                              <Badge bg={participant.bestRank <= 10 ? "primary" : "secondary"}>
                                #{participant.bestRank}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg="secondary">{participant.attemptCount}</Badge>
                            </td>
                            <td>
                              <Button
                                variant="outline-primary"
                                size="sm" 
                                onClick={() => handleViewStudentAnalysis(participant)}
                              >
                                View Rank
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="7" className="text-center">No participants found for the selected test series quizzes.</td></tr>
                      )}
                    </tbody>
                  </Table>
                  {filteredTestSeriesQuizParticipants.length > testSeriesRecordsPerPage && (
                    <Card.Footer className="bg-light border-top py-2 px-3">
                      <Pagination className="justify-content-center mb-0" size="sm">
                        <Pagination.First onClick={() => handleTestSeriesPageChange(1)} disabled={testSeriesCurrentPage === 1} />
                        <Pagination.Prev onClick={() => handleTestSeriesPageChange(testSeriesCurrentPage - 1)} disabled={testSeriesCurrentPage === 1} />
                        
                        {(() => {
                          const totalPages = Math.ceil(filteredTestSeriesQuizParticipants.length / testSeriesRecordsPerPage);
                          const items = [];
                          let startPage = Math.max(1, testSeriesCurrentPage - 2);
                          let endPage = Math.min(totalPages, testSeriesCurrentPage + 2);

                          if (testSeriesCurrentPage > 3) {
                            items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
                          }

                          for (let i = startPage; i <= endPage; i++) {
                            items.push(
                              <Pagination.Item key={i} active={i === testSeriesCurrentPage} onClick={() => handleTestSeriesPageChange(i)}>
                                {i}
                              </Pagination.Item>
                            );
                          }

                          if (testSeriesCurrentPage < totalPages - 2) {
                            items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
                          }
                          
                          return items;
                        })()}

                        <Pagination.Next onClick={() => handleTestSeriesPageChange(testSeriesCurrentPage + 1)} disabled={testSeriesCurrentPage === Math.ceil(filteredTestSeriesQuizParticipants.length / testSeriesRecordsPerPage)} />
                        <Pagination.Last onClick={() => handleTestSeriesPageChange(Math.ceil(filteredTestSeriesQuizParticipants.length / testSeriesRecordsPerPage))} disabled={testSeriesCurrentPage === Math.ceil(filteredTestSeriesQuizParticipants.length / testSeriesRecordsPerPage)} />
                      </Pagination>
                    </Card.Footer>
                  )}
                </Card>
              </>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">Please select an analysis type.</p>
              </div>
            )}
          </Container>

          {/* Unified Student Overall Performance Modal */}
          <Modal
            show={showOverallStudentModal}
            onHide={() => setShowOverallStudentModal(false)}
            size="xl"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Overall Performance: {overallStudentAnalysis?.student?.full_name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {overallStudentAnalysis && (
                <>
                  {/* Course Performance */}
                  <h5 className="mb-3">Course Performance</h5>
                  {overallStudentAnalysis.courses.length > 0 ? (
                    overallStudentAnalysis.courses.map((course) => {
                      const completedModules = course.modules.filter(m => m.module_status === "completed").length;
                      const progress = course.modules.length > 0 ? (completedModules / course.modules.length) * 100 : 0;
                      return (
                        <Card key={course.course_id} className="mb-4">
                          <Card.Header>
                            <div className="d-flex justify-content-between">
                              <h6>{course.course_name}</h6>
                              <span className="fw-bold">{progress.toFixed(0)}% Complete</span>
                            </div>
                            <ProgressBar now={progress} label={`${progress.toFixed(0)}%`} />
                          </Card.Header>
                          <Card.Body>
                            <Table striped bordered hover responsive size="sm">
                              <thead><tr><th>Module</th><th>Status</th><th>Test</th><th>Score</th></tr></thead>
                              <tbody>
                                {course.modules.map(module => (
                                  <tr key={module.module_id}>
                                    <td>{module.module_name}</td>
                                    <td><Badge bg={module.module_status === "completed" ? "success" : "secondary"}>{module.module_status}</Badge></td>
                                    <td><Badge bg={module.test_status === "passed" ? "success" : module.test_status === "failed" ? "danger" : "secondary"}>{module.test_status}</Badge></td>
                                    <td>{module.test_score !== null ? <Badge bg="info">{module.test_score}%</Badge> : "-"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </Card.Body>
                        </Card>
                      );
                    })
                  ) : <p className="text-muted">No course data available.</p>}

                  {/* Quiz Performance */}
                  <h5 className="mb-3 mt-4">Quiz Performance</h5>
                  {overallStudentAnalysis.quizzes.length > 0 ? (
                    <Table striped bordered hover responsive size="sm">
                      <thead><tr><th>Quiz</th><th>Score</th><th>Total Qs</th><th>Status</th><th>Rank</th><th>Submitted</th></tr></thead>
                      <tbody>
                        {overallStudentAnalysis.quizzes.map((attempt, index) => (
                          <tr key={`quiz-${index}`}>
                            <td><Badge bg="secondary">{quizTitleMap[attempt.quiz_id] || attempt.quiz_id}</Badge></td>
                            <td>{attempt.score}</td>
                            <td>{attempt.total_questions}</td>
                            <td><Badge bg={attempt.status === 'passed' ? 'success' : 'danger'}>{attempt.status}</Badge></td>
                            <td><Badge bg="primary">#{attempt.rank}</Badge></td>
                            <td>{new Date(attempt.submitted_at).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : <p className="text-muted">No regular quiz data available.</p>}

                  {/* Competition Quiz Performance */}
                  <h5 className="mb-3 mt-4">Competition Quiz Performance</h5>
                  {overallStudentAnalysis.competitionQuizzes.length > 0 ? (
                    <Table striped bordered hover responsive size="sm">
                      <thead><tr><th>Quiz</th><th>Score</th><th>Rank</th></tr></thead>
                      <tbody>
                        {overallStudentAnalysis.competitionQuizzes.map((attempt, index) => (
                          <tr key={`comp-${index}`}>
                            <td><Badge bg="info">{attempt.quiz_title}</Badge></td>
                            <td><Badge bg={attempt.score > 5 ? "success" : "warning"}>{attempt.score}</Badge></td>
                            <td><Badge bg={attempt.rank <= 10 ? "primary" : "secondary"}>#{attempt.rank}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : <p className="text-muted">No competition quiz data available.</p>}

                  {/* Test Series Performance */}
                  <h5 className="mb-3 mt-4">Test Series Performance</h5>
                  {overallStudentAnalysis.testSeries.length > 0 ? (
                    <Table striped bordered hover responsive size="sm">
                      <thead><tr><th>Quiz</th><th>Score</th><th>Rank</th><th>Status</th><th>Submitted</th></tr></thead>
                      <tbody>
                        {overallStudentAnalysis.testSeries.map((attempt, index) => (
                          <tr key={`test-${index}`}>
                            <td><Badge bg="dark">{attempt.quiz_title}</Badge></td>
                            <td><Badge bg={attempt.score > 5 ? "success" : "warning"}>{attempt.score}</Badge></td>
                            <td><Badge bg={attempt.rank <= 10 ? "primary" : "secondary"}>#{attempt.rank}</Badge></td>
                            <td><Badge bg={attempt.status === 'passed' ? 'success' : 'danger'}>{attempt.status}</Badge></td>
                            <td>{new Date(attempt.submitted_at).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : <p className="text-muted">No test series data available.</p>}
                </>
              )}
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

          {/* Competition Quiz Institution Summary Modal */}
          {selectedCompetitionQuizInstitutionSummary && (
            <Modal
              show={showCompetitionQuizInstitutionModal}
              onHide={() => setShowCompetitionQuizInstitutionModal(false)}
              centered
              size="lg"
            >
              <Modal.Header closeButton>
                <Modal.Title className="fw-bold">{selectedCompetitionQuizInstitutionSummary.name} - Competition Summary</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Student ID</th>
                      <th>Quiz Title</th>
                      <th>Score</th>
                      <th>Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompetitionQuizParticipants
                      .filter(p => p.school_name === selectedCompetitionQuizInstitutionSummary.name)
                      .map((participant, index) => (
                        <tr key={`${participant.student_id}-${index}`}>
                          <td>{index + 1}</td>
                          <td>{participant.student_name}</td>
                          <td>{participant.student_id}</td>
                          <td><Badge bg="info">{participant.quiz_title}</Badge></td>
                          <td>
                            <Badge bg={participant.score > 5 ? "success" : "warning"}>
                              {participant.score}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={participant.rank <= 10 ? "primary" : "secondary"}>
                              #{participant.rank}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowCompetitionQuizInstitutionModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          )}

          {/* Quiz Participant Overall Analysis Modal */}
          <Modal
            show={showQuizParticipantOverallAnalysisModal}
            onHide={() => setShowQuizParticipantOverallAnalysisModal(false)}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Quiz Participant Overall Analysis</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {(() => {
                const participants = filteredQuizData;
                const totalParticipants = participants.length;
                const totalQuizzes = quizItems.length;
                const totalAttempts = participants.reduce((sum, p) => sum + p.attempts.length, 0);
                const allScores = participants.flatMap(p => p.attempts.map(a => a.score || 0));
                const avgScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
                const passCount = participants.filter(p => p.attempts.some(a => a.status === 'passed')).length;
                const passRate = totalParticipants > 0 ? (passCount / totalParticipants) * 100 : 0;

                const quizWiseData = quizItems.map(quiz => {
                  const attempts = participants.flatMap(p => p.attempts.filter(a => a.quiz_id === quiz.quiz_id));
                  const scores = attempts.map(a => a.score || 0);
                  const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
                  return {
                    name: quiz.title.length > 15 ? `${quiz.title.substring(0, 15)}...` : quiz.title,
                    fullName: quiz.title, // Add full name for tooltip
                    avgScore: avg,
                    participants: attempts.length,
                  };
                }).filter(q => q.participants > 0);
                
                const statusData = [
                  { name: 'Passed', value: passCount, color: '#28a745' },
                  { name: 'Not Passed', value: totalParticipants - passCount, color: '#dc3545' },
                ];

                return (
                  <>
                   

                    <Row className="mb-4">
                      <Col md={4}><Card className="text-center h-100"><Card.Body><h4 className="fw-bold">{totalParticipants}</h4><small className="text-muted">Total Students</small></Card.Body></Card></Col>
                      <Col md={4}><Card className="text-center h-100"><Card.Body><h4 className="fw-bold">{totalQuizzes}</h4><small className="text-muted">Total Quizzes</small></Card.Body></Card></Col>
                     
                      <Col md={4}><Card className="text-center h-100"><Card.Body><h4 className="fw-bold">{passRate.toFixed(1)}%</h4><small className="text-muted">Pass Rate</small></Card.Body></Card></Col>
                    </Row>

                    <Row className="g-4">
                      <Col md={6}>
                        <Card className="h-100">
                          <Card.Body>
                            <h6 className="fw-bold text-center mb-3">Quiz-wise Average Score</h6>
                            <ResponsiveContainer width="100%" height={250}>
                              <BarChart data={quizWiseData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="avgScore" fill="#8884d8" name="Avg Score" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="h-100">
                          <Card.Body>
                            <h6 className="fw-bold text-center mb-3">Pass / Fail Distribution</h6>
                            <ResponsiveContainer width="100%" height={250}>
                              <PieChart>
                                <Pie
                                  data={statusData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  dataKey="value"
                                >
                                  {statusData.map((entry, index) => (
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
                  </>
                );
              })()}
            </Modal.Body>
          </Modal>

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

          {/* Competition Quiz Overall Analysis Modal */}
          <Modal
            show={showCompetitionQuizOverallAnalysisModal}
            onHide={() => setShowCompetitionQuizOverallAnalysisModal(false)}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Competition Quiz Overall Analysis</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {(() => {
                const participants = filteredCompetitionQuizParticipants;
                const totalParticipants = participants.length;
                const totalQuizzes = [...new Set(participants.map(p => p.quiz_title))].length;
                const totalScore = participants.reduce((sum, p) => sum + (p.score || 0), 0);
                const avgScore = totalParticipants > 0 ? totalScore / totalParticipants : 0;
                const passCount = participants.filter(p => p.status === 'passed').length;
                const passRate = totalParticipants > 0 ? (passCount / totalParticipants) * 100 : 0;

                const quizWiseData = Object.values(
                  participants.reduce((acc, p) => {
                    if (!acc[p.quiz_title]) {
                      acc[p.quiz_title] = { title: p.quiz_title, scores: [], count: 0 };
                    }
                    acc[p.quiz_title].scores.push(p.score || 0);
                    acc[p.quiz_title].count += 1;
                    return acc;
                  }, {})
                ).map(q => ({
                  name: q.title,
                  avgScore: q.scores.reduce((a, b) => a + b, 0) / q.scores.length,
                  participants: q.count,
                }));

                const statusData = [
                  { name: 'Passed', value: passCount, color: '#28a745' },
                  { name: 'Failed', value: totalParticipants - passCount, color: '#dc3545' },
                ];

                return (
                  <>
                    <Row className="mb-4">
                      <Col md={3}><Card className="text-center h-100"><Card.Body><h4 className="fw-bold">{totalParticipants}</h4><small className="text-muted">Total Participants</small></Card.Body></Card></Col>
                      <Col md={3}><Card className="text-center h-100"><Card.Body><h4 className="fw-bold">{totalQuizzes}</h4><small className="text-muted">Total Quizzes</small></Card.Body></Card></Col>
                      <Col md={3}><Card className="text-center h-100"><Card.Body><h4 className="fw-bold">{avgScore.toFixed(1)}</h4><small className="text-muted">Average Score</small></Card.Body></Card></Col>
                      <Col md={3}><Card className="text-center h-100"><Card.Body><h4 className="fw-bold">{passRate.toFixed(1)}%</h4><small className="text-muted">Pass Rate</small></Card.Body></Card></Col>
                    </Row>

                    <Row className="g-4">
                      <Col md={6}>
                        <Card className="h-100">
                          <Card.Body>
                            <h6 className="fw-bold text-center mb-3">Quiz-wise Average Score</h6>
                            <ResponsiveContainer width="100%" height={250}>
                              <BarChart data={quizWiseData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={false} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="avgScore" fill="#8884d8" name="Avg Score" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="h-100">
                          <Card.Body>
                            <h6 className="fw-bold text-center mb-3">Pass / Fail Distribution</h6>
                            <ResponsiveContainer width="100%" height={250}>
                              <PieChart>
                                <Pie
                                  data={statusData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  dataKey="value"
                                >
                                  {statusData.map((entry, index) => (
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
                  </>
                );
              })()}
            </Modal.Body>
          </Modal>

          {/* Test Series Quiz Overall Analysis Modal */}
          <Modal
            show={showTestSeriesQuizOverallAnalysisModal}
            onHide={() => setShowTestSeriesQuizOverallAnalysisModal(false)}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Test Series Quiz Overall Analysis</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {(() => {
                const allAttempts = testSeriesQuizData || [];
                const filteredAttempts = selectedTestSeriesQuizzes.length === 0
                  ? allAttempts
                  : allAttempts.filter(p => selectedTestSeriesQuizzes.includes(p.quiz_title));

                const participants = filteredAttempts;

                const totalParticipants = new Set(participants.map(p => p.student_id)).size;
                const totalAttempts = participants.length;
                const totalScore = participants.reduce((sum, p) => sum + (p.score || 0), 0);
                const avgScore = totalAttempts > 0 ? totalScore / totalAttempts : 0;
                const passCount = participants.filter(p => p.status === 'passed' || p.status === 'merit').length;
                const passRate = totalAttempts > 0 ? (passCount / totalAttempts) * 100 : 0;

                const quizWiseData = Object.values(
                  participants.reduce((acc, p) => {
                    if (!acc[p.quiz_title]) {
                      acc[p.quiz_title] = { title: p.quiz_title, scores: [], count: 0 };
                    }
                    acc[p.quiz_title].scores.push(p.score || 0);
                    acc[p.quiz_title].count += 1;
                    return acc;
                  }, {})
                ).map(q => ({
                  name: q.title,
                  avgScore: q.scores.reduce((a, b) => a + b, 0) / q.scores.length,
                  participants: q.count,
                }));

                const statusData = [
                  { name: 'Passed/Merit', value: passCount, color: '#28a745' },
                  { name: 'Failed', value: totalAttempts - passCount, color: '#dc3545' },
                ];

                const scoreDistributionData = participants.reduce((acc, p) => {
                  const score = p.score || 0;
                  if (score >= 9) acc['9-10']++;
                  else if (score >= 7) acc['7-8']++;
                  else if (score >= 5) acc['5-6']++;
                  else if (score >= 3) acc['3-4']++;
                  else acc['0-2']++;
                  return acc;
                }, { '0-2': 0, '3-4': 0, '5-6': 0, '7-8': 0, '9-10': 0 });

                const scoreChartData = Object.keys(scoreDistributionData).map(key => ({
                  range: key,
                  count: scoreDistributionData[key]
                }));

                return (
                  <>
                    <Row className="mb-4">
                      <Col md={3}><Card className="text-center h-100"><Card.Body><h4 className="fw-bold">{totalParticipants}</h4><small className="text-muted">Unique Participants</small></Card.Body></Card></Col>
                      <Col md={3}><Card className="text-center h-100"><Card.Body><h4 className="fw-bold">{totalAttempts}</h4><small className="text-muted">Total Attempts</small></Card.Body></Card></Col>
                      <Col md={3}><Card className="text-center h-100"><Card.Body><h4 className="fw-bold">{avgScore.toFixed(1)}</h4><small className="text-muted">Average Score</small></Card.Body></Card></Col>
                      <Col md={3}><Card className="text-center h-100"><Card.Body><h4 className="fw-bold">{passRate.toFixed(1)}%</h4><small className="text-muted">Pass Rate</small></Card.Body></Card></Col>
                    </Row>

                    <Row className="g-4">
                      <Col md={6}>
                        <Card className="h-100">
                          <Card.Body>
                            <h6 className="fw-bold text-center mb-3">Quiz-wise Average Score</h6>
                            <ResponsiveContainer width="100%" height={250}>
                              <BarChart data={quizWiseData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={false} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="avgScore" fill="#8884d8" name="Avg Score" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="h-100">
                          <Card.Body>
                            <h6 className="fw-bold text-center mb-3">Pass / Fail Distribution</h6>
                            <ResponsiveContainer width="100%" height={250}>
                              <PieChart>
                                <Pie
                                  data={statusData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={80}
                                  dataKey="value"
                                >
                                  {statusData.map((entry, index) => (
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
                      <Col>
                        <Card className="h-100">
                          <Card.Body>
                            <h6 className="fw-bold text-center mb-3">Score Distribution</h6>
                            <ResponsiveContainer width="100%" height={250}>
                              <BarChart data={scoreChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#20c997" name="Participants" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    <hr />
                    <h6 className="fw-bold text-center mb-3">Unique Participants Summary</h6>
                    {(() => {
                       const allAttemptsForSummary = testSeriesQuizData || [];
                       const filteredAttemptsForSummary = selectedTestSeriesQuizzes.length === 0
                         ? allAttemptsForSummary
                         : allAttemptsForSummary.filter(p => selectedTestSeriesQuizzes.includes(p.quiz_title));

                       const uniqueParticipantsMap = new Map();
                      filteredAttemptsForSummary.forEach(p => {
                        if (!uniqueParticipantsMap.has(p.student_id)) {
                          uniqueParticipantsMap.set(p.student_id, {
                            ...p,
                            attemptCount: 1, // Initialize attempt count
                            totalScore: p.score,
                            bestRank: p.rank,
                          });
                        } else {
                          const existing = uniqueParticipantsMap.get(p.student_id);
                          existing.attemptCount += 1; // Increment attempt count
                          existing.totalScore += p.score;
                          if (p.rank < existing.bestRank) {
                            existing.bestRank = p.rank;
                          }
                        }
                      });
                      const uniqueParticipants = Array.from(uniqueParticipantsMap.values()).sort((a, b) => (a.bestRank || Infinity) - (b.bestRank || Infinity));

                      if (uniqueParticipants.length === 0) {
                        return <p className="text-center text-muted">No participants to display.</p>;
                      }
                      return (
                        <div className="table-responsive" style={{ maxHeight: '400px' }}>
                          <Table striped bordered hover size="sm">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Student Name</th>
                                <th>Institution</th>
                                <th>Best Rank</th>
                                <th>Total Score</th>
                                <th>Attempts</th>
                              </tr>
                            </thead>
                            <tbody>
                              {uniqueParticipants.map((p, index) => (
                                <tr key={p.student_id}>
                                  <td>{index + 1}</td>
                                  <td>{p.full_name}</td>
                                  <td>{p.school_name}</td>
                                  <td><Badge bg="primary">#{p.bestRank}</Badge></td>
                                  <td><Badge bg="success">{p.totalScore}</Badge></td>
                                  <td>
                                    <Button variant="link" size="sm" onClick={() => handleViewQuizAnalysis(p)}>{p.attemptCount}</Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      );
                    })()}
                  </>
                );
              })()}
            </Modal.Body>
          </Modal>

          {/* Test Series Institution Summary Modal */}
          <Modal
            show={showTestSeriesInstitutionSummaryModal}
            onHide={() => setShowTestSeriesInstitutionSummaryModal(false)}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">
                Unique Participants Summary for: {selectedTestSeriesInstitution?.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {(() => {
                if (!selectedTestSeriesInstitution) return null;

                const allAttempts = testSeriesQuizData || [];
                const institutionAttempts = allAttempts.filter(
                  p => p.school_name === selectedTestSeriesInstitution.name
                );

                const filteredInstitutionAttempts = selectedTestSeriesQuizzes.length === 0
                  ? institutionAttempts
                  : institutionAttempts.filter(p => selectedTestSeriesQuizzes.includes(p.quiz_title)
                );

                const uniqueParticipantsMap = new Map();
                filteredInstitutionAttempts.forEach(p => {
                  if (!uniqueParticipantsMap.has(p.student_id)) {
                    uniqueParticipantsMap.set(p.student_id, {
                      ...p,
                      attemptCount: 1,
                      totalScore: p.score,
                      bestRank: p.rank,
                    });
                  } else {
                    const existing = uniqueParticipantsMap.get(p.student_id);
                    existing.attemptCount += 1;
                    existing.totalScore += p.score;
                    if (p.rank < existing.bestRank) {
                      existing.bestRank = p.rank;
                    }
                  }
                });
                const uniqueParticipants = Array.from(uniqueParticipantsMap.values()).sort((a, b) => (a.bestRank || Infinity) - (b.bestRank || Infinity));

                if (uniqueParticipants.length === 0) {
                  return <p className="text-center text-muted">No participants to display for this institution.</p>;
                }
                return (
                  <div className="table-responsive" style={{ maxHeight: '500px' }}>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Student Name</th>
                          <th>Best Rank</th>
                          <th>Attempts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uniqueParticipants.map((p, index) => (
                          <tr key={p.student_id}>
                            <td>{index + 1}</td>
                            <td>{p.full_name}</td>
                            <td><Badge bg="primary">#{p.bestRank}</Badge></td>
                            <td>
                              <Button variant="link" size="sm" onClick={() => handleViewQuizAnalysis(p)}>{p.attemptCount}</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
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