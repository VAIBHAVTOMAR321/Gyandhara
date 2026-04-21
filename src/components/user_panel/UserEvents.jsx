import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Modal, Nav } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from '../all_login/AuthContext'
import UserHeader from './UserHeader'
import UserLeftNav from './UserLeftNav'
import '../../assets/css/userleftnav.css'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaEye } from 'react-icons/fa'

const UserEvents = () => {
  const { uniqueId, accessToken } = useAuth()
  
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState('all')
  const eventsPerPage = 9

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
    const fetchEvents = async () => {
      if (!uniqueId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")
        const response = await axios.get(
          'https://brjobsedu.com/gyandhara/gyandhara_backend/api/event-item/',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (response.data.success) {
          setEvents(response.data.data || [])
        } else {
          setEvents([])
        }
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to load events")
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [uniqueId, accessToken])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleViewEvent = (event) => {
    setSelectedEvent(event)
    setShowViewModal(true)
  }

  const isEventUpcoming = (event) => {
    if (!event.event_date_time) return false
    const eventDate = new Date(event.event_date_time)
    const now = new Date()
    return eventDate > now
  }

  const getFilteredEvents = () => {
    switch (activeTab) {
      case 'active':
        return events.filter(e => e.is_active)
      case 'upcoming':
        return events.filter(e => e.is_upcoming)
      case 'past':
        return events.filter(e => e.is_past)
      default:
        return events
    }
  }

  const filteredEvents = getFilteredEvents()

  const getEventCounts = () => ({
    all: events.length,
    active: events.filter(e => e.is_active).length,
    upcoming: events.filter(e => e.is_upcoming).length,
    past: events.filter(e => e.is_past).length
  })

  const counts = getEventCounts()

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A'
    const date = new Date(dateTimeStr)
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const closeModal = () => {
    setShowViewModal(false)
    setSelectedEvent(null)
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
          <Row className="mb-4">
            <Col xs={12} className="mt-4">
              <div className="d-flex align-items-center mb-3">
                <FaCalendarAlt className="me-2 text-primary" style={{ fontSize: '24px' }} />
                <h3 className="mb-0 fw-bold">Events</h3>
              </div>
              <p className="text-muted">
                Discover and participate in upcoming events, workshops, and seminars.
              </p>
            </Col>
          </Row>

          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-light border-bottom py-3">
              <Nav variant="tabs" activeKey={activeTab} onSelect={(key) => { setActiveTab(key); setCurrentPage(1) }}>
                <Nav.Item>
                  <Nav.Link eventKey="all">
                    All ({counts.all})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="active">
                    Active ({counts.active})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="upcoming">
                    Upcoming ({counts.upcoming})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="past">
                    Past ({counts.past})
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
          </Card>

          {error && (
            <Alert variant="danger">{error}</Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" style={{ width: '60px', height: '60px' }} />
              <p className="mt-3">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <Alert variant="info" className="text-center">
              <FaCalendarAlt className="me-2" />
              No {activeTab === 'all' ? '' : activeTab} events found
            </Alert>
          ) : (
            <>
              <Row>
                {filteredEvents
                  .slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage)
                  .map((event) => {
                    const upcoming = isEventUpcoming(event)
                    return (
                      <Col md={6} lg={4} key={event.id} className="mb-4">
                        <Card className="h-100 shadow-sm event-card" style={{ 
                          borderRadius: '16px', 
                          border: 'none',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)'
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                        >
                          <div style={{ 
                            height: '180px',
                            overflow: 'hidden',
                            backgroundColor: '#f8f9fa'
                          }}>
                            {event.event_image ? (
                              <img 
                                src={`https://brjobsedu.com/girls_course/girls_course_backend${event.event_image}`}
                                alt={event.event_name}
                                style={{ 
                                  width: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            ) : (
                              <div style={{ 
                                height: '100%',
                                background: upcoming 
                                  ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                                  : 'linear-gradient(135deg, #11998e, #38ef7d)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <div className="text-center text-white">
                                  {event.event_type && (
                                    <Badge bg="light" text="dark" className="ms-2">
                                      {event.event_type}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <Card.Body className="d-flex flex-column">
                            <div className="mb-3">
                              <h5 className="mb-2 fw-bold" style={{ color: '#333' }}>{event.event_name}</h5>
                              {event.description && (
                                <p className="text-muted small mb-0" style={{ lineHeight: '1.5' }}>
                                  {event.description.length > 100 
                                    ? event.description.substring(0, 100) + '...' 
                                    : event.description}
                                </p>
                              )}
                            </div>

                            <div className="mb-3" style={{ flex: 1 }}>
                              <div className="d-flex align-items-center mb-2">
                                <div className="d-flex align-items-center text-muted">
                                  <FaClock className="me-2 text-primary" style={{ fontSize: '14px' }} />
                                  <small>Start: {formatDateTime(event.event_date_time)}</small>
                                </div>
                              </div>
                              
                              {event.end_date_time && (
                                <div className="d-flex align-items-center mb-2">
                                  <div className="d-flex align-items-center text-muted">
                                    <FaClock className="me-2 text-danger" style={{ fontSize: '14px' }} />
                                    <small>End: {formatDateTime(event.end_date_time)}</small>
                                  </div>
                                </div>
                              )}
                              
                              {event.venue && (
                                <div className="d-flex align-items-center">
                                  <div className="d-flex align-items-center text-muted">
                                    <FaMapMarkerAlt className="me-2 text-success" style={{ fontSize: '14px' }} />
                                    <small>{event.venue}</small>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="mt-auto pt-3">
                              <Button
                                variant="outline-primary"
                                className="w-100 d-flex align-items-center justify-content-center"
                                onClick={() => handleViewEvent(event)}
                                style={{ 
                                  borderRadius: '8px',
                                  fontWeight: '600',
                                  padding: '10px 16px'
                                }}
                              >
                                <FaEye className="me-2" />
                                View Details
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    )
                  })}
              </Row>
              
              {filteredEvents.length > eventsPerPage && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="text-muted">
                    Showing {((currentPage - 1) * eventsPerPage) + 1}-{Math.min(currentPage * eventsPerPage, filteredEvents.length)} of {filteredEvents.length} events
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.ceil(filteredEvents.length / eventsPerPage) }, function(_, i) { return i + 1 }).map(function(page) { return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'primary' : 'outline-primary'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ); })}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={currentPage === Math.ceil(filteredEvents.length / eventsPerPage)}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Container>
      </div>

      {/* View Event Modal */}
      <Modal show={showViewModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FaCalendarAlt className="me-2" />
            Event Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              {selectedEvent.event_image && (
                <div className="mb-3">
                  <img 
                    src={`https://brjobsedu.com/girls_course/girls_course_backend${selectedEvent.event_image}`}
                    alt={selectedEvent.event_name}
                    className="img-fluid rounded"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                  />
                </div>
              )}
              
              <div className="mb-4">
                <Badge bg="secondary" className="me-2">{selectedEvent.event_id}</Badge>
                {selectedEvent.event_type && (
                  <Badge bg="info">{selectedEvent.event_type}</Badge>
                )}
              </div>
               
              <h4 className="mb-3">{selectedEvent.event_name}</h4>
                
              {selectedEvent.description && (
                <div className="mb-4">
                  <h6 className="text-muted mb-2">Description</h6>
                  <p className="">{selectedEvent.description}</p>
                </div>
              )}
              
              <Row className="mb-4">
                <Col md={6}>
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-muted mb-2">
                      <FaClock className="me-2" /> Start Date & Time
                    </h6>
                    <p className="mb-0 fw-semibold">{formatDateTime(selectedEvent.event_date_time)}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-muted mb-2">
                      <FaClock className="me-2" /> End Date & Time
                    </h6>
                    <p className="mb-0 fw-semibold">
                      {selectedEvent.end_date_time ? formatDateTime(selectedEvent.end_date_time) : 'N/A'}
                    </p>
                  </div>
                </Col>
              </Row>
              
              <div className="p-3 bg-light rounded">
                <h6 className="text-muted mb-2">
                  <FaMapMarkerAlt className="me-2" /> Venue
                </h6>
                <p className="mb-0 fw-semibold">{selectedEvent.venue || 'N/A'}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default UserEvents