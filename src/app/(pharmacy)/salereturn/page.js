'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { BaseUrl } from "@/app/config";
import { useState, useEffect } from "react";
import { toast } from 'sonner';
import { FaPlus, FaTrash } from 'react-icons/fa';

export function SaleReturn() {
    return (
        <LayoutForm>
           
            <SaleReturnPage />
        </LayoutForm>
    );
}



const SaleReturnPage = () => {
    const [formData, setFormData] = useState({
        saleNo: 0 || "",
        saleCode: '',
        saleDate: '',
        customerType: '',
        customerName: '',
        doctorName: '',
    });

    const [currentItem, setCurrentItem] = useState({
        medicineNames: '',
        batchNo: '',
        expiryDates: '',
        quantity: 0,
        packetOrPcs: '',
        rate: 0,
    });

    const [tableData, setTableData] = useState([]);
    const [calculations, setCalculations] = useState({
        totalAmount: 0,
        discount: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        netAmount: 0,
        paid: 0,
        balance: 0,
        payMode: '',
        remark: '',
    });

    // Calculate total whenever tableData changes
    useEffect(() => {
        const subTotal = tableData.reduce((sum, item) => sum + item.quantity * item.rate, 0);
        updateCalculations({ ...calculations, totalAmount: subTotal });
    }, [tableData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem((prevItem) => ({ ...prevItem, [name]: value }));
    };

    const updateCalculations = (newCalc) => {
        const { totalAmount, discount = 0, cgst = 0, sgst = 0, igst = 0, paid = 0 } = newCalc;

        const cgstAmount = (totalAmount * cgst) / 100;
        const sgstAmount = (totalAmount * sgst) / 100;
        const igstAmount = (totalAmount * igst) / 100;
        const discountAmount = (totalAmount * discount) / 100;
        const netAmount = totalAmount + cgstAmount + sgstAmount + igstAmount - discountAmount;
        const balance = netAmount - paid;

        setCalculations({ ...newCalc, netAmount, balance });
    };

    const handleCalculationChange = (e) => {
        const { name, value } = e.target;
        const numValue = name === 'payMode' || name === 'remark' ? value : parseFloat(value) || 0;
        updateCalculations({ ...calculations, [name]: numValue });
    };

    const addItemToTable = () => {
        if (!currentItem.medicineNames || !currentItem.batchNo) {
            toast.error('Please fill in at least Medicine Name and Batch Number');
            return;
        }
        setTableData((prevData) => [...prevData, { ...currentItem, id: Date.now() }]);
        setCurrentItem({
            medicineNames: '',
            batchNo: '',
            expiryDates: '',
            quantity: 0,
            packetOrPcs: '',
            rate: 0,
        });
    };

    const removeItem = (id) => {
        setTableData((prevData) => prevData.filter((item) => item.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            items: tableData,
            ...calculations,
        };

        const dataToBeSend = {
            ...finalData,
            ...calculations,
            medicineNames: tableData.map((data) => data.medicineNames),
            "batchNo": tableData.map((data) => data.batchNo),
            "expariyDates": tableData.map((data) => data.expiryDates),
            "quantity": tableData.map((data) => data.quantity),
            "packetOrPcs": tableData.map((data) => data.packetOrPcs),
            "rate": tableData.map((data) => data.rate),
        }
        // console.log("medicines names",dataToBeSend)
        // console.log('Final Form Data:', finalData);

        const response = await apiClient.post('itemSale/returnData', dataToBeSend);
        console.log(response.data.data)
        if (response.status === 200) {
            toast.success('Data has been submitted successfully')
            fetchAllApi()
        }
        else {
            toast.error("something went wrong")
        }
    };

    const [data, setData] = useState([])
    const fetchAllApi = async () => {
        const response = await apiClient.get(`itemSale/getAllData/returnData`)
        console.log(response.data.data)
        if (response.status === 200) {
            setData(response.data.data)
        }
    }
    useEffect(() => {
        fetchAllApi()
    }, [])

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
             <Heading headingText="Sale Return" />
            <div className=" py-2">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 border  bg-white rounded-md p-2 shadow-md">
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2">
                            <div className="space-y-2">
                                <label htmlFor="saleNo" className="block text-sm font-medium text-gray-700">
                                    Sale Number
                                </label>
                                <input
                                    type="text"
                                    id="saleNo"
                                    readOnly
                                    name="saleNo"
                                    value={formData.saleNo}
                                    onChange={handleChange}
                                    className="w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    required
                                />
                            </div>


                            {/* Sale Code */}
                            <div className="space-y-2">
                                <label htmlFor="saleCode" className="block text-sm font-medium text-gray-700">
                                    Sale Code
                                </label>
                                <input
                                    type="text"
                                    id="saleCode"
                                    name="saleCode"
                                    value={formData.saleCode}
                                    onChange={handleChange}
                                    className="w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Sale Date */}
                            <div className="space-y-2">
                                <label htmlFor="saleDate" className="block text-sm font-medium text-gray-700">
                                    Sale Date
                                </label>
                                <input
                                    type="date"
                                    id="saleDate"
                                    name="saleDate"
                                    value={formData.saleDate}
                                    onChange={handleChange}
                                    className="w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Customer Type */}
                            <div className="space-y-2">
                                <label htmlFor="customerType" className="block text-sm font-medium text-gray-700">
                                    Customer Type
                                </label>
                                <input
                                    type="text"
                                    id="customerType"
                                    name="customerType"
                                    value={formData.customerType}
                                    onChange={handleChange}
                                    className="w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Customer Name */}
                            <div className="space-y-2">
                                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    id="customerName"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    className="w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Doctor Name */}
                            <div className="space-y-2">
                                <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">
                                    Doctor Name
                                </label>
                                <input
                                    type="text"
                                    id="doctorName"
                                    name="doctorName"
                                    value={formData.doctorName}
                                    onChange={handleChange}
                                    className="w-full text-sm rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 border  bg-white rounded-md p-2 shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
                                <input
                                    type="text"
                                    name="medicineNames"
                                    value={currentItem.medicineNames}
                                    onChange={handleItemChange}
                                    className="w-full text-sm rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Batch Number</label>
                                <input
                                    type="text"
                                    name="batchNo"
                                    value={currentItem.batchNo}
                                    onChange={handleItemChange}
                                    className="w-full text-sm rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                <input
                                    type="date"
                                    name="expiryDates"
                                    value={currentItem.expiryDates}
                                    onChange={handleItemChange}
                                    className="w-full text-sm rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={currentItem.quantity}
                                    onChange={handleItemChange}
                                    className="w-full text-sm rounded-md border border-gray-300 px-3 py-2"
                                    min="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Packet/Pcs</label>
                                <input
                                    type="text"
                                    name="packetOrPcs"
                                    value={currentItem.packetOrPcs}
                                    onChange={handleItemChange}
                                    className="w-full text-sm rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Rate</label>
                                <input
                                    type="text"
                                    name="rate"
                                    value={currentItem.rate}
                                    onChange={handleItemChange}
                                    className="w-full text-sm rounded-md border border-gray-300 px-3 py-2"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={addItemToTable}
                                className="flex text-sm items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                                <FaPlus size={16} />
                                Add Item
                            </button>
                        </div>

                        <div className="bg-white p-2 rounded-lg ">
                            {tableData.length > 0 && (
                                <div className="overflow-x-auto">
                                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                        <table className="table-auto w-full border border-collapse shadow">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Medicine</th>
                                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Batch No</th>
                                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Expiry</th>
                                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Qty</th>
                                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Pack/Pcs</th>
                                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Rate</th>
                                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Amount</th>
                                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {tableData.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-3 border border-gray-200">{item.medicineNames}</td>
                                                        <td className="px-4 py-3 border border-gray-200">{item.batchNo}</td>
                                                        <td className="px-4 py-3 border border-gray-200">{item.expiryDates}</td>
                                                        <td className="px-4 py-3 border border-gray-200">{item.quantity}</td>
                                                        <td className="px-4 py-3 border border-gray-200">{item.packetOrPcs}</td>
                                                        <td className="px-4 py-3 border border-gray-200">{item.rate}</td>
                                                        <td className="px-4 py-3 border border-gray-200">{item.quantity * item.rate}</td>
                                                        <td className="px-4 py-3 border border-gray-200">
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <FaTrash size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                        </div>
                        <div className="space-y-2 mb-4 border  bg-white rounded-md p-2 shadow-md">

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left Column - Amounts */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                                        <input
                                            type="text"
                                            value={calculations.totalAmount}
                                            className="w-full text-sm mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                                            readOnly
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                                        <input
                                            type="text"
                                            name="discount"
                                            value={calculations.discount}
                                            onChange={handleCalculationChange}
                                            className="w-full text-sm mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                            min="0"
                                            max="100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Net Amount</label>
                                        <input
                                            type="text"
                                            value={calculations.netAmount}
                                            className="w-full text-sm mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md font-semibold"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Middle Column - GST */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">CGST (%)</label>
                                        <input
                                            type="text"
                                            name="cgst"
                                            value={calculations.cgst}
                                            onChange={handleCalculationChange}
                                            className="w-full text-sm mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">SGST (%)</label>
                                        <input
                                            type="text"
                                            name="sgst"
                                            value={calculations.sgst}
                                            onChange={handleCalculationChange}
                                            className="w-full text-sm mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">IGST (%)</label>
                                        <input
                                            type="text"
                                            name="igst"
                                            value={calculations.igst}
                                            onChange={handleCalculationChange}
                                            className="w-full text-sm mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                {/* Right Column - Payment */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
                                        <select
                                            name="payMode"
                                            value={calculations.payMode}
                                            onChange={handleCalculationChange}
                                            className="w-full text-sm mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="">Select Payment Mode</option>
                                            <option value="cash">Cash</option>
                                            <option value="card">Card</option>
                                            <option value="upi">UPI</option>
                                            <option value="bank">Bank Transfer</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Paid Amount</label>
                                        <input
                                            type="text"
                                            name="paid"
                                            value={calculations.paid}
                                            onChange={handleCalculationChange}
                                            className="w-full text-sm mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Balance</label>
                                        <input
                                            type="text"
                                            value={calculations.balance}
                                            className="w-full text-sm mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md font-semibold text-red-600"
                                            readOnly
                                        />
                                    </div>
                                </div>
                

                            {/* Remark Field */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700">Remark</label>
                                <textarea
                                    name="remark"
                                    value={calculations.remark}
                                    onChange={handleCalculationChange}
                                    className="w-full text-sm mt-1 px-3 py-2 border border-gray-300 rounded-md"
                                    rows="2"
                                />
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="bg-blue-500 text-sm text-white px-6 py-2 rounded-md hover:bg-blue-600"
                        >
                            Submit Sale
                        </button>
                    </div>
                    <div className="bg-white md:p-2 rounded-lg shadow-md mt-2">
                        <div className="overflow-x-auto">
                            <div
                                className="w-full"
                                style={{ maxHeight: "400px", overflowY: "auto" }}
                            >
                                <table className="table-auto w-full border border-collapse shadow">
                                    <thead>
                                        <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                            <th className="px-4 py-2 border border-gray-200 text-sky-500">Customer Type</th>
                                            <th className="px-4 py-2 border border-gray-200 text-sky-500">Customer Name</th>
                                            <th className="px-4 py-2 border border-gray-200 text-sky-500">Doctor Name</th>
                                            <th className="px-4 py-2 border border-gray-200 text-sky-500">Total Amount</th>



                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={index}>
                                                <td className="border border-gray-300 p-2">{item.customerType}</td>
                                                <td className="border border-gray-300 p-2">{item.customerName}</td>
                                                <td className="border border-gray-300 p-2">{item.doctorName}</td>
                                                <td className="border border-gray-300 p-2">{item.totalAmount}</td>



                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default withAuth(SaleReturn, ['DOCTOR', 'ADMIN', 'SUPERADMIN'])

