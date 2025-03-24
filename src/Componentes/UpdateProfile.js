import React from 'react'
import { useState } from "react";
import { useContext } from 'react';
import { CloseContext } from './Close';
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import axios from 'axios';
function UpdateProfile({}) {
    const { able, setAble } = useContext(CloseContext);
    const userdata = localStorage.getItem("user");
    const user = userdata ? JSON.parse(userdata) : null;
const updating= ()=>{
  setAble(!able)

}
const [data , setForm] = useState ({
    id : user.id,
    firstname : user.firstname,
    familyname  : user.familyname , 

})
    console.log(data)
    // Parse only if userdata is not null
    const handleChange = (e)=>{
        setForm({ ...data, [e.target.name]: e.target.value })
    }

    const updateData = async () => {
      try {
        const response = await axios.put('http://localhost:3004/auth/updateUser', data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        console.log(response); // Handle the response
      } catch (error) {
        console.error("Error updating user:", error); // Handle the error
      }
    };
    
   
  return (
    <div className=' z-10 absolute bottom-1/4 left-1/3  w-1/2 h-auto'>
        <div className=" w-3/4 h-auto bg-white  rounded-sm p-10 space-y-4">
        <h1 onClick={updating}  className=' cursor-pointer  float-right'> <X size={24} /> </h1>
            <h1 className="block text-gray-700 font-medium py-3 text-2xl">Role: {user?.role}</h1>
         
            <div>
          <label className="block text-gray-700 font-medium">First Name:</label>
          <input
            type="text"
name='firstname'
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Family Name:</label>
          <input
            type="text"
           name='familyname'
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
            onChange={handleChange}
          />
        </div>
<div>
<Link href=' ' className='font-bold text-sky-300'>update password</Link>
</div>
     


<button onClick={updateData} className=" p-2 font-bold rounded-sm text-white bg-green-400">Update</button>

            </div>
    </div>
  )
}

export default UpdateProfile