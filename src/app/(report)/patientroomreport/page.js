'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useEffect } from "react";
import { useState } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useFormik } from "formik";
import * as Yup from "yup";

export function PatientRoom() {
  return (
    <LayoutForm>
      <PatientRoomForm />
    </LayoutForm>
  );
}

const PatientRoomForm = () => {
  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
    },
    validationSchema: Yup.object({
      fromDate: Yup.string().required('Please select a "From Date"'),
      toDate: Yup.string().required('Please select a "To Date"'),
    }),
    onSubmit: async (values) => {
      const { fromDate, toDate } = values;

      try {
        const response = await apiClient.get('/patientRoom/generateRoomStatusReport', {
          params: { fromDate, toDate },
          responseType: 'blob',
        });

        if (response.status === 200) {
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
          window.URL.revokeObjectURL(url);
        } else {
          console.error("Failed to fetch report");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    },
  });

  return (
    <div className="p-6 bg-gradient-to-br from-sky-50 to-white rounded-xl shadow-xl border border-sky-100 ml-6 mt-6 max-w-lg">
      <Heading headingText="Patient Room Report" />
      <form onSubmit={formik.handleSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="fromDate" className="block mb-1 text-sm font-semibold text-sky-700">
              Date From
            </label>
            <input
              id="fromDate"
              name="fromDate"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fromDate}
              className={`w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${formik.touched.fromDate && formik.errors.fromDate ? 'border-red-600 ring-red-300' : 'border-gray-300 ring-sky-300'}`}
            />
            {formik.touched.fromDate && formik.errors.fromDate ? (
              <p className="mt-1 text-xs text-red-600">{formik.errors.fromDate}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="toDate" className="block mb-1 text-sm font-semibold text-sky-700">
              Date To
            </label>
            <input
              id="toDate"
              name="toDate"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.toDate}
              className={`w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${formik.touched.toDate && formik.errors.toDate ? 'border-red-600 ring-red-300' : 'border-gray-300 ring-sky-300'}`}
            />
            {formik.touched.toDate && formik.errors.toDate ? (
              <p className="mt-1 text-xs text-red-600">{formik.errors.toDate}</p>
            ) : null}
          </div>
        </div>
        <div className="flex justify-start space-x-4 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Print
          </button>
          {/* Add Export to Excel button if needed */}
        </div>
      </form>
    </div>
  );
};

export default withAuth(PatientRoom, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
