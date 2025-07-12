import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!targetUser || !currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to load user data</h2>
                    <Link to="/search" className="btn btn-primary">
                        Back to Search
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="nav">
                <div className="container nav-container">
                    <Link to="/dashboard" className="nav-brand">
                        Skill Swap Platform
                    </Link>
                    <div className="nav-links">
                        <Link to="/dashboard" className="nav-item">Dashboard</Link>
                        <Link to="/search" className="nav-item">Browse Skills</Link>
                        <Link to="/swaps" className="nav-item">My Swaps</Link>
                        <Link to="/profile" className="nav-item">Profile</Link>
                        <button onClick={handleLogout} className="nav-item">Logout</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            to={`/user/${userId}`}
                            className="btn btn-outline"
                        >
                            ← Back to Profile
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Request Skill Swap
                        </h1>
                        <p className="text-gray-600">
                            Send a swap request to <span className="font-semibold">{targetUser.fullName}</span>
                        </p>
                    </div>

                    {/* Target User Info */}
                    <div className="card mb-8">
                        <div className="card-body">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={targetUser.profilePhoto || '/default-avatar.png'}
                                    alt={targetUser.fullName}
                                    className="profile-photo"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNSIgcj0iNiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAgMzJDMzAgMjYuNDc3MSAyNS41MjI5IDIyIDIwIDIyQzE0LjQ3NzEgMjIgMTAgMjYuNDc3MSAxMCAzMkgzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                    }}
                                />
                                <div>
                                    <h3 className="font-semibold text-lg">{targetUser.fullName}</h3>
                                    <p className="text-gray-600">@{targetUser.username}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Swap Request Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Skill You're Offering */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-xl font-semibold text-green-700">
                                    Skill I Can Offer
                                </h2>
                                <p className="text-sm text-gray-600">Choose one of your skills to offer in exchange</p>
                            </div>
                            <div className="card-body space-y-4">
                                <div className="form-group">
                                    <label className="form-label">Skill Name *</label>
                                    <select
                                        name="skillOffered.name"
                                        value={formData.skillOffered.name}
                                        onChange={handleInputChange}
                                        className="select"
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
                                        <p className="form-help text-orange-600">
                                            You haven't added any skills yet. <Link to="/profile" className="text-blue-600">Update your profile</Link> to add skills.
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
                                        className="textarea"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Skill You Want */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-xl font-semibold text-blue-700">
                                    Skill I Want to Learn
                                </h2>
                                <p className="text-sm text-gray-600">Choose from {targetUser.fullName}'s available skills</p>
                            </div>
                            <div className="card-body space-y-4">
                                <div className="form-group">
                                    <label className="form-label">Skill Name *</label>
                                    <select
                                        name="skillWanted.name"
                                        value={formData.skillWanted.name}
                                        onChange={handleInputChange}
                                        className="select"
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
                                        className="textarea"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Message & Details */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-xl font-semibold">Message & Details</h2>
                            </div>
                            <div className="card-body space-y-4">
                                <div className="form-group">
                                    <label className="form-label">Personal Message *</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Introduce yourself and explain why you'd like to swap skills..."
                                        className="textarea"
                                        rows={4}
                                        required
                                    />
                                    <p className="form-help">
                                        {formData.message.length}/1000 characters
                                    </p>
                                </div>

                                <div className="grid grid-1 md:grid-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">Proposed Date (Optional)</label>
                                        <input
                                            type="date"
                                            name="proposedDate"
                                            value={formData.proposedDate}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Expected Duration</label>
                                        <select
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            className="select"
                                        >
                                            {durationOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end space-x-4">
                            <Link
                                to={`/user/${userId}`}
                                className="btn btn-outline"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting || !currentUser.skillsOffered?.length}
                                className="btn btn-primary"
                            >
                                {submitting ? (
                                    <div className="flex items-center">
                                        <div className="spinner mr-2"></div>
                                        Sending Request...
                                    </div>
                                ) : (
                                    'Send Swap Request'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateSwapRequest;
