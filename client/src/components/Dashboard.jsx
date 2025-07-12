import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../utils/auth';
import './Dashboard.css';

const Dashboard = () => {
	const [user, setUser] = useState(null);
	const [recentSwaps, setRecentSwaps] = useState([]);
	const [skillSuggestions, setSkillSuggestions] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		fetchUserData();
		fetchRecentSwaps();
		fetchSkillSuggestions();
	}, []);

	const fetchUserData = async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				navigate('/login');
				return;
			}
			
			const response = await axios.get('http://localhost:3334/api/users/profile', {
				headers: { Authorization: `Bearer ${token}` }
			});
			setUser(response.data);
		} catch (error) {
			console.error('Error fetching user data:', error);
			// If unauthorized, redirect to login
			if (error.response?.status === 401) {
				localStorage.removeItem('token');
				navigate('/login');
			} else {
				// For demo purposes, set a default user if API fails
				setUser({
					_id: 'demo-user',
					fullName: 'Demo User',
					username: 'demouser',
					email: 'demo@example.com',
					skillsOffered: [
						{ name: 'JavaScript', level: 'Advanced' },
						{ name: 'React', level: 'Intermediate' }
					],
					skillsWanted: [
						{ name: 'Python', level: 'Beginner' },
						{ name: 'Design', level: 'Intermediate' }
					]
				});
			}
			// For demo mode, use mock user data instead of redirecting to login
			const mockUser = JSON.parse(localStorage.getItem('mockUser') || '{}');
			if (mockUser._id) {
				setUser(mockUser);
			} else {
				setUser({
					_id: 'demo-user',
					fullName: 'Demo User',
					username: 'demouser',
					email: 'demo@example.com',
					isAdmin: true,
					skillsOffered: [
						{ name: 'JavaScript', level: 'Advanced' },
						{ name: 'React', level: 'Intermediate' }
					],
					skillsWanted: [
						{ name: 'Python', level: 'Beginner' },
						{ name: 'Design', level: 'Intermediate' }
					]
				});
			}
		}
	};

	const fetchRecentSwaps = async () => {
		try {
			const token = localStorage.getItem('token');
			const [sentResponse, receivedResponse] = await Promise.all([
				axios.get('http://localhost:3334/api/users/swaps/sent?limit=3', {
					headers: { Authorization: `Bearer ${token}` }
				}),
				axios.get('http://localhost:3334/api/users/swaps/received?limit=3', {
					headers: { Authorization: `Bearer ${token}` }
				})
			]);

			const combined = [
				...sentResponse.data.swapRequests.map(swap => ({ ...swap, type: 'sent' })),
				...receivedResponse.data.swapRequests.map(swap => ({ ...swap, type: 'received' }))
			].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

			setRecentSwaps(combined);
		} catch (error) {
			console.error('Error fetching recent swaps:', error);
			// Set mock swap data for demo
			setRecentSwaps([
				{
					_id: 'swap1',
					type: 'received',
					requester: { fullName: 'Alice Johnson' },
					skillOffered: { name: 'Python' },
					skillWanted: { name: 'JavaScript' },
					status: 'pending',
					createdAt: new Date().toISOString()
				},
				{
					_id: 'swap2',
					type: 'sent',
					requested: { fullName: 'Bob Smith' },
					skillOffered: { name: 'React' },
					skillWanted: { name: 'Node.js' },
					status: 'accepted',
					createdAt: new Date(Date.now() - 86400000).toISOString()
				}
			]);
		}
	};

	const fetchSkillSuggestions = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get('http://localhost:3334/api/users/search?limit=6', {
				headers: { Authorization: `Bearer ${token}` }
			});
			setSkillSuggestions(response.data.users);
		} catch (error) {
			console.error('Error fetching skill suggestions:', error);
			// Set mock skill suggestions for demo
			setSkillSuggestions([
				{
					_id: 'user1',
					fullName: 'Sarah Wilson',
					skillsOffered: [{ name: 'Python', level: 'Advanced' }],
					skillsWanted: [{ name: 'JavaScript', level: 'Intermediate' }]
				},
				{
					_id: 'user2',
					fullName: 'Mike Chen',
					skillsOffered: [{ name: 'Design', level: 'Expert' }],
					skillsWanted: [{ name: 'React', level: 'Beginner' }]
				},
				{
					_id: 'user3',
					fullName: 'Emily Davis',
					skillsOffered: [{ name: 'Node.js', level: 'Advanced' }],
					skillsWanted: [{ name: 'DevOps', level: 'Intermediate' }]
				}
			]);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		auth.logout();
	};

	if (loading) {
		return (
			<div className="loading-container">
				<div className="loading-content">
					<div className="spinner"></div>
					<p className="loading-text">Loading your dashboard...</p>
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
						SkillSwap
					</Link>
					<div className="nav-links">
						<Link to="/dashboard" className="nav-item active">
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
						{user?.role === 'admin' && (
							<Link to="/admin" className="nav-item">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginRight: '6px'}}>
									<path d="M12 1L3 5V11C3 16 6 20 12 23C18 20 21 16 21 11V5L12 1Z" stroke="currentColor" strokeWidth="2"/>
								</svg>
								Admin
							</Link>
						)}
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
			<div className="dashboard-main">
				{/* Welcome Section */}
				<div className="welcome-section">
					<h1 className="welcome-title">
						Welcome back, {user?.fullName || user?.username}! 👋
					</h1>
					<p className="welcome-subtitle">
						Discover new skills and share your expertise with the community.
					</p>
				</div>

				{/* Stats Cards */}
				<div className="stats-grid">
					<div className="stat-card">
						<div className="stat-number">{user?.skillsOffered?.length || 0}</div>
						<div className="stat-label">Skills Offered</div>
					</div>
					<div className="stat-card">
						<div className="stat-number">{user?.skillsWanted?.length || 0}</div>
						<div className="stat-label">Skills Wanted</div>
					</div>
					<div className="stat-card">
						<div className="stat-number">{user?.averageRating?.toFixed(1) || '5.0'}</div>
						<div className="stat-label">Average Rating</div>
					</div>
				</div>

				{/* Main Grid */}
				<div className="main-grid">
					{/* Recent Swap Requests */}
					<div className="dashboard-card">
						<div className="card-header">
							<div className="header-icon blue">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
									<path d="M17 16L21 12L17 8" stroke="currentColor" strokeWidth="2"/>
									<path d="M21 12H9" stroke="currentColor" strokeWidth="2"/>
									<path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="2"/>
									<path d="M3 12H15" stroke="currentColor" strokeWidth="2"/>
								</svg>
							</div>
							<h2 className="card-title">Recent Swap Requests</h2>
						</div>
						<div className="card-body">
							{recentSwaps.length > 0 ? (
								<div className="swap-list">
									{recentSwaps.map((swap) => (
										<div key={swap._id} className="swap-item">
											<div className="swap-header">
												<span className={`status-badge status-${swap.status}`}>
													{swap.status}
												</span>
												<span className="swap-meta">
													{swap.type === 'sent' ? 'Sent to' : 'Received from'}{' '}
													<strong>{
														swap.type === 'sent'
															? swap.requested?.fullName
															: swap.requester?.fullName
													}</strong>
												</span>
											</div>
											<div className="skill-tags">
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
										</div>
									))}
								</div>
							) : (
								<div className="empty-state">
									<p>
										No swap requests yet. <Link to="/search">Browse skills</Link> to get started!
									</p>
								</div>
							)}
						</div>
						<div className="card-footer">
							<Link to="/swaps" className="btn btn-blue btn-full">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
									<path d="M5 12H19" stroke="currentColor" strokeWidth="2"/>
									<path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2"/>
								</svg>
								View All Swaps
							</Link>
						</div>
					</div>

					{/* Suggested Connections */}
					<div className="dashboard-card">
						<div className="card-header">
							<div className="header-icon purple">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
									<path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 1.17157 16.1716C0.42143 16.9217 0 17.9391 0 19V21" stroke="currentColor" strokeWidth="2"/>
									<circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
									<path d="M23 21V19C23 17.9391 22.5786 16.9217 21.8284 16.1716C21.0783 15.4214 20.0609 15 19 15C17.9391 15 16.9217 15.4214 16.1716 16.1716C15.4214 16.9217 15 17.9391 15 19V21" stroke="currentColor" strokeWidth="2"/>
									<circle cx="16" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
								</svg>
							</div>
							<h2 className="card-title">Discover Skills</h2>
						</div>
						<div className="card-body">
							{skillSuggestions.length > 0 ? (
								<div className="user-list">
									{skillSuggestions.map((suggestedUser) => (
										<div key={suggestedUser._id} className="user-item">
											<img
												src={suggestedUser.profilePhoto || '/default-avatar.png'}
												alt={suggestedUser.fullName}
												className="user-avatar"
											/>
											<div className="user-info">
												<h4 className="user-name">{suggestedUser.fullName}</h4>
												<div className="user-skills">
													{suggestedUser.skillsOffered?.slice(0, 3).map((skill, index) => (
														<span key={index} className="user-skill">
															{skill.name}
														</span>
													))}
												</div>
											</div>
											<Link
												to={`/user/${suggestedUser._id}`}
												className="btn btn-purple btn-small"
											>
												<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
													<path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
													<circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
												</svg>
												View Profile
											</Link>
										</div>
									))}
								</div>
							) : (
								<div className="empty-state">
									<p>No users found. Check back later!</p>
								</div>
							)}
						</div>
						<div className="card-footer">
							<Link to="/search" className="btn btn-purple btn-full">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
									<circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
									<path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2"/>
								</svg>
								Browse All Skills
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
