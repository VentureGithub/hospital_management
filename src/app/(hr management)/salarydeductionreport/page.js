'use client';

import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { toast } from 'sonner';

export function Deduction() {
    return (
        <LayoutForm>
            <DeductionForm />
        </LayoutForm>
    );
}

const DeductionForm = () => {
    const [dep, setDep] = useState([]);
    const [emp, setEmp] = useState([]);
    const [isLoadingDepts, setIsLoadingDepts] = useState(false);
    const [isLoadingEmps, setIsLoadingEmps] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    
    const [inputs, setInputs] = useState({
        deptId: "",
        empCode: "",
        fromDate: "",
        toDate: ""
    });

    // Fetch all departments
    const fetchDep = async () => {
        setIsLoadingDepts(true);
        try {
            const response = await apiClient.get(`dep/getAllDepartment`);
            setDep(response.data.data || []);
        } catch (error) {
            console.error("Error fetching departments", error);
            toast.error("Failed to load departments");
        } finally {
            setIsLoadingDepts(false);
        }
    };

    // Fetch employees by department ID
    const fetchEmployeesByDept = async (deptId) => {
        if (!deptId) {
            setEmp([]);
            return;
        }

        setIsLoadingEmps(true);
        try {
            const response = await apiClient.get(
                `emp/getByDeptId?deptId=${deptId}`
            );
            setEmp(response.data.data || []);
        } catch (error) {
            console.error("Error fetching employees", error);
            toast.error("Failed to load employees");
            setEmp([]);
        } finally {
            setIsLoadingEmps(false);
        }
    };

    // Handle department selection
    const handleDep = (e) => {
        const selectedDeptId = e.target.value;
        setInputs((prev) => ({ 
            ...prev, 
            deptId: selectedDeptId,
            empCode: "" // Reset employee selection when department changes
        }));

        // Fetch employees for the selected department
        fetchEmployeesByDept(selectedDeptId);
    };

    // Handle employee selection
    const handleEmp = (e) => {
        setInputs((prev) => ({ ...prev, empCode: e.target.value }));
    };

    // Handle change for date inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    // Fetch departments on component mount
    useEffect(() => {
        fetchDep();
    }, []);

    // Validation function
    const validateInputs = () => {
        const { deptId, empCode, fromDate, toDate } = inputs;

        if (!deptId) {
            toast.error("Please select a department");
            return false;
        }

        if (!empCode) {
            toast.error("Please select an employee");
            return false;
        }

        if (!fromDate) {
            toast.error("Please select a from date");
            return false;
        }

        if (!toDate) {
            toast.error("Please select a to date");
            return false;
        }

        // Check if fromDate is not after toDate
        if (new Date(fromDate) > new Date(toDate)) {
            toast.error("From date cannot be after to date");
            return false;
        }

        return true;
    };

    // Handle Print Button Click
    const handlePrint = async () => {
        if (!validateInputs()) {
            return;
        }

        setIsPrinting(true);
        const { deptId, empCode, fromDate, toDate } = inputs;
    
        try {
            const response = await apiClient.get(
                `salary/employeeSalaryAddReport/deductaionReport`,
                {
                    params: { deptId, empCode, fromDate, toDate },
                    responseType: "blob", // Important for handling binary data (PDF)
                }
            );
    
            // Create a Blob from the response data
            const pdfBlob = new Blob([response.data], { type: "application/pdf" });
    
            // Open the PDF in a new browser tab
            const pdfUrl = window.URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, "_blank");
    
            // Clean up the URL object after opening
            setTimeout(() => window.URL.revokeObjectURL(pdfUrl), 1000);
            
            toast.success("Report generated successfully");
        } catch (error) {
            console.error("Error generating report", error);
            toast.error(error.response?.data?.message || "Failed to generate report. Please try again.");
        } finally {
            setIsPrinting(false);
        }
    };

    // Handle form reset
    const handleReset = () => {
        setInputs({
            deptId: "",
            empCode: "",
            fromDate: "",
            toDate: ""
        });
        setEmp([]);
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl'>
            <Heading headingText="Deduction Report" />
            <div className='py-4'>
                <form className="lg:w-[60%] md:w-[100%] sm:w-[100%]" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 gap-4 m-2">
                        {/* Department Dropdown */}
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">
                                Department <span className="text-red-500">*</span>
                            </label>
                            <select
                                onChange={handleDep}
                                value={inputs.deptId}
                                disabled={isLoadingDepts}
                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">
                                    {isLoadingDepts ? "Loading departments..." : "Select Department"}
                                </option>
                                {dep.map((department) => (
                                    <option key={department.deptId} value={department.deptId}>
                                        {department.depName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Employee Dropdown */}
                        <div>
                            <label className="block text-gray-700 text-sm mb-1">
                                Employee <span className="text-red-500">*</span>
                            </label>
                            <select
                                onChange={handleEmp}
                                value={inputs.empCode}
                                disabled={!inputs.deptId || isLoadingEmps}
                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">
                                    {isLoadingEmps 
                                        ? "Loading employees..." 
                                        : !inputs.deptId 
                                        ? "Select department first" 
                                        : emp.length === 0 
                                        ? "No employees found"
                                        : "Select Employee"}
                                </option>
                                {emp.map((employee) => (
                                    <option key={employee.empCode} value={employee.empCode}>
                                        {employee.empName} ({employee.empCode})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* From Date */}
                            <div>
                                <label className="block text-gray-700 text-sm mb-1">
                                    From Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="fromDate"
                                    value={inputs.fromDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* To Date */}
                            <div>
                                <label className="block text-gray-700 text-sm mb-1">
                                    To Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="toDate"
                                    value={inputs.toDate}
                                    onChange={handleChange}
                                    min={inputs.fromDate} // Prevent selecting a date before fromDate
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-start w-full space-x-4 my-4 p-2">
                        <button
                            className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            type="button"
                            onClick={handleReset}
                            disabled={isPrinting}
                        >
                            Reset
                        </button>
                        <button
                            className={`text-sm px-6 py-2 rounded-lg transition-colors duration-200 ${
                                isPrinting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700'
                            } text-white`}
                            type="button"
                            onClick={handlePrint}
                            disabled={isPrinting}
                        >
                            {isPrinting ? 'Generating...' : 'Print Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default withAuth(Deduction, ["SUPERADMIN", "ADMIN", "DOCTOR"]);