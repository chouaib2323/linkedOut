const express = require("express");
const db = require("../config/db"); 
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const router = express.Router();
const Autho = require("../middleware/Autho"); 
const Athent = require("../middleware/Athent"); 
const { param } = require("./employer");

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); 
    },
  });
const upload = multer({ storage  });
//insert application of a job seeker
router.post("/apply",Athent,Autho(['jobseeker']),upload.single("file"), async(req, res)=>{
    try{
        
        const path = req.file ? `/uploads/${req.file.filename}` : null;
        console.log("Received request:", req.body);
        const {jobid , userid , status , letter} = req.body;
        if(!{jobid , userid , status}){
            res.status(404)
        }
await db.query('INSERT INTO applications (jobId ,userId ,status ,path, letter) VALUES (?,?,?,?,?)',[jobid , userid , status ,path, letter])


const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userid]);
const array = rows[0];
console.log(array)
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "chouaibe2019@gmail.com",
    pass: "rsgkbokumzpakgfo", // 👈 No spaces or quotes issues
  },
  tls: {
    rejectUnauthorized: false, // 👈 This is the key line to bypass cert errors
  },
});
  
    // 2. Email content
    const mailOptions = {
      from: 'chouaibe2019@gmail.com',
      to: array.email,
      subject: "Thank you for applying!",
      text: "We have received your application. We'll be in touch soon.",
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent!");
   
}catch(e){
        console.log(e)
    }
})


// get jobseeker applications
 router.get('/seekerApplyed',Athent,Autho(['jobseeker']),async(req,res)=>{
const userid = req.user.id
   const query= ` SELECT * FROM applications 
   INNER JOIN jobs ON jobs.id=applications.jobId
WHERE applications.userId=${userid}
   `
  const response =await  db.query(query)
  if(response){
    res.status(201).json(response)
  }
 
 })

// get jobs applyed for the employers
router.get('/getapplyedjobs',Athent , Autho(['employer']),async (req , res )=>{

  const employerId = req.user.id
const  query = `SELECT 
  users.firstname, 
  users.familyname, 
  users.email, 
  jobs.title, 
  jobs.employerId,
  companies.name AS company_name,
  companies.location, 
  applications.jobId,
  applications.applied_at,
  companies.logo, 
  applications.letter
FROM applications
INNER JOIN jobs ON jobs.id = applications.jobId
INNER JOIN users ON users.id = applications.userId
INNER JOIN companies ON companies.userId = jobs.employerId
WHERE jobs.employerId = ?

`
const response= await db.query(query,[employerId])
console.log(response)
res.status(201).json(response)

})

// update a job status
router.put('/updateStatus',Athent, Autho(['employer']) , async (req , res )=>{
  const {id ,status} = req.body
  
 const query = `UPDATE jobs
 SET status = ? WHERE id= ? `
 const rsponse =  await db.query(query,[status , id])
   
 if(rsponse){
  res.status(201).json({rsponse})
 } 
})
module.exports = router;