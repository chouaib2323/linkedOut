import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";


function AddJob() {
  const token = localStorage.getItem("token");
  const userdata = localStorage.getItem("user");
  const user = userdata ? JSON.parse(userdata) : null;
  const [isAded,setAded]=useState('')

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    status: "open",
    employerId: user ? user.id : "",
    companyName: ""
  });
  const [companyPhoto, setCompanyPhoto] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCompanyPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const jobData = new FormData();
    Object.keys(formData).forEach((key) => {
      jobData.append(key, formData[key]);
      
    });
    if (companyPhoto) {
      jobData.append("companyPhoto", companyPhoto);
    }
    
    try {
      const response = await axios.post("http://localhost:3004/employer/addjob", jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Job posted successfully:",setAded(response) );
      alert("Job posted successfully!");
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job.");
    }
  };
  

  return (
    <>
      <Navbar />
      {user && user.role === "employer" ? (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Post a Job</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Job Title"
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Job description"
              className="w-full p-2 border rounded"
              required
            ></textarea>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Salary"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full p-2 border rounded"
              required
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>

            {/* Company Photo Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />

            <input type="hidden" name="employerId" value={formData.employerId} />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Post Job
            </button>
          </form>
          {isAded && isAded}
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default AddJob;