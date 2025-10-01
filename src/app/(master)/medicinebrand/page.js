'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import Icon from "../../(components)/icon";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';

export function MedicineBrand() {
    return (
        <LayoutForm>
            <MedicineBrandform />
            <Icon message={"This page is created to store medicine brand names, where we will fill in the names of all medicines Brands."} />
        </LayoutForm>
    );
}



const MedicineBrandform = () => {
    const [data, setData] = useState([]);

    // Fetch data
    const fetchApi = async () => {
        try {
            const response = await apiClient.get("medicineBrand/getAllBrand");
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    // Formik setup
    const formik = useFormik({
        initialValues: {
            brandId: 0,
            brandName: ''
        },
        validationSchema: Yup.object({
            brandName: Yup.string()
                .required('Brand Name is required')
                .min(2, 'Brand Name must be at least 2 characters')
                .max(50, 'Brand Name cannot exceed 50 characters')
                .matches(/^[a-zA-Z0-9\s]+$/, 'Brand Name can only contain letters, numbers, and spaces')
                .matches(/^\S+(?: \S+)*$/, 'Brand Name should not have leading or trailing spaces'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await apiClient.post(
                    "medicineBrand/saveName",
                    values
                );
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                    fetchApi();
                    formik.resetForm();
                } else {
                    toast.error("Failed! Please try again");
                }
            } catch (error) {
                console.error("Error saving data:", error);
                alert("Failed! Please try again");
            }
        }
    });
    const handleRefresh = () => {
        formik.resetForm();
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
             <Heading headingText="Medicine Brand" />
            <div className='py-4'>
                <form onSubmit={formik.handleSubmit} className='lg:w-[50%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2 ">
                        <div>
                                <label className="block font-semibold text-sm">Brand Name</label>
                           
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.brandName && formik.errors.brandName ? 'border-red-500' : ''}`}
                                    name="brandName"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.brandName}
                                />
                                {formik.touched.brandName && formik.errors.brandName ? (
                                    <div className="text-red-500 text-sm">{formik.errors.brandName}</div>
                                ) : null}
                          
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2 ">
                        <button type="button" className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900" onClick={handleRefresh}>Refresh</button>
                        <button type="submit" className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900">
                            Save
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-white p-2 my-4 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Brand Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{transaction.brandName}</td>
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
            </div>
            <p className="text-red-600 font-medium">Note: A master could not be deleted if used anywhere</p>
        </div>
    );
};

export default withAuth(MedicineBrand, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])




