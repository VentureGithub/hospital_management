'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';
import { useState, useEffect } from "react";

export function PurchaseReturn() {
    return (
        <LayoutForm>
            <PurchaseReturnPage />
        </LayoutForm>
    );
}
const PurchaseReturnPage = () => {
    const [totalAmount, setTotalAmount] = useState(0);
    const [cgst, setCgst] = useState(0);
    const [sgst, setSgst] = useState(0);
    const [igst, setIgst] = useState(0);
    const [discAmnt, setDiscAmnt] = useState(0);
    const [netAmnt, setNetAmnt] = useState(0);
    const [payMode, setPayMode] = useState("Cash");
    const [balance, setBalance] = useState(0)
    const [formData, setFormData] = useState({
        purchaseId: 0,
        purchaseDate: '',
        purNo: '',
        billNo: '',
        billDate: '',
        medicineName: '',
        batchNo: '',
        expiryDate: '',
        quantity: 0,
        rate: 0,
        mrp: 0,
        amount: 0,
        itemDiscAmnt: 0,
        taxId: 0,
        netAmount: 0,
        unit: '',

    });
    const [searchId, setSearchId] = useState('');
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [supplierId, setSupplierId] = useState(0)





    // Add search functionality
    const handleSearch = async () => {
        try {
            const response = await apiClient.get(`purchaseInvoice_table/getData/byId?invoiceId=${searchId}`);
            if (response.status === 200) {
                const purchaseData = response.data.data;

                // Update form data
                setFormData({
                    purchaseId: purchaseData.purchaseId || 0,
                    purchaseDate: purchaseData.purchaseDate || '',
                    purNo: purchaseData.purNo || '',
                    billNo: purchaseData.billNo || '',
                    billDate: purchaseData.billDate || '',
                    supplierId: purchaseData.supplierId || 0,
                });

                // Update table data
                if (purchaseData.tableData && Array.isArray(purchaseData.tableData)) {
                    setTableData(purchaseData.tableData);
                }

                // Update other states
                setTotalAmount(purchaseData.totalAmount || 0);
                setCgst(purchaseData.cgst || 0);
                setSgst(purchaseData.sgst || 0);
                setIgst(purchaseData.igst || 0);
                setDiscAmnt(purchaseData.discAmnt || 0);
                setNetAmnt(purchaseData.netAmnt || 0);
                setPayMode(purchaseData.payMode || 'Cash');
                setBalance(purchaseData.balance || 0);

                setIsUpdateMode(true);
            }
        } catch (error) {
            console.error('Error fetching purchase data:', error);
            toast.error('Error fetching purchase data');
        }
    };

    // Modified handleSave to handle both create and update
    const handleSave = async () => {
        const taxIdMapping = tax.reduce((acc, curr) => {
            acc[curr.tax] = curr.taxId; // Map tax value to its corresponding tax ID
            return acc;
        }, {});

        // Create a new array with tax IDs instead of tax values
        const modifiedData = tableData.map(item => ({
            ...item,
            tax: taxIdMapping[item.tax] || null // Replace tax value with tax ID
        }));
        const data = {
            purchaseId: isUpdateMode ? parseInt(searchId) : 0,
            purchaseDate: formData.purchaseDate,
            purNo: formData.purNo,
            billNo: formData.billNo,
            billDate: formData.billDate,
            medicineNames: tableData.map((data) => data?.medicineName),
            batchNo: tableData.map((data) => data?.batchNo),
            expiryDate: tableData.map((data) => data?.expiryDate),
            quantity: tableData.map((data) => parseInt(data?.quantity)),
            freeQuantity: tableData.map((data) => data?.freeQuantity),
            rate: tableData.map((data) => parseInt(data?.rate)),
            unit: tableData.map((data) => data?.unit),
            itemDiscAmnt: tableData.map((data) => data.itemDiscAmnt),
            netAmount: tableData.map((data) => data.netAmount),
            "taxId": modifiedData.map((data) => data.tax),
            supplierId: supplierId,
            discAmnt,
            totalAmount,
            payMode,
            cgst,
            igst,
            sgst,
            netAmnt,
            tableData,
        };

        try {
            const endpoint = isUpdateMode ?
                `purchaseInvoice_table/updatePurchase/${searchId}` :
                'purchaseInvoiceReturn/ReturnData';

            const response = await apiClient[isUpdateMode ? 'put' : 'post'](endpoint, data);

            if (response.status === 200) {
                toast.success(isUpdateMode ? "Data updated successfully" : "Data saved successfully");
                handleReset();
                fetchAllApi()
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error('Error saving/updating data:', error);
            toast.error("Error saving/updating data");
        }
    };

    // Add reset functionality
    const handleReset = () => {
        setSearchId('');
        setIsUpdateMode(false);
        setFormData({
            purchaseId: 0,
            purchaseDate: '',
            purNo: '',
            billNo: '',
            billDate: '',
            medicineName: '',
            batchNo: '',
            expiryDate: '',
            quantity: 0,
            rate: 0,
            mrp: 0,
            amount: 0,
            itemDiscAmnt: 0,
            taxId: 0,
            netAmount: 0,
            unit: '',
            supplierId: 0
        });
        setTableData([]);
        setTotalAmount(0);
        setCgst(0);
        setSgst(0);
        setIgst(0);
        setDiscAmnt(0);
        setNetAmnt(0);
        setPayMode("Cash");
        setBalance(0);
    };


    const [tableData, setTableData] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAdd = () => {
        // Validate inputs before adding
        if (!formData.medicineName || !formData.batchNo) {
            toast.error("Please fill in the required fields.");
            return;
        }

        // Add data to the table
        setTableData([...tableData, formData]);

        // Reset form after adding
        setFormData({
            purchaseId: 0,
            purchaseDate: '',
            purNo: '',
            billNo: '',
            billDate: '',
            medicineName: '',
            batchNo: '',
            expiryDate: '',
            quantity: 0,
            freeQuantity: 0,
            rate: 0,
            mrp: 0,
            amount: 0,
            itemDiscAmnt: 0,
            taxId: 0,
            netAmount: 0,
            unit: '',
        });
    };

    const [tax, setTax] = useState([])
    const fetchTax = async () => {
        const response = await apiClient.get('tax/getAllTax')
        console.log(response.data)
        setTax(response.data.data)
    }
    useEffect(() => {
        fetchTax()
    }, [])



    useEffect(() => {
        const quantity = parseFloat(formData.quantity) || 0;
        const rate = parseFloat(formData.rate) || 0;
        const itemDiscAmnt = parseFloat(formData.itemDiscAmnt) || 0;
        const taxId = parseFloat(formData.taxId) || 0;

        const calculatedAmount = quantity * rate;
        const calculatedNetAmount = calculatedAmount - itemDiscAmnt + taxId;

        setFormData(prev => ({
            ...prev,
            amount: calculatedAmount.toFixed(2),
            netAmount: calculatedNetAmount.toFixed(2)
        }));
    }, [formData.quantity, formData.rate, formData.itemDiscAmnt, formData.taxId]);


    useEffect(() => {
        const quantity = parseFloat(formData.quantity) || 0;
        const rate = parseFloat(formData.rate) || 0;
        const calculatedAmount = quantity * rate;
        setFormData(prev => ({
            ...prev,
            amount: calculatedAmount.toFixed(2),
            netAmount: calculatedAmount.toFixed(2)
        }));
    }, [formData.quantity, formData.rate]);

    useEffect(() => {
        calculateTotals();
    }, [tableData, cgst, sgst, igst, discAmnt, balance]);

    const calculateTotals = () => {
        const totalNetAmount = tableData.reduce((total, item) => total + parseFloat(item.netAmount || 0), 0);
        setTotalAmount(totalNetAmount.toFixed(2));

        const calculatedCgst = totalNetAmount * 0.09; // Assuming 9% CGST
        const calculatedSgst = totalNetAmount * 0.09; // Assuming 9% SGST
        const calculatedIgst = totalNetAmount * 0.18; // Assuming 18% IGST
        setCgst(calculatedCgst.toFixed(2));
        setSgst(calculatedSgst.toFixed(2));
        setIgst(calculatedIgst.toFixed(2));

        const finalAmountAfterDiscount = totalNetAmount + calculatedCgst + calculatedSgst + calculatedIgst - discAmnt - balance;
        setNetAmnt(finalAmountAfterDiscount.toFixed(2));
    };

    const [supplierData, setSupplierData] = useState([])
    const fetchAllSupplier = async () => {
        const response = await apiClient.get(`spplierData/getAllData`)
        console.log(response.data.data)
        setSupplierData(response.data.data)
    }
    useEffect(() => {
        fetchAllSupplier()
    }, [])

    const handleRemoveRow = (index) => {
        const newTableData = tableData.filter((_, i) => i !== index);
        setTableData(newTableData);
    };

    const [data, setData] = useState([])
    const fetchAllApi = async () => {
        const response = await apiClient.get(`purchaseInvoiceReturn/getAllData`)
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
            <Heading headingText="Purchase Return" />
            <div className="mb-4 border  bg-white rounded-md p-2">
                <h3 className="text-xl font-semibold text-sky-500">Purchase Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2">
                    <div className=" mb-4">
                        <label className="block text-sm font-medium">Pur No.</label>
                        <input
                            type="text"
                            name="purNo"
                            placeholder="Purchase Number"
                            readOnly
                            value={formData.purNo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                        />
                    </div>
                    <div className=" mb-4">
                        <label className="block text-sm font-medium">Bill No.</label>
                        <input
                            type="text"
                            name="billNo"
                            placeholder="Bill Number"
                            value={formData.billNo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                        />
                    </div>
                    <div className=" mb-4">
                        <label className="block text-sm font-medium">Pur Date</label>
                        <input
                            type="date"
                            name="purchaseDate"
                            value={formData.purchaseDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                        />
                    </div>
                    <div className=" mb-4">
                        <label className="block text-sm font-medium">Bill Date</label>
                        <input
                            type="date"
                            name="billDate"
                            value={formData.billDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                        />
                    </div>
                    <div className=" mb-4">
                        <label className="block text-sm font-medium">Supplier</label>
                        <select onChange={(e) => setSupplierId(parseInt(e.target.value))} value={supplierId} className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm">
                            <option>
                                Select the Supplier
                            </option>
                            {supplierData.map((data) => (
                                <option key={data.id} value={data.supplierId}>{data.supplierName}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Medicine Details */}
            <div className="mx-auto border  bg-white rounded-md p-2">
                <h3 className="text-xl font-semibold mb-4 text-sky-500">Medicine Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2">
                    {/* Medicine Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
                        <input
                            type="text"
                            name="medicineName"
                            placeholder="Enter medicine name"
                            value={formData.medicineName}
                            onChange={handleChange}
                            className="mt-1 text-sm block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Batch Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Batch Number</label>
                        <input
                            type="text"
                            name="batchNo"
                            placeholder="Enter batch number"
                            value={formData.batchNo}
                            onChange={handleChange}
                            className="mt-1 text-sm block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className="mt-1 text-sm block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Unit Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Unit</label>
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="mt-1 text-sm block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="pcs">Pieces</option>
                            <option value="packet">Packet</option>
                        </select>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                            type="text"
                            name="quantity"
                            placeholder="Enter quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className="mt-1 text-sm block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Rate */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rate per {formData.unit}</label>
                        <input
                            type="text"
                            name="rate"
                            placeholder="Enter rate"
                            value={formData.rate}
                            onChange={handleChange}
                            className="mt-1 text-sm block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* MRP */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">MRP</label>
                        <input
                            type="text"
                            name="mrp"
                            placeholder="Enter MRP"
                            value={formData.mrp}
                            onChange={handleChange}
                            className="mt-1 text-sm block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Item Discount Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Item Discount Amount</label>
                        <input
                            type="text"
                            name="itemDiscAmnt"
                            placeholder="Enter discount amount"
                            value={formData.itemDiscAmnt}
                            onChange={handleChange}
                            className="mt-1 text-sm block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Tax ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tax%</label>
                        <select
                            name="tax"
                            value={formData.tax}
                            onChange={handleChange}
                            className="mt-1 text-sm block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select an option</option>
                            {tax.map((data) => (
                                <option key={data.id} value={data.tax}>
                                    {data.tax}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Net Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Net Amount</label>
                        <input
                            type="text"
                            name="netAmount"
                            placeholder="Net amount"
                            value={formData.netAmount}
                            onChange={handleChange}
                            className="mt-1 text-sm block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
                            readOnly
                        />
                    </div>
                    {/* Amount Display */}
                    <div className="bg-white p-4 rounded-md text-sm">
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <div className="mt-1 text-lg font-semibold ">
                            ₹{formData.amount || '0.00'}
                        </div>
                    </div>
                </div>


                {/* Add and Save Buttons */}
                <div className="flex justify-between mb-4">
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 text-sm text-white px-4 p-2 rounded hover:bg-blue-600"
                    >
                        Add
                    </button>

                </div>


                <div className="bg-white md:p-2 rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <div
                            className="w-full"
                            style={{ maxHeight: "400px", overflowY: "auto" }}
                        >
                            <table className="table-auto w-full border border-collapse shadow">
                                <thead>
                                    <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Medicine Name</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Batch No</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Expiry Date</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Quantity</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Rate</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">MRP</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Amount</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500"> Net Amount</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 p-2">{item.medicineName}</td>
                                            <td className="border border-gray-300 p-2">{item.batchNo}</td>
                                            <td className="border border-gray-300 p-2">{item.expiryDate}</td>
                                            <td className="border border-gray-300 p-2">{item.quantity}</td>
                                            <td className="border border-gray-300 p-2">{item.rate}</td>
                                            <td className="border border-gray-300 p-2">{item.mrp}</td>
                                            <td className="border border-gray-300 p-2">{item.amount}</td>
                                            <td className="border border-gray-300 p-2">{item.netAmount}</td>
                                            <td className="border border-gray-300 p-2">
                                                <button
                                                    onClick={() => handleRemoveRow(index)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


                <div className="mt-4">
                    <div className="flex justify-end">Total Amount: ₹{totalAmount}</div>
                    <div className="flex justify-end">CGST: ₹{cgst}</div>
                    <div className="flex justify-end">SGST: ₹{sgst}</div>
                    <div className="flex justify-end">IGST: ₹{igst}</div>
                    <div className="flex justify-end">
                        <label>Discount Amount: </label>
                        <input
                            type="text"
                            name="discAmnt"
                            value={discAmnt}
                            onChange={(e) => setDiscAmnt(parseFloat(e.target.value) || 0)}
                            className="ml-2 border rounded p-1"
                        />
                    </div>
                    <div className="flex justify-end">
                        <label>Balance </label>
                        <input
                            type="text"
                            name="balance"
                            value={balance}
                            onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                            className="ml-2 border rounded p-1"
                        />
                    </div>
                    <div className="flex justify-end">Net Amount (after GST & Discount): ₹{netAmnt}</div>
                    <div className="flex justify-end">
                        <label>Payment Mode:</label>
                        <select value={payMode} onChange={(e) => setPayMode(e.target.value)} className="ml-2 border rounded p-1">
                            <option value="Cash">Cash</option>
                            <option value="Credit">Credit</option>
                            <option value="UPI">UPI</option>
                        </select>
                    </div>

                </div>
                <button
                    onClick={handleSave}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {isUpdateMode ? 'Update Data' : 'Save Data'}
                </button>
            </div>

            <div className="bg-white md:p-2 rounded-lg shadow-md mt-4">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Purchase Date</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Supplier Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Net Amount</th>


                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 p-2">{item.purchaseDate}</td>
                                        <td className="border border-gray-300 p-2">{item.supplierName}</td>
                                        <td className="border border-gray-300 p-2">{item.netAmnt}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAuth(PurchaseReturn, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);

