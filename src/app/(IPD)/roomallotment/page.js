"use client";
import LayoutForm from "../../layouts/layoutForm";
import Heading from '../../(components)/heding';
import { MdAlternateEmail, MdDeleteOutline } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import PatientBasicDetails from "@/app/(components)/PatientBasicDetails";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../config.js";
import  Swal  from "sweetalert2";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";

export default function RoomAllotment() {
    return (
        <LayoutForm>
            <Heading headingText={"Room Allotment"} />
            <PatientBasicDetails PatientBasicDetails={'Search by IPD ID'} />
            <RoomAllotmentform />
        </LayoutForm>
    );
}


const RoomAllotmentform = () => {
    const selectedIPD = useSelector((data) => data.ipd.ipd);
    const [data, setData] = useState([]);
    const [roomNo, setRoomNo] = useState([]);
    const [bedNo, setBedNo] = useState([]);
    const [selectedRoomAllotment, setSelectedRoomAllotment] = useState("");
    const [inputs, setInputs] = useState({
        allotmentId: 0,
        ipdNo: "",
        patId: 0,
        roomwardId: 0,
        bedNo: 0,
        roomAllotmentDate: "",
        roomAllotmentTime: "",
        roomType: ""
    });


    const handleRoomNoChange = async (event) => {
        try {
            debugger;
            const response = await axios.get(`${baseUrl}patientRoom/getvacantbed?roomNo=${event.target.value}`);
            if (response.data.status == 200) {
                setBedNo(response.data.data);
            }
        }
        catch (error) {
            setBedNo([]);
        }
    };


    //post
    const handleRoomAllotment = async (e) => {
        e.preventDefault();
        try {
            let ipNo = selectedIPD[0].ipd.ipdNo;
            let patId = selectedIPD[0].ipd.patId
            const UpdatedJson = { ...inputs, ipdNo: ipNo, patId: patId };
            const response = await axios.post(`${baseUrl}ipdroomAllotment/saveRoom`, UpdatedJson);
            console.log("response", response.data.data)
            if (response.status === 200) {
                Swal.fire({ text: "Data is saved successfully", icon: "success" });
                fetchApi()
            } else {
                alert("Failed! Please try again");
            }
        } catch (error) {
            alert("Failed! Please try again");
            console.error('Error submitting data:', error);
        }
    };



    //table data
    const fetchApi = async () => {
        const response = await axios.get(`${baseUrl}ipdroomAllotment/getDetailsByIpdNo?ipdNo=${selectedIPD[0].ipd.ipdNo}`)
        setData(response.data.data)
    }




    //update
    const handleUpdate = (AllotmentData) => {
        setInputs({
            allotmentId: AllotmentData.allotmentId,
            ipdId: AllotmentData.ipdId,
            patId: AllotmentData.patId,
            roomwardId: AllotmentData.roomwardId,
            roomType: AllotmentData.roomType,
            bedNo: AllotmentData.bedNo,
            roomAllotmentDate: AllotmentData.roomAllotmentDate,
            roomAllotmentTime: AllotmentData.roomAllotmentTime,
        });
    };

    //Delete
    const handleDelete = async (allotmentId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this data?");
        if (!confirmDelete) return;
        try {
            const response = await axios.delete(`${baseUrl}ipdroomAllotment/deleteAllotedRoom?allotmentId=${allotmentId}`);
            if (response.status === 200) {
                Swal.fire({ text: "Data is deleted successfully", icon: "success" });
                fetchApi() // Refresh the table data after deletion
            } else {
                alert("Failed to delete! Please try again");
            }
        } catch (err) {
            alert("Failed to delete! Please try again");
            console.error("Delete error:", err);
        }
    };

    const handleRoomTypeChange = async (event) => {
        try {
            debugger;
            const response = await axios.get(`${baseUrl}patientRoom/getRoomByRoomType?roomType=${event.target.value}`);
            if (response.data.status == 200) {
                setRoomNo(response.data.data);
            }
        }
        catch (error) {
            setRoomNo([]);
        }
    }




    return (
        <div className='p-6'>
            <div className='p-7'>
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]' >
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 m-2">
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Room Type</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <select className="w-full px-4 py-3 border rounded-lg focus:outline-none shadow-md" onChange={handleRoomTypeChange}>
                                    <option>AC</option>
                                    <option>Non-AC</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Room No.</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <select
                                    className="w-full px-4 py-3 border rounded-lg focus:outline-none shadow-md"
                                    onChange={handleRoomNoChange}
                                >
                                    <option value="">Select Room No.</option>
                                    {roomNo.map(data => (
                                        <option key={data.roomwardId} value={data.roomwardId}>
                                            {data.roomNo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>





                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Bed No</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <select className="w-full px-4 py-3 border rounded-lg focus:outline-none shadow-md" >
                                    <option value="">Select Bed No.</option>
                                    {bedNo.map(data => (
                                        <option key={data.roomwardId} value={data.roomwardId}>
                                            {data.roomNo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Date</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <DatePicker
                                    selected={inputs.roomAllotmentDate}
                                    onChange={date => { setInputs(prev => ({ ...prev, roomAllotmentDate: date })) }}
                                    dateFormat="dd-MM-yyyy"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none "
                                    maxDate={new Date()}
                                />

                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Time</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <DatePicker
                                    selected={inputs.roomAllotmentTime}
                                    onChange={time => {
                                        setInputs(prev => ({ ...prev, roomAllotmentTime: time }))
                                    }}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none "
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2">
                        <button
                            type="submit"
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900"
                            onClick={handleRoomAllotment}
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
                                    <th scope="col" className="px-4 py-2 border border-gray-200 text-sky-500">Room No </th>
                                    <th scope="col" className="px-4 py-2 border border-gray-200 text-sky-500">Room Type</th>
                                    <th scope="col" className="px-4 py-2 border border-gray-200 text-sky-500">Bed No</th>
                                    <th scope="col" className="px-4 py-2 border border-gray-200 text-sky-500">Date</th>
                                    <th scope="col" className="px-4 py-2 border border-gray-200 text-sky-500">Time</th>
                                    <th scope="col" className="px-4 py-2 border border-gray-200 text-sky-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((AllotmentData, index) => (
                                    <tr key={index} className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200">{AllotmentData.allotmentId}</td>
                                        <td className="px-4 py-3 border border-gray-200">{AllotmentData.roomType}</td>
                                        <td className="px-4 py-3 border border-gray-200">{AllotmentData.bedNo}</td>
                                        <td className="px-4 py-3 border border-gray-200">{AllotmentData.roomAllotmentDate}</td>
                                        <td className="px-4 py-3 border border-gray-200">{AllotmentData.roomAllotmentTime}</td>
                                        <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 flex items-center"
                                                onClick={() => handleUpdate(AllotmentData)}
                                            >
                                                <GrUpdate className="mr-1" />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700 flex items-center"
                                                size={30}
                                                onClick={() => handleDelete(AllotmentData.allotmentId)}
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
        </div>
    );
};



