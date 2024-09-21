import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PagesDropdown from "components/Dropdowns/PagesDropdown.js";

export default function Navbar(props) {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      const itemCount = cartItems.reduce((total, item) => total + (item.length || 1), 0);
      setCartCount(itemCount);
    };

    // Initial count update
    updateCartCount();

    // Set up a timer to periodically check the cart count
    const intervalId = setInterval(updateCartCount, 1000); // Check every 1 second

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
      <>
        <nav className="top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-blueGray-800">
          <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
            <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
              <Link
                  className="text-white text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
                  to="/"
              >
                MegStore
              </Link>
              <button
                  className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                  type="button"
                  onClick={() => setNavbarOpen(!navbarOpen)}
              >
                <i className="text-white fas fa-bars"></i>
              </button>
            </div>
            <div
                className={
                    "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
                    (navbarOpen ? " block rounded shadow-lg" : " hidden")
                }
                id="example-navbar-warning"
            >
              <ul className="flex flex-col lg:flex-row list-none mr-auto">
                <li className="flex items-center">
                  <Link
                      className="lg:text-white lg:hover:text-gray-300 text-gray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                      to="/shop"
                  >
                    <i className="lg:text-gray-300 text-gray-400 fas fa-shopping-bag text-lg leading-lg mr-2" />
                    Shop
                  </Link>
                </li>
                <li className="flex items-center relative">
                  <Link
                      className="lg:text-white lg:hover:text-gray-300 text-gray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                      to="/cart"
                  >
                    <i className="lg:text-gray-300 text-gray-400 fas fa-shopping-cart text-lg leading-lg mr-2" />
                    Cart
                    {(cartCount) >= 0 && (
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 flex items-center justify-center text-white text-xs  rounded-full">
                      ({cartCount})
                    </span>
                    )}
                  </Link>
                </li>
              </ul>
              <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                <li className="flex items-center">
                  <PagesDropdown />
                </li>
                <li className="flex items-center">
                  <Link
                      className="lg:text-white lg:hover:text-gray-300 text-gray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                      to="/auth/login"
                  >
                    <i className="lg:text-gray-300 text-gray-400 fas fa-user text-lg leading-lg mr-2" />
                    Login
                  </Link>
                </li>
                <li className="flex items-center">
                  <Link
                      className="bg-white text-gray-700 active:bg-gray-50 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                      to="/shop"
                  >
                    <i className="fas fa-arrow-alt-circle-right"></i> Start Shopping
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </>
  );
}
