// 'use client'
// import LayoutForm from "../../layouts/layoutForm";
// import Heading from "../../(components)/heding";
// import { FaPencilAlt } from "react-icons/fa";
// import apiClient from "@/app/config";
// import withAuth from '@/app/(components)/WithAuth';
// import { useState, useEffect } from "react";



// export function LabMaterialPurchase() {
//     return (
//         <LayoutForm>
//             <LabMaterialPurchaseform />
//         </LayoutForm>
//     );
// }

// const LabMaterialPurchaseform = () => {

//     const [isEdit, setIsEdit] = useState(false);
//     const [data, setData] = useState([]);
//     const [inputs, setInputs] = useState({
//         "labMaterialPurcId": 0,
//         "product": "",
//         "costPerTest": 0,
//         "totalCost": 0,
//         "purchaseDate": "",
//         "testPerform": 0
//     });

//     const fetchApi = async () => {
//         try {
//             const response = await apiClient.get(`getAll`);
//             setData(response.data.data);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     useEffect(() => {
//         fetchApi();
//     }, []);

//     const handleBlood = async (e) => {
//         e.preventDefault();
//         try {
//             if (isEdit) {
//                 const response = await apiClient.put(
//                     `updateMaterialPurchase`,
//                     inputs
//                 );
//                 if (response.status === 200) {
//                     toast.error("Data updated successfully");
//                     setIsEdit(false);
//                 } else {
//                     toast.error("Update failed! Please try again");
//                 }
//             } else {
//                 const response = await apiClient.post(
//                     `save`,
//                     inputs
//                 );
//                 if (response.status === 200) {
//                     toast.error("Data saved successfully");
//                 } else {
//                     toast.error("Save failed! Please try again");
//                 }
//             }
//             fetchApi();
//             resetInputs();
//         } catch (error) {
//             console.error("Error handling room type:", error);
//             toast.error("An error occurred. Please try again.");
//         }
//     };

//     const handleUpdate = (bloodPurchase) => {
//         setInputs(bloodPurchase);
//         setIsEdit(true);
//     };

//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setInputs((prevData) => {
//             const updatedData = {
//                 ...prevData,
//                 [name]: value,
//             };

//             // Calculate the rate based on the noOfStrip and bloodStripAmount
//             if (name === "noOfStrip" || name === "bloodStripAmount") {
//                 const noOfStrip = parseFloat(updatedData.noOfStrip) || 0;
//                 const bloodStripAmount = parseFloat(updatedData.bloodStripAmount) || 0;
//                 const rate = noOfStrip ? (bloodStripAmount / noOfStrip) : 0;

//                 return {
//                     ...updatedData,
//                     rate,
//                 };
//             }
//             return updatedData;
//         });
//     };

//     const resetInputs = () => {
//         setInputs({
//             "labMaterialPurcId": 0,
//             "product": "",
//             "costPerTest": 0,
//             "totalCost": 0,
//             "purchaseDate": "",
//             "testPerform": 0
//         });
//     };




//     return (
//         <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
//             <Heading headingText="Lab Material Purchase" />
//             <div className="py-4">
//                 <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
//                     <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 m-2 ">
//                         <div>
//                                 <label className="block text-sm">Pur. Date</label>
//                                 <input
//                                     type="date"
//                                     className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
//                                     name="purchaseDate"
//                                     onChange={handleChange}
//                                     value={inputs.purchaseDate}
//                                 />
//                         </div>
//                         <div>
//                                 <label className="block text-sm">Product</label>
//                                 <input
//                                     type="text"
//                                     className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
//                                     name="product"
//                                     onChange={handleChange}
//                                     value={inputs.product}
//                                 />
//                         </div>
//                         <div >
//                                 <label className="block text-sm">Total Cost </label>
//                                 <input
//                                     type="text"
//                                     className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
//                                     name="totalCost"
//                                     onChange={handleChange}
//                                     value={inputs.totalCost}
//                                 />
//                         </div>
                      

//                         <div>
//                                 <label className="block text-sm">Test Perform </label>
//                                 <input
//                                     type="number"
//                                     className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
//                                     name="testPerform"
//                                     onChange={handleChange}
//                                     value={inputs.testPerform}
//                                 />
//                         </div>

//                         <div>
//                                 <label className="block text-sm">Per Test Cost</label>
//                                 <input
//                                     type="text"
//                                     className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
//                                     name="costPerTest"
//                                     value={inputs.costPerTest} // Display calculated rate
                                   
//                                 />
//                         </div>

//                     </div>
//                 </form>
//                 <div className="flex justify-start w-full my-4 space-x-4 p-2">
//                     <button
//                         className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900"
//                         type="button"

//                     >
//                         Refresh
//                     </button>
//                     <button
//                         className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
//                         onClick={handleBlood}
//                         type="submit"
//                     >
//                         {isEdit ? "Update" : "Save"}
//                     </button>
//                 </div>
//             </div>

//             <div className="bg-white p-2 m-4 md:p-2 rounded-lg shadow-md">
//                 <div className="overflow-x-auto">
//                     <div
//                         className="w-full"
//                         style={{ maxHeight: "400px", overflowY: "auto" }}
//                     >
//                         <table className="table-auto w-full border border-collapse shadow">
//                             <thead>
//                                 <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>

//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Product</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Test Perform</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Cost Per Test</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Total Cost</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {Array.isArray(data) && data.length > 0 ? (
//                                     data.map((transaction, index) => (
//                                         <tr key={index} className="border border-gray-200 text-center">
//                                             <td className="px-4 py-3 border border-gray-200 flex space-x-2">

//                                                 <button
//                                                     className="text-blue-500 hover:text-blue-700 flex items-center"
//                                                     onClick={() => handleUpdate(transaction)}
//                                                 >
//                                                     <FaPencilAlt className="mr-1" />
//                                                 </button>
//                                             </td>

                                            
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.product}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.testPerform}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.costPerTest}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.totalCost}</td>



//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="7" className="text-center">No data available</td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//             <p className="text-red-600 font-medium">Note: A master could not be deleted if used anywhere</p>
//         </div>
//     );
// };
// export default withAuth(LabMaterialPurchase, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])










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
    const [inputs, setInputs] = useState({
        "labMaterialPurcId": 0,
        "product": "",
        "costPerTest": 0,
        "totalCost": 0,
        "purchaseDate": "",
        "testPerform": 0
    });

    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`getAll`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
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
        initialValues: inputs,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (isEdit) {
                    const response = await apiClient.put(`updateMaterialPurchase`, values);
                    if (response.status === 200) {
                        toast.success("Data updated successfully");
                        setIsEdit(false);
                    } else {
                        toast.error("Update failed! Please try again");
                    }
                } else {
                    const response = await apiClient.post(`save`, values);
                    if (response.status === 200) {
                        toast.success("Data saved successfully");
                    } else {
                        toast.error("Save failed! Please try again");
                    }
                }
                fetchApi();
                resetInputs();
            } catch (error) {
                console.error("Error handling lab material purchase:", error);
                toast.error("An error occurred. Please try again.");
            }
        }
    });

    const handleUpdate = (labMaterialPurchase) => {
        formik.setValues(labMaterialPurchase);
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
                                onChange={formik.handleChange}
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
                                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                                name="totalCost"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.totalCost}
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.testPerform}
                            />
                            {formik.touched.testPerform && formik.errors.testPerform ? (
                                <div className="text-red-600 text-sm">{formik.errors.testPerform}</div>
                            ) : null}
                        </div>

                        <div>
                            <label className="block text-sm">Per Test Cost</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                                name="costPerTest"
                                value={formik.values.costPerTest} // Display calculated rate
                                onChange={formik.handleChange}
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
