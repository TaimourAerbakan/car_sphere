const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register user

router.post('/signup', async (req, res) => {
    const { name, email, password, role, city, phone } = req.body;

    // Validate role
    const validRoles = ['buyer', 'seller', 'admin'];
    if (role && !validRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }

    if (!name || !email || !password) {
        return res.status(400).json({ msg: "Please fill all fields" });
    }

    //Check if user already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (results.length > 0) {
            console.log('results', results)
            return results.status(400).json({ msg: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        db.query("INSERT INTO users (name, email, password, role, city, phone) VALUES (?, ?, ?, ?, ?, ?)", [name, email, hashedPassword, role || "buyer", city, phone], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: "Database error" });
            }
            res.status(201).json({ msg: "User registered successfully" })
        });
    });
});

// Login user

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (results.length === 0) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });

    // TODO: Add JWT token to the response and set a cookie for persistent login
});


// Update Password (Logged-in Users)
router.put('/update-password', authMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Get user ID from token

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Both old and new passwords are required' });
    }

    try {
        // Fetch user from database
        db.query('SELECT password FROM users WHERE id = ?', [userId], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ error: 'User not found' });

            const storedPassword = results[0].password;

            // Compare old password
            const isMatch = await bcrypt.compare(oldPassword, storedPassword);
            if (!isMatch) return res.status(400).json({ error: 'Old password is incorrect' });

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update password in database
            db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Password updated successfully' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;