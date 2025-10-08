'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from 'sonner';

export function Insurance() {
  return (
    <LayoutForm>
      <InsuranceForm />
    </LayoutForm>
  );
}

const InsuranceForm = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState([]);
  const [dataa, setDataa] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [initialValues, setInitialValues] = useState({
    insuranceId: 0,
    insuranceCompnyName: "",
  });

  const validationSchema = Yup.object({
    insuranceCompnyName: Yup.string()
      .required("Insurance company name is required")
      .min(3, "Insurance company name must be at least 3 characters")
      .max(50, "Insurance company name cannot exceed 50 characters"),
  });

  const fetchApi = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`insurance/getAllData`);
      setData(response?.data?.data || []);
      setError(null);
    } catch (error) {
      setError("Error fetching data");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  // Filter data based on filterText and paginate
  const filteredData = data.filter(insurance =>
    insurance.insuranceCompnyName.toLowerCase().includes(filterText.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true);
      let response;
      if (isEdit) {
        response = await apiClient.put(`insurance/updateInsuranceData`, values);
      } else {
        response = await apiClient.post(`insurance/createInsuranceCompany`, values);
      }
      if (response?.status === 200) {
        toast.success(isEdit ? "Data updated successfully" : "Data saved successfully");
        fetchApi();
        setIsEdit(false);
        resetForm();
      } else {
        toast.error(isEdit ? "Update failed! Please try again." : "Save failed! Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (insurance) => {
    setInitialValues({
      insuranceId: insurance.insuranceId,
      insuranceCompnyName: insurance.insuranceCompnyName,
    });
    setIsEdit(true);
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
      <Heading headingText="Insurance Master" />
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
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                  <label className="block text-sm font-semibold mb-2 text-sky-800">Insurance Name</label>
                  <Field
                    type="text"
                    name="insuranceCompnyName"
                    className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
                    disabled={isLoading}
                  />
                  <ErrorMessage name="insuranceCompnyName" component="div" className="mt-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md" />
                </div>
              </div>
              <div className="flex justify-start space-x-4 my-4">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsEdit(false);
                  }}
                  disabled={isLoading}
                  className="bg-slate-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-slate-800"
                >
                  Refresh
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-800"
                >
                  {isLoading ? "Processing..." : isEdit ? "Update" : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="bg-white p-3 rounded-lg shadow-md mt-4 border border-sky-100">
        <div className="mb-4">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search by Insurance Name"
            className="p-2 w-full border border-sky-100 rounded text-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur text-center">
              <tr>
                <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Action</th>
                <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Insurance</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="2" className="text-center py-4">Loading...</td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((insurance, idx) => (
                  <tr key={idx} className="border border-gray-100 hover:bg-sky-50/40 transition text-center">
                    <td className="px-4 py-3 border border-gray-100 flex justify-center space-x-2">
                      <button
                        className="text-sky-600 hover:text-sky-800 flex items-center"
                        onClick={() => handleEdit(insurance)}
                      >
                        <FaPencilAlt />
                      </button>
                    </td>
                    <td className="px-4 py-3 border border-gray-100">{insurance.insuranceCompnyName}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-500">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center space-x-2 mt-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
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

export default withAuth(Insurance, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
