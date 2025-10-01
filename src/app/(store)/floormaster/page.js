'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import apiClient from "@/app/config";
import { toast } from 'sonner';
import withAuth from '@/app/(components)/WithAuth';

export function FloorMaster() {
    return (
        <LayoutForm>
            <FloorMasterform />
        </LayoutForm>
    );
}

const FloorMasterform = () => {
    const [data, setData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);

    // Formik state initialization
    const formik = useFormik({
        initialValues: {
            floorNo: 0,
            date: "",
            floorName: "",
            description: "",
        },
        validationSchema: Yup.object({
            date: Yup.string().required("Date is required"),
            floorName: Yup.string().required("Floor Name is required"),
            description: Yup.string().required("Description is required"),
        }),
        onSubmit: async (values) => {
            try {
                if (isEdit) {
                    const response = await apiClient.put(
                        "PatientFloorNo/updateFloor",
                        values
                    );
                    if (response.status === 202) {
                        toast.success("Data updated successfully");
                        setIsEdit(false);
                    } else {
                        toast.error("Update failed! Please try again");
                    }
                } else {
                    const response = await apiClient.post(
                        "PatientFloorNo/saveFloor",
                        values
                    );
                    if (response.status === 202) {
                        toast.success("Data saved successfully");
                    } else {
                        toast.error("Save failed! Please try again");
                    }
                }
                fetchApi();
                formik.resetForm();
            } catch (error) {
                console.error("Error handling floor:", error);
                toast.error("An error occurred. Please try again.");
            }
        },
    });

    // Fetch all floors
    const fetchApi = async () => {
        try {
            const response = await apiClient.get("PatientFloorNo/getFloor");
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    // Handle updating the form when editing
    const handleUpdate = (floor) => {
        formik.setValues({
            floorNo: floor.floorNo,
            date: floor.date,
            floorName: floor.floorName,
            description: floor.description,
        });
        setIsEdit(true);
    };

    return (
        <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
            <Heading headingText="Floor Master" />
            <div className="py-4">
                <form
                    onSubmit={formik.handleSubmit}
                    className="lg:w-[50%] md:w-[100%] sm:w-[100%]"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3 m-2">
                        <div>
                            <label className="block font-semibold text-sm">Date</label>
                            <input
                                type="date"
                                className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none"
                                placeholder=""
                                name="date"
                                onChange={formik.handleChange}
                                value={formik.values.date}
                            />
                            {formik.touched.date && formik.errors.date ? (
                                <div className="text-red-500 text-sm">
                                    {formik.errors.date}
                                </div>
                            ) : null}
                        </div>
                        <div>
                            <label className="block font-semibold text-sm">Floor Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                                placeholder=""
                                name="floorName"
                                onChange={formik.handleChange}
                                value={formik.values.floorName}
                            />
                            {formik.touched.floorName && formik.errors.floorName ? (
                                <div className="text-red-500 text-sm">
                                    {formik.errors.floorName}
                                </div>
                            ) : null}
                        </div>
                        <div>
                            <label className="block font-semibold text-sm">Description</label>
                            <input
                                type="text"
                                className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none"
                                placeholder=""
                                name="description"
                                onChange={formik.handleChange}
                                value={formik.values.description}
                            />
                            {formik.touched.description && formik.errors.description ? (
                                <div className="text-red-500 text-sm">
                                    {formik.errors.description}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2 my-4">
                        <button
                            type="reset"
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-900"
                        >
                            Refresh
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-900"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-white p-2 my-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr
                                    className="text-center"
                                    style={{ backgroundColor: "#CFE0E733" }}
                                >
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Floor Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr
                                            key={index}
                                            className="border border-gray-200 text-center"
                                        >
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-400 hover:text-blue-800 flex items-center"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">
                                                {transaction.floorName}
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">
                                                {transaction.description}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            No data available
                                        </td>
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

export default withAuth(FloorMaster, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
