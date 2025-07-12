import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

// Mock authentication for development/demo
const createMockAuth = () => {
	if (!localStorage.getItem('token')) {
		localStorage.setItem('token', 'mock-auth-token-12345');
		localStorage.setItem('mockUser', JSON.stringify({
			_id: 'mock-user-123',
			fullName: 'Demo User',
			username: 'demouser',
			email: 'demo@example.com',
			location: 'New York, NY',
			bio: 'I am a passionate developer looking to exchange skills with others.',
			isAdmin: true,
			skillsOffered: [
				{ name: 'JavaScript', description: 'Frontend development', level: 'Advanced' },
				{ name: 'React', description: 'Modern UI development', level: 'Intermediate' }
			],
			skillsWanted: [
				{ name: 'Python', description: 'Backend development', priority: 'High' },
				{ name: 'Design', description: 'UI/UX design skills', priority: 'Medium' }
			],
			availability: ['Weekends Morning', 'Weekdays Evening'],
			isProfilePublic: true
		}));
	}
};

const Profile = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        location: '',
        bio: '',
        skillsOffered: [],
        skillsWanted: [],
        availability: [],
        isProfilePublic: true
    });
    const [isEditing, setIsEditing] = useState(false);
    
    const [newSkillOffered, setNewSkillOffered] = useState({ name: '', description: '', level: 'Intermediate' });
    const [newSkillWanted, setNewSkillWanted] = useState({ name: '', description: '', priority: 'Medium' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const availabilityOptions = [
        'Weekdays Morning',
        'Weekdays Afternoon',
        'Weekdays Evening',
        'Weekends Morning',
        'Weekends Afternoon',
        'Weekends Evening'
    ];
    const toggleEditMode = () => {
	setIsEditing(prev => !prev);
};

    useEffect(() => {
        createMockAuth(); // Ensure mock auth is set up
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3334/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userData = response.data;
            setUser(userData);
            setFormData({
                location: userData.location || '',
                bio: userData.bio || '',
                skillsOffered: userData.skillsOffered || [],
                skillsWanted: userData.skillsWanted || [],
                availability: userData.availability || [],
                isProfilePublic: userData.isProfilePublic !== undefined ? userData.isProfilePublic : true
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            // For demo mode, use mock user data
            const mockUser = JSON.parse(localStorage.getItem('mockUser') || '{}');
            if (mockUser._id) {
                setUser(mockUser);
                setFormData({
                    location: mockUser.location || '',
                    bio: mockUser.bio || '',
                    skillsOffered: mockUser.skillsOffered || [],
                    skillsWanted: mockUser.skillsWanted || [],
                    availability: mockUser.availability || [],
                    isProfilePublic: mockUser.isProfilePublic !== undefined ? mockUser.isProfilePublic : true
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAvailabilityChange = (option) => {
        setFormData(prev => ({
            ...prev,
            availability: prev.availability.includes(option)
                ? prev.availability.filter(a => a !== option)
                : [...prev.availability, option]
        }));
    };

    const addSkillOffered = () => {
        if (!newSkillOffered.name.trim()) return;

        setFormData(prev => ({
            ...prev,
            skillsOffered: [...prev.skillsOffered, { ...newSkillOffered }]
        }));
        setNewSkillOffered({ name: '', description: '', level: 'Intermediate' });
    };

    const removeSkillOffered = (index) => {
        setFormData(prev => ({
            ...prev,
            skillsOffered: prev.skillsOffered.filter((_, i) => i !== index)
        }));
    };

    const addSkillWanted = () => {
        if (!newSkillWanted.name.trim()) return;

        setFormData(prev => ({
            ...prev,
            skillsWanted: [...prev.skillsWanted, { ...newSkillWanted }]
        }));
        setNewSkillWanted({ name: '', description: '', priority: 'Medium' });
    };

    const removeSkillWanted = (index) => {
        setFormData(prev => ({
            ...prev,
            skillsWanted: prev.skillsWanted.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:3334/api/users/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Profile updated successfully!');
            setUser(response.data.user);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="floating-element"></div>
            <div className="floating-element"></div>
            <div className="floating-element"></div>
            <div className="floating-element"></div>
            
            {/* Navigation */}
            <nav className="profile-nav">
                <div className="nav-container">
                    <Link to="/dashboard" className="nav-brand">
                        <span style={{ marginRight: '8px' }}>📚</span>
                        SkillSwap Platform
                    </Link>
                    <div className="nav-links">
                        <Link to="/dashboard" className="nav-item">📊 Dashboard</Link>
                        <Link to="/search" className="nav-item">🔍 Browse Skills</Link>
                        <Link to="/swaps" className="nav-item">🔄 My Swaps</Link>
                        <Link to="/profile" className="nav-item active">👤 Profile</Link>
                        {user?.isAdmin && (
                            <Link to="/admin" className="nav-item">⚙️ Admin</Link>
                        )}
                        <button onClick={handleLogout} className="nav-item">🚪 Logout</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="profile-content">
                <div className="content-wrapper">
                    <div className="profile-header">
                        <h1 className="profile-title">Your Profile</h1>
                        <p className="profile-subtitle">Manage your skills and preferences</p>
                    </div>

                    <form onSubmit={handleSubmit} className="profile-form">
                        {/* Basic Information */}
                        <div className="profile-card">
                            <div className="card-header">
                                <h2 className="card-title">📝 Basic Information</h2>
                            </div>
                            <div className="card-body">
                                <div className="form-grid form-grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Location (Optional)</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="e.g., New York, NY"
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Tell others about yourself and your interests..."
                                        className="form-textarea"
                                        rows={4}
                                    />
                                    <p className="form-help">
                                        {formData.bio.length}/500 characters
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Skills Offered */}
                        <div className="profile-card">
                            <div className="card-header">
                                <h2 className="card-title">🎯 Skills I Can Offer</h2>
                            </div>
                            <div className="card-body">
                                {/* Current Skills */}
                                <div className="form-grid">
                                    {formData.skillsOffered.map((skill, index) => (
                                        <div key={index} className="skill-item offered">
                                            <div className="skill-info">
                                                <h4>{skill.name}</h4>
                                                <p>{skill.description}</p>
                                                <span className="skill-badge offered">{skill.level}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSkillOffered(index)}
                                                className="btn btn-danger"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Add New Skill */}
                                <div className="add-skill-section">
                                    <h3 className="add-skill-title">Add New Skill</h3>
                                    <div className="form-grid form-grid-3">
                                        <div>
                                            <input
                                                type="text"
                                                value={newSkillOffered.name}
                                                onChange={(e) => setNewSkillOffered(prev => ({
                                                    ...prev,
                                                    name: e.target.value
                                                }))}
                                                placeholder="Skill name"
                                                className="form-input"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                value={newSkillOffered.description}
                                                onChange={(e) => setNewSkillOffered(prev => ({
                                                    ...prev,
                                                    description: e.target.value
                                                }))}
                                                placeholder="Brief description"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="add-skill-form">
                                            <select
                                                value={newSkillOffered.level}
                                                onChange={(e) => setNewSkillOffered(prev => ({
                                                    ...prev,
                                                    level: e.target.value
                                                }))}
                                                className="form-select"
                                                style={{ flex: 1 }}
                                            >
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                                <option value="Expert">Expert</option>
                                            </select>
                                            <button
                                                type="button"
                                                onClick={addSkillOffered}
                                                className="btn btn-add"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skills Wanted */}
                        <div className="profile-card">
                            <div className="card-header">
                                <h2 className="card-title">📚 Skills I Want to Learn</h2>
                            </div>
                            <div className="card-body">
                                {/* Current Skills */}
                                <div className="form-grid">
                                    {formData.skillsWanted.map((skill, index) => (
                                        <div key={index} className="skill-item wanted">
                                            <div className="skill-info">
                                                <h4>{skill.name}</h4>
                                                <p>{skill.description}</p>
                                                <span className="skill-badge wanted">{skill.priority} Priority</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSkillWanted(index)}
                                                className="btn btn-danger"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Add New Skill */}
                                <div className="add-skill-section">
                                    <h3 className="add-skill-title">Add New Skill</h3>
                                    <div className="form-grid form-grid-3">
                                        <div>
                                            <input
                                                type="text"
                                                value={newSkillWanted.name}
                                                onChange={(e) => setNewSkillWanted(prev => ({
                                                    ...prev,
                                                    name: e.target.value
                                                }))}
                                                placeholder="Skill name"
                                                className="form-input"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                value={newSkillWanted.description}
                                                onChange={(e) => setNewSkillWanted(prev => ({
                                                    ...prev,
                                                    description: e.target.value
                                                }))}
                                                placeholder="Why you want to learn this"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="add-skill-form">
                                            <select
                                                value={newSkillWanted.priority}
                                                onChange={(e) => setNewSkillWanted(prev => ({
                                                    ...prev,
                                                    priority: e.target.value
                                                }))}
                                                className="form-select"
                                                style={{ flex: 1 }}
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                            <button
                                                type="button"
                                                onClick={addSkillWanted}
                                                className="btn btn-add"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Availability & Settings */}
                        <div className="profile-card">
                            <div className="card-header">
                                <h2 className="card-title">⏰ Availability & Settings</h2>
                            </div>
                            <div className="card-body">
                                <div>
                                    <label className="form-label">When are you available for skill swaps?</label>
                                    <div className="availability-grid">
                                        {availabilityOptions.map((option) => (
                                            <label key={option} className="availability-option">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.availability.includes(option)}
                                                    onChange={() => handleAvailabilityChange(option)}
                                                    className="availability-checkbox"
                                                />
                                                <span className="availability-label">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="settings-option">
                                    <input
                                        type="checkbox"
                                        name="isProfilePublic"
                                        checked={formData.isProfilePublic}
                                        onChange={handleInputChange}
                                        className="settings-checkbox"
                                    />
                                    <label className="settings-label">
                                        Make my profile public (others can find and contact me)
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="action-buttons">
                            <Link to="/dashboard" className="btn btn-outline">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className={`btn btn-primary ${saving ? 'btn-loading' : ''}`}
                            >
                                {saving ? 'Saving...' : '💾 Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
