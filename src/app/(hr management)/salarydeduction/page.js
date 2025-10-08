'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { toast } from 'sonner';


export function Deduction() {
    return (
        <LayoutForm>
            <Deductionform />
        </LayoutForm>
    );
}

const Deductionform = () => {

    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [emp, setEmp] = useState([]);
    const [dep, setDep] = useState([]);
    // const [shift, setShift] = useState([]);
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
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (isEdit) {
                response = await apiClient.put(`salary/updateData`, inputs);
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false);
                } else {
                    toast.error(`Update failed! Status: ${response.status}`);
                }
            } else {
                response = await apiClient.post("salary/saveSalary", inputs);
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error(`Save failed! Status: ${response.status}`);
                }
            }

            fetchApi();
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
        } catch (error) {
            console.error("Error handling save operation:", error);
            toast.error(`An error occurred: ${error.response ? error.response.data : error.message}`);
        }
    };

    const handleUpdate = (salary) => {
        setInputs({
            salaryId: salary.salaryId,
            depName: salary.depName,
            empName: salary.empName,
            deptId: salary.deptId,
            empCode: salary.empCode,
            headName: salary.headName,
            amount: salary.amount,
            forMonth: salary.forMonth,
            date: salary.date
        });
        setIsEdit(true);
    };



    const fetchEmp = async () => {
        try {
            const response = await apiClient.get(`emp/getAllEmployee`);
            console.log(response.data.data);
            setEmp(response.data.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };


    const handleEmp = (e) => {
        console.log(e.target.value);
        setInputs({ ...inputs, empCode: e.target.value })
    };

    const fetchDep = async () => {
        try {
            const response = await apiClient.get(`dep/getAllDepartment`);
            console.log(response.data.data);
            setDep(response.data.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };


    const handleDep = (e) => {
        console.log(e.target.value);
        setInputs({ ...inputs, deptId: e.target.value })
    };

    // const fetchshift = async () => {
    //     try {
    //         const response = await apiClient.get(`shiftMaster/getAllDetailsghiftMaster`);
    //         console.log(response.data.data);
    //         setShift(response.data.data);
    //     } catch (error) {
    //         console.error("Error fetching data", error);
    //     }
    // };


    // const handleshift = (e) => {
    //     console.log(e.target.value);
    //     setInputs({ ...inputs, shiftId: e.target.value })
    // };



    useEffect(() => {
        fetchEmp();
        fetchDep();
    
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }));
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
              <Heading headingText="Salary Add/Deduction" />
            <div className='py-4'>
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 m-2 ">
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold text-sm">List Employee</label>
                            </div>
                            <div className="w-full sm:w-[70%]">
                                <select onChange={handleEmp}
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none">
                                    <option>select Employee</option>
                                    {emp?.map((Emp,index) => (
                                        <option key={index} value={Emp.empCode}>{Emp.empName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold text-sm">List Department</label>
                            </div>
                            <div className="w-full sm:w-[70%]">
                                <select onChange={handleDep}
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none">
                                    <option>select Department</option>
                                    {dep?.map((dep,index) => (
                                        <option key={index} value={dep.deptId}>{dep.depName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold text-sm">Head Name</label>
                            </div>
                            <div className="w-full sm:w-[70%]">
                                <select
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                    name="headName"
                                    onChange={handleChange}
                                    value={inputs.headName}>
                                    <option value="">Select an option</option>
                                    <option value="Advance">Advance</option>
                                    <option value="Incentive">Incentive</option>
                                    <option value="Panalty">Panalty</option>
                                    <option value="PF">PF</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold text-sm">	+/- For Month </label>
                            </div>
                            <div className="w-full sm:w-[70%]">
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                    name="forMonth"
                                    value={inputs.forMonth}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>


                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold text-sm">Amount </label>
                            </div>
                            <div className="w-full sm:w-[70%]">
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                    name="amount"
                                    value={inputs.amount}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                     

                    </div>
                </form>
                <div className="flex justify-start w-full space-x-4 my-4 p-2">
                    <button
                        className="bg-gray-600 text-white px-6 text-sm py-2 rounded-lg hover:bg-gray-900"
                        type="button"

                    >
                        Refresh
                    </button>
                    <button
                        className="bg-green-600 text-white px-4 text-sm py-2 rounded-lg hover:bg-green-900"
                        onClick={handleSave}
                        type="submit"
                    >
                        {isEdit ? "Update" : "Save"}
                    </button>
                </div>
            </div>

            <div className="bg-white p-2 my-2 md:p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Code</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Department</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">head Name</th>
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
            <p className="text-red-600 font-medium">Note: A master could not be deleted if used anywhere</p>
        </div>
    );
};
export default withAuth(Deduction, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])


