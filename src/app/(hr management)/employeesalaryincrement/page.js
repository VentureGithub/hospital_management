'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaSearch, FaSync, FaSave, FaPen } from "react-icons/fa";
import apiClient from "../../config";
import withAuth from '@/app/(components)/WithAuth';
import { useState } from "react";
import { toast } from "sonner";

export function PurchaseInvoice() {
  return (
    <LayoutForm>
      <IncrementPromotion />
    </LayoutForm>
  );
}

const IncrementPromotion = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [inputs, setInputs] = useState({
    incrementId: 0,
    empCode: "",
    empName: "",
    salaryIncDate: "",
    depName: "",
    designationName: "",
    joiningDate: "",
    dateOfBirth: "",
    jobType: "",
    remark: "",
    phnNo: "",
    basicSalary: 0,
    extraSalary: 0,
    incremtntAmnt: 0,
  });

  const [emps, setEmps] = useState({});
  const [searchId, setSearchId] = useState("");

  const fetchEmps = async (empCode) => {
    try {
      const { data } = await apiClient.get(`emp/getData/byId?empCode=${empCode}`);
      if (data.status === 200 && data.data) {
        setEmps(data.data);
        setInputs(prev => ({
          ...prev,
          empCode: data.data.empCode || "",
          empName: data.data.empName || "",
          salaryIncDate: "",
          depName: data.data.depName || "",
          designationName: data.data.designationName || "",
          joiningDate: data.data.joiningDate || "",
          dateOfBirth: data.data.dateOfBirth || "",
          jobType: data.data.jobType || "",
          phnNo: data.data.phnNo || "",
          basicSalary: data.data.basicSalary || 0,
          extraSalary: 0,
          incremtntAmnt: 0,
          remark: ""
        }));
      } else {
        toast.error("Employee not found");
        setEmps({});
      }
    } catch {
      toast.error("Failed to fetch employee data");
      setEmps({});
    }
  };

  const handleSearch = () => {
    if (searchId.trim()) {
      fetchEmps(searchId.trim());
    } else {
      toast.error("Please enter an Employee ID to search");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isEdit) {
        response = await apiClient.put(`salaryIncrement/update`, inputs);
      } else {
        response = await apiClient.post(`salaryIncrement/create`, inputs);
      }
      if (response.status === 200) {
        toast.success(isEdit ? "Updated successfully" : "Saved successfully");
        setIsEdit(false);
        setEmps({});
        setInputs({
          incrementId: 0, empCode: "", empName: "", salaryIncDate: "", depName: "", designationName: "",
          joiningDate: "", dateOfBirth: "", jobType: "", remark: "", phnNo: "", basicSalary: 0, extraSalary: 0, incremtntAmnt: 0
        });
      } else {
        toast.error("Operation failed, please try again");
      }
    } catch {
      toast.error("Error occurred while saving data");
    }
  };

  const handleUpdate = (data) => {
    setInputs({ ...data });
    setEmps(data);
    setIsEdit(true);
  };

  const handleReset = () => {
    setInputs({
      incrementId: 0, empCode: "", empName: "", salaryIncDate: "", depName: "", designationName: "",
      joiningDate: "", dateOfBirth: "", jobType: "", remark: "", phnNo: "", basicSalary: 0, extraSalary: 0, incremtntAmnt: 0
    });
    setEmps({});
    setIsEdit(false);
    setSearchId("");
  };

  return (
    <div className="p-6 rounded-xl shadow-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white ml-6 mt-6">
      <Heading headingText="Employee Salary Increment" />

      {/* Search bar */}
      <div className="flex items-center space-x-3 mt-4">
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-1"
        >
          <FaSearch />
          <span>Search</span>
        </button>
      </div>

      {/* Employee Info */}
      {emps.empCode && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-sky-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div><strong>Code:</strong> {emps.empCode}</div>
          <div><strong>Name:</strong> {emps.empName}</div>
          <div><strong>Department:</strong> {emps.depName}</div>
          <div><strong>Designation:</strong> {emps.designationName}</div>
          <div><strong>Join Date:</strong> {emps.joiningDate}</div>
          <div><strong>DOB:</strong> {emps.dateOfBirth}</div>
          <div><strong>Job Type:</strong> {emps.jobType}</div>
          <div><strong>Phone:</strong> {emps.phnNo}</div>
        </div>
      )}

      {/* Increment Form */}
      <form onSubmit={handleSave} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Increment Date</label>
            <input
              type="date"
              name="salaryIncDate"
              value={inputs.salaryIncDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Remark</label>
            <input
              type="text"
              name="remark"
              value={inputs.remark}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Basic Salary</label>
            <input
              type="number"
              name="basicSalary"
              value={inputs.basicSalary}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Extra Salary</label>
            <input
              type="number"
              name="extraSalary"
              value={inputs.extraSalary}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Increment Amount</label>
            <input
              type="number"
              name="incremtntAmnt"
              value={inputs.incremtntAmnt}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-300"
            />
          </div>
        </div>
        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaSave />
            <span>{isEdit ? "Update" : "Save"}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <FaSync />
            <span>Reset</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default withAuth(PurchaseInvoice, ["SUPERADMIN", "ADMIN", "DOCTOR"]);
