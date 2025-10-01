'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import { BaseUrl } from "@/app/config";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import { toast } from 'sonner';
import withAuth from '@/app/(components)/WithAuth';


export function Medicinemasterstore() {
    return (
        <LayoutForm>
            <Heading headingText="Medicine Master Store" />
            <Medicinemasterstoreform />
        </LayoutForm>
    );
}

const Medicinemasterstoreform = () => {

    const [data, setData] = useState([]);
    const [category, setCategory] = useState([])
    const [inputs, setInputs] = useState({
        "medicineId": 0,
        "medicineName": "",
        "companyId": 0,
        "medicineCategoryId": 0,
        "categoryName": "",
        "companyName": "",
        "totalQuntity": 0,
        "oldQuntity": 0,
        "purchasePrice": 0,
        "salePrice": 0,
        "purchaseNo": 0,
        "purchaseQuntity": 0
    });


    // Fetch all room types
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`PharmacyMedicine/getAllData`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchCatagory = async () => {
        const response = await apiClient.get(`mediceneCategory/getAll`)
        if (response.status === 200) {
            setCategory(response.data)
        }
    }

    useEffect(() => {
        fetchApi();
        fetchCatagory()
    }, []);


    // Handle saving or updating the room type
    const handleMedicinecategory = async (e) => {
        e.preventDefault();
        const response = await apiClient.post(`PharmacyMedicine/saveData`, inputs)
        if (response.status === 200) {
            toast.success("Data is saved successfully")
            fetchApi()
        }
        else {
            toast.error("something Went Wrong")
        }
    };

    const handleCatSel = (e) => {
        const id = e.target.value
        setInputs({...inputs,medicineCategoryId:id})
    }


    // Set the form fields for editing a room type




    return (
        <div className='p-6'>
            <div className='p-7'>
                <form className='lg:w-[60%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2 ">
                      <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                        <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Category</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                        <select onChange={handleCatSel} className="w-full px-4 py-2 border rounded-lg focus:outline-none">
                            <option >select an item</option>
                            {category?.map((item) => (
                                <option value={item.medicineCategoryId}>{item.categoryName}</option>

                            ))}

                        </select>
                        </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                            <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                                <label className="block font-semibold">Item Name</label>
                            </div>
                            <div className="w-full sm:w-[80%]">
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"

                                    name="medicineName"
                                    onChange={(e) => setInputs({ ...inputs, medicineName: e.target.value })}
                                    value={inputs.medicineName}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2">
                        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900" type="button" >Refresh</button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900"
                            onClick={handleMedicinecategory}
                        >
                            Save
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

                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Item Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">category Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Company Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Total Quntity </th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Purchase Price </th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sale Price </th>

                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            {/* <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td> */}

                                            <td className="px-4 py-3 border border-gray-200">{transaction.medicineName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.categoryName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.companyName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.totalQuntity}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.purchasePrice}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.salePrice}</td>
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
export default withAuth(Medicinemasterstore, ['DOCTOR', 'ADMIN', 'SUPERADMIN'])















// 'use client'
// import LayoutForm from "../../layouts/layoutForm";
// import Heading from "../../(components)/heding";
// import { FaPencilAlt } from "react-icons/fa";
// import apiClient from "apiClient";
// import { BaseUrl } from "@/app/config";
// import { useState, useEffect } from "react";


// export default function CompanyMaster() {
//     return (
//         <LayoutForm>
//             <Heading headingText="Medicine Master Store" />
//             <Medicinemasterstoreform />
//         </LayoutForm>
//     );
// }

// const Medicinemasterstoreform = () => {

//     const [isEdit, setIsEdit] = useState(false);
//     const [data, setData] = useState([]);
//     const [inputs, setInputs] = useState({
//         "medicineId": 0,
//         "medicineName": "",
//         "companyId": 0,
//         "medicineCategoryId": 0,
//         "categoryName": "",
//         "companyName": "",
//         "totalQuntity": 0,
//         "oldQuntity": 0,
//         "purchasePrice": 0,
//         "salePrice": 0,
//         "purchaseNo": 0,
//         "purchaseQuntity": 0
//           });


//     // Fetch all room types
//     const fetchApi = async () => {
//         try {
//             const response = await apiClient.get(`${BaseUrl}PharmacyMedicine/getAllData`);
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
//                     toast.error("Data updated successfully");
//                     setIsEdit(false); // Reset edit state after update
//                 } else {
//                     toast.error("Update failed! Please try again");
//                 }
//             } else {
//                 // Save API call for new room type
//                 const response = await apiClient.post(
//                     `${BaseUrl}PharmacyMedicine/saveData`,
//                     inputs
//                 );
//                 if (response.status === 200) {
//                     toast.error("Data saved successfully");
//                 } else {
//                     toast.error("Save failed! Please try again");
//                 }
//             }
//             fetchApi(); // Refresh the list of room types after save or update
//             setInputs({ categoryId: 0, categoryName: "", });
//         } catch (error) {
//             console.error("Error handling room type:", error);
//             toast.error("An error occurred. Please try again.");
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
//                         {/* <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
//                                 <label className="block font-semibold">Item Id</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className="w-full px-4 py-2 border rounded-lg focus:outline-none"
//                                     placeholder="id"
//                                     name="medicineId"
//                                     value={inputs.medicineId}
//                                     onChange={handleChange}
                                    
//                                 />
//                             </div>
//                         </div> */}
//                         <div className="flex flex-col sm:flex-row sm:items-center mb-4">
//                             <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
//                                 <label className="block font-semibold">Item Name</label>
//                             </div>
//                             <div className="w-full sm:w-[80%]">
//                                 <input
//                                     type="text"
//                                     className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                    
//                                     name="medicineName"
//                                     onChange={handleChange}
//                                     value={inputs.medicineName}
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
                          
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Item Name</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">category Name</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Company Name</th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Total Quntity </th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Purchase Price </th>
//                                     <th className="px-4 py-2 border border-gray-200 text-sky-500">Sale Price </th>

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
                                        
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.medicineName}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.categoryName}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.companyName}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.totalQuntity}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.purchasePrice}</td>
//                                             <td className="px-4 py-3 border border-gray-200">{transaction.salePrice}</td>
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
