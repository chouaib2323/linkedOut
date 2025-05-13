const express = require("express");
const db = require("../config/db"); 
require("dotenv").config();
const multer = require("multer");
const path = require("path");


const router = express.Router();
const Autho = require("../middleware/Autho"); 
const Athent = require("../middleware/Athent"); 

// Get all companiesrouter.get("/companies", Athent, Autho(['admin']), async (req, res) => {
    router.get("/companies", Athent, Autho(['admin']), async (req, res) => {
        try {
          const [data] = await db.query("SELECT * FROM companies");
          res.json(data);
        } catch (err) {
          res.status(500).json(err);
        }
      });
      

// Approve or disapprove company
router.put("/companies/:id/status", Athent, Autho(['admin']), async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
      await db.query("UPDATE companies SET statue = ? WHERE id = ?", [status, id]);
      res.json({ message: "Company status updated" });
    } catch (err) {
      res.status(500).json(err);
    }
  });



// Route: GET all users, only accessible by admin
router.get("/users", Athent, Autho(['admin']), async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM users"); // Adjust table name if needed
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users", details: err });
  }
});

// Route: DELETE a user by ID, only accessible by admin
router.delete("/users/:id", Athent, Autho(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user", details: err });
  }
});


module.exports = router;