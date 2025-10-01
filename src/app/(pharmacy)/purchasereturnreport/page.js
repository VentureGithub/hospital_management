'use client';

import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState } from "react";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';
import apiClient from "@/app/config"; // Custom API client configuration

export function PurchaseReturnReport() {
    return (
        <LayoutForm>
            <Heading headingText="Purchase Return Report" />
            <PurchaseReturnReportform />
        </LayoutForm>
    );
}

const PurchaseReturnReportform = () => {
    const [purchseReturnNo, setPurchaseNo] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');

    const handlePurchaseNoChange = (e) => {
        setPurchaseNo(e.target.value);
    };

    const handlePurchaseDateChange = (e) => {
        setPurchaseDate(e.target.value);
    };

    const handlePrint = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!purchseReturnNo || !purchaseDate) {
            toast.error('Please fill out both Purchase Return No. and Purchase Date.');
            return;
        }

        try {
            const response = await apiClient.get(
                `purchaseInvoiceReturn/purchaseInvoiceReturnPdf`, 
                {
                    params: { purchseReturnNo, purchaseDate },
                    responseType: 'blob', // Binary data for PDF
                }
            );

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, '_blank'); // Open the PDF in a new tab
            } else {
                toast.error('Failed to generate the PDF. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching the PDF:', error);
            toast.error('Failed to generate the PDF. Please try again.');
        }
    };

    return (
        <div className="p-6">
            <div className="p-7">
                <form className="lg:w-[100%] md:w-[100%] sm:w-[100%]" onSubmit={handlePrint}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 m-2">
                        {/* Purchase Return No. Field */}
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Purchase Return No.</label>
                            </div>
                            <div className="w-full sm:w-[70%]">
                                <input
                                    type="text"
                                    value={purchseReturnNo}
                                    onChange={handlePurchaseNoChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                    placeholder="Enter Purchase Return No."
                                />
                            </div>
                        </div>

                        {/* Purchase Date Field */}
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Purchase Date</label>
                            </div>
                            <div className="w-full sm:w-[70%]">
                                <input
                                    type="date"
                                    value={purchaseDate}
                                    onChange={handlePurchaseDateChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Print Button */}
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
        </div>
    );
};

export default withAuth(PurchaseReturnReport, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
