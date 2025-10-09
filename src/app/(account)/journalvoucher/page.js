'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt, FaSync, FaSave } from "react-icons/fa";
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
    const [acountName, setAcountName] = useState([]);
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    const fetchAcountName = async () => {
        try {
            const response = await apiClient.get('accountLedger/getAllAccountName/withoutBankAccountName');
            if (response.status === 200) {
                setAcountName(response.data.data);
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
        fetchAcountName();
        fetchAllApi();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAdd = () => {
        if (!formData.acountLedgerId || (!formData.debitAmount && !formData.creditAmount)) {
            toast.error("Please fill in the required fields");
            return;
        }
        const selectedAccount = acountName.find(acc => acc.acountLedgerId.toString() === formData.acountLedgerId.toString());

        setTableData([...tableData, {
            ...formData,
            acountName: selectedAccount?.acountName || ''
        }]);

        setFormData(prev => ({
            ...prev,
            acountLedgerId: 0,
            debitAmount: 0,
            creditAmount: 0
        }));
    };

    const handleSave = async () => {
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

            const dataToSave = {
                journalVoucherId: formData.journalVoucherId,
                voucherNo: formData.voucherNo,
                voucherDate: formData.voucherDate,
                acountLedgerId: tableData.map(item => Number(item.acountLedgerId)),
                debitAmount: tableData.map(item => Number(item.debitAmount)),
                creditAmount: tableData.map(item => Number(item.creditAmount))
            };

            const endpoint = isUpdateMode ?
                `journalVoucher/updateData/${formData.journalVoucherId}` :
                'journalVoucher/saveData';

            const response = await apiClient[isUpdateMode ? 'put' : 'post'](endpoint, dataToSave);

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
        <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                        <FaPencilAlt size={18} />
                    </div>
                    <Heading headingText="Journal Voucher" />
                </div>
                <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
                    Master • Journal Voucher
                </div>
            </div>

            {/* Voucher Details */}
            <div className="mb-4 border border-sky-100 bg-white rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-sky-800">Voucher Date</label>
                        <input
                            type="date"
                            name="voucherDate"
                            value={formData.voucherDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Entry Details */}
            <div className="mb-4 border border-sky-100 bg-white rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-sky-800">Account Name</label>
                        <select
                            name="acountLedgerId"
                            value={formData.acountLedgerId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Account</option>
                            {acountName.map(item => (
                                <option key={item.acountLedgerId} value={item.acountLedgerId}>
                                    {item.acountName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-sky-800">Debit Amount</label>
                        <input
                            type="number"
                            name="debitAmount"
                            value={formData.debitAmount}
                            onChange={handleChange}
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-sky-800">Credit Amount</label>
                        <input
                            type="number"
                            name="creditAmount"
                            value={formData.creditAmount}
                            onChange={handleChange}
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <button
                    onClick={handleAdd}
                    className="mt-4 inline-flex items-center gap-2 bg-blue-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="button"
                >
                    <FaPencilAlt /> Add Entry
                </button>
            </div>

            {/* Entries Table */}
            <div className="mb-4 border border-sky-100 bg-white rounded-lg p-4 shadow-sm">
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
                                <td className="border p-2">{item.acountName}</td>
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
                            <td className="px-4 py-3 border border-gray-200 text-right">
                                {tableData.reduce((sum, item) => sum + Number(item.debitAmount), 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 border border-gray-200 text-right">
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        type="button"
                    >
                        <FaSync /> Reset
                    </button>
                    <button
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        type="button"
                    >
                        <FaSave /> {isUpdateMode ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white p-4 rounded-lg shadow-md border border-sky-100">
                <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
                    <thead className="sticky top-0 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur z-10 text-center text-xs text-sky-700">
                        <tr>
                            <th className="px-4 py-2 border border-gray-100">Sr. No.</th>
                            <th className="px-4 py-2 border border-gray-100">Voucher No.</th>
                            <th className="px-4 py-2 border border-gray-100">Voucher Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.journalVoucherId} className="border border-gray-100 odd:bg-white even:bg-sky-50">
                                <td className="px-4 py-3 border border-gray-200 text-center">{index + 1}</td>
                                <td className="px-4 py-3 border border-gray-200 text-center">{item.voucherNo}</td>
                                <td className="px-4 py-3 border border-gray-200 text-center">{item.voucherDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default withAuth(Journal, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
