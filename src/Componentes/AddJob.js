import React, { useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";

function AddJob() {
  const token = localStorage.getItem("token");
  const userdata = localStorage.getItem("user");
  const user = userdata ? JSON.parse(userdata) : null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    status: "open",
    employerId: user ? user.id : "",
    companyName: "",
  });

  const [companyPhoto, setCompanyPhoto] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    setCompanyPhoto(e.target.files[0]);
  };

  // Submit Form
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
      await axios.post("http://localhost:3004/employer/addjob", jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ text: "Job posted successfully!", type: "success" });

      // Reset Form
      setFormData({
        title: "",
        description: "",
        salary: "",
        location: "",
        status: "open",
        employerId: user ? user.id : "",
        companyName: "",
      });
      setCompanyPhoto(null);
    } catch (error) {
      setMessage({ text: "Failed to post job. Try again.", type: "error" });
    }
  };

  return (
    <>
      <Navbar />
      {user?.role === "employer" ? (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            Post a New Job
          </h2>

          {/* Success/Error Message */}
          {message.text && (
            <p
              className={`p-3 text-center rounded-md ${
                message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Job Title"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Job Description"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            ></textarea>

            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Salary"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>

            {/* Company Photo Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              Post Job
            </button>
          </form>
        </div>
      ) : (
        <p className="text-center text-red-600 mt-10 text-lg">Access Denied. Employers Only.</p>
      )}
    </>
  );
}

export default AddJob;
