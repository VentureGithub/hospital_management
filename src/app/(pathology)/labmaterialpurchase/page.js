'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { useFormik } from 'formik'; // Import Formik
import * as Yup from 'yup'; // Import Yup
import { toast } from 'sonner';

export function LabMaterialPurchase() {
    return (
        <LayoutForm>
            <LabMaterialPurchaseform />
        </LayoutForm>
    );
}

const LabMaterialPurchaseform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);

    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`getAll`);
            setData(response.data.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch data");
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    // Validation Schema using Yup
    const validationSchema = Yup.object({
        product: Yup.string().required("Product is required"),
        purchaseDate: Yup.date().required("Purchase Date is required"),
        totalCost: Yup.number().required("Total Cost is required").min(0, "Total cost cannot be negative"),
        testPerform: Yup.number().required("Test Perform is required").min(1, "At least one test must be performed"),
        costPerTest: Yup.number().required("Cost per Test is required").min(0, "Cost per test cannot be negative"),
    });

    // Formik form handling
    const formik = useFormik({
        initialValues: {
            labMaterialPurcId: 0,
            product: "",
            costPerTest: 0,
            totalCost: 0,
            purchaseDate: "",
            testPerform: 0
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    ...values,
                    // ensure numeric fields are numbers
                    costPerTest: Number(values.costPerTest) || 0,
                    testPerform: Number(values.testPerform) || 0,
                    totalCost: Number(values.totalCost) || 0
                };

                if (isEdit) {
                    const response = await apiClient.put(`updateMaterialPurchase`, payload);
                    if (response.status === 200) {
                        toast.success("Data updated successfully");
                        setIsEdit(false);
                    } else {
                        toast.error("Update failed! Please try again");
                    }
                } else {
                    const response = await apiClient.post(`save`, payload);
                    if (response.status === 200) {
                        toast.success("Data saved successfully");
                    } else {
                        toast.error("Save failed! Please try again");
                    }
                }
                await fetchApi();
                resetInputs();
            } catch (error) {
                console.error("Error handling lab material purchase:", error);
                toast.error("An error occurred. Please try again.");
            }
        }
    });

    // Update handler for fields that should recalc totalCost
    const handleFieldChange = (name, rawValue) => {
        // convert to number for numeric fields; allow empty string
        const value = rawValue === '' ? '' : (name === 'testPerform' || name === 'costPerTest' ? Number(rawValue) : rawValue);

        // set the changed field
        formik.setFieldValue(name, value);

        // if either testPerform or costPerTest changed, recompute totalCost
        if (name === 'testPerform' || name === 'costPerTest') {
            const testPerform = name === 'testPerform' ? (Number(rawValue) || 0) : (Number(formik.values.testPerform) || 0);
            const costPerTest = name === 'costPerTest' ? (Number(rawValue) || 0) : (Number(formik.values.costPerTest) || 0);

            const total = testPerform * costPerTest;
            formik.setFieldValue('totalCost', total);
        }
    };

    const handleUpdate = (labMaterialPurchase) => {
        // Map incoming object into the form fields, ensure numbers/dates normalized
        formik.setValues({
            labMaterialPurcId: labMaterialPurchase.labMaterialPurcId ?? 0,
            product: labMaterialPurchase.product ?? "",
            costPerTest: labMaterialPurchase.costPerTest ?? 0,
            totalCost: labMaterialPurchase.totalCost ?? 0,
            purchaseDate: labMaterialPurchase.purchaseDate ? labMaterialPurchase.purchaseDate.split('T')[0] : "",
            testPerform: labMaterialPurchase.testPerform ?? 0
        });
        setIsEdit(true);
    };

    const resetInputs = () => {
        formik.resetForm();
        setIsEdit(false);
    };

    return (
        <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
            <Heading headingText="Lab Material Purchase" />
            <div className="py-4">
                <form onSubmit={formik.handleSubmit} className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 m-2 ">
                        <div>
                            <label className="block text-sm">Pur. Date</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                                name="purchaseDate"
                                onChange={(e) => formik.setFieldValue('purchaseDate', e.target.value)}
                                onBlur={formik.handleBlur}
                                value={formik.values.purchaseDate}
                            />
                            {formik.touched.purchaseDate && formik.errors.purchaseDate ? (
                                <div className="text-red-600 text-sm">{formik.errors.purchaseDate}</div>
                            ) : null}
                        </div>
                        <div>
                            <label className="block text-sm">Product</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                                name="product"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.product}
                            />
                            {formik.touched.product && formik.errors.product ? (
                                <div className="text-red-600 text-sm">{formik.errors.product}</div>
                            ) : null}
                        </div>

                        <div >
                            <label className="block text-sm">Total Cost </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none bg-gray-100"
                                name="totalCost"
                                value={formik.values.totalCost}
                                readOnly
                            />
                            {formik.touched.totalCost && formik.errors.totalCost ? (
                                <div className="text-red-600 text-sm">{formik.errors.totalCost}</div>
                            ) : null}
                        </div>

                        <div>
                            <label className="block text-sm">Test Perform </label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                name="testPerform"
                                onChange={(e) => handleFieldChange('testPerform', e.target.value)}
                                onBlur={formik.handleBlur}
                                value={formik.values.testPerform}
                                min="0"
                            />
                            {formik.touched.testPerform && formik.errors.testPerform ? (
                                <div className="text-red-600 text-sm">{formik.errors.testPerform}</div>
                            ) : null}
                        </div>

                        <div>
                            <label className="block text-sm">Per Test Cost</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                                name="costPerTest"
                                value={formik.values.costPerTest}
                                onChange={(e) => handleFieldChange('costPerTest', e.target.value)}
                                onBlur={formik.handleBlur}
                                min="0"
                            />
                            {formik.touched.costPerTest && formik.errors.costPerTest ? (
                                <div className="text-red-600 text-sm">{formik.errors.costPerTest}</div>
                            ) : null}
                        </div>

                    </div>
                    <div className="flex justify-start w-full my-4 space-x-4 p-2">
                        <button
                            className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900"
                            type="button"
                            onClick={fetchApi}
                        >
                            Refresh
                        </button>
                        <button
                            className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
                            type="submit"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-2 m-4 md:p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Product</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Test Perform</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Cost Per Test</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Total Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.product}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.testPerform}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.costPerTest}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.totalCost}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">No data available</td>
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

export default withAuth(LabMaterialPurchase, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
