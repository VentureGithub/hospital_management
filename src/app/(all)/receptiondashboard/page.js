"use client"
import React, { useState, useEffect } from 'react';
import LayoutForm from "../../layouts/layoutForm";
import { GiMedicines } from "react-icons/gi";
import { FaBed, FaArrowRightFromBracket } from "react-icons/fa6";
import { ImPlus } from "react-icons/im";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { IoIosLogOut } from "react-icons/io";


export function ReceptionDashboard() {
    return (
        <LayoutForm>
            <Reception />
        </LayoutForm>
    );
}


const Reception = () => {
    const [selectedTable, setSelectedTable] = useState('IPD'); // State to manage selected table
    const [searchOpdQuery, setSearchOpdQuery] = useState("");// filter for opd
    const [searchIpdQuery, setSearchIpdQuery] = useState("");// filter for ipd
    const [searchDischargeQuery, setSearchDischargeQuery] = useState("");// filter for ipd
    const [searchAmbulanceQuery, setSearchAmbulanceQuery] = useState("");// filter for ipd
    const [searchIpdToday, setSearchIpdToday] = useState(0);// today ipd
    const [searchOpdToday, setSearchOpdToday] = useState(0);// today opd
    const [searchDischargeToday, setSearchDischargeToday] = useState(0);// today Discharge
    const [searchAmbulanceToday, setSearchAmbulanceToday] = useState(0);// today Ambulance
    const [ipd, setIpd] = useState([]);
    const [opd, setOpd] = useState([]);
    const [discharge, setDischarge] = useState([]);
    const [ambulance, setAmbulance] = useState([]);

    const fetchIpd = async () => {
        try {
            const response = await apiClient.get(`ipdregistration/getAllTodayAdmitPatient`);
            setIpd(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchIpd();
    }, []);


    const fetchDischarge = async () => {
        try {
            const response = await apiClient.get(`dischargePatient/bill/getAllTodayPatientDetails`);
            setDischarge(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchDischarge();
    }, []);


    const fetchOpd = async () => {
        try {
            const response = await apiClient.get(`getAllTodayVisitPatient`);
            setOpd(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchOpd();
    }, []);

    const fetchAmbulance = async () => {
        try {
            const response = await apiClient.get(`ambulanceBooking/GetAllTodayBooking`);
            setAmbulance(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchAmbulance();
    }, []);

    const fetchIPdToday = async () => {
        try {
            const response = await apiClient.get(`ipdregistration/getAllTodayPatient`);
            setSearchIpdToday(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const fetchOPdToday = async () => {
        try {
            const response = await apiClient.get(`getAllTotalPateint/today`);
            setSearchOpdToday(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchDischargeToday = async () => {
        try {
            const response = await apiClient.get(`dischargePatient/bill/getAllDischargePatient/today`);
            setSearchDischargeToday(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchAmbulanceToday = async () => {
        try {
            const response = await apiClient.get(`ambulanceBooking/getTodayBookingCount`);
            setSearchAmbulanceToday(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    useEffect(() => {
        fetchIPdToday();
        fetchOPdToday();
        fetchDischargeToday();
        fetchAmbulanceToday();
    }, []);



    //search for opd num
    const filteredOPD = opd?.filter((transaction) =>
        transaction.opdNo.toLowerCase().includes(searchOpdQuery.toLowerCase()) ||
        transaction.patientName.toLowerCase().includes(searchOpdQuery.toLowerCase()) ||
        transaction.gender.toLowerCase().includes(searchOpdQuery.toLowerCase())
    );

    //search for ipd num
    const filteredIPD = ipd?.filter((transaction) =>
        transaction.ipdNo.toLowerCase().includes(searchIpdQuery.toLowerCase()) ||
        transaction.patientName.toLowerCase().includes(searchIpdQuery.toLowerCase()) ||
        transaction.gender.toLowerCase().includes(searchIpdQuery.toLowerCase())
    );

    //search for ambulance num
    const filteredAmbulance = ambulance?.filter((transaction) =>
        transaction.ambulanceNumber.toLowerCase().includes(searchAmbulanceQuery.toLowerCase()) ||
        transaction.patientName.toLowerCase().includes(searchAmbulanceQuery.toLowerCase()) ||
        transaction.empName.toLowerCase().includes(searchAmbulanceQuery.toLowerCase())
    );

    //search for discharge num
    const filteredDischarge = discharge?.filter((transaction) =>
        transaction.ipdNo.toLowerCase().includes(searchDischargeQuery.toLowerCase()) ||
        transaction.patientName.toLowerCase().includes(searchDischargeQuery.toLowerCase()) ||
        transaction.gender.toLowerCase().includes(searchDischargeQuery.toLowerCase())
    );


    const renderTable = () => {
        if (selectedTable === 'IPD') {
            return (
                <div className="bg-white p-2 my-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold mb-4">IPD Patients Table</h2>
                    <div className="flex flex-col md:flex-row w-[100%] sm:w-[100%] md:w-[60%] lg:w-[35%] justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Search 'Patients'"
                            className="border p-2 rounded mb-2 md:mb-0 md:mr-2 flex-1"
                            value={searchIpdQuery}
                            onChange={(e) => setSearchIpdQuery(e.target.value)}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <table className="table-auto w-full border border-collapse shadow">
                                <thead>
                                    <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr. No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">IPD No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Patient Name</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Age</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Gender</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">PayType</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(filteredIPD) && filteredIPD.length > 0 ? (
                                        filteredIPD.map((transaction, index) => (
                                            <tr key={index} className="border border-gray-200 text-center">
                                                <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.ipdNo}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.patientName}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.age}</td>
                                                <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-green-50 border-green-500 text-green-500 w-[100px] h-[30px] text-md font-normal rounded-full'>{transaction.gender}</button></td>
                                                <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-green-50 border-green-500 text-green-500 w-[100px] h-[30px] text-md font-normal rounded-full'>{transaction.payType}</button></td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        } else if (selectedTable === 'OPD') {
            return (
                <div className="bg-white p-2 my-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold mb-4">OPD Patients Table</h2>
                    <div className="flex flex-col md:flex-row w-[100%] sm:w-[100%] md:w-[60%] lg:w-[35%] justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Search 'Patients'"
                            className="border p-2 rounded mb-2 md:mb-0 md:mr-2 flex-1"
                            value={searchOpdQuery}
                            onChange={(e) => setSearchOpdQuery(e.target.value)}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <table className="table-auto w-full border border-collapse shadow">
                                <thead>
                                    <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr. No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">OPD No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Patient Name</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Age</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Gender</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">PayType</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(filteredOPD) && filteredOPD.length > 0 ? (
                                        filteredOPD.map((transaction, index) => (
                                            <tr key={index} className="border border-gray-200 text-center">
                                                <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.opdNo}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.patientName}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.age}</td>
                                                <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-green-50 border-green-500 text-green-500 w-[100px] h-[30px] text-md font-normal rounded-full'>{transaction.gender}</button></td>
                                                <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-green-50 border-green-500 text-green-500 w-[100px] h-[30px] text-md font-normal rounded-full'>{transaction.payType}</button></td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        } else if (selectedTable === 'Discharge') {
            return (
                <div className="bg-white p-2 my-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold mb-4">Discharge Patients Table</h2>
                    <div className="flex flex-col md:flex-row w-[100%] sm:w-[100%] md:w-[60%] lg:w-[35%] justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Search 'Patients'"
                            className="border p-2 rounded mb-2 md:mb-0 md:mr-2 flex-1"
                            value={searchDischargeQuery}
                            onChange={(e) => setSearchDischargeQuery(e.target.value)}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <table className="table-auto w-full border border-collapse shadow">
                                <thead>
                                    <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr. No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">IPD No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Patient Name</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Age</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Gender</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">PayType</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(filteredDischarge) && filteredDischarge.length > 0 ? (
                                        filteredDischarge.map((transaction, index) => (
                                            <tr key={index} className="border border-gray-200 text-center">
                                                <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.ipdNo}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.patientName}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.age}</td>
                                                <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-green-50 border-green-500 text-green-500 w-[100px] h-[30px] text-md font-normal rounded-full'>{transaction.gender}</button></td>
                                                <td className="px-4 py-3 border border-gray-200" ><button className='border-2 bg-green-50 border-green-500 text-green-500 w-[100px] h-[30px] text-md font-normal rounded-full'>{transaction.payType}</button></td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        } else if (selectedTable === 'Ambulance') {
            return (
                <div className="bg-white p-2 my-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold mb-4">Ambulance Booking</h2>
                    <div className="flex flex-col md:flex-row w-[100%] sm:w-[100%] md:w-[60%] lg:w-[35%] justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Search 'Patients'"
                            className="border p-2 rounded mb-2 md:mb-0 md:mr-2 flex-1"
                            value={searchAmbulanceQuery}
                            onChange={(e) => setSearchAmbulanceQuery(e.target.value)}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <table className="table-auto w-full border border-collapse shadow">
                                <thead>
                                    <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr. No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Ambulance No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Patient Name</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Driver</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">phone No</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Location</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(filteredAmbulance) && filteredAmbulance.length > 0 ? (
                                        filteredAmbulance.map((transaction, index) => (
                                            <tr key={index} className="border border-gray-200 text-center">
                                                <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.ambulanceNumber}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.patientName}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.empName}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.phoneNo}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.endLocation}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <>
            <div className="">
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
                    <div
                        className=" rounded-lg  text-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
                        onClick={() => setSelectedTable('OPD')}
                    >
                        <div className="bg-white p-6 rounded-lg border flex items-center justify-between space-x-4">
                            <div className="flex-shrink-0">
                                <GiMedicines size={50} className="text-red-400" />
                            </div>
                            <div className="text-right">
                                <h2 className="text-gray-600 text-lg font-semibold">OPD Patient</h2>
                                <p className="text-3xl font-bold mt-4">{searchOpdToday}</p>
                            </div>
                        </div>
                    </div>\
                    <div
                        className=" rounded-lg  text-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
                        onClick={() => setSelectedTable('IPD')}
                    >
                        <div className="bg-white p-6 rounded-lg border flex items-center justify-between space-x-4">
                            <div className="flex-shrink-0">
                                <FaBed size={50} className="text-blue-400" />
                            </div>
                            <div className="text-right">
                                <h2 className="text-gray-600 text-lg font-semibold">IPD Patient</h2>
                                <p className="text-3xl font-bold mt-4">{searchIpdToday}</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="rounded-lg  text-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
                        onClick={() => setSelectedTable('Discharge')}
                    >
                        <div className="bg-white p-6 rounded-lg border flex items-center justify-between space-x-4">
                            <div className="flex-shrink-0">
                                <FaArrowRightFromBracket size={50} className="text-green-400" />
                            </div>
                            <div className="text-right">
                                <h2 className="text-gray-600 text-lg font-semibold">Discharge Patient</h2>
                                <p className="text-3xl font-bold mt-4">{searchDischargeToday}</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className="rounded-lg border  text-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
                        onClick={() => setSelectedTable('Ambulance')}
                    >
                        <div className="bg-white p-6 rounded-lg  flex items-center border justify-between space-x-4">
                            <div className="flex-shrink-0">
                                <ImPlus size={50} className="text-blue-400" />
                            </div>
                            <div className="text-right">
                                <h2 className="text-gray-600 text-lg font-semibold">Ambulance</h2>
                                <p className="text-3xl font-bold mt-4">{searchAmbulanceToday}</p>
                            </div>
                        </div>
                    </div>
                </div> */}


<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
    {/* Room Facilities Card */}
    <div
        className="rounded-lg cursor-pointer transform transition-transform group hover:translate-y-[-10px] hover:shadow-xl"
        onClick={() => setSelectedTable('Room Facilities')}
    >
        <div className="bg-white p-4 rounded-lg border transition-all space-x-4 group">
            <div>
                <GiMedicines size={45} className="text-gray-600 group-hover:text-red-500 transition-colors ml-4" />
            </div>
            <div>
                <h2 className="text-gray-600 mt-2 text-lg font-semibold group-hover:text-red-500 transition-colors">
                    OPD Patients
                </h2>
                <p className="text-sm mt-2 group-hover:text-red-500 transition-colors">
                    Total OPD: {searchOpdToday}
                </p>
            </div>
        </div>
    </div>

    {/* Housekeeping Card */}
    <div
        className="rounded-lg cursor-pointer transform transition-transform group hover:translate-y-[-10px] hover:shadow-xl"
        onClick={() => setSelectedTable('Housekeeping')}
    >
        <div className="bg-white p-4 rounded-lg border transition-all space-x-4 group">
            <div>
                <FaBed size={45} className="text-gray-600 group-hover:text-blue-500 transition-colors ml-4" />
            </div>
            <div>
                <h2 className="text-gray-600 mt-2 text-lg font-semibold group-hover:text-blue-500 transition-colors">
                    IPD Patients
                </h2>
                <p className="text-sm mt-2 group-hover:text-blue-500 transition-colors">
                    Total IPD: {searchIpdToday}
                </p>
            </div>
        </div>
    </div>

    {/* Cab Booking Card */}
    <div
        className="rounded-lg cursor-pointer transform transition-transform group hover:translate-y-[-10px] hover:shadow-xl"
        onClick={() => setSelectedTable('Cab Booking')}
    >
        <div className="bg-white p-4 rounded-lg border transition-all space-x-4 group">
            <div>
                <IoIosLogOut size={45} className="text-gray-600 group-hover:text-green-500 transition-colors ml-4" />
            </div>
            <div>
                <h3 className="text-gray-600 mt-2 text-lg font-semibold group-hover:text-green-500 transition-colors">
                    Discharge Patients
                </h3>
                <p className="text-sm mt-2 group-hover:text-green-500 transition-colors">
                    Total Discharge: {searchDischargeToday}
                </p>
            </div>
        </div>
    </div>

    {/* Cab List Card */}
    <div
        className="rounded-lg cursor-pointer transform transition-transform group hover:translate-y-[-10px] hover:shadow-xl"
        onClick={() => setSelectedTable('Cab List')}
    >
        <div className="bg-white p-4 rounded-lg border transition-all space-x-4 group">
            <div>
                <ImPlus size={45} className="text-gray-600 group-hover:text-blue-500 transition-colors ml-4" />
            </div>
            <div>
                <h3 className="text-gray-600 mt-2 text-lg font-semibold group-hover:text-blue-500 transition-colors">
                    Ambulance Booking
                </h3>
                <p className="text-sm mt-2 group-hover:text-blue-500 transition-colors">
                    Total Booking: {searchAmbulanceToday}
                </p>
            </div>
        </div>
    </div>
</div>



                <div className="p-4">
                    {renderTable()}
                </div>
            </div>
        </>
    );
};
export default withAuth(ReceptionDashboard, ['SUPERADMIN', 'ADMIN', 'RECEPTIONIST'])