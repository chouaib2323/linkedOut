import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userdata = localStorage.getItem("user");
  const user = userdata ? JSON.parse(userdata) : null;
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    navigate("/");
  };

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={` w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-blue-600 shadow-lg" : "bg-gradient-to-l from-gray-400 to-sky-400"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/Home" className="text-white text-2xl font-bold">
          Linked Out
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/Home" className="text-white hover:text-gray-200 font-bold">
            Home
          </Link>
          {user?.role === "employer" && (
            <Link to="/AddJob" className="text-white hover:text-gray-200 font-bold">
              Add a Job
            </Link>
          )}
       {(user?.role === "employer") && (
  <Link to="/CompanyForm" className="text-white hover:text-gray-200 font-bold">
    Company Info
  </Link>
)}

          {user?.role === "jobseeker" ? (
            <Link to="/Aplications" className="text-white hover:text-gray-200 font-bold">
              My Applications
            </Link>
          ) :''}
          {user?.role === "employer" ? (
            <Link to="/EmployerApplications" className="text-white hover:text-gray-200 font-bold">
              Received Applications
            </Link>):''
          }
          {user?.role === "employer" && (
            <Link to="/Postedjobs" className="text-white hover:text-gray-200 font-bold">
              Jobs
            </Link>
          )}
           {user?.role === "admin" && (
            <Link to="/AppCompanies" className="text-white hover:text-gray-200 font-bold">
              approve companies info 
            </Link>
          )}
          {user?.role === "employer" && (
            <Link to="/contact" className="text-white hover:text-gray-200 font-bold">
              Contact Admin
            </Link>
          )}
          {user ? (
            <>
              <Link to="/profile" className="text-white font-bold">Profile</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="text-white font-bold">Login</Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-blue-700 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 md:hidden p-6 flex flex-col space-y-4`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white"
          onClick={() => setIsOpen(false)}
        >
          <X size={28} />
        </button>

        {/* Mobile Menu Links */}
        <Link
          to="/Home"
          className="text-white text-lg font-semibold hover:text-gray-200"
          onClick={() => setIsOpen(false)}
        >
          Home
        </Link>
        {user?.role === "employer" && (
          <Link
            to="/AddJob"
            className="text-white text-lg font-semibold hover:text-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Add a Job
          </Link>
        )}
        {user?.role === "jobseeker" ? (
          <Link
            to="/applications"
            className="text-white text-lg font-semibold hover:text-gray-200"
            onClick={() => setIsOpen(false)}
          >
            My Applications
          </Link>
        ) : (
          
          user?.role === "employer" ?<Link
            to="/EmployerApplications"
            className="text-white text-lg font-semibold hover:text-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Received Applications
          </Link>:''
        )}
        {user?.role === "employer" && (
          <Link
            to="/Postedjobs"
            className="text-white text-lg font-semibold hover:text-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Jobs
          </Link>
        )}
        {user?.role === "employer" && (
          <Link
            to="/contact"
            className="text-white text-lg font-semibold hover:text-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Contact Admin
          </Link>
        )}
        {user ? (
          <>
            <Link
              to="/profile"
              className="text-white text-lg font-semibold hover:text-gray-200"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/"
            className="text-white text-lg font-semibold hover:text-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
