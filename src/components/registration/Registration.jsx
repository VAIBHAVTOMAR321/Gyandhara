import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './registration.css';

const Registration = () => {
  const [activeTab, setActiveTab] = useState('school');
  
  const [studentData, setStudentData] = useState({
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
    school_name: '',
    school_uni_id: '',
  });

  const [schoolData, setSchoolData] = useState({
    school_id: '',
    school_name: '',
    password: '',
    confirm_password: '',
  });

  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [schools, setSchools] = useState([]);

  const classOptions = ['9th', '10th', '11th', '12th'];

  React.useEffect(() => {
    fetchDistricts();
  }, []);

  React.useEffect(() => {
    if (studentData.district) {
      fetchBlocks(studentData.district);
    } else {
      setBlocks([]);
    }
  }, [studentData.district]);

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
    } finally {
      setLoadingBlocks(false);
    }
  };

  const fetchSchools = async (searchTerm = '') => {
    try {
      const response = await axios.get(
        `https://brjobsedu.com/gyandhara/gyandhara_backend/api/school-list/`
      );
      if (response.data.success && response.data.data) {
        setSchools(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching schools:', err);
    }
  };

  React.useEffect(() => {
    fetchSchools();
  }, []);

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      [name]: value,
    });
    setError('');
  };

  const handleSchoolChange = (e) => {
    const { name, value } = e.target;
    setSchoolData({
      ...schoolData,
      [name]: value,
    });
    setError('');
  };

  const validateStudentForm = () => {
    if (!studentData.full_name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!studentData.aadhaar_no.trim()) {
      setError('Aadhaar number is required');
      return false;
    }
    if (!/^\d{12}$/.test(studentData.aadhaar_no)) {
      setError('Aadhaar number must be 12 digits');
      return false;
    }
    if (!studentData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!/^\d{10}$/.test(studentData.phone)) {
      setError('Phone number must be 10 digits');
      return false;
    }
    if (!studentData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!studentData.password) {
      setError('Password is required');
      return false;
    }
    if (studentData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (studentData.password !== studentData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }
    if (!studentData.district) {
      setError('Please select a district');
      return false;
    }
    if (!studentData.block) {
      setError('Please select a block');
      return false;
    }
    if (!studentData.class_name) {
      setError('Please select a class');
      return false;
    }
    if (!studentData.school_name) {
      setError('School name is required');
      return false;
    }
    return true;
  };

  const validateSchoolForm = () => {
    if (!schoolData.school_id.trim()) {
      setError('School ID is required');
      return false;
    }
    if (!schoolData.school_name.trim()) {
      setError('School Name is required');
      return false;
    }
    if (!schoolData.password) {
      setError('Password is required');
      return false;
    }
    if (schoolData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (schoolData.password !== schoolData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStudentForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const registrationData = {
        full_name: studentData.full_name,
        aadhaar_no: studentData.aadhaar_no,
        school_uni_id: studentData.school_uni_id,
        school_name: studentData.school_name,
        phone: studentData.phone,
        email: studentData.email,
        password: studentData.password,
        district: studentData.district,
        block: studentData.block,
        state: studentData.state,
        class_name: studentData.class_name,
      };

      await axios.post(
        'https://brjobsedu.com/gyandhara/gyandhara_backend/api/student-reg/',
        registrationData
      );

      alert('Student Registration successful! You can now login.');
      setStudentData({
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
        school_name: '',
        school_uni_id: '',
      });
      setBlocks([]);
      setSuccess('Student Registration successful! You can now login.');
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

  const handleSchoolSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateSchoolForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(
        'https://brjobsedu.com/gyandhara/gyandhara_backend/api/school-reg/',
        {
          school_id: schoolData.school_id,
          school_name: schoolData.school_name,
          password: schoolData.password,
        }
      );

      alert('School Registration successful! You can now login.');
      setSchoolData({
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
          <h1>Registration</h1>
          <p className="registration-subtitle">Join Gyandhara - Stream of Knowledge</p>
        </div>

        <div className="registration-tabs">
          <button 
            className={`tab-btn ${activeTab === 'school' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('school');
              setError('');
              setSuccess('');
            }}
          >
            School Registration
          </button>
          <button 
            className={`tab-btn ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('student');
              setError('');
              setSuccess('');
            }}
          >
            Student Registration
          </button>
        </div>

        {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error!</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>}

        {success && <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Success!</strong> {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>}

        {activeTab === 'school' ? (
          <form onSubmit={handleSchoolSubmit} className="registration-form">
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
                  value={schoolData.school_id}
                  onChange={handleSchoolChange}
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
                  value={schoolData.school_name}
                  onChange={handleSchoolChange}
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
                  value={schoolData.password}
                  onChange={handleSchoolChange}
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
                  value={schoolData.confirm_password}
                  onChange={handleSchoolChange}
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
        ) : (
          <form onSubmit={handleStudentSubmit} className="registration-form">
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
                  value={studentData.full_name}
                  onChange={handleStudentChange}
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
                  value={studentData.aadhaar_no}
                  onChange={handleStudentChange}
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
                  value={studentData.phone}
                  onChange={handleStudentChange}
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
                  value={studentData.email}
                  onChange={handleStudentChange}
                  placeholder="Email"
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
                  value={studentData.password}
                  onChange={handleStudentChange}
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
                  value={studentData.confirm_password}
                  onChange={handleStudentChange}
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
                  value={studentData.class_name}
                  onChange={handleStudentChange}
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
                  value={studentData.state}
                  disabled
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="district" className="form-label">
                  District <span className="required">*</span>
                </label>
                <select
                  className="form-control"
                  id="district"
                  name="district"
                  value={studentData.district}
                  onChange={handleStudentChange}
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
                  value={studentData.block}
                  onChange={handleStudentChange}
                  disabled={!studentData.district || loadingBlocks}
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
                <label htmlFor="school_name" className="form-label">
                  School Name <span className="required">*</span>
                </label>
                <select
                  className="form-control"
                  id="school_name"
                  name="school_name"
                  value={studentData.school_name}
                  onChange={handleStudentChange}
                >
                  <option value="">Select School</option>
                  {schools.map((school) => (
                    <option key={school.school_uni_id} value={school.school_name}>
                      {school.school_name}
                    </option>
                  ))}
                </select>
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
                  'Register as Student'
                )}
              </button>
            </div>

            <p className="login-link">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Registration;