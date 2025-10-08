'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";

export function JournalVoucherReport() {
    return (
        <LayoutForm>
            <JournalVoucherReportform />
        </LayoutForm>
    );
}

const JournalVoucherReportform = () => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [data, setData] = useState([]);

    const fetchAllApi = async () => {
        try {
            const response = await apiClient.get(`journalVoucher/getAllData`);
            if (response.status === 200) {
                setData(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching all data:', error);
            alert('Error fetching data');
        }
    };

    useEffect(() => {
        fetchAllApi();
    }, []);

    const handlePrint = async () => {
        if (!fromDate || !toDate) {
            alert("Please select both From Date and To Date.");
            return;
        }

        try {
            const response = await apiClient.get('journalVoucher/generate-pdf', {
                params: { fromDate, toDate },
                responseType: 'blob'  // Specify blob for PDF
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                window.open(url); // Opens the PDF in a new tab
            } else {
                console.error("Failed to fetch report");
            }
        } catch (error) {
            console.error("Error fetching report:", error);
        }
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
        <Heading headingText="Journal Voucher Report" />
            <div className='py-4'>
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 m-2">
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Date From</label>
                            </div>
                            <div className="w-full sm:w-[70%]">
                                <input 
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Date To</label>
                            </div>
                            <div className="w-full sm:w-[70%]">
                                <input 
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </form>
                <div className="flex justify-start w-full space-x-4 p-2">
                    <button
                        className="bg-green-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-green-900"
                        type="button"
                        onClick={handlePrint}
                    >
                        Print
                    </button>
                </div>
            </div>
            <div className="bg-white p-2  md:p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr. No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Voucher No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Voucher Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                        <td className="px-4 py-3 border border-gray-200">{item.voucherNo}</td>
                                        <td className="px-4 py-3 border border-gray-200">{item.voucherDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAuth(JournalVoucherReport, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
