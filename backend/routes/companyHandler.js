// server/routes/companies.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db'); 
const authenticate = require('../middleware/Athent'); 
const Autho = require("../middleware/Autho"); 
const Athent = require("../middleware/Athent");

require("dotenv").config();


// Multer config
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
// POST /api/companies
router.post('/CompanyInfo', authenticate , Autho(['employer']), upload.single('logo'), async (req, res) => {

  const userId = req.user.id;
  const { name, location, industry, website } = req.body;
  const logo =  req.file ? `/uploads/${req.file.filename}` : null;
  console.log(logo)

  try {
 
    // check if company already exists for this user
    const [rows] = await db.execute('SELECT * FROM companies WHERE userId = ?', [userId]);
    if (rows.length > 0) return res.status(400).json({ message: 'Company already created' });

    await db.execute(
      'INSERT INTO companies (name, logo, location, industry, website, userId) VALUES (?, ?, ?, ?, ?, ?)',
      [name, logo, location, industry, website, userId]
    );

    res.status(201).json({ message: 'Company created' });
  
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// get all companies

router.get("/allCompanies",Athent, async (req,res)=>{
  
  const [rows] = await db.execute('SELECT * FROM companies');
  if (rows.length > 0) return res.status(201).json({company : rows});
else{return res.status(400)}
})
module.exports = router;
