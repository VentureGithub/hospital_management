'use client';
import { useState } from 'react';
import apiClient from "@/app/config";
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";

export  function OPDSearch() {
    return (
      <LayoutForm>
          <OPDSearchform />
      </LayoutForm>
    );
  }



const OPDSearchform = () => {
    const [opdNo, setOpdNo] = useState('');
    const [patientHistory, setPatientHistory] = useState(null);
    const [error, setError] = useState('');

    // Function to get `patId` using OPD number and then fetch patient history
    const handleSearch = async () => {
        if (!opdNo) {
            toast.error("Please enter an OPD number.");
            return;
        }

        try {
            // Step 1: Get patId from OPD number
            const opdResponse = await apiClient.get(`getDetailsByOpdNo?opdNo=${opdNo}`);
            console.log("OPD Response:", opdResponse.data); // Log response to debug
            console.log(opdResponse.data.data.patId)
            if (opdResponse.status === 200) {
                const patId = opdResponse.data.data.patId;
                console.log("PatId:", patId); // Log patId for verification
                // Step 2: Use patId to fetch patient history
                fetchPatientHistory(patId);
            } else {
                setError("No data found for this OPD number.");
            }
        } catch (error) {
            console.error("Error fetching patId:", error);
            setError("Failed to retrieve patId. Please try again.");
        }
    };

    // Function to fetch patient history using `patId`
    const fetchPatientHistory = async (patId) => {
        try {
            const historyResponse = await apiClient.get(`history?patId=${patId}`);
            console.log("History Response:", historyResponse.data); // Log history data

            if (historyResponse.status === 200 && historyResponse.data) {
                setPatientHistory(historyResponse.data.data);
                setError(''); // Clear any previous errors
            } else {
                setError("No history data found for this patient.");
            }
        } catch (error) {
            console.error("Error fetching patient history:", error);
            setError("Failed to retrieve patient history. Please try again.");
        }
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
             <Heading headingText={"Patient History"} />
            <div className="flex mb-4">
                <input
                    type="text"
                    value={opdNo}
                    onChange={(e) => setOpdNo(e.target.value)}
                    placeholder="Enter OPD Number"
                    className="border rounded-l px-4 py-2 focus:outline-none"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-700"
                >
                    Search
                </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {patientHistory && (
                 <div className="bg-white p-2 md:p-2 rounded-lg shadow-md mt-3">
          <div className="overflow-x-auto"></div>
                <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <h2 className="text-lg font-semibold mb-2">Patient History</h2>
                    <table className="table-auto w-full border border-collapse shadow">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">OPD</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Symptoms</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Dr Name</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Dept. Name</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">PayType</th>
                                {/* Add more columns as needed */}
                            </tr>
                        </thead>
                        <tbody>
                            {patientHistory.map((entry, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3 border border-gray-200">{entry.opdNo}</td>
                                    <td className="px-4 py-3 border border-gray-200">{entry.symptoms}</td>
                                    <td className="px-4 py-3 border border-gray-200">{entry.drName}</td>
                                    <td className="px-4 py-3 border border-gray-200">{entry.deptName}</td>
                                    <td className="px-4 py-3 border border-gray-200">{entry.payType}</td>
                                    {/* Render other fields as needed */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                
                    </div></div>
            )}
        </div>
    );
};

export default OPDSearch;
