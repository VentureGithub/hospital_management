'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import Icon from "../../(components)/icon";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'sonner';

export function Diagnosis() {
    return (
        <LayoutForm>
            
            <Diagnosisform />
            <Icon message="This page is for managing diagnosis details. You can view, add, or update information about different diagnoses, including diagnosis codes, descriptions, and relevant categories." />
        </LayoutForm>
    );
}

// Validation schema using Yup
const validationSchema = Yup.object({
    diagnosis: Yup.string()
        .required("Diagnosis Name is required")
        .matches(/^[a-zA-Z\s]+$/, 'diagnosis  should only contain letters and spaces'),
    managementOperation: Yup.string()
        .required("Management/Operation is required")
        .matches(/^[a-zA-Z\s]+$/, 'Management Operation  should only contain letters and spaces'),
    advice: Yup.string()
    .required("Advice is required")
        .matches(/^[a-zA-Z0-9\s]+$/, "Advice can only contain letters, numbers, and spaces"),
});

const Diagnosisform = () => {
    const [data, setData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [inputs, setInputs] = useState({
        diagnosisId: 0,
        diagnosis: "",
        managementOperation: "",
        advice: ""
    });

    // Fetch all diagnoses
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`DiagnosisMaster/getAlldAtaInList`);
            setData(response.data.data);
        } catch (error) {
            toast.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const handleMedicineTime = async (values, { resetForm }) => {
        try {
            if (isEdit) {
                const response = await apiClient.put(`DiagnosisMaster/updateData`, values);
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false);
                } else {
                    toast.error("Update failed! Please try again");
                }
            } else {
                const response = await apiClient.post(`DiagnosisMaster/saveAllData`, values);
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error("Save failed! Please try again");
                }
            }
            fetchApi();
            resetForm();
        } catch (error) {
            toast.error("Error handling diagnosis:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleUpdate = (diagno) => {
        setInputs({
            diagnosisId: diagno.diagnosisId,
            diagnosis: diagno.diagnosis,
            managementOperation: diagno.managementOperation,
            advice: diagno.advice
        });
        setIsEdit(true);
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="Diagnosis Master" />
            <div className='py-4'>
                <Formik
                    initialValues={inputs}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={handleMedicineTime}
                >
                    {({ values, handleChange }) => (
                        <Form className='lg:w-[50%] md:w-[100%] sm:w-[100%]'>
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2">
                                <div>
                                        <label className="block text-sm">Diagnosis Name</label>
                                        <Field
                                            type="text"
                                            name="diagnosis"
                                            className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                        />
                                        <ErrorMessage name="diagnosis" component="div" className="text-red-500" />
                                </div> 
                                <div >
                                        <label className="block text-sm">Management/Op.</label>
                                        <Field
                                            type="text"
                                            name="managementOperation"
                                            className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                        />
                                        <ErrorMessage name="managementOperation" component="div" className="text-red-500" />
                                 
                                </div>
                                <div >
                                        <label className="block text-sm">Advice</label>
                                        <Field
                                            type="text"
                                            name="advice"
                                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                                        />
                                        <ErrorMessage name="advice" component="div" className="text-red-500" />
                                
                                </div>
                            </div>
                            <div className="flex justify-start w-full space-x-4 p-2 my-4">
                                <button className="bg-gray-600 text-sm text-white px-6 py-2 rounded-lg hover:bg-gray-900" type="button" onClick={fetchApi}>Refresh</button>
                                <button
                                    className="bg-green-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-green-900"
                                    type="submit"
                                >
                                    {isEdit ? "Update" : "Save"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
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
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Diagnosis Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Management/Operation</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Advice</th>
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
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{transaction.diagnosis}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{transaction.managementOperation}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{transaction.advice}</td>
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

export default withAuth(Diagnosis, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
