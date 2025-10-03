'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import Icon from "../../(components)/Icon";
import { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';


export function RoomType() {
    return (
        <LayoutForm>
            <RoomTypeform />
            <Icon message={"This page is for managing room type details. You can view, add, or update different room types, such as ICU, NICU and Private Room."} />
        </LayoutForm>
    );
}



const RoomTypeform = () => {

    const [data, setData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);


    // Fetch all room types
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`roomTypeMaster/getAllDetailofRoomTypeMaster`);
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
        roomTypeId: 0,
        roomTypeName: "",
        description: ""
    },
    validationSchema: Yup.object({
        roomTypeName: Yup.string()
            .required('Room Type Name is required')
            .matches(/^[a-zA-Z0-9\s]+$/, 'Department Name can only contain letters, numbers, and spaces'),
    }),
    onSubmit: async (values) => {
        try {
            if (isEdit) {
                // Corrected Update API call with room id
                const response = await apiClient.put(
                    `roomTypeMaster/updateRoomTypeMaster?id=${values.roomTypeId}`, // Fixed URL construction
                    values
                );
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false); // Reset edit state after update
                } else {
                    toast.error("Update failed! Please try again");
                }
            } else {
                // Save API call for new room type
                const response = await apiClient.post(
                    `roomTypeMaster/saveRoomType`,
                    values
                );
                if (response.status === 202) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error("Save failed! Please try again");
                }
            }
            fetchApi(); // Refresh the list of room types after save or update
            formik.resetForm(); 
        } catch (error) {
            console.error("Error handling room type:", error);
            toast.error("An error occurred. Please try again.");
        }
    }
   });



    
    
    const handleUpdate = (roomType) => {
        formik.setValues({
            roomTypeId: roomType.roomTypeId,
            roomTypeName: roomType.roomTypeName,
            description: roomType.description
        });
        setIsEdit(true);
    };


    const handleRefresh = () => {
        formik.resetForm(); // Clear form fields
        setIsEdit(false); // Reset edit state
    };

    



    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="Room Type " />
            <div className='py-4'>
                <form className='lg:w-[50%] md:w-[100%] sm:w-[100%]' onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2 ">
                        <div>
                                <label className="block font-semibold text-sm">Room Type</label>
                       
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none ${formik.touched.roomTypeName && formik.errors.roomTypeName ? 'border-red-500' : ''}`} placeholder="Room Type"
                                    name="roomTypeName"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.roomTypeName}
                                />
                                {formik.touched.roomTypeName && formik.errors.roomTypeName ? (
                                    <div className="text-red-500 text-sm">{formik.errors.roomTypeName}</div>
                                ) : null}
                            
                        </div>
                        <div>
                                <label className="block font-semibold text-sm">Description</label>
                           
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none `}
                                    placeholder="Description"
                                    name="description"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.description}
                                />
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 py-4">
                        <button className="bg-gray-600 text-white px-6 py-2 text-sm rounded-lg hover:bg-gray-900" type="button" onClick={handleRefresh} >Refresh</button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-900"
                            type="submit"
                         
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-2 my-4  rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Room Type</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Description</th>
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
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{transaction.roomTypeName}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{transaction.description}</td>
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


export default withAuth(RoomType, ['SUPERADMIN', 'ADMIN','DOCTOR'])














// 'use client'
// import LayoutForm from "../../layouts/layoutForm";
// import Heading from "../../(components)/heding";
// import { FaPencilAlt } from "react-icons/fa";
// import useRoomTypeMasterForm from "@/app/hooks/useRoomTypeMaster";

// export default function Opd() {
//     return (
//         <LayoutForm>
//             <Heading headingText="Room Type " />
//             <RoomTypeform />
//         </LayoutForm>
//     );
// }

// const RoomTypeform = () => {

//     const {
//         inputs,
//         data,
//         isEdit,
//         handleRoom,
//         handleUpdate,
//         handleChange
//     }= useRoomTypeMasterForm();

//     return (
//         <div className='p-6'>
//             <div className='p-7'>
//                 <form className='lg:w-[60%] md:w-[100%] sm:w-[100%]'>
//                     <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2 ">
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
//                                 <label className="block font-semibold">Room Type</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//                                     placeholder="Room Type"
//                                     name="roomTypeName"
//                                     value={inputs.roomTypeName}
//                                     onChange={handleChange}
                                    
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
//                                 <label className="block font-semibold">Description</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//                                     placeholder="Description"
//                                     name="description"
//                                     onChange={handleChange}
//                                     value={inputs.description}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                     <div className="flex justify-start w-full space-x-4 p-2">
//                         <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900" type="button" >Refresh</button>
//                         <button
//                             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900"
//                             onClick={handleRoom}
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
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Room Type</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Description</th>
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
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.roomTypeName}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.description}</td>
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
