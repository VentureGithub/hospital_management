'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";


export function TestCategory() {
    return (
        <LayoutForm>
           <TestCategoryform />
        </LayoutForm>
    );
}

const TestCategoryform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [testTypes, setTestTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [inputs, setInputs] = useState({
        categoryId: 0,
        typeId: "",
        categoryName: "",
        description: "",
        active: "true",
        entryDate: new Date().toISOString().split('T')[0],
        typeName: ""
    });

    // Fetch all categories (unfiltered)
    const fetchCategories = async () => {
        try {
            const response = await apiClient.get(`testCatagory/getTest/catagory`);
            setCategories(response.data.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Fetch categories filtered by test type id
    const fetchCategoriesByType = async (typeId) => {
        try {
            if (!typeId) {
                await fetchCategories();
                return;
            }
            const response = await apiClient.get(`testCatagory/getByTestTypeId?testTypeId=${typeId}`);
            setCategories(response.data.data || []);
        } catch (error) {
            console.error("Error fetching categories by type:", error);
        }
    };

    const fetchTestTypes = async () => {
        try {
            const response = await apiClient.get(`testTypeMaster/getAllTestTypeMaster`);
            setTestTypes(response.data.data || []);
        } catch (error) {
            console.error("Error fetching test types:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchTestTypes();
    }, []);

    // When user changes typeId, also update typeName in inputs and fetch categories for that type
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'typeId') {
            const parsed = parseInt(value) || "";
            const selectedType = testTypes.find(t => t.typeId === parsed);
            setInputs(prev => ({
                ...prev,
                typeId: parsed,
                typeName: selectedType ? selectedType.typeName : "",
            }));
            // fetch categories related to selected type
            fetchCategoriesByType(parsed);
        } else {
            setInputs(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // normalize payload
            const payload = {
                categoryId: inputs.categoryId || 0,
                typeId: inputs.typeId || 0,
                categoryName: inputs.categoryName,
                description: inputs.description || "",
                active: inputs.active === true || inputs.active === 'true',
                entryDate: inputs.entryDate || new Date().toISOString().split('T')[0],
                typeName: inputs.typeName || (testTypes.find(t => t.typeId === inputs.typeId)?.typeName ?? "")
            };

            let response;
            if (isEdit) {
                // NEW update endpoint as provided
                response = await apiClient.put(`testCatagory/updateTestCategory`, payload);
                if (response.status === 200) {
                    alert("Category updated successfully");
                    setIsEdit(false);
                } else {
                    alert(`Update failed! Status: ${response.status}`);
                }
            } else {
                // keep existing save endpoint (keeps behavior same)
                // ensure active is boolean and include entryDate & typeName for consistency
                const createPayload = {
                    typeId: payload.typeId,
                    categoryName: payload.categoryName,
                    description: payload.description,
                    active: payload.active,
                    entryDate: payload.entryDate,
                    typeName: payload.typeName
                };
                response = await apiClient.post(`testCatagory/save`, createPayload);
                if (response.status === 200) {
                    alert("Category saved successfully");
                } else {
                    alert(`Save failed! Status: ${response.status}`);
                }
            }

            // Refresh the list for the current selected type (or all)
            if (inputs.typeId) {
                await fetchCategoriesByType(inputs.typeId);
            } else {
                await fetchCategories();
            }

            // reset inputs
            setInputs({
                categoryId: 0,
                typeId: "",
                categoryName: "",
                description: "",
                active: "true",
                entryDate: new Date().toISOString().split('T')[0],
                typeName: ""
            });
        } catch (error) {
            console.error("Error handling save operation:", error);
            const msg = error?.response?.data ?? error.message;
            alert(`An error occurred: ${JSON.stringify(msg)}`);
        }
    };

    const handleUpdate = (category) => {
        setInputs({
            categoryId: category.categoryId ?? category.category_id ?? 0,
            typeId: category.typeId ?? category.type_id ?? "",
            categoryName: category.categoryName ?? category.category_name ?? "",
            description: category.description ?? "",
            active: (category.active === true || category.active === 'true') ? 'true' : 'false',
            entryDate: category.entryDate ? category.entryDate.split('T')[0] : new Date().toISOString().split('T')[0],
            typeName: category.typeName ?? ""
        });
        setIsEdit(true);
    };

    return (
        <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
            <Heading headingText="Test Category Master" />
            <div className="py-4">
                <form className='lg:w-[50%] md:w-[100%] sm:w-[100%]' onSubmit={handleSave}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2">
                        <div>
                            <label className="block text-sm">Test Type</label>
                            <select
                                name="typeId"
                                onChange={handleChange}
                                value={inputs.typeId}
                                className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none"
                            >
                                <option value="">Select Test Type</option>
                                {testTypes?.map((type) => (
                                    <option key={type.typeId} value={type.typeId}>
                                        {type.typeName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm">Category Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none"
                                name="categoryName"
                                value={inputs.categoryName}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm">Description</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none"
                                name="description"
                                value={inputs.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="sm:flex sm:space-x-4">
                            <div className="w-full sm:w-1/2">
                                <label className="block text-sm">Status</label>
                                <select
                                    name="active"
                                    onChange={handleChange}
                                    value={inputs.active}
                                    className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none"
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                            <div className="w-full sm:w-1/2">
                                <label className="block text-sm">Entry Date</label>
                                <input
                                    type="date"
                                    name="entryDate"
                                    value={inputs.entryDate}
                                    onChange={handleChange}
                                    className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start w-full my-4 space-x-4 p-2">
                        <button
                            className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900"
                            type="button"
                            onClick={() => {
                                // refresh categories for selected type or all
                                if (inputs.typeId) fetchCategoriesByType(inputs.typeId);
                                else fetchCategories();
                            }}
                        >
                            Refresh
                        </button>
                        <button
                            className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
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
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Category Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Type</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(categories) && categories.length > 0 ? (
                                    categories.map((category, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(category)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{category.categoryName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{category.typeName ?? inputs.typeName}</td>
                                            <td className="px-4 py-3 border border-gray-200">
                                                <span className={`font-semibold ${category.active === true ? 'text-green-600' : category.active === false ? 'text-red-600' : 'text-gray-500'}`}>
                                                    {category.active === true ? "ACTIVE" : category.active === false ? "INACTIVE" : "N/A"}
                                                </span>
                                            </td>
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

export default withAuth(TestCategory, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])
