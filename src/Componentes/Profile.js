import React, { useState, useContext } from "react";
import Navbar from "./Navbar";
import UpdateProfile from "./UpdateProfile";
import { CloseContext } from "./Close";

function Profile() {
  const userdata = localStorage.getItem("user");
  const { able, setAble } = useContext(CloseContext);
  const user = userdata ? JSON.parse(userdata) : null;

  const toggleUpdateProfile = () => {
    setAble(!able);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <Navbar />

      <div className={`flex items-center justify-center min-h-screen transition-all duration-300 ${able ? "blur-sm bg-gray-300" : ""}`}>
        <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h1>
          <div className="space-y-3">
            <p className="text-gray-700"><span className="font-semibold">Role:</span> {user?.role || "N/A"}</p>
            <p className="text-gray-700"><span className="font-semibold">First Name:</span> {user?.firstname || "N/A"}</p>
            <p className="text-gray-700"><span className="font-semibold">Family Name:</span> {user?.familyname || "N/A"}</p>
            <p className="text-gray-700"><span className="font-semibold">Email:</span> {user?.email || "N/A"}</p>
          </div>
          <button 
            onClick={toggleUpdateProfile} 
            className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Update Profile
          </button>
        </div>
      </div>

      {able && <UpdateProfile sendDataToParent={setAble} />}
    </div>
  );
}

export default Profile;
