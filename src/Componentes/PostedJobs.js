import axios from "axios";
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

function PostedJobs() {
  const [jobs, setJobs] = useState([]);
  const [jobDeleted, setJobDeleted] = useState(false);
  const deletePost = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found.");
        return;
      }

      await axios.delete(`http://localhost:3004/employer/jobsdelete/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted job from state
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      setJobDeleted(!jobDeleted); // Trigger re-fetch
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const userdata = localStorage.getItem("user");
        const user = userdata ? JSON.parse(userdata) : null;
console.log(user.id)
        if (!user || !user.id) {
          console.error("User ID not found");
          return;
        }

        const response = await axios.get("http://localhost:3004/employer/jobs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: { employerId: user.id },
           // Send employerId as query param
        });

        setJobs(response.data[0]); // Update state with fetched jobs
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  
  }, []);
  console.log(jobs)
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      
      <div className="max-w-2xl w-full">
        
<h1 className=' text-5xl text-center font-bold py-5'>Posted Jobs</h1>
<input type='text' placeholder=" search for a job " />
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-200"
          >
            <h2 className="text-2xl font-semibold text-gray-800">{job.title}</h2>
            <p className="text-gray-600 mt-2">{job.description}</p>
            <div className="mt-4">
              <p className="text-gray-700 font-medium">Salary: {job.salary}</p>
              <p className="text-gray-700 font-medium">Location: {job.location}</p>
              <p
                className={`mt-2 text-sm font-semibold px-3 py-1 inline-block rounded-full text-white ${
                  job.status === "open" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {job.status.toUpperCase()}
              </p>
              <p onClick={()=>deletePost(job.id)} className=" cursor-pointer bg-red-500 mt-2 text-sm font-semibold px-3 py-1 inline-block rounded-full text-white mx-2">delete</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default PostedJobs;
