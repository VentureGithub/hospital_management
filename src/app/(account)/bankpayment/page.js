'use client'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { toast } from 'sonner';
import { IoPrintOutline } from "react-icons/io5";

export function BankPayment() {
    return (
        <LayoutForm>
            <BankPaymentform />
        </LayoutForm>
    );
}

const BankPaymentform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [emp, setEmp] = useState([]);
    const [account, setAccount] = useState([]);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`bankPayment/getAlldata`);
            setData(response?.data?.data);
            setFilteredData(response?.data?.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data.");
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = data?.filter(item =>
            item.empName.toLowerCase().includes(term)
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData?.slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
    const handlePrevious = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

    const validationSchema = Yup.object({
        voucherDate: Yup.date()
            .required('Voucher date is required')
            .max(new Date(), 'Voucher date cannot be in the future'),
        empCode: Yup.number()
            .required('Bank account selection is required')
            .min(1, 'Please select a bank account'),
        acountLedgerId: Yup.number()
            .required('Account selection is required')
            .min(1, 'Please select an account'),
        againstBillNo: Yup.string()
            .required('Bill number is required'),
        amount: Yup.number()
            .required('Amount is required')
            .positive('Amount must be positive')
            .min(1, 'Amount must be greater than 0'),
    });

    const formik = useFormik({
        initialValues: {
            paymentId: 0,
            voucherNo: "",
            voucherDate: "",
            acountLedgerId: 0,
            empCode: 0,
            empName: "",
            againstBillNo: "",
            openBlance: 0,
            amount: 0,
            voucherNarration: "",
            acountName: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                let response;
                if (isEdit) {
                    response = await apiClient.put(`bankPayment/updateData`, values);
                    if (response.status === 200) {
                        toast.success("Data updated successfully");
                        setData(prev => prev.map(item => item.paymentId === values.paymentId ? { ...values } : item));
                        setFilteredData(prev => prev.map(item => item.paymentId === values.paymentId ? { ...values } : item));
                        setIsEdit(false);
                    } else {
                        toast.error(`Update failed! Status: ${response.status}`);
                    }
                } else {
                    response = await apiClient.post("bankPayment/saveAllData", values);
                    if (response.status === 200) {
                        toast.success("Data saved successfully");
                        const savedData = response.data.data;
                        const newRecord = savedData || values;
                        setData(prev => [newRecord, ...prev]);
                        setFilteredData(prev => [newRecord, ...prev]);
                        setCurrentPage(1);
                    } else {
                        toast.error(`Save failed! Status: ${response.status}`);
                    }
                }
                formik.resetForm();
            } catch (error) {
                console.error("Error handling save operation:", error);
                toast.error(`An error occurred: ${error.response ? error.response.data : error.message}`);
            }
        },
    });

    const handleUpdate = (payment) => {
        formik.setValues({
            paymentId: payment.paymentId,
            voucherNo: payment.voucherNo,
            voucherDate: payment.voucherDate,
            acountLedgerId: payment.acountLedgerId,
            empCode: payment.empCode,
            empName: payment.empName,
            againstBillNo: payment.againstBillNo,
            openBlance: payment.openBlance,
            amount: payment.amount,
            voucherNarration: payment.voucherNarration,
            acountName: payment.acountName,
        });
        setIsEdit(true);
    };

    const fetchEmp = async () => {
        try {
            const response = await apiClient.get(`emp/getAllEmployee`);
            setEmp(response?.data?.data);
        } catch (error) {
            console.error("Error fetching employee data", error);
            toast.error("Failed to load employees.");
        }
    };

    const handleAccount = async (e) => {
        const selectedLedgerId = e.target.value;
        formik.setFieldValue('acountLedgerId', selectedLedgerId);
        if (selectedLedgerId) {
            try {
                const response = await apiClient.get(`accountLedger/getData/byid?ledgerId=${selectedLedgerId}`);
                const accountData = response?.data?.data;
                formik.setFieldValue('openBlance', accountData?.openBlance);
            } catch (error) {
                console.error("Error fetching account details", error);
            }
        } else {
            formik.setFieldValue('openBlance', '');
        }
    };

    const fetchAccount = async () => {
        try {
            const response = await apiClient.get(`accountLedger/getAllAccountName/withoutBankAccountName`);
            setAccount(response?.data?.data);
        } catch (error) {
            console.error("Error fetching accounts", error);
            toast.error("Failed to load accounts.");
        }
    };

    useEffect(() => {
        fetchEmp();
        fetchAccount();
    }, []);

    const handleMedicalDownload = async (voucherNo) => {
        try {
            const response = await apiClient.get(`bankPayment/bankPaymetsPdf`, {
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
            {/* Header */}
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                        <IoPrintOutline size={18} />
                    </div>
                    <Heading headingText="Bank Payment" />
                </div>
                <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
                    Master • Bank Payment
                </div>
            </div>

            {/* Form */}
            <div className="py-4">
                <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {/* Voucher No (readonly) */}
                    <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                        <label className="block font-semibold text-sm mb-2 text-sky-800">Voucher No. (Autogenerated)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none"
                            {...formik.getFieldProps('voucherNo')}
                            readOnly
                        />
                    </div>

                    {/* Voucher Date */}
                    <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                        <label className="block font-semibold text-sm mb-2 text-sky-800">Voucher Date</label>
                        <input
                            type="date"
                            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.voucherDate && formik.errors.voucherDate ? 'border-red-500' : 'border-gray-200'}`}
                            {...formik.getFieldProps('voucherDate')}
                        />
                        {formik.touched.voucherDate && formik.errors.voucherDate && (
                            <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
                                <IoPrintOutline /> {formik.errors.voucherDate}
                            </div>
                        )}
                    </div>

                    {/* Bank Account */}
                    <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                        <label className="block font-semibold text-sm mb-2 text-sky-800">Bank Account</label>
                        <select
                            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.empCode && formik.errors.empCode ? 'border-red-500' : 'border-gray-200'}`}
                            {...formik.getFieldProps('empCode')}
                        >
                            <option value="">Select Employee</option>
                            {emp?.map((Emp) => (
                                <option key={Emp.empCode} value={Emp.empCode}>{Emp.empName}</option>
                            ))}
                        </select>
                        {formik.touched.empCode && formik.errors.empCode && (
                            <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
                                <IoPrintOutline /> {formik.errors.empCode}
                            </div>
                        )}
                    </div>

                    {/* Account Name */}
                    <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                        <label className="block font-semibold text-sm mb-2 text-sky-800">Account Name</label>
                        <select
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${formik.touched.acountLedgerId && formik.errors.acountLedgerId ? 'border-red-500' : 'border-gray-200'}`}
                            onChange={handleAccount}
                            value={formik.values.acountLedgerId}
                        >
                            <option value="">Select A/C</option>
                            {account?.map((acc) => (
                                <option key={acc.acountLedgerId} value={acc.acountLedgerId}>
                                    {acc.acountName}
                                </option>
                            ))}
                        </select>
                        {formik.touched.acountLedgerId && formik.errors.acountLedgerId && (
                            <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
                                <IoPrintOutline /> {formik.errors.acountLedgerId}
                            </div>
                        )}
                    </div>

                    {/* Op. Balance (readonly) */}
                    <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                        <label className="block font-semibold text-sm mb-2 text-sky-800">Op. Balance</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none"
                            {...formik.getFieldProps('openBlance')}
                            readOnly
                        />
                    </div>

                    {/* Against Bill No. */}
                    <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm col-span-1 md:col-span-2">
                        <label className="block font-semibold text-sm mb-2 text-sky-800">Against Bill No.</label>
                        <input
                            type="text"
                            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.againstBillNo && formik.errors.againstBillNo ? 'border-red-500' : 'border-gray-200'}`}
                            {...formik.getFieldProps('againstBillNo')}
                        />
                        {formik.touched.againstBillNo && formik.errors.againstBillNo && (
                            <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
                                <IoPrintOutline /> {formik.errors.againstBillNo}
                            </div>
                        )}
                    </div>

                    {/* Amount */}
                    <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm col-span-1 md:col-span-1">
                        <label className="block font-semibold text-sm mb-2 text-sky-800">Amount</label>
                        <input
                            type="text"
                            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.amount && formik.errors.amount ? 'border-red-500' : 'border-gray-200'}`}
                            {...formik.getFieldProps('amount')}
                        />
                        {formik.touched.amount && formik.errors.amount && (
                            <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
                                <IoPrintOutline /> {formik.errors.amount}
                            </div>
                        )}
                    </div>

                    {/* Voucher Narration */}
                    <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm col-span-full">
                        <label className="block font-semibold text-sm mb-2 text-sky-800">Voucher Narration</label>
                        <input
                            type="text"
                            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.voucherNarration && formik.errors.voucherNarration ? 'border-red-500' : 'border-gray-200'}`}
                            {...formik.getFieldProps('voucherNarration')}
                        />
                        {formik.touched.voucherNarration && formik.errors.voucherNarration && (
                            <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
                                <IoPrintOutline /> {formik.errors.voucherNarration}
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="col-span-full flex justify-start gap-4 py-2 px-2">
                        <button
                            type="button"
                            onClick={() => {
                                formik.resetForm();
                                setIsEdit(false);
                            }}
                            className="inline-flex items-center gap-2 bg-slate-600 text-white px-6 py-2 rounded-lg hover:bg-slate-800 active:scale-[.99] transition"
                        >
                            <IoPrintOutline /> Refresh
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 active:scale-[.99] transition"
                        >
                            <IoPrintOutline /> {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Bank Payment Table */}

            <div className="p-4 bg-white rounded-lg shadow-md border border-sky-100 mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-sky-700">Bank Payment Table</h2>
                    <input
                        type="text"
                        placeholder="Search by Employee Name"
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
                                <th className="px-4 py-2 border border-gray-100 text-left">Employee Name</th>
                                <th className="px-4 py-2 border border-gray-100">Vou Date</th>
                                <th className="px-4 py-2 border border-gray-100">Amount</th>
                                <th className="px-4 py-2 border border-gray-100 text-left">Account Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length > 0 ? (
                                currentData.map((item, index) => (
                                    <tr key={item.paymentId} className="border border-gray-100 hover:bg-sky-50/40 transition">
                                        <td className="px-4 py-3 border border-gray-100 text-center">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 flex justify-center mx-auto"
                                                onClick={() => handleMedicalDownload(item.voucherNo)}
                                            >
                                                <IoPrintOutline size={18} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 border border-gray-100">{startIndex + index + 1}</td>
                                        <td className="px-4 py-3 border border-gray-100">{item.voucherNo}</td>
                                        <td className="px-4 py-3 border border-gray-100 text-left">{item.empName}</td>
                                        <td className="px-4 py-3 border border-gray-100">{item.voucherDate}</td>
                                        <td className="px-4 py-3 border border-gray-100">{item.amount}</td>
                                        <td className="px-4 py-3 border border-gray-100 text-left">{item.acountName}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">No data available</td>
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
                        className={`px-4 py-2 rounded-md border ${currentPage === 1 ? "bg-gray-200 text-gray-500" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                    >
                        Previous
                    </button>
                    <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-md border ${currentPage === totalPages ? "bg-gray-200 text-gray-500" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default withAuth(BankPayment, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
