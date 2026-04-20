import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, Button, Form, Badge, Modal, Alert, Spinner } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import UserHeader from './UserHeader'
import UserLeftNav from './UserLeftNav'
import { FaArrowLeft, FaGraduationCap, FaChartLine, FaLightbulb, FaRocket, FaBook, FaCode, FaPalette, FaCog, FaHeartbeat, FaUniversity, FaLaptopMedical, FaBriefcase, FaFlask, FaBalanceScale, FaCheckCircle, FaInfoCircle, FaMicrochip } from 'react-icons/fa'
import '../../assets/css/12thclass.css'

const TwelfthGuidance = () => {
  const { uniqueId, accessToken } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const [selectedStream, setSelectedStream] = useState('')
  const [percentage, setPercentage] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedCareerPath, setSelectedCareerPath] = useState(null)
  const resultsRef = useRef(null)

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
    const fetchUserData = async () => {
      if (!uniqueId) {
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(
          `https://brjobsedu.com/gyandhara/gyandhara_backend/api/student-reg/?student_id=${uniqueId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (response.data.success) {
          setUserData(response.data.data)
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [uniqueId, accessToken])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const streams = [
    { id: 'science', name: 'Science', icon: <FaRocket />, subjects: 'Physics, Chemistry, Biology/Mathematics' },
    { id: 'commerce', name: 'Commerce', icon: <FaChartLine />, subjects: 'Accountancy, Economics, Business Studies' },
    { id: 'arts', name: 'Arts', icon: <FaPalette />, subjects: 'History, Political Science, Sociology' },
    { id: 'computer', name: 'Computer Science', icon: <FaCode />, subjects: 'Programming, IT, Computer Applications' }
  ]

  const getStreamName = (streamId) => {
    const stream = streams.find(s => s.id === streamId)
    return stream ? stream.name : 'Unknown'
  }

  const getCoursesByStreamAndPercentage = (stream, perc) => {
    const userPerc = Number(perc)
    
    const coursesData = {
      science: {
        high: [
          { name: 'B.Tech (Bachelor of Technology)', duration: '4 Years', icon: <FaCog />, description: 'Engineering degree in various specializations', careers: ['Software Engineer', 'Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer'] },
          { name: 'MBBS (Bachelor of Medicine)', duration: '5.5 Years', icon: <FaHeartbeat />, description: 'Medical degree to become a doctor', careers: ['Doctor', 'Surgeon', 'Medical Officer', 'Specialist'] },
          { name: 'B.Sc (Bachelor of Science)', duration: '3 Years', icon: <FaFlask />, description: 'Science degree in various subjects', careers: ['Scientist', 'Researcher', 'Lab Technician', 'Teacher'] },
          { name: 'B.Pharma (Bachelor of Pharmacy)', duration: '4 Years', icon: <FaLaptopMedical />, description: 'Pharmacy degree for drug manufacturing', careers: ['Pharmacist', 'Medical Representative', 'Drug Inspector'] },
          { name: 'BDS (Bachelor of Dental Surgery)', duration: '5 Years', icon: <FaHeartbeat />, description: 'Dental degree for dental care', careers: ['Dentist', 'Dental Surgeon', 'Orthodontist'] },
          { name: 'B.Sc Nursing', duration: '4 Years', icon: <FaHeartbeat />, description: 'Nursing degree for healthcare', careers: ['Nurse', 'Nursing Officer', 'Healthcare Administrator'] }
        ],
        medium: [
          { name: 'B.Sc (Bachelor of Science)', duration: '3 Years', icon: <FaFlask />, description: 'Science degree in various subjects', careers: ['Lab Technician', 'Teacher', 'Research Assistant'] },
          { name: 'B.Pharma (Bachelor of Pharmacy)', duration: '4 Years', icon: <FaLaptopMedical />, description: 'Pharmacy degree for drug manufacturing', careers: ['Pharmacist', 'Medical Representative'] },
          { name: 'B.Sc Nursing', duration: '4 Years', icon: <FaHeartbeat />, description: 'Nursing degree for healthcare', careers: ['Nurse', 'Nursing Assistant'] },
          { name: 'Diploma in Engineering', duration: '3 Years', icon: <FaCog />, description: 'Technical diploma in engineering', careers: ['Junior Engineer', 'Technician', 'Supervisor'] }
        ],
        low: [
          { name: 'B.Sc (Bachelor of Science)', duration: '3 Years', icon: <FaFlask />, description: 'Science degree in various subjects', careers: ['Lab Assistant', 'Teacher', 'Sales Executive'] },
          { name: 'Diploma in Engineering', duration: '3 Years', icon: <FaCog />, description: 'Technical diploma in engineering', careers: ['Technician', 'Machine Operator', 'Electrician'] },
          { name: 'B.Sc Agriculture', duration: '4 Years', icon: <FaBriefcase />, description: 'Agriculture degree for farming sector', careers: ['Agricultural Officer', 'Farm Manager', 'Seed Analyst'] }
        ]
      },
      commerce: {
        high: [
          { name: 'B.Com (Bachelor of Commerce)', duration: '3 Years', icon: <FaBriefcase />, description: 'Commerce degree for business careers', careers: ['Chartered Accountant', 'Financial Analyst', 'Investment Banker'] },
          { name: 'BBA (Bachelor of Business Administration)', duration: '3 Years', icon: <FaBriefcase />, description: 'Business management degree', careers: ['Business Analyst', 'Marketing Manager', 'HR Manager'] },
          { name: 'CA (Chartered Accountancy)', duration: '4-5 Years', icon: <FaBriefcase />, description: 'Professional accounting course', careers: ['Chartered Accountant', 'Tax Consultant', 'Auditor'] },
          { name: 'BBA LLB', duration: '5 Years', icon: <FaBalanceScale />, description: 'Business and law combined degree', careers: ['Corporate Lawyer', 'Legal Manager', 'Compliance Officer'] }
        ],
        medium: [
          { name: 'B.Com (Bachelor of Commerce)', duration: '3 Years', icon: <FaBriefcase />, description: 'Commerce degree for business careers', careers: ['Accountant', 'Tax Assistant', 'Sales Executive'] },
          { name: 'BBA (Bachelor of Business Administration)', duration: '3 Years', icon: <FaBriefcase />, description: 'Business management degree', careers: ['Marketing Executive', 'HR Assistant', 'Business Analyst'] },
          { name: 'Diploma in Accounting', duration: '1 Year', icon: <FaBriefcase />, description: 'Accounting diploma course', careers: ['Junior Accountant', 'Accounts Assistant', 'Data Entry Operator'] }
        ],
        low: [
          { name: 'B.Com (Bachelor of Commerce)', duration: '3 Years', icon: <FaBriefcase />, description: 'Commerce degree for business careers', careers: ['Office Assistant', 'Sales Executive', 'Customer Service'] },
          { name: 'Diploma in Accounting', duration: '1 Year', icon: <FaBriefcase />, description: 'Accounting diploma course', careers: ['Data Entry Operator', 'Accounts Assistant', 'Office Assistant'] },
          { name: 'BBA (Bachelor of Business Administration)', duration: '3 Years', icon: <FaBriefcase />, description: 'Business management degree', careers: ['Sales Executive', 'Marketing Assistant', 'Customer Service'] }
        ]
      },
      arts: {
        high: [
          { name: 'BA (Bachelor of Arts)', duration: '3 Years', icon: <FaBook />, description: 'Arts degree in various subjects', careers: ['Civil Services', 'Journalist', 'Teacher', 'Content Writer'] },
          { name: 'LLB (Bachelor of Laws)', duration: '3 Years', icon: <FaBalanceScale />, description: 'Law degree for legal careers', careers: ['Lawyer', 'Legal Advisor', 'Judge'] },
          { name: 'BJMC (Journalism & Mass Communication)', duration: '3 Years', icon: <FaBook />, description: 'Media and journalism degree', careers: ['Journalist', 'Content Creator', 'PR Manager'] },
          { name: 'B.Ed (Bachelor of Education)', duration: '2 Years', icon: <FaBook />, description: 'Teaching degree for educators', careers: ['Teacher', 'Principal', 'Education Consultant'] }
        ],
        medium: [
          { name: 'BA (Bachelor of Arts)', duration: '3 Years', icon: <FaBook />, description: 'Arts degree in various subjects', careers: ['Teacher', 'Content Writer', 'Social Worker'] },
          { name: 'BJMC (Journalism & Mass Communication)', duration: '3 Years', icon: <FaBook />, description: 'Media and journalism degree', careers: ['Content Writer', 'Social Media Manager', 'Reporter'] },
          { name: 'Diploma in Journalism', duration: '1 Year', icon: <FaBook />, description: 'Journalism diploma course', careers: ['Journalist', 'Content Writer', 'Editor'] }
        ],
        low: [
          { name: 'BA (Bachelor of Arts)', duration: '3 Years', icon: <FaBook />, description: 'Arts degree in various subjects', careers: ['Office Assistant', 'Customer Service', 'Sales Executive'] },
          { name: 'Diploma in Journalism', duration: '1 Year', icon: <FaBook />, description: 'Journalism diploma course', careers: ['Content Writer', 'Social Media Assistant', 'Data Entry Operator'] },
          { name: 'BSW (Bachelor of Social Work)', duration: '3 Years', icon: <FaBook />, description: 'Social work degree for community service', careers: ['Social Worker', 'NGO Worker', 'Community Manager'] }
        ]
      },
      computer: {
        high: [
          { name: 'B.Tech CSE (Computer Science)', duration: '4 Years', icon: <FaCode />, description: 'Engineering in computer science', careers: ['Software Developer', 'Data Scientist', 'AI Engineer', 'Cloud Architect'] },
          { name: 'BCA (Bachelor of Computer Applications)', duration: '3 Years', icon: <FaCode />, description: 'Computer applications degree', careers: ['Software Developer', 'Web Developer', 'App Developer', 'Database Administrator'] },
          { name: 'B.Sc Computer Science', duration: '3 Years', icon: <FaCode />, description: 'Computer science degree', careers: ['Programmer', 'System Analyst', 'IT Support', 'Web Developer'] },
          { name: 'B.Tech AI & ML', duration: '4 Years', icon: <FaMicrochip />, description: 'AI and Machine Learning degree', careers: ['AI Engineer', 'Machine Learning Engineer', 'Data Scientist', 'Research Scientist'] }
        ],
        medium: [
          { name: 'BCA (Bachelor of Computer Applications)', duration: '3 Years', icon: <FaCode />, description: 'Computer applications degree', careers: ['Software Developer', 'Web Developer', 'IT Support'] },
          { name: 'B.Sc IT (Information Technology)', duration: '3 Years', icon: <FaCode />, description: 'IT degree for tech careers', careers: ['IT Support', 'Network Admin', 'Web Developer'] },
          { name: 'Diploma in Computer Engineering', duration: '3 Years', icon: <FaCode />, description: 'Computer engineering diploma', careers: ['Computer Technician', 'Hardware Engineer', 'Network Technician'] }
        ],
        low: [
          { name: 'BCA (Bachelor of Computer Applications)', duration: '3 Years', icon: <FaCode />, description: 'Computer applications degree', careers: ['Computer Operator', 'Data Entry Operator', 'IT Support'] },
          { name: 'Diploma in Computer Applications', duration: '1 Year', icon: <FaCode />, description: 'Computer applications diploma', careers: ['Data Entry Operator', 'Computer Operator', 'Office Assistant'] },
          { name: 'B.Sc IT (Information Technology)', duration: '3 Years', icon: <FaCode />, description: 'IT degree for tech careers', careers: ['IT Support', 'Web Designer', 'Office Assistant'] }
        ]
      }
    }

    const streamKey = stream
    if (!coursesData[streamKey]) return []

    if (userPerc >= 75) {
      return coursesData[streamKey].high || []
    } else if (userPerc >= 60) {
      return coursesData[streamKey].medium || []
    } else {
      return coursesData[streamKey].low || []
    }
  }

  const handleStreamChange = (e) => {
    setSelectedStream(e.target.value)
    setShowResults(false)
    setPercentage('')
  }

  const handlePercentageChange = (e) => {
    const value = e.target.value
    if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
      setPercentage(value)
    }
  }

  const handleGetGuidance = () => {
    if (!selectedStream) {
      alert('Please select a stream')
      return
    }
    if (!percentage || Number(percentage) <= 0) {
      alert('Please enter a valid percentage')
      return
    }
    if (Number(percentage) > 100) {
      alert('Percentage cannot exceed 100')
      return
    }
    if (Number(percentage) < 33) {
      alert('You are not eligible for career guidance. You need at least 33% to get recommendations.')
      return
    }
    
    setShowResults(true)
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleCourseClick = (course) => {
    setSelectedCourse(course)
    setSelectedCareerPath(null)
    setShowModal(true)
  }

  const courses = showResults ? getCoursesByStreamAndPercentage(selectedStream, percentage) : []

  return (
    <div className="dashboard-container">
      <UserLeftNav
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      <div className="main-content-dash">
        <UserHeader toggleSidebar={toggleSidebar} />

        <Container className="dashboard-box mt-3">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '60px', height: '60px' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading...</p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate('/UserDashboard')} 
                  className="d-flex align-items-center"
                >
                  <FaArrowLeft className="me-2" />
                  Back to Dashboard
                </Button>
              </div>

              <Card className="shadow-sm mb-4 border-0" style={{ borderRadius: '10px' }}>
                <Card.Body>
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    <div>
                      <h3 className="mb-2">
                        <FaGraduationCap className="me-2 text-primary" />
                        12th Career Guidance
                      </h3>
                      <p className="text-muted mb-0">
                        Get personalized career guidance based on your 12th grade stream and percentage
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="shadow-sm mb-4 border-0" style={{ borderRadius: '10px' }}>
                <Card.Body>
                  <h5 className="mb-3">
                    <Badge bg="primary" className="me-2">Step 1:</Badge>
                    Select Your Stream
                  </h5>
                  <Row>
                    {streams.map((stream) => (
                      <Col lg={3} md={6} className="mb-3" key={stream.id}>
                        <Card
                          className={`h-100 border ${selectedStream === stream.id ? 'selected' : ''}`}
                          style={{
                            cursor: 'pointer',
                            borderColor: selectedStream === stream.id ? '#667eea' : '#dee2e6',
                            backgroundColor: selectedStream === stream.id ? '#f0f4ff' : 'white'
                          }}
                          onClick={() => handleStreamChange({ target: { value: stream.id } })}
                        >
                          <Card.Body className="p-3 text-center">
                            <div className="mb-2" style={{ fontSize: '24px' }}>
                              {stream.icon}
                            </div>
                            <h6 className="mb-1">{stream.name}</h6>
                            <small className="text-muted">{stream.subjects}</small>
                            {selectedStream === stream.id && (
                              <Badge bg="primary" className="mt-2 d-block">
                                <FaCheckCircle className="me-1" /> Selected
                              </Badge>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>

              {selectedStream && (
                <Card className="shadow-sm mb-4 border-0" style={{ borderRadius: '10px' }}>
                  <Card.Body>
                    <h5 className="mb-3">
                      <Badge bg="primary" className="me-2">Step 2:</Badge>
                      Enter Your Percentage
                    </h5>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <Form.Control
                          type="number"
                          placeholder="Enter percentage"
                          value={percentage}
                          onChange={handlePercentageChange}
                          min="0"
                          max="100"
                        />
                      </Col>
                      <Col md={6}>
                        <Button 
                          variant="primary" 
                          size="lg"
                          onClick={handleGetGuidance}
                          disabled={!percentage}
                          className="w-100"
                        >
                          <FaLightbulb className="me-2" />
                          Get Guidance
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}

              {showResults && (
                <div ref={resultsRef}>
                  {courses.length === 0 ? (
                    <Card className="shadow-sm mb-4 border-0" style={{ borderRadius: '10px' }}>
                      <Card.Body className="text-center">
                        <FaInfoCircle className="text-warning mb-3" style={{ fontSize: '48px' }} />
                        <h4>No Recommendations Available</h4>
                        <p className="text-muted mb-0">
                          Try adjusting your percentage or selecting a different stream.
                        </p>
                      </Card.Body>
                    </Card>
                  ) : (
                    <Card className="shadow-sm mb-4 border-0" style={{ borderRadius: '10px' }}>
                      <Card.Header className="bg-white border-0 pt-4 pb-0">
                        <h5 className="mb-0">
                          <FaUniversity className="me-2 text-primary" />
                          Course Recommendations
                        </h5>
                        <p className="text-muted mb-0">
                          Browse recommended courses based on your performance in {getStreamName(selectedStream)}
                        </p>
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          {courses.map((course, index) => (
                            <Col lg={4} md={6} className="mb-4" key={index}>
                              <Card 
                                className="h-100 border"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleCourseClick(course)}
                              >
                                <Card.Body>
                                  <div className="d-flex align-items-start gap-3 mb-3">
                                    <div style={{ fontSize: '24px' }}>
                                      {course.icon}
                                    </div>
                                    <div>
                                      <h6 className="mb-1">{course.name}</h6>
                                      <Badge bg="info">{course.duration}</Badge>
                                    </div>
                                  </div>
                                  <p className="text-muted small mb-3">
                                    {course.description}
                                  </p>
                                  <div className="mt-auto">
                                    <small className="text-muted d-block mb-2">Career Opportunities</small>
                                    <div className="d-flex flex-wrap gap-1">
                                      {course.careers.slice(0, 3).map((career, idx) => (
                                        <Badge bg="light" text="dark" key={idx} className="small">
                                          {career}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Card.Body>
                    </Card>
                  )}
                </div>
              )}

              {!selectedStream && (
                <Card className="shadow-sm border-0" style={{ borderRadius: '10px' }}>
                  <Card.Body>
                    <h4>How to Get Guidance</h4>
                    <p className="text-muted mb-0">
                      <strong>Step 1:</strong> Select your 12th grade stream<br />
                      <strong>Step 2:</strong> Enter your percentage<br />
                      <strong>Step 3:</strong> Click "Get Guidance" to see recommendations
                    </p>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}
        </Container>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>
            {selectedCourse?.icon}
            <span className="ms-2">{selectedCourse?.name}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse && (
            <div>
              <div className="mb-4">
                <h6 className="text-muted mb-2">Duration</h6>
                <Badge bg="info" className="fs-6">{selectedCourse.duration}</Badge>
              </div>
              
              <div className="mb-4">
                <h6 className="text-muted mb-2">Description</h6>
                <p>{selectedCourse.description}</p>
              </div>
              
              <div className="mb-4">
                <h6 className="text-muted mb-2">Career Opportunities</h6>
                <Row>
                  {selectedCourse.careers.map((career, index) => (
                    <Col md={6} key={index} className="mb-2">
                      <Badge bg="primary" className="w-100 py-2">
                        <FaCheckCircle className="me-2" />
                        {career}
                      </Badge>
                    </Col>
                  ))}
                </Row>
              </div>
              
              <Alert variant="info">
                <FaInfoCircle className="me-2" />
                <strong>Tip:</strong> Click on a course to learn more about career paths
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowModal(false)
            navigate('/UserDashboard')
          }}>
            Go to Dashboard
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default TwelfthGuidance