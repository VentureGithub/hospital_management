'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt ,FaSync ,FaSave } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';

export function RoomType() {
  return (
    <LayoutForm>
      <RoomTypeForm />
    </LayoutForm>
  );
}

const RoomTypeForm = () => {
  const [data, setData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const fetchApi = async () => {
    try {
      const response = await apiClient.get(`roomTypeMaster/getAllDetailofRoomTypeMaster`);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Unable to fetch room type data.");
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const formik = useFormik({
    initialValues: {
      roomTypeId: 0,
      roomTypeName: "",
      description: ""
    },
    validationSchema: Yup.object({
      roomTypeName: Yup.string()
        .required('Room Type Name is required')
        .matches(/^[a-zA-Z0-9\s]+$/, 'Room Type Name can only contain letters, numbers, and spaces'),
    }),
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          const response = await apiClient.put(
            `roomTypeMaster/updateRoomTypeMaster?id=${values.roomTypeId}`,
            values
          );
          if (response.status === 200) {
            toast.success("Data updated successfully");
            setIsEdit(false);
          } else {
            toast.error("Update failed! Please try again");
          }
        } else {
          const response = await apiClient.post(
            `roomTypeMaster/saveRoomType`,
            values
          );
          if (response.status === 202) {
            toast.success("Data saved successfully");
          } else {
            toast.error("Save failed! Please try again");
          }
        }
        fetchApi();
        formik.resetForm();
      } catch (error) {
        console.error("Error handling room type:", error);
        toast.error("An error occurred. Please try again.");
      }
    }
  });

  const handleUpdate = (roomType) => {
    formik.setValues({
      roomTypeId: roomType.roomTypeId,
      roomTypeName: roomType.roomTypeName,
      description: roomType.description
    });
    setIsEdit(true);
  };

  const handleRefresh = () => {
    formik.resetForm();
    setIsEdit(false);
  };

  return (
    <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
            {/* Optionally add an icon */}
          </div>
          <Heading headingText="Room Type" />
        </div>
        <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
          Master • Room Type
        </div>
      </div>
      <div className="py-4">
        <form className="lg:w-[50%] md:w-[100%] sm:w-[100%]" onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 m-2">
            <div className={`w-full bg-white border border-sky-100 rounded-lg p-4 shadow-sm`}>
              <label className="block font-semibold text-sm mb-2 text-sky-800">Room Type</label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 ${formik.touched.roomTypeName && formik.errors.roomTypeName ? "border-red-500" : "border-gray-200"}`}
                placeholder="Room Type"
                name="roomTypeName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.roomTypeName}
              />
              {formik.touched.roomTypeName && formik.errors.roomTypeName && (
                <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
                  {formik.errors.roomTypeName}
                </div>
              )}
            </div>
            <div className="w-full bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
              <label className="block font-semibold text-sm mb-2 text-sky-800">Description</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
                placeholder="Description"
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              />
            </div>
          </div>
          <div className="flex justify-start w-full space-x-4 py-4">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 bg-slate-600 text-sm text-white px-6 py-2 rounded-lg hover:bg-slate-800 active:scale-[.99] transition"
            >
               <FaSync/> Refresh
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-emerald-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-emerald-800 active:scale-[.99] transition"
            >
             <FaSave/> {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white p-3 my-4 rounded-lg shadow-md border border-sky-100">
        <div className="overflow-x-auto">
          <div style={{ maxHeight: "400px", overflowY: "auto" }} className="w-full">
            <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur text-center">
                <tr>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">
                    Action
                  </th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide ">
                    Room Type
                  </th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide ">
                    Description
                  </th>
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
                      <td className="px-4 py-3 border border-gray-100 uppercase">
                        {transaction.roomTypeName}
                      </td>
                      <td className="px-4 py-3 border border-gray-100 uppercase">
                        {transaction.description}
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
      <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
        ⚠️ Note: A master cannot be deleted if it is used elsewhere.
      </div>
    </div>
  );
};

export default withAuth(RoomType, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
