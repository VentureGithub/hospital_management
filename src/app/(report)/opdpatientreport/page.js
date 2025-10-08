'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export function OpdPatientReport() {
    return (
        <LayoutForm>
            <OpdPatientReportform />
        </LayoutForm>
    );
}

const OpdPatientReportform = () => {
    const [dr, setDr] = useState([]);
    const [dept, setDept] = useState([]);

    const fetchDr = async () => {
        try {
            const response = await apiClient.get(`doc/getAllDoc`);
            setDr(response.data.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    const fetchDep = async () => {
        try {
            const response = await apiClient.get(`dep/getAllDepartment`);
            setDept(response.data.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    useEffect(() => {
        fetchDr();
        fetchDep();
    }, []);

    // Formik setup with validation
    const formik = useFormik({
        initialValues: {
            selectedDr: '',
            selectedDept: '',
        },
        validationSchema: Yup.object({
            selectedDr: Yup.string().required('Doctor selection is required'),
            selectedDept: Yup.string().required('Department selection is required'),
        }),
        onSubmit: async (values) => {
            const { selectedDr, selectedDept } = values;
            try {
                const apiUrl = `dischargePatient/bill/OpddepartmentDoctorReport?depId=${selectedDept}&drId=${selectedDr}`;
                const response = await apiClient.get(apiUrl, { responseType: 'blob' });
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
            } catch (error) {
                console.error("Error generating PDF:", error);
                alert("Failed to generate the PDF. Please try again.");
            }
        },
    });

    return (
        <>
        <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
            <Heading headingText="OPD Patient Report" />
            <div className='py-4'>
                <form className='lg:w-[50%] md:w-[80%] sm:w-[100%]' onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Doctor</label>
                            <select 
                                name="selectedDr"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.selectedDr}
                                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.selectedDr && formik.errors.selectedDr ? 'border-red-600' : ''}`}
                            >
                                <option value="">Select Doctor</option>
                                {dr.map((doctor) => (
                                    <option key={doctor.drId} value={doctor.drId}>{doctor.drName}</option>
                                ))}
                            </select>
                            {formik.touched.selectedDr && formik.errors.selectedDr && (
                                <div className="text-red-600 text-sm">{formik.errors.selectedDr}</div>
                            )}
                        </div>

                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department</label>
                            <select 
                                name="selectedDept"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.selectedDept}
                                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.selectedDept && formik.errors.selectedDept ? 'border-red-600' : ''}`}
                            >
                                <option value="">Select Department</option>
                                {dept.map((department) => (
                                    <option key={department.deptId} value={department.deptId}>{department.depName}</option>
                                ))}
                            </select>
                            {formik.touched.selectedDept && formik.errors.selectedDept && (
                                <div className="text-red-600 text-sm">{formik.errors.selectedDept}</div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-start w-full space-x-4 my-4 p-2">
                        <button type="submit" className="bg-green-600 text-white  text-sm px-6 py-2 rounded-lg hover:bg-green-900">
                            Print
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default withAuth(OpdPatientReport, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
