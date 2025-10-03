'use client'
import LayoutForm from "../../layouts/layoutForm";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import withAuth from '@/app/(components)/WithAuth';
import * as Yup from "yup";
import apiClient from "@/app/config";
import Icon from "@/app/(components)/Icon";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from 'sonner';



export function TaxMaster() {
    return (
        <LayoutForm>
            <Icon message="This page manages tax-related information, allowing you to define tax rates,  for proper tax calculation and compliance in the hospital's financial transactions."/>
            <TaxMasterform />
        </LayoutForm>
    );
}


const TaxMasterform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [initialValues, setInitialValues] = useState({
        taxId: 0,
        tax: "",
        status: "",
    });

    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`tax/getAllTax`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            if (isEdit) {
                await apiClient.put(`tax/updatTax`, values);
                toast.success("Data updated successfully");
                setIsEdit(false);
            } else {
                await apiClient.post(`tax/save`, values);
                toast.success("Data saved successfully");
            }
            fetchApi();
            resetForm();
        } catch (error) {
            console.error("Error handling data:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleEdit = (tax) => {
        setInitialValues({
            taxId: tax.taxId,
            tax: tax.tax,
            status: tax.status,
        });
        setIsEdit(true);
    };

    const validationSchema = Yup.object({
        tax: Yup.number()
            .required("Tax slab is required")
            .min(1, "Tax slab must be at least 1%")
            .max(100, "Tax slab must be at most 100%"),
        status: Yup.string().required("Status is required"),
    });

    return (
        <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
            <Heading headingText="Tax Master" />
            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form className="lg:w-[50%] md:w-[100%] sm:w-[100%]">
                    <div className="grid gap-3 my-6">
                        <div>
                            <label className="block font-semibold text-sm">Tax Slab</label>
                            <Field
                                type="number"
                                name="tax"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                            />
                            <ErrorMessage
                                name="tax"
                                component="p"
                                className="text-red-500 text-xs"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm">Status</label>
                            <Field
                                as="select"
                                name="status"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                            >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </Field>
                            <ErrorMessage
                                name="status"
                                component="p"
                                className="text-red-500 text-xs"
                            />
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2">
                        <button
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900 text-sm"
                            type="button"
                            onClick={fetchApi}
                        >
                            Refresh
                        </button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900 text-sm"
                            type="submit"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </Form>
            </Formik>

            <div className="bg-white p-2 rounded-lg shadow-md mt-4">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border border-collapse shadow">
                        <thead>
                            <tr
                                className="text-center"
                                style={{ backgroundColor: "#CFE0E733" }}
                            >
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">
                                    Tax Slab
                                </th>
                                 <th className="px-4 py-2 border border-gray-200 text-sky-500">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(data) && data.length > 0 ? (
                                data.map((transaction, index) => (
                                    <tr
                                        key={index}
                                        className="border border-gray-200 text-center"
                                    >
                                        <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 flex items-center"
                                                onClick={() => handleEdit(transaction)}
                                            >
                                                <FaPencilAlt className="mr-1" />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 border border-gray-200">
                                            {`${transaction.tax}%`}
                                        </td>
                                          <td className="px-4 py-3 border border-gray-200">
                                            {`${transaction.status}`}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-red-600 font-medium">
                Note: A master could not be deleted if used anywhere
            </p>
        </div>
    );
};

export default withAuth(TaxMaster, ['DOCTOR', 'ADMIN', 'SUPERADMIN'])