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
                responseType: 'blob'
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                window.open(url);
            } else {
                console.error("Failed to fetch report");
            }
        } catch (error) {
            console.error("Error fetching report:", error);
        }
    };

    return (
        <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
            <Heading headingText="Journal Voucher Report" />

            <div className="py-4">
                <form className="lg:w-full md:w-full sm:w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 m-2">
                        {/* From Date */}
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-1/5 mb-2 sm:mb-0">
                                <label className="block font-semibold text-sky-800">Date From</label>
                            </div>
                            <div className="w-full sm:w-4/5">
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
                                />
                            </div>
                        </div>

                        {/* To Date */}
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-1/5 mb-2 sm:mb-0">
                                <label className="block font-semibold text-sky-800">Date To</label>
                            </div>
                            <div className="w-full sm:w-4/5">
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
                                />
                            </div>
                        </div>
                    </div>
                </form>
                <div className="flex justify-start w-full space-x-4 p-2">
                    <button
                        onClick={handlePrint}
                        type="button"
                        className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900 inline-flex items-center"
                    >
                        Print
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-sky-100">
                <div className="overflow-x-auto max-h-[400px]">
                    <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
                        <thead className="sticky top-0 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur z-10 text-center text-xs text-sky-700">
                            <tr>
                                <th className="px-4 py-2 border border-gray-100">Sr. No.</th>
                                <th className="px-4 py-2 border border-gray-100">Voucher No.</th>
                                <th className="px-4 py-2 border border-gray-100">Voucher Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={item.journalVoucherId} className="border border-gray-100 odd:bg-white even:bg-sky-50">
                                        <td className="px-4 py-3 border border-gray-200 text-center">{index + 1}</td>
                                        <td className="px-4 py-3 border border-gray-200 text-center">{item.voucherNo}</td>
                                        <td className="px-4 py-3 border border-gray-200 text-center">{item.voucherDate}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-8 text-gray-500">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default withAuth(JournalVoucherReport, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
