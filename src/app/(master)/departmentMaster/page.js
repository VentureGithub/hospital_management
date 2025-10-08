'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt, FaBuilding ,FaSync ,FaSave } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
  const [initialValues, setInitialValues] = useState({
    deptId: 0,
    grade: "",
    depName: "",
    description: "",
    isActive: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const itemsPerPage = 5;

  const fetchApi = async () => {
    try {
      const response = await apiClient.get(`dep/getAllDepartment`);
      setData(response?.data?.data);
    } catch (error) {
      toast.error("Error fetching department data");
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const filteredData = data?.filter((department) =>
    department.depName.toLowerCase().includes(filterText.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const validationSchema = Yup.object({
    grade: Yup.string().required("Grade is required"),
    depName: Yup.string().required("Department name is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (isEdit) {
        const response = await apiClient.put(`dep/updateDep`, values);
        response.status === 200
          ? toast.success("Data updated successfully")
          : toast.error("Update failed! Please try again.");
      } else {
        const response = await apiClient.post(`dep/saveDep`, values);
        response.status === 200
          ? toast.success("Data saved successfully")
          : toast.error("Save failed! Please try again.");
      }
      fetchApi();
      resetForm();
      setIsEdit(false);
    } catch (error) {
      toast.error("Error handling department data");
      console.error(error);
    }
  };

  const handleEdit = (department) => {
    setInitialValues({
      deptId: department.deptId,
      grade: department.grade,
      depName: department.depName,
      description: department.description,
      isActive: department.isActive,
    });
    setIsEdit(true);
  };

  return (
    <div className="p-6 bg-sky-50/60 rounded-2xl shadow-xl mt-6 ml-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <Heading headingText="Department Master" icon={<FaBuilding className="text-sky-700" />} />
       <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
          Master . Department
        </div>
      </div>

      {/* Form Section */}
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="bg-white p-5 rounded-lg border border-sky-100 shadow-sm mt-5 lg:w-[60%]">
          <div className="grid grid-cols-1 gap-4">
            {/* Grade */}
            <div>
              <label className="text-sm font-semibold text-sky-800">Grade</label>
              <Field
                as="select"
                name="grade"
                className="w-full mt-1 border border-sky-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-300 outline-none"
              >
                <option value="">Select Grade</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </Field>
              <ErrorMessage
                name="grade"
                component="p"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            {/* Department Name */}
            <div>
              <label className="text-sm font-semibold text-sky-800">
                Department Name
              </label>
              <Field
                type="text"
                name="depName"
                className="w-full mt-1 border border-sky-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-300 outline-none"
                placeholder="e.g., Human Resources, IT, Finance"
              />
              <ErrorMessage
                name="depName"
                component="p"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-sky-800">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                rows="2"
                className="w-full mt-1 border border-sky-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-300 outline-none"
                placeholder="Brief description about department..."
              />
              <ErrorMessage
                name="description"
                component="p"
                className="text-red-600 text-xs mt-1"
              />
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
      </Formik>

      {/* Table Section */}
      <div className="bg-white border border-sky-100 rounded-lg shadow-sm mt-8 p-4">
        {/* Search */}
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search by Department Name"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-64 px-3 py-2 border border-sky-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-300 outline-none"
          />
        </div>

        {/* Table */}
<div className="bg-white p-3 my-4 text-sm rounded-lg shadow-md border border-sky-100">
  <div className="overflow-x-auto">
    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
      <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
        <thead className="sticky top-0 z-10">
          <tr className="text-center bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur">
            <th className="px-2 py-2 border border-gray-100 text-sky-700 text-[11px] tracking-wide w-[70px] text-left">
              Action
            </th>
            <th className="px-3 py-2 border border-gray-100 text-sky-700 text-[11px] tracking-wide text-left">
              Department
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData?.length > 0 ? (
            currentData.map((department, index) => (
              <tr
                key={index}
                className="border border-gray-100 hover:bg-sky-50/40 transition"
              >
                <td className="px-2 py-2 border border-gray-100 text-left w-[70px]">
                  <button
                    className="text-sky-600 hover:text-sky-800 flex items-center"
                    onClick={() => handleEdit(department)}
                  >
                    <FaPencilAlt className="text-[12px]" />
                  </button>
                </td>
                <td className="px-3 py-2 border border-gray-100 text-[12px] text-gray-800 uppercase">
                  {department.depName}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="2"
                className="text-center text-gray-500 py-4 italic text-[12px]"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>



        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            <button
              className="px-3 py-1 bg-sky-200 rounded hover:bg-sky-300 text-sky-800 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-sky-600 text-white"
                    : "bg-sky-100 text-sky-800 hover:bg-sky-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 bg-sky-200 rounded hover:bg-sky-300 text-sky-800 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
          ⚠️ Note: A master cannot be deleted if used anywhere.
      </div>
    </div>
  );
};

export default withAuth(Insurance, ["DOCTOR", "ADMIN", "SUPERADMIN"]);
