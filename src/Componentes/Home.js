import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import Apply from './Apply';
import { useContext } from 'react';
import { CloseContext } from './Close';
function Home() {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {SelectedJob, setSelectedJo} =  useContext(CloseContext);
  const { able2, setAble2 } = useContext(CloseContext);
const token = localStorage.getItem('token')

const [formData, setForm] = useState({
  jobid : '',
  userid : '' ,
  status :'',
})

 
useEffect(()=>{
  setForm({
    jobid: SelectedJob&&SelectedJob.id,
    userid :  user&&user.id, 
    status : SelectedJob&&SelectedJob.status
  })
},[SelectedJob&&SelectedJob])

const handleForm= async()=>{
  try{
   
  await  axios.post("http://localhost:3004/applications/apply",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    alert("success")
  }catch(error){
console.log("the error is : ",error)
alert('error while submiting')
  }
}




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
        setError('Login to see jobs availble');
      } finally {
        setLoading(false);
       
      }
    };
    getJobs();
  }, []);

  return (
    <div className={`bg-slate-100 min-h-screen relative`}>
     {able2?  <Apply/>:""}
      <Navbar />

      <div className={`container mx-auto py-10 px-4 ${able2?'blur-md':''}`}>
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Welcome, {user ? user.firstname : 'Guest'}</h1>
        
        {loading ? (
          <p className="text-gray-600">Loading jobs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Job List */}
            <div className="w-full md:w-1/3 bg-white shadow-lg rounded-lg p-4 overflow-auto max-h-screen">
              <h2 className="text-xl font-semibold mb-4">Job Listings</h2>
              
              {jobs.length > 0 ? (
                jobs.map((job) => (
               
                  <div 
                    key={job.id} 
                    className="p-4 border-b hover:bg-gray-200 cursor-pointer flex items-center space-x-4" 
                    onClick={() => setSelectedJo(job)}
                  >
                       <img className='w-12 h-10 rounded-sm ' src={`http://localhost:3004${job.profile_image}`}/>
                       <div>   <h3 className="text-lg font-semibold text-blue-400 hover:underline">{job.title}</h3>
                       <p className="text-gray-500 text-sm">{job.location} - {job.salary}</p></div>
                 
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No jobs available at the moment.</p>
              )}
            </div>

            {/* Job Details */}
            <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg p-6">
              {SelectedJob ? (
                <div>
                  <div className=' flex space-x-3 items-center py-3'> <img className='w-20 h-14 rounded-sm ' src={`http://localhost:3004${SelectedJob.profile_image}`}/>
                  <h1 className='text-2xl font-semibold text-gray-800 '>{SelectedJob.companyName}</h1></div>
                 
                  <h2 className="text-xl font-semibold text-gray-800">{SelectedJob.title}</h2>
                  <p className="text-gray-600 mt-2">{SelectedJob.description}</p>
                  <p className="text-gray-500 mt-2">Location: {SelectedJob.location}</p>
                  <p className="text-gray-500 mt-2 font-bold">Salary: {SelectedJob.salary}</p>
                  <p className={`text-sm mt-2 font-semibold ${SelectedJob.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>Status: {SelectedJob.status}</p>
                 {user && user.role=='jobseeker'? <button onClick={()=>{setAble2(!able2)}} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Apply Now</button>:''} 
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