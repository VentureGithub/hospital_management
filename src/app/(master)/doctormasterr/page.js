"use client";
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useEffect, useState } from "react";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';

export function DoctorMaster() {
    return (
        <LayoutForm>
            <DoctorMasterform />
           </LayoutForm>
    );
}

const DoctorMasterform = () => {
    const [data, setData] = useState([]);
    const [drdata, setDrData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [qualifications, setQualifications] = useState([{ value: '', isOther: false }]);

    // Validation schema with array of qualifications
    const validationSchema = Yup.object({
        // doctorRegNo: Yup.string().required("Registration number is required")
        //     .matches(/^[0-9]+$/, 'Registration number can only contain numbers'),
        deptId: Yup.number()
            .required("Department is required")
            .positive("Department ID must be a positive number")
            .integer("Department ID must be an integer"),
        drName: Yup.string().required("Doctor name is required")
            .matches(/^[a-zA-Z\s]+$/, 'Department Name should only contain letters and spaces'),
        consultancyCharge: Yup.number()
            .required("Consultancy charge is required")
            .positive("Must be a positive number"),
        gender: Yup.string().required("Gender is required"),
        address: Yup.string().required("Address is required")
            .matches(/^[a-zA-Z\s]+$/, 'Department Name should only contain letters and spaces'),
        joiningDt: Yup.date().required("Joining date is required"),
        contactNo: Yup.string().required("Contact number is required")
            .matches(/^[0-9]+$/, 'Registration number can only contain numbers'),
    });

    const formik = useFormik({
        initialValues: {
            drId: 0,
            deptId: 0,
            doctorRegNo: "",
            drName: "",
            gender: "",
            address: "",
            contactNo: "",
            consultancyCharge: "",
            doctorCharge: "",
            joiningDt: "",
            age: "",
            licenceNo: "",
            doctorSpecialization: "",
            relievingDt: "",
            qualification: []
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                // Get qualifications array from the qualifications state
                const qualificationsArray = qualifications
                    .map(q => q.isOther ? q.otherValue : q.value)
                    .filter(q => q); // Remove empty values
    
                // Create submission object with qualifications as array
                const submissionValues = {
                    ...values,
                    qualification: qualificationsArray  // Send as array, not joined string
                };
    
                if (isEdit) {
                    const response = await apiClient.put(
                        `doc/updateDocDetails?doctorId=${values.drId}`,
                        submissionValues
                    );
                    if (response.status === 200) {
                        toast.success("Data updated successfully");
                        setIsEdit(false);
                        formik.resetForm();
                        setQualifications([{ value: '', isOther: false }]);
                        fetchApi();
                    }
                } else {
                    const response = await apiClient.post("doc/saveDoc", submissionValues);
                    if (response.status === 200) {
                        toast.success("Data saved successfully");
                        formik.resetForm();
                        setQualifications([{ value: '', isOther: false }]);
                        fetchApi();
                    }
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("An error occurred. Please try again.");
            }
        }
    });

    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`doc/getAllDoc`);
            setDrData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);


    useEffect(() => {
        const fetchRoomType = async () => {
            try {
                const response = await apiClient.get(`dep/getAllDepartmentByGrade?grade=A`);
                setData(response.data.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchRoomType();
    }, [])


const handleUpdate = (dr) => {
    try {
        console.log(dr)
        // Format joining date if it exists
        const formattedJoiningDate = dr.joiningDt ? new Date(dr.joiningDt).toISOString().split('T')[0] : '';


        // Update form values
        formik.setValues({
            drId: dr.drId || '',
            deptId: dr.deptId || '',
            doctorRegNo: dr.doctorRegNo || '',
            drName: dr.drName || '',
            gender: dr.gender || '',
            address: dr.address || '',
            contactNo: dr.contactNo || '',
            consultancyCharge: dr.consultancyCharge || '',
            doctorCharge: dr.doctorCharge || '',
            joiningDt: formattedJoiningDate,
            age: dr.age || '',
            licenceNo: dr.licenceNo || '',
            doctorSpecialization: dr.doctorSpecialization || '',
            // qualification: dr.qualification || '',
        });

        // Set edit mode
        setIsEdit(true);

        // Optionally scroll to form
        // window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error in handleUpdate:', error);
        // Optionally show error message to user
    }
};
    
    // Add new qualification field
    const addQualification = () => {
        setQualifications([...qualifications, { value: '', isOther: false }]);
    };

    // Remove qualification field
    const removeQualification = (index) => {
        const newQualifications = qualifications.filter((_, i) => i !== index);
        setQualifications(newQualifications);
    };

    // Handle qualification change
    const handleQualificationChange = (index, value) => {
        const newQualifications = [...qualifications];
        if (value === 'Other') {
            newQualifications[index] = { value: 'Other', isOther: true, otherValue: '' };
        } else {
            newQualifications[index] = { value, isOther: false };
        }
        setQualifications(newQualifications);
    };

    // Handle other qualification input
    const handleOtherQualificationChange = (index, value) => {
        const newQualifications = [...qualifications];
        newQualifications[index].otherValue = value;
        setQualifications(newQualifications);
    };


    return (
        <>
            <form onSubmit={formik.handleSubmit}>
            <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText={"Doctor Master"} />
                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 lg:w-[100%]  py-4">
                        <div>
                                <label className="block font-semibold text-sm">Reg. No.</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.doctorRegNo && formik.errors.doctorRegNo ? 'border-red-500' : ''}`}
                                    name="doctorRegNo"
                                    readOnly
                                    onChange={formik.handleChange}
                                    value={formik.values.doctorRegNo}
                                />
                                {formik.touched.doctorRegNo && formik.errors.doctorRegNo && (
                                    <div className="text-red-500 text-sm">{formik.errors.doctorRegNo}</div>
                                )}
                            
                        </div>
                        <div>
                                <label className="block font-semibold text-sm">Department</label>
                                <select
                                    name="deptId"
                                    onChange={formik.handleChange}
                                    value={formik.values.deptId}
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.deptId && formik.errors.deptId ? 'border-red-500' : ''}`}>
                                    <option value="">Select department</option>
                                    {data.map((dept) => (
                                        <option value={dept.deptId} key={dept.deptId}>{dept.depName}</option>
                                    ))}
                                </select>
                                {formik.touched.deptId && formik.errors.deptId && (
                                    <div className="text-red-500 text-sm">{formik.errors.deptId}</div>
                                )}
                        </div>
                        <div>
                                <label className="block font-semibold text-sm">Dr. Name</label>

                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.drName && formik.errors.drName ? 'border-red-500' : ''}`}
                                    name="drName"
                                    onChange={formik.handleChange}
                                    value={formik.values.drName}
                                />
                                {formik.touched.drName && formik.errors.drName && (
                                    <div className="text-red-500 text-sm">{formik.errors.drName}</div>
                                )}
                        </div>
                        <div>
                                <label className="block font-semibold text-sm">Charges</label>

                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.consultancyCharge && formik.errors.consultancyCharge ? 'border-red-500' : ''}`}
                                    name="consultancyCharge"
                                    onChange={formik.handleChange}
                                    value={formik.values.consultancyCharge}
                                />
                                {formik.touched.consultancyCharge && formik.errors.consultancyCharge && (
                                    <div className="text-red-500 text-sm">{formik.errors.consultancyCharge}</div>
                                )}
                           
                        </div>
                        <div>
                                <label className="block font-semibold text-sm">Dr. Charges</label>

                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.doctorCharge && formik.errors.doctorCharge ? 'border-red-500' : ''}`}
                                    name="doctorCharge"
                                    onChange={formik.handleChange}
                                    value={formik.values.doctorCharge}
                                />
                                {formik.touched.doctorCharge && formik.errors.doctorCharge && (
                                    <div className="text-red-500 text-sm">{formik.errors.doctorCharge}</div>
                                )}
                       
                        </div>
                        <div >
                                <label className="block font-semibold text-sm">Age</label>

                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.age && formik.errors.age ? 'border-red-500' : ''}`}
                                    name="age"
                                    onChange={formik.handleChange}
                                    value={formik.values.age}
                                />
                                {formik.touched.age && formik.errors.age && (
                                    <div className="text-red-500 text-sm">{formik.errors.age}</div>
                                )}
                        </div>
                        <div>
                                <label className="block font-semibold text-sm">licence No</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.licenceNo && formik.errors.licenceNo ? 'border-red-500' : ''}`}
                                    name="licenceNo"
                                    onChange={formik.handleChange}
                                    value={formik.values.licenceNo}
                                />
                                {formik.touched.licenceNo && formik.errors.licenceNo && (
                                    <div className="text-red-500 text-sm">{formik.errors.licenceNo}</div>
                                )}  
                        </div>
                        <div>
                                <label className="block font-semibold text-sm">Specialization</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.doctorSpecialization && formik.errors.doctorSpecialization ? 'border-red-500' : ''}`}
                                    name="doctorSpecialization"
                                    onChange={formik.handleChange}
                                    value={formik.values.doctorSpecialization}
                                />
                                {formik.touched.doctorSpecialization && formik.errors.doctorSpecialization && (
                                    <div className="text-red-500 text-sm">{formik.errors.doctorSpecialization}</div>
                                )}
                        </div>
                        <div>
                                <label className="block font-semibold text-sm">Gender</label>
                                <select
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.gender && formik.errors.gender ? 'border-red-500' : ''}`}
                                    name="gender"
                                    onChange={formik.handleChange}
                                    value={formik.values.gender}
                                >
                                    <option value="">--select gender--</option>
                                    <option value="male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                {formik.touched.gender && formik.errors.gender && (
                                    <div className="text-red-500 text-sm">{formik.errors.gender}</div>
                                )}
                        </div>
                        <div >
                                <label className="block font-semibold text-sm">Qualification</label>
                                {qualifications.map((qual, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <div className="flex-1">
                                            <select
                                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                                value={qual.value}
                                                onChange={(e) => handleQualificationChange(index, e.target.value)}
                                            >
                                                <option value="">Select Qualification</option>
                                                <option value="MBBS">MBBS</option>
                                                <option value="MD">MD</option>
                                                <option value="MS">MS</option>
                                                <option value="DM">DM</option>
                                                <option value="DNB">DNB</option>
                                                <option value="BDS">BDS</option>
                                                <option value="MDS">MDS</option>
                                                <option value="BAMS">BAMS</option>
                                                <option value="BHMS">BHMS</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {qual.isOther && (
                                                <input
                                                    type="text"
                                                    className="w-full mt-2 text-sm px-4 py-2  border rounded-lg focus:outline-none"
                                                    placeholder="Please specify qualification"
                                                    value={qual.otherValue || ''}
                                                    onChange={(e) => handleOtherQualificationChange(index, e.target.value)}
                                                />
                                            )}
                                        </div>
                                        <div className="flex ml-2">
                                            {index === qualifications.length - 1 && (
                                                <button
                                                    type="button"
                                                    onClick={addQualification}
                                                    className="bg-blue-500 text-white text-sm p-2 rounded-lg hover:bg-blue-700 mr-2"
                                                >
                                                    <FaPlus />
                                                </button>
                                            )}
                                            {qualifications.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeQualification(index)}
                                                    className="bg-red-500 text-white p-2 text-sm rounded-lg  hover:bg-red-700"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                          
                        </div>
                        <div>
                                <label className="block font-semibold text-sm">Address</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.address && formik.errors.address ? 'border-red-500' : ''}`}
                                    name="address"
                                    onChange={formik.handleChange}
                                    value={formik.values.address}
                                />
                                {formik.touched.address && formik.errors.address && (
                                    <div className="text-red-500 text-sm">{formik.errors.address}</div>
                                )}
                        
                        </div>
                        <div>
                                <label className="block font-semibold text-sm">Joining Date</label>
                                <input
                                    type="date"
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.joiningDt && formik.errors.joiningDt ? 'border-red-500' : ''}`}
                                    name="joiningDt"
                                    onChange={formik.handleChange}
                                    value={formik.values.joiningDt}
                                />
                                {formik.touched.joiningDt && formik.errors.joiningDt && (
                                    <div className="text-red-500 text-sm">{formik.errors.joiningDt}</div>
                                )}
                        </div>
                        <div>
                                <label className="block font-semibold text-sm">Relieving Date</label>
                                <input
                                    type="date"
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.relievingDt && formik.errors.relievingDt ? 'border-red-500' : ''}`}
                                    name="relievingDt"
                                    onChange={formik.handleChange}
                                    value={formik.values.relievingDt}
                                />
                                {formik.touched.relievingDt && formik.errors.relievingDt && (
                                    <div className="text-red-500 text-sm">{formik.errors.relievingDt}</div>
                                )}
                            </div>
                        <div >
                                <label className="block font-semibold text-sm">Contact No.</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none ${formik.touched.contactNo && formik.errors.contactNo ? 'border-red-500' : ''}`}
                                    name="contactNo"
                                    onChange={formik.handleChange}
                                    value={formik.values.contactNo}
                                />
                                {formik.touched.contactNo && formik.errors.contactNo && (
                                    <div className="text-red-500 text-sm">{formik.errors.contactNo}</div>
                                )}
                            </div>
                    </div>
                    <div className="flex justify-start my-4 space-x-4 p-2">

                        <button
                            type="button"
                            className="bg-gray-700 text-white px-4 text-sm py-2 rounded-lg hover:bg-gray-900"
                           
                        >
                            Refresh
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 text-sm py-2 rounded-lg hover:bg-green-900"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
           

           

            <div className="bg-white  my-2  rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>

                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Reg. No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Department</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Gender</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Qualification</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Charges</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Contact No</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Joining Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(drdata) && drdata.length > 0 ? (
                                    drdata.map((data, index) => (
                                        <tr
                                            key={index}
                                            className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                type="button"
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(data)}>
                                                    <FaPencilAlt className="mr-1" />
                                                </button>

                                            </td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{data.doctorRegNo}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{data.depName}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{data.drName}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{data.gender}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{data.qualification}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{data.consultancyCharge}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{data.contactNo}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{data.joiningDt}</td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="text-center">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            </div>
            </form>
            
           
        </>
    );
};


export default withAuth(DoctorMaster, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])




























// "use client";
// import LayoutForm from "../../layouts/layoutForm";
// import Heading from "../../(components)/heding";
// import { useEffect, useState } from "react";
// import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
// import Icon from "../../(components)/icon";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import apiClient from "@/app/config";
// import withAuth from '@/app/(components)/WithAuth';

// export function DoctorMaster() {
//     return (
//         <LayoutForm>
//             <Heading headingText={"Doctor Master"} />
//             <DoctorMasterform />
//             <Icon message={"This page is for managing doctor details. You can view, add, or update information about doctors, such as their name, specialization, contact details, charges, and dates of association with the hospital."} />
//         </LayoutForm>
//     );
// }

// const DoctorMasterform = () => {
//     const [data, setData] = useState([]);
//     const [drdata, setDrData] = useState([]);
//     const [isEdit, setIsEdit] = useState(false);
//     const [qualifications, setQualifications] = useState([{ value: '', isOther: false }]);

//     const validationSchema = Yup.object({
//         // ... (previous validation rules remain the same)
//         qualifications: Yup.array().of(
//             Yup.string().required("Qualification is required")
//         ).min(1, "At least one qualification is required"),
//     });

//     const formik = useFormik({
//         initialValues: {
//             drId: 0,
//             deptId: 0,
//             doctorRegNo: "",
//             drName: "",
//             gender: "",
//             address: "",
//             contactNo: "",
//             consultancyCharge: "",
//             doctorCharge: "",
//             joiningDt: "",
//             age: "",
//             licenceNo: "",
//             doctorSpecialization: "",
//             qualifications: [""]
//         },
//         validationSchema,
//         onSubmit: async (values) => {
//             try {
//                 // Combine all qualifications into a single string with commas
//                 const processedValues = {
//                     ...values,
//                     qualification: qualifications.map(q => q.isOther ? q.otherValue : q.value).join(', ')
//                 };

//                 if (isEdit) {
//                     const response = await apiClient.put(
//                         `doc/updateDocDetails?doctorId=${values.drId}`,
//                         processedValues
//                     );
//                     if (response.status === 200) {
//                         alert("Data updated successfully");
//                         setIsEdit(false);
//                     } else {
//                         alert("Failed! Please try again");
//                     }
//                 } else {
//                     const response = await apiClient.post("doc/saveDoc", processedValues);
//                     if (response.status === 200) {
//                         alert("Data saved successfully");
//                     } else {
//                         alert("Failed! Please try again");
//                     }
//                 }
//                 fetchApi();
//                 formik.resetForm();
//                 setQualifications([{ value: '', isOther: false }]);
//             } catch (error) {
//                 console.error("Error handling department:", error);
//                 alert("An error occurred. Please try again.");
//             }
//         }
//     });

//     // Add new qualification field
//     const addQualification = () => {
//         setQualifications([...qualifications, { value: '', isOther: false }]);
//     };

//     // Remove qualification field
//     const removeQualification = (index) => {
//         const newQualifications = qualifications.filter((_, i) => i !== index);
//         setQualifications(newQualifications);
//     };

//     // Handle qualification change
//     const handleQualificationChange = (index, value) => {
//         const newQualifications = [...qualifications];
//         if (value === 'Other') {
//             newQualifications[index] = { value: 'Other', isOther: true, otherValue: '' };
//         } else {
//             newQualifications[index] = { value, isOther: false };
//         }
//         setQualifications(newQualifications);
//     };

//     // Handle other qualification input
//     const handleOtherQualificationChange = (index, value) => {
//         const newQualifications = [...qualifications];
//         newQualifications[index].otherValue = value;
//         setQualifications(newQualifications);
//     };


//     return (
//         <>
//             <form onSubmit={formik.handleSubmit}>
//                 <div className="p-2">
//                     <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 lg:w-[100%] m-2 p-5">
//                         <div className="flex flex-col sm:flex-row sm:items-center ">
//                             <div className="w-full sm:w-[20%]">
//                                 <label className="block font-semibold">Reg. No.</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.doctorRegNo && formik.errors.doctorRegNo ? 'border-red-500' : ''}`}
//                                     name="doctorRegNo"
//                                     onChange={formik.handleChange}
//                                     value={formik.values.doctorRegNo}
//                                 />
//                                 {formik.touched.doctorRegNo && formik.errors.doctorRegNo && (
//                                     <div className="text-red-500 text-sm">{formik.errors.doctorRegNo}</div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%]">
//                                 <label className="block font-semibold">Department</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <select
//                                     name="deptId"
//                                     onChange={formik.handleChange}
//                                     value={formik.values.deptId}
//                                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.deptId && formik.errors.deptId ? 'border-red-500' : ''}`}>
//                                     <option value="">Select department</option>
//                                     {data.map((dept) => (
//                                         <option value={dept.deptId} key={dept.deptId}>{dept.depName}</option>
//                                     ))}
//                                 </select>
//                                 {formik.touched.deptId && formik.errors.deptId && (
//                                     <div className="text-red-500 text-sm">{formik.errors.deptId}</div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%]">
//                                 <label className="block font-semibold">Dr. Name</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.drName && formik.errors.drName ? 'border-red-500' : ''}`}
//                                     name="drName"
//                                     onChange={formik.handleChange}
//                                     value={formik.values.drName}
//                                 />
//                                 {formik.touched.drName && formik.errors.drName && (
//                                     <div className="text-red-500 text-sm">{formik.errors.drName}</div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%]">
//                                 <label className="block font-semibold">Charges</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.consultancyCharge && formik.errors.consultancyCharge ? 'border-red-500' : ''}`}
//                                     name="consultancyCharge"
//                                     onChange={formik.handleChange}
//                                     value={formik.values.consultancyCharge}
//                                 />
//                                 {formik.touched.consultancyCharge && formik.errors.consultancyCharge && (
//                                     <div className="text-red-500 text-sm">{formik.errors.consultancyCharge}</div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%]">
//                                 <label className="block font-semibold">Dr. Charges</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.doctorCharge && formik.errors.doctorCharge ? 'border-red-500' : ''}`}
//                                     name="doctorCharge"
//                                     onChange={formik.handleChange}
//                                     value={formik.values.doctorCharge}
//                                 />
//                                 {formik.touched.doctorCharge && formik.errors.doctorCharge && (
//                                     <div className="text-red-500 text-sm">{formik.errors.doctorCharge}</div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%]">
//                                 <label className="block font-semibold">Age</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.age && formik.errors.age ? 'border-red-500' : ''}`}
//                                     name="age"
//                                     onChange={formik.handleChange}
//                                     value={formik.values.age}
//                                 />
//                                 {formik.touched.age && formik.errors.age && (
//                                     <div className="text-red-500 text-sm">{formik.errors.age}</div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%]">
//                                 <label className="block font-semibold">licence No</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.licenceNo && formik.errors.licenceNo ? 'border-red-500' : ''}`}
//                                     name="licenceNo"
//                                     onChange={formik.handleChange}
//                                     value={formik.values.licenceNo}
//                                 />
//                                 {formik.touched.licenceNo && formik.errors.licenceNo && (
//                                     <div className="text-red-500 text-sm">{formik.errors.licenceNo}</div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%]">
//                                 <label className="block font-semibold">Specialization</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.doctorSpecialization && formik.errors.doctorSpecialization ? 'border-red-500' : ''}`}
//                                     name="doctorSpecialization"
//                                     onChange={formik.handleChange}
//                                     value={formik.values.doctorSpecialization}
//                                 />
//                                 {formik.touched.doctorSpecialization && formik.errors.doctorSpecialization && (
//                                     <div className="text-red-500 text-sm">{formik.errors.doctorSpecialization}</div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%]">
//                                 <label className="block font-semibold">Gender</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <select
//                                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.gender && formik.errors.gender ? 'border-red-500' : ''}`}
//                                     name="gender"
//                                     onChange={formik.handleChange}
//                                     value={formik.values.gender}
//                                 >
//                                     <option value="">--select gender--</option>
//                                     <option value="male">Male</option>
//                                     <option value="Female">Female</option>
//                                     <option value="Other">Other</option>
//                                 </select>
//                                 {formik.touched.gender && formik.errors.gender && (
//                                     <div className="text-red-500 text-sm">{formik.errors.gender}</div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row sm:items-start mb-4">
//                             <div className="w-full sm:w-[20%]">
//                                 <label className="block font-semibold">Qualification</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 {qualifications.map((qual, index) => (
//                                     <div key={index} className="flex items-center mb-2">
//                                         <div className="flex-1">
//                                             <select
//                                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//                                                 value={qual.value}
//                                                 onChange={(e) => handleQualificationChange(index, e.target.value)}
//                                             >
//                                                 <option value="">Select Qualification</option>
//                                                 <option value="MBBS">MBBS</option>
//                                                 <option value="MD">MD</option>
//                                                 <option value="MS">MS</option>
//                                                 <option value="BDS">BDS</option>
//                                                 <option value="Other">Other</option>
//                                             </select>
//                                             {qual.isOther && (
//                                                 <input
//                                                     type="text"
//                                                     className="w-full mt-2 px-4 py-2 border rounded-lg focus:outline-none"
//                                                     placeholder="Please specify"
//                                                     value={qual.otherValue || ''}
//                                                     onChange={(e) => handleOtherQualificationChange(index, e.target.value)}
//                                                 />
//                                             )}
//                                         </div>
//                                         <div className="flex ml-2">
//                                             {index === qualifications.length - 1 && (
//                                                 <button
//                                                     type="button"
//                                                     onClick={addQualification}
//                                                     className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 mr-2"
//                                                 >
//                                                     <FaPlus />
//                                                 </button>
//                                             )}
//                                             {qualifications.length > 1 && (
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeQualification(index)}
//                                                     className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700"
//                                                 >
//                                                     <FaTrash />
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%]">
//                                 <label className="block font-semibold">Address</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.address && formik.errors.address ? 'border-red-500' : ''}`}
//                                     name="address"
//                                     onChange={formik.handleChange}
//                                     value={formik.values.address}
//                                 />
//                                 {formik.touched.address && formik.errors.address && (
//                                     <div className="text-red-500 text-sm">{formik.errors.address}</div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%]">
//                                 <label className="block font-semibold">Joining Date</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="date"
//                                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.joiningDt && formik.errors.joiningDt ? 'border-red-500' : ''}`}
//                                     name="joiningDt"
//                                     onChange={formik.handleChange}
//                                     value={formik.values.joiningDt}
//                                 />
//                                 {formik.touched.joiningDt && formik.errors.joiningDt && (
//                                     <div className="text-red-500 text-sm">{formik.errors.joiningDt}</div>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%]">
//                                 <label className="block font-semibold">Connect No.</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.contactNo && formik.errors.contactNo ? 'border-red-500' : ''}`}
//                                     name="contactNo"
//                                     onChange={formik.handleChange}
//                                     value={formik.values.contactNo}
//                                 />
//                                 {formik.touched.contactNo && formik.errors.contactNo && (
//                                     <div className="text-red-500 text-sm">{formik.errors.contactNo}</div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                     <div className="flex justify-start m-2 space-x-4 p-2">

//                         <button
//                             type="button"
//                             className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
                         
//                         >
//                             Refresh
//                         </button>
//                         <button
//                             type="submit"
//                             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900"
//                         >
//                             {isEdit ? "Update" : "Save"}
//                         </button>
//                     </div>
//                 </div>
//             </form>
//             <div className="bg-white p-2 m-4 md:p-2 rounded-lg shadow-md">
//                 <div className="overflow-x-auto">
//                     <div
//                         className="w-full"
//                         style={{ maxHeight: "400px", overflowY: "auto" }}
//                     >
//                         <table className="table-auto w-full border border-collapse shadow">
//                             <thead>
//                                 <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>

//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Reg. No.</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Department</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Name</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Gender</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Qualification</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Charges</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Address</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Contact No</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Joining Date</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {Array.isArray(drdata) && drdata.length > 0 ? (
//                                     drdata.map((data, index) => (
//                                         <tr
//                                             key={index}
//                                             className="border border-gray-200 text-center">
//                                             <td className="px-4 py-3 border border-gray-200 flex space-x-2">
//                                                 <button
//                                                     className="text-blue-500 hover:text-blue-700 flex items-center"
//                                                     onClick={() => handleUpdate(data)}>
//                                                     <FaPencilAlt className="mr-1" />
//                                                 </button>

//                                             </td>
//                                             <td className="px-4 py-3 border border-gray-200 uppercase">{data.doctorRegNo}</td>
//                                             <td className="px-4 py-3 border border-gray-200 uppercase">{data.depName}</td>
//                                             <td className="px-4 py-3 border border-gray-200 uppercase">{data.drName}</td>
//                                             <td className="px-4 py-3 border border-gray-200 uppercase">{data.gender}</td>
//                                             <td className="px-4 py-3 border border-gray-200 uppercase">{data.qualification}</td>
//                                             <td className="px-4 py-3 border border-gray-200 uppercase">{data.consultancyCharge}</td>
//                                             <td className="px-4 py-3 border border-gray-200 uppercase">{data.address}</td>
//                                             <td className="px-4 py-3 border border-gray-200 uppercase">{data.contactNo}</td>
//                                             <td className="px-4 py-3 border border-gray-200 uppercase">{data.joiningDt}</td>

//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="11" className="text-center">No data available</td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };


// export default withAuth(DoctorMaster, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])