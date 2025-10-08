'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export function PatientRoom() {
    return (
        <LayoutForm>
            <PatientRoomform />
        </LayoutForm>
    );
}

const PatientRoomform = () => {
    // Formik setup with validation
    const formik = useFormik({
        initialValues: {
            fromDate: '',
            toDate: '',
        },
        validationSchema: Yup.object({
            // "fromDate" is required
            fromDate: Yup.string().required('Please select a "From Date"'),
            // "toDate" is required
            toDate: Yup.string().required('Please select a "To Date"'),
        }),
        onSubmit: async (values) => {
            const { fromDate, toDate } = values;

            try {
                // Make API call to generate the room status report
                const response = await apiClient.get('/patientRoom/generateRoomStatusReport', {
                    params: { fromDate, toDate },
                    responseType: 'blob'  // Specify blob to get PDF data
                });

                if (response.status === 200) {
                    // Create a Blob from the response and open the PDF in a new tab
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    const url = window.URL.createObjectURL(blob);
                    window.open(url); // Opens the PDF in a new tab
                } else {
                    console.error("Failed to fetch report");
                }
            } catch (error) {
                console.error("Error fetching report:", error);
            }
        }
    });

    return (
        <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
            <Heading headingText="Patient Room Report" />
            <div className="py-4">
                {/* Form to take date inputs */}
                <form className="lg:w-[50%] md:w-[100%] sm:w-[100%]" onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 m-2">
                        {/* From Date Field */}
                        <div>
                            <label className="block font-semibold text-sm">Date From</label>
                            <input
                                type="date"
                                name="fromDate"
                                value={formik.values.fromDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${formik.touched.fromDate && formik.errors.fromDate ? 'border-red-600' : ''}`}
                            />
                            {/* Error message for fromDate */}
                            {formik.touched.fromDate && formik.errors.fromDate && (
                                <div className="text-red-600 text-sm">{formik.errors.fromDate}</div>
                            )}
                        </div>

                        {/* To Date Field */}
                        <div>
                            <label className="block font-semibold text-sm">Date To</label>
                            <input
                                type="date"
                                name="toDate"
                                value={formik.values.toDate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${formik.touched.toDate && formik.errors.toDate ? 'border-red-600' : ''}`}
                            />
                            {/* Error message for toDate */}
                            {formik.touched.toDate && formik.errors.toDate && (
                                <div className="text-red-600 text-sm">{formik.errors.toDate}</div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-start w-full space-x-4 p-2 my-4">
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900 text-sm"
                        >
                            Print
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default withAuth(PatientRoom, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
