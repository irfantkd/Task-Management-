import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user data from Redux store
  const { user } = useSelector((state) => state.auth);

  // Get first letter of user's name for profile circle
  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate("/auth/login");
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
              <p className="text-xs text-slate-400 -mt-1">Task Management</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-white">TaskFlow</h1>
            </div>
          </div>

          {/* Profile Section */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {/* Profile Circle */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-sm sm:text-base">
                  {getInitials(user?.name || user?.email)}
                </span>
              </div>

              {/* User Info - Hidden on mobile */}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white truncate max-w-32">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-slate-400 truncate max-w-32">
                  {user?.email || "user@example.com"}
                </p>
              </div>

              {/* Dropdown Arrow */}
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 z-50">
                {/* User Info in dropdown - Mobile only */}
                <div className="sm:hidden px-4 py-2 border-b border-slate-700">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 flex items-center space-x-2 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
