'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { BaseUrl } from "@/app/config";
import { useState, useEffect } from "react";
import Icon from "@/app/(components)/icon";
import { toast } from 'sonner';

export function Insurance() {
    return (
        <LayoutForm>
            <Insuranceform />
        </LayoutForm>
    );
}

const Insuranceform = () => {

    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [emp, setEmp] = useState([]);
    const [ambulance, setAmbulance] = useState([]);
    const [receptionDiscount, setReceptionDiscount] = useState([]);
    const [inputs, setInputs] = useState({
        ambulanceBookingId: 0,
        bookingChargeAmount: 1000,
        discountId: 0,
        netAmount: 0,
        patientName: "",
        patientCondition: "",
        ambulanceId: 0,
        empCode: 0,
        empName: "",
        phoneNo: "",
        startLocation: "",
        endLocation: "",
        ambulanceGoingTimeInHospital: "",
        ambulanceComingTimeInHospital: ""
    });


    // Fetch all room types
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`ambulanceBooking/getAllBooking`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);


    // Handle saving or updating the room type
    const handleOpening = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                // Corrected Update API call with room id
                const response = await apiClient.put(
                    `ambulanceBooking/updateAmbulanceStatus`, // Fixed URL construction
                    inputs
                );
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false); // Reset edit state after update
                } else {
                    toast.error("Update failed! Please try again");
                }
            } else {
                // Save API call for new room type
                const response = await apiClient.post(
                    `ambulanceBooking/createBooking`,
                    inputs
                );
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                    const ambulanceBookingId = response.data.data.ambulanceBookingId;
                    console.log("Received OPD Number:", ambulanceBookingId);

                    // Try to download slip
                    if (ambulanceBookingId) {
                        try {
                            await handleMedicalDownload(ambulanceBookingId);
                        } catch (downloadError) {
                            console.error('Download error:', downloadError);
                            toast.error('Data saved but there was an error downloading the slip. Please try downloading it later.');
                        }
                    } else {
                        console.error("No OPD number in response:", response.data);
                    }
                } else {
                    toast.error("Save failed! Please try again");
                }
            }
            fetchApi(); // Refresh the list of room types after save or update
            setInputs({
                ambulanceBookingId: 0,
                bookingChargeAmount: 1000,
                discountId: 0,
                netAmount: 0,
                patientName: "",
                patientCondition: "",
                ambulanceId: 0,
                empCode: 0,
                empName: "",
                phoneNo: "",
                startLocation: "",
                endLocation: "",
                ambulanceGoingTimeInHospital: "",
                ambulanceComingTimeInHospital: ""
            });
        } catch (error) {
            console.error("Error handling room type:", error);
            toast.error("An error occurred. Please try again.");
        }
    };


    // Set the form fields for editing a room type
    const handleUpdate = (ambulance) => {
        setInputs({
            ambulanceBookingId: ambulance.ambulanceBookingId,
            bookingChargeAmount: ambulance.bookingChargeAmount,
            discountId: ambulance.discountId,
            netAmount: ambulance.netAmount,
            patientName: ambulance.patientName,
            patientCondition: ambulance.patientCondition,
            ambulanceId: ambulance.ambulanceId,
            empCode: ambulance.empCode,
            empName: ambulance.empName,
            phoneNo: ambulance.phoneNo,
            startLocation: ambulance.startLocation,
            endLocation: ambulance.endLocation,
            ambulanceGoingTimeInHospital: ambulance.ambulanceGoingTimeInHospital,
            ambulanceComingTimeInHospital: ambulance.ambulanceComingTimeInHospital
        });
        setIsEdit(true);
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };



    const fetchAmbulance = async () => {
        try {
            const response = await apiClient.get(`ambulanceMaster/getAllavliableAmbulance`);
            console.log(response.data.data);
            setAmbulance(response.data.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };


    const handleAmbulance = (e) => {
        console.log(e.target.value);
        setInputs({ ...inputs, ambulanceId: e.target.value })
    };

    useEffect(() => {
        fetchAmbulance();
    }, []);


    //discount list
    const [discount, setDiscount] = useState([]);

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

    const [localDateTime, setLocalDateTime] = useState({
        date: '',
        time: ''
    });

    // Initialize local date and time when component mounts or inputs changes
    useEffect(() => {
        if (inputs.ambulanceGoingTimeInHospital) {
            const { date, time } = formatDateTimeForInput(inputs.ambulanceGoingTimeInHospital);
            setLocalDateTime({ date, time });
        }
    }, [inputs.ambulanceGoingTimeInHospital]);

    // Handle date and time changes
    const handleDateTimeChange = (e) => {
        const { name, value } = e.target;
        const newLocalDateTime = {
            ...localDateTime,
            [name === 'ambulanceGoingTimeInHospital_date' ? 'date' : 'time']: value
        };

        setLocalDateTime(newLocalDateTime);

        // Combine date and time and update the main inputs state
        if (newLocalDateTime.date && newLocalDateTime.time) {
            const combinedDateTime = combineDateTime(newLocalDateTime.date, newLocalDateTime.time);
            setInputs(prev => ({
                ...prev,
                ambulanceGoingTimeInHospital: combinedDateTime
            }));
        }
    };


    const formatDateTimeForInput = (isoString) => {
        if (!isoString) return { date: '', time: '' };
        const dateObj = new Date(isoString);
        return {
            date: dateObj.toISOString().split('T')[0],
            time: dateObj.toTimeString().slice(0, 5)
        };
    };

    const combineDateTime = (date, time) => {
        if (!date || !time) return '';
        const combined = new Date(`${date}T${time}`);
        return combined.toISOString();
    };


    const [localDateTimee, setLocalDateTimee] = useState({
        coming_date: '',
        coming_time: ''
    });

    // Helper function to format datetime for input fields
    // const formatDateTimeForInput = (isoString) => {
    //     if (!isoString) return { date: '', time: '' };
    //     const dateObj = new Date(isoString);
    //     return {
    //         date: dateObj.toISOString().split('T')[0],
    //         time: dateObj.toTimeString().slice(0, 5)
    //     };
    // };

    // Helper function to combine date and time into ISO string
    // const combineDateTime = (date, time) => {
    //     if (!date || !time) return '';
    //     const combined = new Date(`${date}T${time}`);
    //     return combined.toISOString();
    // };

    // Initialize local date and time when component mounts
    useEffect(() => {
        if (inputs.ambulanceComingTimeInHospital) {
            const { date, time } = formatDateTimeForInput(inputs.ambulanceComingTimeInHospital);
            setLocalDateTimee(prev => ({
                ...prev,
                coming_date: date,
                coming_time: time
            }));
        }
    }, [inputs.ambulanceComingTimeInHospital]);

    // Handle date and time changes
    const handleComingTimeChange = (e) => {
        const { name, value } = e.target;
        const isDate = name === 'ambulanceComingTimeInHospital_date';

        // Update local state
        setLocalDateTimee(prev => ({
            ...prev,
            [isDate ? 'coming_date' : 'coming_time']: value
        }));

        // Get the current date/time values
        const dateToUse = isDate ? value : localDateTime.coming_date;
        const timeToUse = isDate ? localDateTime.coming_time : value;

        // Only update main state if we have both date and time
        if (dateToUse && timeToUse) {
            const combinedDateTime = combineDateTime(dateToUse, timeToUse);
            setInputs(prev => ({
                ...prev,
                ambulanceComingTimeInHospital: combinedDateTime
            }));
        }
    };



    const handleMedicalDownload = async (ambulanceBookingId) => {
        try {
          const response = await apiClient.get(`ambulanceBooking/getAmbulamceBookingpdf`, {
            params: { ambulanceBookingId },
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
            <Heading headingText="Ambulance Booking" />
            <div className=''>
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 my-6 ">
                        <div>
                            <label className="block font-semibold text-sm">Booking Charge</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="bookingChargeAmount"
                                readOnly={isEdit}
                                onChange={isEdit ? undefined : handleChange}
                                value={inputs.bookingChargeAmount}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm">Discount </label>
                            <select 
                            readOnly={isEdit}
                            onChange={isEdit ? undefined : handleChange} name="discountId"
                                // onBlur={formik.handleBlur}
                                className="w-full text-gray-700 px-4 py-2 text-sm border rounded-lg focus:outline-none">
                                <option>select Discount</option>
                                {receptionDiscount?.map((data,index) => (
                                    <option key={index} value={data.discountId}>{`${data.discountPercentage}%`}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold text-sm">Net Amount</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="netAmount"
                                readOnly={isEdit}
                                onChange={isEdit ? undefined : handleChange}
                                value={inputs.netAmount}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm">Patient Name</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="patientName"
                                readOnly={isEdit}
                                onChange={isEdit ? undefined : handleChange}
                                value={inputs.patientName}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm">Mobile No.</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="phoneNo"
                                readOnly={isEdit}
                                onChange={isEdit ? undefined : handleChange}
                                value={inputs.phoneNo}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm">Patient Condition </label>
                            <select
                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                name="patientCondition"
                                readOnly={isEdit}
                                onChange={isEdit ? undefined : handleChange}
                                value={inputs.patientCondition} >
                                <option>Select Patient Type</option>
                                <option value="Normal">Normal</option>
                                <option value="Emergency">Emergency</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold text-sm">Ambulance</label>
                            <select
                                readOnly={isEdit}
                                onChange={isEdit ? undefined : handleAmbulance}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm">
                                <option>select Ambulance</option>
                                {ambulance?.map((ambulance,index) => (
                                    <option key={index} value={ambulance.ambulanceId}>{ambulance.ambulanceNumber}{ambulance.driverPhoneNo}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold text-sm">From Location</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="startLocation"
                                readOnly={isEdit}
                                onChange={isEdit ? undefined : handleChange}
                                value={inputs.startLocation}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm">To Location</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="endLocation"
                                readOnly={isEdit}
                                onChange={isEdit ? undefined : handleChange}
                                value={inputs.endLocation}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-sm">Time To Go</label>
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                    name="ambulanceGoingTimeInHospital_time"
                                    readOnly={isEdit}
                                    onChange={isEdit ? undefined : handleDateTimeChange}
                                    value={localDateTime.time}
                                />
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                    name="ambulanceGoingTimeInHospital_date"
                                    readOnly={isEdit}
                                    onChange={isEdit ? undefined : handleDateTimeChange}
                                    value={localDateTime.date}
                                />
                            </div>
                        </div>
                        <div>
                            {/* <label className="block font-semibold text-sm">Time To Come</label>
                            <input type="time"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm'
                                name="ambulanceComingTimeInHospital"
                                onChange={handleChange}
                                value={inputs.ambulanceComingTimeInHospital}
                            /> */}
                            <label className="block font-semibold text-sm">Time To Come</label>
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                    name="ambulanceComingTimeInHospital_time"
                                    readOnly={!isEdit}
                                    onChange={!isEdit ? undefined : handleComingTimeChange}
                                    value={localDateTimee.coming_time}
                                />
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                    name="ambulanceComingTimeInHospital_date"
                                    readOnly={!isEdit}
                                    onChange={!isEdit ? undefined : handleComingTimeChange}
                                    value={localDateTimee.coming_date}
                                />
                            </div>
                        </div>


                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2">
                        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900 text-sm" type="button" >Refresh</button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900 text-sm"
                            onClick={handleOpening}
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Ambulance</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Patient</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Location</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Mobile No.</th>

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
                                            <td className="px-4 py-3 border border-gray-200">{transaction.ambulanceNumber}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.patientName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.endLocation}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.phoneNo}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <p className="text-red-600 font-medium text-sm">Note: A master could not be deleted if used anywhere</p>
        </div>
    );
};
export default withAuth(Insurance, ['DOCTOR', 'ADMIN', 'SUPERADMIN'])
