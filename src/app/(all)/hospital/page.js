'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import { BaseUrl } from "@/app/config";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';

export function Hospital() {
    return (
        <LayoutForm>
            <Hospitalform />
        </LayoutForm>
    );
}

const Hospitalform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [inputs, setInputs] = useState({
        profileId: 1,
        hospitalName: "",
        hospitalAddres: "",
        hospitalLogo: null,
    });

    /**
     * Fetches hospital profile data from the API
     */
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`hospitalProfile/getDataHospital`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch hospital data");
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    /**
     * Handles form submission for save/update operations
     */
    const handleXray = async (e) => {
        e.preventDefault();

        // Validation
        if (!inputs.hospitalName.trim()) {
            alert("Hospital name is required");
            return;
        }
        if (!inputs.hospitalAddres.trim()) {
            alert("Hospital address is required");
            return;
        }

        const formData = new FormData();
        formData.append('profileId', inputs.profileId);
        formData.append('hospitalName', inputs.hospitalName);
        formData.append('hospitalAddres', inputs.hospitalAddres);
        
        // Append file only if it exists and is a File object
        if (inputs.hospitalLogo && inputs.hospitalLogo instanceof File) {
            formData.append('hospitalLogo', inputs.hospitalLogo);
        }

        try {
            let response;
            if (isEdit) {
                response = await apiClient.put(
                    `hospitalProfile/updateHospitalProfile`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            } else {
                response = await apiClient.post(
                    `hospitalProfile/save`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
            }

            if (response.status === 200) {
                alert(isEdit ? "Data updated successfully" : "Data saved successfully");
                resetForm();
                fetchApi();
            } else {
                alert(`${isEdit ? "Update" : "Save"} failed! Please try again`);
            }
        } catch (error) {
            console.error("Error handling hospital profile:", error);
            alert(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    /**
     * Resets form to initial state
     */
    const resetForm = () => {
        setInputs({
            profileId: 1,
            hospitalName: "",
            hospitalAddres: "",
            hospitalLogo: null,
        });
        setImagePreview(null);
        setIsEdit(false);
    };

    /**
     * Sets form fields for editing
     */
    const handleUpdate = (hospital) => {
        setInputs({
            profileId: hospital.profileId,
            hospitalName: hospital.hospitalName,
            hospitalAddres: hospital.hospitalAddres,
            hospitalLogo: hospital.hospitalLogo,
        });
        
        // Set image preview if exists
        if (hospital.hospitalLogo) {
            setImagePreview(hospital.hospitalLogo);
        }
        
        setIsEdit(true);
    };

    /**
     * Handles text input changes
     */
    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * Handles image file selection and preview
     */
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPG, PNG, or GIF)');
            e.target.value = ''; // Reset input
            return;
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            alert('File size must be less than 10MB');
            e.target.value = ''; // Reset input
            return;
        }

        // Update state with file
        setInputs(prevState => ({
            ...prevState,
            hospitalLogo: file
        }));

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    /**
     * Handles refresh button click
     */
    const handleRefresh = () => {
        resetForm();
        fetchApi();
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl'>
            <Heading headingText="Hospital Profile" />
            <div className='py-4'>
                <form className='lg:w-[60%] md:w-[100%] sm:w-[100%]' onSubmit={handleXray}>
                    <div className="grid grid-cols-1 gap-4 m-2">
                        {/* Profile ID */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Profile ID <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none'
                                name="profileId"
                                onChange={handleChange}
                                value={inputs.profileId}
                                readOnly
                            />
                        </div>

                        {/* Hospital Name */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Hospital Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                name="hospitalName"
                                onChange={handleChange}
                                value={inputs.hospitalName}
                                placeholder="Enter hospital name"
                                required
                            />
                        </div>

                        {/* Hospital Address */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Hospital Address <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                name="hospitalAddres"
                                onChange={handleChange}
                                value={inputs.hospitalAddres}
                                placeholder="Enter hospital address"
                                required
                            />
                        </div>

                        {/* Hospital Logo Upload */}
                        <div className="space-y-2">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Hospital Logo
                            </label>
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mb-4">
                                    <img 
                                        src={imagePreview} 
                                        alt="Hospital Logo Preview" 
                                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                </div>
                            )}

                            {/* Upload Area */}
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label 
                                            htmlFor="image-upload" 
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="image-upload"
                                                name="hospitalLogo"
                                                type="file"
                                                className="sr-only"
                                                onChange={handleImageChange}
                                                accept="image/jpeg,image/jpg,image/png,image/gif"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    {inputs.hospitalLogo && (
                                        <p className="text-xs text-green-600 font-medium">
                                            Selected: {inputs.hospitalLogo.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-start w-full space-x-4 p-2 mt-4">
                        <button 
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors" 
                            type="button"
                            onClick={handleRefresh}
                        >
                            Refresh
                        </button>
                        <button
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            type="submit"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Data Table */}
            <div className="bg-white p-2 m-4 md:p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead className="sticky top-0 bg-gray-50">
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Actions</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Address</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Logo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr key={transaction.profileId || index} className="border border-gray-200 text-center hover:bg-gray-50">
                                            <td className="px-4 py-3 border border-gray-200">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center justify-center mx-auto"
                                                    onClick={() => handleUpdate(transaction)}
                                                    type="button"
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                    Edit
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.hospitalName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.hospitalAddres}</td>
                                            <td className="px-4 py-3 border border-gray-200">
                                                {transaction.hospitalLogo ? (
                                                    <img 
                                                        src={transaction.hospitalLogo} 
                                                        alt="Hospital Logo" 
                                                        className="w-16 h-16 object-cover rounded mx-auto"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400">No logo</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-gray-500">
                                            No data available
                                        </td>
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

export default withAuth(Hospital, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);