'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { toast } from 'sonner';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export function SaltMaster() {
    return (
        <LayoutForm>
           <SaltMasterform />
        </LayoutForm>
    );
}

const SaltMasterform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [inputs, setInputs] = useState({
        saltmasterIdLong: 0,
        saltNameString: "",
    });

    // Fetch data from the API
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(5); // Number of items per page
    const [saltNameFilter, setSaltNameFilter] = useState(""); // For filter by salt name

    // Fetch salt master data
    const fetchApi = async () => {
        try {
            const response = await apiClient.get("saltMaster/getAllData");
            setData(response?.data?.data);
            setFilteredData(response?.data?.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Apply pagination to the filtered data
    const paginateData = (data) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    // Handle the salt name filter
    const handleFilter = (e) => {
        const filterValue = e.target.value.toLowerCase();
        setSaltNameFilter(filterValue);

        // Filter data by salt name
        const filtered = data?.filter((item) =>
            item.saltNameString.toLowerCase().includes(filterValue)
        );
        setFilteredData(filtered);
        setPage(1); // Reset to the first page when filtering
    };

    // Handle next page
    const handleNextPage = () => {
        if (page * itemsPerPage < filteredData?.length) {
            setPage(page + 1);
        }
    };

    // Handle previous page
    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    // Yup validation schema
    const validationSchema = Yup.object({
        saltNameString: Yup.string()
            .required("Salt Name is required")
            .min(3, "Salt Name must be at least 3 characters")
            .max(50, "Salt Name must not exceed 50 characters"),
    });

    // Handle save or update
    const handleSubmit = async (values) => {
        try {
            if (isEdit) {
                const response = await apiClient.put(
                    `saltMaster/updateSaltmaster`,
                    values
                );
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false); // Reset edit state after update
                } else {
                    toast.error("Update failed! Please try again");
                }
            } else {
                const response = await apiClient.post(`saltMaster/saveDAta`, values);
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error("Save failed! Please try again");
                }
            }
            fetchApi(); // Refresh data after save or update
            setInputs({
                saltmasterIdLong: 0,
                saltNameString: "",
            });
        } catch (error) {
            console.error("Error handling form submission:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    // Set the form fields for editing a record
    const handleUpdate = (salt) => {
        setInputs({
            saltmasterIdLong: salt.saltmasterIdLong,
            saltNameString: salt.saltNameString,
        });
        setIsEdit(true);
    };

    return (
        <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
            <Heading headingText="Salt Master" />
            <div className="py-4">
                <Formik
                    initialValues={inputs}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur, isSubmitting }) => (
                        <Form className="lg:w-[50%] md:w-[100%] sm:w-[100%]">
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                                <div>
                                    <label className="block font-semibold text-sm mb-2">Salt Name</label>
                                    <Field
                                        type="text"
                                        className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none"
                                        name="saltNameString"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.saltNameString}
                                    />
                                    <ErrorMessage
                                        name="saltNameString"
                                        component="div"
                                        className="text-red-600 text-sm mt-1"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-start w-full space-x-4 p-2 my-4">
                                <button className="bg-gray-600 text-sm text-white px-6 py-2 rounded-lg hover:bg-gray-900" type="button">
                                    Refresh
                                </button>
                                <button
                                    className="bg-green-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-green-900"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isEdit ? "Update" : "Save"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            <div className=" my-4 ">

            {/* Table */}
            <div className="bg-white p-2 rounded-lg shadow-md">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Salt Name"
                    value={saltNameFilter}
                    onChange={handleFilter}
                    className="p-2 border border-gray-300 text-sm rounded"
                />
            </div>
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Salt Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(filteredData) && filteredData?.length > 0 ? (
                                    paginateData(filteredData).map((transaction, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.saltNameString}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="text-center">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                {/* Previous Button */}
                <button
                    onClick={handlePreviousPage}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    disabled={page === 1}
                >
                    Previous
                </button>

                {/* Page Info */}
                <div className="text-center">
                    Page {page} of {Math.ceil(filteredData?.length / itemsPerPage)}
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNextPage}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    disabled={page * itemsPerPage >= filteredData?.length}
                >
                    Next
                </button>
            </div>
        </div>
        </div>
    );
};

export default withAuth(SaltMaster, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
