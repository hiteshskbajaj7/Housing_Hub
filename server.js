const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt'); // Password hashing
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Root Route -> Redirect to Login Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Login API
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });

        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (err) return res.status(500).json({ error: "Error comparing password" });

                if (isMatch) {
                    return res.json({ success: true, message: "Login successful", user: result[0] });
                } else {
                    return res.status(401).json({ error: "Wrong password" });
                }
            });
        } else {
            return res.status(404).json({ error: "User not found" });
        }
    });
});

// Register API
app.post('/register', (req, res) => {
    const { name, mobile, email, password, dob, address, userType } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Database Error" });

        if (result.length > 0) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ success: false, message: "Error hashing password" });

            db.query(
                "INSERT INTO users (name, mobile, email, password, dob, address, userType) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [name, mobile, email, hashedPassword, dob, address, userType],
                (err) => {
                    if (err) return res.status(500).json({ success: false, message: "Database Insert Error" });
                    res.json({ success: true, message: "User Registered Successfully" });
                }
            );
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});