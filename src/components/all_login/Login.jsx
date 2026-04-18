import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    role: '9th-student',
    email_or_phone: '',
    aadhaar_no: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const roleOptions = [
    { value: '9th-student', label: '9th Student', icon: 'bi-mortarboard' },
    { value: '10th-student', label: '10th Student', icon: 'bi-mortarboard' },
    { value: '11th-student', label: '11th Student', icon: 'bi-mortarboard' },
    { value: '12th-student', label: '12th Student', icon: 'bi-mortarboard' },
    { value: 'admin', label: 'Admin', icon: 'bi-shield-lock' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email_or_phone && !formData.aadhaar_no) {
      setError('Email/Phone or Aadhaar number is required');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        role: formData.role,
        password: formData.password,
      };

      if (formData.role === 'admin') {
        payload.email_or_phone = formData.email_or_phone;
      } else {
        payload.aadhaar_no = formData.aadhaar_no;
      }

      const response = await axios.post(
        'https://brjobsedu.com/gyandhara/gyandhara_backend/api/login/',
        payload
      );

      if (response.data.access) {
        login({
          access: response.data.access,
          refresh: response.data.refresh,
          role: response.data.role,
          unique_id: response.data.unique_id,
          user: response.data.user || null,
        });
        alert('Login successful!');
        
        if (response.data.role === 'admin') {
          navigate('/AdminDashboard');
        } else {
          navigate('/UserDashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-pattern"></div>
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <div className="brand-logo">
              <i className="bi bi-mortarboard-fill"></i>
            </div>
            <h1>Gyan Dhara</h1>
            <p>Building Careers, Shaping Futures</p>
          </div>

          <div className="welcome-section">
            <h2>Welcome Back!</h2>
            <p>Continue your learning journey</p>
          </div>

          <div className="role-selector">
            <label>Select Your Role</label>
            <div className="role-tabs">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`role-tab ${formData.role === option.value ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: option.value })}
                >
                  <i className={option.icon}></i>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="alert-message error">
                <i className="bi bi-exclamation-circle"></i>
                {error}
              </div>
            )}

            {formData.role === 'admin' ? (
              <div className="form-group">
                <label>Email / Phone</label>
                <div className="input-wrapper">
                  <i className="bi bi-person"></i>
                  <input
                    type="text"
                    name="email_or_phone"
                    value={formData.email_or_phone}
                    onChange={handleChange}
                    placeholder="Enter email or phone"
                  />
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label>Aadhaar Number</label>
                <div className="input-wrapper">
                  <i className="bi bi-person-badge"></i>
                  <input
                    type="text"
                    name="aadhaar_no"
                    value={formData.aadhaar_no}
                    onChange={handleChange}
                    placeholder="Enter 12-digit Aadhaar"
                    maxLength="12"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <i className="bi bi-lock"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="/" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>New student? <Link to="/register">Register here</Link></p>
          </div>
        </div>

        <div className="login-highlights">
          <div className="highlight-item">
            <i className="bi bi-book"></i>
            <h3>Learn</h3>
            <p>Access quality education and new courses</p>
          </div>
          <div className="highlight-item">
            <i className="bi bi-graph-up"></i>
            <h3>Grow</h3>
            <p>Track your academic progress</p>
          </div>
          <div className="highlight-item">
            <i className="bi bi-rocket-takeoff"></i>
            <h3>Succeed</h3>
            <p>Build your career from class 9 to 12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;