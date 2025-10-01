'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import withAuth from '@/app/(components)/WithAuth';
import apiClient from "@/app/config";  // If using your custom apiClient
import { CashPayment } from "../cashpayment/page";

export function CashPaymentReport() {
    return (
        <LayoutForm>
            <Heading headingText="Cash Payment Report" />
            <CashPaymentReportform />
        </LayoutForm>
    );
}

const CashPaymentReportform = () => {
    const [voucherNo, setVoucherNo] = useState('');
    const [data, setData] = useState([]);
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`cashpayment/getAllData`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const handleVoucherChange = (e) => {
        setVoucherNo(e.target.value);
    };

    const handlePrint = async (e) => {
        e.preventDefault();

        if (!voucherNo) {
            alert('Please enter a Voucher No.');
            return;
        }

        try {
            const response = await apiClient.get(`cashpayment/cashPaymentPdf`, {
                params: { voucherNo },
                responseType: 'blob',
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, '_blank'); // Open PDF in a new tab
            } else {
                alert('Failed to generate the PDF.');
            }
        } catch (error) {
            console.error('Error fetching the PDF:', error);
            alert('Failed to generate the PDF. Please try again.');
        }
    };
    return (
        <div className="p-6">
            <div className="p-7">
                <form className="lg:w-[100%] md:w-[100%] sm:w-[100%]" onSubmit={handlePrint}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 m-2">
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Voucher No.</label>
                            </div>
                            <div className="w-full sm:w-[70%]">
                                <input
                                    type="text"
                                    value={voucherNo}
                                    onChange={handleVoucherChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                    placeholder="Enter Voucher No."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start w-full space-x-4 p-2">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900"
                        >
                            Print
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-white p-2 m-4 md:p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Vou No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Vou Date</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Amount</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Account Name</th>


                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                          
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.voucherNo}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.voucherDate}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.amount}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.acountName}</td>

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
        </div>
    );
};

export default withAuth(CashPaymentReport, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);

