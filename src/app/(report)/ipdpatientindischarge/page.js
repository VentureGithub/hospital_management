"use client"
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';


export function PatientDischarge() {
    return (
        <LayoutForm>
            <DischargeForm />
        </LayoutForm>
    );
}

const DischargeForm = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchAllDoctors = async () => {
            const response = await apiClient.get(`doc/getAllDoc`);
            if (response.status === 200) {
                setDoctors(response.data.data);
            }
        };
        fetchAllDoctors();
    }, []);

    // Formik setup
    const formik = useFormik({
        initialValues: {
            status: '',
            DrId: null,
            startDate: '',
            endDate: '',
        },
        validationSchema: Yup.object({
            status: Yup.string().required('Patient status is required'),
            DrId: Yup.number().required('Consultant Doctor is required'),
            startDate: Yup.date().required('Start Date is required').nullable(),
            endDate: Yup.date()
                .required('End Date is required')
                .nullable()
                .when('startDate', (startDate, schema) => {
                    return startDate ? schema.min(startDate, 'End Date must be later than Start Date') : schema;
                }),
        }),
        onSubmit: async (values) => {
            // Mark all fields as touched before submitting
            formik.setTouched({
                status: true,
                DrId: true,
                startDate: true,
                endDate: true,
            });

            // Validate form before proceeding
            const isValid = await formik.validateForm();
            if (Object.keys(isValid).length === 0) {
                try {
                    const response = await apiClient.get(`ipdregistration/api/ipd/download-report`, {
                        params: {
                            status: values.status,
                            DrId: values.DrId,
                            startDate: values.startDate,
                            endDate: values.endDate,
                        },
                        responseType: 'blob',
                    });

                    if (response.status === 200) {
                        const blob = new Blob([response.data], { type: response.headers['content-type'] });
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = `PatientInOutReport${values.DrId}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } else {
                        alert("Failed to download Test Booking. Please try again.");
                    }
                } catch (error) {
                    console.error('Error downloading the Test Booking:', error);
                    alert("An error occurred while downloading the Test Booking. Please try again.");
                }
            }
        },
    });

    const handleRefresh = () => {
        formik.resetForm();
    };

    return (
        <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
            <Heading headingText="IPD Patient In/Discharge" />
            <div className='py-4'>
                <form className='lg:w-[60%] md:w-[100%] sm:w-[100%]' onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 my-2">
                        <div>
                            <label className="block font-semibold text-sm">Patient In/Discharge:</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="status"
                                onChange={formik.handleChange}
                                value={formik.values.status}
                            >
                                <option value="">Select an Option</option>
                                <option value="true">Patient In</option>
                                <option value="false">Patient Discharge</option>
                            </select>
                            {formik.touched.status && formik.errors.status && (
                                <div className="text-red-600 text-sm">{formik.errors.status}</div>
                            )}
                        </div>
                        <div>
                            <label className="block font-semibold text-sm">Consultant Dr.:</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="DrId"
                                onChange={formik.handleChange}
                                value={formik.values.DrId || ""}
                            >
                                <option value="">Select an Option</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor.drId} value={doctor.drId}>
                                        {doctor.drName}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.DrId && formik.errors.DrId && (
                                <div className="text-red-600 text-sm">{formik.errors.DrId}</div>
                            )}
                        </div>
                        <div>
                            <label className="block font-semibold text-sm">Date From:</label>
                            <input
                                type="date"
                                className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none"
                                name="startDate"
                                onChange={formik.handleChange}
                                value={formik.values.startDate}
                            />
                            {formik.touched.startDate && formik.errors.startDate && (
                                <div className="text-red-600 text-sm">{formik.errors.startDate}</div>
                            )}
                        </div>
                        <div>
                            <label className="block font-semibold text-sm">Date To:</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="endDate"
                                onChange={formik.handleChange}
                                value={formik.values.endDate}
                            />
                            {formik.touched.endDate && formik.errors.endDate && (
                                <div className="text-red-600 text-sm">{formik.errors.endDate}</div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2 mt-4">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-900"
                        >
                            Print
                        </button>
                        <button className="bg-red-600 text-white px-6 py-2 text-sm rounded-lg hover:bg-red-900" type="button">
                            Export To Excel
                        </button>
                        <button className="bg-gray-600 text-white px-6 py-2 text-sm rounded-lg hover:bg-gray-900" type="button" onClick={handleRefresh}>
                            Refresh
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default withAuth(PatientDischarge, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
