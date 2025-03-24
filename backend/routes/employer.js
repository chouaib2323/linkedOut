const express = require("express");
const db = require("../config/db"); // Ensure db connection is correct
require("dotenv").config();
const multer = require("multer");
const router = express.Router();
const Autho = require("../middleware/Autho"); // Ensure this file exists
const Athent = require("../middleware/Athent"); // Ensure this file exists
const path = require("path");




//handleing the img :
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) {
      return cb(null, true);
    }
    cb("Error: Images Only!");
  },
});
router.post("/addjob",Athent, Autho(["employer"]), upload.single("companyPhoto"), async (req, res) => {
  try {
    const { title, description, salary, location, status, employerId,companyName } = req.body;
    if (!title || !description || !salary || !location || !status || !employerId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    // Insert into database
    const query = 
    `  INSERT INTO jobs (title, description, salary, location, status, employerId,profile_image, companyName)
      VALUES (?, ?, ?, ?, ?, ?,?,?)`
    ;
   
   await db.query(query, [title, description, salary, location, status,employerId,imagePath,companyName], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "Job added successfully", jobId: result.insertId });
    });
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ message: "Internal server error" });
  }

  
});





//get employer posted jobs
router.get("/jobs", Athent, Autho(["employer"]), async (req, res) => {
  try {
    const { employerId } = req.query; // Get employerId from query params

    if (!employerId) {
      return res.status(400).json({ message: "Employer ID is required" });
    }

    // Convert db.query to a Promise
    const jobs = await  db.query(
        "SELECT * FROM jobs WHERE jobs.employerId = ?",
        [employerId],
      );
    

    res.status(200).json(jobs);
   
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete a job
router.delete('/jobsdelete/:jobId',Athent,Autho(['employer']),async(req,res)=>{ 
  const id =req.params.jobId; 
db.query("DELETE FROM jobs WHERE id=?",[id])
const newJobs= await db.query("SELECT * FROM jobs")
res.status(201).json(newJobs)
})




//get all jobs
router.get("/alljobs", Athent, async (req, res) => {
  try {
    const jobs = await  db.query(
        "SELECT * FROM jobs "
      );
    res.status(200).json(jobs);
   
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;