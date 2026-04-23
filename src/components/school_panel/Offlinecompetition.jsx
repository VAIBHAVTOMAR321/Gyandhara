import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, ListGroup, Table, Form } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../all_login/AuthContext";

const Offlinecompetition = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    title_hindi: "",
    description_hindi: "",
    location: "",
    school_uni_id: "",
    comp_date_time: "",
  });

  const { accessToken, uniqueId } = useAuth();

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    if (!accessToken) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!accessToken) {
      setError("No authentication token found.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.post(
        "https://brjobsedu.com/gyandhara/gyandhara_backend/api/offline-competition/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setCompetitions([...competitions, response.data.data]);
        setShowModal(false);
        setFormData({
          title: "",
          description: "",
          title_hindi: "",
          description_hindi: "",
          location: "",
          school_uni_id: "",
          comp_date_time: "",
        });
        fetchCompetitions();
      } else {
        setError("API returned success: false");
      }
    } catch (err) {
      console.error("Create Competition API Error:", err);
      setError("Failed to create competition: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!accessToken || !selectedCompetition) {
      setError("No authentication token or competition selected.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.put(
        `https://brjobsedu.com/gyandhara/gyandhara_backend/api/offline-competition/${selectedCompetition.completion_id}/`,
        selectedCompetition,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setCompetitions(
          competitions.map((comp) =>
            comp.completion_id === selectedCompetition.completion_id
              ? response.data.data
              : comp
          )
        );
        setShowModal(false);
        setSelectedCompetition(null);
        fetchCompetitions();
      } else {
        setError("API returned success: false");
      }
    } catch (err) {
      console.error("Update Competition API Error:", err);
      setError("Failed to update competition: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (completionId) => {
    if (!accessToken) {
      setError("No authentication token found.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this competition?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.delete(
        `https://brjobsedu.com/gyandhara/gyandhara_backend/api/offline-competition/${completionId}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setCompetitions(
          competitions.filter((comp) => comp.completion_id !== completionId)
        );
        fetchCompetitions();
      } else {
        setError("API returned success: false");
      }
    } catch (err) {
      console.error("Delete Competition API Error:", err);
      setError("Failed to delete competition: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Offline Competitions</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Competition
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Location</th>
              <th>Date & Time</th>
              <th>School ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {competitions.map((comp, index) => (
              <tr key={comp.completion_id}>
                <td>{index + 1}</td>
                <td>{comp.title}</td>
                <td>{comp.location}</td>
                <td>{new Date(comp.comp_date_time).toLocaleString()}</td>
                <td>{comp.school_uni_id}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setSelectedCompetition(comp);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(comp.completion_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header>
          <Modal.Title>
            {selectedCompetition ? "Edit Competition" : "Add Competition"}
          </Modal.Title>
          <Button
            variant="light"
            className="close-btn-custom"
            onClick={() => setShowModal(false)}
          >
            <span aria-hidden="true">&times;</span>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="title_hindi">
                  <Form.Label>Title (Hindi)</Form.Label>
                  <Form.Control
                    type="text"
                    name="title_hindi"
                    value={formData.title_hindi}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
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
                <Form.Group controlId="description_hindi">
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
                <Form.Group controlId="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="school_uni_id">
                  <Form.Label>School Uni ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="school_uni_id"
                    value={formData.school_uni_id}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="comp_date_time">
                  <Form.Label>Competition Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="comp_date_time"
                    value={formData.comp_date_time}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedCompetition ? (
            <Button variant="primary" onClick={handleUpdate}>
              Update Competition
            </Button>
          ) : (
            <Button variant="primary" onClick={handleCreate}>
              Create Competition
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Offlinecompetition;