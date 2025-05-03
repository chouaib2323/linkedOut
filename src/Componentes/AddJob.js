import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";

function AddJob() {
  const token = localStorage.getItem("token");
  const userdata = localStorage.getItem("user");
  const user = userdata ? JSON.parse(userdata) : null;

  const [companyInfo, setInfo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    salary: "",
    status: "open",
    companyId: companyInfo?companyInfo.id:'',
  });

  const [companyPhoto, setCompanyPhoto] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const checkCompany = async () => {
      try {
        const token = localStorage.getItem("token");
        const resp = await axios.get("http://localhost:3004/employer/checkCompany", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (resp && resp.data) {
          setInfo(resp.data.company[0]);
          setFormData((prev) => ({
            ...prev,
            companyName: resp.data.company[0]?.name || "",
          }));
        }
      } catch (err) {
        console.error("Error checking company:", err);
      }
    };

    checkCompany();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      await axios.post("http://localhost:3004/employer/addjob", jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ text: "Job posted successfully!", type: "success" });
      setFormData({
        title: "",
        type: "",
        description: "",
        salary: "",
        location: "",
        status: "open",
        employerId: user ? user.id : "",
        companyName: companyInfo?.name || "",
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

          {/* Company Info Check Notice */}
          {!companyInfo && (
            <p className="mb-4 text-yellow-800 bg-yellow-100 border border-yellow-300 p-3 rounded text-center">
              ⚠️ Please fill in your <strong>Company Profile</strong> first before posting a job.
            </p>
          )}

          {/* Success/Error Message */}
          {message.text && (
            <p
              className={`p-3 text-center rounded-md ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
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
              disabled={!companyInfo}
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              disabled={!companyInfo}
            >
              <option value="">Select Job Type (Optional)</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
            </select>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Job Description"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
              disabled={!companyInfo}
            ></textarea>

            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Salary"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
              disabled={!companyInfo}
            />

            <input
            
              type="text"
              name="companyName"
              value={`company Name: ${companyInfo&&companyInfo.name} `}
              disabled
              placeholder={companyInfo ? `company Name: ${companyInfo.name} `: "Must add company info first"}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 font-bold"
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              disabled={!companyInfo}
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>

 
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
              disabled={!companyInfo}
            >
              Post Job
            </button>
          </form>
        </div>
      ) : (
        <p className="text-center text-red-600 mt-10 text-lg">
          Access Denied. Employers Only.
        </p>
      )}
    </>
  );
}

export default AddJob;
