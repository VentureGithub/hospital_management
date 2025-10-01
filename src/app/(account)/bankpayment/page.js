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
    const itemsPerPage = 5; // Number of items per page

    // Fetch API Data
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`bankPayment/getAlldata`);
            setData(response?.data?.data);
            setFilteredData(response?.data?.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    // Handle Search Filtering
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = data?.filter((item) =>
            item.empName.toLowerCase().includes(term)
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to the first page after filtering
    };

    // Pagination Logic
    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData?.slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };
    // Validation Schema
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
            .min(1, 'Amount must be greater than 0')
        // voucherNarration: Yup.string()
        //     .required('Narration is required')
        //     .min(5, 'Narration must be at least 5 characters')
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

    
        setData(prev =>
          prev.map(item => item.paymentId === values.paymentId ? { ...values } : item)
        );
        setFilteredData(prev =>
          prev.map(item => item.paymentId === values.paymentId ? { ...values } : item)
        );

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
        setCurrentPage(1); // Optional: Show the latest on page 1
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
            acountName: payment.acountName
        });
        setIsEdit(true);
    };

    const fetchEmp = async () => {
        try {
            const response = await apiClient.get(`emp/getAllEmployee`);
            setEmp(response?.data?.data);
        } catch (error) {
            console.error("Error fetching data", error);
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
            console.error("Error fetching data", error);
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
            // Check if the response is successful
            if (response.status === 200) {
                const blob = new Blob([response?.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);

                // Open the PDF in a new tab
                const pdfWindow = window.open('');
                pdfWindow.document.write(`<iframe width='100%' height='100%' src='${url}'></iframe>`);

                // Optional: Clean up the URL after some time to release memory
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                }, 100); // Adjust timeout as needed
            } else {
                console.error('Failed to download Medical:', response.status);
                toast.error("Failed to download Medical. Please try again.");
            }
        } catch (error) {
            console.error('Error downloading the Medical:', error);
            toast.error("An error occurred while downloading the Medical. Please try again.");
        }
    };



    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="Bank Payment" />
            <div className='py-4'>
                <form onSubmit={formik.handleSubmit} className="lg:w-[100%] md:w-[100%] sm:w-[100%]">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 ">
                        <div className="mb-4">
                            <label className="block text-sm">Voucher No.(Autogenerated)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                                {...formik.getFieldProps('voucherNo')}
                                readOnly
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Voucher Date</label>
                            <input
                                type="date"
                                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.voucherDate && formik.errors.voucherDate ? 'border-red-500' : ''
                                    }`}
                                {...formik.getFieldProps('voucherDate')}
                            />
                            {formik.touched.voucherDate && formik.errors.voucherDate && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.voucherDate}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Bank Account</label>
                            <select
                                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.empCode && formik.errors.empCode ? 'border-red-500' : ''
                                    }`}
                                {...formik.getFieldProps('empCode')}
                            >
                                <option value="">Select Employee</option>
                                {emp?.map((Emp) => (
                                    <option key={Emp.empCode} value={Emp.empCode}>{Emp.empName}</option>
                                ))}
                            </select>
                            {formik.touched.empCode && formik.errors.empCode && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.empCode}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Account Name</label>
                            <select
                                className={`w-full px-4 text-sm py-2 border rounded-lg focus:outline-none ${formik.touched.acountLedgerId && formik.errors.acountLedgerId ? 'border-red-500' : ''
                                    }`}
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
                                <div className="text-red-500 text-sm mt-1">{formik.errors.acountLedgerId}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Op. Balance</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                                {...formik.getFieldProps('openBlance')}
                                readOnly
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Against Bill No.</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.againstBillNo && formik.errors.againstBillNo ? 'border-red-500' : ''
                                    }`}
                                {...formik.getFieldProps('againstBillNo')}
                            />
                            {formik.touched.againstBillNo && formik.errors.againstBillNo && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.againstBillNo}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Amount</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.amount && formik.errors.amount ? 'border-red-500' : ''
                                    }`}
                                {...formik.getFieldProps('amount')}
                            />
                            {formik.touched.amount && formik.errors.amount && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.amount}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Voucher Narration</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none ${formik.touched.voucherNarration && formik.errors.voucherNarration ? 'border-red-500' : ''
                                    }`}
                                {...formik.getFieldProps('voucherNarration')}
                            />
                            {formik.touched.voucherNarration && formik.errors.voucherNarration && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.voucherNarration}</div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-start my-4 w-full space-x-4 p-2">
                        <button
                            type="button"
                            className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900"
                            onClick={() => formik.resetForm()}
                        >
                            Refresh
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="p-4 bg-gray-50 mt-6 rounded-md shadow-xl">
            {/* Search Bar */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Bank Payment Table</h2>
                <input
                    type="text"
                    placeholder="Search by Employee Name"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border px-4 py-2 rounded-md"
                />
            </div>

            {/* Table */}
            <div className="bg-white p-2 my-2 md:p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Report</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Vou No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Employee Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Vou Date</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Amount</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Account Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentData?.length > 0 ? (
                                    currentData?.map((transaction, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleMedicalDownload(transaction.voucherNo)}
                                                >
                                                    <IoPrintOutline className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{startIndex + index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.voucherNo}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.empName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.voucherDate}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.amount}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.acountName}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md border ${
                        currentPage === 1 ? "bg-gray-200 text-gray-500" : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                    Previous
                </button>
                <span className="text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md border ${
                        currentPage === totalPages ? "bg-gray-200 text-gray-500" : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
        </div>
    );
};

export default withAuth(BankPayment, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);


