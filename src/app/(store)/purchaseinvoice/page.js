'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from 'sonner';
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";

export function PurchaseInvoice() {
    return (
        <LayoutForm>
            <PurchaseInvoicePage />
        </LayoutForm>
    );
}
const PurchaseInvoicePage = () => {
    const [data, setData] = useState([]);
    const [items, setItems] = useState([]);
    const [inputs, setInputs] = useState({
        purchaseId: 0,
        purchaseDate: "",
        purNo: "",
        billNo: "",
        billDate: "",
        remark: "",
        totalAmount: 0,
        cgst: 0,
        igst: 0,
        sgst: 0,
        discAmnt: 0,
        payMode: "CASH",
        itemNetAmount:0,
        supplierCode:0
    });

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('purchaseInvoiceReturn/getAllData');
                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else {
                    console.error("Unexpected response structure:", response.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
                toast.error("An error occurred while fetching data. Please try again.");
            }
        };
        fetchData();
    }, []);


    const [tax, setTax] = useState([])
    const fetchTax = async () => {
        const response = await apiClient.get('tax/getAllTax')
        console.log(response.data)
        setTax(response.data.data)
    }
    useEffect(() => {
        fetchTax()
    }, [])


    const [dataToSend, setDataToSend] = useState([]);

    // Handle input change
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedInputs = { ...inputs, [name]: value };
        setInputs(updatedInputs);

        // Calculate amounts using the updated inputs
        calculateAmounts(updatedInputs.quntity, updatedInputs.mrp, updatedInputs.tax);
    };
    // Handle save action
    const handleSave = async () => {


        // Log the original data
        console.log(dataToSend);

        // Create a mapping of tax values to their IDs
        const taxIdMapping = tax.reduce((acc, curr) => {
            acc[curr.tax] = curr.taxId; // Map tax value to its corresponding tax ID
            return acc;
        }, {});

        // Create a new array with tax IDs instead of tax values
        const modifiedData = dataToSend.map(item => ({
            ...item,
            tax: taxIdMapping[item.tax] || null // Replace tax value with tax ID
        }));

        console.log(modifiedData);
        const data = {
            purchaseId : inputs.purchaseId,
            purchaseDate:inputs.purchaseDate,
            billNo:inputs.billNo,
            supplierCode:parseInt(inputs.supplierCode),
            "itemName":items.map((data) => data.medcineName),        
              "quntity":items.map((data) => parseInt(data.quntity, 10)),
              "rate": items.map(((data) => parseInt(data.mrp))),
              "amount": modifiedData.map((data) =>parseInt( data.costPerPcs)),
              "taxId": modifiedData.map((data) => data.tax),
              "netAmount": modifiedData.map((data) => parseInt(data.itemNetAmount)),
              "godsRemark": inputs.remark,
              "totalAmnt": inputs.totalAmount,
              "cgst": inputs.cgst,
              "igst": inputs.igst,
              "sgst": inputs.sgst,
              "freight": 0,
              "servicename": "string",
              "otherCharges": 0,
              "otherChargesService": "string",
              "discAmount": inputs.discAmnt,
              "netAmnt": inputs.netAmount,
              "balance": inputs.balance,
              "payMode": inputs.payMode,
              "paid": 0,
              "name": "string",
              "phoneNo": "string",
              "supplierEamil": "string"
        }
        console.log(data)
        const response = await apiClient.post(`purchaseInvoice/savePurchaseInvoice`,data)
        console.log(response.data.data)
        if(response.status === 200)
        {
            toast.success("data saved successfully")
            fetchTableData()
        }
        
    };
     const [supplierData, setSupplierData] = useState([])
    const fetchAllSupplier = async () => {
        const response = await apiClient.get(`supplyMaster/getAllSupplierMaster`)
        console.log(response.data.data)
        setSupplierData(response.data.data)
    }
    useEffect(() => {
        fetchAllSupplier()
    }, [])



    const calculateAmounts = (quantity, rate, taxPercentage) => {
        const qty = parseFloat(quantity) || 0;
        const r = parseFloat(rate) || 0;
        const tax = parseFloat(taxPercentage) || 0;

        // Calculate the amount
        const amount = qty * r;

        // Calculate the final net amount
        const finalAmount = amount + (amount * (tax / 100));

        // Update the input state with calculated values
        setInputs(prev => ({
            ...prev,
            costPerPcs: amount.toFixed(2), // Amount
            itemNetAmount: finalAmount.toFixed(2) // Final net amount
        }));
    };


    const handleAddItem = () => {
        const { medcineName, quntity, mrp, tax } = inputs;
        const quantity = parseFloat(quntity);
        const rate = parseFloat(mrp);
        const taxPercentage = parseFloat(tax) || 0;

        // Check if all required fields are filled
        if (medcineName && quantity && rate) {
            const newItem = {
                medcineName,
                quntity,
                mrp,
                costPerPcs: inputs.costPerPcs,
                tax: taxPercentage,
                itemNetAmount: inputs.itemNetAmount
            };

            // Update items state
            setItems(prev => [...prev, newItem]);
            setDataToSend(prev => [...prev, newItem]);

            // Reset input fields
            setInputs(prev => ({
                ...prev,
                medcineName: '',
                quntity: '',
                mrp: '',
                costPerPcs: '0.00',
                tax: '',
                itemNetAmount: '0.00'
            }));
        } else {
            toast.error('Please fill in all fields'); // toast.error if fields are missing
        }
    };
    

    useEffect(() => {
        // Calculate total net amount
        const totalNetAmount = items.reduce((sum, item) => sum + parseFloat(item.itemNetAmount || 0), 0);
        setInputs(prev => ({ ...prev, totalAmount: totalNetAmount }));

        // Calculate other values based on total net amount
        const discount = parseFloat(inputs.discAmnt) || 0;
        const cgstRate = parseFloat(inputs.cgst) || 0;
        const sgstRate = parseFloat(inputs.sgst) || 0;
        const igstRate = parseFloat(inputs.igst) || 0;

        const cgstAmount = (totalNetAmount * cgstRate) / 100;
        const sgstAmount = (totalNetAmount * sgstRate) / 100;
        const igstAmount = (totalNetAmount * igstRate) / 100;

        const netAmount = totalNetAmount + cgstAmount + sgstAmount + igstAmount - discount;

        // Update state
        setInputs(prev => ({
            ...prev,
            balance: netAmount,
            netAmount: netAmount.toFixed(2)
        }));
    }, [items, inputs.cgst, inputs.sgst, inputs.igst, inputs.discAmnt]);

    const [fetchData,setFetchData] = useState([])
    const fetchTableData = async() => {
        const response = await apiClient.get(`purchaseInvoice/getAllInvoiceList`)
        if(response.status === 200)
        {
            setFetchData(response.data.data)
        }

    }
    useEffect(() => {
        fetchTableData()
    },[])




    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="Purchase Invoice " />
            {/* <div className='py-4'> */}
            {/* Purchase and Bill Details */}
            <div className="my-4 bg-white p-6 rounded-md shadow-md">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 m-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pur.No.</label>
                        <input
                            type="text"
                            name="purNo"
                            value={inputs.purNo}
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pur. Date</label>
                        <input
                            type="date"
                            name="purchaseDate"
                            value={inputs.purchaseDate}
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bill No.</label>
                        <input
                            type="text"
                            name="billNo"
                            value={inputs.billNo}
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bill Date</label>
                        <input
                            type="date"
                            name="billDate"
                            value={inputs.billDate}
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Supplier</label>
                        <select
                            name="supplierCode"
                            value={inputs.supplierCode}
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm p-2 border border-gray-300 rounded-md"
                        >
                            <option value="" disabled>Select Supplier</option>
                            {supplierData?.map((data) => (
                                <option key={data.id} value={data.supplierCode}>{data.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Item Details */}
            <div className="mt-6 bg-white p-6 rounded-md shadow-md">
                <h3 className="text-lg font-semibold text-blue-500">ITEM DETAILS</h3>
                <div className="bg-white p-4 rounded-md shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Item Name</label>
                        <input
                            type="text"
                            name="medcineName"
                            value={inputs.medcineName}
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                            type="number"
                            name="quntity"
                            value={inputs.quntity}
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rate</label>
                        <input
                            type="number"
                            name="mrp"
                            value={inputs.mrp}
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                            type="number"
                            name="costPerPcs"
                            value={inputs.costPerPcs}
                            readOnly
                            className="mt-1 block w-full text-sm p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tax%</label>
                        <select
                            name="tax"
                            value={inputs.tax}
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select an option</option>
                            {tax.map((data) => (
                                <option key={data.id} value={data.tax}>
                                    {data.tax}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Net Amount</label>
                        <input
                            type="number"
                            name="netAmount"
                            value={inputs.itemNetAmount}
                            readOnly
                            className="mt-1 block w-full text-sm p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900"
                        />
                    </div>

                    <div className="col-span-6">
                        <button
                            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600"
                            onClick={handleAddItem}
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Items Table */}
                <div className="bg-white my-2 rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr. No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Item Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Quantity</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Rate</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Amount</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Tax%</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Net Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length > 0 ? (
                                    items.map((item, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{item.medcineName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{item.quntity}</td>
                                            <td className="px-4 py-3 border border-gray-200">{item.mrp}</td>
                                            <td className="px-4 py-3 border border-gray-200">{item.costPerPcs}</td>
                                            <td className="px-4 py-3 border border-gray-200">{item.tax}</td>
                                            <td className="px-4 py-3 border border-gray-200">{item.itemNetAmount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">No items added</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                

                {/* Payment & Other Details */}
                <div className="mt-6 bg-white p-6 rounded-md shadow-md grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 m-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Remark Goods</label>
                        <input
                            type="text"
                            name="remark"
                            value={inputs.remark}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                        <input
                            type="number"
                            name="totalAmount"
                            value={inputs.totalAmount}
                            readOnly
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">CGST (%)</label>
                        <input
                            type="number"
                            name="cgst"
                            value={inputs.cgst}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">SGST (%)</label>
                        <input
                            type="number"
                            name="sgst"
                            value={inputs.sgst}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">IGST (%)</label>
                        <input
                            type="number"
                            name="igst"
                            value={inputs.igst}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dis. Amount</label>
                        <input
                            type="number"
                            name="discAmnt"
                            value={inputs.discAmnt}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Balance</label>
                        <input
                            type="number"
                            name="balance"
                            value={inputs.balance}
                            readOnly
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Net Amount</label>
                        <input
                            type="number"
                            name="netAmount"
                            value={inputs.netAmount}
                            readOnly
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pay Mode</label>
                        <select
                            name="payMode"
                            value={inputs.payMode}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="CASH">CASH</option>
                            <option value="ONLINE">ONLINE</option>
                        </select>
                    </div>
                </div>
                
            </div>
            {/* Save and Refresh Buttons */}
            <div className="mt-6 flex justify-start gap-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" onClick={handleSave}>
                    Save
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={() => window.location.reload()}>
                    Refresh
                </button>
            </div>

            {/* Table to Display Purchase Rtn No. */}
            <div className="bg-white p-2 m-2 md:p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border border-collapse shadow">
                        <thead>
                            <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Supplier Name</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Supplier Email</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Net Amount</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {fetchData.length > 0 ? (
                                fetchData.map((transaction, index) => (
                                    <tr key={index} className="border border-gray-200 text-center">
                                        <td className="px-4 py-3 border border-gray-200">{transaction.name}</td>
                                        <td className="px-4 py-3 border border-gray-200">{transaction.supplierEamil}</td>
                                        <td className="px-4 py-3 border border-gray-200">{transaction.netAmnt}</td>
                                        
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
    );
};

export default withAuth(PurchaseInvoice, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
  
