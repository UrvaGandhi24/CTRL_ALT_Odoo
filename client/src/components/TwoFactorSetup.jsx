// // src/components/TwoFactorSetup.jsx

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router"; // small fix here for React Router v6+

// function TwoFactorSetup() {
// 	const [qr, setQr] = useState("");
// 	const [otp, setOtp] = useState("");
// 	const [message, setMessage] = useState("");
// 	const [loading, setLoading] = useState(true);
// 	const navigate = useNavigate();

// 	useEffect(() => {
// 		const fetchQRCode = async () => {
// 			try {
// 				const res = await axios.post("http://localhost:3334/api/2fa/setup", {}, {
// 					headers: {
// 						Authorization: `Bearer ${localStorage.getItem("token")}`,
// 					},
// 				});
// 				setQr(res.data.qr);
// 			} catch (err) {
// 				console.error(err);
// 				setMessage("Failed to load QR code.");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchQRCode();
// 	}, []);

// 	const verifyOtp = async (e) => {
// 		e.preventDefault();

// 		try {
// 			const res = await axios.post(
// 				"http://localhost:3334/api/2fa/verify",
// 				{ token: otp },
// 				{
// 					headers: {
// 						Authorization: `Bearer ${localStorage.getItem("token")}`,
// 					},
// 				}
// 			);
// 			setMessage(res.data.msg || "2FA Verified Successfully!");
// 			setTimeout(() => navigate("/dashboard"), 1000);
// 		} catch (err) {
// 			console.error(err);
// 			setMessage("Invalid 2FA token.");
// 		}
// 	};

// 	return (
// 		<div>
// 			<h2>Set up Two-Factor Authentication</h2>

// 			{loading ? (
// 				<p>Loading QR Code...</p>
// 			) : qr ? (
// 				<img src={qr} alt="Scan QR Code with Authenticator App" />
// 			) : (
// 				<p>QR Code not available</p>
// 			)}

// 			<form onSubmit={verifyOtp}>
// 				<input
// 					type="text"
// 					value={otp}
// 					onChange={(e) => setOtp(e.target.value)}
// 					placeholder="Enter OTP"
// 					required
// 				/>
// 				<button type="submit">Enable 2FA</button>
// 			</form>

// 			{message && <p>{message}</p>}
// 		</div>
// 	);
// }

// export default TwoFactorSetup;
