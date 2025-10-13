
'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { toast } from 'sonner';
import { IoPrintOutline } from "react-icons/io5";
import withAuth from '@/app/(components)/WithAuth';
import apiClient from '@/app/config';

export function Ipdregistration() {
    return (
        <LayoutForm>
            <IPDRegistrationform />
        </LayoutForm>
    );
}

const IPDRegistrationform = () => {
    const [data, setData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [searchOpdNo, setSearchOpdNo] = useState("");
    const [roomTypeMaster, setRoomTypeMaster] = useState([]);
    const [room, setRoom] = useState('');
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectDoctors, setSelectDoctors] = useState('')
    const [roomName, setRoomName] = useState([])
    const [selectedRoomName, setSelectedRoomName] = useState("");
    // const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
    const [inputs, setInputs] = useState({
        ipdId: 0,
        drId: 0,
        deptId: 0,
        opdNo: "",
        ipdNo: "",
        admitDate: "",
        admitTime: "",
        patientName: "",
        fatherName: "",
        address: "",
        age: 0,
        occupation: "",
        gender: "",
        maritalStatus: "",
        roomType: "",
        roomName: "",
        payType: "",
        patientType: "",
        refBy: "",
        advance: 0,
        aadharNo: "",
        aayushmanIdNo: "",
        drName: "",
        depName: "",
        roomTypeName: "",
        status: true,
        mobileNo: '',
        roomTypeId: '',
        insuranceType: "",
        insuranceNo: "",
        roomwardId: ''

    });


    const handleRefresh = () => {
        setInputs({
            ipdId: 0,
            drId: 0,
            deptId: 0,
            opdNo: "",
            ipdNo: "",
            admitDate: "",
            admitTime: "",
            patientName: "",
            fatherName: "",
            address: "",
            age: 0,
            occupation: "",
            gender: "",
            maritalStatus: "",
            roomType: "",
            roomName: "",
            mobileNo: "",
            payType: "",
            patientType: "",
            aadharNo: "",
            aayushmanIdNo: "",
            refBy: "",
            advance: 0,
            drName: "",
            depName: "",
            roomTypeName: "",
            status: true,
            insuranceType: "",
            insuranceNo: "",
            mobileNo: ''


        })
    }

    // const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('ipdId');
    const [sortDir, setSortDir] = useState('desc');

    const pageSizeOptions = [5, 10, 15, 20, 25, 50];

    const fetchData = async (page = 0, size = pageSize) => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                pageNo: page,
                pageSize: size,
                sortBy,
                sortDir
            });

            if (searchTerm) {
                queryParams.append('searchTerm', searchTerm);
            }

            const response = await apiClient.get(
                `ipdregistration/getAllPaginationData?${queryParams.toString()}`
            );

            setData(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearchh = (e) => {
        e.preventDefault();
        fetchData(0); // Reset to first page when searching
    };

    const handlePageChange = (newPage) => {
        fetchData(newPage);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        fetchData(0, newSize);
    };

    const clearSearch = () => {
        setSearchTerm('');
        fetchData(0);
    };



    // Handle form submit
    const handleIPDRegistration = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                // Update API call
                const response = await apiClient.put(
                    `ipdregistration/roomTransfer`,
                    inputs
                );
                if (response.status == 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false);
                    fetchApi(currentPage, pageSize); // Pass current page and size
                } else {
                    toast.error("Failed! Please try again");
                }
            } else {
                // Save API call
                const response = await apiClient.post(
                    `ipdregistration`,
                    inputs
                );
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                    fetchData(0, pageSize); // Go to first page after adding new data

                } else {
                    toast.error("Failed! Please try again");
                }
            }

            setInputs({
                ipdId: 0,
                drId: 0,
                deptId: 0,
                opdNo: "",
                ipdNo: "",
                admitDate: "",
                admitTime: "",
                patientName: "",
                fatherName: "",
                address: "",
                age: 0,
                occupation: "",
                gender: "",
                maritalStatus: "",
                roomType: "",
                roomName: "",
                aadharNo: "",
                aayushmanIdNo: "",
                payType: "",
                patientType: "",
                refBy: "",
                mobileNo: "",
                advance: 0,
                drName: "",
                depName: "",
                status: true,
                insuranceType: "",
                insuranceNo: "",
                mobileNo: ''
            });
        } catch (error) {
            console.error("Error handling department:", error);
            toast.error("An error occurred. Please try again.");
        }
    };
    const handleUpdate = (opd) => {
        setInputs({
            ipdId: opd.ipdId,
            drId: opd.drId,
            deptId: opd.deptId,
            opdNo: opd.opdNo,
            ipdNo: opd.ipdNo,
            admitDate: opd.admitDate,
            admitTime: opd.admitTime,
            patientName: opd.patientName,
            fatherName: opd.fatherName,
            address: opd.address,
            age: opd.age,
            occupation: opd.occupation,
            gender: opd.gender,
            maritalStatus: opd.maritalStatus,
            roomTypeName: opd.roomTypeName,
            roomName: opd.roomName,
            aadharNo: opd.aadharNo,
            aayushmanIdNo: opd.aayushmanIdNo,
            payType: opd.payType,
            patientType: opd.patientType,
            refBy: opd.refBy,
            advance: opd.advance,
            drName: opd.drName,
            depName: opd.depName,
            insuranceType: opd.insuranceType,
            insuranceNo: opd.insuranceNo,
            mobileNo: opd.mobileNo
        });
        setIsEdit(true);
    };




    useEffect(() => {
        const fee = parseFloat(inputs.fee) || 0;
        const discount = parseFloat(inputs.discount) || 0;
        setInputs((prevInputs) => ({
            ...prevInputs,
            netAmount: fee - discount,
        }));
    }, [inputs.fee, inputs.discount]);


    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // File download function

    const handleReceiptDownload = async (ipdNo) => {
        try {
            const response = await apiClient.get(`ipdregistration/generateipdAdmorder`, {
                params: { ipdNo },
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
                console.error('Failed to download AdmOrder:', response.status);
                toast.error("Failed to download AdmOrder. Please try again.");
            }
        } catch (error) {
            console.error('Error downloading the AdmOrder:', error);
            toast.error("An error occurred while downloading the AdmOrder. Please try again.");
        }
    };



    // Fetch departments on component mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await apiClient.get(`dep/getAllDepartmentByGrade?grade=A`);
                setDepartments(response.data.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchDepartments();
    }, [])


    // Handle department selection
    const handleDepartmentSelect = (event) => {
        // setSelectedDepartmentId(event.target.value);
        const deptId = event.target.value
        console.log("hello", deptId)
        fetchDoctorsByDepartment(event.target.value)
        // const selectedDepartment = departments.find(dept => dept.deptId === parseInt(event.target.value));
        setInputs({
            ...inputs,
            // deptId: selectedDepartment ? selectedDepartment.deptId : 0,
            deptId: deptId,
            docName: ""
        });
    };



    // Handle doctor selection
    const handleDoctorSelect = (event) => {
        setSelectDoctors(event.target.value)

        const selectedDoctor = doctors.find(doc => doc.drId === parseInt(event.target.value));
        setInputs({
            ...inputs,
            drId: selectedDoctor ? selectedDoctor.drId : 0,
            docName: selectedDoctor ? selectedDoctor.drName : "",
        });
    };





    //room name selector on room type
    const getRoomName = async (room) => {
        const response = await apiClient.get(`patientRoom/?roomTypeId=${room}`)
        console.log("response", response.data.data)
        setRoomName(response.data.data)
        // console.log(room)
    }



    // Handle room type change (dropdown select)
    // const handleChange1 = (event) => {
    //     const selectedRoomType = event.target.value;
    //     setRoom(selectedRoomType);
    //     getRoomName(selectedRoomType)


    //     // Correctly update the inputs state with selected roomType
    //     setInputs((prevInputs) => ({
    //         ...prevInputs,
    //         roomTypeId: selectedRoomType,
    //     }));
    //     // getRoomName(room)

    //     console.log("Selected Room Type:", selectedRoomType);
    // };

    const handleChange1 = (event) => {
        const selectedRoomType = event.target.value;
        setRoom(selectedRoomType);
        getRoomName(selectedRoomType);

        setInputs((prevInputs) => ({
            ...prevInputs,
            roomTypeId: selectedRoomType,
            roomTypeName: '' // Update roomTypeName to match response data
        }));



        console.log("Selected Room Type:", selectedRoomType);
    };

    const handleChange2 = (event) => {
        const selectedRoomName = event.target.value;
        setInputs((prevInputs) => ({
            ...prevInputs,
            roomName: '', // Update roomName to match response data
        }));
        setInputs({ ...inputs, roomwardId: event.target.value });

    };


    // // Fetch room data
    const fetchRoomTypeMaster = async () => {
        try {
            const response = await apiClient.get(`roomTypeMaster/getAllDetailofRoomTypeMaster`);
            console.log(response.data.data);
            setRoomTypeMaster(response.data.data);
        } catch (error) {
            console.error("Error fetching room type master:", error);
        }
    };


    useEffect(() => {
        fetchRoomTypeMaster();
    }, []);



    const [showFields, setShowFields] = useState(false);

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


    const handleSearch = async () => {
        try {
            // Trim the search query and convert to uppercase for comparison
            const firstChar = searchQuery.trim().charAt(0).toUpperCase();

            if (firstChar === "O") {
                // If the first character is 'O', call OPD API
                const response = await apiClient.get(`getDetailsByOpdNo`, {
                    params: { opdNo: searchQuery }
                });

                if (response.data.data) {
                    const opdData = response.data.data;
                    console.log(opdData.gender)
                    setInputs({
                        ...inputs,
                        ...opdData,
                        gender: opdData.gender || "Male",
                        maritalStatus: opdData.maritalStatus || "Married",
                        patientType: opdData.patientType || "Normal",
                        payType: opdData.payType || "Online",
                        drName: opdData.drName || "",
                        depName: opdData.depName || "",
                    });
                } else {
                    toast.error("No data found for this OPD number");
                }

            } else if (firstChar === "I") {
                // If the first character is 'I', call IPD API
                const response = await apiClient.get(`ipdregistration/getbyipdNo?`, {
                    params: { ipdNo: searchQuery }
                });


                if (response.status === 200) {
                    const ipdData = response.data.data;
                    console.log("doctor", ipdData.drName);
                    console.log("department", ipdData.depName);
                    console.log("roomTypeName", ipdData.roomTypeName)
                    console.log("roomName", ipdData.roomName)


                    setInputs({
                        ...inputs,
                        ...ipdData, // Fill inputs with data from API
                        gender: ipdData.gender || "Male", // Default value
                        maritalStatus: ipdData.maritalStatus || "Married", // Default value
                        patientType: ipdData.patientType || "Normal", // Default value
                        payType: ipdData.payType || "Online", // Default value
                        drName: ipdData.drName || " ", // Set doctor name after doctors are loaded
                        depName: ipdData.deptName || " ", // Set department name
                        roomTypeName: ipdData.roomTypeName || " ",
                        mobileNo: ipdData.mobileNo,
                        roomTypeName: ipdData.roomTypeName || "",  // Ensure roomTypeName is populated
                        roomName: ipdData.roomName || ""
                    });
                } else {
                    toast.error("No data found for this IPD number");
                }

            } else {
                toast.error("Invalid search query. Please enter a valid OPD or IPD number.");
            }
        } catch (error) {
            console.error("Error searching:", error);
            toast.error("An error occurred while searching.");
        }
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = data.filter((transaction) => {
        const query = searchQuery.trim().toLowerCase(); // Convert search query to lowercase
        return (
            query === "" ||
            transaction.ipdNo.toString().toLowerCase().includes(query) ||
            transaction.opdNo.toString().toLowerCase().includes(query) ||
            // transaction.drName.toString().toLowerCase().includes(query) ||
            transaction.patientName.toString().toLowerCase().includes(query) ||
            transaction.admitDate.toString().toLowerCase().includes(query)
        );
    });


    const [insurance, setInsurance] = useState([]);

    const fetchInsurance = async () => {
        try {
            const response = await apiClient.get(`insurance/getAllData`);
            console.log(response.data.data);
            setInsurance(response.data.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };


    const handleInsurance = (e) => {
        console.log(e.target.value);
        setInputs({ ...inputs, insuranceId: e.target.value })
    };

    useEffect(() => {
        fetchInsurance();
    }, []);








    return (
        <>
            <div className='p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6  rounded-xl shadow-2xl border border-sky-100'>
                <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                            <IoPrintOutline size={18} />
                        </div>
                        <Heading headingText="IPD Registration" />
                    </div>
                    <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">Reception • IPD</div>
                </div>

                {/* <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'> */}
                <div className="w-full lg:w-[25%] md:w-[60%] sm:w-[100%] flex justify-center items-center mt-3">
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm bg-white/70 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-300"
                        placeholder="Search By IPD or OPD"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="bg-sky-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-sky-700 ml-2 shadow-sm"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
                <div className="my-4 flex">
                        <label className="block text-gray-700 text-md">Insurance </label>
                        <div className="flex gap-4 ml-3">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="toggleFields"
                                    value="true"
                                    onChange={() => setShowFields(true)}
                                    checked={showFields === true}
                                />
                                Yes
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="toggleFields"
                                    value="false"
                                    onChange={() => setShowFields(false)}
                                    checked={showFields === false}
                                />
                                No
                            </label>
                        </div>
                    </div>
                <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                    <div>
                        <label className="block text-gray-700 text-sm">OPD No.</label>
                        <input type="text"
                            className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                            placeholder="OPD"
                            name="opdNo"
                            
                            onChange={handleChange}
                            value={inputs.opdNo} />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Patient Name<span className='font-bold text-red-500'> *</span></label>
                        <input type="text"
                            className={`w-full px-4 py-2 border text-sm rounded-lg focus:outline-none`}
                            placeholder="Patient name"
                            name="patientName"
                            onChange={handleChange}
                            value={inputs.patientName} />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Gaurdian Name<span className='font-bold text-red-500'> *</span></label>
                        <input type="text"
                            className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none '
                            placeholder="Gaurdian name"
                            name="fatherName"
                            onChange={handleChange}
                            value={inputs.fatherName} />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Mobile Number<span className='font-bold text-red-500'> *</span></label>
                        <input type="text"
                            className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none '
                            placeholder="Mobile Number"
                            name="mobileNo"
                            onChange={handleChange}
                            value={inputs.mobileNo} />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Address<span className='font-bold text-red-500'> *</span></label>
                        <input type="text"
                            className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                            placeholder="Address"
                            name="address"
                            onChange={handleChange}
                            value={inputs.address} />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Age<span className='font-bold text-red-500'> *</span></label>
                        <input type="text"
                            className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none '
                            placeholder="Age"
                            name="age"
                            onChange={handleChange}
                            value={inputs.age}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Occupation<span className='font-bold text-red-500'> *</span></label>
                        <input type="text"
                            className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                            placeholder="occupation"
                            name="occupation"
                            onChange={handleChange}
                            value={inputs.occupation} />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Gender<span className='font-bold text-red-500'> *</span></label>
                        <select
                            className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"

                            name="gender"
                            onChange={handleChange}
                            value={inputs.gender}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Marital Status<span className='font-bold text-red-500'> *</span></label>
                        <select
                            className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                            name="maritalStatus"
                            onChange={handleChange}
                            value={inputs.maritalStatus}>
                            <option>Select Marital Status</option>
                            <option value="Married">Married</option>
                            <option value="Unmarried">Unmarried</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Patient Type<span className='font-bold text-red-500'> *</span></label>
                        <select
                            className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                            name="patientType"
                            onChange={handleChange}
                            value={inputs.patientType} >
                            <option>Select Patient Type</option>
                            <option value="Normal">Normal</option>
                            <option value="Emergency">Emergency</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Department <span className='font-bold text-red-500'> *</span></label>
                        {inputs.depName ? (
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                value={inputs.depName} // Show department name if available
                                readOnly // Make it read-only
                            />
                        ) : (
                            <select
                                className="w-full px-4 py-3 border text-sm rounded-lg focus:outline-none"
                                onChange={handleDepartmentSelect}
                                name="deptId"
                                value={departments?.deptId}
                            >
                                <option value="">Select a Department</option>
                                {departments?.map((department) => (
                                    <option key={department.deptId} value={department.deptId}>
                                        {department.depName}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm">Doctor <span className='font-bold text-red-500'> *</span></label>
                        {inputs.drName ? (
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                value={inputs.drName} // Show doctor name if available
                            // Make it read-only
                            />


                        ) : (
                            <select
                                className="w-full px-4 py-3 border text-sm rounded-lg focus:outline-none"
                                onChange={handleDoctorSelect}
                                name="drId"
                                value={inputs.drId}
                            >
                                <option value="">Select a Doctor</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.drId} value={doctor.drId}>
                                        {doctor.drName}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm">Room Type <span className='font-bold text-red-500'> *</span></label>
                        {inputs.roomTypeName ? (
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                value={inputs.roomTypeName} // Show room type name if available
                                readOnly // Make it read-only
                            />
                        ) : (
                            <select
                                className="w-full px-4 py-3 border text-sm rounded-lg focus:outline-none"
                                onChange={handleChange1}
                                value={inputs.roomTypeId}
                            >
                                <option value="">Select an Option</option>
                                {roomTypeMaster?.map((roomType) => (
                                    <option value={roomType.roomTypeId} key={roomType.roomTypeId}>
                                        {roomType.roomTypeName}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm">Beds No: <span className='font-bold text-red-500'> *</span></label>
                        {inputs.roomName ? (
                            <input
                                type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                value={inputs.roomName} // Show room name if available
                                readOnly // Make it read-only
                            />
                        ) : (
                            <select
                                className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none"
                                onChange={handleChange2}
                                value={inputs.roomwardId}
                            >
                                <option value="">Select an option</option>
                                {roomName.map((data, index) => (
                                    <option value={data.roomwardId} key={index}>{`Bed No:${data.roomBedNo}`}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm">Admit Date</label>
                        <input type="date"
                            className='w-full px-4 py-2 border rounded-lg text-sm focus:outline-none'
                            // placeholder="refBy"
                            name="admitDate"
                            onChange={handleChange}
                            value={inputs.admitDate}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Admit Time</label>
                        <input type="time"
                            className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                            // placeholder="refBy"
                            name="admitTime"
                            onChange={handleChange}
                            value={inputs.admitTime}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Ref By.</label>
                        <input type="text"
                            className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                            placeholder="refBy"
                            name="refBy"
                            onChange={handleChange}
                            value={inputs.refBy} />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Aayushman No</label>
                        <input type="text"
                            className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                            placeholder="Aayushman No"
                            name="aayushmanIdNo"
                            onChange={handleChange}
                            value={inputs.aayushmanIdNo} />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Aadhar No</label>
                        <input type="text"
                            className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                            placeholder="aadharNo"
                            name="aadharNo"
                            onChange={handleChange}
                            value={inputs.aadharNo} />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm">Pay Type<span className='font-bold text-red-500'> *</span></label>
                        <select
                            className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                            name="payType"
                            onChange={handleChange}
                            value={inputs.payType}>
                            <option value="">Select an option</option>
                            <option value="Online">Online</option>
                            <option value="Cash">Cash</option>
                        </select>
                    </div>
                    {/* <div className="mb-4">
                        <label className="block text-gray-700 text-sm">Show Insurance Fields</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="toggleFields"
                                    value="true"
                                    onChange={() => setShowFields(true)}
                                    checked={showFields === true}
                                />
                                Yes
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="toggleFields"
                                    value="false"
                                    onChange={() => setShowFields(false)}
                                    checked={showFields === false}
                                />
                                No
                            </label>
                        </div>
                    </div> */}

                    {showFields && (
                    
                          <>
                            <div>
                                <label className="block text-gray-700 text-sm">Insurance Type</label>
                                <select
                                    onChange={handleInsurance}
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none">
                                    <option>select Insurance</option>
                                    {insurance.map((insurance) => (
                                        <option key={insurance.insuranceId} value={insurance.insuranceId}>
                                            {insurance.insuranceCompnyName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm">Insurance No </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                    placeholder="Insurance No"
                                    name="insuranceNo"
                                    onChange={handleChange}
                                    value={inputs.insuranceNo}
                                />
                            </div>
                          </>
                    )}
                    <div>
                        <label className="block text-gray-700 text-sm">advance </label>
                        <input type="text"
                            className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                            placeholder="Advance"
                            name="advance"
                            onChange={handleChange}
                            value={inputs.advance}
                        />
                    </div>

                </form>
                <div className="flex justify-end mt-6 space-x-4">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900 text-sm" onClick={handleIPDRegistration}>
                        {isEdit ? "Update" : "Save"}</button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-900 text-sm" onClick={handleRefresh}>Refresh</button>
                </div>


                <div className="bg-white  rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        {/* Search Bar */}
                        <div className="my-4 p-1 rounded-lg">
                            <form onSubmit={handleSearchh} className="flex gap-4">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search IPD No., Patient Name..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        />
                                    </div>
                                    <div className="flex space-x-2">
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

                        {/* Table */}
                        <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <table className="table-auto w-full border border-collapse shadow">
                                <thead>
                                    <tr className="text-center bg-sky-50">
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">ADM Order</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr. No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">IPD No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">OPD No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Patient Name</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Date</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Time</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Dr. Name</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Advance</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="10" className="text-center py-4">Loading...</td>
                                        </tr>
                                    ) : data.length > 0 ? (
                                        data.map((transaction, index) => (
                                            <tr key={transaction.ipdId} className="border border-gray-200 text-center hover:bg-gray-50">
                                                <td className="px-4 py-3 border border-gray-200">
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700"
                                                        onClick={() => handleReceiptDownload(transaction.ipdNo)}
                                                    >
                                                        <IoPrintOutline className="w-5 h-5 mx-auto" />
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 border border-gray-200">
                                                    {currentPage * pageSize + index + 1}
                                                </td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.ipdNo}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.opdNo}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.patientName}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.admitDate}</td>
                                                <td className="px-4 py-3 border border-gray-200">
                                                    {transaction.admitTime?.split('.')[0]}
                                                </td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.drName}</td>
                                                <td className="px-4 py-3 border border-gray-200">{transaction.advance}</td>
                                                <td className="px-4 py-3 border border-gray-200">
                                                    <button
                                                        className="text-blue-500 hover:text-blue-700"
                                                        onClick={() => handleUpdate(transaction)}
                                                    >
                                                        Room Transfer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="text-center py-4">No data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-4 px-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">Show</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    {pageSizeOptions.map(size => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-sm text-gray-500">entries</span>
                            </div>

                            <div className="text-sm text-gray-500">
                                Showing {currentPage * pageSize + 1} to{' '}
                                {Math.min((currentPage + 1) * pageSize, totalElements)} of{' '}
                                {totalElements} entries
                            </div>

                            <div className="flex space-x-2 p-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className={`px-4 py-2 rounded ${currentPage === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed text-sm'
                                        : 'bg-sky-500 text-white hover:bg-sky-600 text-sm'
                                        }`}
                                >
                                    Previous
                                </button>

                                <div className="flex space-x-1">
                                    {[...Array(totalPages)].map((_, page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 rounded ${currentPage === page
                                                ? 'bg-sky-500 text-white text-sm'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm'
                                                }`}
                                        >
                                            {page + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}
                                    className={`px-4 py-2 rounded ${currentPage === totalPages - 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed text-sm'
                                        : 'bg-sky-500 text-white hover:bg-sky-600 text-sm'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export default withAuth(Ipdregistration, ['SUPERADMIN', 'ADMIN', 'RECEPTION'])

