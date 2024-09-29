import React, { useState, useEffect } from "react";
import AuthService from "../../../_services/AuthService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    gender: "",
    role: 1,
    dateOfCreation: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    validateFields();
  }, [formData, confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Parse the value to an integer if the name is 'gender'
    const parsedValue = name === "gender" ? parseInt(value) : value;

    // Use parsedValue for updating formData
    setFormData((prevData) => ({ ...prevData, [name]: parsedValue }));

    // Check password strength if the changed field is password
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
  };

  const validateFields = () => {
    let fieldErrors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      fieldErrors.fullName = "Full Name is required.";
    } else if (formData.fullName.length < 3) {
      fieldErrors.fullName = "Full Name must be at least 3 characters long.";
    }

    // Email
    if (!formData.email) {
      fieldErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      fieldErrors.email = "Invalid email format.";
    }

    // Password validation according to .NET Identity constraints
    if (!formData.password) {
      fieldErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      fieldErrors.password = "Password must be at least 6 characters long.";
    } else if (!/[A-Z]/.test(formData.password)) {
      fieldErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(formData.password)) {
      fieldErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/\d/.test(formData.password)) {
      fieldErrors.password = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      fieldErrors.password = "Password must contain at least one special character.";
    }

    // Confirm Password
    if (!confirmPassword) {
      fieldErrors.confirmPassword = "Confirm Password is required.";
    } else if (formData.password !== confirmPassword) {
      fieldErrors.confirmPassword = "Passwords do not match.";
    }

    // Date of Birth
    if (!formData.dateOfBirth) {
      fieldErrors.dateOfBirth = "Date of Birth is required.";
    }

    // Phone Number
    if (!formData.phoneNumber) {
      fieldErrors.phoneNumber = "Phone Number is required.";
    } else if (!/^\d{10,15}$/.test(formData.phoneNumber)) {
      fieldErrors.phoneNumber = "Phone Number must be between 10 to 15 digits.";
    }

    // Address
    if (!formData.address.trim()) {
      fieldErrors.address = "Address is required.";
    }

    // Gender
    if (formData.gender === null || formData.gender === "") {
      fieldErrors.gender = "Gender is required.";
    }

    setErrors(fieldErrors);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    validateFields();
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      console.log("formData",formData)
      await AuthService.register(formData);
      console.log("formData",formData)

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "You can now login to your account.",
      });

      navigate("/auth/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Please try again.",
      });
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 1: return "bg-red-500";
      case 2: return "bg-yellow-500";
      case 3: return "bg-blue-500";
      case 4: return "bg-green-500";
      case 5: return "bg-teal-500";
      default: return "bg-gray-300";
    }
  };

  return (
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">Register Now!</h6>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form onSubmit={handleRegister}>
                  {/* Full Name */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Full Name"
                    />
                    {errors.fullName && touched.fullName && (
                        <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Email"
                    />
                    {errors.email && touched.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Password"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                    <div className="h-1 bg-gray-300 rounded mt-1">
                      <div
                          className={`h-full rounded ${getPasswordStrengthColor(passwordStrength)}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    {errors.password && touched.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={handleBlur}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Confirm Password"
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        max={today}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                    {errors.dateOfBirth && touched.dateOfBirth && (
                        <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Phone Number</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Phone Number"
                    />
                    {errors.phoneNumber && touched.phoneNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Address"
                    />
                    {errors.address && touched.address && (
                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Gender</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value={0}>Male</option>
                      <option value={1}>Female</option>
                    </select>
                    {errors.gender && touched.gender && (
                        <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="text-center mt-6">
                    <button
                        type="submit"
                        className="bg-blueGray-800 text-white active:bg-blueGray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
