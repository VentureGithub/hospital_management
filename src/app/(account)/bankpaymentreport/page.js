'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import withAuth from '@/app/(components)/WithAuth';
import apiClient from "@/app/config";  // If using your custom apiClient

export function BankVoucher() {
    return (
        <LayoutForm>
            <BankVoucherform />
        </LayoutForm>
    );
}

const BankVoucherform = () => {
    const [voucherNo, setVoucherNo] = useState('');
    const [data, setData] = useState([]);
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`bankPayment/getAlldata`);
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
            const response = await apiClient.get(`bankPayment/bankPaymetsPdf`, {
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
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="Bank Payment Report" />
            <div className='py-4'>
                <form className="lg:w-[100%] md:w-[100%] sm:w-[100%]" onSubmit={handlePrint}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 m-2">
                        <div>
                                <label className="block font-semibold text-sm">Voucher No.</label>
                                <input
                                    type="text"
                                    value={voucherNo}
                                    onChange={handleVoucherChange}
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                    placeholder="Enter Voucher No."
                                />
                            </div>
                    </div>

                    <div className="flex justify-start w-full space-x-4 my-4 p-2">
                        <button
                            type="submit"
                            className="bg-green-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-green-900"
                        >
                            Print
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-white p-2 my-2 md:p-2 rounded-lg shadow-md">
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
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Employee Name</th>
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
                                            <td className="px-4 py-3 border border-gray-200">{transaction.empName}</td>
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

export default withAuth(BankVoucher, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);

