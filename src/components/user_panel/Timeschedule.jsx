import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Table, Badge } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../all_login/AuthContext";
import { useLanguage } from "../all_login/LanguageContext";
import "../../assets/css/userleftnav.css";
import UserHeader from "./UserHeader";
import UserLeftNav from "./UserLeftNav";
import "./UserProfile.css";
import "./Timeschedule.css";

const Timeschedule = () => {
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  const { uniqueId, accessToken } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    const fetchSchedule = async () => {
      if (!uniqueId) {
        setLoading(false);
        return;
      }

      try {
        // Mock schedule data - in real app, this would be fetched from API
        const mockSchedule = {
          student_id: uniqueId,
          class_name: "9th Grade",
          schedule: [
            {
              id: 1,
              day: language === 'hi' ? 'सोमवार' : 'Monday',
              periods: [
                { time: '08:00-09:00', subject: language === 'hi' ? 'गणित' : 'Mathematics', teacher: 'Mr. Sharma', type: 'theory' },
                { time: '09:00-10:00', subject: language === 'hi' ? 'भौतिकी' : 'Physics', teacher: 'Dr. Gupta', type: 'theory' },
                { time: '10:00-10:15', subject: language === 'hi' ? 'ब्रेक' : 'Break', teacher: '', type: 'break' },
                { time: '10:15-11:15', subject: language === 'hi' ? 'रसायन विज्ञान' : 'Chemistry', teacher: 'Ms. Patel', type: 'lab' },
                { time: '11:15-12:15', subject: language === 'hi' ? 'जीव विज्ञान' : 'Biology', teacher: 'Mr. Kumar', type: 'theory' },
              ]
            },
            {
              id: 2,
              day: language === 'hi' ? 'मंगलवार' : 'Tuesday',
              periods: [
                { time: '08:00-09:00', subject: language === 'hi' ? 'अंग्रेजी' : 'English', teacher: 'Ms. Johnson', type: 'theory' },
                { time: '09:00-10:00', subject: language === 'hi' ? 'सामाजिक विज्ञान' : 'Social Science', teacher: 'Mr. Singh', type: 'theory' },
                { time: '10:00-10:15', subject: language === 'hi' ? 'ब्रेक' : 'Break', teacher: '', type: 'break' },
                { time: '10:15-11:15', subject: language === 'hi' ? 'कंप्यूटर' : 'Computer Science', teacher: 'Mr. Das', type: 'lab' },
                { time: '11:15-12:15', subject: language === 'hi' ? 'शारीरिक शिक्षा' : 'Physical Education', teacher: 'Coach Roy', type: 'practical' },
              ]
            },
            {
              id: 3,
              day: language === 'hi' ? 'बुधवार' : 'Wednesday',
              periods: [
                { time: '08:00-09:00', subject: language === 'hi' ? 'गणित' : 'Mathematics', teacher: 'Mr. Sharma', type: 'theory' },
                { time: '09:00-10:00', subject: language === 'hi' ? 'अंग्रेजी' : 'English', teacher: 'Ms. Johnson', type: 'theory' },
                { time: '10:00-10:15', subject: language === 'hi' ? 'ब्रेक' : 'Break', teacher: '', type: 'break' },
                { time: '10:15-11:15', subject: language === 'hi' ? 'भौतिकी' : 'Physics', teacher: 'Dr. Gupta', type: 'lab' },
                { time: '11:15-12:15', subject: language === 'hi' ? 'कला' : 'Art', teacher: 'Ms. White', type: 'practical' },
              ]
            },
            {
              id: 4,
              day: language === 'hi' ? 'गुरुवार' : 'Thursday',
              periods: [
                { time: '08:00-09:00', subject: language === 'hi' ? 'रसायन विज्ञान' : 'Chemistry', teacher: 'Ms. Patel', type: 'theory' },
                { time: '09:00-10:00', subject: language === 'hi' ? 'जीव विज्ञान' : 'Biology', teacher: 'Mr. Kumar', type: 'theory' },
                { time: '10:00-10:15', subject: language === 'hi' ? 'ब्रेक' : 'Break', teacher: '', type: 'break' },
                { time: '10:15-11:15', subject: language === 'hi' ? 'सामाजिक विज्ञान' : 'Social Science', teacher: 'Mr. Singh', type: 'theory' },
                { time: '11:15-12:15', subject: language === 'hi' ? 'शारीरिक शिक्षा' : 'Physical Education', teacher: 'Coach Roy', type: 'practical' },
              ]
            },
            {
              id: 5,
              day: language === 'hi' ? 'शुक्रवार' : 'Friday',
              periods: [
                { time: '08:00-09:00', subject: language === 'hi' ? 'गणित' : 'Mathematics', teacher: 'Mr. Sharma', type: 'theory' },
                { time: '09:00-10:00', subject: language === 'hi' ? 'अंग्रेजी' : 'English', teacher: 'Ms. Johnson', type: 'theory' },
                { time: '10:00-10:15', subject: language === 'hi' ? 'ब्रेक' : 'Break', teacher: '', type: 'break' },
                { time: '10:15-11:15', subject: language === 'hi' ? 'कंप्यूटर' : 'Computer Science', teacher: 'Mr. Das', type: 'lab' },
                { time: '11:15-12:10', subject: language === 'hi' ? 'सामूहिक गतिविधि' : 'Group Activity', teacher: 'All Teachers', type: 'activity' },
              ]
            }
          ]
        };

        setSchedule(mockSchedule);
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setError(language === 'hi' ? "समय सारणी लोड करने में विफल" : "Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [uniqueId, accessToken, language]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getScheduleTypeBadge = (type) => {
    const typeMap = {
      theory: { label: language === 'hi' ? 'सिद्धांत' : 'Theory', variant: 'primary' },
      lab: { label: language === 'hi' ? 'प्रयोगशाला' : 'Lab', variant: 'warning' },
      practical: { label: language === 'hi' ? 'व्यावहारिक' : 'Practical', variant: 'success' },
      break: { label: language === 'hi' ? 'ब्रेक' : 'Break', variant: 'secondary' },
      activity: { label: language === 'hi' ? 'गतिविधि' : 'Activity', variant: 'info' }
    };
    const config = typeMap[type] || typeMap['theory'];
    return <Badge bg={config.variant}>{config.label}</Badge>;
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
          {loading ? (
            <div className="profile-loading">
              <Spinner animation="border" variant="primary" />
              <p>{language === 'hi' ? "समय सारणी लोड हो रही है..." : "Loading schedule..."}</p>
            </div>
          ) : (
            <Row>
              <Col>
                <Card className="shadow-box mb-3">
                  <Card.Body className="profile-header-card">
                    <div className="profile-header-row">
                      <div className="profile-avatar" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <i className="bi bi-calendar-event"></i>
                      </div>
                      <div className="profile-info">
                        <h2>{language === 'hi' ? "समय सारणी" : "Time Schedule"}</h2>
                        <p className="student-id">
                          <i className="bi bi-person-badge"></i>
                          {schedule?.student_id}
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {!loading && schedule && (
            <Row>
              <Col>
                <Card className="shadow-box mb-3">
                  <Card.Body>
                    <h5 className="section-title">
                      {language === 'hi' ? "साप्ताहिक कक्षा समय सारणी" : "Weekly Class Schedule"}
                    </h5>
                    <div className="schedule-container">
                      {schedule.schedule.map((daySchedule) => (
                        <Card key={daySchedule.id} className="mb-3 day-schedule-card">
                          <Card.Header className="day-header">
                            <h6 className="mb-0">
                              <i className="bi bi-calendar-day me-2"></i>
                              {daySchedule.day}
                            </h6>
                          </Card.Header>
                          <Card.Body className="p-0">
                            <Table hover size="sm" className="mb-0">
                              <thead>
                                <tr>
                                  <th style={{ width: '120px' }}>{language === 'hi' ? 'समय' : 'Time'}</th>
                                  <th>{language === 'hi' ? 'विषय' : 'Subject'}</th>
                                  <th>{language === 'hi' ? 'शिक्षक' : 'Teacher'}</th>
                                  <th style={{ width: '120px' }}>{language === 'hi' ? 'प्रकार' : 'Type'}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {daySchedule.periods.map((period, index) => (
                                  <tr key={index} className={period.type === 'break' ? 'table-light' : ''}>
                                    <td className="fw-medium">{period.time}</td>
                                    <td className="fw-medium">{period.subject}</td>
                                    <td>{period.teacher}</td>
                                    <td>{getScheduleTypeBadge(period.type)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {error && (
            <Row>
              <Col>
                <Card className="shadow-box">
                  <Card.Body className="text-center text-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Timeschedule;