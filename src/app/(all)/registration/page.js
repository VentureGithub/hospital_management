"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import apiClient from "@/app/config";
import { useRouter } from 'next/navigation';

const Registration = () => {
    const router = useRouter();

    // State to manage input values
    const [formData, setFormData] = useState({
        userName: "",
        name: "",
        email: "",
        password: "",
        roles: [] 
    });

    // State for hospital name and loading
    const [hospital, setHospital] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Function to handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Special handling for role (which is an array in formData)
        if (name === "role") {
            setFormData((prevData) => ({
                ...prevData,
                roles: [value] // Update roles as an array with the selected role
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);

        try {
            const response = await apiClient.post(`user/register`, formData);
            console.log("Response from backend:", response);
            if (response.status === 200) {
                console.log("User successfully registered", response.data.data);
                alert("Successfully Registered");
                router.push("/dash"); // Redirect to login page
            }
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const role = localStorage.getItem("role");

        console.log({ accessToken, role });
        if (accessToken && role) {
            router.push("/dash");
        }
    }, []);

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Fetch hospital name
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
                                {isLoading ? "Hosptal" : hospital}
                            </h1>
                            <p className="mt-2 text-lg text-white flex justify-center">
                                Your Health, Our Priority
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Sign Up</h3>
                    <form className="w-full max-w-md space-y-6" onSubmit={handleSubmit}>
                        {/* Username Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="userName"
                                    placeholder="Username"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                />
                                <FaUser className="absolute left-3 top-2.5 text-gray-400" />
                            </div>
                        </div>
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                />
                                <FaEnvelope className="absolute left-3 top-2.5 text-gray-400" />
                            </div>
                        </div>
                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
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
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.roles[0] || ""}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                                <option value="">Select a role</option>
                                <option value="SUPERADMIN">Super Admin</option>
                                <option value="ADMIN">Admin</option>
                                <option value="USER">User</option>
                                <option value="DOCTOR">Doctor</option>
                                <option value="RECEPTION">Reception</option>
                                <option value="PHARMACY">Pharmacy</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Registration;













