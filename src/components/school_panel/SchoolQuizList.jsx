import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Modal, Form, Badge, Alert } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from '../all_login/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaCalendar, FaUsers, FaClock, FaBook, FaCheck, FaTimes } from 'react-icons/fa'
import SchoolLeftNav from './SchoolLeftNav'
import SchoolHeader from './SchoolHeader'

const API_URL = 'https://brjobsedu.com/gyandhara/gyandhara_backend/api/quiz-competition-items/'
const API_URL_REGISTRATION = 'https://brjobsedu.com/gyandhara/gyandhara_backend/api/quiz-registrations/'

const SchoolQuizList = () => {
  const { accessToken, uniqueId: school_uni_id } = useAuth()
  const navigate = useNavigate()
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [registeredStudents, setRegisteredStudents] = useState({})

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
      fetchQuizzes()
    }
  }, [accessToken])

  const fetchQuizzes = async () => {
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
        setQuizzes(response.data.data)
      } else if (Array.isArray(response.data)) {
        setQuizzes(response.data)
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      setQuizzes([])
    } finally {
      setLoading(false)
    }
  }

  const fetchSchoolStudents = async () => {
    if (!accessToken || !school_uni_id) return
    
    try {
      setStudentsLoading(true)
      const response = await axios.get(
        `https://brjobsedu.com/gyandhara/gyandhara_backend/api/school-aadhaar-reg/?school_uni_id=${school_uni_id}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )

      if (response.data.success && response.data.data) {
        const data = response.data.data
        setStudents(Array.isArray(data) ? data : [data])
      } else {
        setStudents([])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      setStudents([])
    } finally {
      setStudentsLoading(false)
    }
  }

  const checkRegisteredStudents = async (quizId) => {
    if (!accessToken) return []
    
    try {
      const response = await axios.get(
        `${API_URL_REGISTRATION}?quiz_id=${quizId}&school_uni_id=${school_uni_id}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )

      if (response.data.success && response.data.data) {
        const data = response.data.data
        return Array.isArray(data) ? data.map(d => d.aadhaar_no) : [data.aadhaar_no]
      }
    } catch (error) {
      console.error('Error checking registrations:', error)
    }
    return []
  }

  const handleRegisterClick = async (quiz) => {
    setSelectedQuiz(quiz)
    setSelectedStudents([])
    setError('')
    setSuccess('')
    await fetchSchoolStudents()
    
    const registered = await checkRegisteredStudents(quiz.id)
    setRegisteredStudents(prev => ({ ...prev, [quiz.id]: registered }))
    
    setShowRegisterModal(true)
  }

  const toggleStudentSelection = (aadhaarNo) => {
    setSelectedStudents(prev => 
      prev.includes(aadhaarNo) 
        ? prev.filter(id => id !== aadhaarNo)
        : [...prev, aadhaarNo]
    )
  }

  const registerStudents = async () => {
    if (!selectedQuiz || selectedStudents.length === 0) {
      setError('Please select at least one student')
      return
    }

    setRegisterLoading(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        quiz_id: selectedQuiz.id,
        school_uni_id: school_uni_id,
        students: selectedStudents.map(aadhaar_no => ({ aadhaar_no }))
      }

      await axios.post(API_URL_REGISTRATION, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      setSuccess(`${selectedStudents.length} student(s) registered for ${selectedQuiz.title}`)
      setShowRegisterModal(false)
      fetchQuizzes()
    } catch (error) {
      console.error('Error registering students:', error)
      setError(error.response?.data?.message || 'Failed to register students')
    } finally {
      setRegisterLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isQuizActive = (quiz) => {
    if (!quiz.is_active) return false
    const now = new Date()
    if (quiz.end_date_time && new Date(quiz.end_date_time) < now) return false
    return true
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <SchoolLeftNav
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
          isTablet={isTablet}
        />
        <div className="main-content-dash">
          <SchoolHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <div className="dashboard-content">
            <Container className="dashboard-box">
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
        <SchoolLeftNav
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
          isTablet={isTablet}
        />
        <div className="main-content-dash">
          <SchoolHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <div className="dashboard-content">
            <Container className="dashboard-box">
              <div className="d-flex justify-content-between align-items-center mb-4 page-header">
                <div className="d-flex align-items-center all-en-box gap-3">
                  <Button variant="outline-secondary" size="sm" onClick={() => navigate('/SchoolDashBoard')} className="me-2">
                    <FaArrowLeft /> Dashboard
                  </Button>
                  <h4 className="mb-0">Quiz Competitions</h4>
                </div>
                <span className="text-muted">
                  {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} available
                </span>
              </div>

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}

              {quizzes.length === 0 ? (
                <Card className="shadow-box">
                  <Card.Body className="text-center py-5">
                    <p className="text-muted mb-0">No quizzes available at the moment.</p>
                    <small className="text-muted">Check back later for new competitions.</small>
                  </Card.Body>
                </Card>
              ) : (
                <Row>
                  {quizzes.map((quiz) => (
                    <Col key={quiz.id} md={6} lg={4} className="mb-4">
                      <Card className="shadow-sm h-100 quiz-card">
                        <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
                          <Badge bg={isQuizActive(quiz) ? 'success' : 'secondary'}>
                            {isQuizActive(quiz) ? 'Active' : 'Inactive'}
                          </Badge>
                          <small className="text-muted">{quiz.questions?.length || 0} Questions</small>
                        </Card.Header>
                        <Card.Body>
                          <Card.Title className="h5 mb-2">{quiz.title}</Card.Title>
                          {quiz.title_hindi && (
                            <Card.Subtitle className="mb-3 text-muted small">{quiz.title_hindi}</Card.Subtitle>
                          )}
                          
                          {quiz.description && (
                            <Card.Text className="small text-muted mb-3">
                              {quiz.description.length > 100 
                                ? quiz.description.substring(0, 100) + '...' 
                                : quiz.description}
                            </Card.Text>
                          )}

                          <div className="mb-3">
                            <small className="text-muted d-block mb-1">
                              <FaClock className="me-1" />
                              Duration:
                            </small>
                            <div className="small">
                              <div><strong>Start:</strong> {formatDate(quiz.start_date_time)}</div>
                              <div><strong>End:</strong> {formatDate(quiz.end_date_time)}</div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <small className="text-muted d-block mb-1">
                              <FaBook className="me-1" />
                              Category:
                            </small>
                            <Badge bg="info">{quiz.quiz_category}</Badge>
                          </div>

                          <div>
                            <small className="text-muted d-block mb-2">
                              <FaUsers className="me-1" />
                              Eligible Classes:
                            </small>
                            <div className="d-flex flex-wrap gap-2">
                              {quiz.class_allowed?.map((cls, idx) => {
                                const classColors = ['primary', 'success', 'danger', 'warning'];
                                const colorIndex = idx % classColors.length;
                                return (
                                  <Badge 
                                    key={cls} 
                                    bg={classColors[colorIndex]}
                                    className="px-3 py-2 rounded-pill fw-semibold"
                                    style={{
                                      fontSize: '0.85rem',
                                      textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                    }}
                                  >
                                    Class {cls}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        </Card.Body>
                        <Card.Footer className="bg-white py-3">
                          <Button 
                            variant="primary" 
                            className="w-100"
                            onClick={() => handleRegisterClick(quiz)}
                            disabled={!isQuizActive(quiz)}
                          >
                            Add Students / Register
                          </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Container>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-bottom py-2 px-3">
          <Modal.Title className="fw-semibold fs-6">
            Register Students for Quiz
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          {selectedQuiz && (
            <>
              <Alert variant="info" className="mb-3">
                <strong>Quiz:</strong> {selectedQuiz.title}<br />
                <strong>Category:</strong> {selectedQuiz.quiz_category}<br />
                <strong>Eligible Classes:</strong> {selectedQuiz.class_allowed?.join(', ')}
              </Alert>

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              {studentsLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading students...</p>
                </div>
              ) : students.length === 0 ? (
                <Alert variant="warning">
                  No students registered in your school yet.
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => navigate('/SchoolStudentRegistration')}
                    className="p-0 ms-2"
                  >
                    Register students here
                  </Button>
                </Alert>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small text-muted">
                      Select students to register ({selectedStudents.length} selected)
                    </span>
                    <div>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => setSelectedStudents(students.map(s => s.aadhaar_no))}
                      >
                        Select All
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => setSelectedStudents([])}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <table className="table table-bordered table-hover">
                      <thead className="bg-light">
                        <tr>
                          <th style={{ width: '40px' }}>Select</th>
                          <th>Aadhaar Number</th>
                          <th>Full Name</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => {
                          const isRegistered = registeredStudents[selectedQuiz?.id]?.includes(student.aadhaar_no)
                          const isSelected = selectedStudents.includes(student.aadhaar_no)
                          return (
                            <tr key={student.id} className={isSelected ? 'table-primary' : ''}>
                              <td>
                                <Form.Check
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleStudentSelection(student.aadhaar_no)}
                                  disabled={isRegistered}
                                />
                              </td>
                              <td>{student.aadhaar_no}</td>
                              <td>{student.full_name}</td>
                              <td>
                                {isRegistered ? (
                                  <Badge bg="success">
                                    <FaCheck className="me-1" /> Registered
                                  </Badge>
                                ) : (
                                  <Badge bg="secondary">Not Registered</Badge>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-top py-2 px-3">
          <Button variant="secondary" onClick={() => setShowRegisterModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={registerStudents} 
            disabled={registerLoading || selectedStudents.length === 0}
          >
            {registerLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Registering...
              </>
            ) : (
              `Register ${selectedStudents.length} Student${selectedStudents.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SchoolQuizList