'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';
import { useState, useEffect } from "react";


export function MaterialPurchaseReport() {
    return (
        <LayoutForm>
            <Heading headingText="MaterialPurchaseReport" />
            <MaterialPurchaseReportform />
        </LayoutForm>
    );
}

const MaterialPurchaseReportform = () => {

    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [inputs, setInputs] = useState({
        productNo: 0,
        product: "",
        dateFrom: "",
        dateTo: ""
    });


    // Fetch all room types
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`getAllMaterailReport`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);


    // Handle saving or updating the room type
    const handleOpening = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                // Corrected Update API call with room id
                const response = await apiClient.get(
                    `tax/getTaxById?taxId=${inputs.taxId}`, // Fixed URL construction
                    inputs
                );
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false); // Reset edit state after update
                } else {
                    toast.error("Update failed! Please try again");
                }
            } else {
                // Save API call for new room type
                const response = await apiClient.post(
                    `saveMaterail`,
                    inputs
                );
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error("Save failed! Please try again");
                }
            }
            fetchApi(); // Refresh the list of room types after save or update
            setInputs({         
                productNo: 0,
                product: "",
                dateFrom: "",
                dateTo: ""});
        } catch (error) {
            console.error("Error handling room type:", error);
            toast.error("An error occurred. Please try again.");
        }
    };


    // Set the form fields for editing a room type
    const handleUpdate = (prod) => {
        setInputs({
            productNo: prod.productNo,
            product: prod.product,
            dateFrom: prod.dateFrom,
            dateTo: prod.dateTo
        });
        setIsEdit(true);
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className='p-6'>
            <div className='p-7'>
                <form className='lg:w-[60%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 m-2 ">

                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Product</label>
                            </div>
                            <div className="w-full sm:w-[80%]">

                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                name="product"
                                onChange={handleChange}
                                value={inputs.product}>
                                <option value="">Select Product</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Date From</label>
                            </div>
                            <div className="w-full sm:w-[80%]">

                                <input type="date"
                                    className='w-full px-4 py-2 border rounded-lg focus:outline-none'
                                    name="dateFrom"
                                    onChange={handleChange}
                                    value={inputs.dateFrom}
                                />

                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Date To.</label>
                            </div>
                            <div className="w-full sm:w-[80%]">

                                <input type="date"
                                    className='w-full px-4 py-2 border rounded-lg focus:outline-none'
                                    name="dateTo"
                                    onChange={handleChange}
                                    value={inputs.dateTo}
                                />
                                

                            </div>
                        </div>

                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2">
                        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900" type="button" >Refresh</button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900"
                            onClick={handleOpening}
                        >
                            {isEdit ? "Update" : "Save"}
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
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Product</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Date From</th>
                                   
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.product}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.dateFrom}</td>
                                           
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <p className="text-red-600 font-medium">Note: A master could not be deleted if used anywhere</p>
        </div>
    );
};
export default withAuth(MaterialPurchaseReport, ['DOCTOR', 'ADMIN', 'SUPERADMIN'])
