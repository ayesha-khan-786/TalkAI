import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch(err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await 
            User.findOne({ email });
            if(!user) {
                return res.status(400).json({ message: "User not found "});
            }

        // 2. Compare Password
        const isMatch = await
            bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).json({ message: "Invalid password "});
            }

            //console.log("JWT Secrete is Login:", process.env.JWT_SECRET);

        // 3. Generate JWT token
        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );
            res.status(200).json({ token });        // Send token
    } catch(err) {
            res.status(500).json({ message: "Server error" });
    }
});

export default router;