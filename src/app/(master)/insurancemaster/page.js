'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'sonner';

export function Insurance() {
    return (
        <LayoutForm>
           <InsuranceForm />
        </LayoutForm>
    );
}

const InsuranceForm = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [initialValues, setInitialValues] = useState({
        insuranceId: 0,
        insuranceCompnyName: "",
    });

    const [filterText, setFilterText] = useState(""); // Filter text
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const itemsPerPage = 5; // Items per page for pagination

    // Fetch all insurance data
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`insurance/getAllData`);
            setData(response?.data?.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    // Filter data based on filterText
    const filteredData = data?.filter(insurance =>
        insurance.insuranceCompnyName.toLowerCase().includes(filterText.toLowerCase())
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Validation schema with Yup
    const validationSchema = Yup.object({
        insuranceCompnyName: Yup.string()
            .required("Insurance company name is required")
            .min(3, "Insurance company name must be at least 3 characters")
            .max(50, "Insurance company name cannot exceed 50 characters"),
    });

    // Handle form submission for save/update
    const handleSubmit = async (values, { resetForm }) => {
        try {
            if (isEdit) {
                const response = await apiClient.put(
                    `insurance/updateInsuranceData`,
                    values
                );
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                } else {
                    toast.error("Update failed! Please try again.");
                }
            } else {
                const response = await apiClient.post(
                    `insurance/createInsuranceCompany`,
                    values
                );
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error("Save failed! Please try again.");
                }
            }
            fetchApi();
            resetForm();
            setIsEdit(false);
        } catch (error) {
            console.error("Error handling insurance data:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    // Set form values for editing
    const handleEdit = (insurance) => {
        setInitialValues({
            insuranceId: insurance.insuranceId,
            insuranceCompnyName: insurance.insuranceCompnyName,
        });
        setIsEdit(true);
    };

    return (
        <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
            <Heading headingText="Insurance Master" />
            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                <Form className="lg:w-[50%] md:w-[100%] sm:w-[100%]">
                    <div className="grid grid-cols-1 gap-3 my-6">
                        <div>
                            <label className="block font-semibold text-sm">
                                Insurance Name
                            </label>
                            <Field
                                type="text"
                                name="insuranceCompnyName"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                            />
                            <ErrorMessage
                                name="insuranceCompnyName"
                                component="p"
                                className="text-red-500 text-xs"
                            />
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2">
                        <button
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900 text-sm"
                            type="button"
                            onClick={fetchApi}
                        >
                            Refresh
                        </button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900 text-sm"
                            type="submit"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </Form>
            </Formik>

            <div className="bg-white p-2 rounded-lg shadow-md mt-4">
            {/* Filter Input */}
            <div className="mb-4">
                <input
                    type="text"
                    className="p-2 border border-gray-300 rounded"
                    placeholder="Search by Insurance Name"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="table-auto w-full border border-collapse shadow">
                    <thead>
                        <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                            <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                            <th className="px-4 py-2 border border-gray-200 text-sky-500">Insurance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(currentData) && currentData?.length > 0 ? (
                            currentData?.map((insurance, index) => (
                                <tr key={index} className="border border-gray-200 text-center">
                                    <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 flex items-center"
                                            onClick={() => handleEdit(insurance)}
                                        >
                                            <FaPencilAlt className="mr-1" />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 border border-gray-200">
                                        {insurance.insuranceCompnyName}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center space-x-2 mt-4">
                {/* Previous Button */}
                <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                {/* Individual Page Buttons */}
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


                {/* Next Button */}
                <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>

            <p className="text-red-600 font-medium text-sm">
                Note: A master could not be deleted if used anywhere
            </p>
        </div>
    );
};

export default withAuth(Insurance, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
