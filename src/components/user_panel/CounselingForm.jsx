import React, { useState } from 'react'
import { Card, Button, Form, Row, Col } from 'react-bootstrap'
import { FaLightbulb } from 'react-icons/fa'

const CounselingForm = ({ onSubmit, initialData = {}, showForm: propShowForm, onToggle, userRoleType }) => {
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
    student_id: initialData.student_id || initialData.student_id || '',
    full_name: initialData.full_name || initialData.candidate_name || '',
    aadhaar_no: initialData.aadhaar_no || '',
    associate_wings: initialData.associate_wings || '',
    phone: initialData.phone || initialData.mobile_no || '',
    email: initialData.email || '',
    district: initialData.district || '',
    block: initialData.block || '',
    state: initialData.state || '',
    guardian_name: initialData.guardian_name || '',
    date_of_birth: initialData.date_of_birth || '',
    highest_education: initialData.highest_education || '',
    address: initialData.address || '',
    created_at: initialData.created_at || '',
    category_consulting: initialData.category_consulting || [],
    otherCategory: initialData.otherCategory || '',
    status: 'pending'
  })
  
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field, value) => {
    if (field === 'category_consulting') {
      setFormData(prev => ({
        ...prev,
        [field]: Array.isArray(value) ? value : [value]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (submitting) return

    if (!formData.student_id) {
      alert('Student ID is required')
      return
    }
    
    if (!formData.full_name) {
      alert('Full Name is required')
      return
    }

    if (formData.aadhaar_no && !/^\d{12}$/.test(formData.aadhaar_no.replace(/\s+/g, ''))) {
      alert('Please enter a valid 12-digit Aadhaar number')
      return
    }

    if (!formData.category_consulting.length) {
      alert('Please select at least one category')
      return
    }

    if (formData.category_consulting.includes('other') && !formData.otherCategory.trim()) {
      alert('Please specify the other category')
      return
    }

    setSubmitting(true)

    try {
      const cleanData = {
        ...formData,
        phone: formData.phone.replace(/\s+/g, ''),
        aadhaar_no: formData.aadhaar_no ? formData.aadhaar_no.replace(/\s+/g, '') : null,
        category_consulting: formData.category_consulting,
        otherCategory: formData.otherCategory.trim()
      }

      await onSubmit(cleanData)

      alert('Your counselling request has been submitted')
      setFormData({
        student_id: initialData.student_id || initialData.student_id || '',
        full_name: initialData.full_name || initialData.candidate_name || '',
        aadhaar_no: initialData.aadhaar_no || '',
        associate_wings: initialData.associate_wings || '',
        phone: initialData.phone || initialData.mobile_no || '',
        email: initialData.email || '',
        district: initialData.district || '',
        block: initialData.block || '',
        state: initialData.state || '',
        guardian_name: initialData.guardian_name || '',
        date_of_birth: initialData.date_of_birth || '',
        highest_education: initialData.highest_education || '',
        address: initialData.address || '',
        created_at: initialData.created_at || '',
        category_consulting: [],
        otherCategory: '',
        status: 'pending'
      })
    } catch (error) {
      alert(error.message || 'An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const categoryOptions = [
    { value: 'career-guidance', label: 'Career Guidance' },
    { value: 'course-selection', label: 'Course Selection' },
    { value: 'admission-process', label: 'Admission Process' },
    { value: 'financial-aid', label: 'Financial Aid' },
    { value: 'study-abroad', label: 'Study Abroad' },
    { value: 'job-placement', label: 'Job Placement' },
    { value: 'skill-development', label: 'Skill Development' },
    { value: 'personal-counseling', label: 'Personal Counseling' },
    { value: 'health', label: 'Health' },
    { value: 'domestic', label: 'Domestic' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <>
      <Card className="mb-4 shadow-sm border-0" style={{ borderRadius: '10px' }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-0">
                <FaLightbulb className="me-2 text-warning" />
                Career Counseling
              </h5>
              <small className="text-muted">Get expert guidance for your career</small>
            </div>
            <Button
              variant="outline-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Hide Form' : 'Get Counseling'}
            </Button>
          </div>

          {showForm && (
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Select Categories</Form.Label>
                    <div className="row">
                      {categoryOptions.map((option) => (
                        <Col key={option.value} md={4} className="mb-2">
                          <Form.Check
                            type="checkbox"
                            id={option.value}
                            label={option.label}
                            checked={formData.category_consulting.includes(option.value)}
                            onChange={(e) => {
                              const checked = e.target.checked
                              const currentCategories = formData.category_consulting
                              if (checked) {
                                handleChange('category_consulting', [...currentCategories, option.value])
                              } else {
                                handleChange('category_consulting', currentCategories.filter(cat => cat !== option.value))
                              }
                            }}
                          />
                        </Col>
                      ))}
                    </div>
                  </Form.Group>
                </Col>
                {formData.category_consulting.includes('other') && (
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Specify Other Category</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.otherCategory}
                        onChange={(e) => handleChange('otherCategory', e.target.value)}
                        placeholder="Please specify"
                        required
                      />
                    </Form.Group>
                  </Col>
                )}
                <Col xs={12}>
                  <Button
                    variant={submitted ? "success" : "primary"}
                    type="submit"
                    className=""
                    disabled={submitting || submitted}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : submitted ? (
                      'Submitted'
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