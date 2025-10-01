// 'use client'
// import LayoutForm from "../../layouts/layoutForm";
// import Heading from "../../(components)/heding";
// import { FaPencilAlt } from "react-icons/fa";
// import apiClient from "@/app/config";
// import withAuth from '@/app/(components)/WithAuth';
// import { useState, useEffect } from "react";


// export function EmployeeAttendance() {
//     return (
//         <LayoutForm>
//             <EmployeeAttendanceform />
//         </LayoutForm>
//     );
// }

// const EmployeeAttendanceform = () => {

//     const [isEdit, setIsEdit] = useState(false);
//     const [data, setData] = useState([]);
//     const [emp, setEmp] = useState([]);
//     const [dep, setDep] = useState([]);
//     const [shift, setShift] = useState([]);
//     const [inputs, setInputs] = useState({
//         attancanceId: 0,
//         empCode: 0,
//         empName: "",
//         date: "",
//         timeCome: "",
//         timeGo: "",
//         deptId: 0,
//         depName: "",
//         shiftId: 0,
//         shiftName: "",
//         dueToEmergency: ""
//     });

//     const fetchApi = async () => {
//         try {
//             const response = await apiClient.get(`attendance/getAttendance`);
//             setData(response.data.data);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     useEffect(() => {
//         fetchApi();
//     }, []);

//     const handleSave = async (e) => {
//         e.preventDefault();
//         try {
//             let response;
//             if (isEdit) {
//                 response = await apiClient.put(`attendance/updateAttendance`, inputs);
//                 if (response.status === 200) {
//                     toast.error("Data updated successfully");
//                     setIsEdit(false);
//                 } else {
//                     toast.error(`Update failed! Status: ${response.status}`);
//                 }
//             } else {
//                 response = await apiClient.post("attendance/saveAttendance", inputs);
//                 if (response.status === 200) {
//                     toast.error("Data saved successfully");
//                 } else {
//                     toast.error(`Save failed! Status: ${response.status}`);
//                 }
//             }

//             fetchApi();
//             setInputs({
//                 attancanceId: 0,
//                 empCode: 0,
//                 empName: "",
//                 date: "",
//                 timeCome: "",
//                 timeGo: "",
//                 deptId: 0,
//                 depName: "",
//                 shiftId: 0,
//                 shiftName: "",
//                 dueToEmergency: ""
//             });
//         } catch (error) {
//             console.error("Error handling save operation:", error);
//             toast.error(`An error occurred: ${error.response ? error.response.data : error.message}`);
//         }
//     };

//     const handleUpdate = (attancance) => {
//         setInputs({
//             attancanceId: attancance.attancanceId,
//             empCode: attancance.empCode,
//             empName: attancance.empName,
//             date: attancance.date,
//             timeCome: attancance.timeCome,
//             timeGo: attancance.timeGo,
//             deptId: attancance.deptId,
//             depName: attancance.depName,
//             shiftId: attancance.shiftId,
//             shiftName: attancance.shiftName,
//             dueToEmergency: attancance.dueToEmergency
//         });
//         setIsEdit(true);
//     };

//     const fetchDep = async () => {
//         try {
//             const response = await apiClient.get(`dep/getAllDepartment`);
//             console.log(response.data.data);
//             setDep(response.data.data);
//         } catch (error) {
//             console.error("Error fetching data", error);
//         }
//     };


//     const handleDep = (e) => {
//         console.log(e.target.value);
//         setInputs({ ...inputs, deptId: e.target.value })
//     };

//     const fetchEmp = async () => {
//         try {
//             const response = await apiClient.get(`emp/getAllEmployee`);
//             console.log(response.data.data);
//             setEmp(response.data.data);
//         } catch (error) {
//             console.error("Error fetching data", error);
//         }
//     };


//     const handleEmp = (e) => {
//         console.log(e.target.value);
//         setInputs({ ...inputs, empCode: e.target.value })
//     };

//     const fetchshift = async () => {
//         try {
//             const response = await apiClient.get(`shiftMaster/getAllDetailsghiftMaster`);
//             console.log(response.data.data);
//             setShift(response.data.data);
//         } catch (error) {
//             console.error("Error fetching data", error);
//         }
//     };


//     const handleshift = (e) => {
//         console.log(e.target.value);
//         setInputs({ ...inputs, shiftId: e.target.value })
//     };



//     useEffect(() => {
//         fetchEmp();
//         fetchDep();
//         fetchshift();
//     }, []);


//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setInputs(prevInputs => ({
//             ...prevInputs,
//             [name]: value
//         }));
//     };

//     return (
//         <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
//             <Heading headingText="Employee Attendance" />
//             <div className='py-4'>
//                 <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
//                     <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 ">
//                         <div>
//                             <label className="block font-semibold text-sm">List Employee</label>
//                             <select
//                                 readOnly={isEdit}
//                                 onChange={isEdit ? undefined : handleEmp}
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm">
//                                 <option>select Employee</option>
//                                 {emp?.map((Emp) => (
//                                     <option value={Emp.empCode}>{Emp.empName}</option>
//                                 ))}
//                             </select>

//                         </div>
//                         <div>
//                             <label className="block font-semibold text-sm">List Department</label>
//                             <select
//                                 readOnly={isEdit}
//                                 onChange={isEdit ? undefined : handleDep}
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm">
//                                 <option>select Department</option>
//                                 {dep?.map((dep) => (
//                                     <option value={dep.deptId}>{dep.depName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div >
//                             <label className="block font-semibold text-sm">Shift</label>
//                             <select
//                                 readOnly={isEdit}
//                                 onChange={isEdit ? undefined : handleshift}
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm">
//                                 <option>select shift</option>
//                                 {shift?.map((shift) => (
//                                     <option value={shift.shiftId}>{shift.shiftName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="block font-semibold text-sm">Date </label>
//                             <input
//                                 type="date"
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
//                                 name="date"
//                                 readOnly={isEdit}
//                                 onChange={isEdit ? undefined : handleChange}
//                                 value={inputs.date}
//                             />
//                         </div>


//                         <div>
//                             <label className="block font-semibold text-sm">In-Time </label>
//                             <input
//                                 type="time"
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
//                                 name="timeCome"
//                                 value={inputs.timeCome}
//                                 readOnly={isEdit}
//                                 onChange={isEdit ? undefined : handleChange}
//                             />
//                         </div>

//                         <div>
//                             <label className="block font-semibold text-sm">Out-Time</label>
//                             <input
//                                 type="time"
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
//                                 name="timeGo"
//                                 value={inputs.timeGo}
//                                 // onChange={handleChange}
//                                 readOnly={!isEdit}
//                                 onChange={!isEdit ? undefined : handleChange}
//                             />
//                         </div>
//                     </div>
//                 </form>
//                 <div className="flex justify-start w-full space-x-4 p-2 my-4">
//                     <button
//                         className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900"
//                         type="button"

//                     >
//                         Refresh
//                     </button>
//                     <button
//                         className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900"
//                         onClick={handleSave}
//                         type="submit"
//                     >
//                         {isEdit ? "Update" : "Save"}
//                     </button>
//                 </div>
//             </div>

//             <div className="bg-white p-2 my-2 rounded-lg shadow-md">
//                 <div className="overflow-x-auto">
//                     <div
//                         className="w-full"
//                         style={{ maxHeight: "400px", overflowY: "auto" }}
//                     >
//                         <table className="table-auto w-full border border-collapse shadow">
//                             <thead>
//                                 <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Code</th>

//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Name</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Department</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">In-Time</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Out-Time</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {Array.isArray(data) && data.length > 0 ? (
//                                     data.map((transaction, index) => (
//                                         <tr key={index} className="border border-gray-200 text-center">
//                                             <td className="px-4 py-3 border border-gray-200 flex space-x-2">

//                                                 <button
//                                                     className="text-blue-500 hover:text-blue-700 flex items-center"
//                                                     onClick={() => handleUpdate(transaction)}
//                                                 >
//                                                     <FaPencilAlt className="mr-1" />
//                                                 </button>
//                                             </td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.attancanceId}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.empName}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.depName}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.timeCome}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.timeGo}</td>



//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="7" className="text-center">No data available</td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//             <p className="text-red-600 font-medium">Note: A master could not be deleted if used anywhere</p>
//         </div>
//     );
// };
// export default withAuth(EmployeeAttendance, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])


'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { useFormik } from 'formik';
import { toast } from 'sonner';
import * as Yup from 'yup';

export function EmployeeAttendance() {
    return (
        <LayoutForm>
            <EmployeeAttendanceform />
        </LayoutForm>
    );
}

const EmployeeAttendanceform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [emp, setEmp] = useState([]);
    const [dep, setDep] = useState([]);
    const [shift, setShift] = useState([]);
    
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`attendance/getTodayAttandance`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const fetchDep = async () => {
        try {
            const response = await apiClient.get(`dep/getAllDepartment`);
            setDep(response.data.data);
        } catch (error) {
            console.error("Error fetching departments", error);
        }
    };

    const fetchEmp = async () => {
        try {
            const response = await apiClient.get(`emp/getAllEmployee`);
            setEmp(response.data.data);
        } catch (error) {
            console.error("Error fetching employees", error);
        }
    };

    const fetchShift = async () => {
        try {
            const response = await apiClient.get(`shiftMaster/getAllDetailsghiftMaster`);
            setShift(response.data.data);
        } catch (error) {
            console.error("Error fetching shifts", error);
        }
    };

    useEffect(() => {
        fetchEmp();
        fetchDep();
        fetchShift();
    }, []);

    // Formik setup
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
                    response = await apiClient.put(`attendance/updateAttendance`, values);
                    if (response.status === 200) {
                        toast.success("Data updated successfully");
                        setIsEdit(false);
                    } else {
                        toast.error(`Update failed! Status: ${response.status}`);
                    }
                } else {
                    response = await apiClient.post("attendance/saveAttendance", values);
                    if (response.status === 200) {
                        toast.success("Data saved successfully");
                    } else {
                        toast.error(`Save failed! Status: ${response.status}`);
                    }
                }
                fetchApi();
                formik.resetForm();
            } catch (error) {
                console.error("Error handling save operation:", error);
                toast.error(`An error occurred: ${error.response ? error.response.data : error.message}`);
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
            dueToEmergency: attendance.dueToEmergency
        });
        setIsEdit(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        formik.setFieldValue(name, value);
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl'>
            <Heading headingText="Employee Attendance" />
            <div className='py-4'>
                <form onSubmit={formik.handleSubmit} className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm">List Employee</label>
                            <select
                                name="empCode"
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                value={formik.values.empCode}
                            >
                                <option value="">Select Employee</option>
                                {emp?.map((Emp) => (
                                    <option key={Emp.empCode} value={Emp.empCode}>{Emp.empName}</option>
                                ))}
                            </select>
                            {formik.touched.empCode && formik.errors.empCode && (
                                <div className="text-red-600 text-sm">{formik.errors.empCode}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm">List Department</label>
                            <select
                                name="deptId"
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                value={formik.values.deptId}
                            >
                                <option value="">Select Department</option>
                                {dep?.map((dep) => (
                                    <option key={dep.deptId} value={dep.deptId}>{dep.depName}</option>
                                ))}
                            </select>
                            {formik.touched.deptId && formik.errors.deptId && (
                                <div className="text-red-600 text-sm">{formik.errors.deptId}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm">Shift</label>
                            <select
                                name="shiftId"
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                value={formik.values.shiftId}
                            >
                                <option value="">Select Shift</option>
                                {shift?.map((shift) => (
                                    <option key={shift.shiftId} value={shift.shiftId}>{shift.shiftName}</option>
                                ))}
                            </select>
                            {formik.touched.shiftId && formik.errors.shiftId && (
                                <div className="text-red-600 text-sm">{formik.errors.shiftId}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm">Date</label>
                            <input
                                type="date"
                                name="date"
                                onChange={handleChange}
                                value={formik.values.date}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                            />
                            {formik.touched.date && formik.errors.date && (
                                <div className="text-red-600 text-sm">{formik.errors.date}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm">In-Time</label>
                            <input
                                type="time"
                                name="timeCome"
                                onChange={handleChange}
                                value={formik.values.timeCome}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                            />
                            {formik.touched.timeCome && formik.errors.timeCome && (
                                <div className="text-red-600 text-sm">{formik.errors.timeCome}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm">Out-Time</label>
                            <input
                                type="time"
                                name="timeGo"
                                onChange={handleChange}
                                value={formik.values.timeGo}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                            />
                            {formik.touched.timeGo && formik.errors.timeGo && (
                                <div className="text-red-600 text-sm">{formik.errors.timeGo}</div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2 my-4">
                        <button
                            type="button"
                            className="bg-gray-600 text-sm text-white px-6 py-2 rounded-lg hover:bg-gray-900"
                            onClick={fetchApi}
                        >
                            Refresh
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-green-900"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-white p-2 my-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border border-collapse shadow">
                        <thead>
                            <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Code</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Name</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Department</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">In-Time</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Out-Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(data) && data.length > 0 ? (
                                data?.map((transaction, index) => (
                                    <tr key={index} className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 flex items-center"
                                                onClick={() => handleUpdate(transaction)}
                                            >
                                                <FaPencilAlt className="mr-1" />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 border border-gray-200">{transaction.attancanceId}</td>
                                        <td className="px-4 py-3 border border-gray-200">{transaction.empName}</td>
                                        <td className="px-4 py-3 border border-gray-200">{transaction.depName}</td>
                                        <td className="px-4 py-3 border border-gray-200">{transaction.timeCome}</td>
                                        <td className="px-4 py-3 border border-gray-200">{transaction.timeGo}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default withAuth(EmployeeAttendance, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
