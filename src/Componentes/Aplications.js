import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

function Applications() {
    const [jobs, setJobs] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:3004/applications/seekerApplyed', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setJobs(response.data[0]);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };
        fetchJobs();
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto py-10 px-5">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">My Applications</h1>
                {jobs.length === 0 ? (
                    <p className="text-gray-600">You have not applied for any jobs yet.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <div key={job.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                                <div className="flex items-center mb-4">
                                    <img src={`http://localhost:3004${job.profile_image}`} alt={job.companyName} className="w-12 h-12 object-cover rounded-full mr-3" />
                                    <div>
                                        <h2 className="text-xl font-semibold">{job.title}</h2>
                                        <p className="text-gray-500 text-sm">{job.companyName}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-sm mb-2"><span className="font-medium">Location:</span> {job.location}</p>
                                <p className="text-gray-700 text-sm mb-2"><span className="font-medium">Salary:</span> {job.salary}</p>
                                <p className="text-gray-700 text-sm mb-2"><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded text-white ${job.status === 'open' ? 'bg-green-500' : 'bg-red-500'}`}>{job.status}</span></p>
                                <p className="text-gray-500 text-xs">Applied on: {new Date(job.applied_at).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Applications;
