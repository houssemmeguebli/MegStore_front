import React, { useEffect, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom"; // Import useLocation to detect the current route
import UserDropdown from "components/Dropdowns/UserDropdown.js";
import AuthService from "../../_services/AuthService";

export default function Navbar() {
  const [userName, setUserName] = useState("");
  const location = useLocation(); // Get current route
  const navigate =useNavigate();
  useEffect(() => {
    // Fetch the current user's data on mount
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.fullName) {
      setUserName(currentUser.fullName);
    }
  }, []);
  const handleLogout = () => {
    AuthService.logout(); // Call the logout method from AuthService
    localStorage.removeItem('token'); // Remove the token from local storage
    localStorage.removeItem('cart'); // Optional: Clear cart if needed
    navigate("/"); // Redirect to login page after logout
  };


  // Function to map the current route to a page title
  const getPageTitle = () => {
    const path = location.pathname;

    switch (path) {
      case "/admin/dashboard":
        return "Dashboard";
      case "/admin/categories":
        return "Categories";
      case "/admin/orders":
        return "Orders";
      case "/admin/products":
        return "Products";
      case "/admin/coupons":
        return "Coupons";
      case "/admin/customers":
        return "Customers";
      case "/admin/admins":
        return "Admins";
      case "/admin/adminProfile":
        return "MY Profile";
      default:
        return "Dashboard";
    }
  };

  return (
      <>
        {/* Navbar */}
        <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
          <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
            {/* Brand */}
            <a
                className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
            >
              {getPageTitle()} {/* Display dynamic page title */}
            </a>
            {/* User Info */}
            <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
              {/* Display the user's name and an icon */}
              <div className="flex items-center text-white mr-4">
                {/* User icon */}
                <i className="fas fa-user-circle text-2xl mr-2"></i>
                {/* User name */}
                <span className="text-white text-sm font-semibold">{userName}</span>
                <li className="flex items-center">
                  <button
                      title={"Logout"}
                      onClick={handleLogout}
                      className="lg:text-white lg:hover:text-gray-300 text-gray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                  >
                    <i className="lg:text-gray-300 text-gray-400 fas fa-sign-out-alt text-lg leading-lg mr-2"/>
                  </button>
                </li>
              </div>

            </ul>
          </div>
        </nav>
        {/* End Navbar */}
      </>
  );
}
