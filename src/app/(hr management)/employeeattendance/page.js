'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import { toast } from "sonner";
import withAuth from "@/app/(components)/WithAuth";
import { useFormik } from "formik";
import { FaPencilAlt, FaSync, FaSave ,FaUserTie } from "react-icons/fa";
import * as Yup from "yup";

export function EmployeeAttendance() {
  return (
    <LayoutForm>
      <EmployeeAttendanceForm />
    </LayoutForm>
  );
}

const EmployeeAttendanceForm = () => {
  const [data, setData] = useState([]);
  const [emp, setEmp] = useState([]);
  const [dep, setDep] = useState([]);
  const [shift, setShift] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const fetchData = async () => {
    try {
      const { data } = await apiClient.get("attendance/getTodayAttandance");
      setData(data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch attendance data.");
    }
  };

  const fetchEmp = async () => {
    try {
      const { data } = await apiClient.get("emp/getAllEmployee");
      setEmp(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch employees.");
    }
  };

  const fetchDep = async () => {
    try {
      const { data } = await apiClient.get("dep/getAllDepartment");
      setDep(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch departments.");
    }
  };

  const fetchShift = async () => {
    try {
      const { data } = await apiClient.get("shiftMaster/getAllDetailsghift");
      setShift(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch shifts.");
    }
  };

  useEffect(() => {
    fetchData();
    fetchEmp();
    fetchDep();
    fetchShift();
  }, []);

  const formik = useFormik({
    initialValues: {
      attancanceId: 0,
      empCode: "",
      empName: "",
      date: "",
      timeCome: "",
      timeGo: "",
      deptId: "",
      depName: "",
      shiftId: "",
      shiftName: "",
      dueToEmergency: "",
    },
    validationSchema: Yup.object({
      empCode: Yup.string().required("Employee is required"),
      deptId: Yup.string().required("Department is required"),
      shiftId: Yup.string().required("Shift is required"),
      date: Yup.date().required("Date is required"),
      timeCome: Yup.string().required("In-Time is required"),
    }),
    onSubmit: async (values) => {
      try {
        let response;
        if (isEdit) {
          response = await apiClient.put("attendance/update", values);
          if (response.status === 200) {
            toast.success("Updated successfully");
            setIsEdit(false);
          } else {
            toast.error("Update failed.");
          }
        } else {
          response = await apiClient.post("attendance/save", values);
          if (response.status === 200) {
            toast.success("Saved successfully");
          } else {
            toast.error("Save failed.");
          }
        }
        fetchData();
        formik.resetForm();
      } catch (error) {
        toast.error("An error occurred while saving.");
      }
    },
  });

  const handleUpdate = (attendance) => {
    formik.setValues({
      attancanceId: attendance.attancanceId,
      empCode: attendance.empCode,
      empName: attendance.empName,
      date: attendance.date,
      timeCome: attendance.timeCome,
      timeGo: attendance.timeGo,
      deptId: attendance.deptId,
      depName: attendance.depName,
      shiftId: attendance.shiftId,
      shiftName: attendance.shiftName,
      dueToEmergency: attendance.dueToEmergency,
    });
    setIsEdit(true);
  };

  const handleRefresh = () => {
    formik.resetForm();
    setIsEdit(false);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-sky-50 via-white to-sky-50 rounded-xl shadow-xl border border-sky-100 ml-6 mt-6">
           <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                      <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                              <FaUserTie size={18} />
                          </div>
                          <Heading headingText="Employment Attendance Master" />
                      </div>
                      <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
                          Master • Employment Attendance
                      </div>
                  </div>
      <form onSubmit={formik.handleSubmit} className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-semibold text-sky-800">List Employee</label>
            <select
              name="empCode"
              value={formik.values.empCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${
                formik.touched.empCode && formik.errors.empCode ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Employee</option>
              {emp.map((e) => (
                <option key={e.empCode} value={e.empCode}>
                  {e.empName}
                </option>
              ))}
            </select>
            {formik.touched.empCode && formik.errors.empCode && (
              <p className="text-red-600 text-xs mt-1">{formik.errors.empCode}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sky-800">List Department</label>
            <select
              name="deptId"
              value={formik.values.deptId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${
                formik.touched.deptId && formik.errors.deptId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Department</option>
              {dep.map((d) => (
                <option key={d.deptId} value={d.deptId}>
                  {d.depName}
                </option>
              ))}
            </select>
            {formik.touched.deptId && formik.errors.deptId && (
              <p className="text-red-600 text-xs mt-1">{formik.errors.deptId}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sky-800">Shift</label>
            <select
              name="shiftId"
              value={formik.values.shiftId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${
                formik.touched.shiftId && formik.errors.shiftId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Shift</option>
              {shift.map((s) => (
                <option key={s.shiftId} value={s.shiftId}>
                  {s.shiftName}
                </option>
              ))}
            </select>
            {formik.touched.shiftId && formik.errors.shiftId && (
              <p className="text-red-600 text-xs mt-1">{formik.errors.shiftId}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sky-800">Date</label>
            <input
              type="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${
                formik.touched.date && formik.errors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formik.touched.date && formik.errors.date && (
              <p className="text-red-600 text-xs mt-1">{formik.errors.date}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sky-800">In-Time</label>
            <input
              type="time"
              name="timeCome"
              value={formik.values.timeCome}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${
                formik.touched.timeCome && formik.errors.timeCome ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formik.touched.timeCome && formik.errors.timeCome && (
              <p className="text-red-600 text-xs mt-1">{formik.errors.timeCome}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sky-800">Out-Time</label>
            <input
              type="time"
              name="timeGo"
              value={formik.values.timeGo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${
                formik.touched.timeGo && formik.errors.timeGo ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formik.touched.timeGo && formik.errors.timeGo && (
              <p className="text-red-600 text-xs mt-1">{formik.errors.timeGo}</p>
            )}
          </div>
        </div>

        <div className="flex justify-start mt-6 space-x-4">
          <button
            type="button"
            onClick={() => {
              formik.resetForm();
              setIsEdit(false);
              fetchData();
            }}
            className="inline-flex items-center gap-2 px-6 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-900 focus:outline-none"
          >
            <FaSync /> Refresh
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-800 focus:outline-none"
          >
            <FaSave /> {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </form>

      <div className="mt-8 bg-white rounded-lg shadow-md border border-sky-100">
        <div className="overflow-auto max-h-96">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur text-sky-700 text-xs">
              <tr>
                <th className="border p-2 text-center"></th>
                <th className="border p-2 text-center">Code</th>
                <th className="border p-2 text-center">Name</th>
                <th className="border p-2 text-center">Department</th>
                <th className="border p-2 text-center">In-Time</th>
                <th className="border p-2 text-center">Out-Time</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((item, index) => (
                  <tr key={item.attancanceId} className="hover:bg-sky-50">
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleUpdate(item)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Edit attendance"
                      >
                        <FaPencilAlt />
                      </button>
                    </td>
                    <td className="border p-2 text-center">{item.attancanceId}</td>
                    <td className="border p-2 text-center">{item.empName}</td>
                    <td className="border p-2 text-center">{item.depName}</td>
                    <td className="border p-2 text-center">{item.timeCome}</td>
                    <td className="border p-2 text-center">{item.timeGo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-6 text-center" colSpan={6}>
                    No Attendance Records Found
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

export default withAuth(EmployeeAttendance, ["SUPERADMIN", "ADMIN", "DOCTOR"]);
