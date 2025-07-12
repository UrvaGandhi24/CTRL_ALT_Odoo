import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
		if (errors.email) {
			setErrors(prev => ({ ...prev, email: "" }));
		}
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
		if (errors.password) {
			setErrors(prev => ({ ...prev, password: "" }));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = "Email is invalid";
		}

		if (!password) {
			newErrors.password = "Password is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			console.log("Logging in with:", { email, password });

			const response = await axios.post('http://localhost:3334/api/auth/login', {
				email,
				password
			});

			console.log("User Logged IN", response.data);
			localStorage.setItem('token', response.data.token);
			navigate('/dashboard');
		} catch (err) {
			console.error("Login error:", err);
			if (err.response && err.response.data && err.response.data.message) {
				alert(err.response.data.message);
			} else {
				alert("Login failed. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Welcome back to Skill Swap Platform
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div className="form-group">
							<label className="form-label">Email</label>
							<input
								type="email"
								value={email}
								onChange={handleEmailChange}
								placeholder="Enter your email"
								className="input"
								required
							/>
							{errors.email && <p className="form-error">{errors.email}</p>}
						</div>

						<div className="form-group">
							<label className="form-label">Password</label>
							<input
								type="password"
								value={password}
								onChange={handlePasswordChange}
								placeholder="Enter your password"
								className="input"
								required
							/>
							{errors.password && <p className="form-error">{errors.password}</p>}
						</div>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className="w-full btn btn-primary py-3 text-lg"
						>
							{loading ? (
								<div className="flex items-center justify-center">
									<div className="spinner mr-2"></div>
									Signing in...
								</div>
							) : (
								"Sign in"
							)}
						</button>
					</div>

					<div className="flex items-center justify-between">
						<Link
							to="/forgotpass"
							className="text-sm text-blue-600 hover:text-blue-500"
						>
							Forgot your password?
						</Link>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-600">
							Don't have an account?{" "}
							<Link
								to="/signup"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Sign up here
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
