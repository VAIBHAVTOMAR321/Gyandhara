import React, { useState } from 'react'
import { Card, Button, Form, Row, Col, Modal } from 'react-bootstrap'
import { FaLightbulb } from 'react-icons/fa'

const CounselingForm = ({ onSubmit, studentId = '', showForm: propShowForm, onToggle }) => {
  const [internalShowForm, setInternalShowForm] = useState(false)
  const showForm = propShowForm !== undefined ? propShowForm : internalShowForm
  const setShowForm = (value) => {
    if (onToggle) {
      onToggle(value)
    } else {
      setInternalShowForm(value)
    }
  }
  
  const [formData, setFormData] = useState({
    student_id: studentId,
    category_consulting: 'Career Guidance'
  })
  
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const counselingCategories = [
    'Career Guidance',
    'Course Selection',
    'Admission Process',
    'Financial Aid',
    'Study Abroad',
    'Job Placement',
    'Skill Development',
    'Personal Counseling',
    'Health',
    'Domestic'
  ]

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (submitting) return

    if (!formData.student_id) {
      alert('Student ID is required')
      return
    }
    
    if (!formData.category_consulting) {
      alert('Please select a counseling category')
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        student_id: formData.student_id,
        category_consulting: [formData.category_consulting]
      }

      await onSubmit(payload)

      alert('Your counselling request has been submitted successfully!')
      setFormData({
        student_id: studentId,
        category_consulting: 'Career Guidance'
      })
      setSubmitted(true)
      setTimeout(() => {
        setShowForm(false)
        setSubmitted(false)
      }, 1000)
    } catch (error) {
      alert(error.message || 'An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Card className="mb-4 shadow-sm border-0" style={{ borderRadius: '10px' }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-0">
                <FaLightbulb className="me-2 text-warning" />
                Request Career Counseling
              </h5>
              <small className="text-muted">Get expert guidance for your career</small>
            </div>
            <Button
              variant="outline-primary"
              onClick={() => setShowForm(!showForm)}
              size="sm"
            >
              {showForm ? 'Cancel' : 'Request Counseling'}
            </Button>
          </div>

          {showForm && (
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Student ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.student_id}
                      disabled
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Select Counseling Category <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={formData.category_consulting}
                      onChange={(e) => handleChange('category_consulting', e.target.value)}
                      required
                    >
                      <option value="">-- Select Category --</option>
                      {counselingCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Button
                    variant={submitted ? "success" : "primary"}
                    type="submit"
                    className="w-100"
                    disabled={submitting || submitted}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : submitted ? (
                      <>✓ Submitted Successfully</>
                    ) : (
                      'Submit Request'
                    )}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Card.Body>
      </Card>
    </>
  )
}

export default CounselingForm