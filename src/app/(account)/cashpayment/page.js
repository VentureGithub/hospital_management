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

    const value = cash?.[0]?.acountLedgerId

    const [inputs, setInputs] = useState({
        cashPaymentId: 0,
        voucherNo: "",
        voucherDate: "",
        balanceType: "",
        acountLedgerId: [], // Ensure this is an array
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
    const itemsPerPage = 5; // Number of items to show per page

    // Fetch data from API
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`cashpayment/getAllData`);
            setData(response?.data?.data);
            setFilteredData(response?.data?.data); // Set filtered data to all data initially
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    // Filter data by Vou No.
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = data?.filter((item) =>
            item.voucherNo.toLowerCase().includes(term)
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to the first page after filtering
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData?.slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };





    const handleSave = async (e) => {
        e.preventDefault();

        const payload = {
            ...inputs,
            acountLedgerId: [...new Set(inputs.acountLedgerId)], // Ensure unique values
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
            } else {
                toast.error(`${isEdit ? "Update" : "Save"} failed!`);
            }
        } catch (error) {
            console.error("Error saving data:", error);
            // toast.error(`An error occurred: ${error.message}`);
        }
    };


    const handleUpdate = (ledger) => {
        setInputs({
            acountLedgerId: ledger.acountLedgerId,
            acountName: ledger.acountName,
            accountGrooupId: ledger.accountGrooupId,
            groupName: ledger.groupName,
            expSubGroup: ledger.expSubGroup,
            addresString: ledger.addresString,
            mobileNo: ledger.mobileNo,
            phoneNo: ledger.phoneNo,
            tinNo: ledger.tinNo,
            openBlance: ledger.openBlance,
            drOrCr: ledger.drOrCr,
            email: ledger.email,
            remark: ledger.remark,
            alCode: ledger.alCode
        });
        setIsEdit(true);
    };





    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }));
    };


    const fetchGroup = async () => {
        try {
            const response = await apiClient.get(`accountGroup/getAllData`);
            console.log(response?.data?.data);
            setGroup(response?.data?.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };


    const handleGroup = (e) => {
        console.log(e.target.value);
        setInputs({ ...inputs, accountGrooupId: e.target.value })
    };


    useEffect(() => {
        fetchGroup();
        fetchCash();
        fetchAccount();
    }, []);

    const fetchCash = async () => {
        try {
            const response = await apiClient.get(`accountLedger/getAllCashAccount`);
            console.log(response?.data?.data);
            setCash(response?.data?.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };



    const fetchAccount = async () => {
        try {
            const response = await apiClient.get(`accountLedger/getAllAccountName/withoutBankAccountName`);
            console.log(response?.data?.data);
            setAccount(response?.data?.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };


    
    const handleChangeSelect = (e) => {
        const value = parseInt(e.target.value);
        setSelectedCash(value);
        
        // Only update if the value isn't already in the array
        setInputs(prevInputs => {
            if (!prevInputs.acountLedgerId.includes(value)) {
                return {
                    ...prevInputs,
                    acountLedgerId: [...prevInputs.acountLedgerId, value]
                };
            }
            return prevInputs;
        });
    };

    const handleAccount = (e) => {
        const value = parseInt(e.target.value);
        
        // Only update if the value isn't already in the array
        setInputs(prevInputs => {
            if (!prevInputs.acountLedgerId.includes(value)) {
                return {
                    ...prevInputs,
                    acountLedgerId: [...prevInputs.acountLedgerId, value]
                };
            }
            return prevInputs;
        });
    };


    useEffect(() => {
        if (cash?.[0]?.acountLedgerId) {
            setInputs(prevInputs => ({
                ...prevInputs,
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
             <Heading headingText="Cash Payment" />
            <div className='py-4'>
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4  ">
                    <div className=" mb-4 ">
                            <label className="block text-sm">Voucher No.</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="voucherNo"
                                readOnly
                                value={inputs.voucherNo}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Select Pay Type </label>
                            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm">
                                <option selected>---select---</option>
                                <option >Debit</option>
                                <option >Credit</option>

                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Voucher Date </label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="voucherDate"
                                value={inputs.voucherDate}
                                onChange={handleChange} />
                        </div>
                        <div className="mb-4">
        <label className="block text-sm">Cash Name</label>
        <select
          onChange={handleChangeSelect}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
        >
          <option value="">Select Cash</option>
          {cash &&
            Array.isArray(cash) &&
            cash.map((cashItem) => (
              <option key={cashItem.acountLedgerId} value={cashItem.acountLedgerId}>
                {cashItem.acountName}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm">Account Name</label>
        <select
          onChange={handleAccount}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
        >
          <option value="">Select A/C</option>
          {account?.map((accountItem) => (
            <option key={accountItem.acountLedgerId} value={accountItem.acountLedgerId}>
              {accountItem.acountName}
            </option>
          ))}
        </select>
      </div>

                        <div className="mb-4">
                            <label className="block text-sm">Against Bill No. </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="againstBillNo"
                                value={inputs.againstBillNo}
                                onChange={handleChange}
                            />
                        </div>
                        <div className=" mb-4">
                            <label className="block text-sm">Against IPD No.</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="againstIPDNo"
                                value={inputs.againstIPDNo}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">To Filter Patient Select DOD </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="toFilterPatientSelectDOD"
                                value={inputs.toFilterPatientSelectDOD}
                                onChange={handleChange}
                            />
                        </div>
                        <div className=" mb-4">
                            <label className="block text-sm">Amount </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="amount"
                                value={inputs.amount}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">Paid To</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="paidTo"
                                value={inputs.paidTo}
                                onChange={handleChange}
                            />

                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">Conslt.Doct </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="consltDoct"
                                value={inputs.consltDoct}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">Voucher Narration </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="voucherNarration"
                                value={inputs.voucherNarration}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </form>
                <div className="flex justify-start w-full space-x-4 p-2">
                    <button
                        className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900"
                        type="button"

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
            </div>

        <div className="p-4 bg-gray-50 mt-6 rounded-md shadow-xl">
            {/* Search Input */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Cash Payment Table</h2>
                <input
                    type="text"
                    placeholder="Search by Vou No."
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
                                            <td className="px-4 py-3 border border-gray-200">{transaction.voucherDate}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.amount}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.acountName}</td>
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
export default withAuth(CashPayment, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])


