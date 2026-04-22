import React, { useState, useEffect, useMemo } from 'react'
import { Container, Row, Col, Card, Spinner, Badge, Button, Form, Modal, Nav, Tab, Alert } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from '../all_login/AuthContext'
import { useNavigate } from 'react-router-dom'
import UserHeader from './UserHeader'
import UserLeftNav from './UserLeftNav'
import { 
  FaBriefcase, FaMapMarkerAlt, FaClock, FaMoneyBillWave, 
  FaGraduationCap, FaExternalLinkAlt, FaSearch, FaFilter, 
  FaInfoCircle, FaChalkboardTeacher, FaTools 
} from 'react-icons/fa'
import '../../assets/css/JobOpenings.css'

const JobOpenings = () => {
  const { accessToken, uniqueId } = useAuth()
  const navigate = useNavigate()
  
  // --- Layout & Sidebar State ---
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  
  // --- Data State ---
  const [jobs, setJobs] = useState([])
  const [seminars, setSeminars] = useState([])
  const [workshops, setWorkshops] = useState([])
  
  // --- UI State ---
  const [loading, setLoading] = useState(true)
  const [loadingSeminars, setLoadingSeminars] = useState(true)
  const [loadingWorkshops, setLoadingWorkshops] = useState(true)
  const [error, setError] = useState(null)
  const [errorSeminars, setErrorSeminars] = useState(null)
  const [errorWorkshops, setErrorWorkshops] = useState(null)
  
  // --- Language State ---
  const [language, setLanguage] = useState('en')
  const isLanguageHindi = language === 'hi'

  // --- Filter State ---
  const [selectedQualification, setSelectedQualification] = useState('')
  const [selectedSeminarEligibility, setSelectedSeminarEligibility] = useState('')
  const [selectedWorkshopEligibility, setSelectedWorkshopEligibility] = useState('')

  // --- Modal State ---
  const [showJobModal, setShowJobModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [showSeminarModal, setShowSeminarModal] = useState(false)
  const [selectedSeminar, setSelectedSeminar] = useState(null)
  const [showWorkshopModal, setShowWorkshopModal] = useState(false)
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)

  // --- Effects ---

  // Handle Window Resize
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

  // Initialize Language
  useEffect(() => {
    const getLanguage = () => {
      try {
        const stored = localStorage.getItem('language')
        if (stored === 'hi' || stored === 'en') {
          return stored
        }
      } catch (e) {}
      return 'en'
    }
    setLanguage(getLanguage())
  }, [])

  // Auth Check - redirect if not authenticated
  useEffect(() => {
    if (!uniqueId) {
      navigate('/login', { state: { from: '/JobOpenings' } })
    }
  }, [uniqueId, navigate])

   // Fetch Data - aligned with UserProfile pattern
   useEffect(() => {
     // Wait for authentication before fetching
     if (!uniqueId || !accessToken) {
       // Ensure loading states are reset to avoid spinners
       setLoading(false);
       setLoadingSeminars(false);
       setLoadingWorkshops(false);
       return;
     }

     fetchJobs();
     fetchSeminars();
     fetchWorkshops();
   }, [uniqueId, accessToken]);

  // --- Handler Functions ---
  
  // Defined ONCE to prevent duplicate declaration error
  const handleToggleSidebar = () => setSidebarOpen(prev => !prev)

  // Updated Auth Logic to match UserQuiz pattern exactly
  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)

      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
      const response = await axios.get(
        'https://brjobsedu.com/gyandhara/gyandhara_backend/api/job-openings/',
        config
      )

      if (response.data.success && Array.isArray(response.data.data)) {
        const activeJobs = response.data.data.filter(job => job.status === 'active')
        setJobs(activeJobs)
      } else {
        setJobs([])
      }
    } catch (err) {
      console.error("Error fetching jobs:", err)
      setError("Failed to load job openings")
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const fetchSeminars = async () => {
    try {
      setLoadingSeminars(true)
      setErrorSeminars(null)

      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
      const response = await axios.get(
        'https://brjobsedu.com/gyandhara/gyandhara_backend/api/seminar-items/',
        config
      )

      if (response.data.success && Array.isArray(response.data.data)) {
        const activeSeminars = response.data.data.filter(seminar => seminar.status === 'active')
        setSeminars(activeSeminars)
      } else {
        setSeminars([])
      }
    } catch (err) {
      console.error("Error fetching seminars:", err)
      setErrorSeminars("Failed to load seminars")
      setSeminars([])
    } finally {
      setLoadingSeminars(false)
    }
  }

  const fetchWorkshops = async () => {
    try {
      setLoadingWorkshops(true)
      setErrorWorkshops(null)

      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
      const response = await axios.get(
        'https://brjobsedu.com/gyandhara/gyandhara_backend/api/workshop-items/',
        config
      )

      if (response.data.success && Array.isArray(response.data.data)) {
        const activeWorkshops = response.data.data.filter(workshop => workshop.status === 'active')
        setWorkshops(activeWorkshops)
      } else {
        setWorkshops([])
      }
    } catch (err) {
      console.error("Error fetching workshops:", err)
      setErrorWorkshops("Failed to load workshops")
      setWorkshops([])
    } finally {
      setLoadingWorkshops(false)
    }
  }

  const handleApplyClick = (applyLink) => {
    if (applyLink) {
      window.open(applyLink, '_blank')
    }
  }

  const handleRegisterClick = (registerLink) => {
    if (registerLink) {
      window.open(registerLink, '_blank')
    }
  }

  const handleViewDetails = (job) => {
    setSelectedJob(job)
    setShowJobModal(true)
  }

  const closeModal = () => {
    setShowJobModal(false)
    setSelectedJob(null)
  }

  const handleViewSeminarDetails = (seminar) => {
    setSelectedSeminar(seminar)
    setShowSeminarModal(true)
  }

  const closeSeminarModal = () => {
    setShowSeminarModal(false)
    setSelectedSeminar(null)
  }

  const handleViewWorkshopDetails = (workshop) => {
    setSelectedWorkshop(workshop)
    setShowWorkshopModal(true)
  }

  const closeWorkshopModal = () => {
    setShowWorkshopModal(false)
    setSelectedWorkshop(null)
  }

  // --- Helper Functions & Memos ---

  const getJobTypeBadge = (jobType) => {
    const variants = {
      'full_time': 'primary',
      'part_time': 'secondary',
      'internship': 'info',
      'contract': 'warning'
    }
    return variants[jobType] || 'secondary'
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatSeminarDateTime = (dateTimeString) => {
    if (!dateTimeString) return ''
    const date = new Date(dateTimeString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isJobExpired = (lastDate) => {
    if (!lastDate) return false
    return new Date(lastDate) < new Date()
  }

  const isSeminarExpired = (lastDate) => {
    if (!lastDate) return false
    return new Date(lastDate) < new Date()
  }

  const isWorkshopExpired = (lastDate) => {
    if (!lastDate) return false
    return new Date(lastDate) < new Date()
  }

  const uniqueQualifications = useMemo(() => {
    const qualifications = new Set()
    jobs.forEach(job => {
      if (job.qualifications_required && Array.isArray(job.qualifications_required)) {
        job.qualifications_required.forEach(qual => qualifications.add(qual))
      }
    })
    return Array.from(qualifications).sort()
  }, [jobs])

  const filteredJobs = useMemo(() => {
    if (!selectedQualification) return jobs
    return jobs.filter(job => {
      if (job.qualifications_required && Array.isArray(job.qualifications_required)) {
        return job.qualifications_required.includes(selectedQualification)
      }
      return false
    })
  }, [jobs, selectedQualification])

  const uniqueSeminarEligibility = useMemo(() => {
    const eligibility = new Set()
    seminars.forEach(seminar => {
      if (seminar.eligibility && Array.isArray(seminar.eligibility)) {
        seminar.eligibility.forEach(elig => eligibility.add(elig))
      }
    })
    return Array.from(eligibility).sort()
  }, [seminars])

  const filteredSeminars = useMemo(() => {
    if (!selectedSeminarEligibility) return seminars
    return seminars.filter(seminar => {
      if (seminar.eligibility && Array.isArray(seminar.eligibility)) {
        return seminar.eligibility.includes(selectedSeminarEligibility)
      }
      return false
    })
  }, [seminars, selectedSeminarEligibility])

  const uniqueWorkshopEligibility = useMemo(() => {
    const eligibility = new Set()
    workshops.forEach(workshop => {
      if (workshop.eligibility && Array.isArray(workshop.eligibility)) {
        workshop.eligibility.forEach(elig => eligibility.add(elig))
      }
    })
    return Array.from(eligibility).sort()
  }, [workshops])

  const filteredWorkshops = useMemo(() => {
    if (!selectedWorkshopEligibility) return workshops
    return workshops.filter(workshop => {
      if (workshop.eligibility && Array.isArray(workshop.eligibility)) {
        return workshop.eligibility.includes(selectedWorkshopEligibility)
      }
      return false
    })
  }, [workshops, selectedWorkshopEligibility])

  // --- Render ---

  return (
    <div className="dashboard-container">
      <UserLeftNav
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      
      <div className="main-content-dash">
        <UserHeader toggleSidebar={handleToggleSidebar} />

        <Container className="dashboard-box mt-3">
          <Row className="mb-3">
            <Col xs={12} className="mt-3">
              <div className="d-flex align-items-center mb-2">
                <FaBriefcase className="me-1 text-primary" style={{ fontSize: '18px' }} />
                <h5 className="mb-0 fw-bold job-heading">
                  {isLanguageHindi ? 'नौकरियां और सेमिनार' : 'Jobs & Seminars'}
                </h5>
              </div>
              <p className="text-muted job-subtitle">
                {isLanguageHindi 
                  ? 'नई नौकरियों और सेमिनार के अवसरों की खोज करें और अपने करियर को नई ऊँचाइयों तक ले जाएं।' 
                  : 'Explore new job opportunities and seminars and take your career to new heights.'}
              </p>
            </Col>
          </Row>

          <Tab.Container id="jobs-seminars-tabs" defaultActiveKey="jobs">
            <Nav variant="tabs" className="mb-3 job-tabs">
              <Nav.Item>
                <Nav.Link eventKey="jobs" className="job-tab-link">
                  <FaBriefcase className="me-1" />
                  {isLanguageHindi ? 'नौकरियां' : 'Jobs'}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="seminars" className="job-tab-link">
                  <FaChalkboardTeacher className="me-1" />
                  {isLanguageHindi ? 'सेमिनार' : 'Seminars'}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="workshops" className="job-tab-link">
                  <FaTools className="me-1" />
                  {isLanguageHindi ? 'वर्कशॉप' : 'Workshops'}
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* --- Jobs Tab --- */}
              <Tab.Pane eventKey="jobs">
                {uniqueQualifications.length > 0 && (
                  <Row className="mb-4">
                    <Col xs={12}>
<div className="d-flex align-items-center gap-2 job-filters">
                          <div className="d-flex align-items-center">
                            <FaFilter className="me-1 text-primary" />
                            <span className="fw-semibold me-1 job-filter-select">
                              {isLanguageHindi ? 'योग्यता:' : 'Qualification:'}
                            </span>
                          </div>
                          <Form.Select 
                            style={{ width: 'auto', display: 'inline-block', fontSize: '10px' }}
                            value={selectedQualification}
                            onChange={(e) => setSelectedQualification(e.target.value)}
                          >
                            <option value="">
                              {isLanguageHindi ? 'सभी' : 'All'}
                            </option>
                            {uniqueQualifications.map((qual, idx) => (
                              <option key={idx} value={qual}>{qual}</option>
                            ))}
                          </Form.Select>
                          {selectedQualification && (
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              className="job-btn"
                              onClick={() => setSelectedQualification('')}
                            >
                              {isLanguageHindi ? 'साफ़' : 'Clear'}
                            </Button>
                          )}
                        </div>
                    </Col>
                  </Row>
                )}

                {error && (
                  <Alert variant="danger">{error}</Alert>
                )}

                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" style={{ width: '50px', height: '50px' }} />
                    <p className="mt-3">
                      {isLanguageHindi ? 'नौकरी के अवसर लोड हो रहे हैं...' : 'Loading job openings...'}
                    </p>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <Card className="text-center py-5">
                    <Card.Body>
                      <FaSearch className="text-muted mb-3" style={{ fontSize: '48px' }} />
                      <h5 className="text-muted">
                        {selectedQualification 
                          ? (isLanguageHindi ? 'इस योग्यता के लिए कोई नौकरी नहीं मिली' : 'No jobs found for this qualification')
                          : (isLanguageHindi ? 'कोई नौकरी उपलब्ध नहीं है' : 'No job openings available')}
                      </h5>
                    </Card.Body>
                  </Card>
                ) : (
                  <Row className="g-4">
                    {filteredJobs.map((job, index) => {
                      const isExpired = isJobExpired(job.last_date_to_apply)
                      const title = isLanguageHindi && job.title_hindi ? job.title_hindi : job.title
                      const descriptions = isLanguageHindi && job.description_hindi ? job.description_hindi : job.description || []

                      return (
                        <Col key={job.id || index} xs={12} md={6} lg={4}>
                          <Card className={`h-100 job-card ${isExpired ? 'job-card-expired' : ''}`}>
                            <Card.Body className="d-flex flex-column">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <Badge bg={getJobTypeBadge(job.job_type)} className="job-badge">
                                  {job.job_type === 'full_time' ? 'Full Time' : 
                                   job.job_type === 'part_time' ? 'Part Time' : 
                                   job.job_type === 'internship' ? 'Internship' : 
                                   job.job_type || 'Job'}
                                </Badge>
                                {isExpired && <Badge bg="secondary" className="job-badge">Expired</Badge>}
                              </div>

                              <h6 className="fw-bold mb-1 job-title">{title}</h6>
                              
                              <div className="mb-2">
                                <small className="text-muted d-flex align-items-center mb-1 job-meta">
                                  <FaMapMarkerAlt className="me-1" /> {job.location}
                                </small>
                                <small className="text-muted d-flex align-items-center mb-1 job-meta">
                                  <FaClock className="me-1" /> {job.experience_required}
                                </small>
                                <small className="text-muted d-flex align-items-center job-meta">
                                  <FaMoneyBillWave className="me-1" /> {job.salary}
                                </small>
                              </div>

                              {job.qualifications_required && job.qualifications_required.length > 0 && (
                                <div className="mb-2">
                                  <small className="text-muted fw-semibold d-block mb-1 job-meta">
                                    <FaGraduationCap className="me-1" />
                                    {isLanguageHindi ? 'योग्यता:' : 'Qualifications:'}
                                  </small>
                                  <div className="d-flex flex-wrap gap-1">
                                    {job.qualifications_required.map((qual, i) => (
                                      <Badge key={i} bg="info" text="white" className="fw-normal job-badge">{qual}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="mt-auto pt-2 border-top">
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-muted job-meta">
                                    {job.last_date_to_apply && (
                                      <>
                                        <FaClock className="me-1" />
                                        {isLanguageHindi ? 'अंतिम: ' : 'Apply: '} 
                                        {formatDate(job.last_date_to_apply)}
                                      </>
                                    )}
                                  </small>
                                  <div className="d-flex gap-1">
                                    <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(job)} className="job-btn">
                                      <FaInfoCircle className="me-1" />
                                      {isLanguageHindi ? 'अधिक' : 'More'}
                                    </Button>
                                    <Button 
                                      variant={isExpired ? 'secondary' : 'primary'}
                                      size="sm"
                                      onClick={() => handleApplyClick(job.apply_link)}
                                      disabled={isExpired || !job.apply_link}
                                      className="job-btn"
                                      style={{ background: isExpired ? undefined : 'linear-gradient(135deg, rgb(94 117 223), rgb(75 101 218))', border: isExpired ? undefined : 'none' }}
                                    >
                                      <FaExternalLinkAlt className="me-1" />
                                      {isLanguageHindi ? 'आवेदन' : 'Apply'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      )
                    })}
                  </Row>
                )}
              </Tab.Pane>

              {/* --- Seminars Tab --- */}
              <Tab.Pane eventKey="seminars">
                {errorSeminars && <Alert variant="danger">{errorSeminars}</Alert>}

                {uniqueSeminarEligibility.length > 0 && (
                  <Row className="mb-4">
                    <Col xs={12}>
                      <div className="d-flex align-items-center gap-3">
                        <FaFilter className="me-2 text-success" />
                        <span className="fw-semibold me-2">{isLanguageHindi ? 'पात्रता फ़िल्टर:' : 'Eligibility Filter:'}</span>
                        <Form.Select 
                          style={{ width: 'auto', display: 'inline-block' }}
                          value={selectedSeminarEligibility}
                          onChange={(e) => setSelectedSeminarEligibility(e.target.value)}
                        >
                          <option value="">{isLanguageHindi ? 'सभी पात्रताएं' : 'All Eligibility'}</option>
                          {uniqueSeminarEligibility.map((elig, idx) => (
                            <option key={idx} value={elig}>{elig}</option>
                          ))}
                        </Form.Select>
                        {selectedSeminarEligibility && (
                          <Button variant="outline-secondary" size="sm" onClick={() => setSelectedSeminarEligibility('')}>
                            {isLanguageHindi ? 'साफ़ करें' : 'Clear'}
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                )}

                {loadingSeminars ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">{isLanguageHindi ? 'सेमिनार लोड हो रहे हैं...' : 'Loading seminars...'}</p>
                  </div>
                ) : filteredSeminars.length === 0 ? (
                   <Card className="text-center py-5">
                    <Card.Body>
                      <h5 className="text-muted">{isLanguageHindi ? 'कोई सेमिनार उपलब्ध नहीं है' : 'No seminars available'}</h5>
                    </Card.Body>
                  </Card>
                ) : (
                  <Row className="g-4">
                    {filteredSeminars.map((seminar, index) => {
                      const isExpired = isSeminarExpired(seminar.last_date_to_register)
                      const title = isLanguageHindi && seminar.title_hindi ? seminar.title_hindi : seminar.title
                      
                      return (
                        <Col key={seminar.id || index} xs={12} md={6} lg={4}>
                          <Card className={`h-100 job-card ${isExpired ? 'job-card-expired' : ''}`}>
                            <Card.Body className="d-flex flex-column">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <Badge bg={seminar.mode === 'online' ? 'success' : 'primary'}>
                                  {seminar.mode === 'online' ? 'Online' : 'Offline'}
                                </Badge>
                                {isExpired && <Badge bg="secondary">Expired</Badge>}
                              </div>
                              <h5 className="fw-bold mb-2">{title}</h5>
                              <div className="mb-3">
                                <small className="text-muted d-flex align-items-center mb-1">
                                  <FaMapMarkerAlt className="me-1" /> {seminar.location}
                                </small>
                                <small className="text-muted d-flex align-items-center mb-1">
                                  <FaClock className="me-1" /> {seminar.speaker_name}
                                </small>
                              </div>
                              {seminar.eligibility && seminar.eligibility.length > 0 && (
                                <div className="mb-3">
                                  <small className="text-muted fw-semibold d-block mb-1">
                                    <FaGraduationCap className="me-1" />
                                    {isLanguageHindi ? 'पात्रता:' : 'Eligibility:'}
                                  </small>
                                  <div className="d-flex flex-wrap gap-1">
                                    {seminar.eligibility.map((elig, i) => (
                                      <Badge key={i} bg="info" text="white" className="fw-normal">{elig}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="mt-auto pt-3 border-top">
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-muted">
                                    {seminar.last_date_to_register && (
                                      <>
                                        <FaClock className="me-1" />
                                        {isLanguageHindi ? 'अंतिम तिथि: ' : 'Reg. Date: '} 
                                        {formatDate(seminar.last_date_to_register)}
                                      </>
                                    )}
                                  </small>
                                  <div className="d-flex gap-2">
                                    <Button variant="outline-primary" size="sm" onClick={() => handleViewSeminarDetails(seminar)}>
                                      <FaInfoCircle className="me-1" />{isLanguageHindi ? 'अधिक' : 'More'}
                                    </Button>
                                    <Button 
                                      variant={isExpired ? 'secondary' : 'success'} 
                                      size="sm"
                                      onClick={() => handleRegisterClick(seminar.registration_link)}
                                      disabled={isExpired || !seminar.registration_link}
                                    >
                                      {isLanguageHindi ? 'रजिस्टर करें' : 'Register'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      )
                    })}
                  </Row>
                )}
              </Tab.Pane>

              {/* --- Workshops Tab --- */}
              <Tab.Pane eventKey="workshops">
                {errorWorkshops && <Alert variant="danger">{errorWorkshops}</Alert>}

                {uniqueWorkshopEligibility.length > 0 && (
                  <Row className="mb-4">
                    <Col xs={12}>
                      <div className="d-flex align-items-center gap-3">
                        <FaFilter className="me-2 text-warning" />
                        <span className="fw-semibold me-2">{isLanguageHindi ? 'पात्रता फ़िल्टर:' : 'Eligibility Filter:'}</span>
                        <Form.Select 
                          style={{ width: 'auto', display: 'inline-block' }}
                          value={selectedWorkshopEligibility}
                          onChange={(e) => setSelectedWorkshopEligibility(e.target.value)}
                        >
                          <option value="">{isLanguageHindi ? 'सभी पात्रताएं' : 'All Eligibility'}</option>
                          {uniqueWorkshopEligibility.map((elig, idx) => (
                            <option key={idx} value={elig}>{elig}</option>
                          ))}
                        </Form.Select>
                        {selectedWorkshopEligibility && (
                          <Button variant="outline-secondary" size="sm" onClick={() => setSelectedWorkshopEligibility('')}>
                            {isLanguageHindi ? 'साफ़ करें' : 'Clear'}
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                )}

                {loadingWorkshops ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">{isLanguageHindi ? 'वर्कशॉप लोड हो रही है...' : 'Loading workshops...'}</p>
                  </div>
                ) : filteredWorkshops.length === 0 ? (
                  <Card className="text-center py-5">
                    <Card.Body>
                      <h5 className="text-muted">{isLanguageHindi ? 'कोई वर्कशॉप उपलब्ध नहीं है' : 'No workshops available'}</h5>
                    </Card.Body>
                  </Card>
                ) : (
                  <Row className="g-4">
                    {filteredWorkshops.map((workshop, index) => {
                      const isExpired = isWorkshopExpired(workshop.last_date_to_register)
                      const title = isLanguageHindi && workshop.title_hindi ? workshop.title_hindi : workshop.title

                      return (
                        <Col key={workshop.id || index} xs={12} md={6} lg={4}>
                          <Card className={`h-100 job-card ${isExpired ? 'job-card-expired' : ''}`}>
                            <Card.Body className="d-flex flex-column">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <Badge bg={workshop.mode === 'online' ? 'success' : 'warning'}>
                                  {workshop.mode === 'online' ? 'Online' : 'Offline'}
                                </Badge>
                                {isExpired && <Badge bg="secondary">Expired</Badge>}
                              </div>
                              <h5 className="fw-bold mb-2">{title}</h5>
                              <div className="mb-3">
                                <small className="text-muted d-flex align-items-center mb-1">
                                  <FaMapMarkerAlt className="me-1" /> {workshop.location}
                                </small>
                                <small className="text-muted d-flex align-items-center mb-1">
                                  <FaTools className="me-1" /> {workshop.instructor_name}
                                </small>
                              </div>
                              {workshop.eligibility && workshop.eligibility.length > 0 && (
                                <div className="mb-3">
                                  <small className="text-muted fw-semibold d-block mb-1">
                                    <FaGraduationCap className="me-1" />
                                    {isLanguageHindi ? 'पात्रता:' : 'Eligibility:'}
                                  </small>
                                  <div className="d-flex flex-wrap gap-1">
                                    {workshop.eligibility.map((elig, i) => (
                                      <Badge key={i} bg="info" text="white" className="fw-normal">{elig}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="mt-auto pt-3 border-top">
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-muted">
                                    {workshop.last_date_to_register && (
                                      <>
                                        <FaClock className="me-1" />
                                        {isLanguageHindi ? 'अंतिम तिथि: ' : 'Reg. Date: '} 
                                        {formatDate(workshop.last_date_to_register)}
                                      </>
                                    )}
                                  </small>
                                  <div className="d-flex gap-2">
                                    <Button variant="outline-primary" size="sm" onClick={() => handleViewWorkshopDetails(workshop)}>
                                      <FaInfoCircle className="me-1" />{isLanguageHindi ? 'अधिक' : 'More'}
                                    </Button>
                                    <Button 
                                      variant={isExpired ? 'secondary' : 'warning'} 
                                      size="sm"
                                      onClick={() => handleRegisterClick(workshop.registration_link)}
                                      disabled={isExpired || !workshop.registration_link}
                                    >
                                      {isLanguageHindi ? 'रजिस्टर करें' : 'Register'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      )
                    })}
                  </Row>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Container>
      </div>

      {/* --- Modals --- */}
      
      {/* Job Modal */}
      <Modal show={showJobModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton className="job-modal-header">
          <Modal.Title>
            {selectedJob && (isLanguageHindi && selectedJob.title_hindi ? selectedJob.title_hindi : selectedJob?.title)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {selectedJob && (
            <>
              <div className="mb-4">
                <div className="d-flex gap-2 mb-3">
                  <Badge bg={getJobTypeBadge(selectedJob.job_type)}>
                    {selectedJob.job_type === 'full_time' ? 'Full Time' : 
                     selectedJob.job_type === 'part_time' ? 'Part Time' : 
                     selectedJob.job_type === 'internship' ? 'Internship' : 
                     selectedJob.job_type || 'Job'}
                  </Badge>
                  {isJobExpired(selectedJob.last_date_to_apply) && <Badge bg="secondary">Expired</Badge>}
                </div>
                <div className="row mb-3">
                  <div className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                      <FaMapMarkerAlt className="me-2 text-primary" />
                      <span><strong>{isLanguageHindi ? 'स्थान:' : 'Location:'}</strong> {selectedJob.location}</span>
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                      <FaClock className="me-2 text-primary" />
                      <span><strong>{isLanguageHindi ? 'अनुभव:' : 'Experience:'}</strong> {selectedJob.experience_required}</span>
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                      <FaMoneyBillWave className="me-2 text-primary" />
                      <span><strong>{isLanguageHindi ? 'वेतन:' : 'Salary:'}</strong> {selectedJob.salary}</span>
                    </div>
                  </div>
                </div>
              </div>
              {(isLanguageHindi ? selectedJob.description_hindi : selectedJob.description)?.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">
                    <FaInfoCircle className="me-2" />
                    {isLanguageHindi ? 'जिम्मेदारियाँ और कार्य' : 'Responsibilities & Duties'}
                  </h6>
                  <ul className="list-unstyled">
                    {(isLanguageHindi ? selectedJob.description_hindi : selectedJob.description)?.map((desc, i) => (
                      <li key={i} className="mb-2 d-flex align-items-start">
                        <span className="me-2 text-primary">•</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} className="job-btn">{isLanguageHindi ? 'बंद करें' : 'Close'}</Button>
          {selectedJob && !isJobExpired(selectedJob.last_date_to_apply) && selectedJob.apply_link && (
            <Button variant="primary" onClick={() => handleApplyClick(selectedJob.apply_link)} className="job-btn" style={{ background: 'linear-gradient(135deg, rgb(94 117 223), rgb(75 101 218))', border: 'none' }}>
              <FaExternalLinkAlt className="me-1" />{isLanguageHindi ? 'अभी आवेदन करें' : 'Apply Now'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Seminar Modal */}
      <Modal show={showSeminarModal} onHide={closeSeminarModal} size="lg" centered>
        <Modal.Header closeButton className="job-modal-header-success">
          <Modal.Title>
            {selectedSeminar && (isLanguageHindi && selectedSeminar.title_hindi ? selectedSeminar.title_hindi : selectedSeminar?.title)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {selectedSeminar && (
            <>
              <div className="mb-4">
                <div className="d-flex gap-2 mb-3">
                  <Badge bg={selectedSeminar.mode === 'online' ? 'success' : 'primary'}>
                    {selectedSeminar.mode === 'online' ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                      <FaMapMarkerAlt className="me-2 text-success" />
                      <span><strong>{isLanguageHindi ? 'स्थान:' : 'Location:'}</strong> {selectedSeminar.location}</span>
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                      <FaChalkboardTeacher className="me-2 text-success" />
                      <span><strong>{isLanguageHindi ? 'वक्ता:' : 'Speaker:'}</strong> {selectedSeminar.speaker_name}</span>
                    </div>
                  </div>
                </div>
              </div>
              {(isLanguageHindi ? selectedSeminar.description_hindi : selectedSeminar.description)?.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-2"><FaInfoCircle className="me-2" />{isLanguageHindi ? 'विषय' : 'Topics'}</h6>
                  <ul className="list-unstyled">
                    {(isLanguageHindi ? selectedSeminar.description_hindi : selectedSeminar.description)?.map((desc, i) => (
                      <li key={i} className="mb-2 d-flex align-items-start">
                        <span className="me-2 text-success">•</span><span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeSeminarModal}>{isLanguageHindi ? 'बंद करें' : 'Close'}</Button>
          {selectedSeminar && !isSeminarExpired(selectedSeminar.last_date_to_register) && selectedSeminar.registration_link && (
            <Button variant="success" onClick={() => handleRegisterClick(selectedSeminar.registration_link)}>
              <FaExternalLinkAlt className="me-2" />{isLanguageHindi ? 'अभी रजिस्टर करें' : 'Register Now'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Workshop Modal */}
      <Modal show={showWorkshopModal} onHide={closeWorkshopModal} size="lg" centered key={language}>
        <Modal.Header closeButton className="job-modal-header-warning">
          <Modal.Title>
            {selectedWorkshop && (isLanguageHindi && selectedWorkshop.title_hindi ? selectedWorkshop.title_hindi : selectedWorkshop?.title)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {selectedWorkshop && (
            <>
              <div className="mb-4">
                <div className="d-flex gap-2 mb-3">
                  <Badge bg={selectedWorkshop.mode === 'online' ? 'success' : 'warning'}>
                    {selectedWorkshop.mode === 'online' ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                      <FaMapMarkerAlt className="me-2 text-warning" />
                      <span><strong>{isLanguageHindi ? 'स्थान:' : 'Location:'}</strong> {selectedWorkshop.location}</span>
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="d-flex align-items-center">
                      <FaTools className="me-2 text-warning" />
                      <span><strong>{isLanguageHindi ? 'प्रशिक्षक:' : 'Instructor:'}</strong> {selectedWorkshop.instructor_name}</span>
                    </div>
                  </div>
                </div>
              </div>
              {(isLanguageHindi ? selectedWorkshop.description_hindi : selectedWorkshop.description)?.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-2"><FaInfoCircle className="me-2" />{isLanguageHindi ? 'विषय' : 'Topics'}</h6>
                  <ul className="list-unstyled">
                    {(isLanguageHindi ? selectedWorkshop.description_hindi : selectedWorkshop.description)?.map((desc, i) => (
                      <li key={i} className="mb-2 d-flex align-items-start">
                        <span className="me-2 text-warning">•</span><span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeWorkshopModal}>{isLanguageHindi ? 'बंद करें' : 'Close'}</Button>
          {selectedWorkshop && !isWorkshopExpired(selectedWorkshop.last_date_to_register) && selectedWorkshop.registration_link && (
            <Button variant="warning" onClick={() => handleRegisterClick(selectedWorkshop.registration_link)}>
              <FaExternalLinkAlt className="me-2" />{isLanguageHindi ? 'अभी रजिस्टर करें' : 'Register Now'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <style>{`
        .job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .job-card-expired {
          opacity: 0.7;
        }
        .job-card .btn {
          white-space: nowrap;
        }
        .nav-tabs .nav-link.active {
          background-color: #0d6efd !important;
          color: white !important;
          border-color: #0d6efd !important;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}

export default JobOpenings