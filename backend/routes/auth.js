const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const Athent = require("../middleware/Athent");
const Autho = require("../middleware/Autho");
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
      console.log("Received request:", req.body);
      const { email, password, firstname, familyname, role } = req.body;

      // Hash password
      const hashed_pass = await bcrypt.hash(password, 10);

      // ✅ Check if user already exists
      const [check] = await db.query("SELECT email FROM users WHERE email=?", [email]);
      if (check.length > 0) {
          console.log("User already registered:", email);
          return res.status(400).json({ message: "User already registered" });
      }

      // ✅ Insert user into the database
      await db.query(
          "INSERT INTO users (email, password, firstname, familyname, role) VALUES (?, ?, ?, ?, ?)",
          [email, hashed_pass, firstname, familyname, role]
      );

      console.log("User registered:", email);
      res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ message: "Server error", error });
  }
});

// ✅ User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch user from DB
        const [users] = await db.query("SELECT * FROM users WHERE email=?", [email]);
        if (users.length == 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = users[0];

        console.log("Stored Hashed Password:", user.password);
        console.log("Entered Password:", password);

        // Compare passwords
        const valid = await bcrypt.compare(password, user.password);
        console.log("Password Match Result:", valid);

        if (!valid) {
            return res.status(400).json({ message: "Incorrect email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id , role: user.role}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.json({ token ,
            user:{
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                familyname: user.familyname,
                role: user.role,
            }
        });
        console.log(token)
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// update user info
router.put('/updateUser', Athent, (req, res, next) => {
    // Ensure at least one of the roles is authorized
    if (Autho(['jobseeker'])(req, res, () => {}) || Autho(['employer'])(req, res, () => {})) {
        next();
    } else {
        return res.status(403).json({ message: 'Unauthorized' });
    }
}, async (req, res) => {
    try {
        const { id, firstname, familyname } = req.body;

        // Validate input
        if (!id || !firstname || !familyname) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Corrected query order
        const [update] = await db.query('UPDATE users SET firstname = ?, familyname = ? WHERE id = ?', [firstname, familyname, id]);

        // Check if the update was successful
        if (update.affectedRows > 0) {
            return res.status(200).json({ message: "User updated successfully", data: update });
        } else {
            return res.status(404).json({ message: "User not found or no changes made" });
        }
    } catch (error) {
        console.error("Database update error:", error);
        return res.status(500).json({ message: error.message });
    }
});






module.exports = router;
