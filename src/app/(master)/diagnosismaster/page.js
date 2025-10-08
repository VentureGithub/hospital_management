'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt ,FaStethoscope ,FaSync ,FaSave } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'sonner';

export function Diagnosis() {
  return (
    <LayoutForm>
      <Diagnosisform />
    </LayoutForm>
  );
}

const validationSchema = Yup.object({
  diagnosis: Yup.string()
    .required("Diagnosis Name is required")
    .matches(/^[a-zA-Z\s]+$/, 'Diagnosis should only contain letters and spaces'),
  managementOperation: Yup.string()
    .required("Management/Operation is required")
    .matches(/^[a-zA-Z\s]+$/, 'Management Operation should only contain letters and spaces'),
  advice: Yup.string()
    .required("Advice is required")
    .matches(/^[a-zA-Z0-9\s]+$/, "Advice can only contain letters, numbers, and spaces"),
});

const Diagnosisform = () => {
  const [data, setData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [inputs, setInputs] = useState({
    diagnosisId: 0,
    diagnosis: "",
    managementOperation: "",
    advice: ""
  });

  // Fetch all diagnoses
  const fetchApi = async () => {
    try {
      const response = await apiClient.get(`DiagnosisMaster/getAlldAtaInList`);
      setData(response.data.data);
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const handleMedicineTime = async (values, { resetForm }) => {
    try {
      if (isEdit) {
        const response = await apiClient.put(`DiagnosisMaster/updateData`, values);
        if (response.status === 200) {
          toast.success("Data updated successfully");
          setIsEdit(false);
        } else {
          toast.error("Update failed! Please try again");
        }
      } else {
        const response = await apiClient.post(`DiagnosisMaster/saveAllData`, values);
        if (response.status === 200) {
          toast.success("Data saved successfully");
        } else {
          toast.error("Save failed! Please try again");
        }
      }
      fetchApi();
      resetForm();
    } catch (error) {
      toast.error("Error handling diagnosis");
    }
  };

  const handleUpdate = (diagno) => {
    setInputs({
      diagnosisId: diagno.diagnosisId,
      diagnosis: diagno.diagnosis,
      managementOperation: diagno.managementOperation,
      advice: diagno.advice
    });
    setIsEdit(true);
  };

  return (
    <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                  <FaStethoscope size={18} />
                </div>
                <Heading headingText="Diagnosis Master" />
              </div>
              <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
                Master • Diagnosis
              </div>
            </div>
      <div className="py-4">
        <Formik
          initialValues={inputs}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleMedicineTime}
        >
          {() => (
            <Form className="lg:w-[50%] md:w-[90%] sm:w-[100%]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 m-2">
                <div>
                  <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block text-sm font-semibold mb-2 text-sky-800">Diagnosis Name</label>
                    <Field
                      type="text"
                      name="diagnosis"
                      className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
                    />
                    <ErrorMessage name="diagnosis" component="div" className="mt-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md" />
                  </div>
                </div>
                <div>
                  <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block text-sm font-semibold mb-2 text-sky-800">Management/Op.</label>
                    <Field
                      type="text"
                      name="managementOperation"
                      className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
                    />
                    <ErrorMessage name="managementOperation" component="div" className="mt-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block text-sm font-semibold mb-2 text-sky-800">Advice</label>
                    <Field
                      type="text"
                      name="advice"
                      className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
                    />
                    <ErrorMessage name="advice" component="div" className="mt-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md" />
                  </div>
                </div>
              </div>
              <div className="flex justify-start w-full space-x-4 p-2 my-4">
                <button
                  className="inline-flex items-center gap-2 bg-slate-600 text-sm text-white px-6 py-2 rounded-lg hover:bg-slate-800 active:scale-[.99] transition"
                  type="button"
                  onClick={fetchApi}
                >
                 <FaSync/> Refresh
                </button>
                <button
                  className="inline-flex items-center gap-2 bg-emerald-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-emerald-800 active:scale-[.99] transition"
                  type="submit"
                >
                 <FaSave/> {isEdit ? "Update" : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="bg-white p-3 my-4 rounded-lg shadow-md border border-sky-100">
        <div className="overflow-x-auto">
          <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur text-center">
                <tr>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Action</th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Diagnosis Name</th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Management/Operation</th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Advice</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((transaction, index) => (
                    <tr key={index} className="border border-gray-100 hover:bg-sky-50/40 transition text-center">
                      <td className="px-4 py-3 border border-gray-100 flex items-center justify-center space-x-2">
                        <button
                          className="text-sky-600 hover:text-sky-800 flex items-center"
                          onClick={() => handleUpdate(transaction)}
                        >
                          <FaPencilAlt />
                        </button>
                      </td>
                      <td className="px-4 py-3 border border-gray-100 uppercase">{transaction.diagnosis}</td>
                      <td className="px-4 py-3 border border-gray-100 uppercase">{transaction.managementOperation}</td>
                      <td className="px-4 py-3 border border-gray-100 uppercase">{transaction.advice}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
        ⚠️ Note: A master cannot be deleted if it is used elsewhere.
      </div>
    </div>
  );
};

export default withAuth(Diagnosis, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
