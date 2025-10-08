'use client'
import LayoutForm from "../../layouts/layoutForm";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import withAuth from '@/app/(components)/WithAuth';
import * as Yup from "yup";
import apiClient from "@/app/config";
import Heading from "../../(components)/heding";
import { FaPencilAlt ,FaStethoscope } from "react-icons/fa";
import { toast } from 'sonner';

export function TaxMaster() {
  return (
    <LayoutForm>
      <TaxMasterform />
    </LayoutForm>
  );
}

const TaxMasterform = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState([]);
  const [initialValues, setInitialValues] = useState({
    taxId: 0,
    tax: "",
    status: "",
  });

  const fetchApi = async () => {
    try {
      const response = await apiClient.get(`tax/getAllTax`);
      setData(response.data.data);
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (isEdit) {
        await apiClient.put(`tax/updatTax`, values);
        toast.success("Data updated successfully");
        setIsEdit(false);
      } else {
        await apiClient.post(`tax/save`, values);
        toast.success("Data saved successfully");
      }
      fetchApi();
      resetForm();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleEdit = (tax) => {
    setInitialValues({
      taxId: tax.taxId,
      tax: tax.tax,
      status: tax.status,
    });
    setIsEdit(true);
  };

  const validationSchema = Yup.object({
    tax: Yup.number()
      .required("Tax slab is required")
      .min(1, "Tax slab must be at least 1%")
      .max(100, "Tax slab must be at most 100%"),
    status: Yup.string().required("Status is required"),
  });

  return (
    <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
            <FaStethoscope size={18} />
          </div>
          <Heading headingText="Tax Master" />
        </div>
        <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
          Master • Taxes
        </div>
      </div>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="lg:w-[50%] md:w-[90%] sm:w-[100%]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
            <div>
              <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                <label className="block font-semibold text-sm mb-2 text-sky-800">Tax Slab</label>
                <Field
                  type="number"
                  name="tax"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 text-sm border-gray-200"
                />
                <ErrorMessage
                  name="tax"
                  component="div"
                  className="mt-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md"
                />
              </div>
            </div>
            <div>
              <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                <label className="block font-semibold text-sm mb-2 text-sky-800">Status</label>
                <Field
                  as="select"
                  name="status"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 text-sm border-gray-200"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="mt-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-start w-full space-x-4 p-2">
            <button
              className="bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-800 active:scale-[.99] transition text-sm"
              type="button"
              onClick={fetchApi}
            >
              Refresh
            </button>
            <button
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 active:scale-[.99] transition text-sm"
              type="submit"
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </Form>
      </Formik>

      <div className="bg-white p-3 rounded-lg shadow-md mt-4 border border-sky-100">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur text-center">
              <tr>
                <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">
                  Action
                </th>
                <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">
                  Tax Slab
                </th>
                <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((transaction, index) => (
                  <tr
                    key={index}
                    className="border border-gray-100 hover:bg-sky-50/40 transition text-center"
                  >
                    <td className="px-4 py-3 border border-gray-100 flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        className="text-sky-600 hover:text-sky-800 flex items-center"
                        onClick={() => handleEdit(transaction)}
                      >
                        <FaPencilAlt className="mr-1" />
                      </button>
                    </td>
                    <td className="px-4 py-3 border border-gray-100">{`${transaction.tax}%`}</td>
                    <td className="px-4 py-3 border border-gray-100">{transaction.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
        ⚠️ Note: A master cannot be deleted if it is used elsewhere.
      </div>
    </div>
  );
};

export default withAuth(TaxMaster, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
