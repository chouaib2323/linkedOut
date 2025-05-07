const cors= require('cors')
const  express= require('express')
const db = require("./config/db");
require("dotenv").config();
const path = require("path");


const app=express()

app.use(cors({ origin: "http://localhost:3000" })); // Adjust if your frontend runs on a different port

app.use(express.json())
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const auther = require('./routes/auth')
app.use("/auth", auther);
const emp = require('./routes/employer')
app.use("/employer", emp);

const apply = require('./routes/aplications')
app.use("/applications", apply);

const companyHandler = require('./routes/companyHandler')
app.use("/Company", companyHandler);

const adminn = require('./routes/admin')
app.use("/admin", adminn);



//images

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//connect to db 
const port = process.env.PORT 
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`); 
  });
