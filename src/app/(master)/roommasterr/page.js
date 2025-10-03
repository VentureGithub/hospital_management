'use client';
import { useState, useEffect } from "react";
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'sonner';

export function RoomMaster() {
    return (
        <LayoutForm>
          <RoomForm />
        </LayoutForm>
    );
}

const RoomForm = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [emp, setEmp] = useState([]);
    const [data, setData] = useState([]);
    const [initialValues, setInitialValues] = useState({
        roomwardId: 0,
        roomTypeId: 0,
        roomTypeName: "",
        roomBedNo: "",
        roomBedCharge: 0 || "",
        roomStatus: true
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [filterText, setFilterText] = useState(""); // Filter state for roomTypeName
    const itemsPerPage = 5; // Number of items per page

    const fetchApi = async () => {
        try {
            const response = await apiClient.get("patientRoom/getAllDetailofRoom");
            setData(response?.data?.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    // Filter data based on roomTypeName
    const filteredData = data?.filter((transaction) =>
        transaction.roomTypeName.toLowerCase().includes(filterText.toLowerCase())
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const fetchEmp = async () => {
        try {
            const response = await apiClient.get(`roomTypeMaster/getAllDetailofRoomTypeMaster`);
            setEmp(response?.data?.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    useEffect(() => {
        fetchEmp();
    }, []);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const apiUrl = isEdit
                ? `patientRoom/updateRoomMaster`
                : `patientRoom/admitRoom`;

            const response = await apiClient[isEdit ? "put" : "post"](apiUrl, values);

            if (response.status === 200 || response.status === 202 ) {
                toast.success(isEdit ? "Data updated successfully" : "Data saved successfully");
                setIsEdit(false);
                resetForm();
                fetchApi();
            } else {
                toast.error("Operation failed! Please try again");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleUpdate = (roomm) => {
        setInitialValues({
            roomwardId: roomm.roomwardId,
            roomTypeId: roomm.roomTypeId,
            roomTypeName: roomm.roomTypeName,
            roomBedNo: roomm.roomBedNo,
            roomBedCharge: roomm.roomBedCharge,
            roomStatus: roomm.roomStatus
        });
        setIsEdit(true);
    };

    const validationSchema = Yup.object({
        roomTypeId: Yup.string()
            .required("Room Name is required"),
            roomBedNo: Yup.string().required("Bed No is required"),
            // roomBedCharge: Yup.date().required("Charges is required"),
    });

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="Room Master" />
            <div className='py-4'>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ resetForm }) => (
                        <Form className='lg:w-[50%] md:w-[100%] sm:w-[100%]'>
                            <div className="grid grid-cols-1 gap-3 my-6">
                                <div>
                                    <label className="block font-semibold text-sm">Room Name</label>
                                    <Field
                                        as="select"
                                        name="roomTypeId"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                    >
                                        <option value="">Select Room</option>
                                        {emp?.map((driver) => (
                                            <option key={driver.roomTypeId} value={driver.roomTypeId}>
                                                {driver.roomTypeName}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="roomTypeId" component="p" className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <label className="block font-semibold text-sm">Bed No.</label>
                                    <Field
                                        type="text"
                                        name="roomBedNo"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                    />
                                    <ErrorMessage name="roomBedNo" component="p" className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <label className="block font-semibold text-sm">Charges</label>
                                    <Field
                                        type="text"
                                        name="roomBedCharge"
                                        
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                    />
                                    <ErrorMessage name="roomBedCharge" component="p" className="text-red-600 text-sm" />
                                </div>
                            </div>
                            <div className="flex justify-start w-full space-x-4 p-2">
                                <button
                                    type="button"
                                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900 text-sm"
                                    onClick={() => {
                                        resetForm();
                                        setIsEdit(false);
                                    }}
                                >
                                    Refresh
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900 text-sm"
                                >
                                    {isEdit ? "Update" : "Save"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-md">
            {/* Filter Input */}
            <div className="mb-4">
                <input
                    type="text"
                    className="p-2 border border-gray-300 rounded text-sm"
                    placeholder="Search by Room Type"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table className="table-auto w-full border border-collapse shadow">
                        <thead>
                            <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Room Type</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Bed No.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(currentData) && currentData?.length > 0 ? (
                                currentData?.map((transaction, index) => (
                                    <tr key={index} className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 flex items-center"
                                                onClick={() => handleUpdate(transaction)}
                                            >
                                                <FaPencilAlt className="mr-1" />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 border border-gray-200">{transaction.roomTypeName}</td>
                                        <td className="px-4 py-3 border border-gray-200">{`Bed No:${transaction.roomBedNo}`}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center space-x-2 mt-4">
                <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
            {Number.isInteger(totalPages) && totalPages > 0 ? (
    [...Array(totalPages)].map((_, pageIndex) => (
        <button
            key={pageIndex}
            className={`px-3 py-1 rounded ${
                currentPage === pageIndex + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handlePageChange(pageIndex + 1)}
        >
            {pageIndex + 1}
        </button>
    ))
) : null}

                <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
            <p className="text-red-600 font-medium text-sm">Note: A master could not be deleted if used anywhere</p>
        </div>
    );
};

export default withAuth(RoomMaster, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
