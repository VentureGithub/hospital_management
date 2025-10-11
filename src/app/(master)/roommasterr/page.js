'use client';
import { useState, useEffect } from "react";
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt ,FaSync ,FaSave } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'sonner';

export function RoomMaster() {
  return (
    <LayoutForm>
      <RoomForm />
    </LayoutForm>
  );
}

const RoomForm = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [emp, setEmp] = useState([]);
  const [data, setData] = useState([]);
  const [initialValues, setInitialValues] = useState({
    roomwardId: 0,
    roomTypeId: "",
    roomTypeName: "",
    roomBedNo: "",
    roomBedCharge: "",
    roomStatus: true
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const itemsPerPage = 5;

  const fetchApi = async () => {
    try {
      const response = await apiClient.get("patientRoom/getAllDetailofRoom");
      setData(response?.data?.data);
    } catch (error) {
      toast.error("Unable to fetch room master data.");
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const filteredData = data?.filter(t =>
    t.roomTypeName.toLowerCase().includes(filterText.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const handlePageChange = page => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const fetchEmp = async () => {
    try {
      const response = await apiClient.get(`roomTypeMaster/getAllDetailofRoomTypeMaster`);
      setEmp(response?.data?.data);
    } catch (error) {
      toast.error("Unable to fetch room types.");
    }
  };

  useEffect(() => {
    fetchEmp();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const apiUrl = isEdit ? `patientRoom/updateRoomMaster` : `patientRoom/admitRoom`;
      const response = await apiClient[isEdit ? "put" : "post"](apiUrl, values);

      if (response.status === 200 || response.status === 202) {
        toast.success(isEdit ? "Data updated successfully" : "Data saved successfully");
        setIsEdit(false);
        resetForm();
        fetchApi();
      } else {
        toast.error("Operation failed! Please try again");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleUpdate = roomm => {
    setInitialValues({
      roomwardId: roomm.roomwardId,
      roomTypeId: roomm.roomTypeId,
      roomTypeName: roomm.roomTypeName,
      roomBedNo: roomm.roomBedNo,
      roomBedCharge: roomm.roomBedCharge,
      roomStatus: roomm.roomStatus,
    });
    setIsEdit(true);
  };

  const validationSchema = Yup.object({
    roomTypeId: Yup.string().required("Room Name is required"),
    roomBedNo: Yup.string().required("Bed No is required"),
  });

  return (
    <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
            {/* Optional icon */}
          </div>
          <Heading headingText="Room Master" />
        </div>
        <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
          Master • Room Master
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
            <Form className="lg:w-[50%] md:w-[90%] sm:w-[100%]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Room Name */}
                <div>
                  <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">
                      Room Name
                    </label>
                    <Field
                      as="select"
                      name="roomTypeId"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 text-sm border-gray-200"
                    >
                      <option value="">Select Room</option>
                      {emp?.map(driver => (
                        <option key={driver.roomTypeId} value={driver.roomTypeId}>
                          {driver.roomTypeName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="roomTypeId" component="div" className="mt-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md" />
                  </div>
                </div>
                {/* Bed No */}
                <div>
                  <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">
                      Bed No.
                    </label>
                    <Field
                      type="text"
                      name="roomBedNo"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 text-sm border-gray-200"
                    />
                    <ErrorMessage name="roomBedNo" component="div" className="mt-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md" />
                  </div>
                </div>
                {/* Charges - full width */}
                <div className="md:col-span-2">
                  <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">
                      Charges
                    </label>
                    <Field
                      type="text"
                      name="roomBedCharge"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 text-sm border-gray-200"
                    />
                    <ErrorMessage name="roomBedCharge" component="div" className="mt-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md" />
                  </div>
                </div>
              </div>
              <div className="flex justify-start w-full space-x-4 p-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-800 active:scale-[.99] transition text-sm"
                  onClick={() => {
                    resetForm();
                    setIsEdit(false);
                  }}
                >
                   <FaSync/> Refresh
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 active:scale-[.99] transition text-sm"
                >
                <FaSave/>  {isEdit ? "Update" : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Table Section */}
      <div className="bg-white p-3 my-4 rounded-lg shadow-md border border-sky-100">
        <div className="mb-4">
          <input
            type="text"
            className="p-2 border border-sky-100 rounded text-sm"
            placeholder="Search by Room Type"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur text-center">
                <tr>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">
                    Action
                  </th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">
                    Room Type
                  </th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">
                    Bed No.
                  </th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">
                    Charges
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(currentData) && currentData?.length > 0 ? (
                  currentData.map((transaction, index) => (
                    <tr key={index} className="border border-gray-100 hover:bg-sky-50/40 transition text-center">
                      <td className="px-4 py-3 border border-gray-100 flex items-center justify-center space-x-2">
                        <button
                          className="text-sky-600 hover:text-sky-800 flex items-center"
                          onClick={() => handleUpdate(transaction)}
                        >
                          <FaPencilAlt className="mr-1" />
                        </button>
                      </td>
                      <td className="px-4 py-3 border border-gray-100 uppercase">{transaction.roomTypeName}</td>
                      <td className="px-4 py-3 border border-gray-100 uppercase">{transaction.roomBedNo}</td>
                       <td className="px-4 py-3 border border-gray-100 uppercase">{transaction.roomBedCharge}</td>
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
        <div className="flex justify-center space-x-2 mt-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Number.isInteger(totalPages) && totalPages > 0 ? (
            [...Array(totalPages)].map((_, pageIndex) => (
              <button
                key={pageIndex}
                className={`px-3 py-1 rounded ${
                  currentPage === pageIndex + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handlePageChange(pageIndex + 1)}
              >
                {pageIndex + 1}
              </button>
            ))
          ) : null}
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

export default withAuth(RoomMaster, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
