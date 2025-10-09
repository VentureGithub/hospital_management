'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';

export function Supplier() {
    return (
        <LayoutForm>
            <SupplierMasterform />
        </LayoutForm>
    );
}


const SupplierMasterform = () => {
    const [data, setData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [inputs, setInputs] = useState({
         supplierCode: 0,
    name: "",
    gstin: "",
    phoneNo: "",
    fullAddress: "",
    state: "",
    openBlance: 0,
    paymentMethod: "",
    drOrCr: "",  
    accountNo: "",
    ifcCode: "",
    branchName: "",
    leaderCategory: "",
    city: "",
    supplierEamil: "",
    addDate: ""

    });


    // table
    const fetchApi = async () => {
        try {
            const response = await apiClient.get("supplyMaster/getAllSupplierMaster");
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);




    const handleSupplierMaster = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                // Corrected Update API call with room id
                const response = await apiClient.put(
                    `supplyMaster/updateSupplierMaster`, // Fixed URL construction
                    inputs
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
                    "supplyMaster/saveSupply",
                    inputs
                );
                console.log(response.data.data)
                if (response.status == 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error("Save failed! Please try again");
                }
            }
            fetchApi(); // Refresh the list of room types after save or update
            setInputs({
                supplierCode: 0,
                name: "",
                gstin: "",
                phoneNo: "",
                fullAddress: "",
                state: "",
                openBlance: 0,
                paymentMethod: "",
                accountNo: "",
                ifcCode: "",
                branchName: "",
                leaderCategory: "",
                city: "",
                supplierEamil: "",
                addDate: ""
            });
        } catch (error) {
            console.error("Error handling :", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleUpdate = (supplier) => {
        setInputs({


            supplierCode: supplier.supplierCode,
            name: supplier.name,
            gstin: supplier.gstin,
            phoneNo: supplier.phoneNo,
            fullAddress: supplier.fullAddress,
            state: supplier.state,
            openBlance: supplier.openBlance,
            paymentMethod: supplier.paymentMethod,
            accountNo: supplier.accountNo,
            ifcCode: supplier.ifcCode,
            branchName: supplier.branchName,
            leaderCategory: supplier.leaderCategory,
            city: supplier.city,
            addDate: supplier.addDate,
            supplierEamil: supplier.supplierEamil,
            drOrCr: supplier.drOrCr || "",
        });
        setIsEdit(true);
    };



    //handle inputs
    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
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

    //state name
    const handleStateChange = (e) => {
        console.log(e.target.value);  // You can use this value to set the selected state in your state.
        setInputs({ ...inputs, state: e.target.value });
    };






    return (
        <div className='p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6  rounded-xl shadow-2xl border border-sky-100'>
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <div className="flex items-center gap-3">
                    <Heading headingText="Supplier Master" />
                </div>
                <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">Store • Inventory</div>
            </div>
            <div className='py-4'>
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 m-2 ">
                        <div>
                            <label className="block text-gray-700 text-sm">Supplier Name</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm '

                                name="name"
                                onChange={handleChange}
                                value={inputs.name} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Phone No.</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm '

                                name="phoneNo"
                                onChange={handleChange}
                                value={inputs.phoneNo} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Supplier E-mail</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm '

                                name="supplierEamil"
                                onChange={handleChange}
                                value={inputs.supplierEamil} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">State</label>

                            <select onChange={handleStateChange} name="state" className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm bg-white/70 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-300">
                                {states.map((state, index) => (
                                    <option key={index} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">City</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm bg-white/70 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-300 '

                                name="city"
                                onChange={handleChange}
                                value={inputs.city} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">GSTIN</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm '

                                name="gstin"
                                onChange={handleChange}
                                value={inputs.gstin} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Address</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm '

                                name="fullAddress"
                                onChange={handleChange}
                                value={inputs.fullAddress} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Opening Balance</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm '

                                name="openBlance"
                                onChange={handleChange}
                                value={inputs.openBlance} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Payment Method</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm bg-white/70 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-300"
                                name="paymentMethod"
                                onChange={handleChange}
                                value={inputs.paymentMethod}>
                                <option value="select">--Select Payment--</option>
                                <option value="Online">Online</option>
                                <option value="Cash">Cash</option>
                            </select>
                            {inputs.paymentMethod === "Online" && (
    <div>
        <label className="block text-gray-700 text-sm">Credit / Debit</label>
        <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm bg-white/70 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-300"
            name="drOrCr"
            onChange={handleChange}
            value={inputs.drOrCr}
        >
            <option value="">--Select--</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
        </select>
    </div>
)}

                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Bank Branch</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm bg-white/70 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-300 '

                                name="branchName"
                                onChange={handleChange}
                                value={inputs.branchName} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">	A/C No</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm bg-white/70 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-300 '

                                name="accountNo"
                                onChange={handleChange}
                                value={inputs.accountNo} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">IFSC Code</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm bg-white/70 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-300 '

                                name="ifcCode"
                                onChange={handleChange}
                                value={inputs.ifcCode} />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Ledger Category</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm bg-white/70 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-300"
                                name="leaderCategory"
                                onChange={handleChange}
                                value={inputs.leaderCategory}>
                                <option value="select">--Select Ledger--</option>
                                <option value="retailer">Retailer</option>
                                <option value="wholeseller">Whole Seller</option>
                            </select>
                        </div>

                    </div>
                    <div className="flex justify-start  w-full space-x-4 p-2 my-4">
                        <button className="bg-slate-600 text-white px-6 py-2 text-sm rounded-lg hover:bg-slate-800">Refresh</button>
                        <button
                            className="bg-emerald-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-emerald-800"
                            onClick={handleSupplierMaster}
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
                            <thead className="sticky top-0 z-10">
                                <tr className="text-center bg-sky-50/70 backdrop-blur">
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Supplier Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Phone No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">State</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">City</th>

                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Ledger Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr
                                            key={index}
                                            className="border border-gray-200 text-center hover:bg-sky-50/40 transition">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button className="text-blue-400 hover:text-blue-800 flex items-center"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            {/* <td className="px-4 py-3 border border-gray-200">{transaction.medicineName}</td> */}
                                            <td className="px-4 py-3 border border-gray-200">{transaction.name}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.phoneNo}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.state}</td>

                                            <td className="px-4 py-3 border border-gray-200">{transaction.city}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.leaderCategory}</td>
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

export default withAuth(Supplier, ['DOCTOR', 'ADMIN', 'SUPERADMIN'])

