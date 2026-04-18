import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './registration.css';

const SchoolRegistration = () => {
  const [formData, setFormData] = useState({
    school_id: '',
    school_name: '',
    password: '',
    confirm_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.school_id.trim()) {
      setError('School ID is required');
      return false;
    }
    if (!formData.school_name.trim()) {
      setError('School Name is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(
        'https://brjobsedu.com/gyandhara/gyandhara_backend/api/school-reg/',
        {
          school_id: formData.school_id,
          school_name: formData.school_name,
          password: formData.password,
        }
      );

      alert('School Registration successful! You can now login.');
      setFormData({
        school_id: '',
        school_name: '',
        password: '',
        confirm_password: '',
      });
      setSuccess('School Registration successful! You can now login.');
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-wrapper">
        <div className="registration-header">
          <h1>School Registration</h1>
          <p className="registration-subtitle">Register your educational institution</p>
        </div>

        {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error!</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>}

        {success && <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Success!</strong> {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="school_id" className="form-label">
                School ID <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="school_id"
                name="school_id"
                value={formData.school_id}
                onChange={handleInputChange}
                placeholder="e.g., greenvalley123"
              />
            </div>

            <div className="form-group">
              <label htmlFor="school_name" className="form-label">
                School Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="school_name"
                name="school_name"
                value={formData.school_name}
                onChange={handleInputChange}
                placeholder="School Name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Min. 6 chars"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password" className="form-label">
                Confirm Password <span className="required">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                placeholder="Confirm"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Registering...
                </>
              ) : (
                'Register School'
              )}
            </button>
          </div>

          <p className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SchoolRegistration;