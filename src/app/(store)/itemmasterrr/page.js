'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';

export function SupplierMaster() {
    return (
        <LayoutForm>
            <SupplierMasterform />
        </LayoutForm>
    );
}

const SupplierMasterform = () => {
    const [data, setData] = useState([]);
    const [tax, setTax] = useState([]);
    const [isEdit, setIsEdit] = useState(false);

    // Formik state initialization
    const formik = useFormik({
        initialValues: {
            itemId: 0,
            itemGroup: '',
            itemName: '',
            taxId: 0,
            remark: '',
            opQntity: 0,
            ratePerPcs: 0
        },
        validationSchema: Yup.object({
            itemGroup: Yup.string().required('Item Group is required'),
            itemName: Yup.string().required('Item Name is required'),
            opQntity: Yup.number().required('Op. Quantity is required').positive('Op. Quantity must be a positive number'),
            ratePerPcs: Yup.number().required('Rate Per Pcs is required').positive('Rate Per Pcs must be a positive number'),
            remark: Yup.string().optional(),
            taxId: Yup.number().required('Tax Slab is required').positive('Select a valid tax slab')
        }),
        onSubmit: async (values) => {
            try {
                if (isEdit) {
                    // Update API call with proper itemId
                    const response = await apiClient.put(
                        'item/update',
                        values
                    );
                    if (response.status === 200) {
                        toast.success('Data updated successfully');
                        setIsEdit(false);
                    } else {
                        toast.error('Update failed! Please try again');
                    }
                } else {
                    // Save API call for new item
                    const response = await apiClient.post(
                        'item/saveItem',
                        values
                    );
                    if (response.status === 200) {
                        toast.success('Data saved successfully');
                    } else {
                        toast.error('Save failed! Please try again');
                    }
                }
                fetchApi(); // Refresh the data after save/update
                formik.resetForm(); // Reset form fields
            } catch (error) {
                console.error('Error handling item:', error);
                toast.error('An error occurred. Please try again.');
            }
        }
    });
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10); // Set the number of items per page
    const [itemFilter, setitemFilter] = useState("");

    // Fetch all items for the table
    const fetchApi = async () => {
        try {
            const response = await apiClient.get('item/getAllItem');
            setData(response?.data?.data);
            setFilteredData(response?.data?.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Apply pagination
    const paginateData = (data) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data?.slice(startIndex, endIndex);
    };

    // Filter data by Voucher No.
    const handleFilter = (e) => {
        const filterValue = e.target.value.toLowerCase();
        setitemFilter(filterValue);

        const filtered = data?.filter((item) =>
            item.itemName.toLowerCase().includes(filterValue)
        );
        setFilteredData(filtered);
        setPage(1); // Reset to the first page after filtering
    };

    // Update the page when the next button is clicked
    const handleNextPage = () => {
        if (page * itemsPerPage < filteredData?.length) {
            setPage(page + 1);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);



    // Fetch all tax slabs for the dropdown
    const fetchTax = async () => {
        try {
            const response = await apiClient.get('tax/getAllTax');
            setTax(response?.data?.data);
        } catch (error) {
            console.error('Error fetching tax slabs', error);
        }
    };

    useEffect(() => {
        fetchTax();
    }, []);

    // Handle the change in tax selection
    const handleTax = (e) => {
        formik.setFieldValue('taxId', e.target.value);
    };

    const handleUpdate = (item) => {
        formik.setValues({
            itemId: item.itemId,
            itemGroup: item.itemGroup,
            itemName: item.itemName,
            taxId: item.taxId,
            remark: item.remark,
            opQntity: item.opQntity,
            ratePerPcs: item.ratePerPcs
        });
        setIsEdit(true);
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl'>
            <Heading headingText="Item Master" />
            <div className='py-4'>
                <form onSubmit={formik.handleSubmit} className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 m-2 ">
                        <div>
                            <label className="block text-gray-700 text-sm">Item Group</label>
                            <input
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg text-sm focus:outline-none '
                                name="itemGroup"
                                onChange={formik.handleChange}
                                value={formik.values.itemGroup}
                            />
                            {formik.touched.itemGroup && formik.errors.itemGroup ? (
                                <div className="text-red-500 text-sm">{formik.errors.itemGroup}</div>
                            ) : null}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Item Name</label>
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none '
                                name="itemName"
                                onChange={formik.handleChange}
                                value={formik.values.itemName}
                            />
                            {formik.touched.itemName && formik.errors.itemName ? (
                                <div className="text-red-500 text-sm">{formik.errors.itemName}</div>
                            ) : null}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Op. Quantity</label>
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none '
                                name="opQntity"
                                onChange={formik.handleChange}
                                value={formik.values.opQntity}
                            />
                            {formik.touched.opQntity && formik.errors.opQntity ? (
                                <div className="text-red-500 text-sm">{formik.errors.opQntity}</div>
                            ) : null}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Rate Per Pcs</label>
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none '
                                name="ratePerPcs"
                                onChange={formik.handleChange}
                                value={formik.values.ratePerPcs}
                            />
                            {formik.touched.ratePerPcs && formik.errors.ratePerPcs ? (
                                <div className="text-red-500 text-sm">{formik.errors.ratePerPcs}</div>
                            ) : null}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Remark</label>
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none '
                                name="remark"
                                onChange={formik.handleChange}
                                value={formik.values.remark}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Tax Slab</label>
                            <select
                                className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none"
                                name="taxId"
                                onChange={handleTax}
                                value={formik.values.taxId}
                            >
                                <option>select tax slab</option>
                                {tax?.map((tax) => (
                                    <option key={tax.taxId} value={tax.taxId}>
                                        {`${tax.tax}%`}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.taxId && formik.errors.taxId ? (
                                <div className="text-red-500 text-sm">{formik.errors.taxId}</div>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2 my-4">
                        <button type="reset" className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900">
                            Refresh
                        </button>
                        <button type="submit" className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900">
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="my-4">
                {/* Table to display data */}

                <div className="overflow-x-auto">
                    <div className="bg-white p-2 my-2 text-sm rounded-lg shadow-md">
                        {/* Filter by Voucher No. */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search by Item Name"
                                value={itemFilter}
                                onChange={handleFilter}
                                className="p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <table className="table-auto w-full border border-collapse shadow">
                                <thead>
                                    <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Item Name</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Item Group</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Op Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(filteredData) && filteredData?.length > 0 ? (
                                        paginateData(filteredData)?.map((transaction, index) => (
                                            <tr key={index} className="border border-gray-200 text-center">
                                                <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                    <button
                                                        className="text-blue-400 hover:text-blue-800 flex items-center"
                                                        onClick={() => handleUpdate(transaction)}
                                                    >
                                                        <FaPencilAlt className="mr-1" />
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.itemName}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.itemGroup}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.opQntity}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={handleNextPage}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                        disabled={page * itemsPerPage >= filteredData?.length}
                    >
                        Next
                    </button>
                    <div className="text-center">
                        Page {page} of {Math.ceil(filteredData?.length / itemsPerPage)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAuth(SupplierMaster, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
