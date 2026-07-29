import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Spinner, Badge, Alert, Button, Table, Modal } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from '../all_login/AuthContext'
import { useNavigate } from 'react-router-dom'
import UserHeader from './UserHeader'
import UserLeftNav from './UserLeftNav'
import { useLanguage } from '../all_login/LanguageContext'
import { FaBriefcase, FaClock, FaCheckCircle, FaBuilding, FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaEye, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaTools, FaLink, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa'
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
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedParticipation, setSelectedParticipation] = useState(null)

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

  const handleViewDetails = (participation) => {
    setSelectedParticipation(participation)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedParticipation(null)
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
                        <th>{language === 'hi' ? 'कार्रवाई' : 'Actions'}</th>
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
                          <td>
                            <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(p)}>
                              <FaEye className="me-1" /> {language === 'hi' ? 'विवरण देखें' : 'View Details'}
                            </Button>
                          </td>
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

      {/* Job Details Modal */}
      <Modal show={showDetailsModal} onHide={closeDetailsModal} size="lg" centered>
        <Modal.Header closeButton className="job-modal-header">
          <Modal.Title>
            {selectedParticipation && (language === 'hi' && selectedParticipation.job_details?.title_hindi ? selectedParticipation.job_details.title_hindi : selectedParticipation.job_details?.title)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {selectedParticipation && (
            <>
              <h5 className="fw-bold mb-3">{language === 'hi' ? 'नौकरी का विवरण' : 'Job Details'}</h5>
              <div className="mb-4 p-3 border rounded bg-light">
                <div className="d-flex gap-2 mb-3">
                  <Badge bg="primary">
                    {selectedParticipation.job_details?.job_type === 'full_time' ? (language === 'hi' ? 'पूर्णकालिक' : 'Full Time') :
                     selectedParticipation.job_details?.job_type === 'part_time' ? (language === 'hi' ? 'अंशकालिक' : 'Part Time') :
                     selectedParticipation.job_details?.job_type === 'internship' ? (language === 'hi' ? 'इंटर्नशिप' : 'Internship') :
                     selectedParticipation.job_details?.job_type || 'Job'}
                  </Badge>
                  <Badge bg="info">{selectedParticipation.job_details?.status}</Badge>
                </div>
                <Row className="mb-3">
                  <Col md={6} className="mb-2">
                    <div className="d-flex align-items-center">
                      <FaMapMarkerAlt className="me-2 text-primary" />
                      <span><strong>{language === 'hi' ? 'स्थान:' : 'Location:'}</strong> {selectedParticipation.job_details?.location}</span>
                    </div>
                  </Col>
                  <Col md={6} className="mb-2">
                    <div className="d-flex align-items-center">
                      <FaClock className="me-2 text-primary" />
                      <span><strong>{language === 'hi' ? 'अनुभव:' : 'Experience:'}</strong> {selectedParticipation.job_details?.experience_required}</span>
                    </div>
                  </Col>
                  <Col md={6} className="mb-2">
                    <div className="d-flex align-items-center">
                      <FaMoneyBillWave className="me-2 text-primary" />
                      <span><strong>{language === 'hi' ? 'वेतन:' : 'Salary:'}</strong> {selectedParticipation.job_details?.salary}</span>
                    </div>
                  </Col>
                  <Col md={6} className="mb-2">
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="me-2 text-primary" />
                      <span><strong>{language === 'hi' ? 'आवेदन की अंतिम तिथि:' : 'Last Date to Apply:'}</strong> {formatDate(selectedParticipation.job_details?.last_date_to_apply)}</span>
                    </div>
                  </Col>
                </Row>
                {(language === 'hi' ? selectedParticipation.job_details?.description_hindi : selectedParticipation.job_details?.description)?.length > 0 && (
                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">
                      <FaInfoCircle className="me-2" />
                      {language === 'hi' ? 'जिम्मेदारियाँ और कार्य' : 'Responsibilities & Duties'}
                    </h6>
                    <ul className="list-unstyled">
                      {(language === 'hi' ? selectedParticipation.job_details?.description_hindi : selectedParticipation.job_details?.description)?.map((desc, i) => (
                        <li key={i} className="mb-1 d-flex align-items-start">
                          <span className="me-2 text-primary">•</span>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedParticipation.job_details?.qualifications_required?.length > 0 && (
                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">
                      <FaGraduationCap className="me-2" />
                      {language === 'hi' ? 'आवश्यक योग्यताएं' : 'Qualifications Required'}
                    </h6>
                    <div className="d-flex flex-wrap gap-1">
                      {selectedParticipation.job_details?.qualifications_required.map((qual, i) => (
                        <Badge key={i} bg="info" text="white">{qual}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedParticipation.job_details?.skills_required?.length > 0 && (
                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">
                      <FaTools className="me-2" />
                      {language === 'hi' ? 'आवश्यक कौशल' : 'Skills Required'}
                    </h6>
                    <div className="d-flex flex-wrap gap-1">
                      {selectedParticipation.job_details?.skills_required.map((skill, i) => (
                        <Badge key={i} bg="warning" text="dark">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedParticipation.job_details?.apply_link && (
                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">
                      <FaLink className="me-2" />
                      {language === 'hi' ? 'आवेदन लिंक' : 'Apply Link'}
                    </h6>
                    <a href={selectedParticipation.job_details.apply_link} target="_blank" rel="noopener noreferrer">
                      {selectedParticipation.job_details.apply_link}
                    </a>
                  </div>
                )}
              </div>

              <h5 className="fw-bold mb-3 mt-4">{language === 'hi' ? 'साक्षात्कार का विवरण' : 'Interview Details'}</h5>
              <div className="mb-4 p-3 border rounded bg-light">
                {selectedParticipation.job_details?.interview_title && (
                  <p><strong>{language === 'hi' ? 'शीर्षक:' : 'Title:'}</strong> {language === 'hi' && selectedParticipation.job_details?.interview_title_hi ? selectedParticipation.job_details.interview_title_hi : selectedParticipation.job_details.interview_title}</p>
                )}
                {selectedParticipation.job_details?.interview_datetime && (
                  <p><strong>{language === 'hi' ? 'तिथि और समय:' : 'Date & Time:'}</strong> {formatInterviewDate(selectedParticipation.job_details.interview_datetime)}</p>
                )}
                {selectedParticipation.job_details?.interview_description && (
                  <p><strong>{language === 'hi' ? 'विवरण:' : 'Description:'}</strong> {language === 'hi' && selectedParticipation.job_details?.interview_description_hi ? selectedParticipation.job_details.interview_description_hi : selectedParticipation.job_details.interview_description}</p>
                )}
                {!selectedParticipation.job_details?.interview_title && !selectedParticipation.job_details?.interview_datetime && !selectedParticipation.job_details?.interview_description && (
                  <p className="text-muted">{language === 'hi' ? 'साक्षात्कार का विवरण उपलब्ध नहीं है।' : 'No interview details available.'}</p>
                )}
              </div>

              <h5 className="fw-bold mb-3 mt-4">{language === 'hi' ? 'छात्र का विवरण' : 'Student Details'}</h5>
              <div className="p-3 border rounded bg-light">
                <p><strong><FaUser className="me-2" />{language === 'hi' ? 'पूरा नाम:' : 'Full Name:'}</strong> {selectedParticipation.student_details?.full_name}</p>
                <p><strong><FaEnvelope className="me-2" />{language === 'hi' ? 'ईमेल:' : 'Email:'}</strong> {selectedParticipation.student_details?.email}</p>
                <p><strong><FaPhone className="me-2" />{language === 'hi' ? 'फोन:' : 'Phone:'}</strong> {selectedParticipation.student_details?.phone}</p>
                <p><strong><FaBuilding className="me-2" />{language === 'hi' ? 'शैक्षणिक संस्था:' : 'Institution:'}</strong> {selectedParticipation.student_details?.school_name}</p>
                <p><strong><FaMapMarkerAlt className="me-2" />{language === 'hi' ? 'स्थान:' : 'Location:'}</strong> {selectedParticipation.student_details?.district}, {selectedParticipation.student_details?.state}</p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDetailsModal}>{language === 'hi' ? 'बंद करें' : 'Close'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default JobParticipants