'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from 'sonner';
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export function GenerateSalary() {
    return (
        <LayoutForm>
            <GenerateSalaryform />
        </LayoutForm>
    );
}

const GenerateSalaryform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [initialValues, setInitialValues] = useState({
        accountGrooupId: 0,
        groupName: "",
        category: "",
    });

    // Validation schema using Yup
    const validationSchema = Yup.object({
        groupName: Yup.string()
            .required("Group Name is required")
            .min(3, "Group Name must be at least 3 characters long"),
        category: Yup.string()
            .required("Category is required"),

    });

    // Fetch data from the API
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`accountGroup/getAllData`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const handleSave = async (values, { resetForm }) => {
        try {
            let response;
            if (isEdit) {
                response = await apiClient.put(`salary/updateData`, values);
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false);
                } else {
                    toast.error(`Update failed! Status: ${response.status}`);
                }
            } else {
                response = await apiClient.post("accountGroup/create", values);
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error(`Save failed! Status: ${response.status}`);
                }
            }

            fetchApi();
            resetForm();
            setInitialValues({
                accountGrooupId: 0,
                groupName: "",
                category: "",
            });
        } catch (error) {
            console.error("Error handling save operation:", error);
            toast.error(`An error occurred: ${error.response ? error.response.data : error.message}`);
        }
    };

    const handleUpdate = (group) => {
        setInitialValues({
            accountGrooupId: group.accountGrooupId,
            groupName: group.groupName,
            category: group.category,
        });
        setIsEdit(true);
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="Account Group" />
            <div className='py-4'>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                >
                    {({ values, handleChange, handleSubmit, resetForm }) => (
                        <Form className="lg:w-[50%] md:w-[100%] sm:w-[100%]">
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 my-2">
                                {/* Group Name Field */}
                                <div>
                                        <label className="block font-semibold mb-2 text-sm">Group Name</label>
                                        <Field
                                            type="text"
                                            name="groupName"
                                            className="w-full px-4 text-sm py-2 border rounded-lg focus:outline-none"
                                            placeholder="Enter Group Name"
                                        />
                                        <ErrorMessage
                                            name="groupName"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                </div>

                                {/* Category Field */}
                                <div>
                                        <label className="block font-semibold mb-2 text-sm">Category</label>
                                        <Field
                                            as="select"
                                            name="category"
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                        >
                                            <option value="">Select an option</option>
                                            <option value="Libilities">Libilities</option>
                                            <option value="Assets">Assets</option>
                                            <option value="Expense">Expense</option>
                                            <option value="Income">Income</option>
                                        </Field>
                                        <ErrorMessage
                                            name="category"
                                            component="div"
                                            className="text-red-500 text-sm mt-1 "
                                        />
                                </div>
                            </div>

                            <div className="flex justify-start w-full my-4 space-x-4 text-sm p-2">
                                <button
                                    type="button"
                                    className="bg-gray-600 text-white px-6 py-2 text-sm rounded-lg hover:bg-gray-900"
                                    onClick={() => {
                                        resetForm();
                                        setIsEdit(false);
                                        setInitialValues({
                                            accountGrooupId: 0,
                                            groupName: "",
                                            category: "",
                                        });
                                    }}
                                >
                                    Refresh
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
                                >
                                    {isEdit ? "Update" : "Save"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            {/* Data Table */}
            <div className="bg-white p-2 my-2 md:p-2 rounded-lg shadow-md">
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
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Category</th>
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
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.groupName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.category}</td>
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

export default withAuth(GenerateSalary, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
