'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { BaseUrl } from "@/app/config";
import { toast } from 'sonner';
import { useState, useEffect } from "react";


export function OpeningBalance() {
    return (
        <LayoutForm>
            <Openingform />
        </LayoutForm>
    );
}

const Openingform = () => {

    const [isEdit, setIsEdit] = useState(false);
    const [item, setItem] = useState([]);
    const [company, setCompany] = useState([]);
    const [data, setData] = useState([]);
    const [inputs, setInputs] = useState({
        stockId: 0,
        date: "",
        medicineId: 0,
        companyId: 0,
        companyName: "",
        medicineName: "",
        batchNo: "",
        expiryDate: "",
        quantityPacket: 0,
        quantityPcs: 0,
        mrp: 0,
        purchaseRate: 0
    });


    // Fetch all room types
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`openingStock/getAllData`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);


    // Handle saving or updating the room type
    const handleOpening = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                // Corrected Update API call with room id
                const response = await apiClient.put(
                    `medicineCategory/updateMedicineCategory?Id=${inputs.categoryId}`, // Fixed URL construction
                    inputs
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
                    `openingStock/saveAllData`,
                    inputs
                );
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error("Save failed! Please try again");
                }
            }
            fetchApi(); // Refresh the list of room types after save or update
            setInputs({
                stockId: 0,
                date: "",
                medicineId: 0,
                companyId: 0,
                companyName: "",
                medicineName: "",
                batchNo: "",
                expiryDate: "",
                quantityPacket: 0,
                quantityPcs: 0,
                mrp: 0,
                purchaseRate: 0
            });
        } catch (error) {
            console.error("Error handling room type:", error);
            toast.error("An error occurred. Please try again.");
        }
    };


    // Set the form fields for editing a room type
    const handleUpdate = (Opening) => {
        setInputs({
            stockId: Opening.stockId,
            date: Opening.date,
            medicineId: Opening.medicineId,
            companyId: Opening.companyId,
            companyName: Opening.companyName,
            medicineName: Opening.medicineName,
            batchNo: Opening.batchNo,
            expiryDate: Opening.expiryDate,
            quantityPacket: Opening.quantityPacket,
            quantityPcs: Opening.quantityPcs,
            mrp: Opening.mrp,
            purchaseRate: Opening.purchaseRate
        });
        setIsEdit(true);
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const fetchCompany = async () => {
        const response = await apiClient.get(`compny/getAllCompnyName`)
        if (response.status === 200) {
            setCompany(response.data.data)
        }
    }

    const handleCompany = (e) => {
        const id = e.target.value
        setInputs({ ...inputs, companyId: id })
    }

    const fetchItem = async () => {
        const response = await apiClient.get(`PharmacyMedicine/getAllItemName`)
        if (response.status === 200) {
            setItem(response.data.data)
        }
    }

    const handleItem = (e) => {
        const id = e.target.value
        setInputs({ ...inputs, medicineId: id })
    }


    useEffect(() => {
        fetchCompany();
        fetchItem();
    }, []);


    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
             <Heading headingText="Opening Stock" />
            <div className='py-4'>
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 m-2 ">
                        <div>
                            <label className="block text-gray-700 text-sm">Date</label>
                            <input type="date"
                                className='w-full px-4 py-2 text-sm border rounded-lg focus:outline-none'
                                name="date"
                                onChange={handleChange}
                                value={inputs.date}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Company Name</label>
                          
                            <select onChange={handleCompany} className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none">
                                <option >select  Company</option>
                                {company.map((Company,index) => (
                                    <option  key={index} value={Company.companyId}>{Company.companyName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Item Name </label>
                            <select onChange={handleItem} className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none">
                                <option >select  Item</option>
                                {item.map((item,index) => (
                                    <option key={index} value={item.medicineId}>{item.medicineName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Batch No.</label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="batchNo"
                                onChange={handleChange}
                                value={inputs.batchNo}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Expiry Date</label>
                            <input type="date"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="expiryDate"
                                onChange={handleChange}
                                value={inputs.expiryDate}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Quntity</label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="quantityPacket"
                                onChange={handleChange}
                                value={inputs.quantityPacket}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Quntity Pcs</label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="quantityPcs"
                                onChange={handleChange}
                                value={inputs.quantityPcs}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Mrp</label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="mrp"
                                onChange={handleChange}
                                value={inputs.mrp}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Pur. Rate</label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="purchaseRate"
                                onChange={handleChange}
                                value={inputs.purchaseRate}
                            />
                        </div>
                    
                       
                       
                    </div>
                    <div className="flex justify-start w-full my--4 space-x-4 p-2">
                        <button className="bg-gray-600  text-sm text-white px-6 py-2 rounded-lg hover:bg-gray-900" type="button" >Refresh</button>
                        <button
                            className="bg-green-600 text-white  text-sm px-4 py-2 rounded-lg hover:bg-green-900"
                            onClick={handleOpening}
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
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr. No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Company Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Item Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Expiry Date</th>
                                    {/* <th className="px-4 py-2 border border-gray-200 text-sky-500">Unit 1</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Qty 1</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Unit 2</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Qty 2</th> */}
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">MRP</th>
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
                                            <td className="px-4 py-3 border border-gray-200">{index+1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.companyName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.medicineName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.expiryDate}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.mrp}</td>
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
        </div>
    );
};
export default withAuth(OpeningBalance, ['DOCTOR', 'ADMIN', 'SUPERADMIN'])
