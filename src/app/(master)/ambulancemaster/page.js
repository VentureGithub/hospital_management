'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'sonner';

export function AmbulanceMaster() {
  return (
    <LayoutForm>
      <AmbulanceForm />
    </LayoutForm>
  );
}

const AmbulanceForm = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [emp, setEmp] = useState([]);
  const [data, setData] = useState([]);
  const [initialValues, setInitialValues] = useState({
    ambulanceId: 0,
    ambulanceNumber: "",
    empCode: "",
    createDate: "",
  });

  const fetchApi = async () => {
    try {
      const response = await apiClient.get(`ambulanceMaster/getAllData`);
      setData(response.data.data);
    } catch (error) {
      toast.error("Error fetching ambulance data");
    }
  };

  const fetchEmp = async () => {
    try {
      const response = await apiClient.get(`emp/getAllEmployee/Driver`);
      setEmp(response.data.data);
    } catch (error) {
      toast.error("Error fetching driver data");
    }
  };

  useEffect(() => {
    fetchApi();
    fetchEmp();
  }, []);

  const validationSchema = Yup.object({
    ambulanceNumber: Yup.string()
      .required("Ambulance number is required")
      .matches(/^[A-Za-z0-9\s-]+$/, "Invalid ambulance number format"),
    empCode: Yup.string().required("Driver is required"),
    createDate: Yup.date()
      .required("Date is required")
      .max(new Date(), "Date cannot be in the future"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const apiUrl = isEdit ? `ambulanceMaster/updateData` : `ambulanceMaster/create`;
      const response = await apiClient[isEdit ? "put" : "post"](apiUrl, values);

      if (response.status === 200) {
        toast.success(isEdit ? "Ambulance updated successfully" : "Ambulance saved successfully");
        setIsEdit(false);
        resetForm();
        fetchApi();
      } else {
        toast.error("Operation failed! Please try again");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleUpdate = (ambulance) => {
    setInitialValues({
      ambulanceId: ambulance.ambulanceId,
      ambulanceNumber: ambulance.ambulanceNumber,
      empCode: ambulance.empCode,
      createDate: ambulance.createDate,
    });
    setIsEdit(true);
  };

  return (
    <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
      <Heading headingText="Ambulance Master" />
      <div className="py-4">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ resetForm }) => (
            <Form className="lg:w-[50%] md:w-[100%] sm:w-[100%]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                  <label className="block font-semibold text-sm mb-2 text-sky-800">Driver</label>
                  <Field
                    as="select"
                    name="empCode"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm border-gray-200"
                  >
                    <option value="">Select Driver</option>
                    {emp?.map(driver => (
                      <option key={driver.empCode} value={driver.empCode}>{driver.empName}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="empCode" component="p" className="text-red-600 text-sm mt-2 bg-red-50 border border-red-100 rounded-md px-3 py-1" />
                </div>
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                  <label className="block font-semibold text-sm mb-2 text-sky-800">Ambulance No.</label>
                  <Field
                    type="text"
                    name="ambulanceNumber"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm border-gray-200"
                  />
                  <ErrorMessage name="ambulanceNumber" component="p" className="text-red-600 text-sm mt-2 bg-red-50 border border-red-100 rounded-md px-3 py-1" />
                </div>
                <div className="md:col-span-2 bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                  <label className="block font-semibold text-sm mb-2 text-sky-800">Date</label>
                  <Field
                    type="date"
                    name="createDate"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm border-gray-200"
                  />
                  <ErrorMessage name="createDate" component="p" className="text-red-600 text-sm mt-2 bg-red-50 border border-red-100 rounded-md px-3 py-1" />
                </div>
              </div>
              <div className="flex justify-start w-full space-x-4 p-2 mt-4">
                <button
                  type="button"
                  className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-800 text-sm"
                  onClick={() => {
                    resetForm();
                    setIsEdit(false);
                  }}
                >
                  Refresh
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 text-sm"
                >
                  {isEdit ? "Update" : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="bg-white p-3 mt-4 rounded-lg shadow-md border border-sky-100">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-100 border-collapse rounded-md shadow-sm overflow-hidden">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur text-center">
              <tr>
                <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Action</th>
                <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Ambulance</th>
                <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Driver</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((transaction, index) => (
                  <tr key={index} className="border border-gray-100 hover:bg-sky-50/40 transition text-center">
                    <td className="px-4 py-3 border border-gray-100 flex justify-center space-x-2">
                      <button className="text-sky-600 hover:text-sky-800 flex items-center" onClick={() => handleUpdate(transaction)}>
                        <FaPencilAlt />
                      </button>
                    </td>
                    <td className="px-4 py-3 border border-gray-100">{transaction.ambulanceNumber}</td>
                    <td className="px-4 py-3 border border-gray-100">{transaction.empName}</td>
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
      <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
        ⚠️ Note: A master cannot be deleted if it is used elsewhere.
      </div>
    </div>
  );
};

export default withAuth(AmbulanceMaster, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
