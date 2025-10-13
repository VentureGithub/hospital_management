'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt, FaSync, FaSave } from "react-icons/fa";
import apiClient from "../../config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function SalaryAddition() {
  return (
    <LayoutForm>
      <SalaryAdditionForm />
    </LayoutForm>
  );
}

const SalaryAdditionForm = () => {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    basicSalary: "",
    extraSalary: "",
    incremtntAmnt: ""
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetchData();
    fetchEmployees();
  }, []);

  // Fetch all salary additions
  const fetchData = async () => {
    try {
      const {data} = await apiClient.get(`salary/getAllSalaryAdditions`);
      setData(data.data || []);
    } catch (error) {
      console.error("Error fetching salary additions:", error);
      toast.error("Failed to fetch salary additions.");
    }
  };

  // Fetch all employees
  const fetchEmployees = async () => {
    setIsLoadingEmployees(true);
    try {
      const {data} = await apiClient.get(`emp/getAllEmployee`);
      setEmployees(data.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Failed to fetch employee list.");
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  // Handle employee selection and auto-fill fields
  const handleEmployeeSelect = (e) => {
    const selectedEmpCode = e.target.value;
    
    if (!selectedEmpCode) {
      // Clear all fields if no employee selected
      setInputs(prev => ({
        incrementId: 0,
        empCode: "",
        empName: "",
        salaryIncDate: prev.salaryIncDate,
        depName: "",
        designationName: "",
        joiningDate: "",
        dateOfBirth: "",
        jobType: "",
        remark: prev.remark,
        phnNo: "",
        basicSalary: "",
        extraSalary: "",
        incremtntAmnt: prev.incremtntAmnt
      }));
      return;
    }

    const selectedEmployee = employees.find(emp => emp.empCode === parseInt(selectedEmpCode));
    
    if (selectedEmployee) {
      setInputs(prev => ({
        ...prev,
        empCode: selectedEmployee.empCode || "",
        empName: selectedEmployee.empName || "",
        depName: selectedEmployee.depName || "",
        designationName: selectedEmployee.designationName || "",
        joiningDate: selectedEmployee.joiningDate || "",
        dateOfBirth: selectedEmployee.dateOfBirth || "",
        jobType: selectedEmployee.jobType || "",
        phnNo: selectedEmployee.phnNo || selectedEmployee.empMobile || "",
        basicSalary: selectedEmployee.basicSalary || "",
        extraSalary: selectedEmployee.extraSalary || ""
      }));
      toast.success(`Employee details loaded: ${selectedEmployee.empName}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  // Validation function
  const validateForm = () => {
    if (!inputs.empCode) {
      toast.error("Please select an employee");
      return false;
    }
    if (!inputs.salaryIncDate) {
      toast.error("Please select salary increment date");
      return false;
    }
    if (!inputs.incremtntAmnt || parseFloat(inputs.incremtntAmnt) <= 0) {
      toast.error("Please enter a valid increment amount");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data with proper types
      const payload = {
        incrementId: isEdit ? parseInt(inputs.incrementId) : 0,
        empCode: parseInt(inputs.empCode),
        empName: inputs.empName,
        salaryIncDate: inputs.salaryIncDate,
        depName: inputs.depName,
        designationName: inputs.designationName,
        joiningDate: inputs.joiningDate,
        dateOfBirth: inputs.dateOfBirth,
        jobType: inputs.jobType,
        remark: inputs.remark,
        phnNo: parseInt(inputs.phnNo) || 0,
        basicSalary: parseFloat(inputs.basicSalary) || 0,
        extraSalary: parseFloat(inputs.extraSalary) || 0,
        incremtntAmnt: parseFloat(inputs.incremtntAmnt)
      };

      if (isEdit) {
        const response = await apiClient.put(`salary/updateSalaryAddition`, payload);
        if (response.status === 200) {
          toast.success("Salary addition updated successfully");
          setIsEdit(false);
        } else {
          toast.error(response.data?.message || "Update failed.");
        }
      } else {
        const response = await apiClient.post(`salary/createSalaryAddition`, payload);
        if (response.status === 200 || response.status === 201) {
          toast.success("Salary addition saved successfully");
        } else {
          toast.error(response.data?.message || "Save failed.");
        }
      }
      
      await fetchData();
      handleRefresh();
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error(error.response?.data?.message || "Error saving data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = (item) => {
    setInputs({ 
      ...item,
      empCode: item.empCode?.toString() || "",
      phnNo: item.phnNo?.toString() || "",
      basicSalary: item.basicSalary?.toString() || "",
      extraSalary: item.extraSalary?.toString() || "",
      incremtntAmnt: item.incremtntAmnt?.toString() || ""
    });
    setIsEdit(true);
  };

  const handleRefresh = () => {
    setInputs({
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
      basicSalary: "",
      extraSalary: "",
      incremtntAmnt: ""
    });
    setIsEdit(false);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-sky-50 via-white to-sky-50 rounded-xl shadow-xl border border-sky-100 ml-6 mt-6">
      <Heading headingText="Salary Addition / Increment" />

      <form onSubmit={handleSave} className="space-y-6 mt-6">
        {/* Employee Selection */}
        <div className="bg-white p-4 rounded-lg border-2 border-sky-200">
          <label className="block mb-2 font-semibold text-sky-800">
            Select Employee <span className="text-red-500">*</span>
          </label>
          <select
            value={inputs.empCode}
            onChange={handleEmployeeSelect}
            disabled={isLoadingEmployees || isEdit}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {isLoadingEmployees ? "Loading employees..." : "Select Employee"}
            </option>
            {employees.map((emp) => (
              <option key={emp.empCode} value={emp.empCode}>
                {emp.empName} ({emp.empCode}) - {emp.depName}
              </option>
            ))}
          </select>
          {isEdit && (
            <p className="mt-2 text-xs text-amber-600">
              ⚠️ Employee cannot be changed while editing
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Auto-filled Employee Details */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Employee Name</label>
            <input
              type="text"
              name="empName"
              value={inputs.empName}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Department</label>
            <input
              type="text"
              name="depName"
              value={inputs.depName}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Designation</label>
            <input
              type="text"
              name="designationName"
              value={inputs.designationName}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={inputs.joiningDate}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={inputs.dateOfBirth}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Job Type</label>
            <input
              type="text"
              name="jobType"
              value={inputs.jobType}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phnNo"
              value={inputs.phnNo}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Current Basic Salary</label>
            <input
              type="number"
              name="basicSalary"
              value={inputs.basicSalary}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Current Extra Salary</label>
            <input
              type="number"
              name="extraSalary"
              value={inputs.extraSalary}
              readOnly
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* Editable Fields */}
          <div className="md:col-span-2 lg:col-span-3">
            <hr className="my-4 border-sky-200" />
            <h3 className="text-lg font-semibold text-sky-700 mb-4">Increment Details</h3>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sky-800">
              Salary Increment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="salaryIncDate"
              value={inputs.salaryIncDate}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sky-800">
              Increment Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="incremtntAmnt"
              value={inputs.incremtntAmnt}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Enter increment amount"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <label className="block mb-2 font-semibold text-sky-800">Remark</label>
            <input
              type="text"
              name="remark"
              value={inputs.remark}
              onChange={handleChange}
              placeholder="Enter remark (optional)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>

          {/* Display New Salary Calculation */}
          {inputs.basicSalary && inputs.incremtntAmnt && (
            <div className="md:col-span-2 lg:col-span-3 bg-sky-50 p-4 rounded-lg border-2 border-sky-200">
              <h4 className="font-semibold text-sky-800 mb-2">💰 Salary Calculation</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Current Salary:</p>
                  <p className="text-lg font-bold text-gray-800">
                    ₹{(parseFloat(inputs.basicSalary) + parseFloat(inputs.extraSalary || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Increment:</p>
                  <p className="text-lg font-bold text-sky-600">
                    +₹{parseFloat(inputs.incremtntAmnt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">New Salary:</p>
                  <p className="text-lg font-bold text-blue-600">
                    ₹{(parseFloat(inputs.basicSalary) + parseFloat(inputs.extraSalary || 0) + parseFloat(inputs.incremtntAmnt)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex mt-6 gap-4">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FaSync /> Refresh
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors duration-200 ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <FaSave /> {isSubmitting ? 'Processing...' : isEdit ? "Update" : "Save"}
          </button>
        </div>
      </form>

      {/* Data Table */}
      <div className="mt-8 bg-white border border-sky-100 rounded-lg shadow-md">
        <div className="overflow-x-auto max-h-96">
          <table className="w-full border-collapse text-center">
            <thead className="sticky top-0 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur text-sky-700">
              <tr>
                <th className="p-3 border border-gray-200">Action</th>
                <th className="p-3 border border-gray-200">Emp Code</th>
                <th className="p-3 border border-gray-200">Employee Name</th>
                <th className="p-3 border border-gray-200">Department</th>
                <th className="p-3 border border-gray-200">Designation</th>
                <th className="p-3 border border-gray-200">Increment Date</th>
                <th className="p-3 border border-gray-200">Increment Amount</th>
                <th className="p-3 border border-gray-200">Remark</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((item) => (
                  <tr key={item.incrementId} className="hover:bg-sky-50 transition-colors">
                    <td className="p-3 border border-gray-200">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition-colors p-2"
                        onClick={() => handleUpdate(item)}
                        aria-label="Edit salary addition"
                        title="Edit"
                      >
                        <FaPencilAlt />
                      </button>
                    </td>
                    <td className="p-3 border border-gray-200 font-medium">{item.empCode}</td>
                    <td className="p-3 border border-gray-200">{item.empName}</td>
                    <td className="p-3 border border-gray-200">{item.depName}</td>
                    <td className="p-3 border border-gray-200">{item.designationName}</td>
                    <td className="p-3 border border-gray-200">{item.salaryIncDate}</td>
                    <td className="p-3 border border-gray-200">
                      <span className="font-semibold text-sky-600">
                        +₹{parseFloat(item.incremtntAmnt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-200 text-sm text-gray-600">{item.remark || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-6 text-gray-500">
                    No salary additions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-sky-700 font-semibold text-sm">
        <strong>Note:</strong> Select an employee to automatically load their details. Only increment amount and date are editable.
      </p>
    </div>
  );
};

export default withAuth(SalaryAddition, ["SUPERADMIN", "ADMIN", "DOCTOR"]);