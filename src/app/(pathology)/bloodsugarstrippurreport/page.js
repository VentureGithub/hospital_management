'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState } from "react";
import apiClient from "@/app/config";
import { toast } from 'sonner';
import withAuth from '@/app/(components)/WithAuth';

export function BloodSugarStripPurReport() {
    return (
        <LayoutForm>
            <BloodSugarStripPurReportForm />
        </LayoutForm>
    );
}

const BloodSugarStripPurReportForm = () => {
    const [supplierName, setSupplierName] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const generateReport = async () => {
        if (!supplierName || !purchaseDate) {
            toast.error("Please enter a supplier name and date.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await apiClient.get(`sugarStrip/generate-sugarstrip-report?supplierName=${supplierName}&purchaseDate=${purchaseDate}`, {
                responseType: 'blob', 
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result;
                const pdfWindow = window.open('');
                pdfWindow.document.write(`<iframe width='100%' height='100%' src='${base64data}'></iframe>`);
            };
            reader.readAsDataURL(response.data); // Convert Blob to Base64

           
        } catch (err) {
            console.error("Error generating report:", err);
            setError("Failed to generate report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
             <Heading headingText="Blood Sugar Strip Pur. Report" />
            <div className='py-4'>
                <form className='lg:w-[50%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 gap-4 my-2">
                        <div >
                                <label className="block text-sm ">Supplier</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                                    id="supplierName"
                                    value={supplierName}
                                    onChange={(e) => setSupplierName(e.target.value)} 
                                    placeholder="Type supplier name..."
                                />
                        </div>

                        <div>
                                <label className="block text-sm ">Date</label>
                                <input
                                    type="date"
                                    className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                    id="purchaseDate"
                                    value={purchaseDate}
                                    onChange={(e) => setPurchaseDate(e.target.value)} 
                                />
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2">
                        <button
                            className={`bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-900 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={generateReport}
                            type="button"
                            disabled={loading}
                        >
                            {loading ? "Generating..." : "Generate Report"}
                        </button>
                    </div>
                </form>
                {error && <div className="mt-4 text-red-500">{error}</div>}
            </div>
        </div>
    );
};

export default withAuth(BloodSugarStripPurReport, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
