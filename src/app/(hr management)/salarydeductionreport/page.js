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
    const [inputs, setInputs] = useState({
        deptId: "",
        empCode: "",
        fromDate: "",
        toDate: ""
    });

    // Fetch all departments
    const fetchDep = async () => {
        try {
            const response = await apiClient.get(`dep/getAllDepartment`);
            setDep(response.data.data || []);
        } catch (error) {
            console.error("Error fetching departments", error);
        }
    };

    // Handle department selection and fetch employees by department
    const handleDep = async (e) => {
        const selectedDeptId = e.target.value;
        setInputs((prev) => ({ ...prev, deptId: selectedDeptId }));

        if (selectedDeptId) {
            try {
                const response = await apiClient.get(
                    `emp/getEmployee/byDepId?deptId=${selectedDeptId}`
                );
                setEmp(response.data.data || []);
            } catch (error) {
                console.error("Error fetching employees", error);
            }
        } else {
            setEmp([]); // Clear employee list if no department is selected
        }
    };

    // Handle employee selection
    const handleEmp = (e) => {
        setInputs((prev) => ({ ...prev, empCode: e.target.value }));
    };

    // Handle change for all inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({ ...prev, [name]: value }));
    };

    // Fetch departments on component mount
    useEffect(() => {
        fetchDep();
    }, []);

    // Handle Print Button Click
    const handlePrint = async () => {
        const { deptId, empCode, fromDate, toDate } = inputs;

        // Validate required fields
        if (!deptId || !empCode || !fromDate || !toDate) {
            toast.error("Please fill out all fields!");
            return;
        }
    
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
        } catch (error) {
            console.error("Error generating report", error);
            toast.error("Failed to generate report. Please try again.");
        }
    }
    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
        <Heading headingText="Journal Voucher Report" />
            <div className='py-4'>
                <form className="lg:w-[60%] md:w-[100%] sm:w-[100%]">
                    <div className="grid grid-cols-1 gap-2 m-2">
                        {/* Department Dropdown */}
                        <div >
                                <label className="block  text-sm">Department</label>
                                <select
                                    onChange={handleDep}
                                    value={inputs.deptId}
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                >
                                    <option value="">Select Department</option>
                                    {dep.map((department) => (
                                        <option key={department.deptId} value={department.deptId}>
                                            {department.depName}
                                        </option>
                                    ))}
                                </select>
                        </div>

                        {/* Employee Dropdown */}
                        <div >
                                <label className="block text-sm">List Employee</label>
                                <select
                                    onChange={handleEmp}
                                    value={inputs.empCode}
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                >
                                    <option value="">Select Employee</option>
                                    {emp.map((employee) => (
                                        <option key={employee.empCode} value={employee.empCode}>
                                            {employee.empName}
                                        </option>
                                    ))}
                                </select>
                        </div>

                        {/* From Date */}
                        <div>
                                <label className="block text-sm">From</label>
                                <input
                                    type="date"
                                    name="fromDate"
                                    value={inputs.fromDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                />
                        </div>

                        {/* To Date */}
                        <div>
                                <label className="block text-sm">To</label>
                                <input
                                    type="date"
                                    name="toDate"
                                    value={inputs.toDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                />
                        </div>
                    </div>
                </form>

                {/* Submit Button */}
                <div className="flex justify-start w-full space-x-4 my-2 p-2">
                    <button
                        className="bg-green-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-green-900"
                        type="button"
                        onClick={handlePrint}
                    >
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Deduction, ["SUPERADMIN", "ADMIN", "DOCTOR"]);
