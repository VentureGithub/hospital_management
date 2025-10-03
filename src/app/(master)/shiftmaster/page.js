'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import Icon from "../../(components)/Icon";
import { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';

export function ShiftMaster() {
    return (
        <LayoutForm>
            <ShiftMasterform />
            <Icon message={"This page is for managing shift details for employee. You can view, add, or update information about various shifts."} />
        </LayoutForm>
    );
}

const ShiftMasterform = () => {
    const [data, setData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchApi = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get("shiftMaster/getAllDetailsghiftMaster");
            setData(response.data.data);
            setError(null);
        } catch (error) {
            setError("Failed to fetch shift data");
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const validationSchema = Yup.object({
        shiftName: Yup.string()
            .required('Shift Name is required')
            .matches(/^[a-zA-Z\s]+$/, 'Shift Name should only contain letters and spaces'),
        shifTimeStart: Yup.string()
            .required('Start Time is required'),
        shiftTimeEnd: Yup.string()
            .required('End Time is required')
    });

    const formik = useFormik({
        initialValues: {
            shiftId: 0,
            shiftName: "",
            shifTimeStart: "",
            shiftTimeEnd: "",
            shiftCreatedDate: new Date().toISOString().split('T')[0],
            shiftTimeTable: "default"
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const endpoint = isEdit
                    ? `shiftMaster/updateShiftMaster?shiftId=${values.shiftId}`
                    : "shiftMaster/saveShiftMaster";

                const method = isEdit ? 'put' : 'post';
                const response = await apiClient[method](endpoint, values);

                if (response.status === 200 || response.status === 202) {
                    toast.success(`Shift ${isEdit ? 'updated' : 'saved'} successfully`);
                    await fetchApi();
                    formik.resetForm();
                    setIsEdit(false);
                }
            } catch (error) {
                setError(`Failed to ${isEdit ? 'update' : 'save'} shift`);
                toast.error("Submission error:", error);
            } finally {
                setLoading(false);
            }
        }
    });

    const handleUpdate = (shift) => {
        formik.setValues({
            ...shift,
            shiftCreatedDate: new Date().toISOString().split('T')[0],
            shiftTimeTable: shift.shiftTimeTable || "default"
        });
        setIsEdit(true);
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="Shift Master" />
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className='py-4'>
                <form className='lg:w-[60%] md:w-[100%] sm:w-[100%]' onSubmit={formik.handleSubmit}>
                    <div className="grid gap-2 m-2">
                        {/* Shift Name Field */}
                        <div >
                                <label className="block font-semibold text-sm">Shift Name</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.shiftName && formik.errors.shiftName ? 'border-red-500' : ''
                                        }`}
                                    {...formik.getFieldProps('shiftName')}
                                />
                                {formik.touched.shiftName && formik.errors.shiftName && (
                                    <div className="text-red-500 text-sm">{formik.errors.shiftName}</div>
                                )}
                        </div>

                        {/* Start Time Field */}
                        <div>
                                <label className="block text-sm font-semibold">From</label>
                                <input
                                    type="time"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.shifTimeStart && formik.errors.shifTimeStart ? 'border-red-500' : ''
                                        }`}
                                    {...formik.getFieldProps('shifTimeStart')}
                                />
                                {formik.touched.shifTimeStart && formik.errors.shifTimeStart && (
                                    <div className="text-red-500 text-sm">{formik.errors.shifTimeStart}</div>
                                )}
                        </div>

                        {/* End Time Field */}
                        <div>
                                <label className="block font-semibold text-sm">To</label>
                                <input
                                    type="time"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.shiftTimeEnd && formik.errors.shiftTimeEnd ? 'border-red-500' : ''
                                        }`}
                                    {...formik.getFieldProps('shiftTimeEnd')}
                                />
                                {formik.touched.shiftTimeEnd && formik.errors.shiftTimeEnd && (
                                    <div className="text-red-500 text-sm">{formik.errors.shiftTimeEnd}</div>
                                )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-start w-full space-x-4 p-2 my-4">
                        <button
                            type="button"
                            className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900"
                            onClick={() => {
                                formik.resetForm();
                                setIsEdit(false);
                            }}
                            disabled={loading}
                        >
                            Refresh
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : isEdit ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Data Table */}
            <div className="bg-white p-2 my-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center bg-[#CFE0E733]">
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Shift Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">From</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">Loading...</td>
                                    </tr>
                                ) : data?.length > 0 ? (
                                    data.map((shift, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700"
                                                    onClick={() => handleUpdate(shift)}
                                                >
                                                    <FaPencilAlt />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{shift.shiftName}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{shift.shifTimeStart}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{shift.shiftTimeEnd}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4">No shifts available</td>
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

export default withAuth(ShiftMaster, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);