import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function AppCompanies() {
  const [companies, setCompanies] = useState([]);
const token = localStorage.getItem('token')
  const fetchCompanies = async () => {
    const res = await axios.get("http://localhost:3004/admin/companies"
        ,{
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    setCompanies(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:3004/admin/companies/${id}/status`, {
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    fetchCompanies(); // refresh list
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <>
    <Navbar/>
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Companies</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Industry</th>
            <th className="p-2 border">Website</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="text-center">
              <td className="border p-2">{company.name}</td>
              <td className="border p-2">{company.location}</td>
              <td className="border p-2">{company.industry}</td>
              <td className="border p-2">
                <a href={company.website} target="_blank" rel="noreferrer">
                  Visit
                </a>
              </td>
              <td className="border p-2">{company.statue}</td>
              <td className="border p-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => updateStatus(company.id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => updateStatus(company.id, "not approved")}
                >
                  Disapprove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}

export default AppCompanies;
