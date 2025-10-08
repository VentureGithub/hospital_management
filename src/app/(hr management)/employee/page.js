'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import { toast } from 'sonner';
import withAuth from '@/app/(components)/WithAuth';

export function Employee() {
    return (
        <LayoutForm>
            <Employeeform />
        </LayoutForm>
    );
}

const Employeeform = () => {
    const [designations, setDesignations] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [empImage, setEmpImage] = useState(null);
    const [documentSubmit, setDocumentSubmit] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [documentName, setDocumentName] = useState("");
    
    const [inputs, setInputs] = useState({
        empCode: "",
        deptId: "",
        joiningDate: "",
        designationId: "",
        weeklyHoliday: "",
        jobType: "",
        salaryDate: "",
        workAllocation: "",
        remark: "",
        accountHolderName: "",
        branchName: "",
        ifscCode: "",
        accountNo: "",
        phnNo: "",
        empName: "",
        gender: "",
        dateOfBirth: "",
        empEmail: "",
        fatherName: "",
        empPanNo: "",
        bloodGroup: "",
        empCategory: "",
        categoryCode: "",
        currentAddress: "",
        permanentAddress: "",
        state: "",
        country: "",
        pinCode: "",
        city: "",
        empMobile: "",
        pfAccountNo: "",
        esiNo: "",
        pfDate: "",
        esiDate: "",
        emiNo: "",
        leaveDate: "",
        leavReason: "",
        leavMark: "",
        basicSalary: "",
        extraSalary: "",
        incremtntAmnt: "",
        relatonName: "",
        relatonMobile: "",
        relaton: "",
        shift: "",
        depName: "",
    });

    const states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
        "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
        "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
        "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
        "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep",
        "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
    ];

    // Fetch Designation
    const fetchDesignation = async () => {
        try {
            const response = await apiClient.get(`designationmaster/getAll`);
            setDesignations(response.data.data);
        } catch (error) {
            console.error("Error fetching designations", error);
            toast.error("Failed to load designations");
        }
    };

    // Fetch Department
    const fetchDepartment = async () => {
        try {
            const response = await apiClient.get(`dep/getAllDepartment`);
            setDepartments(response.data.data);
        } catch (error) {
            console.error("Error fetching departments", error);
            toast.error("Failed to load departments");
        }
    };

    // Fetch Shifts
    const fetchShift = async () => {
        try {
            const response = await apiClient.get('shiftMaster/getAllDetailsghiftMaster');
            if (response.data.status === 200) {
                setShifts(response?.data?.data);
            } else {
                console.error("Error fetching shifts");
                toast.error("Failed to load shifts");
            }
        } catch (error) {
            console.error("Error", error);
            toast.error("Failed to load shifts");
        }
    };

    useEffect(() => {
        fetchDesignation();
        fetchDepartment();
        fetchShift();
    }, []);

    // Handle input change
    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(file.type)) {
                toast.error("Please upload a valid image file (JPEG, PNG, GIF)");
                return;
            }
            
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            setEmpImage(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle document upload
    const handleDocumentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type (allow common document formats)
            const validDocTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/jpg',
                'image/png'
            ];
            
            if (!validDocTypes.includes(file.type)) {
                toast.error("Please upload a valid document (PDF, DOC, DOCX, or Image)");
                return;
            }

            // Validate file size (10MB max)
            if (file.size > 10 * 1024 * 1024) {
                toast.error("Document size should be less than 10MB");
                return;
            }

            setDocumentSubmit(file);
            setDocumentName(file.name);
        }
    };

    // Handle form submission
    const handleEmployee = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        // Append all text fields
        Object.keys(inputs).forEach(key => {
            formData.append(key, inputs[key]);
        });

        // Append files
        if (empImage) {
            formData.append('empImage', empImage);
        }

        if (documentSubmit) {
            formData.append('documentSubmit', documentSubmit);
        }

        try {
            const response = await apiClient.post(`emp/saveEmployee`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.status === 200) {
                toast.success("Employee data saved successfully");
                handleRefresh();
            } else {
                toast.error("Failed! Please try again");
            }
        } catch (error) {
            console.error("Error saving employee:", error);
            toast.error("An error occurred while saving");
        }
    };

    // Handle refresh
    const handleRefresh = () => {
        setInputs({
            empCode: "",
            deptId: "",
            joiningDate: "",
            designationId: "",
            weeklyHoliday: "",
            jobType: "",
            salaryDate: "",
            workAllocation: "",
            remark: "",
            accountHolderName: "",
            branchName: "",
            ifscCode: "",
            accountNo: "",
            phnNo: "",
            empName: "",
            gender: "",
            dateOfBirth: "",
            empEmail: "",
            fatherName: "",
            empPanNo: "",
            bloodGroup: "",
            empCategory: "",
            categoryCode: "",
            currentAddress: "",
            permanentAddress: "",
            state: "",
            country: "",
            pinCode: "",
            city: "",
            empMobile: "",
            pfAccountNo: "",
            esiNo: "",
            pfDate: "",
            esiDate: "",
            emiNo: "",
            leaveDate: "",
            leavReason: "",
            leavMark: "",
            basicSalary: "",
            extraSalary: "",
            incremtntAmnt: "",
            relatonName: "",
            relatonMobile: "",
            relaton: "",
            shift: "",
            depName: "",
        });
        setEmpImage(null);
        setDocumentSubmit(null);
        setImagePreview(null);
        setDocumentName("");
    };

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl'>
            <Heading headingText="Employee Joining" />
            <div className='py-4'>
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    {/* JOINING DETAILS */}
                    <div className="font-semibold text-blue-500 text-xl m-2">JOINING DETAILS</div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2">
                        <div>
                            <label className="block text-gray-700 text-sm">Designation</label>
                            <select 
                                name="designationId"
                                onChange={handleChange}
                                value={inputs.designationId}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                            >
                                <option value="">Select Designation</option>
                                {designations?.map((item) => (
                                    <option key={item.designationId} value={item.designationId}>
                                        {item.designationName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Department</label>
                            <select 
                                name="depName"
                                onChange={handleChange}
                                value={inputs.depName}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                            >
                                <option value="">Select Department</option>
                                {departments?.map((item) => (
                                    <option key={item.deptId} value={item.depName}>
                                        {item.depName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Joining Date</label>
                            <input 
                                type="date"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="joiningDate"
                                onChange={handleChange}
                                value={inputs.joiningDate}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Salary Date</label>
                            <input 
                                type="date"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="salaryDate"
                                onChange={handleChange}
                                value={inputs.salaryDate}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Job Type</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="jobType"
                                onChange={handleChange}
                                value={inputs.jobType}
                            >
                                <option value="">Select Job Type</option>
                                <option value="Reg">Regular</option>
                                <option value="Cont">Contract</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Weekly Holiday</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="weeklyHoliday"
                                onChange={handleChange}
                                value={inputs.weeklyHoliday}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Work Allocation</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="workAllocation"
                                onChange={handleChange}
                                value={inputs.workAllocation}
                            />
                        </div>
                    </div>

                    {/* PERSONAL DETAILS */}
                    <div className="font-semibold text-blue-500 text-xl m-2 mt-6">PERSONAL DETAILS</div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 m-2">
                        <div>
                            <label className="block text-gray-700 text-sm">Employee Name</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="empName"
                                onChange={handleChange}
                                value={inputs.empName}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Father Name</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="fatherName"
                                onChange={handleChange}
                                value={inputs.fatherName}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Gender</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="gender"
                                onChange={handleChange}
                                value={inputs.gender}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Country</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="country"
                                onChange={handleChange}
                                value={inputs.country}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Date of Birth</label>
                            <input 
                                type="date"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="dateOfBirth"
                                onChange={handleChange}
                                value={inputs.dateOfBirth}
                            />
                        </div>
                      
                        <div>
                            <label className="block text-gray-700 text-sm">Email ID</label>
                            <input 
                                type="email"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="empEmail"
                                onChange={handleChange}
                                value={inputs.empEmail}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Mobile No</label>
                            <input 
                                type="number"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="empMobile"
                                onChange={handleChange}
                                value={inputs.empMobile}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Blood Group</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="bloodGroup"
                                onChange={handleChange}
                                value={inputs.bloodGroup}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Category</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="empCategory"
                                onChange={handleChange}
                                value={inputs.empCategory}
                            >
                                <option value="">Select Category</option>
                                <option value="gen">General</option>
                                <option value="obc">OBC</option>
                                <option value="sc">SC</option>
                                <option value="st">ST</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Category Code</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="categoryCode"
                                onChange={handleChange}
                                value={inputs.categoryCode}
                            >
                                <option value="">Select Code</option>
                                <option value="a">A</option>
                                <option value="b">B</option>
                                <option value="c">C</option>
                                <option value="d">D</option>
                                <option value="e">E</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Shift</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                name="shift"
                                onChange={handleChange}
                                value={inputs.shift}
                            >
                                <option value="">Select Shift</option>
                                {shifts?.map((item, index) => (
                                    <option key={index} value={item.shiftName}>
                                        {item.shiftName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Employee Image Upload */}
                        <div>
                            <label className="block text-gray-700 text-sm">Employee Image</label>
                            <input 
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img 
                                        src={imagePreview} 
                                        alt="Employee Preview" 
                                        className="w-24 h-24 object-cover rounded-lg border"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CORRESPONDENCE */}
                    <div className="font-semibold text-blue-500 text-xl m-2 mt-6">CORRESPONDENCE</div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 m-2">
                        <div>
                            <label className="block text-gray-700 text-sm">Current Address</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="currentAddress"
                                onChange={handleChange}
                                value={inputs.currentAddress}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Permanent Address</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="permanentAddress"
                                onChange={handleChange}
                                value={inputs.permanentAddress}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">State</label>
                            <select 
                                name="state"
                                onChange={handleChange}
                                value={inputs.state}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                            >
                                <option value="">Select State</option>
                                {states.map((state, index) => (
                                    <option key={index} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">City</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="city"
                                onChange={handleChange}
                                value={inputs.city}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Pin Code</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="pinCode"
                                onChange={handleChange}
                                value={inputs.pinCode}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Phone</label>
                            <input 
                                type="tel"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="phnNo"
                                onChange={handleChange}
                                value={inputs.phnNo}
                            />
                        </div>
                        
                        {/* Document Submit Upload */}
                        <div>
                            <label className="block text-gray-700 text-sm">Document Submit</label>
                            <input 
                                type="file"
                                accept=".pdf,.doc,.docx,image/*"
                                onChange={handleDocumentChange}
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                            />
                            {documentName && (
                                <p className="mt-1 text-xs text-gray-600">Selected: {documentName}</p>
                            )}
                        </div>
                    </div>

                    {/* BANK DETAILS */}
                    <div className="font-semibold text-blue-500 text-xl m-2 mt-6">BANK DETAILS</div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 m-2">
                        <div>
                            <label className="block text-gray-700 text-sm">A/C Holder Name</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="accountHolderName"
                                onChange={handleChange}
                                value={inputs.accountHolderName}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Branch Name</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="branchName"
                                onChange={handleChange}
                                value={inputs.branchName}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">IFSC Code</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="ifscCode"
                                onChange={handleChange}
                                value={inputs.ifscCode}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">A/C No.</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="accountNo"
                                onChange={handleChange}
                                value={inputs.accountNo}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Pan No</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="empPanNo"
                                onChange={handleChange}
                                value={inputs.empPanNo}
                            />
                        </div>
                    </div>

                    {/* PF & ESI DETAILS */}
                    <div className="font-semibold text-blue-500 text-xl m-2 mt-6">PF & ESI DETAILS</div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 m-2">
                        <div>
                            <label className="block text-gray-700 text-sm">PF A/C No.</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="pfAccountNo"
                                onChange={handleChange}
                                value={inputs.pfAccountNo}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">ESI No.</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="esiNo"
                                onChange={handleChange}
                                value={inputs.esiNo}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">PF Date</label>
                            <input 
                                type="date"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="pfDate"
                                onChange={handleChange}
                                value={inputs.pfDate}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">ESI Date</label>
                            <input 
                                type="date"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="esiDate"
                                onChange={handleChange}
                                value={inputs.esiDate}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">EMI No.</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="emiNo"
                                onChange={handleChange}
                                value={inputs.emiNo}
                            />
                        </div>
                    </div>

                    {/* LEAVE SERVICE INFORMATION */}
                    <div className="font-semibold text-blue-500 text-xl m-2 mt-6">LEAVE SERVICE INFORMATION</div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 m-2">
                        <div>
                            <label className="block text-gray-700 text-sm">Leave Date</label>
                            <input 
                                type="date"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="leaveDate"
                                onChange={handleChange}
                                value={inputs.leaveDate}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Leave Reason</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="leavReason"
                                onChange={handleChange}
                                value={inputs.leavReason}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Leave Remark</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="leavMark"
                                onChange={handleChange}
                                value={inputs.leavMark}
                            />
                        </div>
                    </div>

                    {/* EARNING & DEDUCTION DETAILS */}
                   {/* EARNING & DEDUCTION DETAILS */}
<div className="font-semibold text-blue-500 text-xl m-2 mt-6">EARNING & DEDUCTION DETAILS</div>
<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 m-2">
    <div>
        <label className="block text-gray-700 text-sm">Basic Salary</label>
        <input 
            type="text"
            className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
            name="basicSalary"
            onChange={handleChange}
            value={inputs.basicSalary}
        />
    </div>
    
    <div>
        <label className="block text-gray-700 text-sm">Increment Amount</label>
        <input 
            type="text"
            className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
            name="incremtntAmnt"
            onChange={handleChange}
            value={inputs.incremtntAmnt}
        />
    </div>
    
    <div>
        <label className="block text-gray-700 text-sm">Extra Amount</label>
        <input 
            type="text"
            className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
            name="extraSalary"
            onChange={handleChange}
            value={inputs.extraSalary}
        />
    </div>
</div>

{/* EMERGENCY DETAILS */}
<div className="font-semibold text-blue-500 text-xl m-2 mt-6">EMERGENCY DETAILS</div>
<div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 m-2">
    <div>
        <label className="block text-gray-700 text-sm">Name</label>
        <input 
            type="text"
            className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
            name="relatonName"
            onChange={handleChange}
            value={inputs.relatonName}
        />
    </div>
    
    <div>
        <label className="block text-gray-700 text-sm">Relation Mobile</label>
        <input 
            type="tel"
            className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
            name="relatonMobile"
            onChange={handleChange}
            value={inputs.relatonMobile}
        />
    </div>
    
    <div>
        <label className="block text-gray-700 text-sm">Relation</label>
        <input 
            type="text"
            className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
            name="relaton"
            onChange={handleChange}
            value={inputs.relaton}
        />
    </div>
</div>

{/* BUTTONS */}
<div className="flex justify-start w-full space-x-4 my-4 p-2">
    <button 
        className="bg-gray-600 text-white px-6 text-sm py-2 rounded-lg hover:bg-gray-900" 
        type="button"
        onClick={handleRefresh}
    >
        Refresh
    </button>
    <button
        className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-900"
        type="button"
        onClick={handleEmployee}
    >
        Save
    </button>
</div>
                </form>
            </div>
        </div>
    );
};

export default withAuth(Employee, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);