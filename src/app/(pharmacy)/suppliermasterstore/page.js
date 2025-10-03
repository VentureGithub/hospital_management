'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect, useRef } from "react";
import { toast } from 'sonner';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export  function Supplier() {
    return (
        <LayoutForm>
            <SupplierForm />
        </LayoutForm>
    );
}



const SupplierForm = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const formikRef = useRef(); // Create a ref for Formik

    // Fetch all suppliers
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`spplierData/getAllData`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const initialValues = {
        supplierId: 0,
        supplierName: "",
        address: "",
        phoneNo: "",
        pinCode: "",
        state: "",
        city: "",
        openBalance: 0,
        date: "",
        gstIN: "",
        paymentMethod: "",
        accountNo: "",
        ifscCode: "",
        bankName: "",
        supplierType: ""
    };

    const validationSchema = Yup.object().shape({
        supplierName: Yup.string().required('Supplier Name is required'),
        address: Yup.string().required('Address is required'),
        phoneNo: Yup.string()
            .required('Phone number is required')
            .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
        pinCode: Yup.string()
            .required('Pin Code is required')
            .matches(/^[0-9]{6}$/, 'Pin Code must be exactly 6 digits'),
        state: Yup.string().required('State is required'),
        city: Yup.string().required('City is required'),
        openBalance: Yup.number()
            .required('Open Balance is required')
            .positive('Open Balance must be a positive number')
            .typeError('Open Balance must be a number'),
        date: Yup.date()
            .required('Date is required')
            .typeError('Date must be a valid date'),
        // gstIN: Yup.string()
        //     .required('GSTIN is required')
        //     .matches(/^([0-9]{2})([A-Z]{4})([0-9]{4})([A-Z]{1})([Z]{1})([0-9A-Z]{1})$/, 'Invalid GSTIN format'),
        paymentMethod: Yup.string().required('Payment Method is required'),
        accountNo: Yup.string()
            .required('Account Number is required')
            .matches(/^[0-9]+$/, 'Account Number must be numeric'),
        // ifscCode: Yup.string()
        //     .required('IFSC Code is required')
        //     .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC Code format'),
        bankName: Yup.string().required('Bank Name is required'),
        supplierType: Yup.string().required('Supplier Type is required'),
    });

    const handleSupplier = async (values) => {
        try {
            let response;
            if (isEdit) {
                response = await apiClient.put(`spplierData/updateData/byId`, values);
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                }
            } else {
                response = await apiClient.post(`spplierData/save`, values);
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                }
            }
            fetchApi(); // Refresh data after save
            formikRef.current.resetForm(); // Clear the form fields
            setIsEdit(false); // Reset edit mode
        } catch (error) {
            console.error("Error handling supplier:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleUpdate = (supplier) => {
        setIsEdit(true);
        // Set form values for editing
        formikRef.current.setValues(supplier);
    };

    const handleRefresh = () => {
        fetchApi(); // Refresh data
        formikRef.current.resetForm(); // Clear the form fields
        setIsEdit(false); // Reset edit mode
    };

    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
        "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
        "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
        "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep",
        "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
    ];

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="Supplier Master" />
            <div className='py-4'>
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSupplier}
                >
                    {({ setFieldValue }) => (
                        <Form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4  ">
                                <div>
                                    <label className="block text-gray-700 text-sm">Supplier Name</label>
                                    <Field type="text" name="supplierName" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                                    <ErrorMessage name="supplierName" component="div" className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm">Address</label>
                                    <Field type="text" name="address" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                                    <ErrorMessage name="address" component="div" className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Phone No.</label>
                                    <Field type="text" name="phoneNo" className='w-full px-4 py-2 border rounded-lg focus:outline-none' onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }} />
                                    <ErrorMessage name="phoneNo" component="div" className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm">Pin Code</label>
                                    <Field
                                        type="text"
                                        name="pinCode"
                                        className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                        onKeyPress={(e) => {
                                            if (!/[0-9]/.test(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                    <ErrorMessage name="pinCode" component="div" className="text-red-600 text-sm" />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm">State</label>
                                    <Field as="select" name="state" className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm">
                                        <option value="">Select State</option>
                                        {states.map((state, index) => (
                                            <option key={index} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="state" component="div" className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm">City</label>
                                    <Field type="text" name="city" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                                    <ErrorMessage name="city" component="div" className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm">Open Balance</label>
                                    <Field type="number" name="openBalance" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                                    <ErrorMessage name="openBalance" component="div" className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm">Date</label>
                                    <Field type="date" name="date" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                                    <ErrorMessage name="date" component="div" className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm">GSTIN No.</label>
                                    <Field type="text" name="gstIN" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                                    <ErrorMessage name="gstIN" component="div" className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm">Payment Method</label>
                                    <Field as="select" name="paymentMethod" className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm">
                                        <option value="">Select PayMode</option>
                                        <option value="online">Online</option>
                                        <option value="cash">Cash</option>
                                    </Field>
                                    <ErrorMessage name="paymentMethod" component="div" className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm">A/C No.</label>
                                    <Field type="text" name="accountNo" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                                    <ErrorMessage name="accountNo" component="div" className="text-red-600 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm">IFSC Code</label>
                                    <Field type="text" name="ifscCode" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                                    <ErrorMessage name="ifscCode" component="div" className="text-red-600" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm">Bank Name</label>
                                    <Field type="text" name="bankName" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                                    <ErrorMessage name="bankName" component="div" className="text-red-600" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm">Supplier Type</label>
                                    <Field as="select" name="supplierType" className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm">
                                        <option value="">Select Supplier</option>
                                        <option value="Whole">Whole Saler</option>
                                        <option value="Retailer">Retailer</option>
                                    </Field>
                                    <ErrorMessage name="supplierType" component="div" className="text-red-600 text-sm" />
                                </div>
                            </div>
                            <div className="flex justify-start w-full space-x-4 py-4">
                                <button type="button" onClick={handleRefresh} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900 text-sm">Refresh</button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900 text-sm"
                                >
                                    {isEdit ? "Update" : "Save"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            <div className="bg-white p-2 my-4  rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Supplier Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">State</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">City</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Supplier Type</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Phone No.</th>
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
                                            <td className="px-4 py-3 border border-gray-200">{transaction.supplierName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.state}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.city}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.supplierType}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.phoneNo}</td>
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
           
        </div>
    );
};



export default withAuth(Supplier, ['DOCTOR', 'ADMIN', 'SUPERADMIN'])



// 'use client'
// import LayoutForm from "../../layouts/layoutForm";
// import Heading from "../../(components)/heding";
// import { FaPencilAlt } from "react-icons/fa";
// import apiClient from "apiClient";
// import { BaseUrl } from "@/app/config";
// import { useState, useEffect } from "react";


// export default function CategoryMaster() {
//     return (
//         <LayoutForm>
//             <Heading headingText="Supplier Master" />
//             <Supplierform />
//         </LayoutForm>
//     );
// }

// const Supplierform = () => {

//     const [isEdit, setIsEdit] = useState(false);
//     const [data, setData] = useState([]);
//     const [inputs, setInputs] = useState({
//         supplierId: 0,
//         supplierName: "",
//         address: "",
//         phoneNo: "",
//         pinCode: "",
//         state: "",
//         city: "",
//         openBalance: 0,
//         date: "",
//         gstIN: "",
//         paymentMethod: "",
//         accountNo: "",
//         ifscCode: "",
//         bankName: "",
//         supplierType: ""
//     });


//     // Fetch all room types
//     const fetchApi = async () => {
//         try {
//             const response = await apiClient.get(`${BaseUrl}spplierData/getAllData`);
//             setData(response.data.data);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     useEffect(() => {
//         fetchApi();
//     }, []);


//     // Handle saving or updating the room type
//     const handleSupplier = async (e) => {
//         e.preventDefault();
//         try {
//             if (isEdit) {
//                 // Corrected Update API call with room id
//                 const response = await apiClient.put(
//                     `${BaseUrl}spplierData/updateData/byId`, // Fixed URL construction
//                     inputs
//                 );
//                 if (response.status === 200) {
//                     toast.error("Data updated successfully");
//                     setIsEdit(false); // Reset edit state after update
//                 } else {
//                     toast.error("Update failed! Please try again");
//                 }
//             } else {
//                 // Save API call for new room type
//                 const response = await apiClient.post(
//                     `${BaseUrl}spplierData/save`,
//                     inputs
//                 );
//                 if (response.status === 200) {
//                     toast.error("Data saved successfully");
//                 } else {
//                     toast.error("Save failed! Please try again");
//                 }
//             }
//             fetchApi(); // Refresh the list of room types after save or update
//             setInputs({
//                 supplierId: 0,
//                 supplierName: "",
//                 address: "",
//                 phoneNo: "",
//                 pinCode: "",
//                 state: "",
//                 city: "",
//                 openBalance: 0,
//                 date: "",
//                 gstIN: "",
//                 paymentMethod: "",
//                 accountNo: "",
//                 ifscCode: "",
//                 bankName: "",
//                 supplierType: ""
//              });
//         } catch (error) {
//             console.error("Error handling room type:", error);
//             toast.error("An error occurred. Please try again.");
//         }
//     };


//     // Set the form fields for editing a room type
//     const handleUpdate = (supplier) => {
//         setInputs({
//             supplierId: supplier.supplierId,
//             supplierName: supplier.supplierName,
//             address: supplier.address,
//             phoneNo: supplier.phoneNo,
//             pinCode: supplier.pinCode,
//             state: supplier.state,
//             city: supplier.city,
//             openBalance: supplier.openBalance,
//             date: supplier.date,
//             gstIN: supplier.gstIN,
//             paymentMethod: supplier.paymentMethod,
//             accountNo: supplier.accountNo,
//             ifscCode: supplier.ifscCode,
//             bankName: supplier.bankName,
//             supplierType: supplier.supplierType
//         });
//         setIsEdit(true);
//     };


//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setInputs((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     const states = [
//         "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
//         "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
//         "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
//         "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
//         "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
//         "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
//         "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep",
//         "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
//     ];

//     //state name
//     const handleStateChange = (e) => {
//         console.log(e.target.value);  // You can use this value to set the selected state in your state.
//         setInputs({ ...inputs, state: e.target.value });
//     };

    


//     return (
//         <div className='p-6'>
//             <div className='p-7'>
//                 <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
//                     <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 m-2 ">
//                         <div>
//                             <label className="block text-gray-700">Supplier Name</label>
//                             <input type="text"
//                                 className='w-full px-4 py-2 border rounded-lg focus:outline-none'
//                                 name="supplierName"
//                                 onChange={handleChange}
//                                 value={inputs.supplierName}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">Address</label>
//                             <input type="text"
//                                 className='w-full px-4 py-2 border rounded-lg focus:outline-none'
//                                 name="address"
//                                 onChange={handleChange}
//                                 value={inputs.address}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">Phone No.</label>
//                             <input type="text"
//                                 className='w-full px-4 py-2 border rounded-lg focus:outline-none'
//                                 name="phoneNo"
//                                 onChange={handleChange}
//                                 value={inputs.phoneNo}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">Pin Code</label>
//                             <input type="text"
//                                 className='w-full px-4 py-2 border rounded-lg focus:outline-none'
//                                 name="pinCode"
//                                 onChange={handleChange}
//                                 value={inputs.pinCode}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">State</label>
//                             <select onChange={handleStateChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none">
//                                 {states.map((state, index) => (
//                                     <option key={index} value={state}>
//                                         {state}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">City</label>
//                             <input type="text"
//                                 className='w-full px-4 py-2 border rounded-lg focus:outline-none'
//                                 name="city"
//                                 onChange={handleChange}
//                                 value={inputs.city}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">Open Balance</label>
//                             <input type="text"
//                                 className='w-full px-4 py-2 border rounded-lg focus:outline-none'
//                                 name="openBalance"
//                                 onChange={handleChange}
//                                 value={inputs.openBalance}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">Date</label>
//                             <input type="date"
//                                 className='w-full px-4 py-2 border rounded-lg focus:outline-none'
//                                 name="date"
//                                 onChange={handleChange}
//                                 value={inputs.date}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">GSTIN No.</label>
//                             <input type="text"
//                                 className='w-full px-4 py-2 border rounded-lg focus:outline-none'
//                                 name="gstIN"
//                                 onChange={handleChange}
//                                 value={inputs.gstIN}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">Pyment Method</label>
//                         <select
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//                                 name="paymentMethod"
//                                 onChange={handleChange}
//                                 value={inputs.paymentMethod}>
//                                 <option>Select PayMode </option>
//                                 <option value="online">Online </option>
//                                 <option value="cash">Cash</option>
//                             </select>
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">A/C No.</label>
//                             <input type="text"
//                                 className='w-full px-4 py-2 border rounded-lg focus:outline-none'
//                                 name="accountNo"
//                                 onChange={handleChange}
//                                 value={inputs.accountNo}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">IFSC Code</label>
//                             <input type="text"
//                                 className='w-full px-4 py-2 border rounded-lg focus:outline-none'
//                                 name="ifscCode"
//                                 onChange={handleChange}
//                                 value={inputs.ifscCode}
//                             />
//                         </div>
//                         {/* <div>
//                             <label className="block text-gray-700">Bank Balance</label>
//                             <input type="text"
//                                 className='w-full px-4 py-2 border rounded-lg focus:outline-none'
//                                 name="relatonName"
//                                 onChange={handleChange}
//                                 value={inputs.relatonName}
//                             />
//                         </div> */}
//                         <div>
//                             <label className="block text-gray-700">Bank Name</label>
//                             <input type="text"
//                                 className='w-full px-4 py-2 border rounded-lg focus:outline-none'
//                                 name="bankName"
//                                 onChange={handleChange}
//                                 value={inputs.bankName}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-gray-700">Supplier Type</label>
//                             {/* <input type="text"
//                                 className='w-full px-4 py-2 border rounded-lg focus:outline-none'
//                                 name="supplierType"
//                                 onChange={handleChange}
//                                 value={inputs.supplierType}
//                             /> */}
//                             <select
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//                                 name="supplierType"
//                                 onChange={handleChange}
//                                 value={inputs.supplierType}>
//                                 <option>Select Supplire </option>
//                                 <option value="Whole">Whole Saler</option>
//                                 <option value="Retailer">Retailer</option>
//                             </select>
//                         </div>

//                     </div>
//                     <div className="flex justify-start w-full space-x-4 p-2">
//                         <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900" type="button" >Refresh</button>
//                         <button
//                             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900"
//                             onClick={handleSupplier}
//                         >
//                             {isEdit ? "Update" : "Save"}
//                         </button>
//                     </div>
//                 </form>
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
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Supplier Name</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">State</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">City</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Supplier Type </th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Phone No.</th>
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
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.supplierName}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.state}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.city}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.supplierType}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.phoneNo}</td>

//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="6" className="text-center">No data available</td>
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
