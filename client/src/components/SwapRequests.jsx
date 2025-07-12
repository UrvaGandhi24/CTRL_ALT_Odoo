import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
            <div key={swap._id} className="card">
                <div className="card-body">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <img
                                src={otherUser?.profilePhoto || '/default-avatar.png'}
                                alt={otherUser?.fullName}
                                className="profile-photo"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNSIgcj0iNiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAgMzJDMzAgMjYuNDc3MSAyNS41MjI5IDIyIDIwIDIyQzE0LjQ3NzEgMjIgMTAgMjYuNDc3MSAxMCAzMkgzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                }}
                            />
                            <div>
                                <h3 className="font-semibold">{otherUser?.fullName}</h3>
                                <p className="text-sm text-gray-500">
                                    {type === 'sent' ? 'Request sent to' : 'Request from'} @{otherUser?.username}
                                </p>
                            </div>
                        </div>
                        <span className={`status-badge status-${swap.status}`}>
                            {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                        </span>
                    </div>

                    <div className="grid grid-1 md:grid-2 gap-4 mb-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <h4 className="font-medium text-green-800 mb-1">Skill Offered</h4>
                            <p className="text-green-700">{swap.skillOffered.name}</p>
                            {swap.skillOffered.description && (
                                <p className="text-sm text-green-600 mt-1">{swap.skillOffered.description}</p>
                            )}
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-1">Skill Wanted</h4>
                            <p className="text-blue-700">{swap.skillWanted.name}</p>
                            {swap.skillWanted.description && (
                                <p className="text-sm text-blue-600 mt-1">{swap.skillWanted.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-medium mb-2">Message</h4>
                        <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                            {swap.message}
                        </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>Created: {formatDate(swap.createdAt)}</span>
                        {swap.proposedDate && (
                            <span>Proposed: {formatDate(swap.proposedDate)}</span>
                        )}
                        {swap.duration && (
                            <span>Duration: {swap.duration}</span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {type === 'received' && swap.status === 'pending' && (
                            <>
                                <button
                                    onClick={() => handleStatusUpdate(swap._id, 'accepted')}
                                    className="btn btn-success"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(swap._id, 'rejected')}
                                    className="btn btn-danger"
                                >
                                    Reject
                                </button>
                            </>
                        )}

                        {type === 'sent' && ['pending', 'accepted'].includes(swap.status) && (
                            <button
                                onClick={() => handleCancelRequest(swap._id)}
                                className="btn btn-outline"
                            >
                                Cancel Request
                            </button>
                        )}

                        {swap.status === 'accepted' && (
                            <button
                                onClick={() => handleCompleteSwap(swap._id)}
                                className="btn btn-primary"
                            >
                                Mark as Completed
                            </button>
                        )}

                        {canRate && (
                            <button
                                onClick={() => handleRateSwap(swap._id)}
                                className="btn btn-secondary"
                            >
                                Rate & Review
                            </button>
                        )}

                        <Link
                            to={`/user/${otherUser?._id}`}
                            className="btn btn-outline"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p>Loading your swap requests...</p>
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
                        <Link to="/swaps" className="nav-item active">My Swaps</Link>
                        <Link to="/profile" className="nav-item">Profile</Link>
                        <button onClick={handleLogout} className="nav-item">Logout</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Swap Requests</h1>
                    <p className="text-gray-600">Manage your skill exchange requests</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 mb-8">
                    <button
                        onClick={() => setActiveTab('received')}
                        className={`px-6 py-3 font-medium rounded-t-lg ${
                            activeTab === 'received'
                                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Received ({receivedRequests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('sent')}
                        className={`px-6 py-3 font-medium rounded-t-lg ${
                            activeTab === 'sent'
                                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Sent ({sentRequests.length})
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {activeTab === 'received' ? (
                        receivedRequests.length > 0 ? (
                            receivedRequests.map(swap => renderSwapCard(swap, 'received'))
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📥</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No received requests
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    When others request your skills, they'll appear here
                                </p>
                                <Link to="/profile" className="btn btn-primary">
                                    Update Your Skills
                                </Link>
                            </div>
                        )
                    ) : (
                        sentRequests.length > 0 ? (
                            sentRequests.map(swap => renderSwapCard(swap, 'sent'))
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📤</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No sent requests
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Start browsing skills and send your first swap request!
                                </p>
                                <Link to="/search" className="btn btn-primary">
                                    Browse Skills
                                </Link>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default SwapRequests;
