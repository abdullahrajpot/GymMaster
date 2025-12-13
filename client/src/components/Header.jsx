

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

const Header = () => {
  const { auth, setAuth } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("Logout successfully");
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isToolsDropdownOpen && !event.target.closest('.relative')) {
        setToolsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isToolsDropdownOpen]);

  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo (Stylized Text) */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-3xl sm:text-4xl font-extrabold text-yellow-400 tracking-widest">
            Gym<span className="text-white">Master</span>
          </span>
        </Link>

        {/* Hamburger Menu for Mobile */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* Navigation Links */}
        <nav className="hidden lg:flex space-x-8 items-center">
          <ul className="flex space-x-6 text-lg">
            <li>
              <Link to="/" className="text-white hover:text-yellow-400 transition-all duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/exercise" className="text-white hover:text-yellow-400 transition-all duration-300">
                Exercises
              </Link>
            </li>
            {/* Tools Dropdown */}
            <li className="relative">
              <button
                onClick={() => setToolsDropdownOpen(!isToolsDropdownOpen)}
                className="text-white hover:text-yellow-400 transition-all duration-300 flex items-center space-x-1"
              >
                <span>Tools</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isToolsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/nutrition-tracker"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setToolsDropdownOpen(false)}
                  >
                    Nutrition Tracker
                  </Link>
                  <Link
                    to="/workout-chart"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setToolsDropdownOpen(false)}
                  >
                    Workout Chart
                  </Link>
                  <Link
                    to="/diet-plan"
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setToolsDropdownOpen(false)}
                  >
                    Diet Plan
                  </Link>
                </div>
              )}
            </li>
            <li>
              <Link to="/feedback" className="text-white hover:text-yellow-400 transition-all duration-300">
                Feedback
              </Link>
            </li>
            {auth?.user?.name === "admin" && (
              <li>
                <Link to="/dashboard/admin/create-plane" className="text-white hover:text-yellow-400 transition-all duration-300">
                  Create Plan
                </Link>
              </li>
            )}
          </ul>

          {auth?.user ? (
            <>
              <Link to={auth.user.name === "admin" ? "/dashboard/admin" : "/dashboard/user"} className="text-white font-semibold hover:text-yellow-400 transition-all duration-300 capitalize">
                {auth.user.name}
              </Link>
              <button onClick={handleLogout} className="text-white hover:text-yellow-400 transition-all duration-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="text-white hover:text-yellow-400 transition-all duration-300">
                Register
              </Link>
              <Link to="/login" className="text-white hover:text-yellow-400 transition-all duration-300">
                Login
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-blue-600 py-4">
          <ul className="flex flex-col space-y-4 items-center text-lg">
            <li>
              <Link to="/" className="text-white hover:text-yellow-400 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/exercise" className="text-white hover:text-yellow-400 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                Exercises
              </Link>
            </li>
            {/* Mobile Tools Section */}
            <li className="text-white font-semibold">Tools</li>
            <li className="pl-4">
              <Link to="/nutrition-tracker" className="text-white hover:text-yellow-400 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                Nutrition Tracker
              </Link>
            </li>
            <li className="pl-4">
              <Link to="/workout-chart" className="text-white hover:text-yellow-400 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                Workout Chart
              </Link>
            </li>
            <li className="pl-4">
              <Link to="/diet-plan" className="text-white hover:text-yellow-400 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                Diet Plan
              </Link>
            </li>
            <li>
              <Link to="/feedback" className="text-white hover:text-yellow-400 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                Feedback
              </Link>
            </li>
            {auth?.user?.name === "admin" && (
              <li>
                <Link to="/dashboard/admin/create-plane" className="text-white hover:text-yellow-400 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                  Create Plan
                </Link>
              </li>
            )}
            {auth?.user ? (
              <>
                <Link to={auth.user.name === "admin" ? "/dashboard/admin" : "/dashboard/user"} className="text-white font-semibold hover:text-yellow-400 transition-all duration-300 capitalize" onClick={() => setMobileMenuOpen(false)}>
                  {auth.user.name}
                </Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-white hover:text-yellow-400 transition-all duration-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="text-white hover:text-yellow-400 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
                <Link to="/login" className="text-white hover:text-yellow-400 transition-all duration-300" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;



