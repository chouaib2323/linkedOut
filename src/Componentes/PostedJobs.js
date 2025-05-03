import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import Navbar from "./Navbar";

function PostedJobs() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Holds search input
  const [refresh, setRefresh] = useState(false); // Triggers re-fetch when job status changes

  // Delete Job
  const deletePost = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("Token not found.");

      await axios.delete(`http://localhost:3004/employer/jobsdelete/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove job from state
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  // Fetch Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const userdata = localStorage.getItem("user");
        const user = userdata ? JSON.parse(userdata) : null;

        if (!user?.id) return console.error("User ID not found");

        const response = await axios.get("http://localhost:3004/employer/jobs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: { employerId: user.id },
        });

        setJobs(response.data[0] || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [refresh]); // Refresh when jobs are updated

  // Update Job Status
  const updateStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "open" ? "closed" : "open";
      await axios.put("http://localhost:3004/applications/updateStatus", 
        { id, status: newStatus }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // Update job status directly in state
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === id ? { ...job, status: newStatus } : job
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Filtered Jobs List (Optimized with useMemo)
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, jobs]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Posted Jobs</h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for a job..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-lg p-3 mb-6 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="w-full max-w-2xl">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-300">
                <h2 className="text-2xl font-semibold text-gray-800">{job.title}</h2>
                <p className=" mt-2 text-sky-500">{job.type}</p>
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
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => deletePost(job.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => updateStatus(job.id, job.status)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No jobs found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default PostedJobs;
