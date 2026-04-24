import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Table, Form } from "react-bootstrap";
import axios from "axios";
import "../../assets/css/userleftnav.css";

import { useAuth } from "../all_login/AuthContext";
import SchoolHeader from "./SchoolHeader";
import SchoolLeftNav from "./SchoolLeftNav";

const Offlinecompetition = () => {
  // --- Layout & Device State ---
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // --- Auth Context ---
  const { accessToken, uniqueId } = useAuth();

  // --- Competition Logic State ---
  const [competitions, setCompetitions] = useState([]);
  
  // SEPARATED LOADING STATES TO FIX BLANK PAGE ISSUE
  const [listLoading, setListLoading] = useState(true);   // Only for fetching list
  const [formLoading, setFormLoading] = useState(false);  // Only for Create/Update forms
  
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    title_hindi: "",
    description_hindi: "",
    location: "",
    school_uni_id: uniqueId || "",
    comp_date_time: "",
  });

  // --- Layout Effects ---
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

  // --- Data Fetching Effects ---
  useEffect(() => {
    if (accessToken) {
      fetchCompetitions();
    } else {
      setListLoading(false);
    }
  }, [accessToken]);

  // --- API Functions ---
  const fetchCompetitions = useCallback(async () => {
    if (!accessToken) {
      setListLoading(false);
      return;
    }

    try {
      setListLoading(true);
      setError("");
      const response = await axios.get(
        "https://brjobsedu.com/gyandhara/gyandhara_backend/api/offline-competition/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setCompetitions(response.data.data);
      } else {
        setError("API returned success: false");
      }
    } catch (err) {
      console.error("Competition API Error:", err);
      setError("Failed to fetch competitions: " + err.message);
    } finally {
      setListLoading(false);
    }
  }, [accessToken]);

  const handleCreate = useCallback(async () => {
    if (!accessToken) {
      setError("No authentication token found.");
      return;
    }

    try {
      setFormLoading(true); // Use formLoading here
      setError("");
      const payload = {
        ...formData,
        school_uni_id: uniqueId,
      };
      const response = await axios.post(
        "https://brjobsedu.com/gyandhara/gyandhara_backend/api/offline-competition/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        alert("Created successfully");
        setCompetitions((prev) => [...prev, response.data.data]);
        setShowModal(false);
        resetForm();
        fetchCompetitions(); // Refresh list
      } else {
        setError("API returned success: false");
      }
    } catch (err) {
      console.error("Create Competition API Error:", err);
      setError("Failed to create competition: " + err.message);
    } finally {
      setFormLoading(false); // Use formLoading here
    }
  }, [accessToken, formData, uniqueId, fetchCompetitions]);

  const handleUpdate = useCallback(async () => {
    if (!accessToken || !selectedCompetition) {
      setError("No authentication token or competition selected.");
      return;
    }

    try {
      setFormLoading(true); // Use formLoading here (This prevents the blank background issue)
      setError("");
      const payload = {
        ...selectedCompetition,
        school_uni_id: uniqueId,
      };
      const response = await axios.put(
        `https://brjobsedu.com/gyandhara/gyandhara_backend/api/offline-competition/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        alert("Update successfully");
        setCompetitions((prev) =>
          prev.map((comp) =>
            comp.completion_id === selectedCompetition.completion_id
              ? response.data.data
              : comp
          )
        );
        setShowModal(false);
        setSelectedCompetition(null);
        fetchCompetitions(); // Refresh list
      } else {
        setError("API returned success: false");
      }
    } catch (err) {
      console.error("Update Competition API Error:", err);
      setError("Failed to update competition: " + err.message);
    } finally {
      setFormLoading(false); // Use formLoading here (This prevents the blank background issue)
    }
  }, [accessToken, selectedCompetition, uniqueId, fetchCompetitions]);

  // --- Handlers ---
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = (comp) => {
    setSelectedCompetition(comp);
    setFormData({
      title: comp.title || "",
      description: comp.description || "",
      title_hindi: comp.title_hindi || "",
      description_hindi: comp.description_hindi || "",
      location: comp.location || "",
      school_uni_id: comp.school_uni_id || uniqueId,
      comp_date_time: comp.comp_date_time || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      title_hindi: "",
      description_hindi: "",
      location: "",
      school_uni_id: uniqueId || "",
      comp_date_time: "",
    });
    setSelectedCompetition(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

return (
    <div className="dashboard-container">
      <SchoolLeftNav
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      <div className="main-content-dash">
        <SchoolHeader toggleSidebar={toggleSidebar} />

        <Container fluid className="dashboard-box mt-3">
          {/* Page Header */}
          <Row className="mb-4 align-items-center">
            <Col>
              <h4 className="font-weight-bold">Offline Competitions</h4>
              <p className="text-muted mb-0">Manage school offline events and competitions</p>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }}>
                + Add Competition
              </Button>
            </Col>
          </Row>

          {/* Error Alert */}
          {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

          {/* Content Card */}
          <Card className="shadow-sm">
            <Card.Body>
              {listLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2 text-muted">Loading competitions...</p>
                </div>
              ) : competitions.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Location</th>
                      <th>Date & Time</th>
                      <th>School ID</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitions.map((comp, index) => (
                      <tr key={comp.completion_id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{comp.title}</strong>
                          <br/>
                          {comp.title_hindi && <small className="text-muted">{comp.title_hindi}</small>}
                        </td>
                        <td>{comp.location}</td>
                        <td>{comp.comp_date_time ? new Date(comp.comp_date_time).toLocaleString() : '-'}</td>
                        <td>{comp.school_uni_id}</td>
                        <td className="text-center">
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditClick(comp)}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5 text-muted">
                  <p>No competitions found. Click "Add Competition" to create one.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={handleModalClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCompetition ? "Edit Competition" : "Add New Competition"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="title" className="mb-3">
                  <Form.Label>Title (English)</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter competition title"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="title_hindi" className="mb-3">
                  <Form.Label>Title (Hindi)</Form.Label>
                  <Form.Control
                    type="text"
                    name="title_hindi"
                    value={formData.title_hindi}
                    onChange={handleInputChange}
                    placeholder="हिंदी में शीर्षक दर्ज करें"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group controlId="description" className="mb-3">
                  <Form.Label>Description (English)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="description_hindi" className="mb-3">
                  <Form.Label>Description (Hindi)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description_hindi"
                    value={formData.description_hindi}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="location" className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. School Auditorium"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="comp_date_time" className="mb-3">
                  <Form.Label>Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="comp_date_time"
                    value={formData.comp_date_time}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group controlId="school_uni_id" className="mb-3">
              <Form.Label>School Uni ID</Form.Label>
              <Form.Control
                type="text"
                name="school_uni_id"
                value={formData.school_uni_id}
                onChange={handleInputChange}
                disabled
              />
              <Form.Text className="text-muted">Auto-filled from your profile.</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={selectedCompetition ? handleUpdate : handleCreate}
            disabled={formLoading}
          >
            {formLoading ? <Spinner animation="border" size="sm" /> : (selectedCompetition ? "Update Competition" : "Create Competition")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Offlinecompetition;