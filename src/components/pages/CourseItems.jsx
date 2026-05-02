import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, Spinner, Form } from 'react-bootstrap'
import axios from 'axios'
import '../../assets/css/courseitems.css'
import { useLanguage } from '../all_login/LanguageContext'

function CourseItems() {
  const { language } = useLanguage()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const content = {
    en: {
      title: "Our Courses",
      loading: "Loading courses...",
      noResults: "No courses found",
      noMatch: (term) => `No courses match "${term}"`,
      noAvailable: "No courses available at the moment",
      clearFilters: "Clear Filters",
      unpaid: "Unpaid",
      paid: "Paid"
    },
    hi: {
      title: "हमारे पाठ्यक्रम",
      loading: "पाठ्यक्रम लोड हो रहे हैं...",
      noResults: "कोई पाठ्यक्रम नहीं मिला",
      noMatch: (term) => `"${term}" से मेल खाने वाला कोई पाठ्यक्रम नहीं मिला`,
      noAvailable: "फिलहाल कोई पाठ्यक्रम उपलब्ध नहीं है",
      clearFilters: "फ़िल्टर साफ़ करें",
      unpaid: "अवैतनिक",
      paid: "सशुल्क"
    }
  }

  const t = content[language] || content.en

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await axios.get('https://brjobsedu.com/gyandhara/gyandhara_backend/api/course-items/')
      let courseData = []
      if (response.data && response.data.data) {
        courseData = response.data.data
      } else if (response.data && Array.isArray(response.data)) {
        courseData = response.data
      }
      setCourses(courseData)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching courses:', err)
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'unpaid':
        return <Badge bg="warning" className="status-badge">{t.unpaid}</Badge>
      case 'paid':
        return <Badge bg="success" className="status-badge">{t.paid}</Badge>
      default:
        return <Badge bg="secondary" className="status-badge">{status}</Badge>
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.course_desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.course_name_hindi?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || course.course_status === filter
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="course-loading">
        <Spinner animation="border" variant="primary" />
        <p>{t.loading}</p>
      </div>
    )
  }

  return (
    <div className="course-items-page">
      
      <Container className="Course-items-header">
        <div className='course-items-header-content'>
        <h1 className=''>{t.title}</h1>
        </div>
     

      <Container className="course-content">
      

        {/* Results Count */}
      

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <Row className="courses-grid">
            {filteredCourses.map((course) => (
              <Col key={course.id} lg={4} md={6} sm={12} className="mb-4">
                <Card className="course-card">
                  {course.course_img && (
                    <div className="course-image-container">
                      <Card.Img 
                        variant="top" 
                        src={course.course_img.startsWith('http') ? course.course_img : `https://brjobsedu.com/gyandhara/gyandhara_backend${course.course_img}`}
                        alt={course.course_name}
                        className="course-image"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = '/placeholder-course.png'
                        }}
                      />
                      <div className="course-status-overlay">
                        {getStatusBadge(course.course_status)}
                      </div>
                    </div>
                  )}
                  <Card.Body className="course-card-body">
                    <div className="course-category">
                      <Badge bg="primary" className="course-badge">
                        {course.course_category || ''}
                      </Badge>
                    </div>
                    <Card.Title className="course-title">
                      {language === 'hi' && course.course_name_hindi ? course.course_name_hindi : course.course_name}
                    </Card.Title>
                  
                    <Card.Text className="course-description">
                      {language === 'hi' && course.course_desc_hindi 
                        ? (course.course_desc_hindi.length > 120 ? course.course_desc_hindi.substring(0, 120) + '...' : course.course_desc_hindi)
                        : (course.course_desc?.length > 120 ? course.course_desc.substring(0, 120) + '...' : course.course_desc)}
                    </Card.Text>
                    
                    {language !== 'hi' && course.course_name_hindi && (
                      <div className="course-hindi-info">
                        <small className="text-muted">{course.course_name_hindi}</small>
                      </div>
                    )}
               
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Card className="no-results-card">
            <Card.Body className="text-center py-5">
              <i className="bi bi-search display-4 text-muted mb-3"></i>
              <h4>{t.noResults}</h4>
              <p className="text-muted">
                {searchTerm ? t.noMatch(searchTerm) : t.noAvailable}
              </p>
              <Button variant="outline-primary" onClick={() => {
                setSearchTerm('')
                setFilter('all')
              }}>
                {t.clearFilters}
              </Button>
            </Card.Body>
          </Card>
        )}
      </Container>
     </Container>
    </div>
  )
}

export default CourseItems