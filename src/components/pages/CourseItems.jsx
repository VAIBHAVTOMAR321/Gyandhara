import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, Spinner, Form } from 'react-bootstrap'
import axios from 'axios'
import '../../assets/css/courseitems.css'

function CourseItems() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

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
        return <Badge bg="warning" className="status-badge">Unpaid</Badge>
      case 'paid':
        return <Badge bg="success" className="status-badge">Paid</Badge>
      default:
        return <Badge bg="secondary" className="status-badge">{status}</Badge>
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.course_desc?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || course.course_status === filter
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="course-loading">
        <Spinner animation="border" variant="primary" />
        <p>Loading courses...</p>
      </div>
    )
  }

  return (
    <div className="course-items-page">
      <div className="course-hero">
        <Container>
          <h1 className="course-hero-title">Explore Our Courses</h1>
          <p className="course-hero-subtitle">Learn from industry experts and advance your career</p>
        </Container>
      </div>

      <Container className="course-content">
      

       

        {/* Results Count */}
        <Row className="mb-3">
          <Col>
            <p className="results-count">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
          </Col>
        </Row>

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
                        {course.course_category || 'General'}
                      </Badge>
                    </div>
                    <Card.Title className="course-title">{course.course_name}</Card.Title>
                    <Card.Title className="course-course-id">{course.course_id}</Card.Title>
                    <Card.Text className="course-description">
                      {course.course_desc?.substring(0, 120)}{course.course_desc?.length > 120 ? '...' : ''}
                    </Card.Text>
                    
                    <div className="course-meta">
                      
                      <span className="course-date">
                        <i className="bi bi-calendar"></i> {new Date(course.start_date).toLocaleDateString()}
                      </span>
                    </div>

                    {course.course_name_hindi && (
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
              <h4>No courses found</h4>
              <p className="text-muted">
                {searchTerm ? `No courses match "${searchTerm}"` : 'No courses available at the moment'}
              </p>
              <Button variant="outline-primary" onClick={() => {
                setSearchTerm('')
                setFilter('all')
              }}>
                Clear Filters
              </Button>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  )
}

export default CourseItems