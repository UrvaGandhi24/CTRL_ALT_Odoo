export const signup = async (req, res) => {
	try {
		const { username, email, password, fullName } = req.body;

		if (!fullName) {
			return res.status(400).json({ message: "Full name is required" });
		}

		const existingUser = await User.findOne({ email });
		if (existingUser)
			return res.status(400).json({ message: "Email already in use" });

		const existingUsername = await User.findOne({ username });
		if (existingUsername)
			return res.status(400).json({ message: "Username already taken" });

		const newUser = new User({ username, email, password, fullName });
		await newUser.save();

		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Signup failed" });
	}
}
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: "User not found" });

		const passMatch = await bcrypt.compare(password, user.password);
		if (!passMatch)
			return res.status(401).json({ message: "Invalid credentials" });

		const token = jwt.sign(
			{ id: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: "10m" }
		);

		res.status(200).json({ message: "Login successful", token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Login failed" });
	}
}
export const forgotpassword = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: "User not found" });

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "15m",
		});

		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
		await user.save();

		const origin = req.get("origin") || "http://localhost:5173";
		const resetLink = `${origin}/resetpassword/${token}`;
		res.json({ resetLink, token, message: "Reset link generated successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal server error" });
	}
}
export const resetpassword = async (req, res) => {
	try {
		const { token } = req.params
		const { newPassword } = req.body;
		if (!newPassword || newPassword.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters" });
		}
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		});
		if (!user)
			return res
				.status(404)
				.json({ message: "User not found or Token Invalid" });

		user.password = newPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		await user.save();
		res.json({ message: "Password has been reset successfully" });
	} catch (error) {
		console.error("Reset Password Error:", error);
		res.status(500).json({ message: "Server error during password reset" });
	}
}