'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'sonner';

export function SaltMaster() {
    return (
        <LayoutForm>
            <SaltMasterform />
        </LayoutForm>
    );
}

const SaltMasterform = () => {

    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [inputs, setInputs] = useState({
        hsnIdLong: 0,
        hsnCodeString: "",
        hsnShortNameString: ""
    });

    // Fetch all HSN data
    const fetchApi = async () => {
        try {
            const response = await apiClient.get('hsnMaster/getAllData');
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    // Yup validation schema
    const validationSchema = Yup.object({
        hsnCodeString: Yup.string()
            .required("HSN/SAC No is required"),
        hsnShortNameString: Yup.string()
            .required("HSN Short Name is required")
    });

    // Handle form submission (save or update)
    const handleSubmit = async (values, { resetForm }) => {
        try {
            if (isEdit) {
                // Update existing record
                const response = await apiClient.put(
                    `hsnMaster/updateData/${inputs.hsnIdLong}`,
                    values
                );
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false);
                } else {
                    toast.error("Update failed! Please try again");
                }
            } else {
                // Save new record
                const response = await apiClient.post('hsnMaster/saveData', values);
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error("Save failed! Please try again");
                }
            }
            fetchApi(); // Refresh the list after save/update
            resetForm();
        } catch (error) {
            console.error("Error handling data:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    // Set fields for editing
    const handleUpdate = (hsn) => {
        setInputs({
            hsnIdLong: hsn.hsnIdLong,
            hsnCodeString: hsn.hsnCodeString,
            hsnShortNameString: hsn.hsnShortNameString
        });
        setIsEdit(true);
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl'>
            <Heading headingText="HSN Master" />
            <div className='py-4'>
                <Formik
                    initialValues={inputs}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}  // Allow Formik to update when `inputs` changes
                >
                    {({ handleChange, values, errors, touched }) => (
                        <Form className='lg:w-[50%] md:w-[100%] sm:w-[100%]'>
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 m-2">
                                <div>
                                    <label className="block font-semibold text-sm mb-2">HSN/SAC No</label>
                                    <Field
                                        type="text"
                                        className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                        name="hsnCodeString"
                                        placeholder="HSN/SAC No"
                                    />
                                    <ErrorMessage name="hsnCodeString" component="div" className="text-red-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block font-semibold text-sm mb-2">HSN Short Name</label>
                                    <Field
                                        type="text"
                                        className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                        name="hsnShortNameString"
                                        placeholder="Short Name"
                                    />
                                    <ErrorMessage name="hsnShortNameString" component="div" className="text-red-500 text-sm" />
                                </div>
                            </div>
                            <div className="flex justify-start w-full space-x-4 p-2">
                                <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900 text-sm" type="reset">Refresh</button>
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900 text-sm"
                                    type="submit"
                                >
                                    {isEdit ? "Update" : "Save"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <div className="bg-white p-2 my-4 md:p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">HSN No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">HSN Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((hsn, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(hsn)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{hsn.hsnCodeString}</td>
                                            <td className="px-4 py-3 border border-gray-200">{hsn.hsnShortNameString}</td>
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
        </div>
    );
};

export default withAuth(SaltMaster, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
