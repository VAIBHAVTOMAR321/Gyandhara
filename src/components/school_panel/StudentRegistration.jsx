import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Button, Form, Alert, Table, Spinner, Modal, Pagination } from "react-bootstrap";
import axios from "axios";
import * as XLSX from 'xlsx';

import { useAuth } from "../all_login/AuthContext";
import SchoolHeader from "./SchoolHeader";
import SchoolLeftNav from "./SchoolLeftNav";
import "../../assets/css/userleftnav.css";

const StudentRegistration = () => {
  const { uniqueId: school_uni_id, accessToken } = useAuth();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('single');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Students list state
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const recordsPerPage = 50;

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ full_name: '', aadhaar_no: '' });
  const [editLoading, setEditLoading] = useState(false);

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState(null);
  const [deletingMultiple, setDeletingMultiple] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Single registration state
  const [singleForm, setSingleForm] = useState({
    full_name: '',
    aadhaar_no: '',
  });
  const [singleErrors, setSingleErrors] = useState({});

  // Bulk registration state
  const [bulkFile, setBulkFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [existingStudents, setExistingStudents] = useState(new Set());
  const [bulkErrors, setBulkErrors] = useState([]);
  const [submittingBulk, setSubmittingBulk] = useState(false);
  const [rowStatuses, setRowStatuses] = useState([]);
  const [previewReady, setPreviewReady] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(false);

  // Generate and download template
  const downloadTemplate = () => {
    const templateData = [
      { aadhaar_no: '123456789012', full_name: 'Sample Student Name' },
      { aadhaar_no: '987654321098', full_name: 'Another Student' }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    
    // Set column widths for better readability
    worksheet['!cols'] = [
      { wch: 20 }, // aadhaar_no column
      { wch: 30 }  // full_name column
    ];
    
    XLSX.writeFile(workbook, 'student_aadhaar_template.xlsx');
  };

  // Fetch students with pagination
  const fetchStudents = async (page = 1) => {
    setStudentsLoading(true);
    try {
      const response = await axios.get(
        `https://brjobsedu.com/gyandhara/gyandhara_backend/api/school-aadhaar-reg/?school_uni_id=${school_uni_id}&page=${page}&limit=${recordsPerPage}`,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      );
      
      let studentsData = [];
      let total = 0;
      
      if (response.data.success) {
        if (Array.isArray(response.data.data)) {
          studentsData = response.data.data;
          total = response.data.data.length;
        } else if (response.data.data && Array.isArray(response.data.data.results)) {
          studentsData = response.data.data.results;
          total = response.data.data.count || response.data.data.results.length;
        }
      }
      
      setStudents(studentsData);
      setTotalStudents(total);
      setCurrentPage(page);
    } catch (err) {
      console.error('Fetch students error:', err);
      setError('Failed to load students');
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'list') {
      fetchStudents();
    }
  }, [activeTab, school_uni_id]);

  // Toggle tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
    setSingleErrors({});
    setBulkErrors([]);
    setParsedData([]);
    setPreviewReady(false);
    setRowStatuses([]);
    setBulkFile(null);
    setExistingStudents(new Set());
    setSelectedIds([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Edit student
  const handleEditClick = (student) => {
    setEditingStudent(student);
    setEditForm({ full_name: student.full_name, aadhaar_no: student.aadhaar_no });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    if (!editForm.full_name.trim() || !editForm.aadhaar_no.trim()) {
      setError('All fields are required');
      return;
    }
    if (!/^\d{12}$/.test(editForm.aadhaar_no)) {
      setError('Aadhaar must be 12 digits');
      return;
    }

    setEditLoading(true);
    setError('');
    try {
      await axios.put(
        `https://brjobsedu.com/gyandhara/gyandhara_backend/api/school-aadhaar-reg/?send_id=${editingStudent.id}`,
        {
          school_uni_id,
          aadhaar_no: editForm.aadhaar_no,
          full_name: editForm.full_name
        },
        { headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        } }
      );
      setSuccess('Student updated successfully');
      setShowEditModal(false);
      fetchStudents(currentPage);
    } catch (err) {
      console.error('Edit error:', err);
      const message = err.response?.data?.message || 'Update failed';
      setError(message);
    } finally {
      setEditLoading(false);
    }
  };

  // Delete single student
  const handleDeleteClick = (id) => {
    setDeletingStudentId(id);
    setDeletingMultiple(false);
    setShowDeleteModal(true);
  };

  // Delete multiple students
  const handleDeleteMultiple = () => {
    if (selectedIds.length === 0) return;
    setDeletingMultiple(true);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    setError('');
    try {
      if (deletingMultiple) {
        await axios.delete(
          `https://brjobsedu.com/gyandhara/gyandhara_backend/api/school-aadhaar-reg/?send_id=${JSON.stringify(selectedIds)}`,
          { headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          } }
        );
        setSuccess(`${selectedIds.length} students deleted successfully`);
        setSelectedIds([]);
      } else {
        await axios.delete(
          `https://brjobsedu.com/gyandhara/gyandhara_backend/api/school-aadhaar-reg/?send_id=${deletingStudentId}`,
          { headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          } }
        );
        setSuccess('Student deleted successfully');
      }
      setShowDeleteModal(false);
      fetchStudents(currentPage);
    } catch (err) {
      console.error('Delete error:', err);
      const message = err.response?.data?.message || 'Delete failed';
      setError(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Toggle selection
  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map(s => s.id));
    }
  };

  // Pagination
  const totalPages = Math.ceil(totalStudents / recordsPerPage);
  const renderPagination = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => fetchStudents(i)}>
          {i}
        </Pagination.Item>
      );
    }
    return items;
  };

  // Single form validation
  const validateSingleForm = () => {
    const errors = {};
    if (!singleForm.full_name.trim()) {
      errors.full_name = 'Full name is required';
    }
    if (!singleForm.aadhaar_no.trim()) {
      errors.aadhaar_no = 'Aadhaar number is required';
    } else if (!/^\d{12}$/.test(singleForm.aadhaar_no)) {
      errors.aadhaar_no = 'Aadhaar must be 12 digits';
    }
    setSingleErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle single form input
  const handleSingleChange = (e) => {
    const { name, value } = e.target;
    setSingleForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (singleErrors[name]) {
      setSingleErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Submit single registration
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSingleForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        aadhaar_no: singleForm.aadhaar_no,
        full_name: singleForm.full_name
      };

      console.log('Single registration payload:', payload);

      await axios.post(
        `https://brjobsedu.com/gyandhara/gyandhara_backend/api/school-aadhaar-reg/?school_uni_id=${school_uni_id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      );

      setSuccess('Student registered successfully!');
      setSingleForm({ full_name: '', aadhaar_no: '' });
} catch (err) {
      const message = err.response?.data?.errors?.aadhaar_no?.[0] || err.response?.data?.errors || err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setBulkErrors([]);
    setParsedData([]);
    setPreviewReady(false);
    setRowStatuses([]);

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/vnd.ms-excel'
    ];

    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'csv', 'xls'].includes(fileExt)) {
      setError('Please upload a valid Excel file (.xlsx, .xls, or .csv)');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setBulkFile(file);
    parseExcelFile(file);
  };

  // Parse Excel file
  const parseExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        if (jsonData.length < 2) {
          setError('Excel file must have header row and at least one data row');
          return;
        }

        // Extract headers from first row
        const headers = jsonData[0].map(h => String(h).trim().toLowerCase());
        const aadhaarIdx = headers.findIndex(h => h === 'aadhaar_no' || h === 'aadhaar' || h === 'aadhaar number');
        const nameIdx = headers.findIndex(h => h === 'full_name' || h === 'name' || h === 'student name');

        if (aadhaarIdx === -1 || nameIdx === -1) {
          setError('Excel must contain columns: "aadhaar_no" and "full_name" (or "name")');
          return;
        }

        // Parse data rows
        const rows = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          const aadhaar = String(row[aadhaarIdx] || '').trim();
          const name = String(row[nameIdx] || '').trim();

          if (aadhaar || name) {
            rows.push({
              aadhaar_no: aadhaar,
              full_name: name,
              rowIndex: i + 1
            });
          }
        }

        if (rows.length === 0) {
          setError('No valid data rows found');
          return;
        }

        setParsedData(rows);
        setPreviewReady(true);
        validateBulkData(rows);
        
        // Check for existing students
        checkExistingStudents(rows);
      } catch (err) {
        console.error('Parse error:', err);
        setError('Failed to parse Excel file. Please check the format.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // Check existing students in database
  const checkExistingStudents = async (rows) => {
    const aadhaarNumbers = rows.map(r => r.aadhaar_no).filter(a => a);
    if (aadhaarNumbers.length === 0) return;

    setCheckingExisting(true);
    try {
      const response = await axios.get(
        `https://brjobsedu.com/gyandhara/gyandhara_backend/api/school-aadhaar-reg/?school_uni_id=${school_uni_id}`,
        {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      );

      let existingAadhaars = new Set();
      if (response.data.success) {
        const data = Array.isArray(response.data.data) ? response.data.data : response.data.data?.results || [];
        data.forEach(s => {
          if (s.aadhaar_no) existingAadhaars.add(s.aadhaar_no);
        });
      }

      // Mark duplicates in current batch
      const batchDuplicates = new Set();
      aadhaarNumbers.forEach(a => {
        if (existingAadhaars.has(a)) batchDuplicates.add(a);
      });

      setExistingStudents(batchDuplicates);
      
      // Update bulk errors to include existing students
      if (batchDuplicates.size > 0) {
        const existingErrors = [...bulkErrors];
        rows.forEach((row, idx) => {
          if (batchDuplicates.has(row.aadhaar_no)) {
            if (!existingErrors.find(e => e.index === idx)) {
              existingErrors.push({ index: idx, message: 'Already registered' });
            }
          }
        });
        setBulkErrors(existingErrors);
      }
    } catch (err) {
      console.error('Check existing error:', err);
    } finally {
      setCheckingExisting(false);
    }
  };

  // Get filtered data - only new students (not existing)
  const getNewStudents = () => {
    return parsedData.filter(row => !existingStudents.has(row.aadhaar_no));
  };

  // Register only new students
  const handleRegisterNewOnly = async () => {
    const newStudents = getNewStudents();
    if (newStudents.length === 0) {
      setError('No new students to register');
      return;
    }

    console.log('Registering new students:', newStudents.length);
    console.log('school_uni_id:', school_uni_id);
    
    setSubmittingBulk(true);
    setError('');
    setSuccess('');

    const newRowStatuses = newStudents.map((row, idx) => ({
      index: parsedData.findIndex(p => p.aadhaar_no === row.aadhaar_no),
      status: 'pending',
      message: ''
    }));
    setRowStatuses(newRowStatuses);

    for (let i = 0; i < newStudents.length; i++) {
      const row = newStudents[i];
      const originalIndex = parsedData.findIndex(p => p.aadhaar_no === row.aadhaar_no);
      const payload = {
        aadhaar_no: row.aadhaar_no,
        full_name: row.full_name
      };

      console.log(`Registering row ${i + 1}:`, payload);

      try {
        await axios.post(
          `https://brjobsedu.com/gyandhara/gyandhara_backend/api/school-aadhaar-reg/?school_uni_id=${school_uni_id}`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
          }
        );

        setRowStatuses(prev => prev.map(s => 
          s.index === originalIndex ? { ...s, status: 'success', message: 'Registered' } : s
        ));
      } catch (err) {
        console.error(`Row ${i + 1} error:`, err);
        console.error('Error response data:', err.response?.data);
        const isDuplicate = err.response?.data?.errors?.aadhaar_no?.some(e => 
          e.toLowerCase().includes('already exists')
        );
        
        if (isDuplicate) {
          setRowStatuses(prev => prev.map(s => 
            s.index === originalIndex ? { ...s, status: 'skipped', message: 'Already exists' } : s
          ));
        } else {
          const message = err.response?.data?.errors?.aadhaar_no?.[0] || err.response?.data?.errors || 'Failed';
          setRowStatuses(prev => prev.map(s => 
            s.index === originalIndex ? { ...s, status: 'failed', message } : s
          ));
        }
      }
    }

    setSubmittingBulk(false);
    
    const successCount = rowStatuses.filter(s => s.status === 'success').length;
    const skippedCount = rowStatuses.filter(s => s.status === 'skipped').length;
    const failedCount = rowStatuses.filter(s => s.status === 'failed').length;
    
    setSuccess(`Completed: ${successCount} registered, ${skippedCount} already exists, ${failedCount} failed`);
  };

  // Validate bulk data (Aadhaar format and duplicates)
  const validateBulkData = (rows) => {
    const errors = [];
    const aadhaarSet = new Set();
    const duplicates = new Set();

    rows.forEach((row, idx) => {
      // Check empty aadhaar
      if (!row.aadhaar_no) {
        errors.push({ index: idx, message: 'Aadhaar number is required' });
      } else if (!/^\d{12}$/.test(row.aadhaar_no)) {
        errors.push({ index: idx, message: 'Aadhaar must be 12 digits' });
      }

      // Check duplicate within batch
      if (row.aadhaar_no) {
        if (aadhaarSet.has(row.aadhaar_no)) {
          duplicates.add(row.aadhaar_no);
          errors.push({ index: idx, message: 'Duplicate Aadhaar in this batch' });
        } else {
          aadhaarSet.add(row.aadhaar_no);
        }
      }
    });

    setBulkErrors(errors);
  };

  // Submit bulk registration
  const handleBulkSubmit = async () => {
    if (parsedData.length === 0) {
      setError('No data to submit');
      return;
    }

    // Re-validate before submit
    validateBulkData(parsedData);
    if (bulkErrors.length > 0) {
      setError('Please fix errors in the data before submitting');
      return;
    }

    setSubmittingBulk(true);
    setError('');
    setSuccess('');
    setRowStatuses([]);

    const newRowStatuses = parsedData.map((row, idx) => ({
      index: idx,
      status: 'pending',
      message: ''
    }));
    setRowStatuses(newRowStatuses);

    for (let i = 0; i < parsedData.length; i++) {
      const row = parsedData[i];
      const payload = {
        aadhaar_no: row.aadhaar_no,
        full_name: row.full_name
      };

      try {
        await axios.post(
          `https://brjobsedu.com/gyandhara/gyandhara_backend/api/school-aadhaar-reg/?school_uni_id=${school_uni_id}`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
          }
        );

        setRowStatuses(prev => prev.map(s => 
          s.index === i ? { ...s, status: 'success', message: 'Registered' } : s
        ));
      } catch (err) {
        const isDuplicate = err.response?.data?.errors?.aadhaar_no?.some(e => 
          e.toLowerCase().includes('already exists')
        );
        
        if (isDuplicate) {
          setRowStatuses(prev => prev.map(s => 
            s.index === i ? { ...s, status: 'skipped', message: 'Already exists' } : s
          ));
        } else {
          const message = err.response?.data?.errors?.aadhaar_no?.[0] || err.response?.data?.errors || 'Failed';
          setRowStatuses(prev => prev.map(s => 
            s.index === i ? { ...s, status: 'failed', message } : s
          ));
        }
      }
}

    setSubmittingBulk(false);
    
    const successCount = rowStatuses.filter(s => s.status === 'success').length;
    const skippedCount = rowStatuses.filter(s => s.status === 'skipped').length;
    const failedCount = rowStatuses.filter(s => s.status === 'failed').length;
    
    setSuccess(`Completed: ${successCount} registered, ${skippedCount} skipped, ${failedCount} failed`);
  };

   return (
    <div className="dashboard-container">
      <SchoolLeftNav
        sidebarOpen={true}
        setSidebarOpen={() => {}}
        isMobile={false}
        isTablet={false}
      />
      <div className="main-content-dash">
        <SchoolHeader toggleSidebar={() => {}} />

        <Container className="dashboard-box mt-3">
          <Row>
            <Col>
              <Card className="shadow-box">
                <Card.Body>
                  <h4 className="mb-4">Student Aadhaar Registration</h4>

                  {/* Alert Messages */}
                  {error && (
                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                      {success}
                    </Alert>
                  )}

                  {/* Tabs */}
                  <div className="mb-4">
                    <Button
                      variant={activeTab === 'single' ? 'primary' : 'outline-primary'}
                      className="me-2"
                      onClick={() => handleTabChange('single')}
                    >
                      Single Registration
                    </Button>
                    <Button
                      variant={activeTab === 'bulk' ? 'primary' : 'outline-primary'}
                      className="me-2"
                      onClick={() => handleTabChange('bulk')}
                    >
                      Bulk Excel Upload
                    </Button>
                    <Button
                      variant={activeTab === 'list' ? 'primary' : 'outline-primary'}
                      onClick={() => handleTabChange('list')}
                    >
                      View Students
                    </Button>
                  </div>

                  {/* Single Registration Form */}
                  {activeTab === 'single' && (
                    <Form onSubmit={handleSingleSubmit}>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>School ID <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              type="text"
                              value={school_uni_id || ''}
                              disabled
                              placeholder="Auto-filled from your account"
                            />
                            <Form.Text className="text-muted">
                              Automatically filled from your login
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              type="text"
                              name="full_name"
                              value={singleForm.full_name}
                              onChange={handleSingleChange}
                              placeholder="Enter student's full name"
                              isInvalid={!!singleErrors.full_name}
                            />
                            <Form.Control.Feedback type="invalid">
                              {singleErrors.full_name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Aadhaar Number <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              type="text"
                              name="aadhaar_no"
                              value={singleForm.aadhaar_no}
                              onChange={handleSingleChange}
                              placeholder="12-digit Aadhaar number"
                              maxLength={12}
                              isInvalid={!!singleErrors.aadhaar_no}
                            />
                            <Form.Control.Feedback type="invalid">
                              {singleErrors.aadhaar_no}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Button variant="success" type="submit" disabled={loading}>
                        {loading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Registering...
                          </>
                        ) : (
                          'Register Student'
                        )}
                      </Button>
                    </Form>
                  )}

                  {/* Bulk Registration */}
                  {activeTab === 'bulk' && (
                    <div>
                      <div className="mb-4">
                        <Form.Group className="mb-3">
                          <Form.Label>Upload Excel File (.xlsx, .xls, .csv)</Form.Label>
                          <Form.Control
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileChange}
                            disabled={submittingBulk}
                          />
                          <div className="mt-2">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={downloadTemplate}
                              className="me-2"
                            >
                              Download Template
                            </Button>
                          </div>
                          <Form.Text className="text-muted">
                            File must contain columns: "aadhaar_no" and "full_name" (or "name"). 
                            School ID will be auto-attached.
                          </Form.Text>
                          {bulkErrors.length > 0 && (
                            <div className="mt-2 text-danger">
                              {bulkErrors.length} validation error(s) found. Please fix before submitting.
                            </div>
                          )}
                        </Form.Group>
                      </div>

                      {/* Preview Table */}
                      {previewReady && parsedData.length > 0 && (
                        <div className="mt-4">
                          <h5>Preview ({parsedData.length} students)</h5>
                          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <Table striped bordered hover responsive>
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Aadhaar Number</th>
                                  <th>Full Name</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {parsedData.map((row, idx) => {
                                  const rowStatus = rowStatuses.find(s => s.index === idx);
                                  const rowError = bulkErrors.find(e => e.index === idx);
                                  const isExisting = existingStudents.has(row.aadhaar_no);
                                  return (
                                    <tr key={idx}>
                                      <td>{idx + 1}</td>
                                      <td>{row.aadhaar_no}</td>
                                      <td>{row.full_name}</td>
                                      <td>
                                        {submittingBulk ? (
                                          rowStatus ? (
                                            rowStatus.status === 'pending' ? (
                                              <Spinner animation="border" size="sm" />
                                            ) : rowStatus.status === 'success' ? (
                                              <span className="text-success">✓ {rowStatus.message}</span>
                                            ) : rowStatus.status === 'skipped' ? (
                                              <span className="text-warning">⚠ {rowStatus.message}</span>
                                            ) : (
                                              <span className="text-danger">✗ {rowStatus.message}</span>
                                            )
                                          ) : null
                                        ) : isExisting ? (
                                          <span className="text-warning">⚠ Already registered</span>
                                        ) : rowError ? (
                                          <span className="text-danger">✗ {rowError.message}</span>
                                        ) : (
                                          <span className="text-success">✓ New</span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </Table>
                          </div>

                          {checkingExisting && (
                            <div className="mt-3">
                              <Spinner animation="border" size="sm" />
                              <span className="ms-2">Checking for existing students...</span>
                            </div>
                          )}

                          {!submittingBulk && !checkingExisting && existingStudents.size > 0 && (
                            <div className="mt-3 alert alert-info">
                              <strong>{existingStudents.size} students already registered.</strong>
                              <p className="mb-2">Only {getNewStudents().length} new students will be registered.</p>
                              <Button 
                                variant="success" 
                                onClick={handleRegisterNewOnly}
                                disabled={getNewStudents().length === 0}
                              >
                                Register {getNewStudents().length} New Students Only
                              </Button>
                            </div>
                          )}

                          {!submittingBulk && !checkingExisting && existingStudents.size === 0 && (
                            <Button 
                              variant="success" 
                              onClick={handleBulkSubmit}
                              disabled={bulkErrors.length > 0}
                              className="mt-3"
                            >
                              Submit All
                            </Button>
                          )}

                          {submittingBulk && (
                            <div className="mt-3">
                              <Spinner animation="border" />
                              <span className="ms-2">Processing bulk upload...</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* View Students Tab */}
                  {activeTab === 'list' && (
                    <div className="mt-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Students List ({totalStudents} total)</h5>
                        {selectedIds.length > 0 && (
                          <Button variant="danger" size="sm" onClick={handleDeleteMultiple}>
                            Delete Selected ({selectedIds.length})
                          </Button>
                        )}
                      </div>

                      {studentsLoading ? (
                        <div className="text-center py-4">
                          <Spinner animation="border" />
                          <p className="mt-2">Loading students...</p>
                        </div>
                      ) : students.length === 0 ? (
                        <Alert variant="info">No students registered yet.</Alert>
                      ) : (
                        <>
                          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <Table striped bordered hover responsive>
                              <thead>
                                <tr>
                                  <th>
                                    <Form.Check
                                      type="checkbox"
                                      checked={selectedIds.length === students.length && students.length > 0}
                                      onChange={toggleSelectAll}
                                    />
                                  </th>
                                  <th>#</th>
                                  <th>Aadhaar Number</th>
                                  <th>Full Name</th>
                                  <th>School Name</th>
                                  <th>Created At</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {students.map((student, idx) => (
                                  <tr key={student.id}>
                                    <td>
                                      <Form.Check
                                        type="checkbox"
                                        checked={selectedIds.includes(student.id)}
                                        onChange={() => toggleSelect(student.id)}
                                      />
                                    </td>
                                    <td>{(currentPage - 1) * recordsPerPage + idx + 1}</td>
                                    <td>{student.aadhaar_no}</td>
                                    <td>{student.full_name}</td>
                                    <td>{student.school_name || '-'}</td>
                                    <td>{student.created_at ? new Date(student.created_at).toLocaleDateString() : '-'}</td>
                                    <td>
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEditClick(student)}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteClick(student.id)}
                                      >
                                        Delete
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                          {totalPages > 1 && (
                            <Pagination className="mt-3">{renderPagination()}</Pagination>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                value={editForm.full_name}
                onChange={handleEditChange}
                placeholder="Enter full name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Aadhaar Number</Form.Label>
              <Form.Control
                type="text"
                name="aadhaar_no"
                value={editForm.aadhaar_no}
                onChange={handleEditChange}
                placeholder="12-digit Aadhaar"
                maxLength={12}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit} disabled={editLoading}>
            {editLoading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deletingMultiple ? (
            <p>Are you sure you want to delete {selectedIds.length} selected students? This action cannot be undone.</p>
          ) : (
            <p>Are you sure you want to delete this student? This action cannot be undone.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleteLoading}>
            {deleteLoading ? <Spinner animation="border" size="sm" /> : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentRegistration;
