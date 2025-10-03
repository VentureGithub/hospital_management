'use client'; 

import { useState, useEffect } from "react";
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import Icon from "@/app/(components)/Icon";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'sonner'; // Import toast from Sonner

export function AmbulanceMaster() {
    return (
        <LayoutForm>
            <AmbulanceForm />
        </LayoutForm>
    );
}

const AmbulanceForm = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [emp, setEmp] = useState([]);
    const [data, setData] = useState([]);
    const [initialValues, setInitialValues] = useState({
        ambulanceId: 0,
        ambulanceNumber: "",
        empCode: "",
        createDate: "",
    });

    // Fetch ambulance data
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`ambulanceMaster/getAllData`);
            setData(response.data.data);
        } catch (error) {
            toast.error('Error fetching ambulance data');
            console.error("Error fetching data:", error);
        }
    };

    // Fetch driver data
    const fetchEmp = async () => {
        try {
            const response = await apiClient.get(`emp/getAllEmployee/Driver`);
            setEmp(response.data.data);
        } catch (error) {
            toast.error('Error fetching driver data');
            console.error("Error fetching employees:", error);
        }
    };

    useEffect(() => {
        fetchApi();
        fetchEmp();
    }, []);

    // Submit handler
    const handleSubmit = async (values, { resetForm }) => {
        try {
            const apiUrl = isEdit
                ? `ambulanceMaster/updateData`
                : `ambulanceMaster/create`;

            const response = await apiClient[isEdit ? "put" : "post"](apiUrl, values);

            if (response.status === 200) {
                // Success toast message
                toast.success(isEdit ? "Ambulance updated successfully" : "Ambulance saved successfully");
                setIsEdit(false);
                resetForm();
                fetchApi();
            } else {
                // Failure toast message
                toast.error("Operation failed! Please try again");
            }
        } catch (error) {
            // Display error toast if an error occurs
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
            toast.error(errorMessage);
            console.error("Error submitting form:", error);
        }
    };

    // Update form for editing
    const handleUpdate = (ambulance) => {
        setInitialValues({
            ambulanceId: ambulance.ambulanceId,
            ambulanceNumber: ambulance.ambulanceNumber,
            empCode: ambulance.empCode,
            createDate: ambulance.createDate,
        });
        setIsEdit(true);
    };

    const validationSchema = Yup.object({
        ambulanceNumber: Yup.string()
            .required("Ambulance number is required")
            .matches(/^[A-Za-z0-9\s-]+$/, "Invalid ambulance number format"),
        empCode: Yup.string().required("Driver is required"),
        createDate: Yup.date().required("Date is required")
            .max(new Date(), "Date cannot be in the future"),
    });

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl'>
            <Heading headingText="Ambulance Master" />
            <div className='py-4'>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ resetForm }) => (
                        <Form className='lg:w-[50%] md:w-[100%] sm:w-[100%]'>
                            <div className="grid grid-cols-1 gap-3 my-6">
                                <div>
                                    <label className="block font-semibold text-sm">Driver</label>
                                    <Field
                                        as="select"
                                        name="empCode"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                    >
                                        <option value="">Select Driver</option>
                                        {emp?.map((driver) => (
                                            <option key={driver.empCode} value={driver.empCode}>
                                                {driver.empName}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="empCode" component="p" className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <label className="block font-semibold text-sm">Ambulance No.</label>
                                    <Field
                                        type="text"
                                        name="ambulanceNumber"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                    />
                                    <ErrorMessage name="ambulanceNumber" component="p" className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <label className="block font-semibold text-sm">Date</label>
                                    <Field
                                        type="date"
                                        name="createDate"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                    />
                                    <ErrorMessage name="createDate" component="p" className="text-red-600 text-sm" />
                                </div>
                            </div>
                            <div className="flex justify-start w-full space-x-4 p-2">
                                <button
                                    type="button"
                                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900 text-sm"
                                    onClick={() => {
                                        resetForm();
                                        setIsEdit(false);
                                    }}
                                >
                                    Refresh
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900 text-sm"
                                >
                                    {isEdit ? "Update" : "Save"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Ambulance</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Driver</th>
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
                                            <td className="px-4 py-3 border border-gray-200">{transaction.ambulanceNumber}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.empName}</td>
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
            <p className="text-red-600 font-medium text-sm">Note: A master could not be deleted if used anywhere</p>
        </div>
    );
};

export default withAuth(AmbulanceMaster, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);


