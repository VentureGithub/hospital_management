'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { IoPrintOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { toast } from 'sonner';

export function CashPayment() {
    return (
        <LayoutForm>
            <CashPaymentform />
        </LayoutForm>
    );
}

const CashPaymentform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [account, setAccount] = useState([]);
    const [cash, setCash] = useState([]);
    const [selectedCash, setSelectedCash] = useState("");
    const [group, setGroup] = useState([]);

    const [inputs, setInputs] = useState({
        cashPaymentId: 0,
        voucherNo: "",
        voucherDate: "",
        balanceType: "",
        acountLedgerId: [],
        againstBillNo: "",
        amount: 0,
        voucherNarration: "",
        againstIPDNo: "",
        toFilterPatientSelectDOD: "",
        paidTo: "",
        consltDoct: "",
        accountName: []
    });

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 

    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`cashpayment/getAllData`);
            setData(response?.data?.data);
            setFilteredData(response?.data?.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load cash payment data.");
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = data?.filter(item =>
            item.voucherNo.toLowerCase().includes(term)
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData?.slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
    const handlePrevious = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            ...inputs,
            acountLedgerId: [...new Set(inputs.acountLedgerId)]
        };
        try {
            const response = await (isEdit
                ? apiClient.put(`accountLedger/updateData`, payload)
                : apiClient.post("cashpayment/saveData", payload));
            if (response.status === 200) {
                toast.success(`${isEdit ? "Data updated" : "Data saved"} successfully`);
                fetchApi();
                setInputs({
                    cashPaymentId: 0,
                    voucherNo: "",
                    voucherDate: "",
                    balanceType: "",
                    acountLedgerId: [],
                    againstBillNo: "",
                    amount: 0,
                    voucherNarration: "",
                    againstIPDNo: "",
                    toFilterPatientSelectDOD: "",
                    paidTo: "",
                    consltDoct: "",
                    accountName: []
                });
                setIsEdit(false);
            } else {
                toast.error(`${isEdit ? "Update" : "Save"} failed!`);
            }
        } catch (error) {
            console.error("Error saving data:", error);
            toast.error("An error occurred while saving data.");
        }
    };

    const handleUpdate = (ledger) => {
        setInputs({
            ...ledger,
        });
        setIsEdit(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const fetchGroup = async () => {
        try {
            const response = await apiClient.get(`accountGroup/getAllData`);
            setGroup(response?.data?.data);
        } catch (error) {
            console.error("Error fetching groups", error);
        }
    };

    const handleGroup = (e) => {
        setInputs(prev => ({ ...prev, accountGrooupId: e.target.value }));
    };

    useEffect(() => {
        fetchGroup();
        fetchCash();
        fetchAccount();
    }, []);

    const fetchCash = async () => {
        try {
            const response = await apiClient.get(`accountLedger/getAllCashAccount`);
            setCash(response?.data?.data);
        } catch (error) {
            console.error("Error fetching cash accounts", error);
        }
    };

    const fetchAccount = async () => {
        try {
            const response = await apiClient.get(`accountLedger/getAllAccountName/withoutBankAccountName`);
            setAccount(response?.data?.data);
        } catch (error) {
            console.error("Error fetching account names", error);
        }
    };

    const handleChangeSelect = (e) => {
        const value = parseInt(e.target.value);
        setSelectedCash(value);
        setInputs(prev => {
            if (!prev.acountLedgerId.includes(value)) {
                return { ...prev, acountLedgerId: [...prev.acountLedgerId, value] };
            }
            return prev;
        });
    };

    const handleAccount = (e) => {
        const value = parseInt(e.target.value);
        setInputs(prev => {
            if (!prev.acountLedgerId.includes(value)) {
                return { ...prev, acountLedgerId: [...prev.acountLedgerId, value] };
            }
            return prev;
        });
    };

    useEffect(() => {
        if (cash?.[0]?.acountLedgerId) {
            setInputs(prev => ({
                ...prev,
                acountLedgerId: [cash[0].acountLedgerId]
            }));
        }
    }, [cash]);

    const handleMedicalDownload = async (voucherNo) => {
        try {
            const response = await apiClient.get(`cashpayment/cashPaymentPdf`, {
                params: { voucherNo },
                responseType: 'blob',
            });
            if (response.status === 200) {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);
                const pdfWindow = window.open('');
                pdfWindow.document.write(`<iframe width='100%' height='100%' src='${url}'></iframe>`);
                setTimeout(() => window.URL.revokeObjectURL(url), 100);
            } else {
                toast.error("Failed to download report. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred while downloading report. Please try again.");
        }
    };

    return (
        <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                        <FaPencilAlt size={18} />
                    </div>
                    <Heading headingText="Cash Payment" />
                </div>
                <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
                    Master • Cash Payment
                </div>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full" onSubmit={handleSave}>
                {/* Voucher No */}
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">Voucher No.</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                        name="voucherNo"
                        readOnly
                        value={inputs.voucherNo}
                        onChange={handleChange}
                    />
                </div>

                {/* Select Pay Type */}
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">Select Pay Type</label>
                    <select
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                        name="balanceType"
                        value={inputs.balanceType}
                        onChange={handleChange}
                    >
                        <option value="">---select---</option>
                        <option value="Debit">Debit</option>
                        <option value="Credit">Credit</option>
                    </select>
                </div>

                {/* Voucher Date */}
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">Voucher Date</label>
                    <input
                        type="date"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                        name="voucherDate"
                        value={inputs.voucherDate}
                        onChange={handleChange}
                    />
                </div>

                {/* Cash Name */}
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">Cash Name</label>
                    <select
                        onChange={handleChangeSelect}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                    >
                        <option value="">Select Cash</option>
                        {cash?.map(cashItem => (
                            <option key={cashItem.acountLedgerId} value={cashItem.acountLedgerId}>
                                {cashItem.acountName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Account Name */}
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">Account Name</label>
                    <select
                        onChange={handleAccount}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                    >
                        <option value="">Select A/C</option>
                        {account?.map(accountItem => (
                            <option key={accountItem.acountLedgerId} value={accountItem.acountLedgerId}>
                                {accountItem.acountName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Against Bill No */}
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">Against Bill No.</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                        name="againstBillNo"
                        value={inputs.againstBillNo}
                        onChange={handleChange}
                    />
                </div>

                {/* Against IPD No */}
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">Against IPD No.</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                        name="againstIPDNo"
                        value={inputs.againstIPDNo}
                        onChange={handleChange}
                    />
                </div>

                {/* To Filter Patient Select DOD */}
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">To Filter Patient Select DOD</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                        name="toFilterPatientSelectDOD"
                        value={inputs.toFilterPatientSelectDOD}
                        onChange={handleChange}
                    />
                </div>

                {/* Amount */}
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">Amount</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                        name="amount"
                        value={inputs.amount}
                        onChange={handleChange}
                    />
                </div>

                {/* Paid To */}
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">Paid To</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                        name="paidTo"
                        value={inputs.paidTo}
                        onChange={handleChange}
                    />
                </div>

                {/* Conslt. Doct */}
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">Conslt. Doct</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                        name="consltDoct"
                        value={inputs.consltDoct}
                        onChange={handleChange}
                    />
                </div>

                {/* Voucher Narration */}
                <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                    <label className="block font-semibold text-sm mb-2 text-sky-800">Voucher Narration</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none text-sm"
                        name="voucherNarration"
                        value={inputs.voucherNarration}
                        onChange={handleChange}
                    />
                </div>

                {/* Buttons */}
                <div className="col-span-full flex justify-start space-x-4 py-2 px-2">
                    <button
                        className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900"
                        type="button"
                        onClick={() => setInputs({
                            cashPaymentId: 0,
                            voucherNo: "",
                            voucherDate: "",
                            balanceType: "",
                            acountLedgerId: [],
                            againstBillNo: "",
                            amount: 0,
                            voucherNarration: "",
                            againstIPDNo: "",
                            toFilterPatientSelectDOD: "",
                            paidTo: "",
                            consltDoct: "",
                            accountName: []
                        })}
                    >
                        Refresh
                    </button>
                    <button
                        className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
                        onClick={handleSave}
                        type="submit"
                    >
                        {isEdit ? "Update" : "Save"}
                    </button>
                </div>
            </form>

            {/* Data Table Section */}
            <div className="p-4 bg-white rounded-lg shadow-md border border-sky-100 mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-sky-700">Cash Payment Table</h2>
                    <input
                        type="text"
                        placeholder="Search by Voucher No."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                </div>

                <div className="overflow-x-auto max-h-[400px]">
                    <table className="table-auto w-full border border-gray-100 rounded-md border-collapse shadow-sm">
                        <thead className="sticky top-0 bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur z-10">
                            <tr className="text-center text-xs text-sky-700">
                                <th className="px-4 py-2 border border-gray-100">Report</th>
                                <th className="px-4 py-2 border border-gray-100">Sr</th>
                                <th className="px-4 py-2 border border-gray-100">Vou No.</th>
                                <th className="px-4 py-2 border border-gray-100">Vou Date</th>
                                <th className="px-4 py-2 border border-gray-100">Amount</th>
                                <th className="px-4 py-2 border border-gray-100">Account Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData?.length > 0 ? (
                                currentData?.map((transaction, index) => (
                                    <tr key={transaction.cashPaymentId} className="border border-gray-100 hover:bg-sky-50/40 transition">
                                        <td className="px-4 py-3 border border-gray-100 text-center">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 flex justify-center mx-auto"
                                                onClick={() => handleMedicalDownload(transaction.voucherNo)}
                                            >
                                                <IoPrintOutline size={18} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 border border-gray-100">{startIndex + index + 1}</td>
                                        <td className="px-4 py-3 border border-gray-100">{transaction.voucherNo}</td>
                                        <td className="px-4 py-3 border border-gray-100">{transaction.voucherDate}</td>
                                        <td className="px-4 py-3 border border-gray-100">{transaction.amount}</td>
                                        <td className="px-4 py-3 border border-gray-100">{transaction.acountName}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-md border ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        Previous
                    </button>
                    <span className="text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-md border ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default withAuth(CashPayment, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
