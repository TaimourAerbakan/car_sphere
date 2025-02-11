const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // Protect Routes

// ✅ GET User Profile (Protected)
router.get('/me', authMiddleware, (req, res) => {
    const userId = req.user.id; // Get user ID from token

    User.getById(userId, (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Exclude password before sending response
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    });
});

// ✅ UPDATE User Profile (Protected)
router.put('/me', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { name, phone, city } = req.body; // Fields to update

    if (!name || !phone || !city) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const updatedData = { name, phone, city };
    User.update(userId, updatedData, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Profile updated successfully" });
    });
});

module.exports = router;
