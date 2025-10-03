'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export function DesignationMaster() {
    return (
        <LayoutForm>
            <DesignationMasterform />
           </LayoutForm>
        
    );
}




const DesignationMasterform = () => {
    const [data, setData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);


    // table
    const fetchApi = async () => {
        try {
            const response = await apiClient.get("designationmaster/getAll");
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
   designationId: 0,
        designationName: ""
    },
    validationSchema: Yup.object({
        designationName: Yup.string()
            .required('Designation Name is required')
            .matches(/^[a-zA-Z\s]+$/, 'Designation Name should only contain letters and spaces'),
    }),
    onSubmit: async (values) => {
        try {
            if (isEdit) {
                // Corrected Update API call with room id
                const response = await apiClient.put(
                    `designationmaster/update`, // Fixed URL construction
                    values
                );
                if (response.status == 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false); // Reset edit state after update
                } else {
                    toast.error("Update failed! Please try again");
                }
            } else {
                // Save API call for new room type
                const response = await apiClient.post(
                    "designationmaster/create",
                    values
                );
                console.log(response.data.data)
                if (response.status == 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error("Save failed! Please try again");
                }
            }
            fetchApi(); // Refresh the list of room types after save or update
            formik.resetForm(); 
        } catch (error) {
            console.error("Error handling :", error);
            toast.error("An error occurred. Please try again.");
        }

    }
});



    const handleUpdate = (designation) => {
        formik.setValues({
         designationId: designation.designationId,
         designationName: designation.designationName
        });
        setIsEdit(true);
    };


    const handleRefresh = () => {
        formik.resetForm(); // Clear form fields
        setIsEdit(false); // Reset edit state
    };





    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="Designation Master " />
            <div className='py-4'>
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]' onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-3 m-2 ">
                        <div>
                                <label className="block font-semibold text-sm">Designation Name</label>
                                <input type="text" className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.designationName && formik.errors.designationName ? 'border-red-500' : ''}`} placeholder=""
                                    name="designationName"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.designationName}
                                />
                                 {formik.touched.designationName && formik.errors.designationName ? (
                                    <div className="text-red-500 text-sm">{formik.errors.designationName}</div>
                                ) : null}
                        </div>

                    </div>
                    <div className="flex justify-start my-4  w-full space-x-4 p-2 ">
                        <button className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900" type="button" onClick={handleRefresh}>Refresh</button>
                        <button
                            className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
                            type="submit"
                            
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-white p-2 my-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Designation Name</th>

                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr
                                            key={index}
                                            className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button className="text-blue-400 hover:text-blue-800 flex items-center"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.designationName}</td>


                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <p className="text-red-600 font-medium">Note: A master could not be delete if used anywhere</p>
        </div>
    );
};

export default withAuth(DesignationMaster, ['SUPERADMIN', 'ADMIN','DOCTOR'])