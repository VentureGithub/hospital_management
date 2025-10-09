'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt, FaSync, FaSave ,FaUserTie } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { toast } from 'sonner';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export function DesignationMaster() {
    return (
        <LayoutForm>
            <DesignationMasterform />
        </LayoutForm>
    );
}

const DesignationMasterform = () => {
    const [data, setData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);

    const fetchApi = async () => {
        try {
            const response = await apiClient.get("designationmaster/getAll");
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Error loading designation data");
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const formik = useFormik({
        initialValues: {
            designationId: 0,
            designationName: ""
        },
        validationSchema: Yup.object({
            designationName: Yup.string()
                .required('Designation Name is required')
                .matches(/^[a-zA-Z\s]+$/, 'Designation Name should only contain letters and spaces'),
        }),
        onSubmit: async (values) => {
            try {
                if (isEdit) {
                    const response = await apiClient.put(`designationmaster/update`, values);
                    if (response.status === 200) {
                        toast.success("Data updated successfully");
                        setIsEdit(false);
                    } else {
                        toast.error("Update failed! Please try again");
                    }
                } else {
                    const response = await apiClient.post("designationmaster/create", values);
                    if (response.status === 200) {
                        toast.success("Data saved successfully");
                    } else {
                        toast.error("Save failed! Please try again");
                    }
                }
                fetchApi();
                formik.resetForm();
            } catch (error) {
                console.error("Error handling data:", error);
                toast.error("An error occurred. Please try again.");
            }
        }
    });

    const handleUpdate = (designation) => {
        formik.setValues({
            designationId: designation.designationId,
            designationName: designation.designationName
        });
        setIsEdit(true);
    };

    const handleRefresh = () => {
        formik.resetForm();
        setIsEdit(false);
    };

    return (
        <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                        <FaUserTie size={18} />
                    </div>
                    <Heading headingText="Designation Master" />
                </div>
                <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
                    Master • Designation
                </div>
            </div>

            <div className="py-4">
                <form onSubmit={formik.handleSubmit} className="lg:w-full md:w-full sm:w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 m-2">
                        <div>
                            <label className="block font-semibold text-sm text-sky-800 mb-2">Designation Name</label>
                            <input
                                type="text"
                                name="designationName"
                                placeholder=""
                                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                                    formik.touched.designationName && formik.errors.designationName ? 'border-red-500 ring-red-300' : 'border-gray-200 ring-sky-300'
                                }`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.designationName}
                            />
                            {formik.touched.designationName && formik.errors.designationName && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.designationName}</div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-start space-x-4 my-4 p-2 w-full">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="inline-flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900 active:scale-[.98] transition"
                        >
                            <FaSync /> Refresh
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-900 active:scale-[.98] transition"
                        >
                            <FaSave /> {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-3 rounded-lg shadow-md border border-sky-100">
                <div className="overflow-x-auto max-h-[400px]">
                    <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
                        <thead className="sticky top-0 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur z-10 text-center text-xs text-sky-700">
                            <tr>
                                <th className="px-4 py-2 border border-gray-100">Action</th>
                                
                                <th className="px-4 py-2 border border-gray-100 text-left">Designation Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr key={item.designationId} className="border border-gray-100 hover:bg-sky-50/40 transition">
                                        <td className="px-4 py-3 border border-gray-200 text-center">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 flex justify-center mx-auto"
                                                onClick={() => handleUpdate(item)}
                                            >
                                                <FaPencilAlt />
                                            </button>
                                        </td>
                                        
                                        <td className="px-4 py-3 border border-gray-200">{item.designationName}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-8 text-gray-500">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

           <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
             ⚠️    Note: A master could not be deleted if used anywhere
            </div>
        </div>
    );
};

export default withAuth(DesignationMaster, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
