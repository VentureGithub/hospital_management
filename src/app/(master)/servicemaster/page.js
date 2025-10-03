'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { BaseUrl } from "@/app/config"; // Assuming you have a BaseUrl in config
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from 'sonner';

export function ServiceMaster() {
    return (
        <LayoutForm>
            <ServiceMasterform />
           </LayoutForm>
    );
}

// Define the validation schema
const validationSchema = Yup.object({
    id: Yup.string()
        .required("Service Type is required"),
    serviceName: Yup.string()
        .required("Service Name is required"),
    serviceRate: Yup.number()
        .typeError("Service Rate must be a number")
        .required("Service Rate is required")
        .min(0, "Service Rate cannot be negative"),
    remark: Yup.string()
        .optional()
        .max(100, "Remark cannot be more than 100 characters")
});

const ServiceMasterform = () => {
    const [data, setData] = useState([]);
    const [table, setTable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterText, setFilterText] = useState(""); // State for filter
    const itemsPerPage = 5; // Adjust the number of items per page as needed

    const fetchApi = async () => {
        try {
            const response = await apiClient.get("serviceMaster/getAllServiceMaster");
            setTable(response?.data?.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    // Filter table data based on serviceName
    const filteredData = table?.filter((transaction) =>
        transaction.serviceName.toLowerCase().includes(filterText.toLowerCase())
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


    const fetchCatagory = async () => {
        try {
            const response = await apiClient.get(`servicetypemaster/getAll`);
            setData(response?.data?.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchCatagory();
    }, []);


    


    const handleService = async (values, { resetForm }) => {
        try {
            const response = await apiClient.post("serviceMaster/saveServiceMaster", values);
            if (response.status === 200) {
                toast.success("Data is saved successfully");
                fetchApi();
                resetForm();
            } else {
                toast.error("Failed! Please try again");
            }
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
              <Heading headingText="Service Master " />
            <div className='py-4'>
                <Formik
                    initialValues={{
                        "serId": 0,
                        "serviceTypeName": "",
                        "serviceName": "",
                        "serviceRate": 0,
                        "remark": "",
                        "id": 0
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleService}
                >
                    {({ handleChange, values }) => (
                        <Form className='lg:w-[50%] md:w-[100%] sm:w-[100%]'>
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2">
                                <div >
                                        <label className="block font-semibold text-sm">Service Type </label>
                                
                                        <Field as="select" name="id" className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none">
                                            <option value="">Select service</option>
                                            {data?.map((item) => (
                                                <option key={item.id} value={item.id}>{item.serviceTypeName}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="id" component="div" className="text-red-500 text-sm" />
                                    
                                </div>
                                <div>
                                        <label className="block font-semibold text-sm">Service Name </label>
                                  
                                        <Field
                                            type="text"
                                            name="serviceName"
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                        />
                                        <ErrorMessage name="serviceName" component="div" className="text-red-500 text-sm" />
                              
                                </div>
                                <div >
                                        <label className="block font-semibold text-sm">Service Rate </label>
                                
                                        <Field
                                            type="text"
                                            name="serviceRate"
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                        />
                                        <ErrorMessage name="serviceRate" component="div" className="text-red-500 text-sm" />
                                  
                                </div>
                                <div >
                                        <label className="block font-semibold text-sm">Remark</label>
                                        <Field
                                            type="text"
                                            name="remark"
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                        />
                                        <ErrorMessage name="remark" component="div" className="text-red-500 text-sm" />
                                </div>
                            </div>
                            <div className="flex justify-start w-full space-x-4 py-4">
                                <button className="bg-gray-600 text-sm text-white px-6 py-2 rounded-lg hover:bg-gray-900" type="button" onClick={fetchApi}>Refresh</button>
                                <button
                                    className="bg-green-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-green-900"
                                    type="submit"
                                >
                                    Save
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            <div className="bg-white p-2 my-2 rounded-lg shadow-md">
            {/* Filter Input */}
            <div className="mb-4">
                <input
                    type="text"
                    className="p-2 border border-gray-300 rounded text-sm"
                    placeholder="Search by Service Name"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table className="table-auto w-full border border-collapse shadow">
                        <thead>
                            <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr.No</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Service Type</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Service Name</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Service Rate</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(currentData) && currentData?.length > 0 ? (
    currentData.map((transaction, index) => (
        <tr key={index} className="border border-gray-200 text-center">
            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
            <td className="px-4 py-3 border border-gray-200 uppercase">{transaction?.serviceTypeName || '-'}</td>
            <td className="px-4 py-3 border border-gray-200 uppercase">{transaction?.serviceName || '-'}</td>
            <td className="px-4 py-3 border border-gray-200 uppercase">{transaction?.serviceRate || '-'}</td>
            <td className="px-4 py-3 border border-gray-200 uppercase">{transaction?.remark || '-'}</td>
        </tr>
    ))
) : (
    <tr>
        <td colSpan="5" className="text-center py-4 text-gray-500">No data available</td>
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
            <p className="text-red-600 font-medium">Note: A master could not be deleted if used anywhere</p>
        </div>
    );
};

export default withAuth(ServiceMaster, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
