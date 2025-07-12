import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../utils/auth';

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
				<div className="flex flex-row gap-6 mb-8">
					<div className="card flex-1">
						<div className="card-body text-center">
							<h3 className="text-2xl font-bold text-blue-600">
								{user?.skillsOffered?.length || 0}
							</h3>
							<p className="text-gray-600">Skills Offered</p>
						</div>
					</div>
					<div className="card flex-1">
						<div className="card-body text-center">
							<h3 className="text-2xl font-bold text-green-600">
								{user?.skillsWanted?.length || 0}
							</h3>
							<p className="text-gray-600">Skills Wanted</p>
						</div>
					</div>
					<div className="card flex-1">
						<div className="card-body text-center">
							<h3 className="text-2xl font-bold text-purple-600">
								{user?.averageRating?.toFixed(1) || '0.0'}
							</h3>
							<p className="text-gray-600">Average Rating</p>
						</div>
					</div>
				</div>

			   <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
				   {/* Recent Swap Requests */}
				   <div className="card bg-white border border-blue-100 shadow-lg hover:shadow-2xl transition-shadow duration-300 p-0 flex flex-col">
					   <div className="card-header flex items-center gap-3 px-8 pt-8 pb-4">
						   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
							   <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
							   </svg>
						   </div>
						   <h2 className="text-xl font-bold text-blue-700">Recent Swap Requests</h2>
					   </div>
					   <div className="card-body px-8 pb-4 flex-1">
						   {recentSwaps.length > 0 ? (
							   <div className="space-y-6">
								   {recentSwaps.map((swap) => (
									   <div key={swap._id} className="rounded-lg border border-blue-50 bg-blue-50/50 p-4 flex flex-col gap-2 hover:bg-blue-100/70 transition-colors">
										   <div className="flex items-center justify-between mb-1">
											   <span className={`status-badge status-${swap.status} font-semibold capitalize px-3 py-1 rounded-full text-xs ${swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : swap.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{swap.status}</span>
											   <span className="text-xs text-gray-500">
												   {swap.type === 'sent' ? 'Sent to' : 'Received from'}{' '}
												   <span className="font-semibold text-gray-700">{
													   swap.type === 'sent'
														   ? swap.requested?.fullName
														   : swap.requester?.fullName
												   }</span>
											   </span>
										   </div>
										   <div className="flex flex-wrap gap-2 text-sm">
											   <span className="inline-flex items-center gap-1 bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
												   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
												   Offering: <span className="font-semibold">{swap.skillOffered.name}</span>
											   </span>
											   <span className="inline-flex items-center gap-1 bg-green-200 text-green-800 px-2 py-1 rounded-full">
												   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16V8l-3-3" /></svg>
												   Wanting: <span className="font-semibold">{swap.skillWanted.name}</span>
											   </span>
										   </div>
									   </div>
								   ))}
							   </div>
						   ) : (
							   <p className="text-gray-400 text-center py-8 text-base">
								   No swap requests yet. <Link to="/search" className="text-blue-600 underline hover:text-blue-800">Browse skills</Link> to get started!
							   </p>
						   )}
					   </div>
					   <div className="card-footer px-8 pb-8">
						   <Link to="/swaps" className="btn btn-blue w-full font-semibold text-base py-3 rounded-lg shadow hover:shadow-md transition">View All Swaps</Link>
					   </div>
				   </div>

				   {/* Suggested Connections */}
				   <div className="card bg-white border border-purple-100 shadow-lg hover:shadow-2xl transition-shadow duration-300 p-0 flex flex-col">
					   <div className="card-header flex items-center gap-3 px-8 pt-8 pb-4">
						   <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
							   <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V7a4 4 0 00-8 0v3m8 4a4 4 0 01-8 0" />
							   </svg>
						   </div>
						   <h2 className="text-xl font-bold text-purple-700">Discover Skills</h2>
					   </div>
					   <div className="card-body px-8 pb-4 flex-1">
						   {skillSuggestions.length > 0 ? (
							   <div className="space-y-6">
								   {skillSuggestions.map((suggestedUser) => (
									   <div key={suggestedUser._id} className="flex items-center gap-4 p-4 rounded-lg border border-purple-50 bg-purple-50/50 hover:bg-purple-100/70 transition-colors">
										   <img
											   src={suggestedUser.profilePhoto || '/default-avatar.png'}
											   alt={suggestedUser.fullName}
											   className="w-14 h-14 rounded-full object-cover border-2 border-purple-200 shadow"
										   />
										   <div className="flex-1">
											   <h4 className="font-semibold text-lg text-purple-800 mb-1">{suggestedUser.fullName}</h4>
											   <div className="flex flex-wrap gap-2 mt-1">
												   {suggestedUser.skillsOffered?.slice(0, 2).map((skill, index) => (
													   <span key={index} className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
														   {skill.name}
													   </span>
												   ))}
											   </div>
										   </div>
										   <Link
											   to={`/user/${suggestedUser._id}`}
											   className="btn btn-purple text-sm font-semibold px-4 py-2 rounded-lg shadow hover:shadow-md transition"
										   >
											   View
										   </Link>
									   </div>
								   ))}
							   </div>
						   ) : (
							   <p className="text-gray-400 text-center py-8 text-base">
								   No users found. Check back later!
							   </p>
						   )}
					   </div>
					   <div className="card-footer px-8 pb-8">
						   <Link to="/search" className="btn btn-purple w-full font-semibold text-base py-3 rounded-lg shadow hover:shadow-md transition">Browse All Skills</Link>
					   </div>
				   </div>
			   </div>

			</div>
		</div>
	);
};

export default Dashboard;
