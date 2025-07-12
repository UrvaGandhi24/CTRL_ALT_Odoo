import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
	const { token } = useParams()
	const navigate = useNavigate();

	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);
		setError(null);

		if (newPassword.length < 6) {
			setLoading(false);
			return setError("Password must be at least 6 characters");
		}
		if (newPassword !== confirmPassword) {
			setLoading(false);
			return setError("Passwords do not match");
		}

		try {
			const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
				newPassword,
			});
			setMessage(res.data.message || "Password reset successfully! Redirecting to login...");
			setTimeout(() => navigate("/login"), 3000);
		} catch (err) {
			console.error("Reset Error:", err);
			setError(err.response?.data?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container">
			<div className="card">
				<div className="card-header">
					<h2>Reset Your Password</h2>
					<p className="text-gray">Enter your new password below</p>
				</div>

				<form onSubmit={handleSubmit} className="form">
					<div className="form-group">
						<label htmlFor="newPassword">New Password</label>
						<input
							id="newPassword"
							type="password"
							placeholder="Enter new password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
							className="input"
							minLength="6"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="confirmPassword">Confirm Password</label>
						<input
							id="confirmPassword"
							type="password"
							placeholder="Confirm new password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							className="input"
							minLength="6"
						/>
					</div>
					<button type="submit" disabled={loading} className="btn btn-primary btn-full">
						{loading ? "Resetting..." : "Reset Password"}
					</button>
				</form>

				{error && <div className="alert alert-error">{error}</div>}
				{message && <div className="alert alert-success">{message}</div>}

				<div className="text-center mt-4">
					<Link to="/login" className="link">Back to Login</Link>
				</div>
			</div>
		</div>
	);
}

export default ResetPassword;
