'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt, FaSearch, FaStethoscope, FaSync, FaSave, FaExclamationCircle } from "react-icons/fa";
import { BaseUrl } from "@/app/config";
import { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiClient from "@/app/config";
import { toast } from 'sonner';
import withAuth from '@/app/(components)/WithAuth';


export function CompanyMaster() {
    return (
        <LayoutForm>
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
        <div className='p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6  rounded-xl shadow-2xl border border-sky-100'>
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                        <FaStethoscope size={18} />
                    </div>
                    <Heading headingText="Company Master" />
                </div>
                <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">Pharmacy • Inventory</div>
            </div>

            <div className='py-4'>
                <form onSubmit={formik.handleSubmit} className='lg:w-[50%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 gap-3 m-2 ">
                        <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                            <label className="block font-semibold text-sm mb-2 text-sky-800">Company Name</label>

                            <input
                                type="text"
                                className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 ${formik.touched.companyName && formik.errors.companyName ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'}`}
                                name="companyName"
                                placeholder="e.g., Acme Pharmaceuticals"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.companyName}
                            />
                            {formik.touched.companyName && formik.errors.companyName ? (
                                <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md"><FaExclamationCircle /> {formik.errors.companyName}</div>
                            ) : null}

                        </div>
                    </div>
                    <div className="flex justify-start w-full gap-3 px-2 mt-2">
                        <button type="button" className="inline-flex items-center gap-2 bg-slate-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-slate-800 active:scale-[.99] transition" onClick={() => formik.resetForm()}>
                            <FaSync /> Refresh
                        </button>
                        <button type="submit" className="inline-flex items-center gap-2 bg-emerald-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-emerald-800 active:scale-[.99] transition">
                            <FaSave /> Save
                        </button>
                    </div>
                </form>
            </div>

            <div className="my-4">
                {/* Filter Input */}
                <div className="bg-white p-3 my-4 text-sm rounded-lg shadow-md border border-sky-100">
                    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="relative w-full md:w-1/2">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search company names..."
                                value={companyNameFilter}
                                onChange={handleFilter}
                                className="pl-9 pr-3 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
                            />
                        </div>
                        <div className="text-xs text-gray-500">{filteredData?.length || 0} companies</div>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
                                <thead className="sticky top-0 z-10">
                                    <tr className="text-center bg-sky-50/70 backdrop-blur">
                                        <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Sr</th>
                                        <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Company Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(filteredData) && filteredData?.length > 0 ? (
                                        paginateData(filteredData).map((transaction, index) => (
                                            <tr key={index} className="border border-gray-100 text-center hover:bg-sky-50/40 transition">
                                                <td className="px-4 py-3 border border-gray-100 text-sm">{(page - 1) * itemsPerPage + index + 1}</td>
                                                <td className="px-4 py-3 border border-gray-100 text-sm text-gray-700">{transaction.companyName}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center py-8 text-gray-500">
                                                No companies found
                                            </td>
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
                        className="bg-sky-600 text-white px-3 py-2 rounded-md hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={page === 1}
                    >
                        Previous
                    </button>

                    {/* Page Info */}
                    <div className="text-center text-sm text-gray-600">
                        Page {page} of {Math.max(1, Math.ceil((filteredData?.length || 0) / itemsPerPage))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={handleNextPage}
                        className="bg-sky-600 text-white px-3 py-2 rounded-md hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
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


