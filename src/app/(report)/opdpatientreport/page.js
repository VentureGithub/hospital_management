"use client";
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from "@/app/(components)/WithAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

export function OpdPatientReport() {
  return (
    <LayoutForm>
      <OpdPatientReportForm />
    </LayoutForm>
  );
}

const OpdPatientReportForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await apiClient.get(`doc/getAllDoc`);
        if (response.data && Array.isArray(response?.data?.data)) {
          setDoctors(response?.data?.data);
        } else {
          setDoctors([]);
          toast.error("Failed to load doctors");
        }
      } catch {
        setDoctors([]);
        toast.error("Failed to load doctors");
      }
    };
    const fetchDepartments = async () => {
      try {
        const response = await apiClient.get(`dep/getAllDepartment`);
        if (response.data && Array.isArray(response.data.data)) {
          setDepartments(response.data.data);
        } else {
          setDepartments([]);
          toast.error("Failed to load departments");
        }
      } catch {
        setDepartments([]);
        toast.error("Failed to load departments");
      }
    };

    fetchDoctors();
    fetchDepartments();
  }, []);

  const formik = useFormik({
    initialValues: {
      selectedDr: "",
      selectedDept: "",
    },
    validationSchema: Yup.object({
      selectedDr: Yup.string().required("Doctor selection is required"),
      selectedDept: Yup.string().required("Department selection is required"),
    }),
    onSubmit: async (values) => {
      try {
        const { selectedDr, selectedDept } = values;
        const apiUrl = `dischargePatient/bill/OpddepartmentDoctorReport?depId=${selectedDept}&drId=${selectedDr}`;
        const response = await apiClient.get(apiUrl, { responseType: "blob" });

        if (response.status === 200) {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          window.open(url, "_blank");
        } else {
          toast.error("Failed to generate PDF report");
        }
      } catch {
        toast.error("An error occurred generating the report");
      }
    },
  });

  const handleReset = () => formik.resetForm();

  return (
    <div className="p-6 bg-gradient-to-br from-sky-50 to-white rounded-xl shadow-xl border border-sky-100 ml-6 mt-6 max-w-3xl">
      <Heading headingText="OPD Patient Report" />
      <form onSubmit={formik.handleSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-sky-700">Doctor</label>
            <select
              name="selectedDr"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
                formik.touched.selectedDr && formik.errors.selectedDr ? "border-red-600" : "border-gray-300"
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.selectedDr}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.drId} value={doctor.drId}>
                  {doctor.drName}
                </option>
              ))}
            </select>
            {formik.touched.selectedDr && formik.errors.selectedDr && (
              <p className="text-red-600 text-xs mt-1">{formik.errors.selectedDr}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sky-700">Department</label>
            <select
              name="selectedDept"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
                formik.touched.selectedDept && formik.errors.selectedDept ? "border-red-600" : "border-gray-300"
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.selectedDept}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.deptId} value={dept.deptId}>
                  {dept.depName}
                </option>
              ))}
            </select>
            {formik.touched.selectedDept && formik.errors.selectedDept && (
              <p className="text-red-600 text-xs mt-1">{formik.errors.selectedDept}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
          >
            Print Report
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default withAuth(OpdPatientReport, ["SUPERADMIN", "ADMIN", "DOCTOR"]);
