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
    const [isSubmitting, setIsSubmitting] = useState(false);
    
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
            setDesignations(response.data.data || []);
        } catch (error) {
            console.error("Error fetching designations", error);
            toast.error("Failed to load designations");
        }
    };

    // Fetch Department
    const fetchDepartment = async () => {
        try {
            const response = await apiClient.get(`dep/getAllDepartment`);
            setDepartments(response.data.data || []);
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
                setShifts(response?.data?.data || []);
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
            const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(file.type)) {
                toast.error("Please upload a valid image file (JPEG, PNG, GIF)");
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            setEmpImage(file);
            
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

            if (file.size > 10 * 1024 * 1024) {
                toast.error("Document size should be less than 10MB");
                return;
            }

            setDocumentSubmit(file);
            setDocumentName(file.name);
        }
    };

    // Validate required fields
    const validateForm = () => {
        const requiredFields = {
            empName: "Employee Name",
            deptId: "Department",
            designationId: "Designation",
            joiningDate: "Joining Date",
            empEmail: "Email",
            empMobile: "Mobile Number"
        };

        for (const [field, label] of Object.entries(requiredFields)) {
            if (!inputs[field] || inputs[field].trim() === "") {
                toast.error(`${label} is required`);
                return false;
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputs.empEmail)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        // Mobile validation (10 digits)
        if (inputs.empMobile.length !== 10) {
            toast.error("Mobile number must be 10 digits");
            return false;
        }

        return true;
    };

    // Handle form submission
    const handleEmployee = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        
        const formData = new FormData();
        
        // Fields that should always be sent (even if empty)
        const alwaysSendFields = ['empCode' ,'depName'];
        
        // Append only non-empty fields to FormData, except for alwaysSendFields
        Object.keys(inputs).forEach(key => {
            const value = inputs[key];
            
            // Always send certain fields even if empty
            if (alwaysSendFields.includes(key)) {
                formData.append(key, value || "");
            } 
            // Only append other fields if they have a value
            else if (value !== null && value !== undefined && value !== "") {
                formData.append(key, value);
            }
        });

        // Append files if they exist
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
            
            if (response.status === 200 || response.status === 201) {
                toast.success("Employee data saved successfully");
                handleRefresh();
            } else {
                toast.error(response.data?.message || "Failed! Please try again");
            }
        } catch (error) {
            console.error("Error saving employee:", error);
            const errorMessage = error.response?.data?.message || "An error occurred while saving";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle refresh
    const handleRefresh = () => {
        setInputs({
            empCode: "",
            depName:"",
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
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]' onSubmit={handleEmployee}>
                    {/* JOINING DETAILS */}
                    <div className="font-semibold text-blue-500 text-xl m-2">JOINING DETAILS</div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2">
                        <div>
                            <label className="block text-gray-700 text-sm">
                                Designation <span className="text-red-500">*</span>
                            </label>
                            <select 
                                name="designationId"
                                onChange={handleChange}
                                value={inputs.designationId}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                required
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
                            <label className="block text-gray-700 text-sm">
                                Department <span className="text-red-500">*</span>
                            </label>
                            <select 
                                name="deptId"
                                onChange={handleChange}
                                value={inputs.deptId}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                required
                            >
                                <option value="">Select Department</option>
                                {departments?.map((item) => (
                                    <option key={item.deptId} value={item.deptId}>
                                        {item.depName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">
                                Joining Date <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="date"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="joiningDate"
                                onChange={handleChange}
                                value={inputs.joiningDate}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Salary Date</label>
                            <input 
                                type="date"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="salaryDate"
                                onChange={handleChange}
                                value={inputs.salaryDate}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Job Type</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="weeklyHoliday"
                                onChange={handleChange}
                                value={inputs.weeklyHoliday}
                                placeholder="e.g., Sunday"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Work Allocation</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
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
                            <label className="block text-gray-700 text-sm">
                                Employee Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="empName"
                                onChange={handleChange}
                                value={inputs.empName}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Father Name</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="fatherName"
                                onChange={handleChange}
                                value={inputs.fatherName}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Gender</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="country"
                                onChange={handleChange}
                                value={inputs.country}
                                placeholder="India"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Date of Birth</label>
                            <input 
                                type="date"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="dateOfBirth"
                                onChange={handleChange}
                                value={inputs.dateOfBirth}
                            />
                        </div>
                      
                        <div>
                            <label className="block text-gray-700 text-sm">
                                Email ID <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="email"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="empEmail"
                                onChange={handleChange}
                                value={inputs.empEmail}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">
                                Mobile No <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="number"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="empMobile"
                                onChange={handleChange}
                                value={inputs.empMobile}
                                maxLength={10}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Blood Group</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                name="bloodGroup"
                                onChange={handleChange}
                                value={inputs.bloodGroup}
                            >
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Category</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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

                        <div>
                            <label className="block text-gray-700 text-sm">Employee Image</label>
                            <input 
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
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
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="currentAddress"
                                onChange={handleChange}
                                value={inputs.currentAddress}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Permanent Address</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
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
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="city"
                                onChange={handleChange}
                                value={inputs.city}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Pin Code</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="pinCode"
                                onChange={handleChange}
                                value={inputs.pinCode}
                                maxLength={6}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Phone</label>
                            <input 
                                type="tel"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="phnNo"
                                onChange={handleChange}
                                value={inputs.phnNo}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Document Submit</label>
                            <input 
                                type="file"
                                accept=".pdf,.doc,.docx,image/*"
                                onChange={handleDocumentChange}
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
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
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="accountHolderName"
                                onChange={handleChange}
                                value={inputs.accountHolderName}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Branch Name</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="branchName"
                                onChange={handleChange}
                                value={inputs.branchName}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">IFSC Code</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="ifscCode"
                                onChange={handleChange}
                                value={inputs.ifscCode}
                                maxLength={11}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">A/C No.</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="accountNo"
                                onChange={handleChange}
                                value={inputs.accountNo}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Pan No</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="empPanNo"
                                onChange={handleChange}
                                value={inputs.empPanNo}
                                maxLength={10}
                                style={{ textTransform: 'uppercase' }}
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
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="pfAccountNo"
                                onChange={handleChange}
                                value={inputs.pfAccountNo}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">ESI No.</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="esiNo"
                                onChange={handleChange}
                                value={inputs.esiNo}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">PF Date</label>
                            <input 
                                type="date"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="pfDate"
                                onChange={handleChange}
                                value={inputs.pfDate}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">ESI Date</label>
                            <input 
                                type="date"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="esiDate"
                                onChange={handleChange}
                                value={inputs.esiDate}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">EMI No.</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
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
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="leaveDate"
                                onChange={handleChange}
                                value={inputs.leaveDate}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Leave Reason</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="leavReason"
                                onChange={handleChange}
                                value={inputs.leavReason}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Leave Remark</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="leavMark"
                                onChange={handleChange}
                                value={inputs.leavMark}
                            />
                        </div>
                    </div>

                    {/* EARNING & DEDUCTION DETAILS */}
                    <div className="font-semibold text-blue-500 text-xl m-2 mt-6">EARNING & DEDUCTION DETAILS</div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 m-2">
                        <div>
                            <label className="block text-gray-700 text-sm">Basic Salary</label>
                            <input 
                                type="number"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="basicSalary"
                                onChange={handleChange}
                                value={inputs.basicSalary}
                                min="0"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Increment Amount</label>
                            <input 
                                type="number"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="incremtntAmnt"
                                onChange={handleChange}
                                value={inputs.incremtntAmnt}
                                min="0"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Extra Amount</label>
                            <input 
                                type="number"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="extraSalary"
                                onChange={handleChange}
                                value={inputs.extraSalary}
                                min="0"
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
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="relatonName"
                                onChange={handleChange}
                                value={inputs.relatonName}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Relation Mobile</label>
                            <input 
                                type="tel"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="relatonMobile"
                                onChange={handleChange}
                                value={inputs.relatonMobile}
                                maxLength={10}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Relation</label>
                            <input 
                                type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                                name="relaton"
                                onChange={handleChange}
                                value={inputs.relaton}
                                placeholder="e.g., Father, Mother, Spouse"
                            />
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex justify-start w-full space-x-4 my-4 p-2">
                        <button 
                            className="bg-gray-600 text-white px-6 text-sm py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200" 
                            type="button"
                            onClick={handleRefresh}
                            disabled={isSubmitting}
                        >
                            Refresh
                        </button>
                        <button
                            className={`px-6 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                isSubmitting 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700'
                            } text-white`}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default withAuth(Employee, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);