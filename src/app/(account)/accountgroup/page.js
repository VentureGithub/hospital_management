'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt , FaExclamationCircle ,FaSync } from "react-icons/fa";
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
            toast.error("Unable to fetch account group data.");
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
            } else {
                response = await apiClient.post("accountGroup/create", values);
            }

            if (response.status === 200) {
                toast.success(`Data ${isEdit ? "updated" : "saved"} successfully`);
                setIsEdit(false);
                fetchApi();
                resetForm();
                setInitialValues({
                    accountGrooupId: 0,
                    groupName: "",
                    category: "",
                });
            } else {
                toast.error(`Operation failed! Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error handling save operation:", error);
            toast.error(`An unexpected error occurred.`);
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
        <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                        <FaPencilAlt size={18} />
                    </div>
                    <Heading headingText="Account Group" />
                </div>
                <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
                    Master • Account Group
                </div>
            </div>

            {/* Form Section */}
            <div className="py-4">
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                >
                    {({ handleReset }) => (
                        <Form className="lg:w-[50%] md:w-[100%] sm:w-[100%]">
                            <div className="grid grid-cols-1 gap-3 m-2">
                                {/* Group Name Field */}
                                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                                    <label className="block font-semibold text-sm mb-2 text-sky-800">
                                        Group Name
                                    </label>
                                    <Field
                                        type="text"
                                        name="groupName"
                                        placeholder="Enter Group Name"
                                        className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
                                    />
                                    <ErrorMessage
                                        name="groupName"
                                        component="div"
                                        className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md"
                                    >
                                        {(msg) => (
                                            <>
                                                <FaExclamationCircle /> {msg}
                                            </>
                                        )}
                                    </ErrorMessage>
                                </div>

                                {/* Category Field */}
                                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                                    <label className="block font-semibold text-sm mb-2 text-sky-800">
                                        Category
                                    </label>
                                    <Field
                                        as="select"
                                        name="category"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm border-gray-200 focus:ring-2 focus:ring-sky-300"
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
                                        className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md"
                                    >
                                        {(msg) => (
                                            <>
                                                <FaExclamationCircle /> {msg}
                                            </>
                                        )}
                                    </ErrorMessage>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-start w-full gap-3 px-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleReset();
                                        setIsEdit(false);
                                        setInitialValues({
                                            accountGrooupId: 0,
                                            groupName: "",
                                            category: "",
                                        });
                                    }}
                                    className="inline-flex items-center gap-2 bg-slate-600 text-sm text-white px-6 py-2 rounded-lg hover:bg-slate-800 active:scale-[.99] transition"
                                >
                                    <FaSync /> Refresh
                                </button>

                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 bg-emerald-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-emerald-800 active:scale-[.99] transition"
                                >
                                    <FaPencilAlt /> {isEdit ? "Update" : "Save"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            {/* Data Table */}
            <div className="bg-white p-3 my-4 text-sm rounded-lg shadow-md border border-sky-100">
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
                            <thead className="sticky top-0 z-10">
                                <tr className="text-center bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur">
                                    <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Action</th>
                                    <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Sr</th>
                                    <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide text-left">Name</th>
                                    <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide text-left">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr
                                            key={index}
                                            className="border border-gray-100 hover:bg-sky-50/40 transition"
                                        >
                                            <td className="px-4 py-3 border border-gray-100 text-center">
                                                <button
                                                    className="text-sky-600 hover:text-sky-800 flex items-center justify-center mx-auto"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-100">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-100 text-sm text-gray-800 uppercase">{transaction.groupName}</td>
                                            <td className="px-4 py-3 border border-gray-100 text-sm text-gray-800 uppercase">{transaction.category}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-gray-500">
                                            No data available
                                        </td>
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
