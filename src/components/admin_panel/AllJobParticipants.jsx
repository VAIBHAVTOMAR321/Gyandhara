import React, { useState, useEffect, useMemo } from 'react'
import { Container, Row, Col, Card, Table, Button, Spinner, Form, Badge, Pagination } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from '../all_login/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaFilter, FaSearch, FaUser, FaBriefcase, FaEnvelope, FaPhone } from 'react-icons/fa'
import AdminLeftNav from './AdminLeftNav'
import AdminHeader from './AdminHeader'
import '../../assets/css/admindashboard.css'

const API_URL = 'https://brjobsedu.com/gyandhara/gyandhara_backend/api/job-opening-participation/'

const AllJobParticipants = () => {
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024)

  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [jobFilter, setJobFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (accessToken) {
      fetchParticipants()
    }
  }, [accessToken])

  const fetchParticipants = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(API_URL, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      })
      if (response.data && response.data.success) {
        setParticipants(response.data.data || [])
      } else {
        setParticipants([])
        setError('Failed to fetch participants data.')
      }
    } catch (err) {
      console.error('Error fetching participants:', err)
      setError('An error occurred while fetching participants.')
      setParticipants([])
    } finally {
      setLoading(false)
    }
  }

  const uniqueJobs = useMemo(() => {
    const jobs = new Map()
    participants.forEach(p => {
      if (p.job_details) {
        jobs.set(p.job_details.job_id, p.job_details.title)
      }
    })
    return Array.from(jobs, ([id, title]) => ({ id, title }))
  }, [participants])

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      const searchMatch = searchTerm === '' ||
        (p.student_details?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.student_details?.student_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.job_details?.title || '').toLowerCase().includes(searchTerm.toLowerCase())

      const jobMatch = jobFilter === 'all' || p.job_details?.job_id === jobFilter

      return searchMatch && jobMatch
    })
  }, [participants, searchTerm, jobFilter])

  const totalPages = Math.ceil(filteredParticipants.length / recordsPerPage)
  const currentRecords = filteredParticipants.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <AdminLeftNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} isTablet={isTablet} />
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
        <AdminLeftNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} isTablet={isTablet} />
        <div className="main-content-dash">
          <AdminHeader toggleSidebar={toggleSidebar} />
          <div className="dashboard-content">
            <Container fluid className="dashboard-box">
              <div className="d-flex justify-content-between align-items-center mb-4 page-header">
                <div className="d-flex align-items-center all-en-box gap-3">
                  <Button variant="outline-secondary" size="sm" onClick={() => navigate('/AdminDashboard')} className="me-2">
                    <FaArrowLeft /> Dashboard
                  </Button>
                  <h4 className="mb-0">Job Participants</h4>
                </div>
              </div>

              <Card className="mb-4">
                <Card.Body className="py-3">
                  <Row className="g-3 align-items-end">
                    <Col md={6} xs={12}>
                      <Form.Group controlId="searchTerm">
                        <Form.Label className="small fw-medium mb-1"><FaSearch /> Search</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Search by name, student ID, job title..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          size="sm"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} xs={12}>
                      <Form.Group controlId="jobFilter">
                        <Form.Label className="small fw-medium mb-1"><FaFilter /> Filter by Job</Form.Label>
                        <Form.Select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} size="sm">
                          <option value="all">All Jobs</option>
                          {uniqueJobs.map(job => (
                            <option key={job.id} value={job.id}>{job.title}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="table-card border">
                <Card.Header className="bg-white border-bottom py-3 px-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-semibold">All Participants ({filteredParticipants.length})</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="custom-table align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th><FaUser className="me-1" /> Student</th>
                          <th><FaBriefcase className="me-1" /> Job Title</th>
                          <th><FaEnvelope className="me-1" /> Email</th>
                          <th><FaPhone className="me-1" /> Phone</th>
                          <th>Applied At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRecords.length === 0 ? (
                          <tr><td colSpan="5" className="text-center py-4 text-muted">No participants found.</td></tr>
                        ) : (
                          currentRecords.map(p => (
                            <tr key={p.id}>
                              <td>
                                <div className="fw-bold">{p.student_details?.full_name}</div>
                                <div className="text-muted small">{p.student_details?.student_id}</div>
                              </td>
                              <td>
                                <div className="fw-medium">{p.job_details?.title}</div>
                                <div className="text-muted small">{p.job_details?.job_id}</div>
                              </td>
                              <td className="small">{p.student_details?.email}</td>
                              <td className="small">{p.student_details?.phone}</td>
                              <td className="small">{formatDate(p.applied_at)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
                {totalPages > 1 && (
                  <Card.Footer className="bg-light border-top py-2 px-3">
                    <Pagination className="justify-content-center mb-0" size="sm">
                      <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                      {[...Array(totalPages).keys()].map(num => (
                        <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => handlePageChange(num + 1)}>
                          {num + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    </Pagination>
                  </Card.Footer>
                )}
              </Card>
            </Container>
          </div>
        </div>
      </div>
    </>
  )
}

export default AllJobParticipants