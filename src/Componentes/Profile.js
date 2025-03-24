import React, { useState } from "react";
import Navbar from "./Navbar";
import UpdateProfile from "./UpdateProfile";
import { useContext } from 'react';
import { CloseContext } from './Close';

function Profile() {
    const userdata = localStorage.getItem("user");
    const { able, setAble } = useContext(CloseContext);

    const handleDataFromChild = (data) => {
      setAble(data);
    };
const updating= ()=>{
  setAble(!able)
}
    
    // Parse only if userdata is not null
    const user = userdata ? JSON.parse(userdata) : null;

    console.log(user); // This should now log a proper object, not "[object Object]"

    return (
     
        <div className={` relative  min-h-screen  ` }>
             <Navbar/>
            
            <div className={` bg-gray-200 w-screen min-h-screen   grid place-items-center z-1 ${able?" bg-sky-100 blur-lg" : ""} `}>
           
        
            <div className=" w-3/4 h-auto bg-white  rounded-sm p-10 space-y-5">
             <h1 className="block text-gray-700 font-medium py-3 text-2xl">Role: {user?.role}</h1>
             <h1 className="block text-gray-700 font-medium">First Name: {user?.firstname || ""}</h1>
             <h1 className="block text-gray-700 font-medium">Family Name: {user?.familyname || ""}</h1>
             <h1 className="block text-gray-700 font-medium">Email: {user?.email || ""}</h1>
                <button onClick={updating} className=" p-2 text-white font-bold bg-green-400 rounded-sm">Update profile</button>
            </div>
             </div>
             {able?<UpdateProfile sendDataToParent={handleDataFromChild} />:""}
             </div>
    );
}

export default Profile;

