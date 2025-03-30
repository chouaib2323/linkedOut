import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
const API_URL = "http://localhost:3004/auth";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [failed, setFailed] = useState("");
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        
        fetch("http://localhost:3004/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                // ✅ Store token
                localStorage.setItem("token", data.token);
                localStorage.setItem("user",JSON.stringify(data.user))
                localStorage.setItem("loginTime", Date.now()); 
                // ✅ Retrieve & log token to verify it's stored
                const storedToken = localStorage.getItem("token");
                console.log("Stored Token:", storedToken);
              
                // ✅ Redirect to another page (example: dashboard)
                navigate("/Home");
            } else {
                setFailed(data.message)
                console.log("Login failed:", data.message);
            }
        })
        .catch(error => console.error("Error during login:", error));
    };
    

    return (
        <div className="min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
       
            <div className="bg-white  p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" className="w-full p-2 mb-2 border rounded"
                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" className="w-full p-2 mb-2 border rounded"
                        value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <h1 className='text-red-500 my-1'>{failed}</h1>
                    <button  className="w-full from-gray-400  to-sky-400 bg-gradient-to-l text-white p-2 rounded">Login</button>
                </form>
                <p className="text-sm my-1">Don't have an account? <Link className=" text-sky-500" to="/register">Register</Link></p>
            </div>
        </div>
        </div>
        
    );
};

export default Login;