import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './registration.css';

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    aadhaar_no: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
    state: 'Uttarakhand',
    district: '',
    block: '',
    class_name: '',
    associate_wings: '',
  });

  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);

  const classOptions = ['9th', '10th', '11th', '12th'];
  const wingOptions = ['North Wing', 'South Wing', 'East Wing', 'West Wing', 'Central Wing'];

  // Fetch districts on component mount
  useEffect(() => {
    fetchDistricts();
  }, []);

  // Fetch blocks when district changes
  useEffect(() => {
    if (formData.district) {
      fetchBlocks(formData.district);
    } else {
      setBlocks([]);
    }
  }, [formData.district]);

  const fetchDistricts = async () => {
    setLoadingDistricts(true);
    try {
      const response = await axios.get(
        'https://brjobsedu.com/gyandhara/gyandhara_backend/api/district-blocks/'
      );
      if (response.data.status && response.data.data.districts) {
        setDistricts(response.data.data.districts);
      }
    } catch (err) {
      console.error('Error fetching districts:', err);
      setError('Failed to fetch districts. Please try again.');
    } finally {
      setLoadingDistricts(false);
    }
  };

  const fetchBlocks = async (district) => {
    setLoadingBlocks(true);
    try {
      const response = await axios.get(
        `https://brjobsedu.com/gyandhara/gyandhara_backend/api/district-blocks/?district=${district}`
      );
      if (response.data.status && response.data.data.blocks) {
        setBlocks(response.data.data.blocks);
      }
    } catch (err) {
      console.error('Error fetching blocks:', err);
      setError('Failed to fetch blocks. Please try again.');
    } finally {
      setLoadingBlocks(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.aadhaar_no.trim()) {
      setError('Aadhaar number is required');
      return false;
    }
    if (!/^\d{12}$/.test(formData.aadhaar_no)) {
      setError('Aadhaar number must be 12 digits');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Phone number must be 10 digits');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email');
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
    if (!formData.district) {
      setError('Please select a district');
      return false;
    }
    if (!formData.block) {
      setError('Please select a block');
      return false;
    }
    if (!formData.class_name) {
      setError('Please select a class');
      return false;
    }
    if (!formData.associate_wings) {
      setError('Please select an associate wing');
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
      // Prepare data for API
      const registrationData = {
        full_name: formData.full_name,
        aadhaar_no: formData.aadhaar_no,
        associate_wings: formData.associate_wings,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        district: formData.district,
        block: formData.block,
        state: formData.state,
        class_name: formData.class_name,
      };

      await axios.post(
        'https://brjobsedu.com/gyandhara/gyandhara_backend/api/student-reg/',
        registrationData
      );

      // Show browser alert and reset form after user clicks OK
      alert('Registration successful! You can now login.');
      setFormData({
        full_name: '',
        aadhaar_no: '',
        phone: '',
        email: '',
        password: '',
        confirm_password: '',
        state: 'Uttarakhand',
        district: '',
        block: '',
        class_name: '',
        associate_wings: '',
      });
      setBlocks([]);
      setSuccess('Registration successful! You can now login.');
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
          <h1>Student Registration</h1>
          <p className="registration-subtitle">Classes 9th - 12th</p>
        </div>

        {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error!</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>}

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Row 1: Full Name, Aadhaar, Phone, Email */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="full_name" className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="aadhaar_no" className="form-label">
                Aadhaar <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="aadhaar_no"
                name="aadhaar_no"
                value={formData.aadhaar_no}
                onChange={handleInputChange}
                placeholder="12 digits"
                maxLength="12"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10 digits"
                maxLength="10"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
            </div>
          </div>

          {/* Row 2: Password, Confirm Password, Class, State */}
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

            <div className="form-group">
              <label htmlFor="class_name" className="form-label">
                Class <span className="required">*</span>
              </label>
              <select
                className="form-control"
                id="class_name"
                name="class_name"
                value={formData.class_name}
                onChange={handleInputChange}
              >
                <option value="">Select class</option>
                {classOptions.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="state" className="form-label">
                State <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="state"
                name="state"
                value={formData.state}
                disabled
                title="State is fixed to Uttarakhand"
              />
            </div>
          </div>

          {/* Row 3: District, Block, Associate Wings */}
          <div className="form-row form-row-3">
            <div className="form-group">
              <label htmlFor="district" className="form-label">
                District <span className="required">*</span>
              </label>
              <select
                className="form-control"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                disabled={loadingDistricts}
              >
                <option value="">
                  {loadingDistricts ? 'Loading...' : 'Select district'}
                </option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="block" className="form-label">
                Block <span className="required">*</span>
              </label>
              <select
                className="form-control"
                id="block"
                name="block"
                value={formData.block}
                onChange={handleInputChange}
                disabled={!formData.district || loadingBlocks}
              >
                <option value="">
                  {loadingBlocks ? 'Loading...' : 'Select block'}
                </option>
                {blocks.map((block) => (
                  <option key={block} value={block}>
                    {block}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="associate_wings" className="form-label">
                Wing <span className="required">*</span>
              </label>
              <select
                className="form-control"
                id="associate_wings"
                name="associate_wings"
                value={formData.associate_wings}
                onChange={handleInputChange}
              >
                <option value="">Select wing</option>
                {wingOptions.map((wing) => (
                  <option key={wing} value={wing}>
                    {wing}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
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
                'Register'
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

export default StudentRegistration;
