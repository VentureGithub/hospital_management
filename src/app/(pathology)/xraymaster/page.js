'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from 'sonner';
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';

export function Xray() {
    return (
        <LayoutForm>
            <Xrayform />
        </LayoutForm>
    );
}

const Xrayform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [inputs, setInputs] = useState({
        xrayId: 0,
        xrayName: "",
        testCategoryId: 0,
        xrayCharges: "",
        testCategoryName: ""
    });

    // Fetch all xrays
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`xray/getall`);
            setData(response.data.data || []);
        } catch (error) {
            console.error("Error fetching xray list:", error);
            toast.error("Failed to load X-ray list");
        }
    };

    // Fetch categories
    const fetchCatagory = async () => {
        try {
            const response = await apiClient.get(`testCatagory/getTest/catagory`);
            setCategories(response.data.data || []);
        } catch (error) {
            console.error("Error fetching categories", error);
            toast.error("Failed to load categories");
        }
    };

    useEffect(() => {
        fetchApi();
        fetchCatagory();
    }, []);

    // submit handler for save/update
    const handleXray = async (e) => {
        e.preventDefault();
        try {
            // Build payload matching curl
            const payload = {
                xrayId: Number(inputs.xrayId) || 0,
                xrayName: inputs.xrayName || "",
                testCategoryId: Number(inputs.testCategoryId) || 0,
                xrayCharges: inputs.xrayCharges || "",
                testCategoryName: inputs.testCategoryName || ""
            };

            let response;
            if (isEdit) {
                response = await apiClient.put(`xray/update`, payload);
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false);
                } else {
                    toast.error("Update failed! Please try again");
                }
            } else {
                response = await apiClient.post(`xray/save`, payload);
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error("Save failed! Please try again");
                }
            }

            await fetchApi();
            setInputs({
                xrayId: 0,
                xrayName: "",
                testCategoryId: 0,
                xrayCharges: "",
                testCategoryName: ""
            });
        } catch (error) {
            console.error("Error handling xray:", error);
            const msg = error?.response?.data ?? error.message;
            toast.error(`An error occurred: ${JSON.stringify(msg)}`);
        }
    };

    // populate form for edit
    const handleUpdate = (xray) => {
        setInputs({
            xrayId: xray.xrayId ?? 0,
            xrayName: xray.xrayName ?? "",
            testCategoryId: xray.testCategoryId ?? 0,
            xrayCharges: xray.xrayCharges ?? "",
            testCategoryName: xray.testCategoryName ?? ""
        });
        setIsEdit(true);
    };

    // generic input change
    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // when category select changes, set id + name
    const handleCategoryChange = (e) => {
        const id = Number(e.target.value) || 0;
        const selected = categories.find(c => c.testCategoryId === id);
        setInputs(prev => ({
            ...prev,
            testCategoryId: id,
            testCategoryName: selected ? selected.categoryName : ""
        }));
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="X-Ray Master" />
            <div className='py-4'>
                <form className='lg:w-[60%] md:w-[100%] sm:w-[100%]' onSubmit={handleXray}>
                    <div className="grid grid-cols-1 gap-2 m-2 ">
                        <div>
                            <label className="block text-sm mb-2">Category Name</label>
                            <select
                                onChange={handleCategoryChange}
                                value={inputs.testCategoryId || ""}
                                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                            >
                                <option value={0}>Select service</option>
                                {categories.map((c, index) => (
                                    <option key={index} value={c.testCategoryId}>{c.categoryName}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block  text-sm mb-2">X-Ray Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none"
                                name="xrayName"
                                onChange={handleChange}
                                value={inputs.xrayName}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2">Amount</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none"
                                name="xrayCharges"
                                onChange={handleChange}
                                value={inputs.xrayCharges}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-start w-full space-x-4 my-4 p-2">
                        <button
                            className="bg-gray-600 text-white px-6 py-2 text-sm rounded-lg hover:bg-gray-900"
                            type="button"
                            onClick={fetchApi}
                        >
                            Refresh
                        </button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-900"
                            type="submit"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-2 my-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">X-Ray Id</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">X-Ray Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr key={transaction.xrayId ?? index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.xrayId}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.xrayName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.xrayCharges}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">No data available</td>
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

export default withAuth(Xray, ['SUPERADMIN', 'ADMIN','DOCTOR'])
