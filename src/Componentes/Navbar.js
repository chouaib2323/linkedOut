import { useState , useEffect } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const userdata = localStorage.getItem("user");

    // Parse only if userdata is not null
    const user = userdata ? JSON.parse(userdata) : null;
    const navigate = useNavigate();
const deletDAta = ()=>{
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    navigate('/login')

}

    return (
        <nav className=" from-gray-400  to-sky-400 bg-gradient-to-l p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-2xl font-bold">Linked out</Link>
                
                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6 items-center">
                    <Link to="/" className="text-white hover:text-gray-200 font-bold">Home</Link>
                  {user && user.role=='employer'?<Link to="/AddJob" className="text-white hover:text-gray-200 font-bold">ADD a Job</Link>:''}  
                  {user && user.role=='jobseeker'?<Link to="/aplications" className="text-white hover:text-gray-200 font-bold">My Applications</Link>:<Link to="/EmployerApplications" className="text-white hover:text-gray-200 font-bold">My Applications</Link>} 
                  {user && user.role=='employer'?<Link to="/Postedjobs" className="text-white hover:text-gray-200 font-bold">jobs</Link>:''} 
                  {user && user.role=='employer'? <Link to="/contact" className="text-white hover:text-gray-200 font-bold">Contact The Admin </Link>:''}
    
                    {user ? (
                    <>
                        <Link to="/profile" className="text-white mr-4 font-bold">Profile</Link>
                        <button onClick={deletDAta} className="bg-red-500 text-white px-3 py-1 rounded font-bold ">Logout</button>
                    </>
                ) : (
                    <Link to="/login" className="text-white font-bold" >Login</Link>
                )}
                </div>
                
                {/* Mobile Menu Button */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
            
            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden flex flex-col bg-blue-700 p-4 space-y-3">
                    <Link to="/" className="text-white hover:text-gray-200" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/about" className="text-white hover:text-gray-200" onClick={() => setIsOpen(false)}>About</Link>
                    <Link to="/services" className="text-white hover:text-gray-200" onClick={() => setIsOpen(false)}>Services</Link>
                    <Link to="/contact" className="text-white hover:text-gray-200" onClick={() => setIsOpen(false)}>Contact</Link>
                    {user ? (
                    <>
                        <Link to="/profile" className="text-white mr-4">Profile</Link>
                        <button onClick={deletDAta} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
                    </>
                ) : (
                    <Link to="/login" className="text-white">Login</Link>
                )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
