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
    companyId: "",
  });

  const [companyPhoto, setCompanyPhoto] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const checkCompany = async () => {
      try {
        const resp = await axios.get("http://localhost:3004/employer/checkCompany", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resp.data && resp.data.company?.length) {
          const company = resp.data.company[0];
          setInfo(company);
          setFormData((prev) => ({ ...prev, companyId: company.id }));
        }
      } catch (err) {
        console.error("Error checking company:", err);
      }
    };

    checkCompany();
  }, [token]);

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

    if (companyPhoto) jobData.append("companyPhoto", companyPhoto);

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
        status: "open",
        companyId: companyInfo?.id || "",
      });
      setCompanyPhoto(null);
    } catch (error) {
      console.error(error);  // Add more detailed error logging
      const errorMsg = error?.response?.data?.message || "Failed to post job. Try again.";
      setMessage({ text: errorMsg, type: "error" });
    }
  };

  return (
    <>
      <Navbar />
      {user?.role === "employer" ? (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Post a New Job</h2>

          {!companyInfo && (
            <p className="mb-4 text-yellow-800 bg-yellow-100 border border-yellow-300 p-3 rounded text-center">
              ⚠️ Please complete your <strong>Company Profile</strong> before posting a job.
            </p>
          )}

          {message.text && (
            <p className={`p-3 text-center rounded-md ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message.text}
            </p>
          )}
<h1 className=" text-red-500 font-semibold my-4">* If admin did not approve company info you cant post jobs and u will get a error</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" className="w-full p-3 border rounded-lg" required disabled={!companyInfo} />

            <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border rounded-lg" disabled={!companyInfo}>
              <option value="">Select Job Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
            </select>

            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Job Description" className="w-full p-3 border rounded-lg" required disabled={!companyInfo} />

            <input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary" className="w-full p-3 border rounded-lg" required disabled={!companyInfo} />

            <input type="text" value={companyInfo ? `Company Name: ${companyInfo.name}` : ""} disabled className="w-full p-3 border rounded-lg font-bold bg-gray-50" />

            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 border rounded-lg" disabled={!companyInfo}>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>

           

            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50" disabled={!companyInfo}>
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
