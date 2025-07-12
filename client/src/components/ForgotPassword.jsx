import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState(null);
	const [error, setError] = useState(null);
	const [token, setToken] = useState('')
	const [resetLink, setResetLink] = useState(null); // dev only
	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);
		setError(null);
		setResetLink(null);

		if (!email || !email.includes("@")) {
			setLoading(false);
			return setError("Please enter a valid email address");
		}

		try {
			const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
			setMessage(res.data.message || "Reset link sent to your email");
			setResetLink(res.data.resetLink);
			setToken(res.data.token)
		} catch (err) {
			console.error("Forgot Password Error:", err);
			setError(err.response?.data?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container">
			<div className="card">
				<div className="card-header">
					<h2>Forgot Password</h2>
					<p className="text-gray">Enter your email to receive a password reset link</p>
				</div>

				<form onSubmit={handleSubmit} className="form">
					<div className="form-group">
						<label htmlFor="email">Email Address</label>
						<input
							id="email"
							type="email"
							placeholder="Enter your registered email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="input"
						/>
					</div>
					<button type="submit" disabled={loading} className="btn btn-primary btn-full">
						{loading ? "Sending..." : "Send Reset Link"}
					</button>
				</form>

				{error && <div className="alert alert-error">{error}</div>}
				{message && <div className="alert alert-success">{message}</div>}

				{resetLink && (
					<div className="alert alert-info">
						<p>For development purposes, click the button below:</p>
						<button 
							onClick={() => navigate(`/resetpassword/${token}`)}
							className="btn btn-secondary"
						>
							Reset Password
						</button>
					</div>
				)}

				<div className="text-center mt-4">
					<Link to="/login" className="link">Back to Login</Link>
				</div>
			</div>
		</div>
	);
}

export default ForgotPassword;
