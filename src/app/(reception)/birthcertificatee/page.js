'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { toast } from 'sonner';
import { IoPrintOutline } from "react-icons/io5";


export function Birthcertificate() {
    return (
        <LayoutForm>
            <Birthform />
        </LayoutForm>
    );
}

const Birthform = () => {

    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [dataa, setDataa] = useState([]);
    const [inputs, setInputs] = useState({
        certi_id: 0,
        dateofBirth: "",
        timeofbirth: "",
        fullname: "",
        placeofBirth: "",
        gender: "",
        motherName: "",
        fatherName: "",
        permanentAddress: "",
        hight: "",
        weight: "",
        contactNo: "",
        drId: 0
    });


    // Fetch all room types
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`birth`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);


    // Handle saving or updating the room type
    const handleBirth = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                // Corrected Update API call with room id
                const response = await apiClient.put(
                    `birth/update`, // Fixed URL construction
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
                    `birth/savebirth`,
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
                certi_id: 0,
                dateofBirth: "",
                timeofbirth: "",
                fullname: "",
                placeofBirth: "",
                gender: "",
                motherName: "",
                fatherName: "",
                permanentAddress: "",
                hight: "",
                weight: "",
                contactNo: "",
                drId: 0
            });
        } catch (error) {
            console.error("Error handling room type:", error);
            toast.error("An error occurred. Please try again.");
        }
    };


    // Set the form fields for editing a room type
    const handleUpdate = (birth) => {
        setInputs({
            certi_id: birth.certi_id,
            dateofBirth: birth.dateofBirth,
            timeofbirth: birth.timeofbirth,
            fullname: birth.fullname,
            placeofBirth: birth.placeofBirth,
            gender: birth.gender,
            motherName: birth.motherName,
            fatherName: birth.fatherName,
            permanentAddress: birth.permanentAddress,
            hight: birth.hight,
            weight: birth.weight,
            contactNo: birth.contactNo,
            drId: birth.drId
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

    const fetchDr = async () => {
        try {
            const response = await apiClient.get(`doc/getAllDoc`);
            console.log(response?.data?.data);
            setDataa(response?.data?.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchDr();
    }, []);

    const handleChange1 = (e) => {
        console.log(e.target.value);
        setInputs({ ...inputs, drId: e.target.value })
    };


    // File download function
    const handleBirthDownload = async (certi_id) => {
        try {
            const response = await apiClient.get(`birth/generateBirthcertificatePdf`, {
                params: { certi_id },
                responseType: 'blob',
            });
            // Check if the response is successful
            if (response.status === 200) {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);

                // Open the PDF in a new tab
                const pdfWindow = window.open('');
                pdfWindow.document.write(`<iframe width='100%' height='100%' src='${url}'></iframe>`);

                // Optional: Clean up the URL after some time to release memory
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                }, 100); // Adjust timeout as needed
            } else {
                console.error('Failed to download Birth:', response.status);
                toast.error("Failed to download Birth. Please try again.");
            }
        } catch (error) {
            console.error('Error downloading the Birth:', error);
            toast.error("An error occurred while downloading the Birth. Please try again.");
        }
    };



    // const handleBirthDownload = (certi_id) => {
    //     window.location.href = `birth/generateBirthcertificatePdf?certi_id=${certi_id}`;
    // };


    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="Birth Certificate" />
            <div className=''>
                <form className=''>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                        <div>
                            <label className="block text-gray-700 text-sm">Date of Birth</label>
                            <input
                                type="date"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="dateofBirth"
                                onChange={handleChange}
                                value={inputs.dateofBirth}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Time of Birth</label>
                            <input
                                type="time"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="timeofbirth"
                                onChange={handleChange}
                                value={inputs.timeofbirth}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Full Name</label>
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none' name="fullname"
                                onChange={handleChange}
                                value={inputs.fullname}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Place </label>
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="placeofBirth"
                                onChange={handleChange}
                                value={inputs.placeofBirth}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Gender</label>
                            {/* <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                    name="gender"
                                    onChange={handleChange}
                                    value={inputs.gender}
                                /> */}
                            <select
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="gender"
                                onChange={handleChange}
                                value={inputs.gender}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div >
                            <label className="block text-gray-700 text-sm">Dr.on Duty</label>
                            <select onChange={handleChange1} className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'>
                                <option>Select Doctor</option>
                                {dataa.map((data , index) => (
                                    <option key={index} value={data.drId}>{data.drName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Mother Name</label>
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none' name="motherName"
                                onChange={handleChange}
                                value={inputs.motherName}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Father Name</label>
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none' name="fatherName"
                                onChange={handleChange}
                                value={inputs.fatherName}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Per. Address</label>
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none' name="permanentAddress"
                                onChange={handleChange}
                                value={inputs.permanentAddress}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Hight</label>
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none' name="hight"
                                onChange={handleChange}
                                value={inputs.hight}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Weight</label>
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none' name="weight"
                                onChange={handleChange}
                                value={inputs.weight}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Contact No. </label>
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none' name="contactNo"
                                onChange={handleChange}
                                value={inputs.contactNo}
                            />
                        </div>

                        <div className="flex justify-start w-full space-x-4 p-2">
                            <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900 text-sm" type="button" >Refresh</button>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900 text-sm"
                                onClick={handleBirth}
                            >
                                {isEdit ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="bg-white p-2 mt-4 rounded-lg shadow-md">
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
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Mother Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">DOB</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Gender</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Height</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">

                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleBirthDownload(transaction.certi_id)}
                                                >
                                                    <IoPrintOutline />
                                                </button>
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>

                                            <td className="px-4 py-3 border border-gray-200">{transaction.fullname}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.motherName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.dateofBirth}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.gender}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.hight}</td>



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
            <p className="text-red-600 font-medium">Note: A master could not be deleted if used anywhere</p>
        </div>
    );
};
export default withAuth(Birthcertificate, ['SUPERADMIN', 'ADMIN', 'RECEPTION'])