import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

function EmployerApplications() {
    const [jobs, setJobs] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:3004/applications/getapplyedjobs', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setJobs(response.data[0]); // Set full data array
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };
        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto py-10 px-5">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Job Applications</h1>
                
                {jobs.length === 0 ? (
                    <p className="text-gray-600">No applications found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                                <p className="text-gray-600 mt-2">{job.companyName} - {job.location}</p>
                                <p className="text-gray-500 mt-1">Full name: {job.firstname} {job.familyname}</p>
                                <p className="text-gray-500">Email: {job.email}</p>
                                <p className="text-gray-500 mt-1"><strong>Applied on:</strong> {new Date(job.applied_at).toLocaleDateString()}</p>
                                <a className=' text-sky-500 hover:underline' href={`http://localhost:3004${job.path}`}>donwload CV</a>
                                {/* Cover Letter if available */}
                                {job.letter && (
                                    <div className="mt-3 p-3 bg-gray-50 rounded">
                                        <p className="text-gray-700 text-sm"><strong>Cover Letter:</strong></p>
                                        <p className="text-gray-600 text-sm">{job.letter}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployerApplications;
