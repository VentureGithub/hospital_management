'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import { BaseUrl } from "@/app/config";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from 'sonner';

export function Discount() {
    return (
        <LayoutForm>

            <Discountform />
        </LayoutForm>
    );
}

const Discountform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]); // Initialize with empty array
    const [dataa, setDataa] = useState([]); // Initialize with empty array
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialValues, setInitialValues] = useState({
        discountId: 0,
        discountPercentage: "",
        userId: "",
        roles: "",
    });

    // Validation schema using Yup
    const validationSchema = Yup.object({
        userId: Yup.string()
            .required("Please select a user")
            .matches(/^[1-9]\d*$/, "Invalid user selection"),
        discountPercentage: Yup.number()
            .required("Discount percentage is required")
            .min(1, "Discount must be at least 1%")
            .max(100, "Discount cannot exceed 100%"),
    });

    // Fetch discount data
    const fetchApi = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get(`descount/getDescount`);
            if (response?.data?.data) {
                setData(response.data.data);
            } else {
                setData([]); // Set empty array if no data
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch discount data");
            setData([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch user data
    const fetchCatagory = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get(`user/getAllUser`);
            if (response?.data?.data) {
                setDataa(response.data.data);
            } else {
                setDataa([]); // Set empty array if no data
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch user data");
            setDataa([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchApi();
        fetchCatagory();
    }, []);

    // Handle form submission
    const handleSubmit = async (values, { resetForm }) => {
        try {
            setIsLoading(true);
            const response = isEdit
                ? await apiClient.put(`descount/updateDescount`, values)
                : await apiClient.post(`descount/create`, values);

            if (response.status === 200) {
                toast.success(`${isEdit ? "Data updated" : "Data saved"} successfully`);
                fetchApi();
                setIsEdit(false);
                resetForm();
            } else {
                toast.error(`${isEdit ? "Update" : "Save"} failed!`);
            }
        } catch (error) {
            console.error("Error saving data:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle editing a discount
    const handleUpdate = (discount) => {
        setInitialValues({
            discountId: discount.discountId,
            discountPercentage: discount.discountPercentage,
            userId: discount.userId,
            roles: discount.roles,
        });
        setIsEdit(true);
    };

    if (error) {
        return <div className="text-red-500 text-sm p-4">{error}</div>;
    }

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="Discount Master " />
            <div className="py-4">
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ resetForm }) => (
                        <Form className="lg:w-[60%] md:w-[100%] sm:w-[100%]">
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <div>
                                        <label className="block text-sm font-semibold">User</label>
                                        <Field
                                            as="select"
                                            name="userId"
                                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                                            disabled={isLoading}
                                        >
                                            <option value="">Select user</option>
                                            {dataa && dataa.map((user) => (
                                                <option key={user.userId} value={user.userId}>
                                                    {user.userName} - ({user.roles})
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage
                                            name="userId"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                </div>

                                <div >
                                        <label className="block font-semibold text-sm">Discount(%)</label>
                                        <Field
                                            type="text"
                                            name="discountPercentage"
                                            className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                            disabled={isLoading}
                                        />
                                        <ErrorMessage
                                            name="discountPercentage"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                </div>
                            </div>

                            <div className="flex justify-start space-x-4 my-4">
                                <button
                                    type="button"
                                    className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900"
                                    onClick={() => {
                                        resetForm();
                                        setIsEdit(false);
                                    }}
                                    disabled={isLoading}
                                >
                                    Refresh
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-green-900"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Processing..." : (isEdit ? "Update" : "Save")}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            <div className="bg-white p-2 my-2 md:p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border border-collapse shadow">
                        <thead>
                            <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Discount</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">Loading...</td>
                                </tr>
                            ) : data && data.length > 0 ? (
                                data.map((transaction, index) => (
                                    <tr key={index} className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                            <button
                                                type="button"
                                                className="text-blue-500 hover:text-blue-700 flex items-center"
                                                onClick={() => handleUpdate(transaction)}
                                                disabled={isLoading}
                                            >
                                                <FaPencilAlt className="mr-1" />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 border border-gray-200">{`${transaction.discountPercentage}%`}</td>
                                        <td className="px-4 py-3 border border-gray-200">{transaction.roles}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Discount, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])