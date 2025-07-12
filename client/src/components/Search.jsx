import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/Dashboard.css';

const Search = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        skill: '',
        location: '',
        availability: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
    });
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
        searchUsers();
    }, [pagination.page]);

    useEffect(() => {
        if (pagination.page === 1) {
            searchUsers();
        } else {
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    }, [filters]);

    const searchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
            });

            const response = await axios.get(`http://localhost:3334/api/users/search?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsers(response.data.users);
            setPagination(prev => ({
                ...prev,
                total: response.data.total,
                pages: response.data.pages
            }));
        } catch (error) {
            console.error('Error searching users:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
            // Set mock data for demo
            setUsers([
                {
                    _id: 'demo1',
                    fullName: 'Alice Johnson',
                    bio: 'Passionate developer and teacher',
                    location: 'New York',
                    averageRating: 4.8,
                    skillsOffered: [{name: 'React'}, {name: 'JavaScript'}, {name: 'CSS'}],
                    skillsWanted: [{name: 'Python'}, {name: 'Machine Learning'}]
                },
                {
                    _id: 'demo2', 
                    fullName: 'Bob Smith',
                    bio: 'Full-stack developer with 5 years experience',
                    location: 'San Francisco',
                    averageRating: 4.6,
                    skillsOffered: [{name: 'Node.js'}, {name: 'Python'}, {name: 'Docker'}],
                    skillsWanted: [{name: 'React'}, {name: 'DevOps'}]
                },
                {
                    _id: 'demo3',
                    fullName: 'Carol Chen',
                    bio: 'UI/UX designer passionate about user experience',
                    location: 'Los Angeles',
                    averageRating: 4.9,
                    skillsOffered: [{name: 'Figma'}, {name: 'Adobe XD'}, {name: 'User Research'}],
                    skillsWanted: [{name: 'Frontend Development'}, {name: 'CSS'}]
                }
            ]);
            setPagination(prev => ({ ...prev, total: 3, pages: 1 }));
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            skill: '',
            location: '',
            availability: ''
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            {/* Background Animation */}
            <div className="dashboard-bg">
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
                        SkillSwap Platform
                    </Link>
                    <div className="nav-links">
                        <Link to="/dashboard" className="nav-item">
                            📚 Dashboard
                        </Link>
                        <Link to="/search" className="nav-item active">
                            🔍 Browse Skills
                        </Link>
                        <Link to="/swaps" className="nav-item">
                            🔄 My Swaps
                        </Link>
                        <Link to="/profile" className="nav-item">
                            👤 Profile
                        </Link>
                        <button onClick={handleLogout} className="nav-item">
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="dashboard-main">
                <div className="welcome-section">
                    <h1 className="welcome-title">Browse Skills 🔍</h1>
                    <p className="welcome-subtitle">Find people with skills you want to learn</p>
                </div>

                {/* Filters */}
                <div className="dashboard-card" style={{marginBottom: '32px'}}>
                    <div className="card-body">
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
                            <div>
                                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a202c'}}>Search Skills</label>
                                <input
                                    type="text"
                                    name="skill"
                                    value={filters.skill}
                                    onChange={handleFilterChange}
                                    placeholder="e.g., JavaScript, Cooking, Guitar"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid rgba(0, 0, 0, 0.1)',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a202c'}}>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    placeholder="e.g., New York, Remote"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid rgba(0, 0, 0, 0.1)',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1a202c'}}>Availability</label>
                                <select
                                    name="availability"
                                    value={filters.availability}
                                    onChange={handleFilterChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid rgba(0, 0, 0, 0.1)',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                >
                                    <option value="">Any time</option>
                                    {availabilityOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: 'transparent'}}>Action</label>
                                <button
                                    onClick={clearFilters}
                                    className="btn btn-purple"
                                    style={{width: '100%'}}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="loading-container" style={{minHeight: '400px'}}>
                        <div className="loading-content">
                            <div className="spinner"></div>
                            <p className="loading-text">Searching for users...</p>
                        </div>
                    </div>
                ) : users.length > 0 ? (
                    <>
                        <div style={{marginBottom: '16px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)'}}>
                            Found {pagination.total} user{pagination.total !== 1 ? 's' : ''}
                        </div>
                        <div className="stats-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '32px'}}>
                            {users.map((user) => (
                                <div key={user._id} className="dashboard-card">
                                    <div className="card-body">
                                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                                            <img
                                                src={user.profilePhoto || '/default-avatar.png'}
                                                alt={user.fullName}
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '12px',
                                                    objectFit: 'cover',
                                                    border: '2px solid rgba(102, 126, 234, 0.2)'
                                                }}
                                                onError={(e) => {
                                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNSIgcj0iNiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAgMzJDMzAgMjYuNDc3MSAyNS41MjI5IDIyIDIwIDIyQzE0LjQ3NzEgMjIgMTAgMjYuNDc3MSAxMCAzMkgzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                                }}
                                            />
                                            <div style={{flex: 1}}>
                                                <h3 style={{fontWeight: '600', color: '#1a202c', margin: 0}}>{user.fullName}</h3>
                                                <div style={{display: 'flex', alignItems: 'center', fontSize: '14px', color: '#718096', gap: '12px'}}>
                                                    {user.location && (
                                                        <span>📍 {user.location}</span>
                                                    )}
                                                    {user.averageRating > 0 && (
                                                        <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                                            <span style={{color: '#fbbf24'}}>★</span>
                                                            {user.averageRating.toFixed(1)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {user.bio && (
                                            <p style={{fontSize: '14px', color: '#4a5568', marginBottom: '12px', lineHeight: '1.4'}}>
                                                {user.bio}
                                            </p>
                                        )}

                                        <div style={{marginBottom: '12px'}}>
                                            <h4 style={{fontWeight: '600', fontSize: '14px', marginBottom: '8px', color: '#1a202c'}}>Skills Offered:</h4>
                                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                                                {user.skillsOffered?.slice(0, 3).map((skill, index) => (
                                                    <span key={index} className="skill-tag offering">
                                                        {skill.name}
                                                    </span>
                                                ))}
                                                {user.skillsOffered?.length > 3 && (
                                                    <span className="skill-tag offering">
                                                        +{user.skillsOffered.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {user.skillsWanted?.length > 0 && (
                                            <div style={{marginBottom: '16px'}}>
                                                <h4 style={{fontWeight: '600', fontSize: '14px', marginBottom: '8px', color: '#1a202c'}}>Looking for:</h4>
                                                <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                                                    {user.skillsWanted?.slice(0, 3).map((skill, index) => (
                                                        <span key={index} className="skill-tag wanting">
                                                            {skill.name}
                                                        </span>
                                                    ))}
                                                    {user.skillsWanted?.length > 3 && (
                                                        <span className="skill-tag wanting">
                                                            +{user.skillsWanted.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <Link
                                            to={`/user/${user._id}`}
                                            className="btn btn-blue btn-full"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '6px'}}>
                                                <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                            View Profile & Request Swap
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px'}}>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className="btn btn-purple"
                                    style={{opacity: pagination.page === 1 ? 0.5 : 1}}
                                >
                                    Previous
                                </button>
                                <span style={{fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)'}}>
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === pagination.pages}
                                    className="btn btn-purple"
                                    style={{opacity: pagination.page === pagination.pages ? 0.5 : 1}}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <div style={{fontSize: '48px', marginBottom: '16px'}}>🔍</div>
                        <h3 style={{fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '8px'}}>No users found</h3>
                        <p style={{color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px'}}>
                            Try adjusting your search criteria or clearing filters
                        </p>
                        <button
                            onClick={clearFilters}
                            className="btn btn-blue"
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
