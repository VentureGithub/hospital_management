'use client'
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BaseUrl } from '@/app/config';
import LayoutForm from '../../layouts/layoutForm';
import Heading from '../../(components)/heding';
import { FaPencilAlt } from 'react-icons/fa';
import { IoPrintOutline } from "react-icons/io5";
import withAuth from '@/app/(components)/WithAuth';
import apiClient from '@/app/config';
import { toast } from 'sonner';

export function OpdRegistration() {
    return (
        <LayoutForm>
            <OPDRegistrationForm />
        </LayoutForm>
    );
}


const OPDRegistrationForm = () => {
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
    const [data, setData] = useState({
        content: [],
        pageNo: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
        last: false
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('opdNo');
    const [sortDir, setSortDir] = useState('asc');

    const pageSizeOptions = [5, 10, 20, 50, 100];

    const fetchData = async (page = 0, size = pageSize) => {
        try {
            setLoading(true);
            const response = await apiClient.get(
                `getAllOpdPagedData?pageNo=${page}&pageSize=${size}&sortBy=${sortBy}&sortDir=${sortDir}${searchTerm ? `&searchTerm=${searchTerm}` : ''}`
            );
            setData(response.data);
            setCurrentPage(response.data.pageNo);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handleSearchh = (e) => {
        e.preventDefault();
        fetchData(0); // Reset to first page when searching
    };

    const clearSearch = () => {
        setSearchTerm('');
        fetchData(0);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < data.totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (event) => {
        const newSize = parseInt(event.target.value);
        setPageSize(newSize);
        setCurrentPage(0);
        fetchData(0, newSize);
    };


    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await apiClient.get('dep/getAllDepartmentByGrade?grade=A');
                setDepartments(response.data.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            if (selectedDepartmentId) {
                try {
                    const response = await apiClient.get(`doc/getAllDocByDeptId?deptId=${selectedDepartmentId}`);
                    setDoctors(response.data.data);
                } catch (error) {
                    console.error('Error fetching doctors:', error);
                }
            } else {
                setDoctors([]);
            }
        };
        fetchDoctors();
    }, [selectedDepartmentId]);


    const formik = useFormik({
        initialValues: {
            opdNo: '',
            patientName: '',
            fatherName: '',
            address: '',
            age: '',
            occupation: '',
            gender: '',
            maritalStatus: '',
            patientType: '',
            refBy: '',
            drName: '',
            depName: '',
            aayushmanIdNo: '',
            symptoms: '',
            aadharNo: '',
            payType: '',
            fee: 600,
            discount: 0,
            netAmount: 0,
            deptId: '',
            drId: '',
            entryDate: '',
            mobileNo: ''
        },
        validationSchema: Yup.object({
            patientName: Yup.string().required('Patient Name is required'),
            fatherName: Yup.string().required('Guardian Name is required'),
            address: Yup.string().required('Address is required'),
            mobileNo: Yup.string().required('Mobile Number is required'),
            age: Yup.number().required('Age is required').positive().integer(),
            occupation: Yup.string().required('Occupation is required'),
            gender: Yup.string().required('Gender is required'),
            maritalStatus: Yup.string().required('Marital Status is required'),
            patientType: Yup.string().required('Patient Type is required'),
            payType: Yup.string().required('Pay Type is required'),
            fee: Yup.number().required('Fee is required').min(0),
            discount: Yup.number().min(0),
            entryDate: Yup.string().required('Date is required'),
            deptId: Yup.string().required('Department is required'),
            drId: Yup.string().required('Doctor is required'),
            aadharNo: Yup.string().required('Aadhar No is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                // Calculate netAmount before submission
                const submitData = {
                    ...values,
                    netAmount: values.fee - values.discount
                };

                const response = await apiClient.post('saveOpd', submitData);

                if (response.status === 200 && response?.data?.data) {
                    // Show success message
                    toast.success('Data saved successfully!');

                    // Get OPD number
                    const opdNo = response.data.data.opdNo;
                    console.log("Received OPD Number:", opdNo);

                    // Try to download slip
                    if (opdNo) {
                        try {
                            await handleSaveDownload(opdNo);
                        } catch (downloadError) {
                            console.error('Download error:', downloadError);
                            toast.error('Data saved but there was an error downloading the slip. Please try downloading it later.');
                        }
                    } else {
                        console.error("No OPD number in response:", response.data);
                    }

                    // Reset form
                    resetForm();

                    // Refresh table data
                    try {
                        await fetchData(0, pageSize);
                    } catch (fetchError) {
                        console.error('Error refreshing table:', fetchError);
                    }

                } else {
                    console.error("Unexpected response:", response);
                    toast.error('Failed! Please try again');
                }
            } catch (error) {
                console.error('Error saving data:', error.response || error);

                // Better error messages based on error type
                if (error.response?.status === 400) {
                    toast.error('Invalid data submitted. Please check all fields.');
                } else if (error.response?.status === 500) {
                    toast.error('Server error. Please try again later.');
                } else {
                    toast.error('An error occurred while saving the data. Please try again.');
                }
            }
        }
    });

    // Improved handleSaveDownload function
    const handleSaveDownload = async (opdNo) => {
        if (!opdNo) {
            throw new Error('No OPD number provided');
        }

        try {
            const response = await apiClient.get('getSlipByopdId', {
                params: { opdNo },
                responseType: 'blob',
                timeout: 10000 // 10 second timeout
            });

            if (response.status === 200 && response.data) {
                const blob = new Blob([response.data], {
                    type: response.headers['content-type'] || 'application/pdf'
                });

                // Try to open in new window first
                const url = window.URL.createObjectURL(blob);
                const pdfWindow = window.open('');

                if (pdfWindow) {
                    pdfWindow.document.write(
                        `<iframe width='100%' height='100%' src='${url}'></iframe>`
                    );
                } else {
                    // Fallback to download if popup blocked
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `OPD_Slip_${opdNo}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }

                // Cleanup
                setTimeout(() => window.URL.revokeObjectURL(url), 1000);

                return true;
            } else {
                throw new Error(`Failed to download slip. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Download error details:', error);
            throw error; // Re-throw to handle in the calling function
        }
    };


    const fetchDoctorsByDepartment = async (deptId) => {
        try {
            const response = await apiClient.get(`doc/getAllDocByDeptId?deptId=${deptId}`);
            const fetchedDoctors = response.data.data;
            setDoctors(fetchedDoctors); // Update doctors state
            return fetchedDoctors; // Return the fetched doctors
        } catch (error) {
            console.error('Error fetching doctors:', error);
            return [];
        }
    };


    const handleSearch = async (opdNo) => {
        try {
            const response = await apiClient.get(`getDetailsByOpdNo`, {
                params: { opdNo: searchQuery }
            });

            if (response.data.data) {
                const opdData = response.data.data;

                // Fetch the department details
                const selectedDepartment = departments.find(dept => dept.deptId === opdData.deptId);
                let selectedDoctor = null;

                // If deptId is returned, fetch doctors based on deptId if not already fetched
                if (opdData.deptId && opdData.deptId !== selectedDepartmentId) {
                    const doctorsList = await fetchDoctorsByDepartment(opdData.deptId); // Wait for doctors to load
                    selectedDoctor = doctorsList.find(doc => doc.drId === opdData.drId); // Find doctor from loaded list
                } else {
                    // If no need to fetch doctors, use existing doctors
                    selectedDoctor = doctors.find(doc => doc.drId === opdData.drId);
                }

                // Update inputs with OPD data, doctor, and department
                formik.setValues({
                    opdNo: opdData.opdNo || '',
                    patientName: opdData.patientName || '',
                    fatherName: opdData.fatherName || '',
                    address: opdData.address || '',
                    age: opdData.age || '',
                    occupation: opdData.occupation || '',
                    gender: opdData.gender || "Male", // Default value
                    maritalStatus: opdData.maritalStatus || "Married", // Default value
                    patientType: opdData.patientType || "Normal", // Default value
                    refBy: opdData.refBy || '',
                    deptId: opdData.deptId || '',
                    aadharNo: opdData.aadharNo || '',
                    aayushmanIdNo: opdData.aayushmanIdNo || '',
                    drId: opdData.drId || '',
                    symptoms: opdData.symptoms || '',
                    payType: opdData.payType || "Online", // Default value
                    fee: opdData.fee || '',
                    entryDate: opdData.entryDate || '',
                    discount: opdData.discount || '',
                    netAmount: opdData.fee - opdData.discount || '', // Calculate net amount
                    mobileNo: opdData.mobileNo
                });
                formik.setFieldValue('drName', selectedDoctor ? selectedDoctor.drName : "");
                formik.setFieldValue('depName', selectedDepartment ? selectedDepartment.depName : "");

            } else {
                toast.error("No data found for this OPD number");
            }
        } catch (error) {
            console.error("Error searching for OPD:", error);
            toast.error("An error occurred while searching for the OPD number");
        }
    };


    const handleDepartmentSelect = (event) => {
        const selectedDepartmentId = parseInt(event.target.value);
        const selectedDepartment = departments.find(dept => dept.deptId === selectedDepartmentId);
        if (selectedDepartment) {
            setSelectedDepartmentId(selectedDepartmentId);
            formik.setFieldValue('deptId', selectedDepartmentId);
            formik.setFieldValue('depName', selectedDepartment.depName);
        }
    };


    const handleDoctorSelect = (event) => {
        const selectedDoctorId = parseInt(event.target.value);
        const selectedDoctor = doctors.find(doc => doc.drId === selectedDoctorId);
        if (selectedDoctor) {
            formik.setFieldValue('drId', selectedDoctor.drId);
            formik.setFieldValue('drName', selectedDoctor.drName);
        }
    };


    const [searchQuery, setSearchQuery] = useState("");
    const [patId, setPatId] = useState(0)

    const handleGetData = async (id) => {
        try {
            console.log("Fetching OPD data for ID:", id);
            const response = await apiClient.get(`getDetailsBypatid?patId=${id}`);

            if (response.data.data) {
                const opdData = response.data.data;

                // Fetch the department details
                const selectedDepartment = departments.find(dept => dept.deptId === opdData.deptId);
                let selectedDoctor = null;

                // If deptId is returned, fetch doctors based on deptId if not already fetched
                if (opdData.deptId && opdData.deptId !== selectedDepartmentId) {
                    const doctorsList = await fetchDoctorsByDepartment(opdData.deptId); // Wait for doctors to load
                    selectedDoctor = doctorsList.find(doc => doc.drId === opdData.drId); // Find doctor from loaded list
                } else {
                    // If no need to fetch doctors, use existing doctors
                    selectedDoctor = doctors.find(doc => doc.drId === opdData.drId);
                }

                // Populate Formik values with OPD data
                setPatId(opdData.patId)
                formik.setValues({
                    patId: opdData.patId,
                    opdNo: opdData.opdNo || '',
                    patientName: opdData.patientName || '',
                    fatherName: opdData.fatherName || '',
                    address: opdData.address || '',
                    age: opdData.age || '',
                    occupation: opdData.occupation || '',
                    gender: opdData.gender || "Male", // Default value
                    maritalStatus: opdData.maritalStatus || "Married", // Default value
                    patientType: opdData.patientType || "Normal", // Default value
                    refBy: opdData.refBy || '',
                    aadharNo: opdData.aadharNo || '',
                    deptId: opdData.deptId || '',
                    drId: opdData.drId || '',
                    entryDate: opdData.entryDate || '',
                    symptoms: opdData.symptoms || '',
                    aayushmanIdNo: opdData.aayushmanIdNo || '',
                    payType: opdData.payType || "Online", // Default value
                    fee: opdData.fee || 600,
                    discount: opdData.discount || '',
                    mobileNo: opdData.mobileNo,
                    netAmount: opdData.fee - opdData.discount || '', // Calculate net amount
                });

                // Optionally, set the names of the doctor and department
                formik.setFieldValue('drName', selectedDoctor ? selectedDoctor.drName : "");
                formik.setFieldValue('depName', selectedDepartment ? selectedDepartment.depName : "");

            } else {
                toast.error("No data found for this OPD number");
            }
        } catch (error) {
            console.error("Error searching for OPD:", error.response ? error.response.data : error.message);
            toast.error("An error occurred while searching for the OPD number");
        }
    };


    const handleUpdate = async (e) => {
        e.preventDefault(); // Prevent default form submission
        console.log("values", formik.values)
        console.log(patId)
        try {
            const response = await apiClient.put(`updateOPdPatientData`, formik.values);

            if (response.status === 200) {
                toast.success("Data is updated successfully");
                // Refresh data after update
                formik.resetForm(); // Reset the form
                await fetchData(0, pageSize);
            }
        } catch (error) {
            console.error("Error updating data:", error.response ? error.response.data : error.message);
            toast.error("Failed to update data");
        }
    };



    const handleReceiptDownload = async (opdNo) => {
        try {
            const response = await apiClient.get(`getReceiptByOpdId`, {
                params: { opdNo },
                responseType: 'blob',
            });
            // Check if the response is successful
            if (response.status === 200) {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);

                // Open the PDF in a new tab
                const pdfWindow = window.open('');
                pdfWindow.document.write(`<iframe width='100%' height='100%' src='${url}'></iframe>`);

                // Optional: Clean up the URL after some time to release memory
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                }, 100); // Adjust timeout as needed
            } else {
                console.error('Failed to download Recept:', response.status);
                toast.error("Failed to download Recept. Please try again.");
            }
        } catch (error) {
            console.error('Error downloading the Recept:', error);
            toast.error("An error occurred while downloading the Recept. Please try again.");
        }
    };



    // const handleSaveDownload = async (opdNo) => {
    //     try {
    //         const response = await apiClient.get(`getSlipByopdId`, {
    //             params: { opdNo }, // Correctly pass opdNo as a parameter
    //             responseType: 'blob', // Handle file response
    //         });

    //         // Check if the response is successful
    //         if (response.status === 200) {
    //             const blob = new Blob([response.data], { type: response.headers['content-type'] });
    //             const link = document.createElement('a');
    //             link.href = window.URL.createObjectURL(blob);
    //             link.download = `Slip_${opdNo}.pdf`; // Customize the file name
    //             document.body.appendChild(link); // Append link to body
    //             link.click(); // Trigger download
    //             document.body.removeChild(link); // Clean up
    //         } else {
    //             console.error('Failed to download slip:', response.status);
    //             toast.success("Failed to download slip. Please try again.");
    //         }
    //     } catch (error) {
    //         console.error('Error downloading the slip:', error);
    //         toast.success("An error occurred while downloading the slip. Please try again.");
    //     }
    // };


    const [discount, setDiscount] = useState([]);
    // Naya state variable for reception discounts
    const [receptionDiscount, setReceptionDiscount] = useState([]);

    const fetchDis = async () => {
        try {
            const response = await apiClient.get(`descount/getDescount`);
            console.log(response.data.data);
            setDiscount(response.data.data);


            const receptionData = response.data.data.filter(
                (item) => item.roles === "RECEPTION"
            );
            setReceptionDiscount(receptionData);
            console.log("Reception Discounts:", receptionData);

        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchDis();
    }, []);


    // const DateTimeInput 
    const [date, setDate] = useState(formik.values.entryDate ? new Date(formik.values.entryDate).toLocaleDateString('en-CA') : '');
    const [time, setTime] = useState(formik.values.entryDate ? new Date(formik.values.entryDate).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '');

    useEffect(() => {
        if (date && time) {
            const combinedDateTime = new Date(`${date}T${time}`);
            formik.setFieldValue('entryDate', combinedDateTime.toISOString());
        }
    }, [date, time]);


    return (
        <>
            <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
                <Heading headingText="OPD Registration" />
                <div className="w-full lg:w-[25%] md:w-[60%] sm:w-[100%] flex justify-center items-center">
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                        placeholder="Search By OPD"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="bg-blue-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-900 ml-2"
                        onClick={handleSearch} // Connect search button to handler
                    >
                        Search
                    </button>
                </div>
                <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
                    <div>
                        <label className="block text-gray-700 text-sm">OPD No.</label>
                        <input
                            type="text"
                            name="opdNo"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                            onChange={formik.handleChange}
                            readOnly
                            onBlur={formik.handleBlur}
                            value={formik.values.opdNo}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Patient Name<span className='font-bold text-red-500'> *</span></label>
                        <input
                            type="text"
                            name="patientName"
                            placeholder='Patient Name'
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.patientName}
                        />
                        {formik.touched.patientName && formik.errors.patientName ? (
                            <div className="text-red-500 text-sm">{formik.errors.patientName}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Guardian Name<span className='font-bold text-red-500'> *</span></label>
                        <input
                            type="text"
                            name="fatherName"
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.fatherName}
                        />
                        {formik.touched.fatherName && formik.errors.fatherName ? (
                            <div className="text-red-500 text-sm">{formik.errors.fatherName}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Mobile Number<span className='font-bold text-red-500'> *</span></label>
                        <input
                            type="text"
                            name="mobileNo"
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.mobileNo}
                        />
                        {formik.touched.mobileNo && formik.errors.mobileNo ? (
                            <div className="text-red-500 text-sm">{formik.errors.mobileNo}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Aadhar No.<span className='font-bold text-red-500'> *</span></label>
                        <input
                            type="text"
                            name="aadharNo"
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.aadharNo}
                        />
                        {formik.touched.aadharNo && formik.errors.aadharNo ? (
                            <div className="text-red-500 text-sm">{formik.errors.aadharNo}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Address<span className='font-bold text-red-500'> *</span></label>
                        <input
                            type="text"
                            name="address"
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.address}
                        />
                        {formik.touched.address && formik.errors.address ? (
                            <div className="text-red-500 text-sm">{formik.errors.address}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Date<span className='font-bold text-red-500'> *</span></label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                            onChange={(e) => setDate(e.target.value)}
                            onBlur={formik.handleBlur}
                            value={date}
                            name="entryDate"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Time<span className='font-bold text-red-500'> *</span></label>
                        <input
                            type="time"
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                            onChange={(e) => setTime(e.target.value)}
                            onBlur={formik.handleBlur}
                            value={time}
                            name="entryDate"
                        />
                    </div>
                    {formik.touched.entryDate && formik.errors.entryDate ? (
                        <div className="text-red-500 text-sm">{formik.errors.entryDate}</div>
                    ) : null}
                    <div>
                        <label className="block text-gray-700 text-sm">Age<span className='font-bold text-red-500'> *</span></label>
                        <input

                            name="age"
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.age}
                        />
                        {formik.touched.age && formik.errors.age ? (
                            <div className="text-red-500 text-sm">{formik.errors.age}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Occupation<span className='font-bold text-red-500'> *</span></label>
                       
                        <select
                            name="occupation"
                            className="w-full px-4 py-2 text-sm border text-gray-700 rounded-lg focus:outline-none"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.occupation}
                        >
                            <option value="">--select occupation--</option>
                            <option value="Service">Service</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Buisness">Buisness</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Student">Student</option>
                            <option value="Housewife">Housewife</option>
                            <option value="other">Other</option>
                        </select>
                        {formik.touched.occupation && formik.errors.occupation ? (
                            <div className="text-red-500 text-sm">{formik.errors.occupation}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Gender<span className='font-bold text-red-500'> *</span></label>
                        <select
                            name="gender"
                            className="w-full px-4 py-2 text-sm border text-gray-700 rounded-lg focus:outline-none"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.gender}
                        >
                            <option value="">--select gender--</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {formik.touched.gender && formik.errors.gender ? (
                            <div className="text-red-500 text-sm">{formik.errors.gender}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Marital Status<span className='font-bold text-red-500'> *</span></label>
                        <select
                            name="maritalStatus"
                            className="w-full px-4 py-2 text-sm border text-gray-700 rounded-lg focus:outline-none"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.maritalStatus}
                        >
                            <option value="">--select status--</option>
                            <option value="Married">Married</option>
                            <option value="Unmarried">Unmarried</option>
                        </select>
                        {formik.touched.maritalStatus && formik.errors.maritalStatus ? (
                            <div className="text-red-500 text-sm">{formik.errors.maritalStatus}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Patient Type<span className='font-bold text-red-500'> *</span></label>
                        <select
                            name="patientType"
                            className="w-full px-4 py-2 text-sm border text-gray-700 rounded-lg focus:outline-none"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.patientType}
                        >
                            <option value="">--select type--</option>
                            <option value="Normal">Normal</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                        {formik.touched.patientType && formik.errors.patientType ? (
                            <div className="text-red-500 text-sm">{formik.errors.patientType}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className="block text-gray-700  text-sm">Ref By</label>
                        <input
                            type="text"
                            name="refBy"
                            className="w-full px-4 py-2 text-sm border  rounded-lg focus:outline-none"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.refBy}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Department<span className='font-bold text-red-500'> *</span></label>
                        <select
                            name="deptId"
                            className="w-full px-4 py-2 text-sm border text-gray-700 rounded-lg focus:outline-none"
                            onChange={handleDepartmentSelect}
                            value={formik.values.deptId}
                        >
                            <option value="">Select a Department</option>
                            {departments?.map((department) => (
                                <option key={department.deptId} value={department.deptId}>
                                    {department.depName}
                                </option>
                            ))}
                        </select>
                        {formik.touched.deptId && formik.errors.deptId ? (
                            <div className="text-red-500 text-sm">{formik.errors.deptId}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Doctor<span className='font-bold text-red-500'> *</span></label>
                        <select
                            name="drId"
                            className="w-full px-4 py-2 text-sm border text-gray-700 rounded-lg focus:outline-none"
                            onChange={handleDoctorSelect}
                            value={formik.values.drId}
                            disabled={!formik.values.deptId}
                        >
                            <option value="">Select a Doctor</option>
                            {doctors.map(doctor => (
                                <option key={doctor.drId} value={doctor.drId}>
                                    {doctor.drName}
                                </option>
                            ))}
                        </select>
                        {formik.touched.drId && formik.errors.drId ? (
                            <div className="text-red-500 text-sm">{formik.errors.drId}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Symptoms</label>
                        <input
                            type="text"
                            name="symptoms"
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.symptoms}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Aayushman</label>
                        <input
                            type="text"
                            name="aayushmanIdNo"
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.aayushmanIdNo}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Pay Type<span className='font-bold text-red-500'> *</span></label>
                        <select
                            name="payType"
                            className="w-full px-4 py-2 text-sm border rounded-lg text-gray-700 focus:outline-none"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.payType}
                        >
                            <option value="">--select pay type--</option>
                            <option value="online">Online</option>
                            <option value="cash">Cash</option>
                        </select>
                        {formik.touched.payType && formik.errors.payType ? (
                            <div className="text-red-500 text-sm">{formik.errors.payType}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Fee<span className='font-bold text-red-500'> *</span></label>
                        <input

                            name="fee"
                            className="w-full px-4 py-2 text-sm text-gray-700 border rounded-lg focus:outline-none"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.fee}
                            readOnly
                        />
                        {formik.touched.fee && formik.errors.fee ? (
                            <div className="text-red-500 text-sm">{formik.errors.fee}</div>
                        ) : null}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Discount</label>
                        <select onChange={formik.handleChange} name="discount"
                            onBlur={formik.handleBlur}
                            value={formik.values.discount} className="w-full text-gray-700 px-4 py-2 text-sm border rounded-lg focus:outline-none">
                            <option>select Discount</option>
                            {receptionDiscount.map((data ,index ) => (
                                <option key={index} value={data.discountPercentage}>{`${data.discountPercentage}%`}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Net Amount</label>
                        <input

                            name="netAmount"
                            className="w-full px-4 py-2 text-sm border text-gray-700 rounded-lg focus:outline-none bg-white"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.fee - (formik.values.discount / 100 * formik.values.fee)}
                            disabled
                        />
                    </div>
                </form>
                <div className="flex justify-end mt-6 space-x-4">
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900 text-sm"
                        onClick={formik.handleSubmit}
                    >
                        Save
                    </button>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-900 text-sm"
                        onClick={() => formik.resetForm()}
                    >
                        Refresh
                    </button>
                    <button
                        type="submit"
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-900 text-sm"
                        onClick={handleUpdate}
                    >
                        Update
                    </button>

                </div>



                <div className="bg-white  md:p-2 rounded-lg shadow-md">
                    <div className="overflow-x-auto">

                        <div className="mb-4 p-1 rounded-lg">
                            <form onSubmit={handleSearchh} className="flex gap-4">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search "
                                        className="w-full px-4 py-2 border border-gray-300  rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                    <div className='flex space-x-2'>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm bg-sky-500 text-white rounded-md hover:bg-sky-600 flex items-center gap-2"
                                        >
                                            {/* <Search className="w-4 h-4" /> */}
                                            Search
                                        </button>

                                        {searchTerm && (
                                            <button
                                                type="button"
                                                onClick={clearSearch}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>

                        </div>
                        <div className=" flex items-center">
                            <label htmlFor="pageSize" className="mr-2 text-sm text-gray-700">
                                Rows per page:
                            </label>
                            <select
                                id="pageSize"
                                value={pageSize}
                                onChange={handlePageSizeChange}
                                className="border border-gray-300 rounded-md text-sm p-1 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                {pageSizeOptions.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <table className="table-auto w-full border border-collapse shadow">
                                <thead>
                                    <tr className="text-center bg-sky-50">
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Receipt</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr. No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">OPD No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Patient Name</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Guardian</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">DR. Name</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Gender/Age</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-4">Loading...</td>
                                        </tr>
                                    ) : data.content?.length > 0 ? (
                                        data.content.map((transaction, index) => (
                                            <tr key={transaction.patId} className="border border-gray-200 text-center hover:bg-gray-50">
                                                <td className="px-4 py-3 border border-gray-200">
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700"
                                                        onClick={() => handleReceiptDownload(transaction.opdNo)}
                                                    >
                                                        <IoPrintOutline className="inline-block w-5 h-5" />
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 border border-gray-200">
                                                    {currentPage * pageSize + index + 1}
                                                </td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.opdNo}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.patientName}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.fatherName}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.drName}</td>
                                                <td className="px-4 py-3 border border-gray-200">
                                                    {transaction.gender}/{transaction.age}
                                                </td>
                                                <td className="px-4 py-3 border border-gray-200">
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700"
                                                        onClick={() => handleGetData(transaction.patId)}
                                                    >
                                                        <FaPencilAlt className="inline-block w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center py-4">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {data && (
                            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                                <div className="flex flex-1 justify-between sm:hidden">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 0}
                                        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage > 0 ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-300'
                                            }`}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === data.totalPages - 1}
                                        className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${currentPage < data.totalPages - 1 ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-300'
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing{' '}
                                            <span className="font-medium">
                                                {data.content?.length > 0 ? currentPage * pageSize + 1 : 0}
                                            </span>
                                            {' '}-{' '}
                                            <span className="font-medium">
                                                {Math.min((currentPage + 1) * pageSize, data.totalElements)}
                                            </span>
                                            {' '}of{' '}
                                            <span className="font-medium">{data.totalElements}</span>
                                            {' '}results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                            <button
                                                onClick={() => handlePageChange(0)}
                                                disabled={currentPage === 0}
                                                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                            >
                                                <span className="sr-only">First</span>
                                                ««
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 0}
                                                className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                            >
                                                <span className="sr-only">Previous</span>
                                                «
                                            </button>
                                            {[...Array(data.totalPages)].map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handlePageChange(index)}
                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === index
                                                        ? 'z-10 bg-sky-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600'
                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                        }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === data.totalPages - 1}
                                                className={`relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === data.totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                            >
                                                <span className="sr-only">Next</span>
                                                »
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(data.totalPages - 1)}
                                                disabled={currentPage === data.totalPages - 1}
                                                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === data.totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}
                                            >
                                                <span className="sr-only">Last</span>
                                                »»
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </>
    );
};
export default withAuth(OpdRegistration, ['SUPERADMIN', 'ADMIN', 'RECEPTION'])