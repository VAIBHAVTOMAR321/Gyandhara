import React, { useState, useEffect, useRef } from 'react'
import { Container, Card, Button, Row, Col, Badge, Form, ProgressBar, Modal, Alert, Tab, Nav } from 'react-bootstrap'
// FIXED: Added FaChartLine to this import list
import { 
  FaGraduationCap, 
  FaLightbulb, 
  FaArrowLeft, 
  FaFlask, 
  FaCalculator, 
  FaBook, 
  FaBalanceScale, 
  FaBrain, 
  FaUserTie, 
  FaWrench, 
  FaCog, 
  FaCertificate, 
  FaCheckCircle, 
  FaInfoCircle, 
  FaUniversity, 
  FaBusinessTime, 
  FaCode, 
  FaDna, 
  FaBookOpen,
  FaChartLine 
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import CounselingForm from './CounselingForm'
import { useAuth } from '../all_login/AuthContext'
import { useLanguage } from '../all_login/LanguageContext'
import '../../assets/css/10thclass.css'
import UserHeader from './UserHeader'
import UserLeftNav from './UserLeftNav'

const NinthGuidance = () => {
  const navigate = useNavigate()
  const { uniqueId, accessToken } = useAuth()
  const { language } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      return width >= 1024;
    }
    return true;
  })
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [selectedStream, setSelectedStream] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedCareerPath, setSelectedCareerPath] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCounseling, setShowCounseling] = useState(false)
  const resultsRef = useRef(null)

  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Handle Counseling Form Submission
  const handleCounselingSubmit = async (formData) => {
    try {
      const payload = {
        student_id: uniqueId,
        category_consulting: formData.category_consulting
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }

      const response = await axios.post(
        'https://brjobsedu.com/gyandhara/gyandhara_backend/api/student-cousult/',
        payload,
        config
      )

      if (response.data.success || response.status === 200 || response.status === 201) {
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to submit counseling request')
      }
    } catch (error) {
      console.error('Counseling submission error:', error)
      throw error
    }
  }

  const ninthStreams = [
    { 
      id: 'foundation-science', 
      name: language === 'hi' ? 'विज्ञान फाउंडेशन' : 'Science Foundation', 
      icon: <FaFlask />, 
      focus: language === 'hi' ? 'भौतिकी, रसायन विज्ञान, जीव विज्ञान' : 'Physics, Chemistry, Biology',
      description: language === 'hi' ? '10वीं के लिए मजबूत विज्ञान अवधारणाएं' : 'Strong science concepts for 10th'
    }, 
    { 
      id: 'foundation-commerce', 
      name: language === 'hi' ? 'वाणिज्य फाउंडेशन' : 'Commerce Foundation', 
      icon: <FaCalculator />, 
      focus: language === 'hi' ? 'गणित, अर्थशास्त्र, बुकीपीडिंग' : 'Mathematics, Economics, Bookkeeping',
      description: language === 'hi' ? '10वीं के लिए वाणिज्य अवधारणाएं' : 'Commerce concepts for 10th'
    }, 
    { 
      id: 'foundation-arts', 
      name: language === 'hi' ? 'कला फाउंडेशन' : 'Arts Foundation', 
      icon: <FaBook />, 
      focus: language === 'hi' ? 'इतिहास, भूगोल, सामाजिक विज्ञान' : 'History, Geography, Social Science',
      description: language === 'hi' ? '10वीं के लिए कला विषयों की तैयारी' : 'Arts subjects preparation for 10th'
    },
    { 
      id: 'foundation-vocational', 
      name: language === 'hi' ? 'कौशल फाउंडेशन' : 'Skills Foundation', 
      icon: <FaWrench />, 
      focus: language === 'hi' ? 'तकनीकी, IT, कंप्यूटर' : 'Technical, IT, Computer',
      description: language === 'hi' ? 'व्यावसायिक कौशल विकास' : 'Vocational skills development'
    }
  ]

  const getFoundationPlan = (streamId) => {
    const plans = {
      'foundation-science': {
        title: language === 'hi' ? 'विज्ञान फाउंडेशन प्लान' : 'Science Foundation Plan',
        subjects: [
          { name: language === 'hi' ? 'भौतिकी (Physics)' : 'Physics', importance: language === 'hi' ? 'उच्च' : 'High', topics: language === 'hi' ? 'गति, ऊर्जा, प्रकाश, विद्युत' : 'Motion, Energy, Light, Electricity' },
          { name: language === 'hi' ? 'रसायन विज्ञान (Chemistry)' : 'Chemistry', importance: language === 'hi' ? 'उच्च' : 'High', topics: language === 'hi' ? 'रासायनिक अभिक्रिया, तत्व, यौगिक' : 'Chemical reactions, Elements, Compounds' },
          { name: language === 'hi' ? 'जीव विज्ञान (Biology)' : 'Biology', importance: language === 'hi' ? 'मध्यम' : 'Medium', topics: language === 'hi' ? 'कोशिका, पोषण, श्वसन' : 'Cell, Nutrition, Respiration' }
        ],
        studyTips: [
          language === 'hi' ? 'प्रत्येक दिन 2 घंटे विज्ञान अध्ययन करें' : 'Study science for 2 hours daily',
          language === 'hi' ? 'प्रायोगिक कक्षाओं में भाग लें' : 'Attend practical classes regularly',
          language === 'hi' ? 'डायग्राम और सूत्रों का अभ्यास करें' : 'Practice diagrams and formulas'
        ],
        timeline: language === 'hi' ? '10वीं तक का विकास' : 'Development until 10th'
      },
      'foundation-commerce': {
        title: language === 'hi' ? 'वाणिज्य फाउंडेशन प्लान' : 'Commerce Foundation Plan',
        subjects: [
          { name: language === 'hi' ? 'गणित (Mathematics)' : 'Mathematics', importance: language === 'hi' ? 'उच्च' : 'High', topics: language === 'hi' ? 'बीजगणित, ज्यामिती, वाणिज्य गणित' : 'Algebra, Geometry, Commercial Math' },
          { name: language === 'hi' ? 'अर्थशास्त्र (Economics)' : 'Economics', importance: language === 'hi' ? 'उच्च' : 'High', topics: language === 'hi' ? 'बाजार, मांग-प्रसार, संसाधन' : 'Market, Demand-Supply, Resources' },
          { name: language === 'hi' ? 'बुकीपीडिंग (Bookkeeping)' : 'Bookkeeping', importance: language === 'hi' ? 'मध्यम' : 'Medium', topics: language === 'hi' ? 'लेखा, वितरण, लाभ-हानि' : 'Accounting, Distribution, Profit-Loss' }
        ],
        studyTips: [
          language === 'hi' ? 'अर्थशास्त्र के सिद्धांत समझें' : 'Understand economics concepts',
          language === 'hi' ? 'गणित की नियमित अभ्यास करें' : 'Practice mathematics regularly',
          language === 'hi' ? 'व्यावहारिक उदाहरणों का अध्ययन करें' : 'Study practical examples'
        ],
        timeline: language === 'hi' ? 'व्यावसायिक सफलता का आधार' : 'Foundation for business success'
      },
      'foundation-arts': {
        title: language === 'hi' ? 'कला फाउंडेशन प्लान' : 'Arts Foundation Plan',
        subjects: [
          { name: language === 'hi' ? 'इतिहास (History)' : 'History', importance: language === 'hi' ? 'उच्च' : 'High', topics: language === 'hi' ? 'संस्कृति, साम्राज्य, सामाजिक बदलाव' : 'Culture, Empires, Social Change' },
          { name: language === 'hi' ? 'भूगोल (Geography)' : 'Geography', importance: language === 'hi' ? 'उच्च' : 'High', topics: language === 'hi' ? 'क्षेत्रशास्त्र, जलवायु, संसाधन' : 'Regional Studies, Climate, Resources' },
          { name: language === 'hi' ? 'सामाजिक विज्ञान (Social Science)' : 'Social Science', importance: language === 'hi' ? 'मध्यम' : 'Medium', topics: language === 'hi' ? 'समाज, शासन, अधिकार' : 'Society, Governance, Rights' }
        ],
        studyTips: [
          language === 'hi' ? 'कालावधि और घटनाओं का अध्ययन करें' : 'Study timelines and events',
          language === 'hi' ? 'मानचित्रों पर ध्यान दें' : 'Focus on maps',
          language === 'hi' ? 'सामाजिक मुद्दों को समझें' : 'Understand social issues'
        ],
        timeline: language === 'hi' ? 'मानवीय और सांस्कृतिक विकास' : 'Human and cultural development'
      },
      'foundation-vocational': {
        title: language === 'hi' ? 'कौशल फाउंडेशन प्लान' : 'Skills Foundation Plan',
        subjects: [
          { name: language === 'hi' ? 'कंप्यूटर कौशल (Computer Skills)' : 'Computer Skills', importance: language === 'hi' ? 'उच्च' : 'High', topics: language === 'hi' ? 'MS Office, इंटरनेट, बुनियादी IT' : 'MS Office, Internet, Basic IT' },
          { name: language === 'hi' ? 'तकनीकी अवधारणाएं (Technical Concepts)' : 'Technical Concepts', importance: language === 'hi' ? 'उच्च' : 'High', topics: language === 'hi' ? 'उपकरण, मशीनरी, विनिर्माण' : 'Tools, Machinery, Manufacturing' },
          { name: language === 'hi' ? 'कार्यक्षेत्र ज्ञान (Workplace Knowledge)' : 'Workplace Knowledge', importance: language === 'hi' ? 'मध्यम' : 'Medium', topics: language === 'hi' ? 'सुरक्षा, काम का संगठन, टीमवर्क' : 'Safety, Work Organization, Teamwork' }
        ],
        studyTips: [
          language === 'hi' ? 'कंप्यूटर कौशल विकसित करें' : 'Develop computer skills',
          language === 'hi' ? 'व्यावहारिक कार्यक्षेत्र में हिस्सा लें' : 'Engage in practical work',
          language === 'hi' ? 'तकनीकी पुस्तकें पढ़ें' : 'Read technical books'
        ],
        timeline: language === 'hi' ? 'तकनीकी प्रगति का मार्ग' : 'Path to technical advancement'
      }
    }
    return plans[streamId] || plans['foundation-science']
  }

  const handleStreamChange = (e) => {
    setSelectedStream(e.target.value)
    setShowResults(false)
  }

  const handleGetGuidance = () => {
    if (!selectedStream) {
      alert(language === 'hi' ? 'कृपया एक स्ट्रीम चुनें' : 'Please select a stream')
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

  const handleCareerPathClick = (path, courseName) => {
    setSelectedCareerPath(path)
    navigate('/OccupationDetails', { 
      state: { 
        occupation: path.path.split('→').pop().trim(),
        stream: selectedStream,
        course: courseName
      } 
    })
  }

  const foundationData = selectedStream ? getFoundationPlan(selectedStream) : null

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
              {/* Back Button */}
              <div className="mb-4">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate('/UserDashboard')} 
                  className="d-flex align-items-center"
                >
                  <FaArrowLeft className="me-2" />
                  {language === 'hi' ? "डैशबोर्ड पर वापस जाएं" : "Back to Dashboard"}
                </Button>
              </div>

              {/* Header Card */}
              <Card className="shadow-sm mb-4 border-0 notifications-header-card " style={{ borderRadius: '10px' }}>
                <Card.Body>
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    <div>
                      <h3 className="mb-2">
                        <FaGraduationCap className="me-2 text-primary" />
                        {language === 'hi' ? "9वीं करियर मार्गदर्शन" : "9th Career Guidance"}
                      </h3>
                      <p className="text-muted mb-0">
                        {language === 'hi' ? "10वीं की तैयारी और विषयों के फाउंडेशन के लिए मार्गदर्शन" : "Guidance for 10th preparation and subject foundations"}
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <CounselingForm
                onSubmit={handleCounselingSubmit}
                showForm={showCounseling}
                onToggle={setShowCounseling}
                studentId={uniqueId}
              />

              {/* Step 1: Select Stream */}
              <Card className="shadow-sm mb-4 border-0" style={{ borderRadius: '10px' }}>
                <Card.Body>
                  <h5 className="mb-3">
                    <Badge bg="primary" className="me-2">{language === 'hi' ? "चरण 1:" : "Step 1:"}</Badge>
                    {language === 'hi' ? "अपना फाउंडेशन स्ट्रीम चुनें" : "Select Your Foundation Stream"}
                  </h5>
                  <Row>
                    {ninthStreams.map((stream) => (
                      <Col lg={3} md={6} className="mb-3" key={stream.id}>
                        <Card
                          className={`h-100 border stream-selection-card ${selectedStream === stream.id ? 'selected' : ''}`}
                          style={{
                            cursor: 'pointer',
                            borderColor: selectedStream === stream.id ? '#667eea' : '#dee2e6',
                            backgroundColor: selectedStream === stream.id ? '#f0f4ff' : 'white'
                          }}
                          onClick={() => handleStreamChange({ target: { value: stream.id } })}
                        >
                          <Card.Body className="p-3 text-center">
                            <div className="stream-icon-large mb-2">
                              {stream.icon}
                            </div>
                            <h6 className="mb-1">{stream.name}</h6>
                            <small className="text-muted">{stream.focus}</small>
                            {selectedStream === stream.id && (
                              <Badge bg="primary" className="mt-2">
                                <FaCheckCircle className="me-1" /> {language === 'hi' ? "चयनित" : "Selected"}
                              </Badge>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>

              {/* Step 2: Get Guidance */}
              {selectedStream && (
                <Card className="shadow-sm mb-4 border-0" style={{ borderRadius: '10px' }}>
                  <Card.Body>
                    <h5 className="mb-3">
                      <Badge bg="primary" className="me-2">{language === 'hi' ? "चरण 2:" : "Step 2:"}</Badge>
                      {language === 'hi' ? "पाठ्यक्रम और अध्ययन योजना प्राप्त करें" : "Get Curriculum and Study Plan"}
                    </h5>
                    <Row className="align-items-center">
                      <Col md={8}>
                        <p className="mb-0">
                          {language === 'hi' 
                            ? "अपने चयनित फाउंडेशन के आधार पर विस्तृत अध्ययन योजना और विषय गाइड प्राप्त करें" 
                            : "Get detailed study plan and subject guide based on your selected foundation"}
                        </p>
                      </Col>
                      <Col md={4} className='mobile-btn-sty'>
                        <Button 
                          variant="primary" 
                          size="lg"
                          onClick={handleGetGuidance}
                          className="w-100 mobile-btn-get"
                        >
                          <FaLightbulb className="me-2" />
                          {language === 'hi' ? "मार्गदर्शन प्राप्त करें" : "Get Guidance"}
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}

              {/* Step 3: Results */}
              {showResults && foundationData && (
                <div ref={resultsRef}>
                  {/* Foundation Plan */}
                  <Card className="shadow-sm mb-4 border-0" style={{ borderRadius: '10px' }}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <h5 className="mb-1">{foundationData.title}</h5>
                          <p className="text-muted mb-0">
                            {language === 'hi' ? "10वीं तक का पूर्ण फाउंडेशन विकास" : "Complete foundation development until 10th"}
                          </p>
                        </div>
                        <div className="text-end">
                          <Badge bg="success" className="fs-5 p-3">
                            <FaBookOpen className="me-1" />
                            {language === 'hi' ? "अध्ययन योजना" : "Study Plan"}
                          </Badge>
                        </div>
                      </div>

                      <Row>
                        {foundationData.subjects.map((subject, index) => (
                          <Col md={4} key={index} className="mb-3">
                            <Card className="h-100 border-0" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                              <Card.Body>
                                <div className="d-flex align-items-center gap-3 mb-3">
                                  <div className="course-icon-small" style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%',
                                    backgroundColor: subject.importance === (language === 'hi' ? 'उच्च' : 'High') ? '#28a745' : 
                                                                                           subject.importance === (language === 'hi' ? 'मध्यम' : 'Medium') ? '#ffc107' : '#fd7e14',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '1rem'
                                  }}>
                                    <FaBook />
                                  </div>
                                  <div>
                                    <h6 className="mb-0">{subject.name}</h6>
                                    <Badge bg={subject.importance === (language === 'hi' ? 'उच्च' : 'High') ? 'success' : 
                                                         subject.importance === (language === 'hi' ? 'मध्यम' : 'Medium') ? 'warning' : 'info'}>
                                      {subject.importance}
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-muted small">
                                  {language === 'hi' ? 'विषय:' : 'Topics:'} {subject.topics}
                                </p>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>

                      <hr />

                      <div className="mt-4">
                        <h6 className="mb-3">
                          <FaLightbulb className="me-2 text-warning" />
                          {language === 'hi' ? "अध्ययन योजना के लिए सुझाव" : "Study Plan Tips"}
                        </h6>
                        <Row>
                          {foundationData.studyTips.map((tip, index) => (
                            <Col md={6} lg={4} key={index} className="mb-2">
                              <div className="d-flex align-items-start">
                                <Badge bg="primary" className="me-2 mt-1">{index + 1}</Badge>
                                <span>{tip}</span>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* 10th Stream Recommendations */}
                  <Card className="shadow-sm mb-4 border-0" style={{ borderRadius: '10px' }}>
                    <Card.Header className="bg-white border-0 pt-4 pb-0">
                      <h5 className="mb-0">
                        <FaUniversity className="me-2 text-primary" />
                        {language === 'hi' ? "10वीं स्ट्रीम के लिए तैयारी" : "10th Stream Preparation"}
                      </h5>
                      <p className="text-muted mb-0">
                        {language === 'hi' ? "अगले स्तर के लिए मजबूत आधार बनाएं" : "Build strong foundation for next level"}
                      </p>
                    </Card.Header>
                    <Card.Body>
                      <Tab.Container id="ninth-tabs" defaultActiveKey="recommended">
                        <Nav variant="tabs" className="mb-4">
                          <Nav.Item>
                            <Nav.Link eventKey="recommended">
                              <FaUniversity className="me-2" />
                              {language === 'hi' ? "अनुशंसित पाठ्यक्रम" : "Recommended Curriculum"}
                            </Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link eventKey="timeline">
                              <FaChartLine className="me-2" />
                              {language === 'hi' ? "विकास अनुसूची" : "Development Timeline"}
                            </Nav.Link>
                          </Nav.Item>
                        </Nav>
                        <Tab.Content>
                          <Tab.Pane eventKey="recommended">
                            <Alert variant="info">
                              <FaInfoCircle className="me-2" />
                              <strong>{language === 'hi' ? "10वीं के लिए महत्वपूर्ण विषय:" : "Key Subjects for 10th:"}</strong><br />
                              {language === 'hi' 
                                ? "• गणित: बीजगणित, ज्यामिती, त्रिकोणमिति\n• विज्ञान: भौतिकी, रसायन विज्ञान, जीव विज्ञान\n• सामाजिक विज्ञान: इतिहास, भूगोल, अर्थशास्त्र\n• भाषा: हिंदी/अंग्रेजी, साहित्य" 
                                : "• Mathematics: Algebra, Geometry, Trigonometry\n• Science: Physics, Chemistry, Biology\n• Social Science: History, Geography, Economics\n• Language: Hindi/English, Literature"}
                            </Alert>
                          </Tab.Pane>
                          <Tab.Pane eventKey="timeline">
                            <Card>
                              <Card.Body>
                                <h6>{foundationData.timeline}</h6>
                                <div className="timeline mt-3">
                                  <div className="timeline-item">
                                    <Badge bg="primary">1-6 माह</Badge>
                                    <span className="ms-2">{language === 'hi' ? "मूल अवधारणाओं की समझ" : "Understanding core concepts"}</span>
                                  </div>
                                  <div className="timeline-item">
                                    <Badge bg="success">7-10 माह</Badge>
                                    <span className="ms-2">{language === 'hi' ? "विषयों का गहरा अध्ययन" : "Deep dive into subjects"}</span>
                                  </div>
                                  <div className="timeline-item">
                                    <Badge bg="info">11-12 माह</Badge>
                                    <span className="ms-2">{language === 'hi' ? "परीक्षा तैयारी और अभ्यास" : "Exam preparation and practice"}</span>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Tab.Pane>
                        </Tab.Content>
                      </Tab.Container>
                    </Card.Body>
                  </Card>

                  {/* Additional Guidance */}
                  <Card className="shadow-sm border-0 guidance-card" style={{ borderRadius: '10px' }}>
                    <Card.Body>
                      <h5 className="mb-3">
                        <FaLightbulb className="me-2 text-warning" />
                        {language === 'hi' ? "अतिरिक्त मार्गदर्शन" : "Additional Guidance"}
                      </h5>
                      <Row>
                        <Col md={6}>
                          <h6>
                            {language === 'hi' ? '9वीं छात्रों के लिए सुझाव' : 'Tips for 9th Students'}</h6>
                          <ul className="text-muted">
                            <li>{language === 'hi' ? "मूल अवधारणाओं पर ध्यान केंद्रित करें" : "Focus on understanding core concepts"}</li>
                            <li>{language === 'hi' ? "नियमित रूप से पढ़ाई करें" : "Study regularly and consistently"}</li>
                            <li>{language === 'hi' ? "नोट्स बनाएं और समीक्षा करें" : "Make notes and review regularly"}</li>
                            <li>{language === 'hi' ? "प्रश्न पूछें और समझें" : "Ask questions and clarify doubts"}</li>
                          </ul>
                        </Col>
                        <Col md={6}>
                          <h6>{language === 'hi' ? "10वीं तक की तैयारी:" : "Preparation for 10th:"}</h6>
                          <ul className="text-muted">
                            <li>{language === 'hi' ? "विषयों की गहराई से समझ बनाएं" : "Build deep understanding of subjects"}</li>
                            <li>{language === 'hi' ? "समय प्रबंधन कौशल विकसित करें" : "Develop time management skills"}</li>
                            <li>{language === 'hi' ? "प्रैक्टिकल वर्क में भाग लें" : "Participate in practical work"}</li>
                            <li>{language === 'hi' ? "अच्छे अध्ययन आदतें बनाएं" : "Develop good study habits"}</li>
                          </ul>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </div>
              )}

              {/* Instructions */}
              {!selectedStream && (
                <Card className="shadow-sm border-0 instructions-card" style={{ borderRadius: '10px' }}>
                  <Card.Body>
                    <h4>{language === 'hi' ? "मार्गदर्शन कैसे प्राप्त करें" : "How to Get Guidance"}</h4>
                    <p className="text-muted mb-0">
                      <strong>{language === 'hi' ? "चरण 1:" : "Step 1:"}</strong> {language === 'hi' ? "अपनी रुचियों और लक्ष्यों के आधार पर स्ट्रीम चुनें" : "Select stream based on your interests and goals"}<br />
                      <strong>{language === 'hi' ? "चरण 2:" : "Step 2:"}</strong> {language === 'hi' ? "'मार्गदर्शन प्राप्त करें' पर क्लिक करें" : "Click 'Get Guidance' button"}<br />
                      <strong>{language === 'hi' ? "चरण 3:" : "Step 3:"}</strong> {language === 'hi' ? "विस्तृत अध्ययन योजना और सुझाव पढ़ें" : "Read detailed study plan and tips"}
                    </p>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}
        </Container>
      </div>

      {/* Stream Details Modal */}
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
                <h6 className="text-muted mb-2">{language === 'hi' ? "विवरण" : "Description"}</h6>
                <p>{selectedCourse.description}</p>
              </div>
               
              {/* Career Paths Section */}
              {selectedCourse.careerPaths && selectedCourse.careerPaths.length > 0 && (
                <div className="mb-4">
                  <h6 className="text-muted mb-3">
                    <FaLightbulb className="me-2 text-warning" />
                    {language === 'hi' ? "कदम-दर-कदम करियर पथ" : "Step-by-Step Career Path"}
                  </h6>
                  <Row>
                    {selectedCourse.careerPaths.map((path, index) => (
                      <Col md={6} key={index} className="mb-3">
                        <Card 
                          className={`h-100 border career-path-card ${selectedCareerPath === path ? 'selected' : ''}`}
                          style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden' }}
                          onClick={() => handleCareerPathClick(path, selectedCourse?.name)}
                        >
                          <Card.Body className="p-3" style={{ maxHeight: selectedCareerPath === path ? '400px' : 'auto', overflowY: selectedCareerPath === path ? 'auto' : 'visible' }}>
                            <h6 className="mb-2 text-primary">{path.path}</h6>
                            <div className="mb-2">
                              <Badge bg="secondary" className="w-100">{path.growth}</Badge>
                            </div>
                            {selectedCareerPath === path && (
                              <div className="mt-3">
                                <h6 className="text-muted mb-2">{language === 'hi' ? "सफलता के चरण:" : "Steps to Achieve:"}</h6>
                                <ol className="ps-3 mb-0">
                                  {path.steps.map((step, idx) => (
                                    <li key={idx} className="mb-1 small">{step}</li>
                                  ))}
                                </ol>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
              
              {/* Career Opportunities */}
              <div className="mb-4">
                <h6 className="text-muted mb-2">{language === 'hi' ? "करियर के अवसर" : "Career Opportunities"}</h6>
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
                <strong>{language === 'hi' ? "सुझाव:" : "Tip:"}</strong> {language === 'hi' ? "विस्तृत चरणों को देखने के लिए करियर पथ पर क्लिक करें" : "Click on a career path to see detailed steps"}
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {language === 'hi' ? "बंद करें" : "Close"}
          </Button>
          <Button variant="primary" onClick={() => {
            setShowModal(false)
            navigate('/UserDashboard')
          }}>
            {language === 'hi' ? "डैशबोर्ड पर जाएं" : "Go to Dashboard"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default NinthGuidance