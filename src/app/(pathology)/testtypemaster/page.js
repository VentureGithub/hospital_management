'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';


export function TestType() {
    return (
        <LayoutForm>
            <Diagnosisform />
        </LayoutForm>
    );
}

const Diagnosisform = () => {
    const [data, setData] = useState([]);
    const [inputs, setInputs] = useState({
        testTypeId: 0,         // internal id used in listing
        typeName: "",
        description: "",
        active: "true",        // kept as string because select returns string; convert when sending
        entryDate: new Date().toISOString().split('T')[0] // default today's date YYYY-MM-DD
    });
    const [isEdit, setIsEdit] = useState(false);

    // Fetch all test types
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`testTypeMaster/getAllTestTypeMaster`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Build request payload normalized to API contract
            const payload = {
                typeId: inputs.testTypeId || 0,
                typeName: inputs.typeName,
                description: inputs.description,
                active: inputs.active === true || inputs.active === 'true',
                entryDate: inputs.entryDate || new Date().toISOString().split('T')[0]
            };

            if (isEdit) {
                // NEW updated endpoint (PUT)
                const response = await apiClient.put(
                    `testTypeMaster/update`,
                    payload
                );
                if (response.status === 200) {
                    alert("Data updated successfully");
                    setIsEdit(false);
                } else {
                    alert("Update failed! Please try again");
                }
            } else {
                // Create (POST) — keep existing endpoint
                // convert active to boolean for create as well
                const createPayload = {
                    typeName: inputs.typeName,
                    description: inputs.description,
                    active: inputs.active === true || inputs.active === 'true',
                    entryDate: inputs.entryDate || new Date().toISOString().split('T')[0]
                };
                const response = await apiClient.post(
                    `testTypeMaster/saveTestTypeMaster`,
                    createPayload
                );
                if (response.status === 200) {
                    alert("Data saved successfully");
                } else {
                    alert("Save failed! Please try again");
                }
            }
            await fetchApi();
            setInputs({
                testTypeId: 0,
                typeName: "",
                description: "",
                active: "true",
                entryDate: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error("Error handling test type:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleUpdate = (test) => {
        // Map the fetched record into the inputs. Some APIs return `testTypeId`, some `typeId`.
        const incomingId = test.testTypeId ?? test.typeId ?? 0;
        setInputs({
            testTypeId: incomingId,
            typeName: test.typeName ?? "",
            description: test.description ?? "",
            // preserve boolean as string for the select control
            active: (test.active === true || test.active === 'true') ? 'true' : 'false',
            entryDate: test.entryDate ? test.entryDate.split('T')[0] : new Date().toISOString().split('T')[0]
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
        <div className='p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl'>
            <Heading headingText="Test Type Master" />
            <div className='py-4'>
                <form className='lg:w-[60%] md:w-[100%] sm:w-[100%]' onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2">
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block text-sm">Test Type</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input
                                    type="text"
                                    className="w-full px-4 text-sm py-2 border rounded-lg focus:outline-none"
                                    name="typeName"
                                    onChange={handleChange}
                                    value={inputs.typeName}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block text-sm">Description</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input
                                    type="text"
                                    className="w-full px-4 text-sm py-2 border rounded-lg focus:outline-none"
                                    name="description"
                                    onChange={handleChange}
                                    value={inputs.description}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block text-sm">Status</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <select
                                    className="w-full px-4 text-sm py-2 border rounded-lg focus:outline-none"
                                    name="active"
                                    onChange={handleChange}
                                    value={inputs.active}
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block text-sm">Entry Date</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input
                                    type="date"
                                    className="w-full px-4 text-sm py-2 border rounded-lg focus:outline-none"
                                    name="entryDate"
                                    onChange={handleChange}
                                    value={inputs.entryDate}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-start my-3 w-full space-x-4 p-2">
                        <button className="bg-gray-600 text-sm text-white px-6 py-2 rounded-lg hover:bg-gray-900" type="button" onClick={fetchApi}>Refresh</button>
                        <button
                            className="bg-green-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-green-900"
                            type="submit"
                        >
                            {isEdit ? "Update" : "Save"}
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
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Test Type</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Description</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((test, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(test)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{test.typeName}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{test.description}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">
                                                <span className={`font-semibold ${test.active === true ? 'text-green-600' : test.active === false ? 'text-red-600' : 'text-gray-500'}`}>
                                                    {test.active === true ? "ACTIVE" : test.active === false ? "INACTIVE" : "N/A"}
                                                </span>
                                            </td>
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

export default withAuth(TestType, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])
