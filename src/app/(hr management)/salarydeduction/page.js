'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt, FaSync, FaSave } from "react-icons/fa";
import apiClient from "../../config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function Deduction() {
  return (
    <LayoutForm>
      <DeductionForm />
    </LayoutForm>
  );
}

const DeductionForm = () => {
  const [data, setData] = useState([]);
  const [emp, setEmp] = useState([]);
  const [dep, setDep] = useState([]);
  const [inputs, setInputs] = useState({
    salaryId: 0,
    depName: "",
    empName: "",
    deptId: 0,
    empCode: 0,
    headName: "",
    amount: 0,
    forMonth: "",
    date: ""
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchData();
    fetchEmp();
    fetchDep();
  }, []);

  const fetchData = async () => {
    try {
      const {data} = await apiClient.get(`salary/getSalaryAllEmployee`);
      setData(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch salary data.");
    }
  };

  const fetchEmp = async () => {
    try {
      const {data} = await apiClient.get(`emp/getAllEmployee`);
      setEmp(data.data || []);
    } catch (err) {
      toast.error("Failed to fetch employee list.");
    }
  };

  const fetchDep = async () => {
    try {
      const { data } = await apiClient.get(`dep/getAllDepartment`);
      setDep(data.data || []);
    } catch (err) {
      toast.error("Failed to fetch department list.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        const response = await apiClient.put(`salary/update`, inputs );
        if (response.status === 200) {
          toast.success("Data updated successfully");
          setIsEdit(false);
        } else {
          toast.error("Update failed.");
        }
      } else {
        const response = await apiClient.post(`salary/create`, inputs);
        if (response.status === 200) {
          toast.success("Data saved successfully");
        } else {
          toast.error("Save failed.");
        }
      }
      fetchData();
      setInputs({
        salaryId: 0,
        depName: "",
        empName: "",
        deptId: 0,
        empCode: 0,
        headName: "",
        amount: 0,
        forMonth: "",
        date: ""
      });
    } catch {
      toast.error("Error saving data.");
    }
  };

  const handleUpdate = (item) => {
    setInputs({ ...item });
    setIsEdit(true);
  };

  const handleRefresh = () => {
    setInputs({
      salaryId: 0,
      depName: "",
      empName: "",
      deptId: 0,
      empCode: 0,
      headName: "",
      amount: 0,
      forMonth: "",
      date: ""
    });
    setIsEdit(false);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-sky-50 via-white to-sky-50 rounded-xl shadow-xl border border-sky-100 ml-6 mt-6">
      <Heading headingText="Salary Add / Deduction" />

      <form onSubmit={handleSave} className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-sky-800">List Employee</label>
            <select
              name="empCode"
              value={inputs.empCode}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              <option value="">Select Employee</option>
              {emp.map((e) => (
                <option key={e.empCode} value={e.empCode}>
                  {e.empName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-sky-800">List Department</label>
            <select
              name="deptId"
              value={inputs.deptId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              <option value="">Select Department</option>
              {dep.map((d) => (
                <option key={d.deptId} value={d.deptId}>
                  {d.depName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-sky-800">Head Name</label>
            <select
              name="headName"
              value={inputs.headName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              <option value="">Select Head Name</option>
              <option value="Advance">Advance</option>
              <option value="Incentive">Incentive</option>
              <option value="Penalty">Penalty</option>
              <option value="PF">PF</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-sky-800">For Month</label>
            <input
              type="month"
              name="forMonth"
              value={inputs.forMonth}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-sky-800">Date</label>
            <input
              type="date"
              name="date"
              value={inputs.date}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-sky-800">Amount</label>
            <input
              type="number"
              name="amount"
              value={inputs.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>
        </div>

        <div className="flex mt-6 gap-4">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-6 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
          >
            <FaSync /> Refresh
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            <FaSave /> {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </form>

      <div className="mt-8 bg-white border border-sky-100 rounded-lg shadow-md">
        <div className="overflow-x-auto max-h-96">
          <table className="w-full border-collapse text-center">
            <thead className="sticky top-0 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur text-sky-700">
              <tr>
                <th className="p-3 border border-gray-200"></th>
                <th className="p-3 border border-gray-200">Code</th>
                <th className="p-3 border border-gray-200">Name</th>
                <th className="p-3 border border-gray-200">Department</th>
                <th className="p-3 border border-gray-200">Head Name</th>
                <th className="p-3 border border-gray-200">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((item, idx) => (
                  <tr key={item.salaryId} className="hover:bg-sky-50">
                    <td className="p-3 border border-gray-200">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleUpdate(item)}
                        aria-label="Edit deduction"
                      >
                        <FaPencilAlt />
                      </button>
                    </td>
                    <td className="p-3 border border-gray-200">{item.empCode}</td>
                    <td className="p-3 border border-gray-200">{item.empName}</td>
                    <td className="p-3 border border-gray-200">{item.depName}</td>
                    <td className="p-3 border border-gray-200">{item.headName}</td>
                    <td className="p-3 border border-gray-200">{item.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-6 text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-red-600 font-semibold">
        Note: A master cannot be deleted if used anywhere.
      </p>
    </div>
  );
};

export default withAuth(Deduction, ["SUPERADMIN", "ADMIN", "DOCTOR"]);
