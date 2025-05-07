const express = require("express");
const db = require("../config/db"); 
require("dotenv").config();
const multer = require("multer");
const path = require("path");


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
const  query = `SELECT firstname , familyname, email ,title, employerId ,companies.name,location, jobId ,applied_at ,logo, letter
 FROM applications
 INNER JOIN companies ON companies.id=applications.jobId
INNER JOIN jobs ON jobs.id=applications.jobId
INNER JOIN users ON users.id=applications.userId
WHERE jobs.employerId=?
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