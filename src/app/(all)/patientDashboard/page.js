'use client'

import React from 'react';
import LayoutForm from "../../layouts/layoutForm";
import { IoTime, } from "react-icons/io5";
import { MdCalendarMonth } from "react-icons/md";
import { BsCalendar2MonthFill } from "react-icons/bs";

export default function Opd() {
    return (
        <LayoutForm>
            <PatientDashboard />
        </LayoutForm>
    );
}

const PatientDashboard = () => {
    return (
        <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                <div className="bg-white  p-4 rounded-lg shadow-md text-center ">
                    <h3 className="text-lg md:text-xl font-semibold flex justify-start">Today Patients</h3>
                    <div className='flex justify-between py-9 p-4'>
                        <IoTime size={40} className='bg-teal-500 text-white p-1 rounded-md' />
                        <p className="text-3xl md:text-4xl font-medium">10</p>
                    </div>
                    <p className='flex justify-start text-teal-500'>Today's Total Patients</p>
                </div>
                <div className="bg-white  p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-lg md:text-xl font-semibold flex justify-start">Monthly Patients</h3>
                    <div className='flex justify-between py-9 p-4'>
                        <BsCalendar2MonthFill size={40} className='bg-orange-500 text-white p-2 rounded-md' />
                        <p className="text-3xl md:text-4xl font-medium">230</p>
                    </div>
                    <p className='flex justify-start text-orange-500'>Monthly Total Patients </p>
                </div>
                <div className="bg-white  p-4 rounded-lg shadow-md text-center">
                    <h3 className="text-lg md:text-xl font-semibold flex justify-start">Yearly Patients</h3>
                    <div className='flex justify-between py-9 p-4'>
                        <MdCalendarMonth size={40} className='bg-green-500 text-white p-1 rounded-md' />
                        <p className="text-3xl md:text-4xl font-medium">1500</p>
                    </div>
                    <p className='flex justify-start text-green-500'>Yearly Total Patients</p>
                </div>
            </div>





            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search Patients"
                        className="border p-2 rounded mb-2 md:mb-0 md:mr-2 flex-1"
                    />
                    <select className="border p-2 rounded mb-2 md:mb-0 md:mr-2 flex-1">
                        <option>Sort by...</option>
                    </select>
                    <select className="border p-2 rounded mb-2 md:mb-0 md:mr-2 flex-1">
                        <option>Gender...</option>
                    </select>
                    <input type="date" className="border p-2 rounded mb-2 md:mb-0 md:mr-2 flex-1" />
                </div>
                <div className="overflow-x-auto">
                    <div className="w-full " style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500 ">#</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Patient</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">created At</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500 ">Gender</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500 ">Blood Group</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500 ">Age</th>
                                </tr>

                            </thead>
                            <tbody>
                                <tr className="border border-gray-200 text-center">
                                    <td className="px-4 py-3 border border-gray-200 ">1</td>
                                    <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                    <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                    <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-green-50 border-green-500 text-green-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Male</button></td>
                                    <td className="px-4 py-3 border border-gray-200" >A+</td>
                                    <td className="px-4 py-3 border border-gray-200" >23</td>
                                </tr>
                                <tr className="border border-gray-200 text-center">
                                    <td className="px-4 py-3 border border-gray-200 ">2</td>
                                    <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                    <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                    <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-green-50 border-green-500 text-green-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Male</button></td>
                                    <td className="px-4 py-3 border border-gray-200" >A+</td>
                                    <td className="px-4 py-3 border border-gray-200" >23</td>
                                </tr>
                                <tr className="border border-gray-200 text-center">
                                    <td className="px-4 py-3 border border-gray-200 ">3</td>
                                    <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                    <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                    <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-red-50 border-red-500 text-red-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Female</button></td>
                                    <td className="px-4 py-3 border border-gray-200" >A+</td>
                                    <td className="px-4 py-3 border border-gray-200" >23</td>
                                </tr>
                                <tr className="border border-gray-200 text-center">
                                    <td className="px-4 py-3 border border-gray-200 ">4</td>
                                    <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                    <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                    <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-green-50 border-green-500 text-green-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Male</button></td>
                                    <td className="px-4 py-3 border border-gray-200" >A+</td>
                                    <td className="px-4 py-3 border border-gray-200" >23</td>
                                </tr>
                                <tr className="border border-gray-200 text-center">
                                    <td className="px-4 py-3 border border-gray-200 ">5</td>
                                    <td className="px-4 py-3 border border-gray-200" >Ravi Sharma</td>
                                    <td className="px-4 py-3 border border-gray-200" >26-07-2024</td>
                                    <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-red-50 border-red-500 text-red-500 w-[100px] h-[30px] text-md font-normal rounded-full'>Female</button></td>
                                    <td className="px-4 py-3 border border-gray-200" >A+</td>
                                    <td className="px-4 py-3 border border-gray-200" >23</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};
