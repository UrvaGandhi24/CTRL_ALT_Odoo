import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, [id]);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3334/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else if (error.response?.status === 404) {
                alert('User not found');
                navigate('/search');
            } else if (error.response?.status === 403) {
                alert('This profile is private');
                navigate('/search');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="user-profile-container">
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="user-profile-container">
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                
                <div className="not-found-container">
                    <h2 className="not-found-title">Profile not found</h2>
                    <Link to="/search" className="btn btn-primary">
                        Back to Search
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="user-profile-container">
            <div className="floating-element"></div>
            <div className="floating-element"></div>
            <div className="floating-element"></div>
            <div className="floating-element"></div>
            
            {/* Navigation */}
            <nav className="user-profile-nav">
                <div className="nav-container">
                    <Link to="/dashboard" className="nav-brand">
                        ✨ SkillSwap
                    </Link>
                    <div className="nav-links">
                        <Link to="/dashboard" className="nav-item">🏠 Dashboard</Link>
                        <Link to="/search" className="nav-item">🔍 Browse Skills</Link>
                        <Link to="/swaps" className="nav-item">🔄 My Swaps</Link>
                        <Link to="/profile" className="nav-item">👤 Profile</Link>
                        <button onClick={handleLogout} className="nav-item">🚪 Logout</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="user-profile-content">
                <div className="content-wrapper">
                    {/* Back Button */}
                    <Link to="/search" className="back-button">
                        ← Back to Search
                    </Link>

                    {/* Profile Header */}
                    <div className="user-profile-card">
                        <div className="card-body">
                            <div className="profile-header">
                                <div className="profile-info-container">
                                    <img
                                        src={user.profilePhoto || '/default-avatar.png'}
                                        alt={user.fullName}
                                        className="profile-photo"
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzMCIgcj0iMTIiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTYwIDY0QzYwIDUyLjk1NDMgNTEuMDQ1NyA0NCA0MCA0NEMyOC45NTQzIDQ0IDIwIDUyLjk1NDMgMjAgNjRINjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg==';
                                        }}
                                    />
                                    <div className="profile-details">
                                        <h1 className="profile-name">
                                            {user.fullName}
                                        </h1>
                                        <div className="profile-meta">
                                            <span className="profile-meta-item">👤 @{user.username}</span>
                                            {user.location && (
                                                <span className="profile-meta-item">
                                                    📍 {user.location}
                                                </span>
                                            )}
                                            {user.averageRating > 0 && (
                                                <span className="profile-meta-item">
                                                    <span className="rating-container">
                                                        <span className="star">★</span>
                                                        <span className="rating-text">
                                                            {user.averageRating.toFixed(1)} ({user.ratingCount} review{user.ratingCount !== 1 ? 's' : ''})
                                                        </span>
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                        {user.bio && (
                                            <p className="profile-bio">{user.bio}</p>
                                        )}
                                    </div>
                                    <div className="profile-actions">
                                        <Link
                                            to={`/create-swap/${user._id}`}
                                            className="btn btn-primary"
                                        >
                                            🤝 Request Skill Swap
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="skills-grid">
                        {/* Skills Offered */}
                        <div className="user-profile-card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    🎯 Skills Offered ({user.skillsOffered?.length || 0})
                                </h2>
                            </div>
                            <div className="card-body">
                                {user.skillsOffered?.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {user.skillsOffered.map((skill, index) => (
                                            <div key={index} className="skill-item offered">
                                                <div className="skill-header">
                                                    <h3 className="skill-name">{skill.name}</h3>
                                                    <span className="skill-badge offered">
                                                        {skill.level}
                                                    </span>
                                                </div>
                                                {skill.description && (
                                                    <p className="skill-description">{skill.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="empty-state">
                                        No skills offered yet
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Skills Wanted */}
                        <div className="user-profile-card">
                            <div className="card-header">
                                <h2 className="card-title">
                                    📚 Skills Wanted ({user.skillsWanted?.length || 0})
                                </h2>
                            </div>
                            <div className="card-body">
                                {user.skillsWanted?.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {user.skillsWanted.map((skill, index) => (
                                            <div key={index} className="skill-item wanted">
                                                <div className="skill-header">
                                                    <h3 className="skill-name">{skill.name}</h3>
                                                    <span className="skill-badge wanted">
                                                        {skill.priority} Priority
                                                    </span>
                                                </div>
                                                {skill.description && (
                                                    <p className="skill-description">{skill.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="empty-state">
                                        No skills wanted listed
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Availability */}
                    {user.availability?.length > 0 && (
                        <div className="user-profile-card">
                            <div className="card-header">
                                <h2 className="card-title">⏰ Availability</h2>
                            </div>
                            <div className="card-body">
                                <div className="availability-container">
                                    {user.availability.map((time, index) => (
                                        <span key={index} className="availability-tag">
                                            {time}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Call to Action */}
                    <div className="cta-section">
                        <div className="user-profile-card">
                            <div className="card-body">
                                <h3 className="cta-title">
                                    Interested in {user.fullName}'s skills?
                                </h3>
                                <p className="cta-description">
                                    Send a skill swap request and start learning together!
                                </p>
                                <Link
                                    to={`/create-swap/${user._id}`}
                                    className="btn btn-primary btn-lg"
                                >
                                    🤝 Request Skill Swap
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
