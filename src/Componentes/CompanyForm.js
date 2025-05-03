import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const CreateCompanyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    industry: '',
    website: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [logo, setCompanyLogo] = useState(null);
  const [companyExists, setCompanyExists] = useState(false);
  const [existingCompany, setExistingCompany] = useState(null);

  // Check if the company already exists
  useEffect(() => {
    const checkCompany = async () => {
      try {
        const token = localStorage.getItem('token');
        const resp = await axios.get('http://localhost:3004/employer/checkCompany', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (resp.data?.company?.length > 0) {
          setCompanyExists(true);
          setExistingCompany(resp.data.company[0]);
        }
      } catch (err) {
        console.error("Error checking company:", err);
      }
    };

    checkCompany();
  }, []);

  const handleFileChange = (e) => {
    setCompanyLogo(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const jobData = new FormData();
      Object.keys(formData).forEach((key) => {
        jobData.append(key, formData[key]);
      });

      if (logo) {
        jobData.append("logo", logo); // Must match multer field name
      }

      const response = await axios.post(
        'http://localhost:3004/Company/CompanyInfo',
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`
            // DO NOT manually set Content-Type!
          }
        }
      );

      setSuccessMessage('Company info saved successfully!');
      setErrorMessage('');
      setFormData({ name: '', location: '', industry: '', website: '' });
      setCompanyLogo(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Something went wrong');
      setSuccessMessage('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-28">
        <h2 className="text-xl font-semibold mb-4">Create Company Profile</h2>

        {/* If company already exists, show message instead of form */}
        {companyExists ? (
          <div className="text-yellow-800 bg-yellow-100 border border-yellow-300 p-4 rounded text-center">
            ⚠️ You have already created a company profile:
            <p className="mt-2 font-semibold">{existingCompany?.name}</p>
            <p className="text-sm text-gray-600">
              To update or manage your company, please go to your company dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}

            <div>
              <label className="block">Company Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block">Logo of company</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Save Company
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default CreateCompanyForm;
