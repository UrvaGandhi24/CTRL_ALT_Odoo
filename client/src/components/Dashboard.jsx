import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
			const response = await axios.get('http://localhost:3334/api/users/profile', {
				headers: { Authorization: `Bearer ${token}` }
			});
			setUser(response.data);
		} catch (error) {
			console.error('Error fetching user data:', error);
			if (error.response?.status === 401) {
				localStorage.removeItem('token');
				navigate('/login');
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
					<p>Loading your dashboard...</p>
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
						<Link to="/dashboard" className="nav-item active">Dashboard</Link>
						<Link to="/search" className="nav-item">Browse Skills</Link>
						<Link to="/swaps" className="nav-item">My Swaps</Link>
						<Link to="/profile" className="nav-item">Profile</Link>
						{user?.role === 'admin' && (
							<Link to="/admin" className="nav-item">Admin</Link>
						)}
						<button onClick={handleLogout} className="nav-item">Logout</button>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<div className="container py-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Welcome back, {user?.fullName || user?.username}!
					</h1>
					<p className="text-gray-600">
						Discover new skills and share your expertise with the community.
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-1 md:grid-3 gap-6 mb-8">
					<div className="card">
						<div className="card-body text-center">
							<h3 className="text-2xl font-bold text-blue-600">
								{user?.skillsOffered?.length || 0}
							</h3>
							<p className="text-gray-600">Skills Offered</p>
						</div>
					</div>
					<div className="card">
						<div className="card-body text-center">
							<h3 className="text-2xl font-bold text-green-600">
								{user?.skillsWanted?.length || 0}
							</h3>
							<p className="text-gray-600">Skills Wanted</p>
						</div>
					</div>
					<div className="card">
						<div className="card-body text-center">
							<h3 className="text-2xl font-bold text-purple-600">
								{user?.averageRating?.toFixed(1) || '0.0'}
							</h3>
							<p className="text-gray-600">Average Rating</p>
						</div>
					</div>
				</div>

				<div className="grid grid-1 lg:grid-2 gap-8">
					{/* Recent Swap Requests */}
					<div className="card">
						<div className="card-header">
							<h2 className="text-xl font-semibold">Recent Swap Requests</h2>
						</div>
						<div className="card-body">
							{recentSwaps.length > 0 ? (
								<div className="space-y-4">
									{recentSwaps.map((swap) => (
										<div key={swap._id} className="border-b border-gray-200 pb-4 last:border-b-0">
											<div className="flex items-center justify-between mb-2">
												<span className={`status-badge status-${swap.status}`}>
													{swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
												</span>
												<span className="text-sm text-gray-500">
													{swap.type === 'sent' ? 'Sent to' : 'Received from'} {
														swap.type === 'sent'
															? swap.requested?.fullName
															: swap.requester?.fullName
													}
												</span>
											</div>
											<p className="text-sm">
												<span className="font-medium">Offering:</span> {swap.skillOffered.name}
											</p>
											<p className="text-sm">
												<span className="font-medium">Wanting:</span> {swap.skillWanted.name}
											</p>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500 text-center py-4">
									No swap requests yet. <Link to="/search" className="text-blue-600">Browse skills</Link> to get started!
								</p>
							)}
						</div>
						<div className="card-footer">
							<Link to="/swaps" className="btn btn-outline w-full">
								View All Swaps
							</Link>
						</div>
					</div>

					{/* Suggested Connections */}
					<div className="card">
						<div className="card-header">
							<h2 className="text-xl font-semibold">Discover Skills</h2>
						</div>
						<div className="card-body">
							{skillSuggestions.length > 0 ? (
								<div className="space-y-4">
									{skillSuggestions.map((suggestedUser) => (
										<div key={suggestedUser._id} className="flex items-center space-x-3">
											<img
												src={suggestedUser.profilePhoto || '/default-avatar.png'}
												alt={suggestedUser.fullName}
												className="profile-photo"
											/>
											<div className="flex-1">
												<h4 className="font-medium">{suggestedUser.fullName}</h4>
												<div className="flex flex-wrap gap-1 mt-1">
													{suggestedUser.skillsOffered?.slice(0, 2).map((skill, index) => (
														<span key={index} className="skill-badge skill-badge-offered">
															{skill.name}
														</span>
													))}
												</div>
											</div>
											<Link
												to={`/user/${suggestedUser._id}`}
												className="btn btn-primary text-sm"
											>
												View
											</Link>
										</div>
									))}
								</div>
							) : (
								<p className="text-gray-500 text-center py-4">
									No users found. Check back later!
								</p>
							)}
						</div>
						<div className="card-footer">
							<Link to="/search" className="btn btn-outline w-full">
								Browse All Skills
							</Link>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="mt-8">
					<h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
					<div className="grid grid-1 sm:grid-2 lg:grid-4 gap-4">
						<Link to="/profile" className="btn btn-outline p-6 text-center h-auto">
							<div>
								<h3 className="font-semibold mb-2">Update Profile</h3>
								<p className="text-sm text-gray-600">Add skills and preferences</p>
							</div>
						</Link>
						<Link to="/search" className="btn btn-outline p-6 text-center h-auto">
							<div>
								<h3 className="font-semibold mb-2">Find Skills</h3>
								<p className="text-sm text-gray-600">Search for skills you need</p>
							</div>
						</Link>
						<Link to="/swaps" className="btn btn-outline p-6 text-center h-auto">
							<div>
								<h3 className="font-semibold mb-2">Manage Swaps</h3>
								<p className="text-sm text-gray-600">View and respond to requests</p>
							</div>
						</Link>
						<button
							onClick={() => navigate('/search')}
							className="btn btn-primary p-6 text-center h-auto"
						>
							<div>
								<h3 className="font-semibold mb-2">Start Swapping</h3>
								<p className="text-sm">Begin your skill exchange journey</p>
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
