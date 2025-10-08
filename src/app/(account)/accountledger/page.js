'use client'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
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
        // Update the record in local state
        setData(prevData =>
            prevData.map(item =>
                item.acountLedgerId === values.acountLedgerId ? { ...values } : item
            )
        );
        setIsEdit(false);
    } else {
        toast.error(`Update failed! Status: ${response.status}`);
    }
}
 else {
            response = await apiClient.post("accountLedger/create", values);
            if (response.status === 200) {
                toast.success("Data saved successfully");

                // 🛠️ Reset form first
                formik.resetForm();

                // 🛠️ Then fetch updated data
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
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="Account Ledger" />
            <div className='py-4'>
                <form onSubmit={formik.handleSubmit} className="lg:w-[100%] md:w-[100%] sm:w-[100%]">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 ">
                        <div className="mb-4">
                            <label className="block  text-sm">A/C Name</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
                                    formik.touched.acountName && formik.errors.acountName ? 'border-red-500' : ''
                                }`}
                                {...formik.getFieldProps('acountName')}
                            />
                            {formik.touched.acountName && formik.errors.acountName && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.acountName}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">A/C Group</label>
 <select
    className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
        formik.touched.accountGrooupId && formik.errors.accountGrooupId ? 'border-red-500' : ''
    }`}
    value={formik.values.accountGrooupId}
    onChange={(e) => {
        const selectedId = parseInt(e.target.value);
        const selectedGroup = group.find(g => g.accountGrooupId === selectedId);
        
        // Set both the ID and name into formik
        formik.setFieldValue('accountGrooupId', selectedId);
        formik.setFieldValue('groupName', selectedGroup?.groupName || '');
    }}
>
    <option value={0}>Select Group</option>
    {group?.map(grp => (
        <option key={grp.accountGrooupId} value={grp.accountGrooupId}>
            {grp.groupName}
        </option>
    ))}
</select>



                           
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Exp. Sub Group</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
                                    formik.touched.expSubGroup && formik.errors.expSubGroup ? 'border-red-500' : ''
                                }`}
                                {...formik.getFieldProps('expSubGroup')}
                            />
                            {formik.touched.expSubGroup && formik.errors.expSubGroup && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.expSubGroup}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Address</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
                                    formik.touched.addresString && formik.errors.addresString ? 'border-red-500' : ''
                                }`}
                                {...formik.getFieldProps('addresString')}
                            />
                            {formik.touched.addresString && formik.errors.addresString && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.addresString}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Mobile No.</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
                                    formik.touched.mobileNo && formik.errors.mobileNo ? 'border-red-500' : ''
                                }`}
                                {...formik.getFieldProps('mobileNo')}
                            />
                            {formik.touched.mobileNo && formik.errors.mobileNo && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.mobileNo}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Phone No.</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
                                    formik.touched.phoneNo && formik.errors.phoneNo ? 'border-red-500' : ''
                                }`}
                                {...formik.getFieldProps('phoneNo')}
                            />
                            {formik.touched.phoneNo && formik.errors.phoneNo && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.phoneNo}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">TIN No.</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
                                    formik.touched.tinNo && formik.errors.tinNo ? 'border-red-500' : ''
                                }`}
                                {...formik.getFieldProps('tinNo')}
                            />
                            {formik.touched.tinNo && formik.errors.tinNo && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.tinNo}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Op. Balance</label>
                            <input
                                type="number"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
                                    formik.touched.openBlance && formik.errors.openBlance ? 'border-red-500' : ''
                                }`}
                                {...formik.getFieldProps('openBlance')}
                            />
                            {formik.touched.openBlance && formik.errors.openBlance && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.openBlance}</div>
                            )}
                        </div>

                        <div className="mb-4">
    <label className="block text-sm">Debit / Credit</label>
    <select
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
            formik.touched.drOrCr && formik.errors.drOrCr ? 'border-red-500' : ''
        }`}
        {...formik.getFieldProps('drOrCr')}
    >
        <option value="">Select Type</option>
        <option value="Debit">Debit</option>
        <option value="Credit">Credit</option>
    </select>
    {formik.touched.drOrCr && formik.errors.drOrCr && (
        <div className="text-red-500 text-sm mt-1">{formik.errors.drOrCr}</div>
    )}
</div>


                        <div className="mb-4">
                            <label className="block text-sm">Email</label>
                            <input
                                type="email"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
                                    formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                                }`}
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm">Remark</label>
                            <input
                                type="text"
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ${
                                    formik.touched.remark && formik.errors.remark ? 'border-red-500' : ''
                                }`}
                                {...formik.getFieldProps('remark')}
                            />
                            {formik.touched.remark && formik.errors.remark && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.remark}</div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-start w-full my-4 space-x-4 p-2">
                        <button
                            type="button"
                            className="bg-gray-600 text-white px-6 py-2 text-sm rounded-lg hover:bg-gray-900"
                            onClick={() => formik.resetForm()}
                        >
                            Refresh
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-green-900"
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-white p-2 my-2 md:p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">A/C Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Group Name</th>
                   
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Op. Balance</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Dr/Cr</th>



                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">

                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.acountName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.groupName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.openBlance}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.drOrCr}</td>



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
        </div>
    );
};

export default withAuth(Ledger, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);





