import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Alert } from "react-bootstrap";
import { useAuth } from "../all_login/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowLeft, FaGraduationCap, FaChalkboardTeacher, FaBalanceScale, FaHospital, FaCode,
  FaCheckCircle, FaChartLine, FaUsers, FaMapMarkerAlt, FaUniversity
} from 'react-icons/fa';
import UserHeader from "./UserHeader";
import UserLeftNav from "./UserLeftNav";
import '../../assets/css/OccupationDetails.css';

const OccupationDetails = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const { uniqueId, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const { occupation, course } = location.state || {};

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
    setLoading(false);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Occupation details data
  const getOccupationDetails = (occupationName) => {
    const occupations = {
      'Teacher': {
        title: 'Teacher',
        icon: <FaChalkboardTeacher className="text-primary" />,
        description: 'Teachers educate students at various levels, from primary schools to universities. They play a crucial role in shaping the future of students.',
        salaryRange: '₹3-15 LPA',
        growthPotential: 'High',
        demandLevel: 'Very High',
        steps: [
          { step: 1, title: 'Complete 12th Standard', description: 'Complete your 12th standard with good percentage', duration: '2 Years', tips: ['Focus on favorite subjects', 'Participate in teaching activities', 'Develop communication skills'] },
          { step: 2, title: 'Pursue Bachelor\'s Degree', description: 'Complete BA/B.Sc/B.Com in your preferred subject', duration: '3 Years', tips: ['Choose relevant subjects', 'Maintain good record', 'Participate in college events'] },
          { step: 3, title: 'Complete B.Ed', description: 'Pursue Bachelor of Education (B.Ed) from a recognized university', duration: '2 Years', tips: ['Choose a good B.Ed college', 'Learn teaching methodologies', 'Practice teaching'] },
          { step: 4, title: 'Clear Teaching Exams', description: 'Clear CTET/TET/STET exams as per your state requirements', duration: '3-6 Months', tips: ['Study previous papers', 'Learn child psychology', 'Take mock tests'] },
          { step: 5, title: 'Apply for Teaching Positions', description: 'Apply for government or private school teaching positions', duration: 'Ongoing', tips: ['Prepare for interviews', 'Create a good resume', 'Apply to multiple schools'] }
        ],
        exams: [
          { name: 'CTET (Central Teacher Eligibility Test)', eligibility: 'B.Ed qualified', frequency: 'Twice a year', difficulty: 'Moderate' },
          { name: 'TET (Teacher Eligibility Test)', eligibility: 'B.Ed qualified', frequency: 'State-wise', difficulty: 'Moderate' },
          { name: 'STET (State Teacher Eligibility Test)', eligibility: 'B.Ed qualified', frequency: 'State-wise', difficulty: 'Moderate' },
          { name: 'UGC NET (for College Teachers)', eligibility: 'Post-Graduation', frequency: 'Twice a year', difficulty: 'High' }
        ],
        skills: ['Communication Skills', 'Patience', 'Subject Knowledge', 'Classroom Management', 'Creativity', 'Adaptability'],
        careerPath: [
          { level: 'Primary Teacher', experience: '0-5 years', salary: '₹3-6 LPA' },
          { level: 'TGT (Trained Graduate Teacher)', experience: '5-10 years', salary: '₹6-10 LPA' },
          { level: 'PGT (Post Graduate Teacher)', experience: '10-15 years', salary: '₹10-15 LPA' },
          { level: 'Vice Principal', experience: '15-20 years', salary: '₹12-18 LPA' },
          { level: 'Principal', experience: '20+ years', salary: '₹15-25 LPA' }
        ],
        topColleges: [
          { name: 'Delhi University', location: 'Delhi', ranking: 'Top 10' },
          { name: 'Jamia Millia Islamia', location: 'Delhi', ranking: 'Top 20' },
          { name: 'Banaras Hindu University', location: 'Varanasi', ranking: 'Top 10' },
          { name: 'University of Mumbai', location: 'Mumbai', ranking: 'Top 20' }
        ]
      },
      'Lawyer': {
        title: 'Lawyer',
        icon: <FaBalanceScale className="text-primary" />,
        description: 'Lawyers provide legal advice and representation to individuals, businesses, and government agencies. They play a vital role in the justice system.',
        salaryRange: '₹4-50 LPA',
        growthPotential: 'Very High',
        demandLevel: 'High',
        steps: [
          { step: 1, title: 'Complete 12th Standard', description: 'Complete your 12th standard with good percentage', duration: '2 Years', tips: ['Focus on humanities subjects', 'Develop reading habits', 'Participate in debates'] },
          { step: 2, title: 'Pursue LLB', description: 'Complete LLB (3 years after graduation) or BA LLB (5 years integrated)', duration: '3-5 Years', tips: ['Choose a good law college', 'Study case laws', 'Participate in moot courts'] },
          { step: 3, title: 'Enroll with Bar Council', description: 'Register with State Bar Council after completing LLB', duration: '1-2 Months', tips: ['Complete bar council formalities', 'Get bar council registration', 'Start internship'] },
          { step: 4, title: 'Complete Internship', description: 'Intern under a senior lawyer to gain practical experience', duration: '1-2 Years', tips: ['Learn court procedures', 'Draft documents', 'Build professional network'] },
          { step: 5, title: 'Start Practice', description: 'Start independent practice or join a law firm', duration: 'Ongoing', tips: ['Build client base', 'Specialize in a field', 'Continue learning'] }
        ],
        exams: [
          { name: 'CLAT (Common Law Admission Test)', eligibility: '12th Pass', frequency: 'Once a year', difficulty: 'High' },
          { name: 'AILET (All India Law Entrance Test)', eligibility: '12th Pass', frequency: 'Once a year', difficulty: 'High' },
          { name: 'LSAT (Law School Admission Test)', eligibility: '12th Pass', frequency: 'Multiple times', difficulty: 'Moderate' }
        ],
        skills: ['Analytical Skills', 'Communication Skills', 'Research Skills', 'Negotiation Skills', 'Ethics', 'Problem Solving'],
        careerPath: [
          { level: 'Junior Lawyer', experience: '0-5 years', salary: '₹4-10 LPA' },
          { level: 'Senior Lawyer', experience: '5-10 years', salary: '₹10-25 LPA' },
          { level: 'Associate Partner', experience: '10-15 years', salary: '₹25-50 LPA' },
          { level: 'Senior Partner', experience: '15-20 years', salary: '₹50-100 LPA' },
          { level: 'Judge', experience: '20+ years', salary: '₹15-25 LPA (Government)' }
        ],
        topColleges: [
          { name: 'National Law School of India University', location: 'Bangalore', ranking: 'Top 1' },
          { name: 'NALSAR University of Law', location: 'Hyderabad', ranking: 'Top 3' },
          { name: 'National Law University', location: 'Delhi', ranking: 'Top 5' },
          { name: 'Faculty of Law, Delhi University', location: 'Delhi', ranking: 'Top 10' }
        ]
      },
      'Software Engineer': {
        title: 'Software Engineer',
        icon: <FaCode className="text-primary" />,
        description: 'Software engineers design, develop, and maintain software applications. They are the backbone of the IT industry.',
        salaryRange: '₹6-25 LPA',
        growthPotential: 'Very High',
        demandLevel: 'Very High',
        steps: [
          { step: 1, title: 'Complete 12th Standard', description: 'Complete your 12th standard with Physics, Chemistry, and Mathematics', duration: '2 Years', tips: ['Focus on mathematics', 'Learn basic programming', 'Participate in coding competitions'] },
          { step: 2, title: 'Pursue B.Tech/BCA', description: 'Complete B.Tech in Computer Science/IT or BCA', duration: '3-4 Years', tips: ['Learn programming languages', 'Build projects', 'Participate in hackathons'] },
          { step: 3, title: 'Learn Programming Languages', description: 'Master programming languages like Java, Python, JavaScript, etc.', duration: 'Ongoing', tips: ['Practice daily', 'Build real projects', 'Contribute to open source'] },
          { step: 4, title: 'Build Portfolio', description: 'Create a portfolio of projects to showcase your skills', duration: '6-12 Months', tips: ['Work on diverse projects', 'Document your work', 'Host code on GitHub'] },
          { step: 5, title: 'Apply for Jobs', description: 'Apply for software engineering positions in IT companies', duration: 'Ongoing', tips: ['Prepare for interviews', 'Practice coding problems', 'Network with professionals'] }
        ],
        exams: [
          { name: 'GATE (Graduate Aptitude Test in Engineering)', eligibility: 'B.Tech', frequency: 'Once a year', difficulty: 'High' },
          { name: 'Company-specific Tests', eligibility: 'B.Tech/BCA', frequency: 'As per recruitment', difficulty: 'Moderate to High' }
        ],
        skills: ['Programming Languages', 'Problem Solving', 'Data Structures', 'Algorithms', 'Database Management', 'Version Control'],
        careerPath: [
          { level: 'Junior Developer', experience: '0-3 years', salary: '₹6-10 LPA' },
          { level: 'Senior Developer', experience: '3-6 years', salary: '₹10-18 LPA' },
          { level: 'Tech Lead', experience: '6-10 years', salary: '₹18-25 LPA' },
          { level: 'Engineering Manager', experience: '10-15 years', salary: '₹25-40 LPA' },
          { level: 'CTO', experience: '15+ years', salary: '₹40-100 LPA' }
        ],
        topColleges: [
          { name: 'IIT Bombay', location: 'Mumbai', ranking: 'Top 1' },
          { name: 'IIT Delhi', location: 'Delhi', ranking: 'Top 2' },
          { name: 'IIT Madras', location: 'Chennai', ranking: 'Top 3' },
          { name: 'BITS Pilani', location: 'Pilani', ranking: 'Top 5' }
        ]
      },
      'Doctor': {
        title: 'Doctor',
        icon: <FaHospital className="text-primary" />,
        description: 'Doctors diagnose and treat illnesses, injuries, and diseases. They are essential healthcare professionals.',
        salaryRange: '₹10-50 LPA',
        growthPotential: 'Very High',
        demandLevel: 'Very High',
        steps: [
          { step: 1, title: 'Complete 12th Standard', description: 'Complete your 12th standard with Physics, Chemistry, and Biology', duration: '2 Years', tips: ['Focus on biology', 'Develop empathy', 'Volunteer in healthcare settings'] },
          { step: 2, title: 'Clear NEET Exam', description: 'Qualify NEET (National Eligibility cum Entrance Test)', duration: '1 Year', tips: ['Understand NCERT thoroughly', 'Solve previous papers', 'Take mock tests'] },
          { step: 3, title: 'Complete MBBS', description: 'Pursue MBBS (Bachelor of Medicine and Bachelor of Surgery)', duration: '5.5 Years', tips: ['Focus on studies', 'Gain clinical experience', 'Develop bedside manners'] },
          { step: 4, title: 'Complete Internship', description: 'Complete mandatory internship in hospital', duration: '1 Year', tips: ['Learn from professionals', 'Handle real cases', 'Build patient relationships'] },
          { step: 5, title: 'Specialize (Optional)', description: 'Pursue MD/MS for specialization', duration: '3 Years', tips: ['Choose specialization wisely', 'Clear NEET PG', 'Join good hospital'] }
        ],
        exams: [
          { name: 'NEET (National Eligibility cum Entrance Test)', eligibility: '12th with PCB', frequency: 'Once a year', difficulty: 'Very High' },
          { name: 'NEET PG', eligibility: 'MBBS', frequency: 'Once a year', difficulty: 'Very High' },
          { name: 'AIIMS PG', eligibility: 'MBBS', frequency: 'Once a year', difficulty: 'Very High' }
        ],
        skills: ['Medical Knowledge', 'Empathy', 'Communication Skills', 'Problem Solving', 'Decision Making', 'Patience'],
        careerPath: [
          { level: 'Junior Resident', experience: '0-3 years', salary: '₹10-15 LPA' },
          { level: 'Senior Resident', experience: '3-6 years', salary: '₹15-25 LPA' },
          { level: 'Consultant', experience: '6-10 years', salary: '₹25-40 LPA' },
          { level: 'Senior Consultant', experience: '10-15 years', salary: '₹40-60 LPA' },
          { level: 'Head of Department', experience: '15+ years', salary: '₹60-100 LPA' }
        ],
        topColleges: [
          { name: 'AIIMS Delhi', location: 'Delhi', ranking: 'Top 1' },
          { name: 'CMC Vellore', location: 'Vellore', ranking: 'Top 3' },
          { name: 'AFMC Pune', location: 'Pune', ranking: 'Top 5' },
          { name: 'Maulana Azad Medical College', location: 'Delhi', ranking: 'Top 10' }
        ]
      }
    };

    return occupations[occupationName] || {
      title: occupationName,
      icon: <FaGraduationCap className="text-primary" />,
      description: `Detailed information about ${occupationName} career path.`,
      salaryRange: 'Varies',
      growthPotential: 'High',
      demandLevel: 'High',
      steps: [
        { step: 1, title: 'Complete 12th Standard', description: 'Complete your 12th standard with good percentage', duration: '2 Years', tips: ['Focus on academics', 'Develop skills'] },
        { step: 2, title: 'Pursue Degree', description: 'Complete relevant bachelor\'s degree', duration: '3-4 Years', tips: ['Choose a good college', 'Build skills'] },
        { step: 3, title: 'Gain Experience', description: 'Gain practical experience through internships', duration: '1-2 Years', tips: ['Learn from professionals', 'Build network'] },
        { step: 4, title: 'Start Career', description: 'Start your professional career', duration: 'Ongoing', tips: ['Apply for jobs', 'Continue learning'] }
      ],
      exams: [],
      skills: ['Communication Skills', 'Problem Solving', 'Teamwork', 'Adaptability'],
      careerPath: [
        { level: 'Entry Level', experience: '0-3 years', salary: 'Varies' },
        { level: 'Mid Level', experience: '3-7 years', salary: 'Varies' },
        { level: 'Senior Level', experience: '7-12 years', salary: 'Varies' },
        { level: 'Leadership', experience: '12+ years', salary: 'Varies' }
      ],
      topColleges: []
    };
  };

  const occupationDetails = occupation ? getOccupationDetails(occupation) : null;

  // Get related occupations based on course
  const getRelatedOccupations = () => {
    const allOccupations = ['Teacher', 'Lawyer', 'Software Engineer', 'Doctor'];
    if (!course) {
      return allOccupations.filter(occ => occ !== occupation);
    }
    const courseLower = course.toLowerCase();
    const courseOccupationMap = {
      'mbbs': ['Doctor'],
      'medicine': ['Doctor'],
      'medical': ['Doctor'],
      'b.tech': ['Software Engineer'],
      'b.sc': ['Teacher', 'Software Engineer'],
      'bca': ['Software Engineer'],
      'm.sc': ['Teacher', 'Software Engineer'],
      'engineering': ['Software Engineer'],
      'bba': ['Teacher', 'Lawyer'],
      'b.com': ['Teacher', 'Lawyer'],
      'b com': ['Teacher', 'Lawyer'],
      'ba': ['Teacher', 'Lawyer'],
      'b a': ['Teacher', 'Lawyer'],
      'llb': ['Lawyer'],
      'law': ['Lawyer'],
      'b.ed': ['Teacher'],
      'b ed': ['Teacher'],
      'education': ['Teacher'],
    };
    let related = [];
    for (const [key, occs] of Object.entries(courseOccupationMap)) {
      if (courseLower.includes(key)) {
        related = [...related, ...occs];
      }
    }
    if (related.length === 0) {
      return allOccupations.filter(occ => occ !== occupation);
    }
    return [...new Set(related)].filter(occ => occ !== occupation);
  };

  if (!occupation) {
    return (
      <div className="dashboard-container">
        <UserLeftNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} isTablet={isTablet} />
        <div className="main-content-dash">
          <UserHeader toggleSidebar={toggleSidebar} />
          <Container className="dashboard-box mt-3">
            <Alert variant="warning">
              No occupation selected. Please go back and select an occupation.
            </Alert>
            <Button variant="primary" onClick={() => navigate(-1)}>
              <FaArrowLeft className="me-2" />
              Go Back
            </Button>
          </Container>
        </div>
      </div>
    );
  }

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
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading occupation details...</p>
            </div>
          ) : (
            <>
              {/* Occupation Header */}
              <Row className="mb-4">
                <Col>
                  <Card className="shadow-box">
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <div className="occupation-icon-large me-4">
                          {occupationDetails.icon}
                        </div>
                        <div>
                          <h2>{occupationDetails.title}</h2>
                          <p className="text-muted mb-2">{occupationDetails.description}</p>
                          <div className="d-flex gap-3">
                            <span><FaChartLine className="me-1" /> Growth: {occupationDetails.growthPotential}</span>
                            <span><FaUsers className="me-1" /> Demand: {occupationDetails.demandLevel}</span>
                            <span><FaGraduationCap className="me-1" /> Salary: {occupationDetails.salaryRange}</span>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Career Path Steps */}
              <Row className="mb-4">
                <Col>
                  <Card className="shadow-box">
                    <Card.Body>
                      <h5 className="section-title mb-4">Career Path</h5>
                      <Row>
                        {occupationDetails.steps.map((step, index) => (
                          <Col md={12} key={index} className="mb-3">
                            <Card className="step-card shadow-sm">
                              <Card.Body className="p-3">
                                <div className="d-flex align-items-start gap-3">
                                  <div className="step-number">
                                    <Badge bg="primary" className="rounded-circle p-3">
                                      {step.step}
                                    </Badge>
                                  </div>
                                  <div className="flex-grow-1">
                                    <h6 className="mb-1">Step {step.step}: {step.title}</h6>
                                    <p className="mb-2 fw-bold" style={{ fontSize: '1.1rem' }}>{step.description}</p>
                                    <Badge bg="info" className="mb-2">{step.duration}</Badge>
                                    <div className="mt-2">
                                      <small className="text-muted d-block mb-1">Tips:</small>
                                      <ul className="mb-0 ps-3">
                                        {step.tips.map((tip, i) => (
                                          <li key={i} className="small text-muted">{tip}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Exams and Skills Two Columns */}
              <Row>
                <Col lg={6} className="mb-4">
                  <Card className="shadow-box h-100">
                    <Card.Body>
                      <h5 className="section-title mb-3">Required Exams</h5>
                      {occupationDetails.exams && occupationDetails.exams.length > 0 ? (
                        occupationDetails.exams.map((exam, index) => (
                          <div key={index} className="mb-3 pb-3 border-bottom">
                            <h6>{exam.name}</h6>
                            <div className="d-flex flex-wrap gap-2">
                              <Badge bg="info">Eligibility: {exam.eligibility}</Badge>
                              <Badge bg="success">Frequency: {exam.frequency}</Badge>
                              <Badge bg="warning">Difficulty: {exam.difficulty}</Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">No specific exams required.</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6} className="mb-4">
                  <Card className="shadow-box h-100">
                    <Card.Body>
                      <h5 className="section-title mb-3">Key Skills</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {occupationDetails.skills.map((skill, index) => (
                          <Badge key={index} bg="primary" className="skills-badge">{skill}</Badge>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Career Progression Table */}
              <Row className="mb-4">
                <Col>
                  <Card className="shadow-box">
                    <Card.Body>
                      <h5 className="section-title mb-3">Career Progression</h5>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Level</th>
                              <th>Experience</th>
                              <th>Salary</th>
                            </tr>
                          </thead>
                          <tbody>
                            {occupationDetails.careerPath.map((career, index) => (
                              <tr key={index}>
                                <td><strong>{career.level}</strong></td>
                                <td>{career.experience}</td>
                                <td>{career.salary}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Top Colleges */}
              {occupationDetails.topColleges && occupationDetails.topColleges.length > 0 && (
                <Row className="mb-4">
                  <Col>
                    <Card className="shadow-box">
                      <Card.Body>
                        <h5 className="section-title mb-3">Top Colleges/Institutions</h5>
                        <div className="row">
                          {occupationDetails.topColleges.map((college, index) => (
                            <Col md={6} lg={3} key={index} className="mb-3">
                              <Card className="h-100 college-card">
                                <Card.Body>
                                  <h6>{college.name}</h6>
                                  <p className="mb-1"><small><FaMapMarkerAlt className="me-1" /> {college.location}</small></p>
                                  <Badge bg="success">{college.ranking}</Badge>
                                  {college.seats && <p className="mb-0 mt-2"><small>Seats: {college.seats}</small></p>}
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Related Occupations */}
              {course && (
                <Row className="mb-4">
                  <Col>
                    <Card className="shadow-box">
                      <Card.Body>
                        <h5 className="section-title mb-3">Explore Related Occupations</h5>
                        <div className="d-flex flex-wrap gap-2">
                          {getRelatedOccupations().map((occ, idx) => (
                            <Button
                              key={idx}
                              variant="outline-primary"
                              size="sm"
                              onClick={() => navigate('/OccupationDetails', {
                                state: { occupation: occ, course: null }
                              })}
                            >
                              {occ}
                            </Button>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Back Button */}
              <div className="mt-4">
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  <FaArrowLeft className="me-2" /> Back
                </Button>
              </div>
            </>
          )}
        </Container>
      </div>
    </div>
  );
};

export default OccupationDetails;
