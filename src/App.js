
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { useState , useEffect } from "react";
  import Login from "./Componentes/Login.js"
  import Register from "./Componentes/Register.js"
import  Home  from './Componentes/Home.js'
import  Profile  from './Componentes/Profile.js'
import AddJob from './Componentes/AddJob.js';
import PostedJobs from './Componentes/PostedJobs.js';
import Aplications from './Componentes/Aplications.js';
import EmployerApplications from './Componentes/EmployerApplications.js';
import CompanyForm from './Componentes/CompanyForm.js';

function App() {
  useEffect(() => {
    const checkTokenExpiration = () => {
      const loginTime = localStorage.getItem("loginTime");

      if (loginTime) {
        const elapsedTime = Date.now() - parseInt(loginTime, 10);
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

        if (elapsedTime > oneHour) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("loginTime");
          console.log("Token expired and removed.");
        }
      }
    };

    checkTokenExpiration(); // Run on load
  }, []);
  return (
    <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Login />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Profile" element={<Profile/>} />
                <Route path='/AddJob'element={<AddJob/>} />
                <Route path='/Postedjobs'element={<PostedJobs/>} />
                <Route path='/aplications'element={<Aplications/>} />
                <Route path='/EmployerApplications'element={<EmployerApplications/>} />
                <Route path='/CompanyForm'element={<CompanyForm/>} />
            </Routes>
        </Router>
  );
}

export default App;
