'use client';
import { useState, useEffect } from "react";
import { FaPencilAlt, FaSave, FaSync, FaExclamationCircle } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from "@/app/(components)/WithAuth";
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

export function ServiceTypeMaster() {
  return (
    <LayoutForm>
      <ServiceTypeMasterForm />
    </LayoutForm>
  );
}

const ServiceTypeMasterForm = () => {
  const [data, setData] = useState([]);
  const [inputs, setInputs] = useState({
    id: 0,
    serviceTypeName: "",
    description: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  const fetchApi = async () => {
    try {
      const response = await apiClient.get(`servicetypemaster/getAll`);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Unable to fetch service type data.");
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      let response;
      if (isEdit) {
        response = await apiClient.put(`servicetypemaster/updateServiceTypeData`, values);
      } else {
        response = await apiClient.post(`servicetypemaster/saveServiceTypeMaster`, values);
      }

      if (response.status === 200) {
        toast.success(`Data ${isEdit ? "updated" : "saved"} successfully`);
        setIsEdit(false);
        fetchApi();
        resetForm();
      } else {
        toast.error("Operation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error saving/updating data:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleEdit = (item) => {
    setInputs({
      id: item.id,
      serviceTypeName: item.serviceTypeName,
      description: item.description,
    });
    setIsEdit(true);
  };

  const validationSchema = Yup.object({
    serviceTypeName: Yup.string().required("Service Type Name is required."),
    description: Yup.string().required("Description is required."),
  });

  return (
    <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
            <FaSave size={18} />
          </div>
          <Heading headingText="Service Type Master" />
        </div>
        <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
          Master • Service Type
        </div>
      </div>

      {/* Form */}
      <div className="py-4">
        <Formik
          initialValues={inputs}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ handleReset }) => (
            <Form className="lg:w-[50%] md:w-[100%] sm:w-[100%]">
              <div className="grid grid-cols-1 gap-3 m-2">
                {/* Service Type Name */}
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                  <label className="block font-semibold text-sm mb-2 text-sky-800">
                    Service Type Name
                  </label>
                  <Field
                    type="text"
                    name="serviceTypeName"
                    placeholder="Enter Service Type Name"
                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
                  />
                  <ErrorMessage
                    name="serviceTypeName"
                    component="div"
                    className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md"
                  >
                    {(msg) => (
                      <>
                        <FaExclamationCircle /> {msg}
                      </>
                    )}
                  </ErrorMessage>
                </div>

                {/* Description */}
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                  <label className="block font-semibold text-sm mb-2 text-sky-800">
                    Description
                  </label>
                  <Field
                    type="text"
                    name="description"
                    placeholder="Short description"
                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md"
                  >
                    {(msg) => (
                      <>
                        <FaExclamationCircle /> {msg}
                      </>
                    )}
                  </ErrorMessage>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-start w-full gap-3 px-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                    setIsEdit(false);
                  }}
                  className="inline-flex items-center gap-2 bg-slate-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-slate-800 active:scale-[.99] transition"
                >
                  <FaSync /> Refresh
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-emerald-800 active:scale-[.99] transition"
                >
                  <FaSave /> {isEdit ? "Update" : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Table */}
      <div className="bg-white p-3 my-4 text-sm rounded-lg shadow-md border border-sky-100">
        <div className="overflow-x-auto">
          <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
              <thead className="sticky top-0 z-10">
                <tr className="text-center bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur">
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">
                    Action
                  </th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide text-left">
                    Service Type Name
                  </th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide text-left">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index} className="border border-gray-100 hover:bg-sky-50/40 transition">
                      <td className="px-4 py-3 border border-gray-100 text-center">
                        <button
                          className="text-sky-600 hover:text-sky-800 flex items-center justify-center mx-auto"
                          onClick={() => handleEdit(item)}
                        >
                          <FaPencilAlt />
                        </button>
                      </td>
                      <td className="px-4 py-3 border border-gray-100 text-sm text-gray-800 uppercase">
                        {item.serviceTypeName}
                      </td>
                      <td className="px-4 py-3 border border-gray-100 text-sm text-gray-800 uppercase">
                        {item.description}
                      </td>
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
      </div>

      {/* Note */}
      <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
        ⚠️ Note: A master cannot be deleted if it is used elsewhere.
      </div>
    </div>
  );
};

export default withAuth(ServiceTypeMaster, ["SUPERADMIN", "ADMIN", "DOCTOR"]);
