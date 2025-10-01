'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { toast } from 'sonner';

export function Journal() {
    return (
        <LayoutForm>
            <JournalPage />
        </LayoutForm>
    );
}

const JournalPage = () => {
    const [formData, setFormData] = useState({
        journalVoucherId: 0,
        acountLedgerId: 0,
        debitAmount: 0,
        creditAmount: 0,
        voucherNo: "",
        voucherDate: ""
    });
    
    const [tableData, setTableData] = useState([]);
    const [data, setData] = useState([]);
    const [acountName, setacountName] = useState([]);
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    // Fetch account names
    const fetchacountName = async () => {
        try {
            const response = await apiClient.get('accountLedger/getAllAccountName/withoutBankAccountName');
            if (response.status === 200) {
                setacountName(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching account names:', error);
            toast.error('Error fetching account names');
        }
    };

    const fetchAllApi = async () => {
        try {
            const response = await apiClient.get(`journalVoucher/getAllData`);
            if (response.status === 200) {
                setData(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching all data:', error);
            toast.error('Error fetching data');
        }
    };

    useEffect(() => {
        fetchacountName();
        fetchAllApi();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAdd = () => {
        if (!formData.acountLedgerId || (!formData.debitAmount && !formData.creditAmount)) {
            toast.error("Please fill in the required fields");
            return;
        }
        
        const selectedAccount = acountName.find(acc => acc.acountLedgerId.toString() === formData.acountLedgerId.toString());
        
        setTableData([...tableData, {
            ...formData,
            accountName: selectedAccount?.acountName || ''
        }]);
        
        setFormData(prev => ({
            ...prev,
            acountLedgerId: 0,
            debitAmount: 0,
            creditAmount: 0
        }));
    };

    const handleSave = async () => {
        // if (!formData.voucherNo || !formData.voucherDate) {
        //     toast.error("Please enter voucher number and date");
        //     return;
        // }

        if (tableData.length === 0) {
            toast.error("Please add at least one entry");
            return;
        }

        try {
            const totalDebit = tableData.reduce((sum, item) => sum + Number(item.debitAmount), 0);
            const totalCredit = tableData.reduce((sum, item) => sum + Number(item.creditAmount), 0);

            if (totalDebit !== totalCredit) {
                toast.error("Total debit must equal total credit");
                return;
            }

            const data = {
                journalVoucherId: formData.journalVoucherId,
                voucherNo: formData.voucherNo,
                voucherDate: formData.voucherDate,
                acountLedgerId: tableData.map((item) => Number(item.acountLedgerId)),
                debitAmount: tableData.map((item) => Number(item.debitAmount)),
                creditAmount: tableData.map((item) => Number(item.creditAmount))
            };

            const endpoint = isUpdateMode ? 
                `journalVoucher/updateData/${formData.journalVoucherId}` : 
                'journalVoucher/saveData';

            const response = await apiClient[isUpdateMode ? 'put' : 'post'](endpoint, data);

            if (response.status === 200) {
                toast.success(isUpdateMode ? "Updated successfully" : "Saved successfully");
                handleReset();
                await fetchAllApi();
            }
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error("Error saving data");
        }
    };

    const handleReset = () => {
        setFormData({
            journalVoucherId: 0,
            acountLedgerId: 0,
            debitAmount: 0,
            creditAmount: 0,
            voucherNo: "",
            voucherDate: ""
        });
        setTableData([]);
        setIsUpdateMode(false);
    };

    const handleRemoveRow = (index) => {
        setTableData(tableData.filter((_, i) => i !== index));
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
        <Heading headingText="Journal Voucher" />
        {/* <div className='py-4'> */}
            {/* Voucher Details */}
            <div className="mb-4 border bg-white rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   
                    <div>
                        <label className="block text-sm font-medium mb-1">Voucher Date</label>
                        <input
                            type="date"
                            name="voucherDate"
                            value={formData.voucherDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Entry Details */}
            <div className="mb-4 border bg-white rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Account Name</label>
                        <select
                            name="acountLedgerId"
                            value={formData.acountLedgerId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Account</option>
                            {acountName.map((item) => (
                                <option key={item.acountLedgerId} value={item.acountLedgerId}>
                                    {item.acountName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Debit Amount</label>
                        <input
                            type="number"
                            name="debitAmount"
                            value={formData.debitAmount}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Credit Amount</label>
                        <input
                            type="number"
                            name="creditAmount"
                            value={formData.creditAmount}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <button
                    onClick={handleAdd}
                    className="mt-4 bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Add Entry
                </button>
            </div>

            {/* Entries Table */}
            <div className="my-4 border bg-white rounded-md p-4">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-2 border border-gray-200 text-sky-500">Account Name</th>
                            <th className="px-4 py-2 border border-gray-200 text-sky-500">Debit Amount</th>
                            <th className="px-4 py-2 border border-gray-200 text-sky-500">Credit Amount</th>
                            <th className="px-4 py-2 border border-gray-200 text-sky-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((item, index) => (
                            <tr key={index}>
                                <td className="border p-2">
                                    {acountName.find(acc => acc.acountLedgerId === Number(item.acountLedgerId))?.acountName}
                                </td>
                                <td className="border p-2 text-right">{Number(item.debitAmount).toFixed(2)}</td>
                                <td className="border p-2 text-right">{Number(item.creditAmount).toFixed(2)}</td>
                                <td className="border p-2 text-center">
                                    <button
                                        onClick={() => handleRemoveRow(index)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr className="font-bold bg-gray-50">
                            <td className="px-4 py-3 border border-gray-200">Total</td>
                            <td className="px-4 py-3 border border-gray-200">
                                {tableData.reduce((sum, item) => sum + Number(item.debitAmount), 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 border border-gray-200">
                                {tableData.reduce((sum, item) => sum + Number(item.creditAmount), 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 border border-gray-200"></td>
                        </tr>
                    </tbody>
                </table>
            

            {/* Action Buttons */}
            <div className="flex justify-end items-end gap-4 mt-2">
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                    Reset
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    {isUpdateMode ? 'Update' : 'Save'}
                </button>
            </div>
            </div>
            {/* Data Table */}
            <div className="bg-white p-2  md:p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr. No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Voucher No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Voucher Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                        <td className="px-4 py-3 border border-gray-200">{item.voucherNo}</td>
                                        <td className="px-4 py-3 border border-gray-200">{item.voucherDate}</td>
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

export default withAuth(Journal, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
