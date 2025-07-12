import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AdminProfileView = () => {
	const { id } = useParams();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchAdminProfile();
	}, [id]);

	const fetchAdminProfile = async () => {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get(
				`http://localhost:3334/api/admin/admin-profile-view/${id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setUser(res.data.user);
		} catch (err) {
			setError(err.response?.data?.message || "Error fetching admin profile");
		} finally {
			setLoading(false);
		}
	};

	const handleRejectSkill = async (skillId, type) => {
		try {
			const token = localStorage.getItem("token");
			await axios.delete(
				`http://localhost:3334/api/admin/reject-skill/${id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
					data: {
						skillId,
						type, // 'offered' or 'wanted'
					}
				}
			);
			// Option 1: Re-fetch the full profile
			await fetchAdminProfile();

			// Option 2: You could also just remove it from state directly if needed
		} catch (err) {
			alert(err.response?.data?.message || "Failed to delete skill");
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p style={{ color: 'red' }}>{error}</p>;
	if (!user) return <p>No user found.</p>;

	return (
	<div className="create-swap-container">
		{/* Floating background shapes */}
		<div className="create-swap-bg">
			<div className="floating-shape shape-1"></div>
			<div className="floating-shape shape-2"></div>
			<div className="floating-shape shape-3"></div>
			<div className="floating-shape shape-4"></div>
		</div>

		<div className="create-swap-main">
			<a href="/admin-dashboard" className="back-button">
				<svg viewBox="0 0 24 24" fill="none">
					<path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
				Back
			</a>

			<div className="user-info-card">
				<div className="user-info-content">
					<img
						className="user-avatar"
						src={user.profilePhoto || 'https://via.placeholder.com/150'}
						alt="Profile"
					/>
					<div className="user-details">
						<h3>{user.fullName}</h3>
						<p>{user.email}</p>
						<p><strong>Username:</strong> {user.username}</p>
					</div>
				</div>
			</div>

			{/* Sections */}
			<div className="form-section">
				<div className="section-header details">
					<h4 className="section-title details">Profile Details</h4>
				</div>
				<div className="section-body">
					<p><strong>Role:</strong> {user.role}</p>
					<p><strong>Location:</strong> {user.location || "N/A"}</p>
					<p><strong>Bio:</strong> {user.bio || "No bio provided."}</p>
					<p><strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}</p>
					<p><strong>Banned:</strong> {user.isBanned ? "Yes" : "No"}</p>
					<p><strong>Average Rating:</strong> {user.averageRating} ({user.ratingCount} ratings)</p>
					<p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
					<p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
				</div>
			</div>

			{/* Offered Skills */}
			<div className="form-section">
				<div className="section-header offering">
					<h4 className="section-title offering">Skills Offered</h4>
				</div>
				<div className="section-body">
					{user.skillsOffered.length > 0 ? (
						<ul className="space-y-4">
							{user.skillsOffered.map(skill => (
								<li key={skill._id} className="form-group">
									<strong>{skill.name}</strong> — Level: {skill.level}<br />
									<em>Description:</em> {skill.description || "No description"}<br />
									<button className="btn btn-outline mt-4" onClick={() => handleRejectSkill(skill._id, 'offered')}>Reject</button>
								</li>
							))}
						</ul>
					) : (
						<p>No skills offered.</p>
					)}
				</div>
			</div>

			{/* Wanted Skills */}
			<div className="form-section">
				<div className="section-header wanting">
					<h4 className="section-title wanting">Skills Wanted</h4>
				</div>
				<div className="section-body">
					{user.skillsWanted.length > 0 ? (
						<ul className="space-y-4">
							{user.skillsWanted.map(skill => (
								<li key={skill._id} className="form-group">
									<strong>{skill.name}</strong> — Priority: {skill.priority}<br />
									<em>Description:</em> {skill.description || "No description"}<br />
									<button className="btn btn-outline mt-4" onClick={() => handleRejectSkill(skill._id, 'wanted')}>Reject</button>
								</li>
							))}
						</ul>
					) : (
						<p>No skills wanted.</p>
					)}
				</div>
			</div>

			{/* Availability */}
			<div className="form-section">
				<div className="section-header details">
					<h4 className="section-title details">Availability</h4>
				</div>
				<div className="section-body">
					{user.availability.length > 0 ? (
						<ul className="space-y-2">
							{user.availability.map((slot, index) => (
								<li key={index}>{slot}</li>
							))}
						</ul>
					) : (
						<p>No availability set.</p>
					)}
				</div>
			</div>
		</div>
	</div>
);

};

export default AdminProfileView;
