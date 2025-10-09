'use client'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt, FaSync, FaSave, FaExclamationCircle } from "react-icons/fa";
import apiClient from "@/app/config";
import { toast } from 'sonner';
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";

export function Ledger() {
    return (
        <LayoutForm>
            <Ledgerform />
        </LayoutForm>
    );
}

const Ledgerform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [group, setGroup] = useState([]);

    // Validation Schema
    const validationSchema = Yup.object({
        acountName: Yup.string()
            .required('Account name is required')
            .matches(/^[a-zA-Z0-9\s]+$/, 'Account Name can only contain letters, numbers, and spaces'),
        accountGrooupId: Yup.number()
            .required('Account group is required'),
        expSubGroup: Yup.string()
            .required('Sub group is required'),
        addresString: Yup.string()
            .required('Address is required')
            .matches(/^[a-zA-Z0-9\s]+$/, 'Address can only contain letters, numbers, and spaces'),
        mobileNo: Yup.string()
            .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
            .required('Mobile number is required'),
        phoneNo: Yup.string()
            .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
        tinNo: Yup.string()
            .required('tin number is required')
            .matches(/^[a-zA-Z0-9\s]+$/, 'Tin No. can only contain letters, numbers, and spaces'),
        openBlance: Yup.number()
            .required('Opening balance is required'),
        drOrCr: Yup.string()
            .required('Debit/Credit selection is required')
            .oneOf(['Debit', 'Credit'], 'Invalid selection'),
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        remark: Yup.string()
            .max(400, 'Remark cannot exceed 200 characters'),
    });

    const formik = useFormik({
        initialValues: {
            acountLedgerId: 0,
            acountName: "",
            accountGrooupId: 0,
            groupName: "",
            expSubGroup: "",
            addresString: "",
            mobileNo: "",
            phoneNo: "",
            tinNo: "",
            openBlance: 0,
            drOrCr: "",
            email: "",
            remark: "",
            alCode: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                let response;
                if (isEdit) {
                    response = await apiClient.put(`accountLedger/updateData`, values);
                    if (response.status === 200) {
                        toast.success("Data updated successfully");
                        setData(prevData => prevData.map(item => item.acountLedgerId === values.acountLedgerId ? { ...values } : item));
                        setIsEdit(false);
                    } else {
                        toast.error(`Update failed! Status: ${response.status}`);
                    }
                } else {
                    response = await apiClient.post("accountLedger/create", values);
                    if (response.status === 200) {
                        toast.success("Data saved successfully");
                        formik.resetForm();
                        await fetchApi();
                    } else {
                        toast.error(`Save failed! Status: ${response.status}`);
                    }
                }
            } catch (error) {
                console.error("Error handling save operation:", error);
                toast.error(`An error occurred: ${error.response ? error.response.data : error.message}`);
            }
        }
    });

    const handleUpdate = (ledger) => {
        formik.setValues({
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

    const fetchGroup = async () => {
        try {
            const response = await apiClient.get(`accountGroup/getAllData`);
            setGroup(response.data.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchGroup();
    }, []);

    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`accountLedger/getAllData`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    return (
        <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                        <FaPencilAlt size={18} />
                    </div>
                    <Heading headingText="Account Ledger" />
                </div>
                <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
                    Master • Account Ledger
                </div>
            </div>

            {/* Form Section */}
            <div className="py-4">
                <form onSubmit={formik.handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: "A/C Name", name: "acountName", type: "text" },
                        { label: "Exp. Sub Group", name: "expSubGroup", type: "text" },
                        { label: "Address", name: "addresString", type: "text" },
                        { label: "Mobile No.", name: "mobileNo", type: "text" },
                        { label: "Phone No.", name: "phoneNo", type: "text" },
                        { label: "TIN No.", name: "tinNo", type: "text" },
                        { label: "Op. Balance", name: "openBlance", type: "number" },
                        { label: "Email", name: "email", type: "email" },
                        { label: "Remark", name: "remark", type: "text" }
                    ].map(({ label, name, type }) => (
                        <div key={name} className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                            <label className="block font-semibold text-sm mb-2 text-sky-800">{label}</label>
                            <input
                                type={type}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
                                    formik.touched[name] && formik.errors[name] ? 'border-red-500' : 'border-gray-200'
                                }`}
                                {...formik.getFieldProps(name)}
                            />
                            {formik.touched[name] && formik.errors[name] && (
                                <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
                                    <FaExclamationCircle /> {formik.errors[name]}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Account Group dropdown */}
                    <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                        <label className="block font-semibold text-sm mb-2 text-sky-800">A/C Group</label>
                        <select
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
                                formik.touched.accountGrooupId && formik.errors.accountGrooupId ? 'border-red-500' : 'border-gray-200'
                            }`}
                            value={formik.values.accountGrooupId}
                            onChange={(e) => {
                                const selectedId = parseInt(e.target.value);
                                const selectedGroup = group.find(g => g.accountGrooupId === selectedId);
                                formik.setFieldValue('accountGrooupId', selectedId);
                                formik.setFieldValue('groupName', selectedGroup?.groupName || '');
                            }}
                        >
                            <option value={0}>Select Group</option>
                            {group?.map(grp => (
                                <option key={grp.accountGrooupId} value={grp.accountGrooupId}>{grp.groupName}</option>
                            ))}
                        </select>
                        {formik.touched.accountGrooupId && formik.errors.accountGrooupId && (
                            <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
                                <FaExclamationCircle /> {formik.errors.accountGrooupId}
                            </div>
                        )}
                    </div>

                    {/* Debit / Credit dropdown */}
                    <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                        <label className="block font-semibold text-sm mb-2 text-sky-800">Debit / Credit</label>
                        <select
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
                                formik.touched.drOrCr && formik.errors.drOrCr ? 'border-red-500' : 'border-gray-200'
                            }`}
                            {...formik.getFieldProps('drOrCr')}
                        >
                            <option value="">Select Type</option>
                            <option value="Debit">Debit</option>
                            <option value="Credit">Credit</option>
                        </select>
                        {formik.touched.drOrCr && formik.errors.drOrCr && (
                            <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
                                <FaExclamationCircle /> {formik.errors.drOrCr}
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
                            <FaSync /> Refresh
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 active:scale-[.99] transition"
                        >
                            <FaSave /> {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Data Table */}
            <div className="bg-white p-3 my-4 text-sm rounded-lg shadow-md border border-sky-100">
                <div className="overflow-x-auto">
                    <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
                            <thead className="sticky top-0 z-10">
                                <tr className="text-center bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur">
                                    <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Action</th>
                                    <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide">Sr</th>
                                    <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide text-left">A/C Name</th>
                                    <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide text-left">Group Name</th>
                                    <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide text-left">Op. Balance</th>
                                    <th className="px-4 py-2 border border-gray-100 text-sky-700 text-xs tracking-wide text-left">Dr/Cr</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr key={transaction.acountLedgerId} className="border border-gray-100 hover:bg-sky-50/40 transition">
                                            <td className="px-4 py-3 border border-gray-100 text-center">
                                                <button
                                                    className="text-sky-600 hover:text-sky-800 flex items-center justify-center mx-auto"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-100">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-100 text-sm text-gray-800">{transaction.acountName}</td>
                                            <td className="px-4 py-3 border border-gray-100 text-sm text-gray-800">{transaction.groupName}</td>
                                            <td className="px-4 py-3 border border-gray-100 text-sm text-gray-800">{transaction.openBlance}</td>
                                            <td className="px-4 py-3 border border-gray-100 text-sm text-gray-800">{transaction.drOrCr}</td>
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
                </div>
            </div>
        </div>
    );
};

export default withAuth(Ledger, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
