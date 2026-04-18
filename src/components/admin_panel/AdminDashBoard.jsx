import React, { useState, useEffect } from "react";
import { Container, Table, Badge, Spinner, Pagination } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../all_login/AuthContext";
import AdminLeftNav from "./AdminLeftNav";
import AdminHeader from "./AdminHeader";
import "../../assets/css/admindashboard.css";

const AdminDashBoard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSchools: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { accessToken } = useAuth();

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
    console.log('Access token available:', !!accessToken);
    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  const fetchData = async () => {
    if (!accessToken) {
      console.log('No access token, waiting...');
      return;
    }
    
    setLoading(true);
    console.log('Fetching data with token:', accessToken.substring(0, 20) + '...');
    try {
      const studentsRes = await axios.get(
        'https://brjobsedu.com/gyandhara/gyandhara_backend/api/student-reg/',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Students Response:', studentsRes.data);

      let studentData = [];
      if (studentsRes.data && studentsRes.data.data) {
        studentData = studentsRes.data.data;
      } else if (studentsRes.data && Array.isArray(studentsRes.data)) {
        studentData = studentsRes.data;
      }
      
      setStudents(studentData);
      setStats({
        totalStudents: studentData.length,
        totalSchools: 0
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const statCards = [
    {
      key: "students",
      icon: "bi-people",
      number: stats.totalStudents,
      label: "Total Students",
      className: ""
    },
    {
      key: "schools",
      icon: "bi-mortarboard",
      number: stats.totalSchools,
      label: "Total Schools",
      className: "schools"
    }
  ];

  const renderTable = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);
    const currentSchools = schools.slice(indexOfFirstItem, indexOfLastItem);
    
    const renderPagination = (totalItems, currentPage) => {
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      if (totalPages <= 1) return null;
      
      const items = [];
      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      items.push(
        <Pagination.Prev 
          key="prev" 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(currentPage - 1)} 
        />
      );
      
      if (startPage > 1) {
        items.push(<Pagination.Item key={1} onClick={() => setCurrentPage(1)}>{1}</Pagination.Item>);
        if (startPage > 2) items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <Pagination.Item 
            key={i} 
            active={i === currentPage} 
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
        items.push(<Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>{totalPages}</Pagination.Item>);
      }
      
      items.push(
        <Pagination.Next 
          key="next" 
          disabled={currentPage === totalPages} 
          onClick={() => setCurrentPage(currentPage + 1)} 
        />
      );
      
      return <div className="pagination-wrapper"><Pagination>{items}</Pagination></div>;
    };

    if (activeTab === "students") {
      return (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Aadhaar</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Class</th>
                <th>School</th>
                <th>District</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.length > 0 ? (
                currentStudents.map((student, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{student.student_id || "-"}</td>
                    <td>{student.full_name || "-"}</td>
                    <td>{student.aadhaar_no ? `****${student.aadhaar_no.slice(-4)}` : "-"}</td>
                    <td>{student.phone || "-"}</td>
                    <td>{student.email || "-"}</td>
                    <td>{student.class_name || "-"}</td>
                    <td>{student.school_name || "-"}</td>
                    <td>{student.district || "-"}</td>
                    <td>
                      <Badge bg={student.status === "approved" ? "success" : student.status === "rejected" ? "danger" : "warning"}>
                        {student.status || "pending"}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">No students found</td>
                </tr>
              )}
            </tbody>
          </Table>
          {renderPagination(students.length, currentPage)}
        </>
      );
    } else if (activeTab === "schools") {
      return (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>School ID</th>
                <th>School Name</th>
                <th>District</th>
                <th>State</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentSchools.length > 0 ? (
                currentSchools.map((school, index) => (
                  <tr key={index}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{school.school_uni_id || "-"}</td>
                    <td>{school.school_name || "-"}</td>
                    <td>{school.district || "-"}</td>
                    <td>{school.state || "Uttarakhand"}</td>
                    <td>
                      <Badge bg="success">Active</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No schools found</td>
                </tr>
              )}
            </tbody>
          </Table>
          {renderPagination(schools.length, currentPage)}
        </>
      );
    }
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
        <Container className="dashboard-box">
          {loading ? (
            <div className="loading-spinner">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <div className="stats-grid">
                {statCards.map((stat) => (
                  <div
                    key={stat.key}
                    className={`stat-card ${stat.className} ${activeTab === stat.key ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(stat.key);
                      setCurrentPage(1);
                    }}
                  >
                    <div className="stat-icon">
                      <i className={`bi ${stat.icon}`}></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">{stat.number}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="table-card">
                <h4>
                  {activeTab === "students" && "Student List"}
                  {activeTab === "schools" && "School List"}
                </h4>
                <div className="table-responsive">
                  {renderTable()}
                </div>
                <div className="mobile-table-wrapper">
                  {activeTab === "students" && students.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((student, index) => (
                    <div key={index} className="mobile-card">
                      <div className="mobile-card-header">
                        <span className="mobile-card-id">{student.student_id || `#${(currentPage - 1) * itemsPerPage + index + 1}`}</span>
                        <span className={`mobile-status ${student.status || 'pending'}`}>
                          {student.status || "pending"}
                        </span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Name</span>
                        <span className="mobile-card-value">{student.full_name || "-"}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Aadhaar</span>
                        <span className="mobile-card-value">{student.aadhaar_no ? `****${student.aadhaar_no.slice(-4)}` : "-"}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Phone</span>
                        <span className="mobile-card-value">{student.phone || "-"}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Email</span>
                        <span className="mobile-card-value">{student.email || "-"}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Class</span>
                        <span className="mobile-card-value">{student.class_name || "-"}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">School</span>
                        <span className="mobile-card-value">{student.school_name || "-"}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">District</span>
                        <span className="mobile-card-value">{student.district || "-"}</span>
                      </div>
                    </div>
                  ))}
                  {activeTab === "schools" && schools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((school, index) => (
                    <div key={index} className="mobile-card">
                      <div className="mobile-card-header">
                        <span className="mobile-card-id">{school.school_uni_id || `#${(currentPage - 1) * itemsPerPage + index + 1}`}</span>
                        <span className="mobile-status approved">Active</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">School Name</span>
                        <span className="mobile-card-value">{school.school_name || "-"}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">District</span>
                        <span className="mobile-card-value">{school.district || "-"}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">State</span>
                        <span className="mobile-card-value">{school.state || "Uttarakhand"}</span>
                      </div>
                    </div>
                  ))}
                  {(activeTab === "students" && students.length === 0) || (activeTab === "schools" && schools.length === 0) ? (
                    <div className="mobile-card text-center">No data found</div>
                  ) : null}
                  {students.length > itemsPerPage && activeTab === "students" && (
                    <div className="mobile-pagination">
                      <button 
                        className="mobile-page-btn" 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </button>
                      <span className="mobile-page-info">
                        Page {currentPage} of {Math.ceil(students.length / itemsPerPage)}
                      </span>
                      <button 
                        className="mobile-page-btn"
                        disabled={currentPage === Math.ceil(students.length / itemsPerPage)}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </button>
                    </div>
                  )}
                  {schools.length > itemsPerPage && activeTab === "schools" && (
                    <div className="mobile-pagination">
                      <button 
                        className="mobile-page-btn" 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </button>
                      <span className="mobile-page-info">
                        Page {currentPage} of {Math.ceil(schools.length / itemsPerPage)}
                      </span>
                      <button 
                        className="mobile-page-btn"
                        disabled={currentPage === Math.ceil(schools.length / itemsPerPage)}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </Container>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;