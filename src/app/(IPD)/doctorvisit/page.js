
"use client"
import LayoutForm from "../../layouts/layoutForm";
import Heading from '../../(components)/heding';
import PatientBasicDetails from "../../(components)/PatientBasicDetails";
import { useState, useEffect } from "react";
import axios from "axios";
import { MdDeleteOutline } from "react-icons/md";
import { BaseUrl } from "../../config";
import { GrUpdate } from "react-icons/gr";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import Swal from "sweetalert2";

export default function Doctorvisit() {
    return (
        <LayoutForm>
            <Heading headingText={"Doctor Visit"} />
            <PatientBasicDetails PlaceholderText={'Search by IPD ID'} />
            <DoctorVisitform />
        </LayoutForm>
    );
}


const DoctorVisitform = () => {
    const selectedIPD = useSelector((data) => data.ipd.ipd);
    const [data, setdata] = useState([])//table 
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
    const [inputs, setinputs] = useState({
        "visitId": 0,
        "ipdNo": "",
        "patId": 0,
        "drId": 0,
        "visitDate": "",
        "docName": "",
        "department": "",
        "visitTime": ""
    })

    // Fetch departments on component mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(BaseUrl + 'dep/getAllDepartment');
                setDepartments(response.data.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
    }, []);


    // Fetch doctors when selected department changes
    useEffect(() => {
        const fetchDoctors = async () => {
            if (selectedDepartmentId) {
                try {
                    const response = await axios.get(`${BaseUrl}doc/getAllDocByDeptId?deptId=${selectedDepartmentId}`);
                    setDoctors(response.data.data);
                } catch (error) {
                    console.error('Error fetching doctors:', error);
                }
            } else {
                setDoctors([]);  // Clear doctors if no department is selected
            }
        };

        fetchDoctors();
    }, [selectedDepartmentId]);


    //post the data
    const handleDoctorVisit = async (e) => {
        e.preventDefault();
        let ipdNo = "";
        let patId = "";
        if (Array.isArray(selectedIPD)) {
            selectedIPD.forEach((data) => {
                ipdNo = data.name.ipdNo;
                patId = data.name.patId;
            });
        } else {
            console.error("Selected IPD is not an array or is undefined.");
        }

        const url = `${BaseUrl}ipdDoctorVisit/saveIpdDoctorVisit`;

        try {
            console.log("IPD=" + ipdNo);
            const updatedInputs = { ...inputs, ipdId: ipdNo, patId: patId };

            const response = await axios.post(url, updatedInputs);
            if (response.status === 200) {
                Swal.fire({ text: "Data is saved successfully", icon: "success" })
                fetchVisitDetails(); // Refresh the data after save/update
                resetForm(); // Reset form to default
            } else {
                alert("Failed! Please try again");
            }
        } catch (error) {
            alert("Failed! Please try again");
        }
    };


    const fetchVisitDetails = async () => {
        try {
            const response = await axios.get(`${BaseUrl}ipdDoctorVisit/getdoctorVisitDetails?ipdNo=${selectedIPD[0].name.ipdNo}`);
            if (response.data.status == 200) {
                setdata(response.data.data);
            }
        }
        catch {
        }
    };


    const handleDelete = async (code) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this data?");
        if (!confirmDelete)
            return;
        try {
            const response = await axios.delete(`${BaseUrl}ipdDoctorVisit/deleteDoctorVisitDetail?visitId=${code}`);
            if (response.status === 200) {
                alert("Data is deleted successfully");
                resetForm();
                fetchApi();
            } else {
                alert("Failed to delete! Please try again");
            }
        } catch (err) {
            alert("Failed to delete! Please try again");
        }
    };



    //update
    const handleUpdate = (visit) => {
        setinputs({
            visitId: visit.visitId,
            ipdNo: visit.ipdNo,
            patId: visit.patId,
            drId: visit.drId,
            visitDate: visit.visitDate,
            docName: visit.docName,
            department: visit.department,
            visitTime: visit.visitTime
        });
    };


    // const handleDoctorrvisit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         let response;
    //         if (inputs.visitId) {
    //             // If visitId is present, update the existing visit
    //             response = await axios.put(`${BaseUrl}ipdDoctorVisit/updateIpdDoctorVisit`, inputs);
    //         } else {
    //             // If visitId is not present, create a new visit
    //             response = await axios.post(`${BaseUrl}ipdDoctorVisit/saveIpdDoctorVisit`, inputs);
    //         }

    //         if (response.status === 200) {
    //             Swal.fire({ text: "Data saved successfully", icon: "success" });
    //             fetchApi();
    //             resetForm(); // Optional: Reset the form after submission
    //         } else {
    //             alert("Failed! Please try again");
    //         }
    //     } catch (error) {
    //         alert("An error occurred. Please try again.");
    //         console.error("Save/Update error:", error);
    //     }
    // };

    // Handle department selection
    const handleDepartmentSelect = (event) => {
        const selectedDepartment = departments.find(dept => dept.deptId === parseInt(event.target.value));
        setSelectedDepartmentId(event.target.value);
        setinputs({
            ...inputs,
            department: selectedDepartment ? selectedDepartment.depName : "",
            drId: 0, // Reset doctor selection
            docName: "",
        });
    };

    // Handle doctor selection
    const handleDoctorSelect = (event) => {
        const selectedDoctor = doctors.find(doc => doc.drId === parseInt(event.target.value));
        setinputs({
            ...inputs,
            drId: selectedDoctor ? selectedDoctor.drId : 0,
            docName: selectedDoctor ? selectedDoctor.drName : "",
        });
    };


    return (
        <>
            <div className='border-solid rounded-lg'>
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 m-2">
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Department</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <select
                                    className="w-full px-4 py-3 border shadow-md rounded-lg focus:outline-none"
                                    onChange={handleDepartmentSelect}
                                    value={selectedDepartmentId} // Use selectedDepartmentId to match the department ID
                                >
                                    <option value="">Select a Department</option>
                                    {departments.map((department) => (
                                        <option key={department.deptId} value={department.deptId}>
                                            {department.depName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Doctor</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <select
                                    className="w-full px-4 py-3 border shadow-md rounded-lg focus:outline-none"
                                    onChange={handleDoctorSelect}
                                    value={inputs.docName} // Ensure this is the correct state to bind
                                    disabled={!selectedDepartmentId} // Disable doctor select if no department is selected
                                >
                                    <option value="">Select a Doctor</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.drId} value={doctor.drId}>
                                            {doctor.drName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Visit Date</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border shadow-md rounded-lg focus:outline-none"
                                    onChange={(e) => setinputs({ ...inputs, visitDate: e.target.value })} value={inputs.visitDate}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Visit Time</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input
                                    type="time"
                                    className="w-full px-4 py-2 border shadow-md rounded-lg focus:outline-none"
                                    onChange={(e) => setinputs({ ...inputs, visitTime: e.target.value })} value={inputs.visitTime}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2">
                        <button
                            type="submit"
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900"
                            onClick={handleDoctorVisit}
                        >
                            Submit

                        </button>
                        <button
                            type="reset"
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-900"

                        >
                            Reset
                        </button>

                    </div>
                </form>
            </div>
            <div className="bg-white p-2 md:p-2 rounded-lg shadow-md mt-3">
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead className="">
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th scope="col" className="px-4 py-2 border border-gray-200 text-sky-500">Visit ID</th>
                                    <th scope="col" className="px-4 py-2 border border-gray-200 text-sky-500">Department</th>
                                    <th scope="col" className="px-4 py-2 border border-gray-200 text-sky-500">Doctor</th>
                                    <th scope="col" className="px-4 py-2 border border-gray-200 text-sky-500">Visit Date</th>
                                    <th scope="col" className="px-4 py-2 border border-gray-200 text-sky-500">Visit Time</th>
                                    <th scope="col" className="px-4 py-2 border border-gray-200 text-sky-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((visit, index) => (
                                    <tr key={index} className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200">{visit.visitId}</td>
                                        <td className="px-4 py-3 border border-gray-200">{visit.department}</td>
                                        <td className="px-4 py-3 border border-gray-200">{visit.docName}</td>
                                        <td className="px-4 py-3 border border-gray-200">{visit.visitDate}</td>
                                        <td className="px-4 py-3 border border-gray-200">{visit.visitTime}</td>
                                        <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 flex items-center"
                                                onClick={() => handleUpdate(visit)}
                                            >
                                                <GrUpdate className="mr-1" />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700 flex items-center"
                                                size={30}
                                                onClick={() => handleDelete(visit.visitId)}
                                            >
                                                <MdDeleteOutline className="mr-1" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};
