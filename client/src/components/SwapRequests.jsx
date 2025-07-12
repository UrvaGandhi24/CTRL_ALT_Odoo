import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/Dashboard.css';

const SwapRequests = () => {
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('received');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSwapRequests();
    }, []);

    const fetchSwapRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const [sentResponse, receivedResponse] = await Promise.all([
                axios.get('http://localhost:3334/api/users/swaps/sent', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:3334/api/users/swaps/received', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setSentRequests(sentResponse.data.swapRequests);
            setReceivedRequests(receivedResponse.data.swapRequests);
        } catch (error) {
            console.error('Error fetching swap requests:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (swapId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3334/api/swaps/${swapId}/status`, 
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            alert(`Request ${status} successfully!`);
            fetchSwapRequests(); // Refresh the data
        } catch (error) {
            console.error('Error updating swap status:', error);
            alert('Failed to update request status');
        }
    };

    const handleCancelRequest = async (swapId) => {
        if (!confirm('Are you sure you want to cancel this request?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3334/api/swaps/${swapId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Request cancelled successfully!');
            fetchSwapRequests();
        } catch (error) {
            console.error('Error cancelling swap:', error);
            alert('Failed to cancel request');
        }
    };

    const handleCompleteSwap = async (swapId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3334/api/swaps/${swapId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Swap marked as completed!');
            fetchSwapRequests();
        } catch (error) {
            console.error('Error completing swap:', error);
            alert('Failed to mark as completed');
        }
    };

    const handleRateSwap = async (swapId) => {
        const rating = prompt('Rate this swap (1-5 stars):');
        const feedback = prompt('Leave feedback (optional):');
        
        if (!rating || rating < 1 || rating > 5) {
            alert('Please enter a valid rating between 1 and 5');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3334/api/swaps/${swapId}/rate`, 
                { rating: parseInt(rating), feedback },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            alert('Rating submitted successfully!');
            fetchSwapRequests();
        } catch (error) {
            console.error('Error rating swap:', error);
            alert('Failed to submit rating');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const renderSwapCard = (swap, type) => {
        const otherUser = type === 'sent' ? swap.requested : swap.requester;
        const canRate = swap.status === 'completed' && (
            (type === 'sent' && !swap.requesterRating?.rating) ||
            (type === 'received' && !swap.requestedRating?.rating)
        );

        return (
            <div key={swap._id} className="swap-item">
                <div className="swap-header">
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <img
                            src={otherUser?.profilePhoto || '/default-avatar.png'}
                            alt={otherUser?.fullName}
                            style={{width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover'}}
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNSIgcj0iNiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAgMzJDMzAgMjYuNDc3MSAyNS41MjI5IDIyIDIwIDIyQzE0LjQ3NzEgMjIgMTAgMjYuNDc3MSAxMCAzMkgzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                            }}
                        />
                        <div>
                            <h3 style={{fontWeight: '600', color: '#1a202c'}}>{otherUser?.fullName}</h3>
                            <p style={{fontSize: '14px', color: '#718096'}}>
                                {type === 'sent' ? 'Request sent to' : 'Request from'} @{otherUser?.username}
                            </p>
                        </div>
                    </div>
                    <span className={`status-badge status-${swap.status}`}>
                        {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                    </span>
                </div>

                <div className="skill-tags" style={{marginBottom: '16px'}}>
                    <span className="skill-tag offering">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M12 8V4L8 8L12 12L16 8L12 4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Offering: {swap.skillOffered.name}
                    </span>
                    <span className="skill-tag wanting">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M12 16V20L16 16L12 12L8 16L12 20" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Wanting: {swap.skillWanted.name}
                    </span>
                </div>

                <div style={{marginBottom: '16px'}}>
                    <h4 style={{fontWeight: '600', marginBottom: '8px', color: '#1a202c'}}>Message</h4>
                    <p style={{color: '#4a5568', fontSize: '14px', background: 'rgba(0, 0, 0, 0.05)', padding: '12px', borderRadius: '8px'}}>
                        {swap.message}
                    </p>
                </div>

                <div className="swap-meta" style={{marginBottom: '16px'}}>
                    <span>Created: {formatDate(swap.createdAt)}</span>
                    {swap.proposedDate && (
                        <span>Proposed: {formatDate(swap.proposedDate)}</span>
                    )}
                    {swap.duration && (
                        <span>Duration: {swap.duration}</span>
                    )}
                </div>

                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                    {type === 'received' && swap.status === 'pending' && (
                        <>
                            <button
                                onClick={() => handleStatusUpdate(swap._id, 'accepted')}
                                className="btn btn-blue btn-small"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(swap._id, 'rejected')}
                                className="btn btn-purple btn-small"
                            >
                                Reject
                            </button>
                        </>
                    )}

                    {type === 'sent' && ['pending', 'accepted'].includes(swap.status) && (
                        <button
                            onClick={() => handleCancelRequest(swap._id)}
                            className="btn btn-purple btn-small"
                        >
                            Cancel Request
                        </button>
                    )}

                    {swap.status === 'accepted' && (
                        <button
                            onClick={() => handleCompleteSwap(swap._id)}
                            className="btn btn-blue btn-small"
                        >
                            Mark as Completed
                        </button>
                    )}

                    {canRate && (
                        <button
                            onClick={() => handleRateSwap(swap._id)}
                            className="btn btn-purple btn-small"
                        >
                            Rate & Review
                        </button>
                    )}

                    <Link
                        to={`/user/${otherUser?._id}`}
                        className="btn btn-purple btn-small"
                    >
                        View Profile
                    </Link>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading your swap requests...</p>
                </div>
            </div>
        );
    }

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
                        <Link to="/search" className="nav-item">
                            🔍 Browse Skills
                        </Link>
                        <Link to="/swaps" className="nav-item active">
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
                    <h1 className="welcome-title">My Swap Requests 🔄</h1>
                    <p className="welcome-subtitle">Manage your skill exchange requests</p>
                </div>

                {/* Tabs */}
                <div className="stats-grid" style={{gridTemplateColumns: '1fr 1fr', marginBottom: '32px'}}>
                    <button
                        onClick={() => setActiveTab('received')}
                        className={`dashboard-card ${
                            activeTab === 'received' ? 'active-tab' : ''
                        }`}
                        style={{padding: '24px', textAlign: 'center', cursor: 'pointer', border: 'none', background: 'none'}}
                    >
                        <div className="stat-number">{receivedRequests.length}</div>
                        <div className="stat-label">📥 Received Requests</div>
                    </button>
                    <button
                        onClick={() => setActiveTab('sent')}
                        className={`dashboard-card ${
                            activeTab === 'sent' ? 'active-tab' : ''
                        }`}
                        style={{padding: '24px', textAlign: 'center', cursor: 'pointer', border: 'none', background: 'none'}}
                    >
                        <div className="stat-number">{sentRequests.length}</div>
                        <div className="stat-label">📤 Sent Requests</div>
                    </button>
                </div>

                {/* Content */}
                <div className="main-grid" style={{gridTemplateColumns: '1fr'}}>
                    <div className="dashboard-card">
                        <div className="card-body">
                            {activeTab === 'received' ? (
                                receivedRequests.length > 0 ? (
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                                        {receivedRequests.map(swap => renderSwapCard(swap, 'received'))}
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <div style={{fontSize: '48px', marginBottom: '16px'}}>📥</div>
                                        <h3 style={{fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '8px'}}>
                                            No received requests
                                        </h3>
                                        <p style={{color: '#718096', marginBottom: '16px'}}>
                                            When others request your skills, they'll appear here
                                        </p>
                                        <Link to="/profile" className="btn btn-blue">
                                            Update Your Skills
                                        </Link>
                                    </div>
                                )
                            ) : (
                                sentRequests.length > 0 ? (
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                                        {sentRequests.map(swap => renderSwapCard(swap, 'sent'))}
                                    </div>
                                ) : (
                                    <div className="empty-state">
                                        <div style={{fontSize: '48px', marginBottom: '16px'}}>📤</div>
                                        <h3 style={{fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '8px'}}>
                                            No sent requests
                                        </h3>
                                        <p style={{color: '#718096', marginBottom: '16px'}}>
                                            Start browsing skills and send your first swap request!
                                        </p>
                                        <Link to="/search" className="btn btn-blue">
                                            Browse Skills
                                        </Link>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SwapRequests;
