'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt ,FaSync ,FaSave} from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';

export function ShiftMaster() {
  return (
    <LayoutForm>
      <ShiftMasterform />
    </LayoutForm>
  );
}

const ShiftMasterform = () => {
  const [data, setData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApi = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("shiftMaster/getAllDetailsghiftMaster");
      setData(response.data.data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch shift data");
      toast.error("Error fetching shift data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const validationSchema = Yup.object({
    shiftName: Yup.string()
      .required('Shift Name is required')
      .matches(/^[a-zA-Z\s]+$/, 'Shift Name should only contain letters and spaces'),
    shifTimeStart: Yup.string().required('Start Time is required'),
    shiftTimeEnd: Yup.string().required('End Time is required')
  });

  const formik = useFormik({
    initialValues: {
      shiftId: 0,
      shiftName: "",
      shifTimeStart: "",
      shiftTimeEnd: "",
      shiftCreatedDate: new Date().toISOString().split('T')[0],
      shiftTimeTable: "default"
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const endpoint = isEdit
          ? `shiftMaster/updateShiftMaster?shiftId=${values.shiftId}`
          : "shiftMaster/saveShiftMaster";
        const method = isEdit ? 'put' : 'post';
        const response = await apiClient[method](endpoint, values);

        if (response.status === 200 || response.status === 202) {
          toast.success(`Shift ${isEdit ? 'updated' : 'saved'} successfully`);
          await fetchApi();
          formik.resetForm();
          setIsEdit(false);
        }
      } catch (error) {
        setError(`Failed to ${isEdit ? 'update' : 'save'} shift`);
        toast.error("Submission error.");
      } finally {
        setLoading(false);
      }
    }
  });

  const handleUpdate = (shift) => {
    formik.setValues({
      ...shift,
      shiftCreatedDate: new Date().toISOString().split('T')[0],
      shiftTimeTable: shift.shiftTimeTable || "default"
    });
    setIsEdit(true);
  };

  return (
    <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
            {/* Optional icon */}
          </div>
          <Heading headingText="Shift Master" />
        </div>
        <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
          Master • Shifts
        </div>
      </div>
      {error && (
        <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
          {error}
        </div>
      )}
      <div className="py-4">
        <form className="lg:w-[50%] md:w-[90%] sm:w-[100%]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Shift Name */}
            <div>
              <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                <label className="block font-semibold text-sm mb-2 text-sky-800">
                  Shift Name
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200 ${formik.touched.shiftName && formik.errors.shiftName ? "border-red-500" : ""}`}
                  {...formik.getFieldProps('shiftName')}
                  placeholder="Shift"
                />
                {formik.touched.shiftName && formik.errors.shiftName && (
                  <div className="mt-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
                    {formik.errors.shiftName}
                  </div>
                )}
              </div>
            </div>
            {/* Start Time */}
            <div>
              <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                <label className="block font-semibold text-sm mb-2 text-sky-800">
                  From
                </label>
                <input
                  type="time"
                  className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200 ${formik.touched.shifTimeStart && formik.errors.shifTimeStart ? "border-red-500" : ""}`}
                  {...formik.getFieldProps('shifTimeStart')}
                />
                {formik.touched.shifTimeStart && formik.errors.shifTimeStart && (
                  <div className="mt-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
                    {formik.errors.shifTimeStart}
                  </div>
                )}
              </div>
            </div>
            {/* End Time (full width) */}
            <div className="md:col-span-2">
              <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                <label className="block font-semibold text-sm mb-2 text-sky-800">
                  To
                </label>
                <input
                  type="time"
                  className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200 ${formik.touched.shiftTimeEnd && formik.errors.shiftTimeEnd ? "border-red-500" : ""}`}
                  {...formik.getFieldProps('shiftTimeEnd')}
                />
                {formik.touched.shiftTimeEnd && formik.errors.shiftTimeEnd && (
                  <div className="mt-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
                    {formik.errors.shiftTimeEnd}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-start w-full space-x-4 p-2 my-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-slate-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-slate-800 active:scale-[.99] transition"
              onClick={() => {
                formik.resetForm();
                setIsEdit(false);
              }}
              disabled={loading}
            >
              <FaSync/> Refresh
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-800 active:scale-[.99] transition"
              disabled={loading}
              onClick={formik.handleSubmit}
            >
               <FaSave/>{loading ? 'Processing...' : isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {/* Data Table */}
      <div className="bg-white p-3 my-4 rounded-lg shadow-md border border-sky-100">
        <div className="overflow-x-auto">
          <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur text-center">
                <tr>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Action</th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Shift Name</th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">From</th>
                  <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">To</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">Loading...</td>
                  </tr>
                ) : data?.length > 0 ? (
                  data.map((shift, index) => (
                    <tr key={index} className="border border-gray-100 hover:bg-sky-50/40 transition text-center">
                      <td className="px-4 py-3 border border-gray-100">
                        <button
                          className="text-sky-600 hover:text-sky-800 flex items-center"
                          onClick={() => handleUpdate(shift)}
                        >
                          <FaPencilAlt />
                        </button>
                      </td>
                      <td className="px-4 py-3 border border-gray-100 uppercase">{shift.shiftName}</td>
                      <td className="px-4 py-3 border border-gray-100 uppercase">{shift.shifTimeStart}</td>
                      <td className="px-4 py-3 border border-gray-100 uppercase">{shift.shiftTimeEnd}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">No shifts available</td>
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

export default withAuth(ShiftMaster, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
