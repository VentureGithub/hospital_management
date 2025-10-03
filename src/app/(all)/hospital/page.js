'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import { BaseUrl } from "@/app/config";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import Icon from "../../(components)/Icon";

export function Hospital() {
    return (
        <LayoutForm>
            <Icon message="" />
            <Hospitalform />
        </LayoutForm>
    );
}


const Hospitalform = () => {

    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [dataa, setDataa] = useState([]);
    const [inputs, setInputs] = useState({
        profileId: 1 || "",
        hospitalName: "",
        hospitalAddres: [""],
        hospitalLogo: null,
    });


    // Fetch all room types
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`hospitalProfile/getDataHospital`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);


    // Handle saving or updating the room type
    const handleXray = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('profileId', inputs.profileId);
        formData.append('hospitalName', inputs.hospitalName);
        formData.append('hospitalAddres', inputs.hospitalAddres);
        
        // Check if there's a file to upload
        if (inputs.hospitalLogo instanceof File) {
            formData.append('hospitalLogo', inputs.hospitalLogo);
        }
    
        try {
            if (isEdit) {
                // For edit, make sure to send FormData
                const response = await apiClient.put(
                    `hospitalProfile/updateHospitalProfile`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                if (response.status === 200) {
                    alert("Data updated successfully");
                    setIsEdit(false);
                } else {
                    alert("Update failed! Please try again");
                }
            } else {
                const response = await apiClient.post(
                    `hospitalProfile/saveHospitalProfile`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                if (response.status === 200) {
                    alert("Data saved successfully");
                } else {
                    alert("Save failed! Please try again");
                }
            }
            fetchApi();
            setInputs({
                profileId: 1,
                hospitalName: "",
                hospitalAddres: [""],
                hospitalLogo: null,
            });
        } catch (error) {
            console.error("Error handling hospital profile:", error);
            alert("An error occurred. Please try again.");
        }
    };


    // Set the form fields for editing a room type
    const handleUpdate = (hospital) => {
        setInputs({
            profileId: hospital.profileId,
            hospitalName: hospital.hospitalName,
            hospitalAddres: hospital.hospitalAddres,
            hospitalLogo: hospital.hospitalLogo,
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setInputs(prevState => ({
            ...prevState,
            hospitalLogo: file  // Changed from 'image' to 'hospitalLogo'
        }));
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
             <Heading headingText="Hospital Profile" />
            <div className='py-4'>


                <form className='lg:w-[60%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2 ">
                        <div>
                            <label className="block text-gray-700">Id </label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none'
                                name="profileId"
                                onChange={handleChange}
                                value={inputs.profileId}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Name </label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none'
                                name="hospitalName"
                                onChange={handleChange}
                                value={inputs.hospitalName}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Address </label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none'
                                name="hospitalAddres"
                                onChange={handleChange}
                                value={inputs.hospitalAddres}
                            />
                        </div>


                        {/* Hospital Image */}
                        <div className="space-y-2">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Hospital Image
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input
                                                id="image-upload"
                                                name="hospitalLogo"
                                                type="file"
                                                className="sr-only"
                                                onChange={handleImageChange}
                                                accept="image/*"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2">
                        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900" type="button" >Refresh</button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900"
                            onClick={handleXray}
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
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Address</th>
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
                                            <td className="px-4 py-3 border border-gray-200">{transaction.hospitalName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.hospitalAddres}</td>

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
            <p className="text-red-600 font-medium">Note: A master could not be deleted if used anywhere</p>
        </div>
    );
};

export default withAuth(Hospital, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])