import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [swaps, setSwaps] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState({
        title: '',
        message: '',
        type: 'announcement',
        priority: 'medium'
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3334/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data.stats);
            setSwaps(response.data.recentSwaps);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            if (error.response?.status === 403) {
                alert('Admin access required');
                navigate('/dashboard');
            } else if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3334/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3334/api/admin/messages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleBanUser = async (userId, isBanned) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3334/api/admin/users/${userId}/ban`, 
                { isBanned },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`User ${isBanned ? 'banned' : 'unbanned'} successfully`);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Failed to update user status');
        }
    };

    const handleCreateMessage = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3334/api/admin/messages', newMessage, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Message created successfully');
            setNewMessage({
                title: '',
                message: '',
                type: 'announcement',
                priority: 'medium'
            });
            fetchMessages();
        } catch (error) {
            console.error('Error creating message:', error);
            alert('Failed to create message');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const downloadReport = async (reportType) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/admin/reports/${reportType}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // Create filename with current date
            const date = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `${reportType}_report_${date}.csv`);
            
            // Append to html link element page
            document.body.appendChild(link);
            
            // Start download
            link.click();
            
            // Clean up and remove the link
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            alert(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report downloaded successfully!`);
        } catch (error) {
            console.error('Error downloading report:', error);
            alert('Failed to download report. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p>Loading admin dashboard...</p>
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
                        Skill Swap Platform - Admin
                    </Link>
                    <div className="nav-links">
                        <Link to="/dashboard" className="nav-item">Dashboard</Link>
                        <Link to="/admin" className="nav-item active">Admin</Link>
                        <button onClick={handleLogout} className="nav-item">Logout</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage users, monitor activity, and send platform messages</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 mb-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 font-medium rounded-t-lg ${
                            activeTab === 'overview'
                                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('users');
                            if (users.length === 0) fetchUsers();
                        }}
                        className={`px-6 py-3 font-medium rounded-t-lg ${
                            activeTab === 'users'
                                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('messages');
                            if (messages.length === 0) fetchMessages();
                        }}
                        className={`px-6 py-3 font-medium rounded-t-lg ${
                            activeTab === 'messages'
                                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Messages
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`px-6 py-3 font-medium rounded-t-lg ${
                            activeTab === 'reports'
                                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Reports
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-1 md:grid-2 lg:grid-4 gap-6">
                            <div className="card">
                                <div className="card-body text-center">
                                    <h3 className="text-2xl font-bold text-blue-600">{stats.totalUsers || 0}</h3>
                                    <p className="text-gray-600">Total Users</p>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body text-center">
                                    <h3 className="text-2xl font-bold text-red-600">{stats.bannedUsers || 0}</h3>
                                    <p className="text-gray-600">Banned Users</p>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body text-center">
                                    <h3 className="text-2xl font-bold text-green-600">{stats.totalSwaps || 0}</h3>
                                    <p className="text-gray-600">Total Swaps</p>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body text-center">
                                    <h3 className="text-2xl font-bold text-yellow-600">{stats.pendingSwaps || 0}</h3>
                                    <p className="text-gray-600">Pending Swaps</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Swaps */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-xl font-semibold">Recent Swap Requests</h2>
                            </div>
                            <div className="card-body">
                                {swaps.length > 0 ? (
                                    <div className="space-y-4">
                                        {swaps.map((swap) => (
                                            <div key={swap._id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">
                                                        {swap.requester?.fullName} → {swap.requested?.fullName}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {swap.skillOffered.name} ↔ {swap.skillWanted.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(swap.createdAt)}
                                                    </p>
                                                </div>
                                                <span className={`status-badge status-${swap.status}`}>
                                                    {swap.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No recent swaps</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="card">
                        <div className="card-header">
                            <h2 className="text-xl font-semibold">User Management</h2>
                        </div>
                        <div className="card-body">
                            {users.length > 0 ? (
                                <div className="space-y-4">
                                    {users.map((user) => (
                                        <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={user.profilePhoto || '/default-avatar.png'}
                                                    alt={user.fullName}
                                                    className="profile-photo"
                                                    onError={(e) => {
                                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNSIgcj0iNiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzAgMzJDMzAgMjYuNDc3MSAyNS41MjI5IDIyIDIwIDIyQzE0LjQ3NzEgMjIgMTAgMjYuNDc3MSAxMCAzMkgzMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                                    }}
                                                />
                                                <div>
                                                    <h3 className="font-semibold">{user.fullName}</h3>
                                                    <p className="text-sm text-gray-600">@{user.username}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Skills: {user.skillsOffered?.length || 0} offered, {user.skillsWanted?.length || 0} wanted
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {user.isBanned ? (
                                                    <span className="status-badge bg-red-100 text-red-800">Banned</span>
                                                ) : (
                                                    <span className="status-badge bg-green-100 text-green-800">Active</span>
                                                )}
                                                <button
                                                    onClick={() => handleBanUser(user._id, !user.isBanned)}
                                                    className={`btn ${user.isBanned ? 'btn-success' : 'btn-danger'} text-sm`}
                                                >
                                                    {user.isBanned ? 'Unban' : 'Ban'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No users found</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="space-y-8">
                        {/* Create Message */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-xl font-semibold">Send Platform Message</h2>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleCreateMessage} className="space-y-4">
                                    <div className="grid grid-1 md:grid-2 gap-4">
                                        <div className="form-group">
                                            <label className="form-label">Title</label>
                                            <input
                                                type="text"
                                                value={newMessage.title}
                                                onChange={(e) => setNewMessage(prev => ({ ...prev, title: e.target.value }))}
                                                className="input"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Type</label>
                                            <select
                                                value={newMessage.type}
                                                onChange={(e) => setNewMessage(prev => ({ ...prev, type: e.target.value }))}
                                                className="select"
                                            >
                                                <option value="announcement">Announcement</option>
                                                <option value="maintenance">Maintenance</option>
                                                <option value="feature_update">Feature Update</option>
                                                <option value="warning">Warning</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Message</label>
                                        <textarea
                                            value={newMessage.message}
                                            onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                                            className="textarea"
                                            rows={4}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Message History */}
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-xl font-semibold">Message History</h2>
                            </div>
                            <div className="card-body">
                                {messages.length > 0 ? (
                                    <div className="space-y-4">
                                        {messages.map((message) => (
                                            <div key={message._id} className="p-4 border rounded-lg">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold">{message.title}</h3>
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                        message.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {message.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700 mb-2">{message.message}</p>
                                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                    <span>Type: {message.type}</span>
                                                    <span>Priority: {message.priority}</span>
                                                    <span>Created: {formatDate(message.createdAt)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No messages found</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="space-y-8">
                        <div className="card">
                            <div className="card-header">
                                <h2 className="text-xl font-semibold">Platform Reports</h2>
                                <p className="text-gray-600">Download reports for analysis and record keeping</p>
                            </div>
                            
                            <div className="card-body">
                                <div className="grid grid-1 md:grid-2 gap-6">
                                    {/* User Report */}
                                    <div className="p-6 border border-gray-200 rounded-lg">
                                        <h3 className="text-lg font-medium mb-2">Users Report</h3>
                                        <p className="text-gray-600 mb-4">Download comprehensive user data including profiles, skills, and activity.</p>
                                        <button 
                                            onClick={() => downloadReport('users')}
                                            className="btn btn-secondary"
                                        >
                                            Download Users Report
                                        </button>
                                    </div>

                                    {/* Swaps Report */}
                                    <div className="p-6 border border-gray-200 rounded-lg">
                                        <h3 className="text-lg font-medium mb-2">Skill Swaps Report</h3>
                                        <p className="text-gray-600 mb-4">Download data on all skill swap requests, completions, and ratings.</p>
                                        <button 
                                            onClick={() => downloadReport('swaps')}
                                            className="btn btn-secondary"
                                        >
                                            Download Swaps Report
                                        </button>
                                    </div>

                                    {/* Activity Report */}
                                    <div className="p-6 border border-gray-200 rounded-lg">
                                        <h3 className="text-lg font-medium mb-2">Platform Activity</h3>
                                        <p className="text-gray-600 mb-4">Download overall platform statistics and user engagement metrics.</p>
                                        <button 
                                            onClick={() => downloadReport('activity')}
                                            className="btn btn-secondary"
                                        >
                                            Download Activity Report
                                        </button>
                                    </div>

                                    {/* Financial Report */}
                                    <div className="p-6 border border-gray-200 rounded-lg">
                                        <h3 className="text-lg font-medium mb-2">Administrative Log</h3>
                                        <p className="text-gray-600 mb-4">Download admin actions, user moderation, and platform messages.</p>
                                        <button 
                                            onClick={() => downloadReport('admin')}
                                            className="btn btn-secondary"
                                        >
                                            Download Admin Log
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <h4 className="font-medium text-yellow-800 mb-2">Report Information</h4>
                                    <ul className="text-sm text-yellow-700 space-y-1">
                                        <li>• Reports are generated in CSV format for easy analysis</li>
                                        <li>• All personal data is handled according to privacy policies</li>
                                        <li>• Reports include data from the last 30 days by default</li>
                                        <li>• Contact system administrator for custom date ranges</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
