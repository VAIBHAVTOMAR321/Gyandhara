import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Badge, Button, Alert, Image } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../all_login/AuthContext';
import { useLanguage } from '../all_login/LanguageContext';
import UserHeader from './UserHeader';
import UserLeftNav from './UserLeftNav';
import { FaArrowLeft, FaCalendarCheck, FaClock, FaLink, FaUserTie, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CounselingDetails = () => {
  const { language } = useLanguage();
  const { uniqueId, accessToken } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  const [counselingRequests, setCounselingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCounselingData = async () => {
      if (!uniqueId || !accessToken) {
        setLoading(false);
        setError("Authentication details are missing.");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `https://brjobsedu.com/gyandhara/gyandhara_backend/api/student-cousult/?student_id=${uniqueId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data && response.data.status) {
          setCounselingRequests(response.data.data || []);
        } else {
          setError("Could not fetch counseling data.");
        }
      } catch (err) {
        console.error("Error fetching counseling data:", err);
        setError("Failed to load counseling requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounselingData();
  }, [uniqueId, accessToken]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">{language === 'hi' ? 'स्वीकृत' : 'Approved'}</Badge>;
      case 'rejected':
        return <Badge bg="danger">{language === 'hi' ? 'अस्वीकृत' : 'Rejected'}</Badge>;
      default:
        return <Badge bg="warning">{language === 'hi' ? 'लंबित' : 'Pending'}</Badge>;
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

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

        <Container fluid className="dashboard-box mt-3">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">{language === 'hi' ? 'मेरे परामर्श अनुरोध' : 'My Counseling Requests'}</h4>
            <Button variant="outline-secondary" size="sm" onClick={() => navigate('/UserDashboard')}>
              <FaArrowLeft className="me-1" /> {language === 'hi' ? 'डैशबोर्ड पर वापस' : 'Back to Dashboard'}
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">{language === 'hi' ? 'अनुरोध लोड हो रहे हैं...' : 'Loading requests...'}</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : counselingRequests.length === 0 ? (
            <Alert variant="info">{language === 'hi' ? 'कोई परामर्श अनुरोध नहीं मिला।' : 'No counseling requests found.'}</Alert>
          ) : (
            <Row>
              {counselingRequests.map((request) => (
                <Col md={6} lg={4} key={request.id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">{request.category_consulting.join(', ')}</h6>
                      {getStatusBadge(request.status)}
                    </Card.Header>
                    <Card.Body>
                      <p className="small text-muted">
                        {language === 'hi' ? 'अनुरोधित:' : 'Requested on:'} {formatDateTime(request.created_at)}
                      </p>

                      {request.status === 'approved' && request.counselor_details && (
                        <div>
                          <hr />
                          <div className="d-flex align-items-center mb-3">
                            {request.counselor_details.co_img ? (
                              <Image src={`https://brjobsedu.com/gyandhara/gyandhara_backend${request.counselor_details.co_img}`} roundedCircle width="50" height="50" className="me-3" />
                            ) : (
                              <FaUserTie className="me-3 text-primary" size={40} />
                            )}
                            <div>
                              <h6 className="mb-0">{request.counselor_details.name}</h6>
                              <p className="small text-muted mb-0">{language === 'hi' ? 'नियुक्त परामर्शदाता' : 'Assigned Counselor'}</p>
                            </div>
                          </div>
                          <p className="small mb-1">
                            <FaCalendarCheck className="me-2 text-success" />
                            <strong>{language === 'hi' ? 'समय:' : 'Time:'}</strong> {formatDateTime(request.con_datetime)}
                          </p>
                          <p className="small mb-0">
                            <FaLink className="me-2 text-success" />
                            <strong>{language === 'hi' ? 'लिंक:' : 'Link:'}</strong>{' '}
                            <a href={request.meeting_link} target="_blank" rel="noopener noreferrer">
                              {language === 'hi' ? 'मीटिंग में शामिल हों' : 'Join Meeting'}
                            </a>
                          </p>
                        </div>
                      )}

                      {request.status === 'rejected' && (
                        <div>
                          <hr />
                          <p className="small text-danger mb-0">
                            <FaInfoCircle className="me-2" />
                            {language === 'hi' ? 'आपका अनुरोध अस्वीकार कर दिया गया है।' : 'Your request has been rejected.'}
                          </p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default CounselingDetails;