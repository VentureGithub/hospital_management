
'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import Icon from "../../(components)/icon";
import { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';

export function Medicinecategory() {
    return (
        <LayoutForm>
            <Medicinecategoryform />
            <Icon message={"This page is for managing medicine category details for example ( Antibiotics, Vaccines ). You can view, add, or update different medicine categories "} />
        </LayoutForm>
    );
}


const Medicinecategoryform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);

    // Fetch all categories
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`medicineCategory/getAllMedicineCategory`);
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
            categoryName: "",
            // categoryId: 0,
        },
        validationSchema: Yup.object({
            // categoryId: Yup.number()
            //     .required('Category ID is required'),
            categoryName: Yup.string()
                .required('Category Name is required')
                .min(2, 'Category Name must be at least 2 characters')
                .max(50, 'Category Name cannot exceed 50 characters')
                .matches(/^[a-zA-Z0-9\s]+$/, 'Category Name can only contain letters, numbers, and spaces')
                .matches(/^\S+(?: \S+)*$/, 'Category Name should not have leading or trailing spaces'),
        }),
        onSubmit: async (values) => {
            try {
                if (isEdit) {
                    const response = await apiClient.put(
                        `medicineCategory/updateMedicineCategory?Id=${values.categoryId}`,
                        values
                    );
                    if (response.status === 200) {
                        toast.success("Data updated successfully");
                        setIsEdit(false); // Reset edit state
                    } else {
                        toast.error("Update failed! Please try again");
                    }
                } else {
                    const response = await apiClient.post(
                        `medicineCategory/saveMedCategory`,
                        values
                    );
                    if (response.status === 200) {
                        toast.success("Data saved successfully");
                    } else {
                        toast.error("Save failed! Please try again");
                    }
                }
                fetchApi(); // Refresh the list after save or update
                formik.resetForm(); // Reset the form
            } catch (error) {
                console.error("Error handling category:", error);
                toast.error("An error occurred. Please try again.");
            }
        }
    });

    // Set the form fields for editing a category
    const handleUpdate = (category) => {
        formik.setValues({
            categoryId: category.categoryId,
            categoryName: category.categoryName,
        });
        setIsEdit(true);
    };

    const handleRefresh = () => {
        formik.resetForm(); // Clear form fields
        setIsEdit(false); // Reset edit state
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
             <Heading headingText="Medicine Category" />
            <div className='py-4'>
                <form onSubmit={formik.handleSubmit} className='lg:w-[50%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2 ">
                        {/* <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Id</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.categoryId && formik.errors.categoryId ? 'border-red-500' : ''}`}
                                    placeholder="id"
                                    name="categoryId"
                                    value={formik.values.categoryId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    readOnly
                                />
                               
                            </div>
                        </div> */}
                        <div >
                                <label className="block font-semibold text-sm">Category Name</label>
                      
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.categoryName && formik.errors.categoryName ? 'border-red-500' : ''}`}
                                    placeholder="category"
                                    name="categoryName"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.categoryName}
                                />
                                {formik.touched.categoryName && formik.errors.categoryName ? (
                                    <div className="text-red-500 text-sm">{formik.errors.categoryName}</div>
                                ) : null}
                           
                        </div>
                    </div>
                    <div className="flex justify-start w-full text-sm space-x-4 p-2">
                        <button 
                            type="button" 
                            className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900" 
                            onClick={handleRefresh}
                        >
                            Refresh
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white p-2 my-4 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                    {/* <th className="px-4 py-2 border border-gray-200 text-sky-500">Id</th> */}
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Category Name</th>
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
                                            {/* <td className="px-4 py-3 border border-gray-200 uppercase">{transaction.categoryId}</td> */}
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{transaction.categoryName}</td>
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



export default withAuth(Medicinecategory, ['SUPERADMIN', 'ADMIN','DOCTOR'])






// 'use client'
// import LayoutForm from "../../layouts/layoutForm";
// import Heading from "../../(components)/heding";
// import { FaPencilAlt } from "react-icons/fa";
// import apiClient from "apiClient";
// import { BaseUrl } from "@/app/config";
// import { useState, useEffect } from "react";


// export default function Opd() {
//     return (
//         <LayoutForm>
//             <Heading headingText="Medicine Category " />
//             <Medicinecategoryform />
//         </LayoutForm>
//     );
// }

// const Medicinecategoryform = () => {

//     const [isEdit, setIsEdit] = useState(false);
//     const [data, setData] = useState([]);
//     const [inputs, setInputs] = useState({
//             categoryName : "",
//             categoryId : 0
//           });


//     // Fetch all room types
//     const fetchApi = async () => {
//         try {
//             const response = await apiClient.get(`${BaseUrl}medicineCategory/getAllMedicineCategory`);
//             setData(response.data.data);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     useEffect(() => {
//         fetchApi();
//     }, []);


//     // Handle saving or updating the room type
//     const handleMedicinecategory = async (e) => {
//         e.preventDefault();
//         try {
//             if (isEdit) {
//                 // Corrected Update API call with room id
//                 const response = await apiClient.put(
//                     `${BaseUrl}medicineCategory/updateMedicineCategory?Id=${inputs.categoryId}`, // Fixed URL construction
//                     inputs
//                 );
//                 if (response.status === 200) {
//                     alert("Data updated successfully");
//                     setIsEdit(false); // Reset edit state after update
//                 } else {
//                     alert("Update failed! Please try again");
//                 }
//             } else {
//                 // Save API call for new room type
//                 const response = await apiClient.post(
//                     `${BaseUrl}medicineCategory/saveMedCategory`,
//                     inputs
//                 );
//                 if (response.status === 200) {
//                     alert("Data saved successfully");
//                 } else {
//                     alert("Save failed! Please try again");
//                 }
//             }
//             fetchApi(); // Refresh the list of room types after save or update
//             setInputs({ categoryId: 0, categoryName: "", });
//         } catch (error) {
//             console.error("Error handling room type:", error);
//             alert("An error occurred. Please try again.");
//         }
//     };


//     // Set the form fields for editing a room type
//     const handleUpdate = (category) => {
//         setInputs({
//             categoryId: category.categoryId,
//             categoryName: category.categoryName,
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

//     return (
//         <div className='p-6'>
//             <div className='p-7'>
//                 <form className='lg:w-[60%] md:w-[100%] sm:w-[100%]'>
//                     <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2 ">
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
//                                 <label className="block font-semibold">Id</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//                                     placeholder="id"
//                                     name="categoryId"
//                                     value={inputs.categoryId}
//                                     onChange={handleChange}
                                    
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
//                                 <label className="block font-semibold">Category Name</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//                                     placeholder="category"
//                                     name="categoryName"
//                                     onChange={handleChange}
//                                     value={inputs.categoryName}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                     <div className="flex justify-start w-full space-x-4 p-2">
//                         <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900" type="button" >Refresh</button>
//                         <button
//                             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900"
//                             onClick={handleMedicinecategory}
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
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">id</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Category Name</th>
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
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.categoryId}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.categoryName}</td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="3" className="text-center">No data available</td>
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
