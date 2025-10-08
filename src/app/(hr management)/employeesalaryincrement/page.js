'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';
import { useState } from "react";

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
        incremtntAmnt: 0
    });

    const [emps, setEmps] = useState({});
    const [searchId, setSearchId] = useState("");

    const fetchEmps = async (empCode) => {
        try {
            const response = await apiClient.get(`emp/getData/byId?empCode=${empCode}`);
            if (response.status === 200) {
                const employeeData = response.data.data || {};
                setEmps(employeeData);

                // Fill inputs with the fetched employee data
                setInputs((prevInputs) => ({
                    ...prevInputs,
                    empCode: employeeData.empCode || "",
                    empName: employeeData.empName || "",
                    basicSalary: employeeData.basicSalary || 0, // Fill in the basic salary
                    // Add other fields as necessary
                }));

                console.log(employeeData.gender); // Assuming this line is still relevant
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    const handleSearch = () => {
        fetchEmps(searchId);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }));
    };

    const fetchApi = async () => {
        try {
            const response = await apiClient.get("salaryIncrement/getData"); // Adjust endpoint
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (isEdit) {
                response = await apiClient.put(`salaryIncrement/updateData`, inputs);
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false);
                } else {
                    toast.error(`Update failed! Status: ${ response.status }`);
                }
            } else {
                response = await apiClient.post("salaryIncrement/saveIncrementData", inputs);
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error(`Save failed! Status: ${ response.status }`);
                }
            }

            // Fetch updated data and reset inputs
            fetchApi();
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
                basicSalary: 0,
                extraSalary: 0,
                incremtntAmnt: 0
            });
        } catch (error) {
            console.error("Error handling save operation:", error);
            toast.error(`An error occurred: ${ error.response ? error.response.data : error.message }`);
        }
    };

    const handleUpdate = (salaryincrement) => {
        setInputs({
            incrementId: salaryincrement.incrementId,
            empCode: salaryincrement.empCode,
            empName: salaryincrement.empName,
            salaryIncDate: salaryincrement.salaryIncDate,
            depName: salaryincrement.depName,
            designationName: salaryincrement.designationName,
            joiningDate: salaryincrement.joiningDate,
            dateOfBirth: salaryincrement.dateOfBirth,
            jobType: salaryincrement.jobType,
            remark: salaryincrement.remark,
            phnNo: salaryincrement.phnNo,
            basicSalary: salaryincrement.basicSalary,
            extraSalary: salaryincrement.extraSalary,
            incremtntAmnt: salaryincrement.incremtntAmnt
        });
        setIsEdit(true);
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
               <Heading headingText="Employee Salary Increment" />
            {/* Search Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <div className="flex space-x-4 w-full sm:w-auto">
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                        placeholder="Employee Id"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-900 text-sm"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Employee Details Section */}
            <div className="mt-6 bg-white p-6 rounded-md shadow-md border">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <p><strong>Employee Code:</strong> {emps.empCode || "N/A"}</p>
                    <p><strong>Employee Name:</strong> {emps.empName || "N/A"}</p>
                    <p><strong>Designation:</strong> {emps.designationName || "N/A"}</p>
                    <p><strong>Department:</strong> {emps.depName || "N/A"}</p>
                    <p><strong>Join Date:</strong> {emps.joiningDate || "N/A"}</p>
                    <p><strong>Job Type:</strong> {emps.jobType || "N/A"}</p>
                    <p><strong>Mobile No:</strong> {emps.phnNo || "N/A"}</p>
                    <p><strong>Date of Birth:</strong> {emps.dateOfBirth || "N/A"}</p>
                </div>
            </div>

            {/* Increment/Promotion Details Section */}
            <h3 className="text-lg font-semibold text-blue-500 p-2 mt-4">Increment or Promotion Detail</h3>
            <form onSubmit={handleSave}>
                <div className="bg-white p-6 rounded-md shadow-md border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 ">Increment Date</label>
                        <input
                            type="date"
                            name="salaryIncDate"
                            value={inputs.salaryIncDate}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Remark</label>
                        <input
                            type="text"
                            name="remark"
                            value={inputs.remark}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Basic Salary</label>
                        <input
                            type="number"
                            name="basicSalary"
                            value={inputs.basicSalary}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Extra Amount</label>
                        <input
                            type="number"
                            name="extraSalary"
                            value={inputs.extraSalary}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 text-sm border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-start gap-4">
                    <button className="bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-600" type="submit">
                        Save
                    </button>

                    <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600" onClick={() => {
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
                            basicSalary: 0,
                            extraSalary: 0,
                            incremtntAmnt: 0
                        });
                        setEmps({});
                    }}>
                        Refresh
                    </button>
                </div>
            </form>
        </div>
    );
};


export default withAuth(PurchaseInvoice, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
