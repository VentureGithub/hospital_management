'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import Icon from "../../(components)/Icon";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';


export function ServiceTypeMaster() {
    return (
        <LayoutForm>
           
            <ServiceTypeMasterform />
            <Icon message={"This page is for managing IPD service types. You can view, add, or update different types of inpatient services, such as ( Hospital Bill, IPD Extra Services) "} />
        </LayoutForm>
    );
}



const ServiceTypeMasterform = () => {
    const [data, setData] = useState([]);
    // const [inputs, setInputs] = useState({
    //     id : 0,
    //     serviceTypeName : "",
    //     description : ""
    // });


    
    // Fetch all room types
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`servicetypemaster/getAll`);
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
        id : 0,
        serviceTypeName : "",
        description : ""
    },
    validationSchema: Yup.object({
        serviceTypeName: Yup.string().required('Service Type Name is required'),
    }),
    onSubmit: async (values) => {

        const response = await apiClient.post(
          `servicetypemaster/saveServiceTypeMaster`,values
        );
        debugger;
        if (response.status == "200") {
          toast.success("Data is saved successfull");
          fetchApi();
          formik.resetForm();
        }
        else {
          toast.error("Failed! Please try again")
        }
        console.log("response", response.data.data);
      
    }

});

const handleRefresh = () => {
    formik.resetForm(); // Clear form fields
};


    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
             <Heading headingText="Service Type " />
            <div className='py-4'>
                <form className='lg:w-[50%] md:w-[100%] sm:w-[100%]' onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2 ">
                        <div>
                                <label className="block font-semibold text-sm">Service Type Name</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${formik.touched.serviceTypeName && formik.errors.serviceTypeName ? 'border-red-500' : ''}`}                                    
                                    placeholder="Service Type Name"
                                    name="serviceTypeName"
                                    
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.serviceTypeName}
                                />
                                 {formik.touched.serviceTypeName && formik.errors.serviceTypeName ? (
                                    <div className="text-red-500 text-sm">{formik.errors.serviceTypeName}</div>
                                ) : null}
                        </div> 
                        <div>
                                <label className="block font-semibold text-sm">Description</label>

                            <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none shadow-md text-sm"
                                    placeholder="Enter description"
                                    onChange={formik.handleChange}
                                    name="description"
                                    onBlur={formik.handleBlur}
                                    value={formik.values.description} />
                          
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 py-4">
                        <button className="bg-gray-600 text-white px-6 text-sm py-2 rounded-lg hover:bg-gray-900" type="button" onClick={handleRefresh} >Refresh</button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-900"
                            type="submit"
                        >
                        
                            save
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
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr. No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Service Type Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                    
                                            <td className="px-4 py-3 border border-gray-200">{index+1}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{transaction.serviceTypeName}</td>
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

export default withAuth(ServiceTypeMaster, ['SUPERADMIN', 'ADMIN','DOCTOR'])


// 'use client';
// import LayoutForm from "../../layouts/layoutForm";
// import Heading from "../../(components)/heding";
// import { useState, useEffect } from "react";
// import apiClient from "apiClient";
// import { BaseUrl } from "@/app/config"; // Assuming you have a BaseUrl in config
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';

// export default function Opd() {
//     return (
//         <LayoutForm>
//             <Heading headingText="Service Type " />
//             <ServiceTypeMasterform />
//         </LayoutForm>
//     );
// }

// const ServiceTypeMasterform = () => {
//     const [data, setData] = useState([]);

//     // Fetch all service types
//     const fetchApi = async () => {
//         try {
//             const response = await apiClient.get(`${BaseUrl}servicetypemaster/getAll`);
//             setData(response.data.data);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     useEffect(() => {
//         fetchApi();
//     }, []);

//     // Form validation schema
//     const validationSchema = Yup.object().shape({
//         serviceTypeName: Yup.string().required("Service Type Name is required."),
//         description: Yup.string().required("Description is required.")
//     });

//     // Handle saving or updating the service type
//     const handleServiceTypeMaster = async (values, { resetForm }) => {
//         try {
//             const response = await apiClient.post(
//                 `${BaseUrl}servicetypemaster/saveServiceTypeMaster`, values
//             );
//             if (response.status === 200) {
//                 toast.success("Data saved successfully");
//                 fetchApi(); // Refresh the data
//                 resetForm(); // Reset the form
//             } else {
//                 toast.success("Failed! Please try again");
//             }
//             console.log("response", response.data.data);
//         } catch (error) {
//             console.error("Error saving data:", error);
//         }
//     };
    

//     return (
//         <div className='p-6'>
//             <div className='p-7'>
//                 <Formik
//                     initialValues={{
//                         serviceTypeName: "",
//                         description: ""
//                     }}
//                     validationSchema={validationSchema}
//                     onSubmit={handleServiceTypeMaster}
//                 >
//                     {({ isSubmitting }) => (
//                         <Form className='lg:w-[60%] md:w-[100%] sm:w-[100%]'>
//                             <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2">
//                                 <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                                     <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
//                                         <label className="block font-semibold">Service Type Name</label>
//                                     </div>
//                                     <div className="w-full sm:w-[80%]">
//                                         <Field
//                                             type="text"
//                                             name="serviceTypeName"
//                                             className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//                                             placeholder="Service Type Name"
//                                         />
//                                         <ErrorMessage name="serviceTypeName" component="div" className="text-red-500" />
//                                     </div>
//                                 </div>
//                                 <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                                     <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
//                                         <label className="block font-semibold">Description</label>
//                                     </div>
//                                     <div className="w-full sm:w-[80%]">
//                                         <Field
//                                             type="text"
//                                             name="description"
//                                             className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//                                             placeholder="Description"
//                                         />
//                                         <ErrorMessage name="description" component="div" className="text-red-500" />
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="flex justify-start w-full space-x-4 p-2">
//                                 <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900" type="button" onClick={fetchApi}>Refresh</button>
//                                 <button
//                                     className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900"
//                                     type="submit"
//                                     disabled={isSubmitting}
//                                 >
//                                     Save
//                                 </button>
//                             </div>
//                         </Form>
//                     )}
//                 </Formik>
//             </div>
//             <div className="bg-white p-2 m-4 md:p-2 rounded-lg shadow-md">
//                 <div className="overflow-x-auto">
//                     <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
//                         <table className="table-auto w-full border border-collapse shadow">
//                             <thead>
//                                 <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr. No.</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Service Type Name</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Description</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {Array.isArray(data) && data.length > 0 ? (
//                                     data.map((transaction, index) => (
//                                         <tr key={index} className="border border-gray-200 text-center">
//                                             <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.serviceTypeName}</td>
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
