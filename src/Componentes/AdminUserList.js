import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function AdminUserList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3004/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3004/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers(); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
    <Navbar/>
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">User Management</h1>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
  {users
    .filter(user => user.email !== "admin@gmail.com") 
    .map((user) => (
      <tr key={user.id}>
        <td className="border p-2 text-center">{user.id}</td>
        <td className="border p-2 text-center">{user.name}</td>
        <td className="border p-2 text-center">{user.email}</td>
        <td className="border p-2 text-center">
          <button
            onClick={() => deleteUser(user.id)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  
  {// here i could add the admin info the .env file but time is rinning out -*-
  users.filter(user => user.email !== "admin@gmail.com").length === 0 && (
    <tr>
      <td colSpan="4" className="text-center p-4">No users found</td>
    </tr>
  )}
</tbody>

      </table>
    </div>
    </>
  );
}

export default AdminUserList;
