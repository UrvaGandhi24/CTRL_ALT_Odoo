import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h2>
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
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            to="/search"
                            className="btn btn-outline"
                        >
                            ← Back to Search
                        </Link>
                    </div>

                    {/* Profile Header */}
                    <div className="card mb-8">
                        <div className="card-body">
                            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                                <img
                                    src={user.profilePhoto || '/default-avatar.png'}
                                    alt={user.fullName}
                                    className="profile-photo-lg mx-auto md:mx-0"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzMCIgcj0iMTIiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTYwIDY0QzYwIDUyLjk1NDMgNTEuMDQ1NyA0NCA0MCA0NEMyOC45NTQzIDQ0IDIwIDUyLjk1NDMgMjAgNjRINjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg==';
                                    }}
                                />
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {user.fullName}
                                    </h1>
                                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 text-sm text-gray-600">
                                        <span>@{user.username}</span>
                                        {user.location && (
                                            <span className="flex items-center justify-center md:justify-start">
                                                📍 {user.location}
                                            </span>
                                        )}
                                        {user.averageRating > 0 && (
                                            <span className="flex items-center justify-center md:justify-start">
                                                <span className="text-yellow-400 mr-1">★</span>
                                                {user.averageRating.toFixed(1)} 
                                                <span className="ml-1">({user.ratingCount} review{user.ratingCount !== 1 ? 's' : ''})</span>
                                            </span>
                                        )}
                                    </div>
                                    {user.bio && (
                                        <p className="mt-3 text-gray-700">{user.bio}</p>
                                    )}
                                </div>
                                <div className="flex flex-col space-y-2 w-full md:w-auto">
                                    <Link
                                        to={`/create-swap/${user._id}`}
                                        className="btn btn-primary text-center"
                                    >
                                        Request Skill Swap
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-1 lg:grid-2 gap-8">
                        {/* Skills Offered */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-xl font-semibold text-green-700">
                                    Skills Offered ({user.skillsOffered?.length || 0})
                                </h2>
                            </div>
                            <div className="card-body">
                                {user.skillsOffered?.length > 0 ? (
                                    <div className="space-y-4">
                                        {user.skillsOffered.map((skill, index) => (
                                            <div key={index} className="p-4 bg-green-50 rounded-lg">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold text-green-800">{skill.name}</h3>
                                                    <span className="skill-badge skill-badge-offered">
                                                        {skill.level}
                                                    </span>
                                                </div>
                                                {skill.description && (
                                                    <p className="text-sm text-green-700">{skill.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No skills offered yet
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Skills Wanted */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-xl font-semibold text-blue-700">
                                    Skills Wanted ({user.skillsWanted?.length || 0})
                                </h2>
                            </div>
                            <div className="card-body">
                                {user.skillsWanted?.length > 0 ? (
                                    <div className="space-y-4">
                                        {user.skillsWanted.map((skill, index) => (
                                            <div key={index} className="p-4 bg-blue-50 rounded-lg">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold text-blue-800">{skill.name}</h3>
                                                    <span className="skill-badge skill-badge-wanted">
                                                        {skill.priority} Priority
                                                    </span>
                                                </div>
                                                {skill.description && (
                                                    <p className="text-sm text-blue-700">{skill.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No skills wanted listed
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Availability */}
                    {user.availability?.length > 0 && (
                        <div className="card mt-8">
                            <div className="card-header">
                                <h2 className="text-xl font-semibold">Availability</h2>
                            </div>
                            <div className="card-body">
                                <div className="flex flex-wrap gap-2">
                                    {user.availability.map((time, index) => (
                                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                            {time}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Call to Action */}
                    <div className="mt-8 text-center">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="text-xl font-semibold mb-4">
                                    Interested in {user.fullName}'s skills?
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Send a skill swap request and start learning together!
                                </p>
                                <Link
                                    to={`/create-swap/${user._id}`}
                                    className="btn btn-primary btn-lg"
                                >
                                    Request Skill Swap
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
