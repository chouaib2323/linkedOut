import React, { useState, useEffect, useContext } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import Apply from './Apply';
import { CloseContext } from './Close';

function Home() {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { SelectedJob, setSelectedJo } = useContext(CloseContext);
  const { able2, setAble2 } = useContext(CloseContext);
  const token = localStorage.getItem('token');

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');

  const [formData, setForm] = useState({
    jobid: '',
    userid: '',
    status: '',
  });

  useEffect(() => {
    setForm({
      jobid: SelectedJob && SelectedJob.id,
      userid: user && user.id,
      status: SelectedJob && SelectedJob.status,
    });
  }, [SelectedJob]);

  const handleForm = async () => {
    try {
      await axios.post(
        'http://localhost:3004/applications/apply',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('success');
    } catch (error) {
      console.log('the error is : ', error);
      alert('error while submitting');
    }
  };

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3004/employer/alljobs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setJobs(response.data[0]);
      } catch (err) {
        setError('Login to see jobs available');
      } finally {
        setLoading(false);
      }
    };
    getJobs();
  }, []);

  const handleCheckboxChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(job.type);
    const matchesSearch =
      job.title.toLowerCase().includes(searchTitle.toLowerCase());
    return matchesType && matchesSearch;
  });

  const [companyInfo, setInfo] = useState(null);
  useEffect(() => {
    const checkCompany = async () => {
      try {
        const token = localStorage.getItem("token");
        const resp = await axios.get("http://localhost:3004/Company/allCompanies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (resp && resp.data) {
          setInfo(resp.data.company[0]);
          
        }
      } catch (err) {
        console.error("Error checking company:", err);
      }
    };

    checkCompany();
  }, []);
  return (
    <div className={`bg-slate-100 min-h-screen relative`}>
      {able2 ? <Apply /> : ''}
      <Navbar />

      <div className={`container mx-auto py-10 px-4 ${able2 ? 'blur-md' : ''}`}>
        <h1 className="text-3xl font-semibold text-sky-500 mb-6">
          Welcome, {user ? user.firstname : 'Guest'}
        </h1>

        {/* Search Input */}
        <div className="mb-6  flex justify-center">
          <input
            type="text"
            placeholder="Search jobs by title..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {loading ? (
          <p className="text-gray-600">Loading jobs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Job List */}
            <div className="w-full md:w-1/3 bg-white shadow-lg rounded-lg p-4 overflow-auto max-h-screen">
              <h2 className="text-xl font-semibold mb-4">Job Listings</h2>

              {/* Job Type Filter */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Filter by Job Type
                </label>
                <div className="space-x-2 flex flex-wrap">
                  {['Full Time', 'Part Time', 'Internship'].map((type) => (
                    <label
                      key={type}
                      className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={type}
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleCheckboxChange(type)}
                        className="accent-blue-600 w-4 h-4"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 border-b hover:bg-gray-200 cursor-pointer flex items-center space-x-4"
                    onClick={() => setSelectedJo(job)}
                  >
                    <img
                      className="w-12 h-10 rounded-sm"
                      src={`http://localhost:3004${companyInfo&&companyInfo.logo}`}
                      alt="Company Logo"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-400 hover:underline">
                        {job.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {job.location} - {job.salary}
                      </p>
                      {job.type && (
                        <p className="text-sm text-gray-600 italic">Type: {job.type}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No jobs match your search and filters.</p>
              )}
            </div>

            {/* Job Details */}
            <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg p-6">
              {SelectedJob ? (
                <div>
                  <div className="flex space-x-3 items-center py-3">
                    <img
                      className="w-20 h-14 rounded-sm"
                      src={`http://localhost:3004${companyInfo&&companyInfo.logo}`}
                      alt="Company Logo"
                    />
                    <h1 className="text-2xl font-semibold text-gray-800">
                      {companyInfo&&companyInfo.name}
                    </h1>
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800">Title : {SelectedJob.title}</h2>
                  {SelectedJob.type && (
                    <>
                      <h1 className=" font-semibold pt-2">About the {SelectedJob.type} :</h1>
                      <p className="text-gray-600 mt-2">{SelectedJob.description}</p>
                    </>
                  )}
                  <p className="text-gray-500 mt-2">Location: {companyInfo&&companyInfo.location}</p>
                  <p className="text-gray-500 mt-2">company website: {companyInfo&&companyInfo.website}</p>
                  <p className="text-gray-500 mt-2">company industry: {companyInfo&&companyInfo.industry}</p>
                  <p className="text-gray-500 mt-2 font-bold">Salary: {SelectedJob.salary}</p>
                  <p
                    className={`text-sm mt-2 font-semibold ${
                      SelectedJob.status === 'open' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    Status: {SelectedJob.status}
                  </p>
                  {user && user.role === 'jobseeker' ? (
                    <button
                      onClick={() => setAble2(!able2)}
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Apply Now
                    </button>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                <p className="text-gray-600">Select a job to view details.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
