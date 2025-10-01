'use client';
import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from "@/app/(components)/WithAuth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaRegUserCircle } from "react-icons/fa";
import { TiHome } from "react-icons/ti";
import { useRouter } from "next/navigation";

export function NewUser() {
    return <NewUserForm />;
}

const NewUserForm = () => {
    const router = useRouter();

    const table = () => {
        router.push('/users');
    };

    // const home = () => {
    //     router.push('/dash');
    // };
    
    const [showPassword, setShowPassword] = useState(false);
    const [hospital, setHospital] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const fetchHospital = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get("hospitalProfile/getDataHospital");
            if (
                response.data &&
                Array.isArray(response.data.data) &&
                response.data.data.length > 0 &&
                response.data.data[0].hospitalName
            ) {
                setHospital(response.data.data[0].hospitalName);
            } else {
                setHospital("Unknown Hospital");
            }
        } catch (error) {
            console.error("Error fetching hospital data:", error);
            setHospital("Error fetching hospital name");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHospital();
    }, []);

    const formik = useFormik({
        initialValues: {
            userId: 0,
            userName: "",
            name: "",
            email: "",
            password: "",
            roles: [], // Changed to array
        },
        validationSchema: Yup.object({
            userName: Yup.string()
                .min(3, "Username must be at least 3 characters")
                .required("Username is required"),
            name: Yup.string()
                .min(2, "Name must be at least 2 characters")
                .required("Name is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                )
                .required("Password is required"),
            roles: Yup.array().min(1, "Role is required"), // Updated validation for array
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setIsSubmitting(true);
            setSubmitStatus({ type: '', message: '' });
            
            try {
                // Transform the form data to match API specification
                const apiData = {
                    ...values,
                    roles: [values.roles[0]] // Ensure roles is an array
                };
                
                const response = await apiClient.post("user/register", apiData);
                
                if (response.status === 200) {
                    setSubmitStatus({
                        type: 'success',
                        message: 'User registered successfully!'
                    });
                    resetForm();
                } else {
                    setSubmitStatus({
                        type: 'error',
                        message: 'Failed to register user. Please try again.'
                    });
                }
            } catch (error) {
                console.error("Error registering user:", error);
                setSubmitStatus({
                    type: 'error',
                    message: error.response?.data?.message || 'An error occurred. Please try again later.'
                });
            } finally {
                setIsSubmitting(false);
                setSubmitting(false);
            }
        },
    });

    // Handle role selection to store as array
    const handleRoleChange = (e) => {
        const selectedRole = e.target.value;
        formik.setFieldValue('roles', selectedRole ? [selectedRole] : []);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 py-6">
            <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row w-11/12 md:w-3/4 lg:w-2/3 overflow-hidden">
                <div className="hidden md:flex w-1/2 bg-gray-200 items-center justify-center relative">
                    <img
                        src="/Frame 35634.svg"
                        alt="Logo"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex justify-center mt-9">
                        <div className="mt-6">
                            <h1 className="text-white text-2xl font-bold text-center px-4">
                                {isLoading ? "Loading..." : hospital}
                            </h1>
                            <p className="mt-2 text-lg text-white flex justify-center">
                                Your Health, Our Priority
                            </p>
                           
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 uppercase">create new</h3>
                    
                    {submitStatus.message && (
                        <div className={`w-full mb-4 p-3 rounded ${
                            submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {submitStatus.message}
                        </div>
                    )}

                    <form className="w-full max-w-md space-y-6" onSubmit={formik.handleSubmit}>
                        {/* Username Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="userName"
                                    placeholder="Enter username"
                                    onChange={formik.handleChange}
                                    value={formik.values.userName}
                                    onBlur={formik.handleBlur}
                                    disabled={isSubmitting}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                        formik.touched.userName && formik.errors.userName
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                <FaUser className="absolute left-3 top-2.5 text-gray-400" />
                            </div>
                            {formik.touched.userName && formik.errors.userName && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.userName}</div>
                            )}
                        </div>

                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter full name"
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    onBlur={formik.handleBlur}
                                    disabled={isSubmitting}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                        formik.touched.name && formik.errors.name
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                <FaUser className="absolute left-3 top-2.5 text-gray-400" />
                            </div>
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                            )}
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                    disabled={isSubmitting}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                        formik.touched.email && formik.errors.email ? "border-red-500" : ""
                                    }`}
                                />
                                <FaEnvelope className="absolute left-3 top-2.5 text-gray-400" />
                            </div>
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter password"
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    onBlur={formik.handleBlur}
                                    disabled={isSubmitting}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                        formik.touched.password && formik.errors.password
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                <FaLock className="absolute left-3 top-2.5 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role
                            </label>
                            <select
                                name="roles"
                                onChange={handleRoleChange}
                                value={formik.values.roles[0] || ""}
                                onBlur={formik.handleBlur}
                                disabled={isSubmitting}
                                className={`w-full pl-4 pr-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                                    formik.touched.roles && formik.errors.roles ? "border-red-500" : ""
                                }`}
                            >
                                <option value="">Select a role</option>
                                <option value="SUPERADMIN">Super Admin</option>
                                <option value="ADMIN">Admin</option>
                                <option value="USER">User</option>
                                <option value="DOCTOR">Doctor</option>
                                <option value="RECEPTION">Reception</option>
                                <option value="PHARMACY">Pharmacy</option>
                            </select>
                            {formik.touched.roles && formik.errors.roles && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.roles}</div>
                            )}
                        </div>

                        <button
                            className={`w-full py-2 px-4 rounded font-bold text-white transition-colors ${
                                isSubmitting
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-700'
                            }`}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                    <button
                    onClick={table}
                    className="flex items-center mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                >
                    <FaRegUserCircle className="mr-2" />
                    User List
                </button>
                {/* <button
                    onClick={home}
                    className="flex items-center mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                >
                    <TiHome className="mr-2" />
                    Home
                </button> */}
                </div>
                
            </div>
        </div>
    );
};

export default withAuth(NewUser, ["SUPERADMIN", "ADMIN", "DOCTOR"]);




// 'use client'
// import LayoutForm from "../../layouts/layoutForm";
// import Heading from "../../(components)/heding";
// import { useState, useEffect } from "react";
// import { FaPencilAlt } from "react-icons/fa";
// import apiClient from "@/app/config";
// import withAuth from '@/app/(components)/WithAuth';
// import Icon from "../../(components)/icon";
// import { useFormik } from 'formik';
// import * as Yup from 'yup';


// export function ServiceTypeMaster() {
//     return (
//         <LayoutForm>

//             <ServiceTypeMasterform />
//             <Icon message={"This page is for managing IPD service types. You can view, add, or update different types of inpatient services, such as ( Hospital Bill, IPD Extra Services) "} />
//         </LayoutForm>
//     );
// }



// const ServiceTypeMasterform = () => {
//     const [data, setData] = useState([]);
//     // const [inputs, setInputs] = useState({
//     //     id : 0,
//     //     serviceTypeName : "",
//     //     description : ""
//     // });



//     // Fetch all room types
//     const fetchApi = async () => {
//         try {
//             const response = await apiClient.get(`servicetypemaster/getAll`);
//             setData(response.data.data);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     useEffect(() => {
//         fetchApi();
//     }, []);

//     // Formik setup
//     const formik = useFormik({
//         initialValues: {
//             userName: "",
//             name: "",
//             email: "",
//             password: "",
//             roles: []
//         },
//         validationSchema: Yup.object({
//             serviceTypeName: Yup.string().required('Service Type Name is required'),
//         }),
//         onSubmit: async (values) => {

//             const response = await apiClient.post(
//                 `user/register`, values
//             );
//             debugger;
//             if (response.status == "200") {
//                 alert("Data is saved successfull");
//                 fetchApi();
//                 formik.resetForm();
//             }
//             else {
//                 alert("Failed! Please try again")
//             }
//             console.log("response", response.data.data);

//         }

//     });

//     const handleRefresh = () => {
//         formik.resetForm(); // Clear form fields
//     };


//     return (
//         <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
//             <Heading headingText="Service Type " />
//             <div className='py-4'>
//                 <form className='lg:w-[50%] md:w-[100%] sm:w-[100%]' onSubmit={formik.handleSubmit}>
//                     <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2 ">
//                         <div>
//                             <label className="block font-semibold text-sm">User Name</label>
//                             <input
//                                 type="text"
//                                 className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${formik.touched.userName && formik.errors.userName ? 'border-red-500' : ''}`}
//                                 placeholder="User Name"
//                                 name="userName"

//                                 onChange={formik.handleChange}
//                                 onBlur={formik.handleBlur}
//                                 value={formik.values.userName}
//                             />
//                             {formik.touched.userName && formik.errors.userName ? (
//                                 <div className="text-red-500 text-sm">{formik.errors.userName}</div>
//                             ) : null}
//                         </div>
//                         <div>
//                             <label className="block font-semibold text-sm"> Name</label>
//                             <input
//                                 type="text"
//                                 className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
//                                 placeholder="User Name"
//                                 name="name"

//                                 onChange={formik.handleChange}
//                                 onBlur={formik.handleBlur}
//                                 value={formik.values.name}
//                             />
//                             {formik.touched.name && formik.errors.name ? (
//                                 <div className="text-red-500 text-sm">{formik.errors.name}</div>
//                             ) : null}
//                         </div>
//                         <div>
//                             <label className="block font-semibold text-sm"> Email</label>
//                             <input
//                                 type="email"
//                                 className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
//                                 placeholder="mail"
//                                 name="email"

//                                 onChange={formik.handleChange}
//                                 onBlur={formik.handleBlur}
//                                 value={formik.values.email}
//                             />
//                             {formik.touched.email && formik.errors.email ? (
//                                 <div className="text-red-500 text-sm">{formik.errors.email}</div>
//                             ) : null}
//                         </div>
//                         <div>
//                             <label className="block font-semibold text-sm"> password</label>
//                             <input
//                                 type="text"
//                                 className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
//                                 placeholder="User Name"
//                                 name="password"

//                                 onChange={formik.handleChange}
//                                 onBlur={formik.handleBlur}
//                                 value={formik.values.password}
//                             />
//                             {formik.touched.password && formik.errors.password ? (
//                                 <div className="text-red-500 text-sm">{formik.errors.password}</div>
//                             ) : null}
//                         </div>

//                         <div>
//                             <label className="block font-semibold text-sm">Role</label>
// {/* 
//                             <input
//                                 type="text"
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none shadow-md text-sm"
//                                 placeholder="Enter description"
//                                 onChange={formik.handleChange}
//                                 name="roles"
//                                 onBlur={formik.handleBlur}
//                                 value={formik.values.roles}
//                             /> */}
//                             <select
//                                 onChange={formik.handleChange}
//                                 name="roles"
//                                 onBlur={formik.handleBlur}
//                                 value={formik.values.roles}
//                                 className="w-full px-4 py-2 border rounded-lg focus:outline-none shadow-md text-sm"
                            
//                             >
//                                 <option value="">Select a role</option>
//                                 <option value="SUPERADMIN">Super Admin</option>
//                                 <option value="ADMIN">Admin</option>
//                                 <option value="USER">User</option>
//                                 <option value="DOCTOR">Doctor</option>
//                                 <option value="RECEPTION">Reception</option>
//                                 <option value="PHARMACY">Pharmacy</option>
//                             </select>

//                         </div>
//                     </div>
//                     <div className="flex justify-start w-full space-x-4 py-4">
//                         <button className="bg-gray-600 text-white px-6 text-sm py-2 rounded-lg hover:bg-gray-900" type="button" onClick={handleRefresh} >Refresh</button>
//                         <button
//                             className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-900"
//                             type="submit"
//                         >

//                             save
//                         </button>
//                     </div>
//                 </form>
//             </div>
//             <div className="bg-white p-2 my-2 rounded-lg shadow-md">
//                 <div className="overflow-x-auto">
//                     <div
//                         className="w-full"
//                         style={{ maxHeight: "400px", overflowY: "auto" }}
//                     >
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
//                                             <td className="px-4 py-3 border border-gray-200 uppercase">{transaction.serviceTypeName}</td>
//                                             <td className="px-4 py-3 border border-gray-200 uppercase">{transaction.description}</td>
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

// export default withAuth(ServiceTypeMaster, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])