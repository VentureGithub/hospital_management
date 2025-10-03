'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import Icon from "../../(components)/Icon";

export function TestMaster() {
    return (
        <LayoutForm>
            <Icon message="This page manages specific tests by providing detailed information such as the test name, category, and cost, enabling efficient organization and administration of diagnostic services." />
            <TestMasterform />
        </LayoutForm>
    );
}

const TestMasterform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [tests, setTests] = useState([]);
    const [categories, setCategories] = useState([]);
    const [inputs, setInputs] = useState({
        testId: 0,
        testCategoryId: 0,
        testCategoryName: "",
        testName: "",
        displayName: "",
        cashTestName: "",
        displayOrder: 0,
        testPrice: 0
    });

    // Fetch all tests
    const fetchTests = async () => {
        try {
            const response = await apiClient.get(`/testTypeMaster/getAllTestTypeMaster`);
            setTests(response.data.data);
            } 
            catch (error) {
            console.error("Error fetching tests:", error);
        }
    };

    const fetchCategories = async () => {
    try {
        const response = await apiClient.get("testCatagory/getTest/catagory");
        setCategories(response.data.data);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};


  useEffect(() => {
    fetchTests();
    fetchCategories();  
}, []);


    const handleSave = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (isEdit) {
                response = await apiClient.put(`testmaster/updatetestmaster`, inputs);
                if (response.status === 200) {
                    alert("Test updated successfully");
                    setIsEdit(false);
                } else {
                    alert(`Update failed! Status: ${response.status}`);
                }
            } else {
                response = await apiClient.post("testmaster/savetestmaster", inputs);
                if (response.status === 200) {
                    alert("Test saved successfully");
                } else {
                    alert(`Save failed! Status: ${response.status}`);
                }
            }

            fetchTests();
            setInputs({
                testId: 0,
                testCategoryId: 0,
                testCategoryName: "",
                testName: "",
                displayName: "",
                cashTestName: "",
                displayOrder: 0,
                testPrice: 0
            });
        } catch (error) {
            console.error("Error handling save operation:", error);
            alert(`An error occurred: ${error.response ? error.response.data : error.message}`);
        }
    };

    const handleUpdate = (test) => {
        setInputs({
            testId: test.testId,
            testCategoryId: test.categoryId,
            testCategoryName: test.categoryName,
            testName: test.testName,
            displayName: test.displayName,
            cashTestName: test.cashTestName,
            displayOrder: test.displayOrder,
            testPrice: test.testPrice
        });
        setIsEdit(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "testCategoryId") {
            const selectedCategory = categories.find(c => c.categoryId === parseInt(value));
            setInputs(prevInputs => ({
                ...prevInputs,
                testCategoryId: parseInt(value),
                testCategoryName: selectedCategory ? selectedCategory.categoryName : ""
            }));
        } else {
            setInputs(prevInputs => ({
                ...prevInputs,
                [name]: value
            }));
        }
    };

    return (
        <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
            <Heading headingText="Test Master" />
            <div className="py-4">
                <form className='lg:w-[60%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 gap-2 m-2">

                        {/* Category dropdown */}
                        <div>
                            <label className="block text-sm">Category</label>
                           <select
    name="testCategoryId"
    value={inputs.testCategoryId}
    onChange={handleChange}
    className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none"
>
    <option value="">Select Category</option>
    {categories.map(cat => (
        <option key={cat.categoryId} value={cat.categoryId}>
            {cat.categoryName}
        </option>
    ))}
</select>

                        </div>

                        {/* Test Name dropdown (optional, if you want user to select existing test names) */}
                        <div>
                            <label className="block text-sm">Test Name</label>
                            <select
                                name="testName"
                                value={inputs.testName}
                                onChange={handleChange}
                                className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none"
                            >
                                <option value="">Select Test Name</option>
                                {tests.map((test, index) => (
                                    <option key={index} value={test.typeName}>{test.typeName}</option>
                                ))}
                            </select>
                        </div>

                        {/* Or if you want a free text input for testName, replace above select with input */}

                        <div>
                            <label className="block text-sm">Display Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                name="displayName"
                                value={inputs.displayName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm">Cash Test Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                name="cashTestName"
                                value={inputs.cashTestName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm">Display Order</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                name="displayOrder"
                                value={inputs.displayOrder}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm">Test Price</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                name="testPrice"
                                value={inputs.testPrice}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </form>
                <div className="flex justify-start w-full space-x-4 p-2 my-4">
                    <button
                        className="bg-gray-600 text-white px-6 py-2 text-sm rounded-lg hover:bg-gray-900"
                        type="button"
                        onClick={fetchTests}
                    >
                        Refresh
                    </button>
                    <button
                        className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-900"
                        onClick={handleSave}
                        type="submit"
                    >
                        {isEdit ? "Update" : "Save"}
                    </button>
                </div>
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
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Category</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Test Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(tests) && tests.length > 0 ? (
                                    tests.map((test, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(test)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{test.testCategoryName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{test.testName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{test.testPrice}</td>
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

export default withAuth(TestMaster, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
