import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p>Loading your profile...</p>
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
                        <Link to="/profile" className="nav-item active">Profile</Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="nav-item">Admin</Link>
                        )}
                        <button onClick={handleLogout} className="nav-item">Logout</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
                        <p className="text-gray-600">Manage your skills and preferences</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-xl font-semibold">Basic Information</h2>
                            </div>
                            <div className="card-body space-y-4">
                                <div className="grid grid-1 md:grid-2 gap-4">
                                    
                                    <div className="form-group">
                                        <label className="form-label">Location (Optional)</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="e.g., New York, NY"
                                            className="input"
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
                                        className="textarea"
                                        rows={4}
                                    />
                                    <p className="form-help">
                                        {formData.bio.length}/500 characters
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Skills Offered */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-xl font-semibold">Skills I Can Offer</h2>
                            </div>
                            <div className="card-body space-y-4">
                                {/* Current Skills */}
                                <div className="space-y-3">
                                    {formData.skillsOffered.map((skill, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                                            <div>
                                                <h4 className="font-medium">{skill.name}</h4>
                                                <p className="text-sm text-gray-600">{skill.description}</p>
                                                <span className="skill-badge skill-badge-offered">{skill.level}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSkillOffered(index)}
                                                className="btn btn-danger text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Add New Skill */}
                                <div className="border-t pt-4">
                                    <h3 className="font-medium mb-3">Add New Skill</h3>
                                    <div className="grid grid-1 md:grid-3 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                value={newSkillOffered.name}
                                                onChange={(e) => setNewSkillOffered(prev => ({
                                                    ...prev,
                                                    name: e.target.value
                                                }))}
                                                placeholder="Skill name"
                                                className="input"
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
                                                className="input"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <select
                                                value={newSkillOffered.level}
                                                onChange={(e) => setNewSkillOffered(prev => ({
                                                    ...prev,
                                                    level: e.target.value
                                                }))}
                                                className="select flex-1"
                                            >
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                                <option value="Expert">Expert</option>
                                            </select>
                                            <button
                                                type="button"
                                                onClick={addSkillOffered}
                                                className="btn btn-primary"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skills Wanted */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-xl font-semibold">Skills I Want to Learn</h2>
                            </div>
                            <div className="card-body space-y-4">
                                {/* Current Skills */}
                                <div className="space-y-3">
                                    {formData.skillsWanted.map((skill, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                                            <div>
                                                <h4 className="font-medium">{skill.name}</h4>
                                                <p className="text-sm text-gray-600">{skill.description}</p>
                                                <span className="skill-badge skill-badge-wanted">{skill.priority} Priority</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSkillWanted(index)}
                                                className="btn btn-danger text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Add New Skill */}
                                <div className="border-t pt-4">
                                    <h3 className="font-medium mb-3">Add New Skill</h3>
                                    <div className="grid grid-1 md:grid-3 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                value={newSkillWanted.name}
                                                onChange={(e) => setNewSkillWanted(prev => ({
                                                    ...prev,
                                                    name: e.target.value
                                                }))}
                                                placeholder="Skill name"
                                                className="input"
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
                                                className="input"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <select
                                                value={newSkillWanted.priority}
                                                onChange={(e) => setNewSkillWanted(prev => ({
                                                    ...prev,
                                                    priority: e.target.value
                                                }))}
                                                className="select flex-1"
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                            <button
                                                type="button"
                                                onClick={addSkillWanted}
                                                className="btn btn-primary"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Availability & Settings */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-xl font-semibold">Availability & Settings</h2>
                            </div>
                            <div className="card-body space-y-4">
                                <div>
                                    <label className="form-label">When are you available for skill swaps?</label>
                                    <div className="grid grid-1 sm:grid-2 md:grid-3 gap-2 mt-2">
                                        {availabilityOptions.map((option) => (
                                            <label key={option} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.availability.includes(option)}
                                                    onChange={() => handleAvailabilityChange(option)}
                                                    className="rounded"
                                                />
                                                <span className="text-sm">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="isProfilePublic"
                                        checked={formData.isProfilePublic}
                                        onChange={handleInputChange}
                                        className="rounded"
                                    />
                                    <label className="form-label mb-0">
                                        Make my profile public (others can find and contact me)
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end space-x-4">
                            <Link to="/dashboard" className="btn btn-outline">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="btn btn-primary"
                            >
                                {saving ? (
                                    <div className="flex items-center">
                                        <div className="spinner mr-2"></div>
                                        Saving...
                                    </div>
                                ) : (
                                    'Save Profile'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
