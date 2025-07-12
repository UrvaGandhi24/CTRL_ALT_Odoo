import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
	const [formData, setFormData] = useState({
		username: "",
		fullName: "",
		email: "",
		password: "",
		confirmPassword: ""
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ""
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.fullName.trim()) {
			newErrors.fullName = "Full name is required";
		}

		if (!formData.username.trim()) {
			newErrors.username = "Username is required";
		} else if (formData.username.length < 3) {
			newErrors.username = "Username must be at least 3 characters";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const FormSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) {
			return;
		}

		setLoading(true);

		try {
			const response = await axios.post("http://localhost:3334/api/auth/signup", {
				username: formData.username,
				fullName: formData.fullName,
				email: formData.email,
				password: formData.password,
			});

			console.log("User created!", response.data);
			alert("Account created successfully! Please login to continue.");
			navigate("/login");
		} catch (err) {
			console.error("Signup error:", err);
			if (err.response && err.response.data && err.response.data.message) {
				alert(err.response.data.message);
			} else {
				alert("Something went wrong. Please try again.");
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
						Join Skill Swap Platform
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Create your account to start swapping skills
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={FormSubmit}>
					<div className="space-y-4">
						<div className="form-group">
							<label className="form-label">Full Name</label>
							<input
								type="text"
								name="fullName"
								value={formData.fullName}
								onChange={handleChange}
								placeholder="Enter your full name"
								className="input"
								required
							/>
							{errors.fullName && <p className="form-error">{errors.fullName}</p>}
						</div>

						<div className="form-group">
							<label className="form-label">Username</label>
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleChange}
								placeholder="Choose a username"
								className="input"
								required
							/>
							{errors.username && <p className="form-error">{errors.username}</p>}
						</div>

						<div className="form-group">
							<label className="form-label">Email</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
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
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Create a password"
								className="input"
								required
							/>
							{errors.password && <p className="form-error">{errors.password}</p>}
						</div>

						<div className="form-group">
							<label className="form-label">Confirm Password</label>
							<input
								type="password"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								placeholder="Confirm your password"
								className="input"
								required
							/>
							{errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
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
									Creating Account...
								</div>
							) : (
								"Create Account"
							)}
						</button>
					</div>

					<div className="text-center">
						<p className="text-sm text-gray-600">
							Already have an account?{" "}
							<Link
								to="/login"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Sign in here
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}

export default SignUp;
