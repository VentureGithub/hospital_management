"use client"
import React, { useEffect } from 'react';
import LayoutForm from "../../layouts/layoutForm";
import { BsPerson } from "react-icons/bs";
import { useRouter } from 'next/navigation';
import { FaUsers } from "react-icons/fa";
import { FaHospital } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";

export default function Opd() {
    return (
        <LayoutForm>
            <Dash />
        </LayoutForm>
    );
}

const Dash = () => {
    const router = useRouter()


    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
            router.push('/login')
        }
    }, [])

    // useEffect(() => {
    //     router.prefetch('/opdregistrationform');
    // }, []);



    return (
        <>
            {/* <div className="p-4 md:p-6 bg-gray-100 min-h-screen"> */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4 bg-gray-100">
            
                <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg shadow-md text-center transition-transform transform hover:scale-105 hover:shadow-xl">
                    <a href="/hospital">
                        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-5 rounded-lg text-white">
                            <div className="flex justify-between items-center my-6">
                                <div>
                                    <h4 className="text-xl font-semibold flex justify-start">Hospital Profile</h4>
                                </div>
                                <div className="text-4xl">
                                    <FaHospital size={40} className="p-1 rounded-md" />
                                </div>
                            </div>
                        </div>
                    </a>
                </div>

                <div className="bg-gradient-to-r from-green-400 to-teal-400 rounded-lg shadow-md text-center transition-transform transform hover:scale-105 hover:shadow-xl">
                    <a href="/newuser">
                        <div className="bg-gradient-to-r from-green-400 to-teal-400 p-5 rounded-lg text-white">
                            <div className="flex justify-between items-center my-6">
                                <div>
                                    <h4 className="text-xl font-semibold flex justify-start">New User</h4>
                                </div>
                                <div className="text-4xl">
                                    <FaUserEdit size={40} className="p-1 rounded-md" />
                                </div>
                            </div>
                        </div>
                    </a>
                </div>

                <div className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-lg shadow-md text-center transition-transform transform hover:scale-105 hover:shadow-xl">
                    <a href="/receptiondashboard">
                        <div className="bg-gradient-to-r from-purple-400 to-indigo-400 p-5 rounded-lg text-white">
                            <div className="flex justify-between items-center my-6">
                                <div>
                                    <h4 className="text-xl font-semibold flex justify-start">Reception</h4>
                                </div>
                                <div className="text-4xl">
                                    <FaUserAlt size={40} className="p-1 rounded-md" />
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg shadow-md text-center transition-transform transform hover:scale-105 hover:shadow-xl">
                    <a href="/users">
                        <div className="bg-gradient-to-r from-blue-400 to-indigo-400 p-5 rounded-lg text-white">
                            <div className="flex justify-between items-center my-6">
                                <div>
                                    <h4 className="text-xl font-semibold flex justify-start">Total User</h4>
                                </div>
                                <div className="text-4xl">
                                    <FaUsers size={40} className="p-1 rounded-md" />
                                </div>
                            </div>
                        </div>
                    </a>
                </div>

            </div>

            <div className="p-4  bg-gray-100 ">
                <div className="bg-white p-2 md:p-2 rounded-lg shadow-md">
                    <label className='text-md font-medium'>Recent Transaction</label>
                    <div className="overflow-x-auto">
                        <div className="w-full " style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <table className="table-auto w-full border border-collapse shadow">
                                <thead>
                                    <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500 ">#</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Patient</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Date</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500 ">Status</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500 ">Amount</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500 ">Method</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">1</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-blue-50 border-blue-500 text-blue-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Paid</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">2</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-orange-50 border-orange-500 text-orange-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Pending</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">3</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-blue-50 border-blue-500 text-blue-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Paid</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">4</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-red-50 border-red-500 text-red-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Cancel</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">4</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-blue-50 border-blue-500 text-blue-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Paid</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">4</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-orange-50 border-orange-500 text-orange-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Pending</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">4</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-blue-50 border-blue-500 text-blue-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Paid</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">4</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-red-50 border-red-500 text-red-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Cancel</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">4</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-blue-50 border-blue-500 text-blue-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Paid</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div> */}
            <div className="p-4 "></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-2">
                {/* Card Component */}
                {[
                    { href: "/hospital", imgSrc: "/ite2.svg", title: "Hospital Profile" },
                    { href: "/newuser", imgSrc: "/newuser.svg", title: "Create User" },
                    { href: "/receptiondashboard", imgSrc: "/dashboard.svg", title: "Reception" },
                    { href: "/users", imgSrc: "/users.svg", title: "Users" },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="rounded-lg shadow-md text-center transition-transform transform hover:-translate-y-2 hover:shadow-xl bg-white group"
                    >
                        <a href={item.href}>
                            <div className="p-2 rounded-lg">
                                <div className="flex flex-col items-center">
                                    {/* Image with hover effect */}
                                    <div className="relative w-[130px] h-[100px] overflow-hidden">
                                        <img
                                            src={item.imgSrc}
                                            alt={item.title}
                                            className="transition-transform duration-300 group-hover:scale-110 w-full h-full object-contain"
                                        />
                                    </div>
                                    {/* Title */}
                                    <h4 className="text-xl font-semibold text-blue-500 mt-4 transition-colors duration-300 group-hover:text-blue-700">
                                        {item.title}
                                    </h4>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
            <div className="py-4  ">
                <div className="bg-white p-2 md:p-2 rounded-lg shadow-md">
                    <label className='text-md font-medium'>Recent Transaction</label>
                    <div className="overflow-x-auto">
                        <div className="w-full " style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <table className="table-auto w-full border border-collapse shadow">
                                <thead>
                                    <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500 ">#</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Patient</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Date</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500 ">Status</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500 ">Amount</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500 ">Method</th>
                                    </tr>

                                </thead>
                                <tbody>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">1</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-blue-50 border-blue-500 text-blue-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Paid</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">2</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-orange-50 border-orange-500 text-orange-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Pending</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">3</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-blue-50 border-blue-500 text-blue-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Paid</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">4</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-red-50 border-red-500 text-red-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Cancel</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">4</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-blue-50 border-blue-500 text-blue-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Paid</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">4</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-orange-50 border-orange-500 text-orange-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Pending</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">4</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-blue-50 border-blue-500 text-blue-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Paid</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">4</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-red-50 border-red-500 text-red-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Cancel</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                    <tr className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 ">4</td>
                                        <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                        <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                        <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-blue-50 border-blue-500 text-blue-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Paid</button></td>
                                        <td className="px-4 py-3 border border-gray-200" >1000</td>
                                        <td className="px-4 py-3 border border-gray-200" >Cash</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
               
                </div>
            </div>


        </>
    );
};
