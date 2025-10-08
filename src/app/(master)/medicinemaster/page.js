'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';

export function MedicineMaster() {
    return (
        <LayoutForm>
            <MedicineMasterform />
           </LayoutForm>
    );
}

const MedicineMasterform = () => {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isEdit, setIsEdit] = useState(false);

    // Fetch all medicines
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`api/medicines`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
        fetchCategories();
        fetchBrands();
    }, []);

    // Formik setup
    const formik = useFormik({
        initialValues: {
            medId: 0,
            medName: "",
            qty: "",
            descp: "",
            mfg: "",
            exp: "",
            brandId: "",
            categoryId: ""
        },
        validationSchema: Yup.object({
            medName: Yup.string().required('Medicine Name is required')
            .min(2, 'Medicine Name must be at least 2 characters')
            .max(50, 'Medicine Name cannot exceed 50 characters')
            .matches(/^[a-zA-Z0-9\s]+$/, 'Medicine Name can only contain letters, numbers, and spaces')
            .matches(/^\S+(?: \S+)*$/, 'Medicine Name should not have leading or trailing spaces'),
            qty: Yup.number().required('Quantity is required').positive().integer(),
            mfg: Yup.date().required('Manufacturing date is required'),
            exp: Yup.date().required('Expiry date is required').min(Yup.ref('mfg'), 'Expiry date must be after manufacturing date'),
            brandId: Yup.string().required('Brand is required'),
            categoryId: Yup.string().required('Category is required')
        }),
        onSubmit: async (values) => {
            try {
                let response;
                console.log('Submitting values:', values); // Debugging line
        
                if (isEdit) {
                    // Update API call
                    response = await apiClient.put(
                        `api/medicines/updateMedicineMaster?itemno=${values.medId}`,
                        values
                    );
                } else {
                    // Save API call
                    response = await apiClient.post(
                        `api/medicines`,
                        values
                    );
                }
        
                // Check response
                console.log('API response:', response); // Debugging line
        
                if (response.status ===  200 ) {
                    toast.success(`Data ${isEdit ? 'updated' : 'saved'} successfully`);
                    fetchApi();  // Fetch updated data
                    formik.resetForm();  // Reset the form
                    setIsEdit(false);  // Reset edit state
                } else {
                    toast.error(`Failed! Please try again.`);
                }
            } catch (error) {
                console.error("Error handling submission:", error);
                // Enhanced error message
                if (error.response) {
                    toast.error(`Error: ${error.response.data.message || error.message}`);
                } else {
                    toast.error("An error occurred. Please try again.");
                }
            
        }
        
        }
        
    });

    const handleUpdate = (item) => {
        formik.setValues({
            medId: item.medId,
            medName: item.medName,
            qty: item.qty,
            descp: item.descp,
            mfg: item.mfg,
            exp: item.exp,
            brandId: item.brandId,
            categoryId: item.categoryId
        });
        setIsEdit(true);
    };

    const handleRefresh = () => {
        formik.resetForm();
        setIsEdit(false);
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await apiClient.get(`medicineCategory/getAllMedicineCategory`);
            setCategories(response.data.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Fetch brands
    const fetchBrands = async () => {
        try {
            const response = await apiClient.get(`medicineBrand/getAllBrand`);
            setBrands(response.data.data);
        } catch (error) {
            console.error("Error fetching brands:", error);
        }
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
             <Heading headingText="Medicine Master" />
            <div className='py-4'>
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]' onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 m-2">

                        <div>
                                <label className="block font-semibold text-sm">Medicine Category</label>
                        
                                <select
                                    name="categoryId"
                                    onChange={(e) => formik.setFieldValue('categoryId', e.target.value)}
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.categoryId && formik.errors.categoryId ? 'border-red-500' : ''}`}
                                    value={formik.values.categoryId}
                                >
                                    <option value="" label="Select Category" />
                                    {categories.map((category) => (
                                        <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>
                                    ))}
                                </select>
                                {formik.touched.categoryId && formik.errors.categoryId && (
                                    <div className="text-red-500 text-sm">{formik.errors.categoryId}</div>
                                )}
                         
                        </div>

                        <div>
                                <label className="block font-semibold text-sm">Medicine Brand</label>
                        
                                <select
                                    name="brandId"
                                    onChange={(e) => formik.setFieldValue('brandId', e.target.value)}
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.brandId && formik.errors.brandId ? 'border-red-500' : ''}`}
                                    value={formik.values.brandId}
                                >
                                    <option value="" label="Select Brand" />
                                    {brands.map((brand) => (
                                        <option key={brand.brandId} value={brand.brandId}>{brand.brandName}</option>
                                    ))}
                                </select>
                                {formik.touched.brandId && formik.errors.brandId && (
                                    <div className="text-red-500 text-sm">{formik.errors.brandId}</div>
                                )}
                           
                        </div>

                        <div>
                                <label className="block font-semibold text-sm">Medicine Name</label>
                                <input
                                    type="text"
                                    name="medName"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.medName && formik.errors.medName ? 'border-red-500' : ''}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.medName}
                                />
                                {formik.touched.medName && formik.errors.medName && (
                                    <div className="text-red-500 text-sm">{formik.errors.medName}</div>
                                )}
                        </div>
                        <div >
                                <label className="block font-semibold text-sm">Quantity </label>
                         
                                <input
                                    type="text"
                                    name="qty"
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.qty && formik.errors.qty ? 'border-red-500' : ''}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.qty}
                                />
                                {formik.touched.qty && formik.errors.qty && (
                                    <div className="text-red-500 text-sm">{formik.errors.qty}</div>
                                )}
                         
                        </div>

                        <div >
                                <label className="block font-semibold text-sm">MFG</label>
                       
                                <input
                                    type="date"
                                    name="mfg"
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.mfg && formik.errors.mfg ? 'border-red-500' : ''}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.mfg}
                                />
                                {formik.touched.mfg && formik.errors.mfg && (
                                    <div className="text-red-500 text-sm">{formik.errors.mfg}</div>
                                )}
                         
                        </div>

                        <div>
                                <label className="block font-semibold text-sm">EXP</label>
                                <input
                                    type="date"
                                    name="exp"
                                    className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none ${formik.touched.exp && formik.errors.exp ? 'border-red-500' : ''}`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.exp}
                                />
                                {formik.touched.exp && formik.errors.exp && (
                                    <div className="text-red-500 text-sm">{formik.errors.exp}</div>
                                )}
                        </div>

                    </div>

                    <div className="flex justify-start w-full space-x-4 p-2 my-4">
                        <button 
                            className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900" 
                            type="button" 
                            onClick={handleRefresh}>
                            Refresh
                        </button>
                        <button
                            className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
                            type="submit">
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-2 my-2  rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Category Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Brand Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Medicine Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Quantity </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr key={item.medId} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button 
                                                    className="text-blue-400 hover:text-blue-800 flex items-center"
                                                    onClick={() => handleUpdate(item)}>
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{item.categoryName}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{item.brandName}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{item.medName}</td>
                                            <td className="px-4 py-3 border border-gray-200 uppercase">{item.qty}</td>
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

            <p className="text-red-600 font-medium">Note: A master could not be deleted if used anywhere</p>
        </div>
    );
};


export default withAuth(MedicineMaster, ['SUPERADMIN', 'ADMIN','DOCTOR'])














// 'use client'
// import LayoutForm from "../../layouts/layoutForm";
// import Heading from "../../(components)/heding";
// import { useState, useEffect } from "react";
// import { FaPencilAlt } from "react-icons/fa";
// import apiClient from "apiClient";
// import { BaseUrl } from "@/app/config";
// import { useFormik } from 'formik';
// import * as Yup from 'yup';

// export default function Opd() {
//     return (
//         <LayoutForm>
//             <Heading headingText="Medicine Master " />
//             <MedicineMasterform />
//         </LayoutForm>
//     );
// }


// const MedicineMasterform = () => {
//     const [data, setData] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [selectedCategoryId, setSelectedCategoryId] = useState('');
//     const [brands, setBrand] = useState([]);
//     const [selectedBrandId, setSelectedBrandId] = useState('');
//     const [isEdit, setIsEdit] = useState(false);
//     const [inputs, setInputs] = useState({
//         medId: 0,
//         medName: "",
//         qty: "",
//         descp: "",
//         mfg: "",
//         exp: "",
//         brandId: 0,
//         categoryId: 0
//     });


//     // table
//     const fetchApi = async () => {
//         try {
//             const response = await apiClient.get(BaseUrl + "api/medicines");
//             setData(response.data.data);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     useEffect(() => {
//         fetchApi();
//     }, []);




//     const formik = useFormik({
//         initialValues: {
//             medName: "",
          
//         },
//         validationSchema: Yup.object({

//             medName: Yup.string()
//                 .required('medName Name is required')
//                 .min(2, 'medName Name must be at least 2 characters')
//                 .max(50, 'medName Name cannot exceed 50 characters'),
//         }),
//         onSubmit: async (values) => {
//         try {
//             if (isEdit) {
//                 // Corrected Update API call with room id
//                 const response = await apiClient.put(
//                     `${BaseUrl}api/medicines/updateMedicineMaster?itemno=${inputs.itemno}`, // Fixed URL construction
//                     inputs
//                 );
//                 if (response.status == 200) {
//                     alert("Data updated successfully");
//                     setIsEdit(false); // Reset edit state after update
//                 } else {
//                     alert("Update failed! Please try again");
//                 }
//             } else {
//                 // Save API call for new room type
//                 const response = await apiClient.post(
//                     BaseUrl + "api/medicines",
//                     inputs
//                 );
//                 console.log(response.data.data)
//                 if (response.status == 200) {
//                     alert("Data saved successfully");
//                 } else {
//                     alert("Save failed! Please try again");
//                 }
//             }
//             fetchApi(); // Refresh the list of room types after save or update
//             formik.resetForm();
//         } catch (error) {
//             console.error("Error handling :", error);
//             alert("An error occurred. Please try again.");
//         }
//     }
//     });

//     const handleUpdate = (brand) => {
//         setInputs({

//             medId: brand.medId,
//             medName: brand.medName,
//             qty: brand.qty,
//             descp: brand.descp,
//             mfg: brand.mfg,
//             exp: brand.exp,
//             brandId: brand.brandId,
//             categoryId: brand.categoryId
//         });
//         setIsEdit(true);
//     };

//     const handleRefresh = () => {
//         formik.resetForm(); // Clear form fields
//         setIsEdit(false); // Reset edit state
//     };


//     //handle inputs
//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         setInputs((prevInputs) => ({
//             ...prevInputs,
//             [name]: value,
//         }));
//     };


//     // //categories get all
//     const fetchCategories = async () => {
//         try {
//             const response = await apiClient.get(`${BaseUrl}medicineCategory/getAllMedicineCategory`);
//             console.log(response.data.data);
//             setCategories(response.data.data);
//         } catch (error) {
//             console.error("Error fetching data", error);
//         }
//     };

//     useEffect(() => {
//         fetchCategories();
//     }, []);

//     const handleChange1 = (e) => {
//         console.log(e.target.value);
//         setInputs({...inputs, categoryId :e.target.value})
//     };


//     //Brands get all
//     const fetchBrands = async () => {
//         try {
//             const response = await apiClient.get(`${BaseUrl}medicineBrand/getAllBrand`);
//             console.log(response.data.data);
//             setBrand(response.data.data);
//         } catch (error) {
//             console.error("Error fetching data", error);
//         }
//     };

//     useEffect(() => {
//         fetchBrands();
//     }, []);

//     const handleChange2 = (e) => {
//         console.log(e.target.value);
//         setInputs({...inputs, brandId :e.target.value})
//     };



//     return (
//         <div className='p-6'>
//             <div className='p-7'>
//                 <form onSubmit={formik.handleSubmit} className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
//                     <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 m-2 ">
//                     {/* <div className="mb-6">
// <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
// <div className="flex items-center border-b border-gray-400 ">
//     <input 
//         className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
//         type="email" placeholder="Enter mail"  />
//     <span className="text-gray-500"><i className="fa fa-user"></i></span>
// </div>
// </div> */}

                        
//                         <div className="mb-6 w-[80%]">
//                             <label className="block mb-2 text-sm font-medium text-gray-700">Medicine Category</label>
//                             <div className="flex items-center border-b border-gray-400">
                             
//                                 <select onChange={handleChange1} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" >
//                                     {categories.map((categories) => (
//                                         <option value={categories.categoryId}>{categories.categoryName}</option>
//                                     ))}
//                                 </select>
//                                 <span className="text-gray-500"><i className="fa fa-user-tag"></i></span>
//                             </div>
//                         </div>
//                         <div className="mb-6 w-[80%]">
//                             <label className="block mb-2 text-sm font-medium text-gray-700">Medicine Brand</label>
//                             <div className="flex items-center border-b border-gray-400">
                             
//                             <select onChange={handleChange2} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none">
//                                     {brands.map((brand) => (
//                                         <option value={brand.brandId}>{brand.brandName}</option>
//                                     ))}
//                                 </select>
                                
//                                 <span className="text-gray-500"><i className="fa fa-user-tag"></i></span>
//                             </div>
//                         </div>
//                         <div className="mb-6 w-[80%]">
//                         <label className="block mb-2 text-sm font-medium text-gray-700">Medicine Name</label>
//                             <div className="flex items-center border-b border-gray-400">
//                             <input 
//                             className={`appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none ${formik.touched.categoryName && formik.errors.categoryName ? 'border-red-500' : ''}`}
//                             name="medName"
                                   
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     value={formik.values.medName}
//                             />
//                              {formik.touched.medName && formik.errors.medName ? (
//                                     <div className="text-red-500 text-sm">{formik.errors.medName}</div>
//                                 ) : null}
//                                 <span className="text-gray-500"><i className="fa fa-user"></i></span>
//                             </div>
//                         </div>


//                         <div className="mb-6 w-[80%]">
//                         <label className="block mb-2 text-sm font-medium text-gray-700">MFG</label>
//                             <div className="flex items-center border-b border-gray-400 ">
                            
//                             <input type="date" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" placeholder=""
//                                     name="mfg"
//                                     onChange={handleChange}
//                                     value={inputs.mfg}
//                                 />
//                              {formik.touched.medName && formik.errors.medName ? (
//                                     <div className="text-red-500 text-sm">{formik.errors.medName}</div>
//                                 ) : null}
//                                 <span className="text-gray-500"><i className="fa fa-user"></i></span>
//                             </div>
//                         </div>

//                         <div className="mb-6 w-[80%]">
//                         <label className="block mb-2 text-sm font-medium text-gray-700">EXP</label>
//                             <div className="flex items-center border-b border-gray-400 ">
                            
//                             <input type="date" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" placeholder=""
//                                     name="exp"
//                                     onChange={handleChange}
//                                     value={inputs.exp}
//                                 />
//                              {formik.touched.medName && formik.errors.medName ? (
//                                     <div className="text-red-500 text-sm">{formik.errors.medName}</div>
//                                 ) : null}
//                                 <span className="text-gray-500"><i className="fa fa-user"></i></span>
//                             </div>
//                         </div>

//                         <div className="mb-6 w-[80%]">
//                         <label className="block mb-2 text-sm font-medium text-gray-700">Available</label>
//                             <div className="flex items-center border-b border-gray-400 ">
                            
//                             <input type="text" className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" placeholder=""
//                                   name="categoryName"
//                                   onChange={handleChange}
//                                   value={inputs.categoryName}
//                                 />
//                              {formik.touched.medName && formik.errors.medName ? (
//                                     <div className="text-red-500 text-sm">{formik.errors.medName}</div>
//                                 ) : null}
//                                 <span className="text-gray-500"><i className="fa fa-user"></i></span>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="flex justify-start  w-full space-x-4 p-2 ">
//                         <button type="button" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900" onChange={handleRefresh}>Refresh</button>
//                         <button
//                             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900"
//                             type="submit"
//                             // onClick={handleMedicineMaster}
//                         >
//                              {isEdit ? "Update" : "Save"}
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
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr No.</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Category Name</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Brand Name</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Medicine Name</th>




//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {Array.isArray(data) && data.length > 0 ? (
//                                     data.map((transaction, index) => (
//                                         <tr
//                                             key={index}
//                                             className="border border-gray-200 text-center">
//                                             <td className="px-4 py-3 border border-gray-200 flex space-x-2">
//                                                 <button className="text-blue-400 hover:text-blue-800 flex items-center"
//                                                     onClick={() => handleUpdate(transaction)}
//                                                 >
//                                                     <FaPencilAlt className="mr-1" />
//                                                 </button>
//                                             </td>
//                                             <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
//                                             {/* <td className="px-4 py-3 border border-gray-200">{transaction.medicineName}</td> */}
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.categoryName}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.brandName}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.medName}</td>
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
//             <p className="text-red-600 font-medium">Note: A master could not be delete if used anywhere</p>
//         </div>
//     );
// };



