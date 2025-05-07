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
  

module.exports = router;