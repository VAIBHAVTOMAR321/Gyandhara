import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Form } from 'react-bootstrap'
import axios from 'axios'
import '../../assets/css/admindashboard.css'
import { useAuth } from '../all_login/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaChevronDown, FaChevronRight } from 'react-icons/fa'
import AdminLeftNav from './AdminLeftNav'
import AdminHeader from './AdminHeader'

const API_URL = 'https://brjobsedu.com/gyandhara/gyandhara_backend/api/course-feedback/'

const CourseFeedback = () => {
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      return width >= 1024;
    }
    return true;
  });
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [feedbacks, setFeedbacks] = useState([])
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage] = useState(15)
  const [expandedCards, setExpandedCards] = useState({})

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (accessToken) {
      fetchFeedbacks()
    }
  }, [accessToken])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    let filtered = feedbacks || []

    if (searchTerm !== '') {
      filtered = filtered.filter(feedback => {
        if (!feedback) return false
        return (feedback.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (feedback.student_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (feedback.course_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (feedback.course_id || '').toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    setFilteredFeedbacks(filtered || [])
    setCurrentPage(1)
  }, [searchTerm, feedbacks])

  const fetchFeedbacks = async () => {
    if (!accessToken) {
      console.log('No access token, waiting...')
      return
    }

    try {
      setLoading(true)
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (response.data && response.data.data) {
        setFeedbacks(response.data.data)
        setFilteredFeedbacks(response.data.data)
      } else if (Array.isArray(response.data)) {
        setFeedbacks(response.data)
        setFilteredFeedbacks(response.data)
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
      setFeedbacks([])
      setFilteredFeedbacks([])
    } finally {
      setLoading(false)
    }
  }

  const toggleCardExpansion = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRatingStars = (rating) => {
    const num = parseInt(rating) || 0
    return '★'.repeat(num) + '☆'.repeat(5 - num)
  }

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage
  const currentRecords = filteredFeedbacks.slice(indexOfFirstRecord, indexOfLastRecord)
  const totalPages = Math.ceil(filteredFeedbacks.length / recordsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  if (loading) {
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
            <Container fluid className="dashboard-box">
              <div className="loading-spinner">
                <Spinner animation="border" variant="primary" />
              </div>
            </Container>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
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
            <Container fluid className="dashboard-box">
              <div className="d-flex justify-content-between align-items-center mb-4 page-header">
                <div className="d-flex align-items-center all-en-box gap-3">
                  <Button variant="outline-secondary" size="sm" onClick={() => navigate('/AdminDashboard')} className="me-2">
                    <FaArrowLeft /> Dashboard
                  </Button>
                  <h4 className="mb-0">Course Feedback</h4>
                </div>
              </div>

              <Row>
                <Col xs={12}>
                  {/* Filter Section */}
                  <Card className="mb-4">
                    <Card.Body className="py-3">
                      <Row className="g-3 align-items-end">
                        <Col md={6} xs={12}>
                          <Form.Group controlId="searchTerm">
                            <Form.Label className="small fw-medium mb-1">Search</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Search by name, student ID, course name..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              size="sm"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} xs={12}>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setSearchTerm('')}
                            className="w-100"
                          >
                            Clear Filters
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="table-card border">
                    <Card.Header className="bg-white border-bottom py-3 px-3 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center paid-btn gap-2">
                        <h5 className="mb-0 fw-semibold">
                          All Feedbacks
                        </h5>
                      </div>
                      <span className="text-muted small">
                        Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredFeedbacks.length)} of {filteredFeedbacks.length} records
                      </span>
                    </Card.Header>
                    <Card.Body className="p-0">
                      {/* Desktop Table View */}
                      <div className="table-responsive d-none d-lg-block">
                        <Table striped bordered hover responsive className="mb-0">
                          <thead className="bg-primary text-white">
                            <tr>
                              <th className="py-3 px-2">Student Name</th>
                              <th className="py-3 px-2">Student ID</th>
                              <th className="py-3 px-2">Course ID</th>
                              <th className="py-3 px-2">Course Name</th>
                              <th className="py-3 px-2">Q1</th>
                              <th className="py-3 px-2">Q2</th>
                              <th className="py-3 px-2">Q3</th>
                              <th className="py-3 px-2">Q4</th>
                              <th className="py-3 px-2">Q5</th>
                              <th className="py-3 px-2">Comment</th>
                              <th className="py-3 px-2">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentRecords.length === 0 ? (
                              <tr>
                                <td colSpan="11" className="text-center py-4 text-muted">
                                  No feedbacks found
                                </td>
                              </tr>
                            ) : (
                              currentRecords.map((feedback) => (
                                <tr key={feedback.id}>
                                  <td className="py-3 px-2 fw-medium text-dark">{feedback.full_name}</td>
                                  <td className="py-3 px-2 small">{feedback.student_id}</td>
                                  <td className="py-3 px-2 small">{feedback.course_id}</td>
                                  <td className="py-3 px-2 small">{feedback.course_name}</td>
                                  <td className="py-3 px-2 small">{getRatingStars(feedback.question_1)} ({feedback.question_1})</td>
                                  <td className="py-3 px-2 small">{getRatingStars(feedback.question_2)} ({feedback.question_2})</td>
                                  <td className="py-3 px-2 small">{getRatingStars(feedback.question_3)} ({feedback.question_3})</td>
                                  <td className="py-3 px-2 small">{getRatingStars(feedback.question_4)} ({feedback.question_4})</td>
                                  <td className="py-3 px-2 small">{getRatingStars(feedback.question_5)} ({feedback.question_5})</td>
                                  <td className="py-3 px-2 small" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {feedback.comment || '-'}
                                  </td>
                                  <td className="py-3 px-2 small">{formatDate(feedback.created_at)}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </Table>
                      </div>

                      {/* Mobile Card View */}
                      <div className="d-lg-none">
                        {currentRecords.length === 0 ? (
                          <div className="text-center py-4 text-muted">
                            No feedbacks found
                          </div>
                        ) : (
                          currentRecords.map((feedback) => (
                            <Card key={feedback.id} className="mb-3 mx-2">
                              <Card.Body className="p-3">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div>
                                    <h6 className="mb-1 fw-semibold">{feedback.full_name}</h6>
                                    <small className="text-muted">ID: {feedback.student_id}</small>
                                  </div>
                                  <small className="text-muted">{formatDate(feedback.created_at)}</small>
                                </div>

                                <div className="mb-2">
                                  <small className="text-muted d-block">Course:</small>
                                  <span className="small fw-medium">{feedback.course_name}</span>
                                  <span className="small text-muted ms-2">({feedback.course_id})</span>
                                </div>

                                {/* Ratings Summary */}
                                <div className="mb-2">
                                  <small className="text-muted d-block">Ratings:</small>
                                  <div className="d-flex flex-wrap gap-2 mt-1">
                                    <span className="badge bg-light text-dark border">
                                      Q1: {getRatingStars(feedback.question_1)}
                                    </span>
                                    <span className="badge bg-light text-dark border">
                                      Q2: {getRatingStars(feedback.question_2)}
                                    </span>
                                    <span className="badge bg-light text-dark border">
                                      Q3: {getRatingStars(feedback.question_3)}
                                    </span>
                                    <span className="badge bg-light text-dark border">
                                      Q4: {getRatingStars(feedback.question_4)}
                                    </span>
                                    <span className="badge bg-light text-dark border">
                                      Q5: {getRatingStars(feedback.question_5)}
                                    </span>
                                  </div>
                                </div>

                                {/* Expandable Details */}
                                <div className="mt-3">
                                  <Button
                                    variant="link"
                                    className="p-0 text-decoration-none d-flex align-items-center gap-1"
                                    onClick={() => toggleCardExpansion(feedback.id)}
                                  >
                                    {expandedCards[feedback.id] ? <FaChevronUp /> : <FaChevronDown />}
                                    <small>{expandedCards[feedback.id] ? 'Hide Details' : 'Show Comment'}</small>
                                  </Button>

                                  {expandedCards[feedback.id] && (
                                    <div className="mt-3 pt-3 border-top">
                                      <div>
                                        <small className="text-muted d-block">Comment:</small>
                                        <p className="small mb-0 mt-1">{feedback.comment || 'No comment'}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </Card.Body>
                            </Card>
                          ))
                        )}
                      </div>
                    </Card.Body>
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <Card.Footer className="bg-light border-top py-2 px-3">
                        <nav aria-label="Feedbacks pagination">
                          <ul className="pagination justify-content-center pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button className="page-link" onClick={handlePreviousPage}>
                                <i className="fas fa-chevron-left"></i>
                              </button>
                            </li>

                            {/* Previous pages */}
                            {currentPage > 2 && (
                              <li className="page-item">
                                <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
                              </li>
                            )}
                            {currentPage > 3 && (
                              <li className="page-item disabled">
                                <span className="page-link">...</span>
                              </li>
                            )}

                            {/* Current and surrounding pages */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).filter(page => {
                              return page >= currentPage - 1 && page <= currentPage + 1 && page <= totalPages && page >= 1
                            }).map(page => (
                              <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(page)}>
                                  {page}
                                </button>
                              </li>
                            ))}

                            {/* Next pages */}
                            {currentPage < totalPages - 2 && (
                              <li className="page-item disabled">
                                <span className="page-link">...</span>
                              </li>
                            )}
                            {currentPage < totalPages - 1 && (
                              <li className="page-item">
                                <button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                              </li>
                            )}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                              <button className="page-link" onClick={handleNextPage}>
                                <i className="fas fa-chevron-right"></i>
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </Card.Footer>
                    )}
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseFeedback
