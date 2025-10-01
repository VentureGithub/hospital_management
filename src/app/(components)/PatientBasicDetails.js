"use client"
import { useState, useEffect } from "react";
import { format } from "date-fns";
import usePatientDetails from "../hooks/usePatientDetails";

const PatientBasicDetails = ({ PlaceholderText }) => {
    const [searchIpdId, setSearchIpdId] = useState("");
    const [searchID, setSearchID] = useState("");
    const [isInputChanged, setIsInputChanged] = useState(false);

    const { IpdDetail, patientDetail, doctorDetails, departmentRecord, roomDetails, roomAllotmentDetail } = usePatientDetails(searchID);

    // Reset details to "N/A" if input is changed
    useEffect(() => {
        if (isInputChanged) {
            setSearchID(""); // This ensures that the hook doesn't fetch data with an empty string
        }
    }, [searchIpdId]);

    const handleSearch = () => {
        setSearchID(searchIpdId.trim());
        setIsInputChanged(false); // Reset the input change tracker after search
    };

    const handleInputChange = (e) => {
        setSearchIpdId(e.target.value);
        setIsInputChanged(true); // Mark input as changed
    };

    
    return (
        <>
            <div className="mt-6">
                <div className="flex justify-start ml-6">
                    <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                        <div className="w-full sm:w-[90%] flex justify-center items-center">
                            <input
                                type="text"
                                value={searchIpdId}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                placeholder={PlaceholderText}
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-900 ml-2"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='p-6'>
                <div className='border-solid border-2 border-stone-200 rounded-lg p-7 '>
                    <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 m-2 ">
                            <DetailRow label="Patient ID:" value={isInputChanged ? "N/A" : IpdDetail.patId} />
                            <DetailRow label={searchIpdId.includes('IPD') ? "IPD ID:" : "OPD ID"} value={isInputChanged ? "N/A" : IpdDetail.ipdNo} />
                            <DetailRow label="Admission Date:" value={isInputChanged ? "N/A" : (IpdDetail.admitTime && (IpdDetail.admitTime, "dd-MM-yyyy "))} />
                            <DetailRow label="Name:" value={isInputChanged ? "N/A" : patientDetail.patientName} />
                            <DetailRow label="Gaurdian Name:" value={isInputChanged ? "N/A" : patientDetail.sonOf} />
                            <DetailRow label="Age / Gender:" value={isInputChanged ? "N/A" : `${patientDetail.age} years / ${patientDetail.gender}`} />
                            {searchIpdId.includes('IPD') && (
                                <>
                                    <DetailRow label="Ward:" value={isInputChanged ? "N/A" : roomDetails.roomType} />
                                    <DetailRow label="Bed No:" value={isInputChanged ? "N/A" : roomAllotmentDetail.bedNo} />
                                </>
                            )}
                            <DetailRow label="Treatment Under:" value={isInputChanged ? "N/A" : doctorDetails.drName ? `Dr. ${doctorDetails.drName} , ${doctorDetails.qualification} , ${departmentRecord.depName}` : "N/A"} />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};


const DetailRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center mb-4">
        <div className="w-full sm:w-[25%] mb-2 sm:mb-0">
            <label className="block font-semibold">{label}</label>
        </div>
        <div className="w-full sm:w-[75%]">
            <p>{value || "N/A"}</p>
        </div>
    </div>
);

export default PatientBasicDetails;
