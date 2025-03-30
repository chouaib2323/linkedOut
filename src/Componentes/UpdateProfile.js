import React, { useState, useContext } from "react";
import { CloseContext } from "./Close";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

function UpdateProfile() {
  const { able, setAble } = useContext(CloseContext);
  const userdata = localStorage.getItem("user");
  const user = userdata ? JSON.parse(userdata) : null;

  const [data, setForm] = useState({
    id: user?.id || "",
    firstname: user?.firstname || "",
    familyname: user?.familyname || "",
  });

  const handleChange = (e) => {
    setForm({ ...data, [e.target.name]: e.target.value });
  };

  const updateData = async () => {
    try {
      await axios.put("http://localhost:3004/auth/updateUser", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-lg bg-white rounded-lg p-6 shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={() => setAble(!able)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition duration-200"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Update Profile
        </h1>

        {/* Role */}
        <p className="text-gray-600 text-center mb-4">
          <strong>Role:</strong> {user?.role}
        </p>

        {/* First Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">First Name</label>
          <input
            type="text"
            name="firstname"
            value={data.firstname}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Family Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Family Name</label>
          <input
            type="text"
            name="familyname"
            value={data.familyname}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Update Password Link */}
        <div className="mb-6">
          <Link to="/update-password" className="text-blue-500 hover:underline">
            Update Password
          </Link>
        </div>

        {/* Update Button */}
        <button
          onClick={updateData}
          className="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-600 transition duration-200"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}

export default UpdateProfile;
