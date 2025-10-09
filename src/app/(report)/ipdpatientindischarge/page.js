'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import apiClient from "../../config";
import withAuth from '@/app/(components)/WithAuth';
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

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
    const fetchDoctors = async () => {
      try {
        const { data } = await apiClient.get(`doc/getAll`);
        if (data.status === 200) setDoctors(data.data);
      } catch {
        toast.error("Failed to load doctors");
      }
    };
    fetchDoctors();
  }, []);

  const formik = useFormik({
    initialValues: {
      status: "",
      DrId: "",
      startDate: "",
      endDate: "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Patient status is required"),
      DrId: Yup.number().required("Consultant Doctor is required"),
      startDate: Yup.date()
        .nullable()
        .required("Start Date is required"),
      endDate: Yup.date()
        .nullable()
        .min(Yup.ref('startDate'), "End Date must be later than Start Date")
        .required("End Date is required"),
    }),
    onSubmit: async (values) => {
      formik.setTouched({
        status: true,
        DrId: true,
        startDate: true,
        endDate: true,
      });
      const isValid = await formik.validateForm();
      if (Object.keys(isValid).length === 0) {
        try {
          const response = await apiClient.get(
            `ipd/api/registration/download-report`,
            {
              params: values,
              responseType: "blob",
            }
          );
          if (response.status === 200) {
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Patient_Report_${values.DrId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } else {
            toast.error("Failed to download report");
          }
        } catch {
          toast.error("Error occurred while downloading report");
        }
      }
    },
  });

  const handleRefresh = () => formik.resetForm();

  return (
    <div className="p-6 bg-gradient-to-br from-sky-50 to-white rounded-xl shadow-xl border border-sky-100 ml-6 mt-6">
      <Heading headingText="IPD Patient In/Discharge" />
      <form onSubmit={formik.handleSubmit} className="mt-6 space-y-6 max-w-3xl">
        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-semibold text-sky-800">Patient Status</label>
            <select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 border rounded-lg text-sm ${
                formik.touched.status && formik.errors.status ? "border-red-600" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-sky-300`}
            >
              <option value="">Select Status</option>
              <option value="true">Patient In</option>
              <option value="false">Patient Discharge</option>
            </select>
            {formik.touched.status && formik.errors.status && (
              <p className="text-red-600 text-xs mt-1">{formik.errors.status}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sky-800">Consultant Doctor</label>
            <select
              name="DrId"
              value={formik.values.DrId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 border rounded-lg text-sm ${
                formik.touched.DrId && formik.errors.DrId ? "border-red-600" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-sky-300`}
            >
              <option value="">Select Doctor</option>
              {doctors &&
                doctors.map((doc ) => (
                  <option key={doc.drId} value={doc.drId}>
                    {doc.drName}
                  </option>
                ))}
            </select>
            {formik.touched.DrId && formik.errors.DrId && (
              <p className="text-red-600 text-xs mt-1">{formik.errors.DrId}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sky-800">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 border rounded-lg text-sm ${
                formik.touched.startDate && formik.errors.startDate ? "border-red-600" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-sky-300`}
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <p className="text-red-600 text-xs mt-1">{formik.errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sky-800">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 border rounded-lg text-sm ${
                formik.touched.endDate && formik.errors.endDate ? "border-red-600" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-sky-300`}
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <p className="text-red-600 text-xs mt-1">{formik.errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            Print
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            onClick={handleRefresh}
          >
            Refresh
          </button>
          {/* Add Excel export button here if needed */}
        </div>
      </form>
    </div>
  );
};

export default withAuth(PatientDischarge, ["SUPERADMIN", "ADMIN", "DOCTOR"]);
