'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from 'sonner';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';

export function TestWiseCollectionReport() {
    return (
        <LayoutForm>
            <Heading headingText="Test Wise Collection Report" />
            <TestWiseCollectionReportform />
        </LayoutForm>
    );
}

const TestWiseCollectionReportform = () => {
    const [data, setData] = useState([]);
    const [doctor, setDoctor] = useState([]);
    const [shift, setShift] = useState([]);
    const [isEdit, setIsEdit] = useState(false);



    useEffect(() => {
        // fetchApi();
        fetchDoctor();
        fetchBrands();
        fetchShift();

    }, []);

    // Formik setup
    const formik = useFormik({
        initialValues: {
            medId: 0,
            medName: "",
            qty: "",
            descp: "",
            mfg: "",
            exp: "",
            brandId: "",
            categoryId: ""
        },
        validationSchema: Yup.object({
            medName: Yup.string().required('Medicine Name is required'),
            qty: Yup.number().required('Quantity is required'),
            mfg: Yup.date().required('Manufacturing date is required'),
            exp: Yup.date().required('Expiry  date must be after manufacturing date'),
            shiftId: Yup.string().required('Brand is required'),
            categoryId: Yup.string().required('Category is required')
        }),
        onSubmit: async (values) => {
            try {
                let response;
                console.log('Submitting values:', values); // Debugging line
        
                if (isEdit) {
                    // Update API call
                    response = await apiClient.put(
                        `api/medicines/updateMedicineMaster?itemno=${values.medId}`,
                        values
                    );
                } else {
                    // Save API call
                    response = await apiClient.post(
                        `api/medicines`,
                        values
                    );
                }
        
                // Check response
                console.log('API response:', response); // Debugging line
        
                if (response.status ===  200 ) {
                    toast.success(`Data ${isEdit ? 'updated' : 'saved'} successfully`);
                    fetchApi();  // Fetch updated data
                    formik.resetForm();  // Reset the form
                    setIsEdit(false);  // Reset edit state
                } else {
                    toast.error(`Failed! Please try again.`);
                }
            } catch (error) {
                console.error("Error handling submission:", error);
                // Enhanced error message
                if (error.response) {
                    toast.error(`Error: ${error.response.data.message || error.message}`);
                } else {
                    toast.error("An error occurred. Please try again.");
                }
            
        }
        
        }
        
    });

    const handleUpdate = (item) => {
        formik.setValues({
            medId: item.medId,
            medName: item.medName,
            qty: item.qty,
            descp: item.descp,
            mfg: item.mfg,
            exp: item.exp,
            brandId: item.brandId,
            categoryId: item.categoryId
        });
        setIsEdit(true);
    };

    const handleRefresh = () => {
        formik.resetForm();
        setIsEdit(false);
    };

    // Fetch categories
    const fetchDoctor = async () => {
        try {
            const response = await apiClient.get(`doc/getAllDoc`);
            setDoctor(response.data.data);
        } catch (error) {
            console.error("Error fetching Doctor:", error);
        }
    };

    // Fetch brands
    const fetchBrands = async () => {
        try {
            const response = await apiClient.get(`medicineBrand/getAllBrand`);
            setBrands(response.data.data);
        } catch (error) {
            console.error("Error fetching brands:", error);
        }
    };

        // Fetch Shift
        const fetchShift = async () => {
            try {
                const response = await apiClient.get(`shiftMaster/getAllDetailsghiftMaster`);
                setShift(response.data.data);
            } catch (error) {
                console.error("Error fetching Shift:", error);
            }
        };

    return (
        <div className='p-6'>
            <div className='p-7'>
                <form className='lg:w-[60%] md:w-[100%] sm:w-[100%]' onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2">

                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Doctor</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <select
                                    name="drId"
                                    onChange={(e) => formik.setFieldValue('drId', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.drId && formik.errors.drId ? 'border-red-500' : ''}`}
                                    value={formik.values.drId}
                                >
                                    <option value="" label="Select Doctor" />
                                    {doctor.map((doctor) => (
                                        <option key={doctor.drId} value={doctor.drId}>{doctor.drName}</option>
                                    ))}
                                </select>
                                {formik.touched.drId && formik.errors.drId && (
                                    <div className="text-red-500 text-sm">{formik.errors.drId}</div>
                                )}
                            </div>
                        </div>

                        {/* <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Medicine Brand</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <select
                                    name="brandId"
                                    onChange={(e) => formik.setFieldValue('brandId', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.brandId && formik.errors.brandId ? 'border-red-500' : ''}`}
                                    value={formik.values.brandId}
                                >
                                    <option value="" label="Select Brand" />
                                    {brands.map((brand) => (
                                        <option key={brand.brandId} value={brand.brandId}>{brand.brandName}</option>
                                    ))}
                                </select>
                                {formik.touched.brandId && formik.errors.brandId && (
                                    <div className="text-red-500 text-sm">{formik.errors.brandId}</div>
                                )}
                            </div>
                        </div> */}

                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold"> shift</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <select
                                    name="shiftId"
                                    onChange={(e) => formik.setFieldValue('shiftId', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.shiftId && formik.errors.shiftId ? 'border-red-500' : ''}`}
                                    value={formik.values.shiftId}
                                >
                                    <option value="" label="Select shift" />
                                    {shift.map((shift) => (
                                        <option key={shift.shiftId} value={shift.shiftId}>{shift.shiftName}</option>
                                    ))}
                                </select>
                                {formik.touched.shiftId && formik.errors.shiftId && (
                                    <div className="text-red-500 text-sm">{formik.errors.shiftId}</div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Date From </label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input
                                    type="date"
                                    name="qty"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.qty && formik.errors.qty ? 'border-red-500' : ''}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.qty}
                                />
                                {formik.touched.qty && formik.errors.qty && (
                                    <div className="text-red-500 text-sm">{formik.errors.qty}</div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Date To</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input
                                    type="date"
                                    name="mfg"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.mfg && formik.errors.mfg ? 'border-red-500' : ''}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.mfg}
                                />
                                {formik.touched.mfg && formik.errors.mfg && (
                                    <div className="text-red-500 text-sm">{formik.errors.mfg}</div>
                                )}
                            </div>
                        </div>

                        
                    </div>

                    <div className="flex justify-start w-full space-x-4 p-2">
                        <button 
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900" 
                            type="button" 
                            onClick={handleRefresh}>
                            Refresh
                        </button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900"
                            type="submit">
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-2 m-4 md:p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Category Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Brand Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Medicine Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Quantity </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr key={item.medId} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button 
                                                    className="text-blue-400 hover:text-blue-800 flex items-center"
                                                    onClick={() => handleUpdate(item)}>
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{item.categoryName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{item.brandName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{item.medName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{item.qty}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <p className="text-red-600 font-medium">Note: A master could not be deleted if used anywhere</p>
        </div>
    );
};


export default withAuth(TestWiseCollectionReport, ['SUPERADMIN', 'ADMIN','DOCTOR'])







