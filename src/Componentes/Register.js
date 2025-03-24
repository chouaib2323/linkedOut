import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";

const API_URL = "http://localhost:3004/auth"; // Your backend URL

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstname: "",
        familyname: "",
        role: "employer", // Default role
    });
    const navigate = useNavigate();

    // Handle form input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
     
        e.preventDefault()
        fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData) // ✅ Send user input
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "User registered successfully") {
                console.log("Registration successful!");
                navigate("/"); // ✅ Redirect to login page after registration
            } else {
                console.log("Registration failed:", data.message);
            }
        })
        .catch(error => console.error("Error during registration:", error));
    };
    

    return (
        <>
        <Navbar/>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-semibold mb-4">Register</h2>
                <form onSubmit={handleRegister}>
                    <input type="email" name="email" placeholder="Email" className="w-full p-2 mb-2 border rounded"
                        value={formData.email} onChange={handleChange} required />
                    
                    <input type="password" name="password" placeholder="Password" className="w-full p-2 mb-2 border rounded"
                        value={formData.password} onChange={handleChange} required />

                    <input type="text" name="firstname" placeholder="First Name" className="w-full p-2 mb-2 border rounded"
                        value={formData.firstname} onChange={handleChange} required />

                    <input type="text" name="familyname" placeholder="Last Name" className="w-full p-2 mb-2 border rounded"
                        value={formData.familyname} onChange={handleChange} required />

                    <select name="role" className="w-full p-2 mb-2 border rounded" value={formData.role} onChange={handleChange}>
                        <option value="employer">Employer</option>
                        <option value="jobseeker">Job Seeker</option>
                    </select>

                    <button className="w-full from-gray-400  to-sky-400 bg-gradient-to-l text-white p-2 rounded">Register</button>
                </form>
                <p className="text-sm mt-2">Already have an account? <Link className="text-blue-500" to="/login">Login</Link></p>
            </div>
        </div>
        </>
    );
};

export default Register;
