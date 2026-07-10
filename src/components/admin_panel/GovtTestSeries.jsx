import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card, Table, Spinner, Modal, Form, Badge } from "react-bootstrap";
import "../../assets/css/admindashboard.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaEye, FaTimes } from "react-icons/fa";
import AdminLeftNav from "./AdminLeftNav";
import AdminHeader from "./AdminHeader";
import axios from "axios";
import { useAuth } from "../all_login/AuthContext";

const API_URL = 'https://brjobsedu.com/gyandhara/gyandhara_backend/api/test-series-quiz/';

const GovtTestSeries = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [viewingQuiz, setViewingQuiz] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [quizFormData, setQuizFormData] = useState({
    title: '',
    description: '',
    title_hindi: '',
    description_hindi: '',
    quiz_category: '',
    start_date_time: '',
    end_date_time: '',
    questions: [{ question_text: '', question_text_hindi: '', options: ['', '', '', ''], options_hindi: ['', '', '', ''], correct_answer: 0, marks: 1 }]
  });

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (accessToken) {
      fetchQuizzes();
    }
  }, [accessToken]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (response.data.success) {
        setQuizzes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizFormData.questions];
    updatedQuestions[index][field] = value;
    setQuizFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const handleOptionChange = (qIndex, oIndex, value, isHindi = false) => {
    const updatedQuestions = [...quizFormData.questions];
    if (isHindi) {
      updatedQuestions[qIndex].options_hindi[oIndex] = value;
    } else {
      updatedQuestions[qIndex].options[oIndex] = value;
    }
    setQuizFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    setQuizFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { question_text: '', question_text_hindi: '', options: ['', '', '', ''], options_hindi: ['', '', '', ''], correct_answer: 0, marks: 1 }]
    }));
  };

  const removeQuestion = (index) => {
    const updatedQuestions = quizFormData.questions.filter((_, i) => i !== index);
    setQuizFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const resetForm = () => {
    setEditingQuiz(null);
    setQuizFormData({
      title: '', description: '', title_hindi: '', description_hindi: '', quiz_category: '',
      start_date_time: '', end_date_time: '',
      questions: [{ question_text: '', question_text_hindi: '', options: ['', '', '', ''], options_hindi: ['', '', '', ''], correct_answer: 0, marks: 1 }]
    });
  };

  const handleOpenModal = (quiz = null) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setQuizFormData({
        title: quiz.title || '',
        description: quiz.description || '',
        title_hindi: quiz.title_hindi || '',
        description_hindi: quiz.description_hindi || '',
        quiz_category: quiz.quiz_category || '',
        start_date_time: quiz.start_date_time ? quiz.start_date_time.slice(0, 16) : '',
        end_date_time: quiz.end_date_time ? quiz.end_date_time.slice(0, 16) : '',
        questions: quiz.questions.length > 0 ? quiz.questions.map(q => ({...q, options: q.options || ['','','',''], options_hindi: q.options_hindi || ['','','','']})) : [{ question_text: '', question_text_hindi: '', options: ['', '', '', ''], options_hindi: ['', '', '', ''], correct_answer: 0, marks: 1 }]
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleView = (quiz) => {
    setViewingQuiz(quiz);
    setShowViewModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...quizFormData,
      start_date_time: quizFormData.start_date_time ? new Date(quizFormData.start_date_time).toISOString() : null,
      end_date_time: quizFormData.end_date_time ? new Date(quizFormData.end_date_time).toISOString() : null,
    };

    try {
      if (editingQuiz) {
        await axios.put(API_URL, { ...payload, quiz_id: editingQuiz.quiz_id }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      } else {
        await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      }
      fetchQuizzes();
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to save quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await axios.delete(API_URL, {
          headers: { Authorization: `Bearer ${accessToken}` },
          data: { quiz_id: quizId }
        });
        fetchQuizzes();
      } catch (error) {
        console.error("Error deleting quiz:", error);
        alert("Failed to delete quiz.");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('en-IN', options);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <AdminLeftNav
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        isTablet={isTablet}
      />

      <div className="main-content-dash">
        <AdminHeader toggleSidebar={toggleSidebar} />

        <div className="dashboard-content">
          <Container fluid className="dashboard-box">
            <div className="d-flex justify-content-between align-items-center mb-4 page-header">
              <Button variant="outline-secondary" size="sm" onClick={() => navigate("/AdminDashboard")}>
                <FaArrowLeft className="me-1" /> Dashboard
              </Button>
              <h4 className="mb-0">Government Test Series</h4>
              <Button variant="primary" onClick={() => handleOpenModal()}>
                <FaPlus className="me-1" /> Add Quiz
              </Button>
            </div>

            <Card>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Questions</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map(quiz => (
                      <tr key={quiz.quiz_id}>
                        <td>{quiz.quiz_id}</td>
                        <td>{quiz.title}</td>
                        <td><Badge bg="info">{quiz.quiz_category}</Badge></td>
                        <td>{quiz.questions.length}</td>
                        <td><Badge bg={quiz.is_active ? 'success' : 'danger'}>{quiz.is_active ? 'Active' : 'Inactive'}</Badge></td>
                        <td>
                          <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleView(quiz)}><FaEye /></Button>
                          <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleOpenModal(quiz)}><FaEdit /></Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(quiz.quiz_id)}><FaTrash /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Container>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingQuiz ? 'Edit' : 'Add'} Government Test Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Title (English)</Form.Label><Form.Control type="text" name="title" value={quizFormData.title} onChange={handleInputChange} required /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Title (Hindi)</Form.Label><Form.Control type="text" name="title_hindi" value={quizFormData.title_hindi} onChange={handleInputChange} /></Form.Group></Col>
            </Row>
            <Row>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Description (English)</Form.Label><Form.Control as="textarea" rows={2} name="description" value={quizFormData.description} onChange={handleInputChange} /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-3"><Form.Label>Description (Hindi)</Form.Label><Form.Control as="textarea" rows={2} name="description_hindi" value={quizFormData.description_hindi} onChange={handleInputChange} /></Form.Group></Col>
            </Row>
            <Row>
              <Col md={4}><Form.Group className="mb-3"><Form.Label>Category</Form.Label><Form.Control type="text" name="quiz_category" value={quizFormData.quiz_category} onChange={handleInputChange} required /></Form.Group></Col>
              <Col md={4}><Form.Group className="mb-3"><Form.Label>Start Time</Form.Label><Form.Control type="datetime-local" name="start_date_time" value={quizFormData.start_date_time} onChange={handleInputChange} /></Form.Group></Col>
              <Col md={4}><Form.Group className="mb-3"><Form.Label>End Time</Form.Label><Form.Control type="datetime-local" name="end_date_time" value={quizFormData.end_date_time} onChange={handleInputChange} /></Form.Group></Col>
            </Row>

            <hr />
            <h5>Questions</h5>
            {quizFormData.questions.map((q, qIndex) => (
              <Card key={qIndex} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <h6>Question {qIndex + 1}</h6>
                    <Button variant="outline-danger" size="sm" onClick={() => removeQuestion(qIndex)}><FaTimes /></Button>
                  </div>
                  <Row>
                    <Col md={6}><Form.Group className="mb-2"><Form.Label>Question (English)</Form.Label><Form.Control type="text" value={q.question_text} onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)} /></Form.Group></Col>
                    <Col md={6}><Form.Group className="mb-2"><Form.Label>Question (Hindi)</Form.Label><Form.Control type="text" value={q.question_text_hindi} onChange={(e) => handleQuestionChange(qIndex, 'question_text_hindi', e.target.value)} /></Form.Group></Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Label>Options (English)</Form.Label>
                      {q.options.map((opt, oIndex) => (
                        <Form.Control key={oIndex} className="mb-1" type="text" value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} placeholder={`Option ${oIndex + 1}`} />
                      ))}
                    </Col>
                    <Col md={6}>
                      <Form.Label>Options (Hindi)</Form.Label>
                      {q.options_hindi.map((opt, oIndex) => (
                        <Form.Control key={oIndex} className="mb-1" type="text" value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value, true)} placeholder={`विकल्प ${oIndex + 1}`} />
                      ))}
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}><Form.Group className="mt-2"><Form.Label>Correct Answer Index</Form.Label><Form.Control type="number" min="0" max="3" value={q.correct_answer} onChange={(e) => handleQuestionChange(qIndex, 'correct_answer', parseInt(e.target.value))} /></Form.Group></Col>
                    <Col md={6}><Form.Group className="mt-2"><Form.Label>Marks</Form.Label><Form.Control type="number" min="1" value={q.marks} onChange={(e) => handleQuestionChange(qIndex, 'marks', parseInt(e.target.value))} /></Form.Group></Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
            <Button variant="outline-primary" size="sm" onClick={addQuestion}><FaPlus /> Add Question</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Spinner as="span" animation="border" size="sm" /> : 'Save Quiz'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>View Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewingQuiz && (
            <div>
              <h4>{viewingQuiz.title}</h4>
              <p><strong>Category:</strong> {viewingQuiz.quiz_category}</p>
              <p><strong>Description:</strong> {viewingQuiz.description}</p>
              <p><strong>Start:</strong> {formatDate(viewingQuiz.start_date_time)}</p>
              <p><strong>End:</strong> {formatDate(viewingQuiz.end_date_time)}</p>
              <hr />
              <h5>Questions</h5>
              {viewingQuiz.questions.map((q, index) => (
                <div key={index} className="mb-3">
                  <h6>Q{index + 1}: {q.question_text}</h6>
                  <ul>
                    {q.options.map((opt, oIndex) => (
                      <li key={oIndex} className={oIndex === q.correct_answer ? 'fw-bold text-success' : ''}>
                        {opt} {oIndex === q.correct_answer && '(Correct)'}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GovtTestSeries;