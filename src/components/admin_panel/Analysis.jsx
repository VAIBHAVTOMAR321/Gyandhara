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
  Alert,
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
import { FaArrowLeft } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";


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

  const [showOverallStudentAnalysisModal, setShowOverallStudentAnalysisModal] = useState(false);
  const [searchStudentId, setSearchStudentId] = useState('');
  const [searchedStudentData, setSearchedStudentData] = useState(null);
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [selectedStudentForPerformance, setSelectedStudentForPerformance] = useState(null);

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

  const handleTestSeriesPageChange = (page) => {
    setTestSeriesCurrentPage(page);
  };

  const handleSidebarToggle = () => {
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
    if (analysisType === 'competition-quiz-analysis') {
      const studentId = studentData.student_id || studentData.student?.student_id;
      const attempts = filteredCompetitionQuizParticipants.filter(p => p.student_id === studentId);
      setSelectedStudentForQuiz({
        student: {
          full_name: studentData.student_name || studentData.full_name,
          student_id: studentId,
        },
        attempts: attempts,
      });
    } else if (analysisType === 'test-series-quiz-analysis') {
      const studentId = studentData.student_id;
      const allAttemptsForStudent = testSeriesQuizData.filter(p => p.student_id === studentId);
      setSelectedStudentForQuiz({
        // The 'student' object is nested inside for consistency with other parts of the component
        student: {
          full_name: studentData.full_name,
          student_id: studentId,
        },
        // Pass all attempts for this student
        attempts: allAttemptsForStudent,
      });
    } else {
      setSelectedStudentForQuiz(studentData);
    }
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
    setSelectedStudentForStatus(student);
    setShowCourseStatusModal(true);
  };

  const handleSearchStudent = (studentId) => {
    const idToSearch = studentId || searchStudentId;
    if (!idToSearch || !idToSearch.trim()) {
      alert("Please enter a Student ID.");
      return;
    }
    setSearchingStudent(true);
    setSearchedStudentData(null);

    const studentIdToFind = idToSearch.trim();

    const courseData = analyticsData.find(s => s.student_id === studentIdToFind);
    const quizData = quizParticipantData.find(s => s.student.student_id === studentIdToFind);
    const competitionData = competitionQuizData.filter(s => s.student_id === studentIdToFind);
    const testSeriesData = testSeriesQuizData.filter(s => s.student_id === studentIdToFind);

    if (!courseData && !quizData && competitionData.length === 0 && testSeriesData.length === 0) {
      setSearchedStudentData({ notFound: true });
      setSelectedStudentForPerformance(null);
    } else {
      setSelectedStudentForPerformance(studentIdToFind);
      setSearchedStudentData({
        student_name: courseData?.student_name || quizData?.student.full_name || competitionData[0]?.student_name || testSeriesData[0]?.full_name,
        student_id: studentIdToFind,
        courseData,
        quizData,
        competitionData,
        testSeriesData,
      });
    }

    setSearchingStudent(false);
  };

  const openOverallStudentAnalysisModal = () => {
    setShowOverallStudentAnalysisModal(true);
    setSearchStudentId('');
    setSearchedStudentData(null);
    setSelectedStudentForPerformance(null);
  };

  const handleViewStudentPerformance = (studentId) => {
    setSelectedStudentForPerformance(studentId);
    setSearchStudentId(studentId);
    handleSearchStudent(studentId);
  };

  // ---------- Report helpers ----------
  const nowStr = () => new Date().toLocaleString();
  const stampStr = () => new Date().toISOString().slice(0, 10);

  const renderExportButtons = (type) => (
    <div className="d-flex gap-2">
      <Button variant="success" size="sm" onClick={() => exportReport(type, "excel")}>
        Export Excel
      </Button>
      <Button variant="danger" size="sm" onClick={() => exportReport(type, "pdf")}>
        Export PDF
      </Button>
    </div>
  );

  // ---------- Drawing primitives (jsPDF-based, no external chart lib) ----------
  const chartColors = {
    primary: [13, 110, 253],
    purple: [136, 132, 216],
    teal: [32, 201, 151],
    green: [40, 167, 69],
    red: [220, 53, 69],
    amber: [255, 193, 7],
    blue: [23, 162, 184],
    indigo: [102, 16, 242],
  };

  // Panel background behind a chart block
  const drawPanel = (doc, x, y, w, h, title) => {
    doc.setFillColor(248, 249, 252);
    doc.setDrawColor(225, 229, 235);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, y, w, h, 3, 3, "FD");
    if (title) {
      doc.setFillColor(...chartColors.primary);
      doc.roundedRect(x, y, 3, h, 3, 3, "F");
      doc.setFontSize(8.5);
      doc.setTextColor(40);
      doc.text(title, x + 6, y + 8);
      doc.setDrawColor(235);
      doc.line(x + 6, y + 11, x + w - 6, y + 11);
    }
  };

  // Donut / ring progress chart (centered inside a panel)
  const drawDonut = (doc, cx, cy, radius, percent, label, color) => {
    const start = -90;
    const end = start + (percent / 100) * 360;
    doc.setDrawColor(232);
    doc.setLineWidth(7);
    doc.circle(cx, cy, radius, "S");
    if (percent > 0) {
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(7);
      doc.circle(cx, cy, radius, "FD", (start * Math.PI) / 180, (end * Math.PI) / 180, false);
    }
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.setFontSize(13);
    doc.setTextColor(30);
    doc.text(`${percent.toFixed(1)}%`, cx, cy + 4, { align: "center" });
    doc.setFontSize(7);
    doc.setTextColor(110);
    doc.text(label, cx, cy + radius + 8, { align: "center" });
    doc.setTextColor(0);
  };

  // Horizontal-aware bar chart with axis
  const drawBarChart = (doc, x, y, w, h, data, color, label) => {
    doc.setFontSize(7.5);
    doc.setTextColor(60);
    if (label) doc.text(label, x, y - 3);
    const max = Math.max(...data.map((d) => d.value), 1);
    const n = data.length;
    const innerTop = y + 4;
    const axisY = innerTop + h - 14;
    const gap = w / n < 28 ? 4 : 8;
    const barW = (w - gap * (n + 1)) / n;
    doc.setDrawColor(225);
    doc.setLineWidth(0.3);
    doc.line(x, axisY, x + w, axisY);
    data.forEach((d, i) => {
      const bh = (d.value / max) * (h - 22);
      const bx = x + gap + i * (barW + gap);
      const by = axisY - bh;
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(bx, by, barW, bh, 1.5, 1.5, "F");
      doc.setFontSize(6);
      doc.setTextColor(70);
      doc.text(String(d.value), bx + barW / 2, by - 2, { align: "center" });
      const lbl = d.label.length > 12 ? `${d.label.substring(0, 11)}..` : d.label;
      doc.text(lbl, bx + barW / 2, axisY + 7, { align: "center" });
    });
    doc.setTextColor(0);
  };

  // Pie chart (proportional slices) with side legend
  const drawPie = (doc, cx, cy, radius, data, label) => {
    doc.setFontSize(7.5);
    doc.setTextColor(60);
    if (label) doc.text(label, cx - radius, cy - radius - 6);
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    let startAngle = 0;
    data.forEach((d) => {
      const slice = (d.value / total) * 2 * Math.PI;
      doc.setFillColor(d.color[0], d.color[1], d.color[2]);
      doc.setDrawColor(255);
      doc.setLineWidth(0.6);
      doc.path([
        [cx, cy],
        [cx + radius * Math.cos(startAngle), cy + radius * Math.sin(startAngle)],
        [cx + radius * Math.cos(startAngle + slice), cy + radius * Math.sin(startAngle + slice)],
        [cx, cy],
      ], "FD");
      startAngle += slice;
    });
    let ly = cy - radius;
    const legendX = cx + radius + 14;
    data.forEach((d) => {
      doc.setFillColor(d.color[0], d.color[1], d.color[2]);
      doc.roundedRect(legendX, ly, 5, 5, 1, 1, "F");
      doc.setFontSize(7);
      doc.setTextColor(60);
      doc.text(`${d.label}: ${d.value}`, legendX + 8, ly + 4);
      ly += 8;
    });
    doc.setTextColor(0);
  };

  const addStatCards = (doc, x, y, cards, colW) => {
    const cardH = 20;
    cards.forEach((c, i) => {
      const cx = x + i * colW;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(225, 229, 235);
      doc.setLineWidth(0.5);
      doc.roundedRect(cx, y, colW - 8, cardH, 3, 3, "FD");
      doc.setFillColor(...chartColors.primary);
      doc.roundedRect(cx, y, 2, cardH, 3, 3, "F");
      doc.setFontSize(15);
      doc.setTextColor(20);
      doc.text(String(c.value), cx + 10, y + 11, { align: "left" });
      doc.setFontSize(6.5);
      doc.setTextColor(120);
      doc.text(c.label.toUpperCase(), cx + 10, y + 16, { align: "left" });
    });
    doc.setTextColor(0);
    return y + cardH;
  };

  // Auto-flow charts responsively; returns next y position
  const renderCharts = (doc, charts, marginX, startY, pageW, pageH) => {
    if (!charts || !charts.length) return startY;
    const perRow = charts.length >= 4 ? 2 : charts.length === 3 ? 2 : 1;
    const colW = (pageW - marginX * 2 - (perRow - 1) * 10) / perRow;
    const panelH = 62;
    const pieLegendExtra = (data) => (data || []).length * 8;
    let col = 0;
    let rowY = startY;
    let rowMaxBottom = startY;

    charts.forEach((ch) => {
      let chartH = panelH;
      if (ch.type === "bar") chartH = panelH + (ch.data.length > 6 ? 6 : 0);
      if (ch.type === "pie") chartH = panelH + pieLegendExtra(ch.data) - 8;

      if (col === 0 && rowY + chartH > pageH - 18) {
        doc.addPage();
        rowY = 16;
        rowMaxBottom = 16;
      }
      const px = marginX + col * (colW + 10);
      const py = rowY;

      if (ch.type === "donut") {
        drawPanel(doc, px, py, colW, panelH, ch.label);
        drawDonut(doc, px + colW / 2, py + panelH / 2 + 4, 18, ch.percent, ch.label, ch.color);
      } else if (ch.type === "bar") {
        drawPanel(doc, px, py, colW, chartH, ch.label);
        drawBarChart(doc, px + 8, py + 16, colW - 16, chartH - 22, ch.data, ch.color, null);
      } else if (ch.type === "pie") {
        drawPanel(doc, px, py, colW, chartH, ch.label);
        drawPie(doc, px + colW / 3, py + 16 + (chartH - 22) / 2, 14, ch.data, null);
      }

      rowMaxBottom = Math.max(rowMaxBottom, py + chartH);
      col += 1;
      if (col >= perRow) { col = 0; rowY = rowMaxBottom + 10; }
    });
    if (col !== 0) rowY = rowMaxBottom + 10;
    return rowY;
  };

  // Page header & footer
  const drawPageChrome = (doc, title, pageNum, totalPages, pageW, pageH) => {
    doc.setFillColor(...chartColors.primary);
    doc.rect(0, 0, pageW, 2, "F");
    if (pageNum > 1) {
      doc.setFontSize(9);
      doc.setTextColor(30);
      doc.text(title, 14, 12);
      doc.setDrawColor(235);
      doc.line(14, 15, pageW - 14, 15);
    }
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text("Gyaan Dhara - Analytics Report", 14, pageH - 6);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageW - 14, pageH - 6, { align: "right" });
    doc.setTextColor(0);
  };

  const exportToPDF = ({ title, summaryCards, charts, tables, fileName }) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const marginX = 14;

    // Cover header
    doc.setFillColor(...chartColors.primary);
    doc.rect(0, 0, pageW, 22, "F");
    doc.setFillColor(255, 255, 255);
    doc.setFontSize(17);
    doc.text("Gyaan Dhara", marginX, 11);
    doc.setFontSize(13);
    doc.text(title, marginX, 18);
    doc.setFontSize(8);
    doc.text(`Generated on: ${nowStr()}`, pageW - marginX, 11, { align: "right" });

    let y = 30;
    if (summaryCards && summaryCards.length) {
      const colW = (pageW - marginX * 2) / summaryCards.length;
      y = addStatCards(doc, marginX, y, summaryCards, colW) + 12;
    }

    y = renderCharts(doc, charts, marginX, y, pageW, pageH);

    tables.forEach((t) => {
      if (y > pageH - 40) { doc.addPage(); y = 16; }
      doc.setFillColor(...chartColors.primary);
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      const labelW = Math.min(pageW - marginX * 2, 60 + t.title.length * 1.6);
      doc.roundedRect(marginX, y, labelW, 7, 1.5, 1.5, "F");
      doc.text(t.title, marginX + 4, y + 5);
      doc.setTextColor(0);
      y += 9;
      autoTable(doc, {
        startY: y,
        head: [t.columns],
        body: t.rows,
        styles: { fontSize: 7, cellPadding: 1.5, lineColor: [230, 232, 236], lineWidth: 0.2 },
        headStyles: { fillColor: chartColors.primary, fontSize: 7.5 },
        alternateRowStyles: { fillColor: [246, 248, 251] },
        margin: { left: marginX, right: marginX },
        didParseCell: (h) => {
          if (t.columnStyles && t.columnStyles[h.column]) {
            h.cell.styles = { ...h.cell.styles, ...t.columnStyles[h.column] };
          }
        },
      });
      y = doc.lastAutoTable.finalY + 10;
    });

    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      drawPageChrome(doc, title, p, totalPages, pageW, pageH);
    }

    doc.save(fileName);
  };

  const rowsToObjectsArray = (columns, rows) =>
    rows.map((r) => {
      const obj = {};
      columns.forEach((c, i) => { obj[c] = r[i]; });
      return obj;
    });

  const exportToExcel = ({ title, summaryCards, tables, charts, fileName }) => {
    const wb = XLSX.utils.book_new();

    // ---- Summary sheet (styled) ----
    const summaryAoa = [
      ["GYAAN DHARA - ANALYTICS REPORT"],
      [title],
      [`Generated on: ${nowStr()}`],
      [],
    ];
    if (summaryCards && summaryCards.length) {
      summaryAoa.push(["KEY METRICS"]);
      summaryAoa.push(summaryCards.map((c) => c.label));
      summaryAoa.push(summaryCards.map((c) => c.value));
      summaryAoa.push([]);
    }
    if (charts && charts.length) {
      summaryAoa.push(["CHART DATA"]);
      charts.forEach((ch) => {
        summaryAoa.push([(ch.label || ch.type).toUpperCase()]);
        if (ch.type === "bar" || ch.type === "pie") {
          summaryAoa.push(["Category", "Value"]);
          ch.data.forEach((d) => summaryAoa.push([d.label, d.value]));
        } else if (ch.type === "donut") {
          summaryAoa.push([ch.label, `${ch.percent.toFixed(1)}%`]);
        }
        summaryAoa.push([]);
      });
    }
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryAoa);
    wsSummary["!cols"] = [{ wch: 32 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }];
    if (!wsSummary["!merges"]) wsSummary["!merges"] = [];
    wsSummary["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } });
    wsSummary["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 4 } });
    wsSummary["!merges"].push({ s: { r: 2, c: 0 }, e: { r: 2, c: 4 } });
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    // ---- Detail sheets ----
    tables.forEach((t) => {
      const data = rowsToObjectsArray(t.columns, t.rows);
      const ws = XLSX.utils.json_to_sheet(data, { header: t.columns });
      // column widths based on content
      const widths = t.columns.map((col) => {
        const maxLen = Math.max(
          String(col).length,
          ...data.map((row) => String(row[col] ?? "").length)
        );
        return { wch: Math.min(Math.max(maxLen + 3, 10), 40) };
      });
      ws["!cols"] = widths;
      ws["!autofilter"] = { ref: ws["!ref"] };
      XLSX.utils.book_append_sheet(wb, ws, t.title.replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 28) || "Sheet");
    });

    XLSX.writeFile(wb, fileName);
  };

  // ---------- Per-analysis report builders ----------
  const buildCourseWiseReport = () => {
    const totalStudents = analyticsData.length;
    const totalCourses = Object.keys(courseSummary).length;
    const totalInstitutions = Object.keys(institutionSummary).length;
    const totalEnrollments = Object.values(courseSummary).reduce((s, c) => s + c.studentCount, 0);
    const totalCompleted = Object.values(courseSummary).reduce((s, c) => s + c.completedStudentCount, 0);
    const completionRate = totalEnrollments > 0 ? (totalCompleted / totalEnrollments) * 100 : 0;

    const topCourses = Object.values(courseSummary)
      .sort((a, b) => b.studentCount - a.studentCount)
      .slice(0, 6)
      .map((c) => ({ label: c.name, value: c.studentCount }));

    const instRows = Object.values(institutionSummary).map((inst, i) => [
      i + 1, inst.name, inst.studentCount, inst.completedStudentCount,
      inst.studentCount > 0 ? `${((inst.completedStudentCount / inst.studentCount) * 100).toFixed(1)}%` : "0%",
    ]);
    const courseRows = Object.values(courseSummary).map((c, i) => [
      i + 1, c.name, c.studentCount, c.completedStudentCount,
      c.studentCount > 0 ? `${((c.completedStudentCount / c.studentCount) * 100).toFixed(1)}%` : "0%",
    ]);
    const studentRows = analyticsData.map((s, i) => [
      i + 1, s.student_name, s.student_id, s.school_name, s.district,
      s.courses.length,
      s.courses.filter((c) => c.modules.length > 0 && c.modules.every((m) => m.module_status === "completed")).length,
    ]);

    const summaryCards = [
      { label: "Total Students", value: totalStudents },
      { label: "Total Courses", value: totalCourses },
      { label: "Institutions", value: totalInstitutions },
      { label: "Total Enrollments", value: totalEnrollments },
      { label: "Completion Rate", value: `${completionRate.toFixed(1)}%` },
    ];
    const charts = [
      { type: "donut", percent: completionRate, label: "Course Completion", color: chartColors.primary },
      { type: "bar", data: topCourses, label: "Top Enrolled Courses", color: chartColors.purple },
    ];
    const tables = [
      { title: "Course Summary", columns: ["#", "Course Name", "Enrolled", "Completed", "Completion %"], rows: courseRows },
      { title: "Institution Summary", columns: ["#", "Institution", "Students", "Completed", "Completion %"], rows: instRows },
      { title: "Student Details", columns: ["#", "Student Name", "Student ID", "Institution", "District", "Enrolled", "Completed"], rows: studentRows },
    ];
    return { title: "Course Wise Analysis Report", summaryCards, charts, tables };
  };

  const buildQuizParticipantReport = () => {
    const participants = filteredQuizData;
    const totalParticipants = participants.length;
    const totalQuizzes = quizItems.length;
    const totalAttempts = participants.reduce((s, p) => s + p.attempts.length, 0);
    const allScores = participants.flatMap((p) => p.attempts.map((a) => a.score || 0));
    const avgScore = allScores.length ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
    const passCount = participants.filter((p) => p.attempts.some((a) => a.status === "passed")).length;
    const passRate = totalParticipants ? (passCount / totalParticipants) * 100 : 0;

    const quizWise = quizItems.map((q) => {
      const attempts = participants.flatMap((p) => p.attempts.filter((a) => a.quiz_id === q.quiz_id));
      const scores = attempts.map((a) => a.score || 0);
      const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      return { label: q.title.length > 12 ? `${q.title.substring(0, 11)}..` : q.title, value: Number(avg.toFixed(1)) };
    }).filter((q) => q.value > 0);

    const instSummary = Object.values(filteredInstitutionSummary).map((inst, i) => [
      i + 1, inst.name, inst.participantCount || 0,
    ]);

    const studentRows = participants.map((d, i) => [
      i + 1, d.student.full_name, d.student.student_id, d.student.school_name,
      d.bestRank !== null ? `#${d.bestRank}` : "N/A",
      d.attempts.length,
    ]);

    const summaryCards = [
      { label: "Total Students", value: totalParticipants },
      { label: "Total Quizzes", value: totalQuizzes },
      { label: "Total Attempts", value: totalAttempts },
      { label: "Avg Score", value: avgScore.toFixed(1) },
      { label: "Pass Rate", value: `${passRate.toFixed(1)}%` },
    ];
    const charts = [
      { type: "donut", percent: passRate, label: "Pass Rate", color: chartColors.green },
      { type: "bar", data: quizWise, label: "Avg Score per Quiz", color: chartColors.purple },
      { type: "pie", label: "Pass / Fail", data: [
        { label: "Passed", value: passCount, color: chartColors.green },
        { label: "Not Passed", value: totalParticipants - passCount, color: chartColors.red },
      ] },
    ];
    const tables = [
      { title: "Institution Summary", columns: ["#", "Institution", "Participants"], rows: instSummary },
      { title: "Participant Details", columns: ["#", "Student Name", "Student ID", "Institution", "Best Rank", "Attempts"], rows: studentRows },
    ];
    return { title: "Quiz Participant Analysis Report", summaryCards, charts, tables };
  };

  const buildCompetitionQuizReport = () => {
    const participants = filteredCompetitionQuizParticipants;
    const totalParticipants = participants.length;
    const totalQuizzes = [...new Set(participants.map((p) => p.quiz_title))].length;
    const totalScore = participants.reduce((s, p) => s + (p.score || 0), 0);
    const avgScore = totalParticipants ? totalScore / totalParticipants : 0;
    const passCount = participants.filter((p) => p.status === "passed").length;
    const passRate = totalParticipants ? (passCount / totalParticipants) * 100 : 0;

    const quizWise = Object.values(
      participants.reduce((acc, p) => {
        if (!acc[p.quiz_title]) acc[p.quiz_title] = { label: p.quiz_title, scores: [], count: 0 };
        acc[p.quiz_title].scores.push(p.score || 0);
        acc[p.quiz_title].count += 1;
        return acc;
      }, {})
    ).map((q) => ({ label: q.label.length > 12 ? `${q.label.substring(0, 11)}..` : q.label, value: Number((q.scores.reduce((a, b) => a + b, 0) / q.scores.length).toFixed(1)) }));

    const instSummary = Object.values(filteredCompetitionInstitutionSummary).map((inst, i) => [
      i + 1, inst.name, inst.participantCount || 0,
      inst.averageScore ? inst.averageScore.toFixed(1) : "0",
    ]);

    const studentRows = participants.map((p, i) => [
      i + 1, p.student_name, p.student_id, p.school_name, `#${p.rank}`, p.attemptCount,
    ]);

    const summaryCards = [
      { label: "Total Participants", value: totalParticipants },
      { label: "Total Quizzes", value: totalQuizzes },
      { label: "Avg Score", value: avgScore.toFixed(1) },
      { label: "Pass Rate", value: `${passRate.toFixed(1)}%` },
    ];
    const charts = [
      { type: "donut", percent: passRate, label: "Pass Rate", color: chartColors.green },
      { type: "bar", data: quizWise, label: "Avg Score per Quiz", color: chartColors.purple },
      { type: "pie", label: "Pass / Fail", data: [
        { label: "Passed", value: passCount, color: chartColors.green },
        { label: "Failed", value: totalParticipants - passCount, color: chartColors.red },
      ] },
    ];
    const tables = [
      { title: "Institution Summary", columns: ["#", "Institution", "Participants", "Avg Score"], rows: instSummary },
      { title: "Participant Details", columns: ["#", "Student Name", "Student ID", "Institution", "Rank", "Attempts"], rows: studentRows },
    ];
    return { title: "Competition Quiz Analysis Report", summaryCards, charts, tables };
  };

  const buildTestSeriesReport = () => {
    const allAttempts = testSeriesQuizData || [];
    const filteredAttempts = selectedTestSeriesQuizzes.length === 0
      ? allAttempts
      : allAttempts.filter((p) => selectedTestSeriesQuizzes.includes(p.quiz_title));
    const participants = filteredAttempts;
    const totalParticipants = new Set(participants.map((p) => p.student_id)).size;
    const totalAttempts = participants.length;
    const totalScore = participants.reduce((s, p) => s + (p.score || 0), 0);
    const avgScore = totalAttempts ? totalScore / totalAttempts : 0;
    const passCount = participants.filter((p) => p.status === "passed" || p.status === "merit").length;
    const passRate = totalAttempts ? (passCount / totalAttempts) * 100 : 0;

    const quizWise = Object.values(
      participants.reduce((acc, p) => {
        if (!acc[p.quiz_title]) acc[p.quiz_title] = { label: p.quiz_title, scores: [], count: 0 };
        acc[p.quiz_title].scores.push(p.score || 0);
        acc[p.quiz_title].count += 1;
        return acc;
      }, {})
    ).map((q) => ({ label: q.label.length > 12 ? `${q.label.substring(0, 11)}..` : q.label, value: Number((q.scores.reduce((a, b) => a + b, 0) / q.scores.length).toFixed(1)) }));

    const scoreDist = participants.reduce((acc, p) => {
      const s = p.score || 0;
      if (s >= 9) acc["9-10"]++; else if (s >= 7) acc["7-8"]++; else if (s >= 5) acc["5-6"]++; else if (s >= 3) acc["3-4"]++; else acc["0-2"]++;
      return acc;
    }, { "0-2": 0, "3-4": 0, "5-6": 0, "7-8": 0, "9-10": 0 });
    const scoreDistData = Object.keys(scoreDist).map((k) => ({ label: k, value: scoreDist[k] }));

    const instSummary = Object.values(testSeriesQuizInstitutionSummary).map((inst, i) => [
      i + 1, inst.name, inst.participantCount || 0,
    ]);

    const uniqueMap = new Map();
    filteredAttempts.forEach((p) => {
      if (!uniqueMap.has(p.student_id)) uniqueMap.set(p.student_id, { ...p, attemptCount: 1, totalScore: p.score, bestRank: p.rank });
      else {
        const e = uniqueMap.get(p.student_id);
        e.attemptCount += 1; e.totalScore += p.score;
        if (p.rank < e.bestRank) e.bestRank = p.rank;
      }
    });
    const uniqueParticipants = Array.from(uniqueMap.values()).sort((a, b) => (a.bestRank || Infinity) - (b.bestRank || Infinity));
    const studentRows = uniqueParticipants.map((p, i) => [
      i + 1, p.full_name, p.student_id, p.school_name, `#${p.bestRank}`, p.attemptCount, p.totalScore,
    ]);

    const summaryCards = [
      { label: "Unique Participants", value: totalParticipants },
      { label: "Total Attempts", value: totalAttempts },
      { label: "Avg Score", value: avgScore.toFixed(1) },
      { label: "Pass Rate", value: `${passRate.toFixed(1)}%` },
    ];
    const charts = [
      { type: "donut", percent: passRate, label: "Pass Rate", color: chartColors.green },
      { type: "bar", data: quizWise, label: "Avg Score per Quiz", color: chartColors.purple },
      { type: "bar", data: scoreDistData, label: "Score Distribution", color: chartColors.teal },
      { type: "pie", label: "Pass / Fail", data: [
        { label: "Passed/Merit", value: passCount, color: chartColors.green },
        { label: "Failed", value: totalAttempts - passCount, color: chartColors.red },
      ] },
    ];
    const tables = [
      { title: "Institution Summary", columns: ["#", "Institution", "Participants"], rows: instSummary },
      { title: "Unique Participants", columns: ["#", "Student Name", "Student ID", "Institution", "Best Rank", "Attempts", "Total Score"], rows: studentRows },
    ];
    return { title: "Test Series Quiz Analysis Report", summaryCards, charts, tables };
  };

  const exportReport = (type, format) => {
    const stamp = stampStr();
    let report;
    if (type === "course-wise") report = buildCourseWiseReport();
    else if (type === "quiz-participant-wise") report = buildQuizParticipantReport();
    else if (type === "competition-quiz-analysis") report = buildCompetitionQuizReport();
    else if (type === "test-series-quiz-analysis") report = buildTestSeriesReport();
    else return;

    const fileName = `${report.title.replace(/\s+/g, "-").toLowerCase()}-${stamp}`;
    if (format === "pdf") exportToPDF({ ...report, fileName: `${fileName}.pdf` });
    else exportToExcel({ ...report, fileName: `${fileName}.xlsx` });
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
                <Row className="align-items-center g-3">
                  <Col md={5}>
                    <Form.Group controlId="analysisType">
                      <Form.Label>Analysis Type</Form.Label>
                      <Form.Select
                        value={analysisType}
                        onChange={(e) => setAnalysisType(e.target.value)}
                      >
                        <option value="course-wise">Course Wise</option>
                        <option value="quiz-participant-wise">Quiz Participant</option>
                        <option value="competition-quiz-analysis">Competition Quiz</option>
                        <option value="test-series-quiz-analysis">Test Series Quiz</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Button variant="info" className="w-100 text-white mt-3" onClick={() => openOverallStudentAnalysisModal()}>
                      Student Performance
                    </Button>
                  </Col>
                  <Col md={4}>
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

            {analysisType === 'quiz-participant-wise' && (
              <div className="d-flex justify-content-end gap-2 mb-3">
                <Button variant="primary" onClick={handleShowQuizParticipantOverallAnalysis}>
                  Overall Analysis
                </Button>
                {renderExportButtons("quiz-participant-wise")}
              </div>
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
                <div className="d-flex justify-content-end gap-2 mb-3">
                  <Button variant="primary" onClick={handleShowOverallAnalysis}>
                    Overall Analysis
                  </Button>
                  {renderExportButtons("course-wise")}
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
            ) : analysisType === 'competition-quiz-analysis' ? (
              <>
                <div className="d-flex justify-content-end gap-2 mb-3">
                  <Button variant="primary" onClick={handleShowCompetitionQuizOverallAnalysis}>
                    Overall Analysis
                  </Button>
                  {renderExportButtons("competition-quiz-analysis")}
                </div>
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
                                onClick={() => handleViewQuizAnalysis(participant)}
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
                <div className="d-flex justify-content-end gap-2 mb-3">
                  <Button variant="primary" onClick={handleShowTestSeriesQuizOverallAnalysis}>
                    Overall Analysis
                  </Button>
                  {renderExportButtons("test-series-quiz-analysis")}
                </div>
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
                                onClick={() => handleViewQuizAnalysis(participant)}
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

          {/* Course-wise Student Detail Modal */}
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
          {selectedStudentForQuiz && analysisType === 'quiz-participant-wise' && (
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

          {/* Competition Quiz Participant Analysis Modal */}
          {selectedStudentForQuiz && (analysisType === 'competition-quiz-analysis' || analysisType === 'test-series-quiz-analysis') && (
            <Modal
              show={showQuizAnalysisModal}
              onHide={() => setShowQuizAnalysisModal(false)}
              size="xl"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {analysisType === 'competition-quiz-analysis' ? 'Competition' : 'Test Series'} Quiz Analysis for: {
                    selectedStudentForQuiz.student?.full_name || selectedStudentForQuiz.full_name
                  }
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Quiz Title</th>
                      <th>Score</th>
                      <th>Rank</th>
                      <th>Status</th>
                      <th>Submitted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudentForQuiz.attempts.map((attempt, index) => (
                      <tr key={index}>
                        <td><Badge bg="secondary">{attempt.quiz_title}</Badge></td>
                        <td>
                          <Badge bg={attempt.score > 5 ? "success" : "warning"}>
                            {attempt.score}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={attempt.rank <= 10 ? "primary" : "secondary"}>
                            #{attempt.rank}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={attempt.status === 'passed' ? 'success' : 'danger'}>
                            {attempt.status}
                          </Badge>
                        </td>
                        <td>
                          {attempt.submitted_at && attempt.started_at ? (
                            (() => {
                              const duration = new Date(attempt.submitted_at) - new Date(attempt.started_at);
                              const minutes = Math.floor(duration / 60000);
                              const seconds = ((duration % 60000) / 1000).toFixed(0);
                              return `${minutes}m ${seconds}s`;
                            })()
                          ) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowQuizAnalysisModal(false)}>
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

          {/* Overall Student Analysis Modal */}
          <Modal
            show={showOverallStudentAnalysisModal}
            onHide={() => setShowOverallStudentAnalysisModal(false)}
            centered
            size="xl"
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Student Performance Analysis</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedStudentForPerformance && searchedStudentData && !searchedStudentData.notFound ? (
                <Row>
                  <Col md={12} className="mb-3">
                    <Button variant="outline-secondary" size="sm" onClick={() => { setSelectedStudentForPerformance(null); setSearchedStudentData(null); setSearchStudentId(''); }}>
                      <FaArrowLeft className="me-1" /> Back to Students List
                    </Button>
                  </Col>
                  <Col md={12} className="mb-4">
                    <Card className="text-center">
                      <Card.Body>
                        <h4 className="fw-bold">{searchedStudentData.student_name}</h4>
                        <p className="text-muted mb-0">Student ID: {searchedStudentData.student_id}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  {searchedStudentData.courseData && (
                    <Col md={12} className="mb-4">
                      <h5 className="fw-bold mb-3">Course Analysis</h5>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Course Name</th>
                            <th>Progress</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchedStudentData.courseData.courses.map((course, idx) => {
                            const completedModules = course.modules.filter(m => m.module_status === 'completed').length;
                            const progress = course.modules.length > 0 ? (completedModules / course.modules.length) * 100 : 0;
                            const isCompleted = progress === 100;
                            return (
                              <tr key={idx}>
                                <td>{course.course_name}</td>
                                <td style={{ minWidth: '200px' }}>
                                  <ProgressBar now={progress} label={`${progress.toFixed(0)}%`} variant={isCompleted ? 'success' : 'primary'} />
                                </td>
                                <td>
                                  <Badge bg={isCompleted ? 'success' : 'warning'}>
                                    {isCompleted ? 'Completed' : 'In Progress'}
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </Col>
                  )}
                  {searchedStudentData.quizData && (
                    <Col md={12} className="mb-4">
                      <h5 className="fw-bold mb-3">Quiz Participant Analysis</h5>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Quiz Title</th>
                            <th>Score</th>
                            <th>Rank</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchedStudentData.quizData.attempts.map((attempt, idx) => (
                            <tr key={idx}>
                              <td><Badge bg="secondary">{quizTitleMap[attempt.quiz_id] || attempt.quiz_id}</Badge></td>
                              <td>{attempt.score}</td>
                              <td><Badge bg="primary">#{attempt.rank}</Badge></td>
                              <td>
                                <Badge bg={attempt.status === 'passed' ? 'success' : 'danger'}>
                                  {attempt.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  )}
                  {searchedStudentData.competitionData && searchedStudentData.competitionData.length > 0 && (
                    <Col md={12} className="mb-4">
                      <h5 className="fw-bold mb-3">Competition Quiz Analysis</h5>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Quiz Title</th>
                            <th>Score</th>
                            <th>Rank</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchedStudentData.competitionData.map((entry, idx) => (
                            <tr key={idx}>
                              <td><Badge bg="info">{entry.quiz_title}</Badge></td>
                              <td>{entry.score}</td>
                              <td><Badge bg="primary">#{entry.rank}</Badge></td>
                              <td>
                                <Badge bg={entry.status === 'passed' ? 'success' : 'danger'}>
                                  {entry.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  )}
                  {searchedStudentData.testSeriesData && searchedStudentData.testSeriesData.length > 0 && (
                    <Col md={12} className="mb-4">
                      <h5 className="fw-bold mb-3">Test Series Quiz Analysis</h5>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Quiz Title</th>
                            <th>Score</th>
                            <th>Rank</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchedStudentData.testSeriesData.map((entry, idx) => (
                            <tr key={idx}>
                              <td><Badge bg="secondary">{entry.quiz_title}</Badge></td>
                              <td>{entry.score}</td>
                              <td><Badge bg="primary">#{entry.rank}</Badge></td>
                              <td>
                                <Badge bg={entry.status === 'passed' || entry.status === 'merit' ? 'success' : 'danger'}>
                                  {entry.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  )}
                </Row>
              ) : (
                <Row>
                  <Col md={12}>
                    <h5 className="fw-bold mb-3">All Students</h5>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Student Name</th>
                          <th>Student ID</th>
                          <th>Institution</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const uniqueStudentsMap = new Map();
                          analyticsData.forEach(s => uniqueStudentsMap.set(s.student_id, s));
                          quizParticipantData.forEach(s => uniqueStudentsMap.set(s.student.student_id, { student_name: s.student.full_name, student_id: s.student.student_id, school_name: s.student.school_name }));
                          competitionQuizData.forEach(s => {
                            if (!uniqueStudentsMap.has(s.student_id)) {
                              uniqueStudentsMap.set(s.student_id, { student_name: s.student_name, student_id: s.student_id, school_name: s.school_name });
                            }
                          });
                          testSeriesQuizData.forEach(s => {
                            if (!uniqueStudentsMap.has(s.student_id)) {
                              uniqueStudentsMap.set(s.student_id, { student_name: s.full_name, student_id: s.student_id, school_name: s.school_name });
                            }
                          });
                          const uniqueStudents = Array.from(uniqueStudentsMap.values()).sort((a, b) => (a.student_name || '').localeCompare(b.student_name || ''));
                          return uniqueStudents.map((student, index) => (
                            <tr key={student.student_id}>
                              <td>{index + 1}</td>
                              <td>{student.student_name}</td>
                              <td>{student.student_id}</td>
                              <td>{student.school_name || '-'}</td>
                              <td>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleViewStudentPerformance(student.student_id)}
                                >
                                  View Analysis
                                </Button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowOverallStudentAnalysisModal(false)}>
                Close
              </Button>
            </Modal.Footer>
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