'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import Icon from "../../(components)/icon";



export function SubTestMaster() {
    return (
        <LayoutForm>
            <Heading headingText="Sub Test Master" />
            <Icon message="This page organizes pharmacy items by categories, helping to classify medications and products for easy inventory management and streamlined access."/>
            <SubTestMasterform />
        </LayoutForm>
    );
}


const SubTestMasterform = () => {
    const [data, setData] = useState([]);
    const [dataa, setDataa] = useState([]);
    const [inputs, setInputs] = useState({
        subTestId: 0,
        testId: 0,
        subTestName: "",
        unit: "",
        dvalue: "",
        method: "",
        listType: "",
        highlight: "",
        displayOrder: 0,
        testName: "",
        dvalueMemo: ""
    });
    const [isEdit, setIsEdit] = useState(false);

    // Fetch all room types
    const fetchApi = async () => {
        try {
            const response = await apiClient.get("subtestmaster/getAll");
            setDataa(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    // Handle saving or updating the room type
    const handleSubTestMaster = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                // Corrected Update API call with room id
                const response = await apiClient.put(
                    `subtestmaster/updateTest`, // Fixed URL construction
                    inputs
                );
                if (response.status === 200) {
                    alert("Data updated successfully");
                    setIsEdit(false); // Reset edit state after update
                } else {
                    alert("Update failed! Please try again");
                }
            } else {
                // Save API call for new room type
                const response = await apiClient.post(
                   "subtestmaster/save",
                    inputs
                );
                console.log(response.data.data)
                if (response.status === 200) {
                    alert("Data saved successfully");
                    setInputs({
                        testId: 0,
                        subTestName: "",
                        unit: "",
                        dvalue: "",
                        method: "",
                        listType: "",
                        highlight: "",
                        displayOrder: 0,
                        testName: "",
                        dvalueMemo: ""
                    })
                } else {
                    alert("Save failed! Please try again");
                }
            }
            fetchApi(); // Refresh the list of room types after save or update
            setInputs({ 
                subTestId: 0,
                testId: 0,
                subTestName: "",
                unit: "",
                dvalue: "",
                method: "",
                listType: "",
                highlight: "",
                displayOrder: 0,
                testName: "",
                dvalueMemo: ""
             }); // Reset input fields
        } catch (error) {
            console.error("Error handling :", error);
            alert("An error occurred. Please try again.");
        }
    };


    // Set the form fields for editing a room type
    const handleUpdate = (subtest) => {
        setInputs({
            subTestId: subtest.subTestId,
            testId: subtest.testId,
            subTestName: subtest.subTestName,
            unit: subtest.unit,
            dvalue: subtest.dvalue,
            method: subtest.method,
            listType: subtest.listType,
            highlight: subtest.highlight,
            displayOrder: subtest.displayOrder,
            testName: subtest.testName,
            dvalueMemo: subtest.dvalueMemo
        });
        setIsEdit(true); // Set edit mode to true
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    };


    //get catagory all 
    const fetchCatagory = async () => {
        try {
            const response = await apiClient.get(`testmaster/getalltestmaster`);
            console.log(response.data.data);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchCatagory();
    }, []);

    const handleChange1 = (e) => {
        console.log(e.target.value);
        setInputs({ ...inputs, testId: e.target.value })
    };




    return (
        <div className='p-6'>
            <div className='p-7'>
                <form className='lg:w-[60%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2 ">
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Test Name</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <select onChange={handleChange1} className="w-full px-4 py-2 border rounded-lg focus:outline-none">
                                    <option>select test Name</option>
                                    {data.map((dataa) => (
                                        <option value={dataa.testId} >{dataa.testName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Sub Test Name</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none" placeholder=""
                                    name="subTestName"
                                    onChange={handleChange}
                                    value={inputs.subTestName}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Unit</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none" placeholder=""
                                    name="unit"
                                    onChange={handleChange}
                                    value={inputs.unit}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">D value</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none" placeholder=""
                                    name="dvalue"
                                    onChange={handleChange}
                                    value={inputs.dvalue}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Method</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none" placeholder=""
                                    name="method"
                                    onChange={handleChange}
                                    value={inputs.method}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">List Type</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none" placeholder=""
                                    name="listType"
                                    onChange={handleChange}
                                    value={inputs.listType}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Highlight</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none" placeholder=""
                                    name="highlight"
                                    onChange={handleChange}
                                    value={inputs.highlight}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Display Order</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none" placeholder=""
                                    name="displayOrder"
                                    onChange={handleChange}
                                    value={inputs.displayOrder}
                                />
                            </div>
                        </div>
                 
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">D Value Memo</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none" placeholder=""
                                    name="dvalueMemo"
                                    onChange={handleChange}
                                    value={inputs.dvalueMemo}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-start  w-full space-x-4 p-2 ">
                        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900">Refresh</button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900"
                            onClick={handleSubTestMaster}
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
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Test Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sub Test Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Highlight</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">D Value Memo</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(dataa) && dataa.length > 0 ? (
                                    dataa.map((transaction, index) => (
                                        <tr
                                            key={index}
                                            className="border border-gray-200 text-center">
                                            <td className="px-4 py-4 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(transaction)}>
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.testName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.subTestName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.highlight}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.dvalueMemo}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.method}</td>

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
            <p className="text-red-600 font-medium">Note: A master could not be delete if used anywhere</p>
        </div>
    );
};

export default withAuth(SubTestMaster, ['SUPERADMIN', 'ADMIN','DOCTOR'])