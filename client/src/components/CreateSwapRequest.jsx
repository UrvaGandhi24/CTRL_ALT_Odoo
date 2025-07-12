import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './CreateSwapRequest.css';

const CreateSwapRequest = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [targetUser, setTargetUser] = useState(null);
    const [formData, setFormData] = useState({
        skillOffered: { name: '', description: '' },
        skillWanted: { name: '', description: '' },
        message: '',
        proposedDate: '',
        duration: '1 hour'
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { userId } = useParams();
    const navigate = useNavigate();

    const durationOptions = [
        '30 minutes',
        '1 hour',
        '1.5 hours',
        '2 hours',
        '3 hours',
        'Half day',
        'Full day',
        'Multiple sessions'
    ];

    useEffect(() => {
        fetchData();
    }, [userId]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [currentUserResponse, targetUserResponse] = await Promise.all([
                axios.get('http://localhost:3334/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`http://localhost:3334/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setCurrentUser(currentUserResponse.data);
            setTargetUser(targetUserResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else if (error.response?.status === 404 || error.response?.status === 403) {
                alert('User not found or profile is private');
                navigate('/search');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.skillOffered.name || !formData.skillWanted.name || !formData.message) {
            alert('Please fill in all required fields');
            return;
        }

        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const requestData = {
                requestedUserId: userId,
                skillOffered: formData.skillOffered,
                skillWanted: formData.skillWanted,
                message: formData.message,
                proposedDate: formData.proposedDate || null,
                duration: formData.duration
            };

            await axios.post('http://localhost:3334/api/swaps', requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Swap request sent successfully!');
            navigate('/swaps');
        } catch (error) {
            console.error('Error creating swap request:', error);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Failed to send swap request. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading...</p>
                </div>
            </div>
        );
    }

    if (!targetUser || !currentUser) {
        return (
            <div className="error-container">
                <div className="error-content">
                    <h2 className="error-title">Unable to load user data</h2>
                    <p className="error-description">We couldn't find the user or load your profile information.</p>
                    <Link to="/search" className="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Back to Search
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="create-swap-container">
            {/* Background Animation */}
            <div className="create-swap-bg">
                <div className="floating-shape shape-1"></div>
                <div className="floating-shape shape-2"></div>
                <div className="floating-shape shape-3"></div>
                <div className="floating-shape shape-4"></div>
            </div>

            {/* Navigation */}
            <nav className="nav">
                <div className="nav-container">
                    <Link to="/dashboard" className="nav-brand">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{marginRight: '8px'}}>
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        SkillSwap
                    </Link>
                    <div className="nav-links">
                        <Link to="/dashboard" className="nav-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '6px'}}>
                                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Dashboard
                        </Link>
                        <Link to="/search" className="nav-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '6px'}}>
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Browse Skills
                        </Link>
                        <Link to="/swaps" className="nav-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '6px'}}>
                                <path d="M17 16L21 12L17 8" stroke="currentColor" strokeWidth="2"/>
                                <path d="M21 12H9" stroke="currentColor" strokeWidth="2"/>
                                <path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="2"/>
                                <path d="M3 12H15" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            My Swaps
                        </Link>
                        <Link to="/profile" className="nav-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '6px'}}>
                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Profile
                        </Link>
                        <button onClick={handleLogout} className="nav-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '6px'}}>
                                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2"/>
                                <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="create-swap-main">
                {/* Back Button */}
                <Link to={`/user/${userId}`} className="back-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Back to Profile
                </Link>

                {/* Header */}
                <div className="header-section">
                    <h1 className="page-title">Request Skill Swap</h1>
                    <p className="page-subtitle">
                        Send a swap request to <span className="highlight">{targetUser.fullName}</span>
                    </p>
                </div>

                {/* Target User Info */}
                <div className="user-info-card">
                    <div className="user-info-content">
                        <img
                            src={targetUser.profilePhoto || '/default-avatar.png'}
                            alt={targetUser.fullName}
                            className="user-avatar"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNSIgcj0iNiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAgMzJDMzAgMjYuNDc3MSAyNS41MjI5IDIyIDIwIDIyQzE0LjQ3NzEgMjIgMTAgMjYuNDc3MSAxMCAzMkgzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                            }}
                        />
                        <div className="user-details">
                            <h3>{targetUser.fullName}</h3>
                            <p>@{targetUser.username}</p>
                        </div>
                    </div>
                </div>

                {/* Swap Request Form */}
                <form onSubmit={handleSubmit} className="swap-form space-y-6">
                    {/* Skill You're Offering */}
                    <div className="form-section">
                        <div className="section-header offering">
                            <h2 className="section-title offering">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                Skill I Can Offer
                            </h2>
                            <p className="section-subtitle">Choose one of your skills to offer in exchange</p>
                        </div>
                        <div className="section-body space-y-4">
                            <div className="form-group">
                                <label className="form-label required">Skill Name</label>
                                <select
                                    name="skillOffered.name"
                                    value={formData.skillOffered.name}
                                    onChange={handleInputChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select a skill you can offer</option>
                                    {currentUser.skillsOffered?.map((skill, index) => (
                                        <option key={index} value={skill.name}>
                                            {skill.name} ({skill.level})
                                        </option>
                                    ))}
                                </select>
                                {currentUser.skillsOffered?.length === 0 && (
                                    <p className="form-help warning">
                                        You haven't added any skills yet. <Link to="/profile">Update your profile</Link> to add skills.
                                    </p>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Additional Details</label>
                                <textarea
                                    name="skillOffered.description"
                                    value={formData.skillOffered.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe what you can teach or help with..."
                                    className="form-textarea"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Skill You Want */}
                    <div className="form-section">
                        <div className="section-header wanting">
                            <h2 className="section-title wanting">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L13.5 7.5L19 9L14.5 13.5L16 19L12 16L8 19L9.5 13.5L5 9L10.5 7.5L12 2Z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                Skill I Want to Learn
                            </h2>
                            <p className="section-subtitle">Choose from {targetUser.fullName}'s available skills</p>
                        </div>
                        <div className="section-body space-y-4">
                            <div className="form-group">
                                <label className="form-label required">Skill Name</label>
                                <select
                                    name="skillWanted.name"
                                    value={formData.skillWanted.name}
                                    onChange={handleInputChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select a skill you want to learn</option>
                                    {targetUser.skillsOffered?.map((skill, index) => (
                                        <option key={index} value={skill.name}>
                                            {skill.name} ({skill.level})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Why You Want to Learn This</label>
                                <textarea
                                    name="skillWanted.description"
                                    value={formData.skillWanted.description}
                                    onChange={handleInputChange}
                                    placeholder="Explain your goals and what you hope to achieve..."
                                    className="form-textarea"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Message & Details */}
                    <div className="form-section">
                        <div className="section-header details">
                            <h2 className="section-title details">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                Message & Details
                            </h2>
                            <p className="section-subtitle">Provide additional information about your swap request</p>
                        </div>
                        <div className="section-body space-y-4">
                            <div className="form-group">
                                <label className="form-label required">Personal Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Introduce yourself and explain why you'd like to swap skills..."
                                    className="form-textarea"
                                    rows={4}
                                    required
                                    maxLength={1000}
                                />
                                <div className={`character-counter ${formData.message.length > 800 ? 'warning' : ''} ${formData.message.length > 950 ? 'danger' : ''}`}>
                                    {formData.message.length}/1000 characters
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Proposed Date (Optional)</label>
                                    <input
                                        type="date"
                                        name="proposedDate"
                                        value={formData.proposedDate}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Expected Duration</label>
                                    <select
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        {durationOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <Link to={`/user/${userId}`} className="btn btn-outline">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2"/>
                                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting || !currentUser.skillsOffered?.length}
                            className="btn btn-primary"
                        >
                            {submitting ? (
                                <>
                                    <div className="btn-spinner"></div>
                                    Sending Request...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2"/>
                                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    Send Swap Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSwapRequest;
