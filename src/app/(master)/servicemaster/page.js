'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaSave ,FaSync } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'sonner';

export function ServiceMaster() {
  return (
    <LayoutForm>
      <ServiceMasterForm />
    </LayoutForm>
  );
}

const validationSchema = Yup.object({
  id: Yup.string()
    .required("Service Type is required"),
  serviceName: Yup.string()
    .required("Service Name is required"),
  serviceRate: Yup.number()
    .typeError("Service Rate must be a number")
    .required("Service Rate is required")
    .min(0, "Service Rate cannot be negative"),
  remark: Yup.string()
    .max(100, "Remark cannot be more than 100 characters")
});

const ServiceMasterForm = () => {
  const [data, setData] = useState([]);
  const [table, setTable] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const itemsPerPage = 5;

  const fetchApi = async () => {
    try {
      const response = await apiClient.get("serviceMaster/getAllServiceMaster");
      setTable(response?.data?.data);
    } catch (error) {
      toast.error("Unable to fetch service master data.");
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await apiClient.get(`servicetypemaster/getAll`);
      setData(response?.data?.data);
    } catch (error) {
      toast.error("Unable to fetch service types.");
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  // Filtering and Pagination
  const filteredData = table?.filter((transaction) =>
    transaction.serviceName.toLowerCase().includes(filterText.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const handlePageChange = page => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handleService = async (values, { resetForm }) => {
    try {
      const response = await apiClient.post("serviceMaster/saveServiceMaster", values);
      if (response.status === 200) {
        toast.success("Data saved successfully");
        fetchApi();
        resetForm();
      } else {
        toast.error("Failed! Please try again");
      }
    } catch (error) {
      toast.error("Error saving data");
    }
  };

  return (
    <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
            {/* Add an Icon Only if desired */}
            {/* <FaClipboardList size={18} /> */}
          </div>
          <Heading headingText="Service Master" />
        </div>
        <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
          Master • Service
        </div>
      </div>
      <div className='py-4'>
        <Formik
          initialValues={{
            serId: 0,
            serviceTypeName: "",
            serviceName: "",
            serviceRate: 0,
            remark: "",
            id: ""
          }}
          validationSchema={validationSchema}
          onSubmit={handleService}
        >
          {({ handleReset }) => (
            <Form className="lg:w-[50%] md:w-[90%] sm:w-[100%]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 m-2">

                   <div className="w-full bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                  <label className="block font-semibold text-sm mb-2 text-sky-800">
                    Service Type
                  </label>
                  <Field as="select" name="id" className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200">
                    <option value="">Select service</option>
                    {data?.map((item) => (
                      <option key={item.id} value={item.id}>{item.serviceTypeName}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="id" component="div" className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md" />
                </div>
               <div className="w-full bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                  <label className="block font-semibold text-sm mb-2 text-sky-800">
                    Service Name
                  </label>
                  <Field
                    type="text"
                    name="serviceName"
                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
                  />
                  <ErrorMessage name="serviceName" component="div" className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md" />
                </div>
              <div className="w-full bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                  <label className="block font-semibold text-sm mb-2 text-sky-800">
                    Service Rate
                  </label>
                  <Field
                    type="text"
                    name="serviceRate"
                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
                  />
                  <ErrorMessage name="serviceRate" component="div" className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md" />
                </div>
                <div className="w-full bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                  <label className="block font-semibold text-sm mb-2 text-sky-800">
                    Remark
                  </label>
                  <Field
                    type="text"
                    name="remark"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200 text-sm"
                  />
                  <ErrorMessage name="remark" component="div" className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md" />
                </div>
              </div>
              <div className="flex justify-start w-full gap-3 px-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                  }}
                  className="inline-flex items-center gap-2 bg-slate-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-slate-800 active:scale-[.99] transition"
                >
                  <FaSync/> Refresh
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-emerald-800 active:scale-[.99] transition"
                >
                    <FaSave/> Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="bg-white p-3 my-4 text-sm rounded-lg shadow-md border border-sky-100">
        <div className="mb-4">
          <input
            type="text"
            className="p-2 border border-sky-100 rounded text-sm"
            placeholder="Search by Service Name"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
              <thead className="sticky top-0 z-10">
                <tr className="text-center bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur">
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Sr.No</th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Service Type</th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Service Name</th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Service Rate</th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Remark</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(currentData) && currentData?.length > 0 ? (
                  currentData.map((transaction, index) => (
                    <tr key={index} className="border border-gray-100 hover:bg-sky-50/40 transition text-center">
                      <td className="px-4 py-3 border border-gray-100">{index + 1}</td>
                      <td className="px-4 py-3 border border-gray-100 uppercase">{transaction?.serviceTypeName || '-'}</td>
                      <td className="px-4 py-3 border border-gray-100 uppercase">{transaction?.serviceName || '-'}</td>
                      <td className="px-4 py-3 border border-gray-100 uppercase">{transaction?.serviceRate || '-'}</td>
                      <td className="px-4 py-3 border border-gray-100 uppercase">{transaction?.remark || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center space-x-2 mt-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Number.isInteger(totalPages) && totalPages > 0
            ? [...Array(totalPages)].map((_, pageIndex) => (
              <button
                key={pageIndex}
                className={`px-3 py-1 rounded ${currentPage === pageIndex + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
                onClick={() => handlePageChange(pageIndex + 1)}
              >
                {pageIndex + 1}
              </button>
            ))
            : null}
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
        ⚠️ Note: A master cannot be deleted if it is used elsewhere.
      </div>
    </div>
  );
};

export default withAuth(ServiceMaster, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
