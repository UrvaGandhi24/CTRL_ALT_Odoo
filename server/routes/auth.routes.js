import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js"; //User.find(), User.create(), User.findById(), User.deleteOne()
import { Authenticate } from "../middleware/auth.middleware.js";
import { forgotpassword, login, resetpassword, signup } from "../controllers/auth.controllers.js";

const router = express.Router();

// POST /api/signup
router.post("/signup", signup);

// POST /api/login
router.post("/login", login);

router.post("/forgot-password", forgotpassword);

router.post("/reset-password/:token", resetpassword);

// 🛡️ Example protected route
router.get("/me", Authenticate, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (err) {
		res.status(500).json({ msg: "Something went wrong" });
	}
});

export default router;