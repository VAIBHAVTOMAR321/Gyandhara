import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Spinner, Badge, Alert, Button, Table } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from '../all_login/AuthContext'
import { useNavigate } from 'react-router-dom'
import UserHeader from './UserHeader'
import UserLeftNav from './UserLeftNav'
import { useLanguage } from '../all_login/LanguageContext'
import { FaBriefcase, FaClock, FaCheckCircle, FaBuilding, FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa'
import '../../assets/css/JobOpenings.css' // Reusing styles

const JobParticipants = () => {
  const { accessToken, uniqueId } = useAuth()
  const { language } = useLanguage()
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024)

  const [participations, setParticipations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    if (accessToken && uniqueId) {
      fetchParticipations()
    } else {
      setLoading(false)
    }
  }, [accessToken, uniqueId])

  const fetchParticipations = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(
        `https://brjobsedu.com/gyandhara/gyandhara_backend/api/job-opening-participation/?student_id=${uniqueId}`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      )
      if (response.data && response.data.success) {
        setParticipations(response.data.data || [])
      } else {
        setParticipations([])
        setError('Failed to fetch participation data.')
      }
    } catch (err) {
      console.error('Error fetching participations:', err)
      setError('An error occurred while fetching your applied jobs.')
      setParticipations([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const formatInterviewDate = (dateString) => {
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
        <UserLeftNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} isTablet={isTablet} />
        <div className="main-content-dash">
          <UserHeader toggleSidebar={toggleSidebar} />
          <Container fluid className="dashboard-box">
            <div className="loading-spinner">
              <Spinner animation="border" variant="primary" />
            </div>
          </Container>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <UserLeftNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} isTablet={isTablet} />
      <div className="main-content-dash">
        <UserHeader toggleSidebar={toggleSidebar} />
        <Container fluid className="dashboard-box mt-3">
          <div className="d-flex justify-content-between align-items-center mb-4 page-header">
            <div className="d-flex align-items-center all-en-box gap-3">
              <Button variant="outline-secondary" size="sm" onClick={() => navigate('/UserDashboard')} className="me-2">
                <FaArrowLeft /> {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
              </Button>
              <h4 className="mb-0">{language === 'hi' ? 'मेरे आवेदन' : 'My Applications'}</h4>
            </div>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {participations.length === 0 && !loading ? (
            <Card className="text-center py-5">
              <Card.Body>
                <FaBriefcase className="text-muted mb-3" style={{ fontSize: '48px' }} />
                <h5 className="text-muted">
                  {language === 'hi' ? 'आपने अभी तक किसी नौकरी के लिए आवेदन नहीं किया है।' : 'You have not applied for any jobs yet.'}
                </h5>
              </Card.Body>
            </Card>
          ) : (
            <Card className="table-card border">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="custom-table align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th><FaBriefcase className="me-1" /> {language === 'hi' ? 'नौकरी का शीर्षक' : 'Job Title'}</th>
                        <th><FaMapMarkerAlt className="me-1" /> {language === 'hi' ? 'स्थान' : 'Location'}</th>
                        <th><FaCalendarAlt className="me-1" /> {language === 'hi' ? 'साक्षात्कार तिथि' : 'Interview Date'}</th>
                        <th><FaClock className="me-1" /> {language === 'hi' ? 'आवेदन तिथि' : 'Applied On'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participations.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div className="fw-bold">{language === 'hi' && p.job_details?.title_hindi ? p.job_details.title_hindi : p.job_details?.title}</div>
                            <div className="text-muted small">{p.job_details?.job_id}</div>
                          </td>
                          <td className="small">{p.job_details?.location || 'N/A'}</td>
                          <td className="small">
                            {p.job_details?.interview_datetime ? formatInterviewDate(p.job_details.interview_datetime) : 'Not Scheduled'}
                          </td>
                          <td className="small">{formatDate(p.applied_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>
    </div>
  )
}

export default JobParticipants