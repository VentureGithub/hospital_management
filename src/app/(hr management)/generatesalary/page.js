'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { toast } from 'sonner';

export function GenerateSalary() {
    return (
        <LayoutForm>
            <GenerateSalaryform />
        </LayoutForm>
    );
}

const GenerateSalaryform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [emp, setEmp] = useState([]);
    const [dep, setDep] = useState([]);
    const [inputs, setInputs] = useState({
        genrateId: 0,
        empCode: 0,
        deptId: 0,
        salaryDate: "",
        month: "",
        empName: "",
        basicSalary: 0,
        depName: "",
        incrementId: 0,
        extraSalary: 0,
        incremtntAmnt: 0
    });

    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`salary/getSalaryAllEmployee`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
        fetchEmp();
        // fetchDep();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (isEdit) {
                response = await apiClient.put(`genrateSalary/updateData`, inputs);
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false);
                } else {
                    toast.error(`Update failed! Status: ${response.status}`);
                }
            } else {
                response = await apiClient.post("genrateSalary/create", inputs);
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error(`Save failed! Status: ${response.status}`);
                }
            }
            fetchApi();
            resetInputs();
        } catch (error) {
            console.error("Error handling save operation:", error);
            toast.error(`An error occurred: ${error.response ? error.response.data : error.message}`);
        }
    };

    const resetInputs = () => {
        setInputs({
            genrateId: 0,
            empCode: 0,
            deptId: 0,
            salaryDate: "",
            month: "",
            empName: "",
            basicSalary: 0,
            depName: "",
            incrementId: 0,
            extraSalary: 0,
            incremtntAmnt: 0
        });
    };

    const handleUpdate = (generate) => {
        setInputs({
            genrateId: generate.genrateId,
            empCode: generate.empCode,
            deptId: generate.deptId,
            salaryDate: generate.salaryDate,
            month: generate.month,
            empName: generate.empName,
            basicSalary: generate.basicSalary,
            depName: generate.depName,
            incrementId: generate.incrementId,
            extraSalary: generate.extraSalary,
            incremtntAmnt: generate.incremtntAmnt
        });
        setIsEdit(true);
    };

    useEffect(() => {
        const fetchDep = async () => {
            try {
                const response = await apiClient.get(`dep/getAllDepartment`);
                setDep(response.data.data);
            } catch (error) {
                console.error("Error fetching departments", error);
            }
        };
        fetchDep();
    }, []);

    // Fetch employees based on department ID
    const fetchEmp = async (deptId) => {
        try {
            const response = await apiClient.get(`emp/getEmployee/byDepId?deptId=${deptId}`);
            if (response.data.data) {
                setEmp(response.data.data); // Ensure data is set correctly
            } else {
                setEmp([]); // Fallback to empty if no data
            }
        } catch (error) {
            console.error("Error fetching employees", error);
            setEmp([]); // Handle fetch failure by clearing the list
        }
    };
    

    // Handle department selection
    const handleDep = (e) => {
        const selectedDeptId = e.target.value;
        setInputs((prev) => ({ ...prev, deptId: selectedDeptId, empCode: "" })); // Clear empCode
        if (selectedDeptId) {
            fetchEmp(selectedDeptId); // Fetch employees for the selected department
        } else {
            setEmp([]); // Clear employees if no department is selected
        }
    };
    

    // Handle employee selection
    const handleEmp = (e) => {
        const selectedEmpCode = e.target.value;
        setInputs((prev) => ({ ...prev, empCode: selectedEmpCode }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }));
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
        <Heading headingText="Generate Salary" />
            <div className='py-4'>
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 m-2 ">
                        <div >
                                <label className="block text-sm">List Department</label>
                                <select
                                    onChange={handleDep}
                                    value={inputs.deptId}
                                    className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
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
                        <div>
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

                        <div >
                                <label className="block text-sm">Month</label>
                                <input
                                    type="month"
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                    name="month"
                                    value={inputs.month}
                                    onChange={handleChange}
                                />
                        </div>
                    </div>
                </form>
                <div className="flex justify-start w-full my-4 space-x-4 p-2">
                    <button
                        className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900"
                        type="button"
                    >
                        Refresh
                    </button>
                    <button
                        className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
                        onClick={handleSave}
                        type="submit"
                    >
                        {isEdit ? "Update" : "Save"}
                    </button>
                </div>
            </div>

            <div className="bg-white p-2 my-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Code</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Department</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Head Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.empCode}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.empName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.depName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.headName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.amount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAuth(GenerateSalary, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
