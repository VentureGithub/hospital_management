'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt ,FaSync ,FaSave,FaStethoscope } from "react-icons/fa";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from 'sonner';

export function Discount() {
  return (
    <LayoutForm>
      <Discountform />
    </LayoutForm>
  );
}

const Discountform = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState([]);
  const [dataa, setDataa] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialValues, setInitialValues] = useState({
    discountId: 0,
    discountPercentage: "",
    userId: "",
    roles: "",
  });

  const validationSchema = Yup.object({
    userId: Yup.string()
      .required("Please select a user")
      .matches(/^[1-9]\d*$/, "Invalid user selection"),
    discountPercentage: Yup.number()
      .required("Discount percentage is required")
      .min(1, "Discount must be at least 1%")
      .max(100, "Discount cannot exceed 100%"),
  });

  const fetchApi = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`descount/getDescount`);
      if (response?.data?.data) {
        setData(response.data.data);
      } else {
        setData([]);
      }
    } catch (error) {
      setError("Failed to fetch discount data");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCatagory = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`user/getAllUser`);
      if (response?.data?.data) {
        setDataa(response.data.data);
      } else {
        setDataa([]);
      }
    } catch (error) {
      setError("Failed to fetch user data");
      setDataa([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
    fetchCatagory();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      const response = isEdit
        ? await apiClient.put(`descount/updateDescount`, values)
        : await apiClient.post(`descount/create`, values);

      if (response.status === 200) {
        toast.success(`${isEdit ? "Data updated" : "Data saved"} successfully`);
        fetchApi();
        setIsEdit(false);
        resetForm();
      } else {
        toast.error(`${isEdit ? "Update" : "Save"} failed!`);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (discount) => {
    setInitialValues({
      discountId: discount.discountId,
      discountPercentage: discount.discountPercentage,
      userId: discount.userId,
      roles: discount.roles,
    });
    setIsEdit(true);
  };

  if (error) {
    return <div className="text-red-500 text-sm p-4">{error}</div>;
  }

  return (
    <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
    <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
            <FaStethoscope size={18} />
          </div>
          <Heading headingText="Discount Master" />
        </div>
        <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
          Master • Discount
        </div>
      </div>
      <div className="py-4">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ resetForm }) => (
            <Form className="lg:w-[60%] md:w-[90%] sm:w-[100%]">
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-sky-800">
                    User
                  </label>
                  <Field
                    as="select"
                    name="userId"
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
                    disabled={isLoading}
                  >
                    <option value="">Select user</option>
                    {dataa && dataa.map((user) => (
                      <option key={user.userId} value={user.userId}>
                        {user.userName} - ({user.roles})
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="userId"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-sky-800">
                    Discount (%)
                  </label>
                  <Field
                    type="text"
                    name="discountPercentage"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                    disabled={isLoading}
                  />
                  <ErrorMessage
                    name="discountPercentage"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-start space-x-4 my-4">
                <button
                  type="button"
                  className="bg-slate-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-slate-800"
                  onClick={() => {
                    resetForm();
                    setIsEdit(false);
                  }}
                  disabled={isLoading}
                >
                 <FaSync/> Refresh
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-800"
                  disabled={isLoading}
                >
                 <FaSave/> {isLoading ? "Processing..." : isEdit ? "Update" : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="bg-white p-3 my-4 rounded-lg shadow-md border border-sky-100">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur text-center">
              <tr>
                <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">
                  Action
                </th>
                <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">
                  Discount
                </th>
                <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : data && data.length ? (
                data.map((transaction, index) => (
                  <tr key={index} className="border border-gray-100 hover:bg-sky-50/40 transition text-center">
                    <td className="px-4 py-3 border border-gray-100 flex space-x-2 justify-center">
                      <button
                        type="button"
                        className="text-blue-500 hover:text-blue-700 flex items-center"
                        onClick={() => handleUpdate(transaction)}
                        disabled={isLoading}
                      >
                        <FaPencilAlt className="mr-1" />
                      </button>
                    </td>
                    <td className="px-4 py-3 border border-gray-100">{`${transaction.discountPercentage}%`}</td>
                    <td className="px-4 py-3 border border-gray-100">{transaction.roles}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Discount, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
