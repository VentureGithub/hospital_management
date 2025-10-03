'use client';
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'sonner';

export function MedicineTime() {
    return (
        <LayoutForm>
            <MedicineTimeform />
           </LayoutForm>
    );
}

const MedicineTimeform = () => {
    const [data, setData] = useState([]);
    const [inputs, setInputs] = useState({
        medicineTimeMasterId: 0,
        medicineTime: "",
        description: "",
    });
    const [isEdit, setIsEdit] = useState(false);

    // Fetch all data
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`medicineTime/getAllData`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const handleMedicineTime = async (values, { resetForm }) => {
        try {
            if (isEdit) {
                // Update API call
                const response = await apiClient.put(`medicineTime/updateData`, values);
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false); // Reset edit state after update
                } else {
                    toast.error("Update failed! Please try again.");
                }
            } else {
                // Save API call for new record
                const response = await apiClient.post(`medicineTime/saveData`, values);
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error("Save failed! Please try again.");
                }
            }
            fetchApi(); // Refresh the list of records after save or update
            resetForm(); // Reset form fields after submission
        } catch (error) {
            console.error("Error handling data:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleUpdate = (time) => {
        setInputs({
            medicineTimeMasterId: time.medicineTimeMasterId,
            medicineTime: time.medicineTime,
            description: time.description,
        });
        setIsEdit(true);
    };

    // Yup validation schema
    const validationSchema = Yup.object({
        medicineTime: Yup.string().required("Medicine Time is required.")
        .matches(/^[a-zA-Z0-9\s]+$/, 'Medicine Name can only contain letters, numbers, and spaces')
        .matches(/^\S+(?: \S+)*$/, 'Medicine Name should not have leading or trailing spaces'),
        description: Yup.string().required("Description is required."),
    });

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
             <Heading headingText="Medicine Time Master" />
            <div className='py-4'>
                <Formik
                    initialValues={inputs}
                    validationSchema={validationSchema}
                    onSubmit={handleMedicineTime}
                    enableReinitialize
                >
                    {({ values, handleChange, setFieldValue }) => (
                        <Form className='lg:w-[60%] md:w-[100%] sm:w-[100%]'>
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2 ">
                                <div>
                                        <label className="block font-semibold text-sm">Medicine Time</label>
                                   
                                        <Field
                                            type="text"
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                            placeholder="Medicine Time"
                                            name="medicineTime"
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage
                                            name="medicineTime"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    
                                </div>
                                <div >
                                        <label className="block font-semibold text-sm">Description</label>
                                   
                                        <Field
                                            type="text"
                                            className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                            placeholder="Description"
                                            name="description"
                                            onChange={handleChange}
                                        />
                                        <ErrorMessage
                                            name="description"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                  
                                </div>
                            </div>
                            <div className="flex justify-start w-full space-x-4 p-2 my-4">
                                <button
                                    type="button"
                                    className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900"
                                    onClick={fetchApi}
                                >
                                    Refresh
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white  text-sm px-4 py-2 rounded-lg hover:bg-green-900"
                                >
                                    {isEdit ? "Update" : "Save"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <div className="bg-white p-2 my-4 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Medicine Time</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Description</th>
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
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{transaction.medicineTime}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{transaction.description}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center">No data available</td>
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

export default withAuth(MedicineTime, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
