import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Modal, Form, Image } from 'react-bootstrap';
import AdminLeftNav from './AdminLeftNav';
import axios from 'axios';
import { useAuth } from '../all_login/AuthContext';
import AdminHeader from "./AdminHeader";
import '../../assets/css/Enrollments.css';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaUserTie } from 'react-icons/fa';
const BASE_URL = 'https://brjobsedu.com/gyandhara/gyandhara_backend';

const API_URL = 'https://brjobsedu.com/gyandhara/gyandhara_backend/api/counseulor/';

const ManageCounselors = () => {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const [counselors, setCounselors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCounselor, setSelectedCounselor] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        co_img: null,
    });

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getAuthConfig = () => ({
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const fetchCounselors = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL, getAuthConfig());
            if (response.data && response.data.success) {
                setCounselors(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching counselors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchCounselors();
        }
    }, [accessToken]);

    const handleShowModal = (counselor = null) => {
        if (counselor) {
            setIsEditing(true);
            setSelectedCounselor(counselor);
            setFormData({
                name: counselor.name,
                description: counselor.description,
                co_img: null, // We don't pre-fill file inputs
            });
        } else {
            setIsEditing(false);
            setSelectedCounselor(null);
            setFormData({ name: '', description: '', co_img: null });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCounselor(null);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, co_img: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const submissionData = new FormData();
        submissionData.append('name', formData.name);
        submissionData.append('description', formData.description);
        if (formData.co_img) {
            submissionData.append('co_img', formData.co_img);
        }

        try {
            if (isEditing) {
                submissionData.append('counseulor_id', selectedCounselor.counseulor_id);
                await axios.put(API_URL, submissionData, {
                    headers: { ...getAuthConfig().headers, 'Content-Type': 'multipart/form-data' }
                });
                alert('Counselor updated successfully!');
            } else {
                await axios.post(API_URL, submissionData, {
                    headers: { ...getAuthConfig().headers, 'Content-Type': 'multipart/form-data' }
                });
                alert('Counselor added successfully!');
            }
            fetchCounselors();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving counselor:', error.response?.data || error.message);
            alert('Failed to save counselor.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (counselor) => {
        setSelectedCounselor(counselor);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(API_URL, {
                data: { counseulor_id: selectedCounselor.counseulor_id },
                ...getAuthConfig()
            });
            alert('Counselor deleted successfully!');
            fetchCounselors();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting counselor:', error);
            alert('Failed to delete counselor.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <AdminLeftNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} isTablet={isTablet} />
                <div className="main-content-dash">
                    <AdminHeader toggleSidebar={toggleSidebar} />
                    <div className="dashboard-content"><Container fluid className="dashboard-box"><div className="loading-spinner"><Spinner animation="border" variant="primary" /></div></Container></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="dashboard-container">
                <AdminLeftNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} isTablet={isTablet} />
                <div className="main-content-dash">
                    <AdminHeader toggleSidebar={toggleSidebar} />
                    <div className="dashboard-content">
                        <Container fluid className="dashboard-box">
                            <div className="d-flex justify-content-between align-items-center mb-4 page-header">
                                <div className="d-flex align-items-center all-en-box gap-3">
                                    <Button variant="outline-secondary" size="sm" onClick={() => navigate('/AdminDashboard')} className="me-2"><FaArrowLeft /> Dashboard</Button>
                                    <h4 className="mb-0">Manage Counselors</h4>
                                </div>
                                <Button variant="primary" onClick={() => handleShowModal()}><FaPlus className="me-1" /> Add New Counselor</Button>
                            </div>

                            <Card className="enrollments-table-card border">
                                <Card.Header className="bg-light border-bottom py-2 px-3 d-flex justify-content-between align-items-center flex-wrap">
                                    <h5 className="mb-0 fw-semibold text-secondary">All Counselors ({counselors.length})</h5>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <Table hover className="custom-table align-middle mb-0">
                                            <thead className="table-light custom-table">
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Image</th>
                                                    <th>Name</th>
                                                    <th>Description</th>
                                                    <th>Created</th>
                                                    <th className="text-end">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {counselors.length === 0 ? (
                                                    <tr><td colSpan="6" className="text-center py-4 text-muted">No counselors found.</td></tr>
                                                ) : (
                                                    counselors.map((c) => (
                                                        <tr key={c.counseulor_id}>
                                                            <td><span className="text-muted small fw-medium">{c.counseulor_id}</span></td>
                                                            <td>
                                                                <Image 
                                                                    src={c.co_img ? `${BASE_URL}${c.co_img}` : 'https://via.placeholder.com/50'} 
                                                                    roundedCircle 
                                                                    width="40" height="40" style={{ objectFit: 'cover' }} 
                                                                />
                                                            </td>
                                                            <td className="fw-medium text-dark">{c.name}</td>
                                                            <td className="small text-truncate" style={{ maxWidth: '300px' }}>{c.description}</td>
                                                            <td className="small">{formatDate(c.created)}</td>
                                                            <td className="text-end">
                                                                <div className="d-flex gap-1 justify-content-end">
                                                                    <Button variant="outline-warning" size="sm" onClick={() => handleShowModal(c)} title="Edit"><FaEdit /></Button>
                                                                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(c)} title="Delete"><FaTrash /></Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Container>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit' : 'Add'} Counselor</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Name *</Form.Label>
                            <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter counselor's name" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description *</Form.Label>
                            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter description" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" name="co_img" onChange={handleFileChange} accept="image/*" />
                            {isEditing && selectedCounselor?.co_img && (
                                <div className="mt-2">
                                    <small>Current Image:</small>
                                    <Image src={`${BASE_URL}${selectedCounselor.co_img}`} width="80" className="d-block" />
                                </div>
                            )}
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={submitting}>
                            {submitting ? <Spinner as="span" animation="border" size="sm" /> : (isEditing ? 'Update' : 'Add')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete the counselor "<strong>{selectedCounselor?.name}</strong>"?</p>
                    <p className="text-muted small">This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}><FaTrash className="me-1" /> Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ManageCounselors;