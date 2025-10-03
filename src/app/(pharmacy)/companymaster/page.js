'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import { BaseUrl } from "@/app/config";
import { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiClient from "@/app/config";
import { toast } from 'sonner';
import withAuth from '@/app/(components)/WithAuth';
import Icon from "@/app/(components)/Icon";

export function CompanyMaster() {
    return (
        <LayoutForm>
            <Icon message="This page manages information about pharmaceutical companies , including company names , to support streamlined inventory sourcing and supplier management."/>
            <Companyform />
        </LayoutForm>
    );
}




const Companyform = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page
    const [companyNameFilter, setCompanyNameFilter] = useState(""); // For filter by company name

    // Fetch company data
    const fetchApi = async () => {
        try {
            const response = await apiClient.get("compny/getAllCompnyName");
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
        return data?.slice(startIndex, endIndex);
    };

    // Handle the company name filter
    const handleFilter = (e) => {
        const filterValue = e.target.value.toLowerCase();
        setCompanyNameFilter(filterValue);

        // Filter data by company name
        const filtered = data?.filter((item) =>
            item.companyName.toLowerCase().includes(filterValue)
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

    

    // Formik setup
    const formik = useFormik({
        initialValues: {
            companyId: 0,
            companyName: "",
        },
        validationSchema: Yup.object({
            companyName: Yup.string()
                .required('Company Name is required')
                .min(2, 'Company Name must be at least 2 characters')
                .max(50, 'Company Name cannot exceed 50 characters'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await apiClient.post(`compny/save`, values);
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                    fetchApi(); // Refresh the list of companies
                    resetForm(); // Reset form after successful submission
                } else {
                    toast.error("Something went wrong");
                }
            } catch (error) {
                console.error("Error saving data:", error);
                toast.error("An error occurred. Please try again.");
            }
        },
    });

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
              <Heading headingText="Company Master" />
            <div className='py-4'>
                <form onSubmit={formik.handleSubmit} className='lg:w-[50%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2 ">
                        <div>
                                <label className="block text-sm mb-2 font-semibold">Company Name</label>
                         
                                <input
                                    type="text"
                                    className={`w-full text-sm px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.companyName && formik.errors.companyName ? 'border-red-500' : ''}`}
                                    name="companyName"
                                    placeholder="Company Name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.companyName}
                                />
                                {formik.touched.companyName && formik.errors.companyName ? (
                                    <div className="text-red-500 text-sm">{formik.errors.companyName}</div>
                                ) : null}
                          
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 mt-4 p-2">
                        <button type="button" className="bg-gray-600 text-sm text-white px-6 py-2 rounded-lg hover:bg-gray-900" onClick={() => formik.resetForm()}>
                            Refresh
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>

            <div className="p-6">
            {/* Filter Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Company Name"
                    value={companyNameFilter}
                    onChange={handleFilter}
                    className="p-2 border border-gray-300 text-sm rounded"
                />
            </div>

            {/* Table */}
            <div className="bg-white p-2 my-4 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Company Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(filteredData) && filteredData?.length > 0 ? (
                                    paginateData(filteredData).map((transaction, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.companyName}</td>
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





export default withAuth(CompanyMaster,[ 'SUPERADMIN' , 'ADMIN', 'DOCTOR' ])


