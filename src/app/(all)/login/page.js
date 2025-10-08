
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";  // Import Axios
import Link from "next/link";
import apiClient, { BaseUrl } from "../../config.js";

const Login = () => {
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        const role = localStorage.getItem('role')
        console.log({ accessToken, role })
        {
            if (accessToken && role) {
                router.push('hms/dash')
            }
        }
    }, [])


    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    });

    // Function to handle form inputs
    const handleInput = (e) => {
        const { name, value } = e.target;
        setInputs((prevData) => ({ ...prevData, [name]: value }));
    };

    // Function to handle login
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if all fields are filled
        if (!inputs.username || !inputs.password) {
            alert("Please fill in all fields");
            return;
        }

        try {
            // Send login request to the backend using Axios
            const response = await apiClient.post(`user/login`, {
                username: inputs.username, // Using username instead of email
                password: inputs.password
            });

            if (response.status === 200) {
                // If login is successful, redirect to dashboard
                localStorage.setItem('accessToken', response.data.data.accessToken);
                console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", localStorage.getItem('accessToken'))
                localStorage.setItem('role', response.data.data.role)
                alert("Successfully Login")
                if (response?.data?.data?.role === "SUPERADMIN" || response?.data?.data?.role === "ADMIN") {
                    router.push('hms/dash');
                }
                else if (response?.data?.data?.role === "RECEPTION") {
                    router.push('hms/receptiondashboard')
                }

            } else {
                // Handle errors, such as incorrect credentials
                alert("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred during login. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">


            <div className="relative w-[0%] lg:w-[70%] md:w-[60%] sm:w-[0%] h-screen">
                <Image
                    src="/dr.jpg"
                    alt="Hospital Management System"
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                    <h1 className="text-4xl font-semibold text-white">Welcome to Arogya Health Center</h1>
                    <p className="mt-4 text-lg text-white">Your Health, Our Priority</p>

                    {/* <button className="text-xl font-medium text-white border-solid border-2 border-stone-200 p-2 rounded-md mt-3">Get Started</button> */}
                </div>
            </div>

            <div className="w-[100%] lg:w-[30%] md:w-[40%] sm:w-[100%] flex flex-col justify-center items-center p-10">
                <h2 className="text-3xl font-bold mb-6">Log In</h2>

                <form className="w-full max-w-md" onSubmit={handleSubmit}>
                    {/* Username Input */}
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Username</label>
                        <div className="flex items-center border-b border-gray-400 py-2">
                            <input
                                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                type="text"
                                name="username"
                                placeholder="Enter Username"
                                aria-label="Username"
                                onChange={handleInput}
                                value={inputs.username}
                            />
                            <span className="text-gray-500">
                                <i className="fa fa-user"></i>
                            </span>
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                        <div className="flex items-center border-b border-gray-400 py-2">
                            <input
                                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                type="password"
                                name="password"
                                placeholder=""
                                aria-label="Password"
                                onChange={handleInput}
                                value={inputs.password}
                            />
                            <span className="text-gray-500">
                                <i className="fa fa-lock"></i>
                            </span>
                        </div>
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center mb-6">
                        <input type="checkbox" id="remember" className="mr-2" />
                        <label htmlFor="remember" className="text-sm">Remember me</label>
                    </div>

                    {/* Submit Button */}
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                        type="submit"
                    >
                        Log In
                    </button>

                    <div className="mt-6 text-center">
                        <Link href="/registration" className="text-blue-600 text-sm">Create an account</Link>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default Login;
