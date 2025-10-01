'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from 'sonner';
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import Icon from "../../(components)/icon";

export function Xray() {
    return (
        <LayoutForm>
            <Icon message="This page manages the details of X-ray services, including the type of X-ray, description, and cost, to streamline service offerings and pricing."/>
            <Xrayform />
        </LayoutForm>
    );
}


const Xrayform = () => {

    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [dataa, setDataa] = useState([]);
    const [inputs, setInputs] = useState({
            xrayId : 0,
            xrayName : "",
            testCategoryId : 0,
            xrayCharges: "",
            testCategoryName : ""
          });


    // Fetch all room types
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`xray/getall`);
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
        try {
            if (isEdit) {
                // Corrected Update API call with room id
                const response = await apiClient.put(
                    `xray/update`, // Fixed URL construction
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
                    `xray/save`,
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
                xrayId : 0,
                xrayName : "",
                testCategoryId : 0,
                xrayCharges: "",
                testCategoryName : "" });
        } catch (error) {
            console.error("Error handling room type:", error);
            toast.error("An error occurred. Please try again.");
        }
    };


    // Set the form fields for editing a room type
    const handleUpdate = (xray) => {
        setInputs({
            xrayId : xray.xrayId,
            xrayName : xray.xrayName,
            testCategoryId : xray.testCategoryId,
            xrayCharges: xray.xrayCharges,
            testCategoryName : xray.testCategoryName 
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

    const fetchCatagory = async () => {
        try {
            const response = await apiClient.get(`testCatagory/getTest/catagory`);
            console.log(response.data.data);
            setDataa(response.data.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchCatagory();
    }, []);

    const handleChange1 = (e) => {
        console.log(e.target.value);
        setInputs({...inputs, testCategoryId:e.target.value})
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
             <Heading headingText="X-Ray Master" />
            <div className='py-4'>
                <form className='lg:w-[60%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2 ">
                    <div>
                                <label className="block text-sm mb-2">category Name</label>
                            <select onChange={handleChange1} className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none">
                                    <option>select service</option>
                                    {dataa.map((data) => (
                                        <option value={data.testCategoryId}>{data.categoryName}</option>
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
                                />
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 my-4 p-2">
                        <button className="bg-gray-600 text-white px-6 py-2 text-sm rounded-lg hover:bg-gray-900" type="button" >Refresh</button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-900"
                            onClick={handleXray}
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
                                        <tr key={index} className="border border-gray-200 text-center">
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