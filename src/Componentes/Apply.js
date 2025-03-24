import React, { useState } from "react";
import { X } from "lucide-react";
import { useContext } from 'react';
import { CloseContext } from './Close';
import axios from "axios";

function Apply() {

  const userdata = localStorage.getItem("user");
  const user = userdata ? JSON.parse(userdata) : null;
  const { able2, setAble2 } = useContext(CloseContext);
  const { SelectedJob } = useContext(CloseContext);
  const [file, setFile] = useState(null);
const token = localStorage.getItem('token')
  const [formData, setForm] = useState({
    jobid: SelectedJob?.id || "",
    userid: user?.id || "",
    status: SelectedJob?.status || "",
    letter: "",
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store file in state
  };

  const handleLetter = (e) => {
    setForm({ ...formData, letter: e.target.value });
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a resume.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("jobid", formData.jobid);
    submissionData.append("userid", formData.userid);
    submissionData.append("status", formData.status);
    submissionData.append("letter", formData.letter);
    submissionData.append("file", file);

    try {
      const response = await axios.post("http://localhost:3004/applications/apply", submissionData, {
        headers: { "Content-Type": "multipart/form-data"  , "authorization": `Bearer ${token}`},
      });

      alert(response.data.message || "Application submitted successfully!");
    } catch (error) {
      console.error("File upload failed:", error);
      alert("Error submitting application.");
    }
  }

  return (
    <div className="absolute pt-20 md:left-1/4 w-1/2 h-auto flex justify-center z-40">
      
      <div className="w-3/4 p-6 space-y-4 flex flex-col items-center rounded-md bg-slate-100 shadow-lg">
    <h1 className="  float-right w-full " onClick={()=>{setAble2(!able2)}}><X size={24} /></h1>  
        <h2 className="text-xl font-bold text-gray-800">Apply for Role</h2>

        <div className="w-full">
          <label className="font-bold text-gray-700">Role:</label>
          <p className="text-gray-800 text-lg">{user?.role || "N/A"}</p>
        </div>

        <div className="w-full">
          <label className="font-bold text-gray-700">First Name:</label>
          <input
            disabled
            value={user?.firstname || ""}
            className="w-full p-2 border rounded-md bg-gray-200 text-gray-700"
          />
        </div>

        <div className="w-full">
          <label className="font-bold text-gray-700">Family Name:</label>
          <input
            disabled
            value={user?.familyname || ""}
            className="w-full p-2 border rounded-md bg-gray-200 text-gray-700"
          />
        </div>

        <div className="w-full">
          <label className="font-bold text-gray-700">Email:</label>
          <input
            disabled
            value={user?.email || ""}
            className="w-full p-2 border rounded-md bg-gray-200 text-gray-700"
          />
        </div>

        <div className="w-full">
          <label className="font-bold text-gray-700">motivation letter:</label>
          <textarea
            onChange={handleLetter}
            className="w-full p-2 border rounded-md bg-gray-200 text-gray-700"
          ></textarea>
        </div>

        <div className="w-full">
          <label className="font-bold text-gray-700">Upload Resume:</label>
          <input onChange={handleFileChange} type="file" className="w-full p-2 border rounded-md bg-white" />
        </div>

        <button  onClick={handleSubmit} className="w-full p-3 text-white font-bold bg-green-500 hover:bg-green-600 rounded-md transition">
          Apply
        </button>
      </div>
    </div>
  );
}

export default Apply;
