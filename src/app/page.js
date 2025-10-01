"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios"; 
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import apiClient from "./config";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    if (accessToken && role) {
      router.push("/dash");
    }
  }, []);

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInputs((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inputs.username || !inputs.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await apiClient.post(`user/login`, {
        username: inputs.username,
        password: inputs.password,
      });

      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("role", response.data.data.role);
        alert("Successfully Logged In");
        if (
          response?.data?.data?.role === "SUPERADMIN" ||
          response?.data?.data?.role === "ADMIN"
        ) {
          router.push("/dash");
        } else if (response?.data?.data?.role === "RECEPTION") {
          router.push("/receptiondashboard");
        }
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [hospital, setHospital] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const fetchHospital = async () => {
    try {
        setIsLoading(true);
        const response = await apiClient.get("hospitalProfile/getDataHospital");
        console.log("API Response:", response);

        // Extract hospital name from response
        if (
            response.data &&
            Array.isArray(response.data.data) &&
            response.data.data.length > 0 &&
            response.data.data[0].hospitalName
        ) {
            setHospital(response.data.data[0].hospitalName);
        } else {
            setHospital("Unknown Hospital");
        }
    } catch (error) {
        console.error("Error fetching hospital data:", error);
        setHospital("Error fetching hospital name");
    } finally {
        setIsLoading(false);
    }
};

useEffect(() => {
    fetchHospital();
}, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row w-11/12 md:w-3/4 lg:w-2/3 overflow-hidden">
        <div className="hidden md:flex w-1/2 bg-gray-200 items-center justify-center relative">
          <img
            src="/Frame 35634.svg"
            alt="Logo"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex justify-center mt-9">
            <div className="mt-6">
              <h1 className="text-white text-2xl font-bold text-center px-4">
              {isLoading ? "Hosptal " : hospital}
              </h1>
              <p className="mt-2 text-lg text-white flex justify-center">
                Your Health, Our Priority
              </p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back</h3>
          <form className="w-full max-w-md space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  onChange={handleInput}
                  value={inputs.username}
                  className="w-full pl-10 pr-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <FaUser className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleInput}
                  value={inputs.password}
                  className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <FaLock className="absolute left-3 top-2.5 text-gray-400" />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors"
            >
              Log In
            </button>
            {/* <div className="text-center">
              <Link
                href="/registration"
                className="text-sm text-gray-600 hover:text-blue-500 transition-colors"
              >
                Create an Account
              </Link>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

