'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { BaseUrl } from "@/app/config";
import { useState, useEffect } from "react";
import { toast } from 'sonner';


export function PurchaseReport() {
    return (
        <LayoutForm>
            <Heading headingText="Purchase Report" />
            <ReportForm />
        </LayoutForm>
    );
}


const ReportForm = () => {
    const [item, setItem] = useState([]);
    const [company, setCompany] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [data, setData] = useState([]);
    const [inputs, setInputs] = useState({
        purNo: '',
        purDate: '18/10/2024',
        billNo: '',
        billDate: '18/10/2024',
        supplier: '',
        itemName: '',
        batchNo: '',
        expiryDate: '',
        qty: 0,
        unit: 'PACK',
        freeQty: 0,
        mrp: 0,
        costPerPcs: 0,
        amount: 0,
        netAmount: 0,
        totalAmt: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        netAmt: 0,
        balance: 0,
        remark: '',
        freight: 0,
        otherCharges: 0,
        payMode: 'CASH',
    });
    const [items, setItems] = useState([]);


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
                purNo: '',
                purDate: '18/10/2024',
                billNo: '',
                billDate: '18/10/2024',
                supplier: '',
                itemName: '',
                batchNo: '',
                expiryDate: '',
                qty: 0,
                unit: 'PACK',
                freeQty: 0,
                mrp: 0,
                costPerPcs: 0,
                amount: 0,
                netAmount: 0,
                totalAmt: 0,
                cgst: 0,
                sgst: 0,
                igst: 0,
                netAmt: 0,
                balance: 0,
                remark: '',
                freight: 0,
                otherCharges: 0,
                payMode: 'CASH',
            });
        } catch (error) {
            console.error("Error handling room type:", error);
            toast.error("An error occurred. Please try again.");
        }
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

    const fetchSupplier = async () => {
        const response = await apiClient.get(`spplierData/getAllData`)
        if (response.status === 200) {
            setSupplier(response.data.data)
        }
    }

    const handleSupplier = (e) => {
        const id = e.target.value
        setInputs({ ...inputs, supplierId: id })
    }

    useEffect(() => {
        fetchCompany();
        fetchItem();
        fetchSupplier();
    }, []);

    return (
        <>
            <div className="p-6">
                {/* Purchase and Bill Details */}
                <div className="mt-6 bg-white p-6 rounded-md shadow-md">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 m-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date From</label>
                            <input
                                type="text"
                                name="purNo"
                                value={inputs.purNo}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date To.</label>
                            <input
                                type="text"
                                name="purDate"
                                value={inputs.purDate}
                                readOnly
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Supplier </label>
                            <select onChange={handleSupplier} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                <option >select  Company</option>
                                {supplier.map((supplier,index) => (
                                    <option key={index} value={supplier.supplierId}>{supplier.supplierName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">company </label>
                            <select onChange={handleCompany} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                <option >select  Company</option>
                                {company.map((Company,index) => (
                                    <option key={index} value={Company.companyId}>{Company.companyName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Item Name </label>
                            <select onChange={handleItem} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                <option >select  Item</option>
                                {item.map((item,index) => (
                                    <option key={index} value={item.medicineId}>{item.medicineName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Show Report
                </button>
                </div>
                

                {/* Item Details */}

            </div>
        </>
    );
};


export default withAuth(PurchaseReport, ['DOCTOR', 'ADMIN', 'SUPERADMIN'])