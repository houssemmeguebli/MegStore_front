import React, {useRef, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import SweetAlert from "sweetalert2";
import AuthService from "../../../_services/AuthService";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {IconButton, InputAdornment} from "@mui/material"; // Import SweetAlert2 for alerts

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const rememberMeRef = useRef();
  const location = useLocation();
  const fromCart = location.state?.fromCart || false; // Check if redirected from cart

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await AuthService.login(email, password); // Login request
      // Check the value of the "Remember Me" checkbox using useRef
      if (rememberMeRef.current.checked) {
        localStorage.setItem('token', data.token);  // Store in localStorage if "Remember Me" is checked
      } else {
        sessionStorage.setItem('token', data.token); // Store in sessionStorage if "Remember Me" is not checked
      }
      SweetAlert.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'You have successfully logged in.',
      });
      const currentUser = AuthService.getCurrentUser();
      navigate(fromCart ? '/cart' : '/shop');
       if (currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin') {
        navigate('/admin/dashboard');  // Redirect Admin or SuperAdmin to dashboard
      }


    } catch (error) {
      SweetAlert.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email or password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <h2 className="text-center text-2xl font-bold text-blueGray-700">Welcome Back</h2>
                <hr className="mt-6 border-b-1 border-blueGray-300"/>
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form onSubmit={handleLogin}>
                  <div className="relative w-full mb-3">
                    <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Email"
                        required
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                        type={isPasswordVisible ? "text" : "password"} // Toggle between text and password
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                        required
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {isPasswordVisible ? (
                          <VisibilityOff className="text-gray-400"/> // Eye slash for hidden password
                      ) : (
                          <Visibility className="text-gray-400"/> // Eye for visible password
                      )}
                    </button>
                  </div>
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                          ref={rememberMeRef}
                          id="customCheckLogin"
                          type="checkbox"
                          className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                     Remember me
                      </span>
                    </label>
                  </div>

                  <div className="text-center mt-6">
                    <button
                        className={`bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={loading} // Disable button while loading
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <Link to="/auth/forgot-password" className="text-blueGray-200">
                  <small>Forgot password?</small>
                </Link>
              </div>
              <div className="w-1/2 text-right">
                <Link to="/auth/register" className="text-blueGray-200">
                  <small>Create new account</small>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
