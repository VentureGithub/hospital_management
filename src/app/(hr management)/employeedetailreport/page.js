// 'use client';
// import LayoutForm from "../../layouts/layoutForm";
// import Heading from "../../(components)/heding";
// import { useState, useEffect } from "react";
// import apiClient from "@/app/config";
// import withAuth from '@/app/(components)/WithAuth';

// export function EmployeeDetail() {
//     return (
//         <LayoutForm>
//             <EmployeeDetailform />
//         </LayoutForm>
//     );
// }

// const EmployeeDetailform = () => {
//     const [dept, setDept] = useState([]); // Initialize as array
//     const [selectedDept, setSelectedDept] = useState(''); // State for selected department

//     const fetchDep = async () => {
//         try {
//             const response = await apiClient.get(`dep/getAllDepartment`);
//             setDept(response.data.data); // Set department data
//         } catch (error) {
//             console.error("Error fetching departments:", error);
//         }
//     };

//     useEffect(() => {
//         fetchDep();
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!selectedDept) {
//             toast.error('Please select a department.');
//             return;
//         }

//         try {
//             const response = await apiClient.get(`emp/generateEmployeeReport`, {
//                 params: {
//                     deptId: selectedDept, // Pass the selected department ID
//                 },
//                 responseType: 'blob', // Handle binary response
//             });

//             if (response.status === 200) {
//                 const blob = new Blob([response.data], { type: 'application/pdf' });
//                 const blobUrl = URL.createObjectURL(blob);
//                 window.open(blobUrl, '_blank'); // Open PDF in a new tab
//             } else {
//                 toast.error('Failed to generate the PDF report.');
//             }
//         } catch (error) {
//             console.error('Error fetching the PDF report:', error);
//             toast.error('Failed to generate the PDF report. Please try again.');
//         }
//     };

//     return (
//         <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
//              <Heading headingText={"Employee Detail Report"} />
//             <div className='py-4'>
//                 <form className='lg:w-[100%] md:w-[80%] sm:w-[100%]' onSubmit={handleSubmit}>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                         <div className="mb-5">
//                             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department</label>
//                             <select onChange={(e) => setSelectedDept(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm">
//                                 <option value="">Select Department</option>
//                                 {dept.map((department) => (
//                                     <option key={department.deptId} value={department.deptId}>{department.depName}</option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     <div className="flex justify-start w-full space-x-4 p-2">
//                         <button type="submit" className="bg-green-600 text-white px-6 text-sm py-2 rounded-lg hover:bg-green-900">
//                             Search
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default withAuth(EmployeeDetail, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);



'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';  // Import Yup for validation

// Validation schema using Yup
const validationSchema = Yup.object({
    selectedDept: Yup.string().required('Department is required'),
});

export function EmployeeDetail() {
    return (
        <LayoutForm>
            <EmployeeDetailform />
        </LayoutForm>
    );
}

const EmployeeDetailform = () => {
    const [dept, setDept] = useState([]); // Initialize as array

    const fetchDep = async () => {
        try {
            const response = await apiClient.get(`dep/getAllDepartment`);
            setDept(response.data.data); // Set department data
        } catch (error) {
            console.error("Error fetching departments:", error);
        }
    };

    useEffect(() => {
        fetchDep();
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        // Prevent form submission if validation fails
        if (!values.selectedDept) {
            toast.error('Please select a department.');
            setSubmitting(false);
            return;
        }

        try {
            const response = await apiClient.get(`emp/generateEmployeeReport`, {
                params: {
                    deptId: values.selectedDept, // Pass the selected department ID
                },
                responseType: 'blob', // Handle binary response
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, '_blank'); // Open PDF in a new tab
            } else {
                toast.error('Failed to generate the PDF report.');
            }
        } catch (error) {
            console.error('Error fetching the PDF report:', error);
            toast.error('Failed to generate the PDF report. Please try again.');
        }
        setSubmitting(false);
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl'>
            <Heading headingText={"Employee Detail Report"} />
            <div className='py-4'>
                <Formik
                    initialValues={{ selectedDept: '' }} // Initial form values
                    validationSchema={validationSchema} // Validation schema
                    onSubmit={handleSubmit} // Handle form submission
                >
                    {({ isSubmitting }) => (
                        <Form className='lg:w-[100%] md:w-[80%] sm:w-[100%]'>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="mb-5">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department</label>
                                    <Field
                                        as="select"
                                        name="selectedDept"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                    >
                                        <option value="">Select Department</option>
                                        {dept.map((department) => (
                                            <option key={department.deptId} value={department.deptId}>{department.depName}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="selectedDept" component="div" className="text-red-600 text-sm mt-1" />
                                </div>
                            </div>

                            <div className="flex justify-start w-full space-x-4 p-2">
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-6 text-sm py-2 rounded-lg hover:bg-green-900"
                                    disabled={isSubmitting} // Disable the button during submission
                                >
                                    {isSubmitting ? 'Generating Report...' : 'Search'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default withAuth(EmployeeDetail, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
