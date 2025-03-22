const cors= require('cors')
const  express= require('express')
const db = require("./config/db");
require("dotenv").config();
const path = require("path");


const app=express()

app.use(cors({ origin: "http://localhost:3000" })); // Adjust if your frontend runs on a different port

app.use(express.json())

const auther = require('./routes/auth')
app.use("/auth", auther);
const emp = require('./routes/employer')
app.use("/employer", emp);

const apply = require('./routes/aplications')
app.use("/applications", apply);


//images

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//connect to db 
const port = process.env.PORT 
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`); 
  });
