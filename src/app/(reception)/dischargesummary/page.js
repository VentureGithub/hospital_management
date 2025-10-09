'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';

export function DischargeSummary() {
    return (
        <LayoutForm>
            <DischargeSummaryform />
        </LayoutForm>
    );
}

const DischargeSummaryform = () => {
    const [data, setData] = useState([]);
    const [diagnosis, setDiagnosis] = useState([]);
    const [salt, setSalt] = useState([]);
    const [time, setTime] = useState([]);
    const [searchIpd, setSearchIpd] = useState("");
    const [medicineList, setMedicineList] = useState([]);

    // Main form state
    const [inputs, setInputs] = useState({
        dischargeSummaryId: 0,
        dichargeBillId: 0,
        saltmasterIdLong: [],
        medicineTimeMasterId: [],
        nofoDay: [],
        diagnosis: "",
        managementOperation: "",
        advice: ""
    });

    // Current medicine entry state
    const [currentMedicine, setCurrentMedicine] = useState({
        saltId: "",
        timeId: "",
        days: "",
        medicineName: "", // For display only
        medicineTime: "" // For display only
    });

    const handleSearch = async () => {
        if (!searchIpd) {
            toast.error("Please enter an IPD number to search");
            return;
        }

        try {
            const response = await apiClient.get(`dischargePatient/bill/getByIpdNo?ipdNo=${searchIpd}`);
            if (response.data && response.data.data) {
                const ipdData = response.data.data;
                setInputs(prev => ({
                    ...prev,
                    ipdNo: ipdData.ipdNo || "",
                    patientName: ipdData.patientName || "",
                    dichargeBillId:ipdData.dichargeBillId || 0
                }));
            } else {
                toast.error("No patient found with this IPD number");
            }
        } catch (error) {
            console.error("Error searching IPD:", error);
            toast.error("Error searching for IPD number");
        }
    };

    const handleDiagnosis = (e) => {
        const selectedDiagnosis = diagnosis.find(d => d.diagnosisId === parseInt(e.target.value));
        if (selectedDiagnosis) {
            setInputs(prev => ({
                ...prev,
                diagnosis: selectedDiagnosis.diagnosis,
                managementOperation: selectedDiagnosis.managementOperation,
                advice: selectedDiagnosis.advice
            }));
        }
    };

    const handleSalt = (e) => {
        const selectedSalt = salt.find(s => s.saltmasterIdLong === parseInt(e.target.value));
        setCurrentMedicine(prev => ({
            ...prev,
            saltId: e.target.value,
            medicineName: selectedSalt ? selectedSalt.saltNameString : ""
        }));
    };

    const handleTime = (e) => {
        const selectedTime = time.find(t => t.medicineTimeMasterId === parseInt(e.target.value));
        setCurrentMedicine(prev => ({
            ...prev,
            timeId: e.target.value,
            medicineTime: selectedTime ? selectedTime.medicineTime : ""
        }));
    };

    const handleDayChange = (e) => {
        setCurrentMedicine(prev => ({
            ...prev,
            days: e.target.value
        }));
    };

    const handleAddMedicine = (e) => {
        e.preventDefault();
        if (!currentMedicine.saltId || !currentMedicine.timeId || !currentMedicine.days) {
            toast.error("Please fill all medicine details");
            return;
        }
    
        // Add to medicine list for table display
        setMedicineList(prev => [...prev, {
            ...currentMedicine,
            id: Date.now()
        }]);
    
        // Update main inputs with new medicine details
        setInputs(prev => ({
            ...prev,
            saltmasterIdLong: [...prev.saltmasterIdLong, parseInt(currentMedicine.saltId)],
            medicineTimeMasterId: [...prev.medicineTimeMasterId, parseInt(currentMedicine.timeId)],
            nofoDay: [...prev.nofoDay, currentMedicine.days]
        }));
    
        // Reset only medicine form
        resetMedicineForm();
    };

    const handleDelete = (id) => {
        const index = medicineList.findIndex(item => item.id === id);
        
        // Remove from medicine list
        setMedicineList(prev => prev.filter(item => item.id !== id));
        
        // Remove from inputs arrays
        setInputs(prev => ({
            ...prev,
            saltmasterIdLong: prev.saltmasterIdLong.filter((_, i) => i !== index),
            medicineTimeMasterId: prev.medicineTimeMasterId.filter((_, i) => i !== index),
            nofoDay: prev.nofoDay.filter((_, i) => i !== index)
        }));
    };

    const fetchDiagnosis = async () => {
        try {
            const response = await apiClient.get(`DiagnosisMaster/getAlldAtaInList`);
            setDiagnosis(response.data.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    

    const fetchSalt = async () => {
        try {
            const response = await apiClient.get(`saltMaster/getAllData`);
            setSalt(response.data.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

   
    const fetchTime = async () => {
        try {
            const response = await apiClient.get(`medicineTime/getAllData`);
            setTime(response.data.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    

    useEffect(() => {
        fetchDiagnosis();
        fetchSalt();
        fetchTime();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        if (medicineList.length === 0) {
            toast.error("Please add at least one medicine");
            return;
        }
    
        try {
            const response = await apiClient.post(`dischargeSummary/saveAllData`, inputs);
            if (response.status === 200) {
                toast.success("Data saved successfully");
                // Reset entire form
                resetAllForm();
                const dischargeSummaryId = response.data.data.dischargeSummaryId;
                    console.log("Received OPD Number:", dischargeSummaryId);

                    // Try to download slip
                    if (dischargeSummaryId) {
                        try {
                            await handleMedicalDownload(dischargeSummaryId);
                        } catch (downloadError) {
                            console.error('Download error:', downloadError);
                            toast.error('Data saved but there was an error downloading the slip. Please try downloading it later.');
                        }
                    } else {
                        console.error("No OPD number in response:", response.data);
                    }
            } else {
                toast.error("Failed to save data");
            }
        } catch (error) {
            console.error("Error saving data:", error);
            toast.error("An error occurred while saving");
        }
    };


    const resetMedicineForm = () => {
        setCurrentMedicine({
            saltId: "",
            timeId: "",
            days: "",
            medicineName: "",
            medicineTime: ""
        });
        // Reset select elements to default
        document.querySelectorAll('select[name="medicine"], select[name="time"]').forEach(select => {
            select.value = 'opt';
        });
    };

    const resetAllForm = () => {
        // Reset main form
        setInputs({
            dischargeSummaryId: 0,
            dichargeBillId: 0,
            saltmasterIdLong: [],
            medicineTimeMasterId: [],
            nofoDay: [],
            diagnosis: "",
            managementOperation: "",
            advice: ""
        });
        // Reset medicine list
        setMedicineList([]);
        // Reset current medicine
        resetMedicineForm();
        // Reset search
        setSearchIpd("");
        // Reset all select elements to default
        document.querySelectorAll('select').forEach(select => {
            select.value = 'opt';
        });
    };

    const handleMedicalDownload = async (dischargeSummaryId) => {
        try {
          const response = await apiClient.get(`dischargeSummary/getDischargeSummaryPdf`, {
            params: { dischargeSummaryId },
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
        <>
            <div className='p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6  rounded-xl shadow-2xl border border-sky-100'>
                <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                            <FaPencilAlt size={16} />
                        </div>
                        <Heading headingText={"Discharge Summary "} />
                    </div>
                    <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">Reception • IPD</div>
                </div>
                <div className="w-full lg:w-[25%] md:w-[60%] sm:w-[100%] flex justify-center items-center mt-3 ">
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm bg-white/70 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-300"
                        placeholder="Search By IPD"
                        value={searchIpd}
                        onChange={(e) => setSearchIpd(e.target.value)}
                    />
                    <button
                        className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 ml-2 text-sm shadow-sm"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
                <div className='py-7 '>
                    <form className='lg:w-[100%] md:w-[80%] sm:w-[100%]'>
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 ">
                            <div>

                                <label className="block font-semibold text-sm">IPD No.</label>

                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                    name="ipdNo"
                                    value={inputs.ipdNo}
                                    readOnly
                                />

                            </div>
                            <div>
                                <label className="block font-semibold text-sm">Patient Name </label>

                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                                    name="patientName"
                                    value={inputs.patientName}
                                    readOnly
                                />

                            </div>
                            <div >
                                <label className="block font-semibold text-sm">Diagnosis Name</label>

                                <select onChange={handleDiagnosis} className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm" defaultValue="opt">
                                    <option value="opt">Select Diagnosis</option>
                                    {diagnosis.map((data , index) => (
                                        <option  key={index} value={data.diagnosisId} >{data.diagnosis}</option>
                                    ))}
                                </select>

                            </div>

                            <div>
                                <label className="block font-semibold text-sm">M/O</label>

                                <select onChange={handleDiagnosis} className="text-sm w-full px-4 py-2 border rounded-lg focus:outline-none" defaultValue="opt">
                                    <option value="opt">management/Operation</option>
                                    {diagnosis.map((data ,index ) => (
                                        <option key={index} value={data.diagnosisId}>{data.managementOperation}</option>
                                    ))}
                                </select>

                            </div>
                            <div >
                                <label className="text-sm block font-semibold">Advice</label>

                                <select onChange={handleDiagnosis} className="w-full px-4 py-2 border rounded-lg focus:outline-none" defaultValue="opt">
                                    <option value="opt">Select Advice</option>
                                    {diagnosis.map((data , index) => (
                                        <option key={index} value={data.diagnosisId} >{data.advice}</option>
                                    ))}
                                </select>

                            </div>
                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 mt-6 ">
                            <div>
                                <label className="text-sm block font-semibold">Medicine Name</label>

                                <select onChange={handleSalt} className="text-sm w-full px-4 py-2 border rounded-lg focus:outline-none" defaultValue="opt">
                                    <option value="opt">Select Medicine</option>
                                    {salt?.map((data ,index) => (
                                        <option key={index} value={data.saltmasterIdLong} >{data.saltNameString}</option>
                                    ))}
                                </select>

                            </div>
                            <div >
                                <label className="block font-semibold text-sm">Time</label>

                                <select onChange={handleTime} className="text-sm w-full px-4 py-2 border rounded-lg focus:outline-none" defaultValue="opt">
                                    <option value="opt">Select Time</option>
                                    {time.map((data ,index) => (
                                        <option key={index} value={data.medicineTimeMasterId} >{data.medicineTime}</option>
                                    ))}
                                </select>

                            </div>
                            <div >
                                <label className="block font-semibold text-sm">No. Of Days</label>

                                <input 
    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm" 
    type="text" 
    name="days"
    value={currentMedicine.days} 
    onChange={handleDayChange}
    placeholder="Enter number of days"
/>

                            </div>
                        </div>
                        {/* <div className="flex justify-end w-full space-x-4 p-2">
                            <button
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-900 text-sm"
                                onClick={handleDemandDue}
                            >
                                Add
                            </button>
                        </div> */}
                        <div className="bg-white p-2 rounded-lg shadow-md mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Medicine Name</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Time</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Days</th>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicineList.map(medicine => (
                                <tr key={medicine.id} className="text-center">
                                    <td className="p-2 border">{medicine.medicineName}</td>
                                    <td className="p-2 border">{medicine.medicineTime}</td>
                                    <td className="p-2 border">{medicine.days}</td>
                                    <td className="p-2 border">
                                        <button
                                            onClick={() => handleDelete(medicine.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaPencilAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {medicineList.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-2 text-center text-gray-500">
                                        No medicines added yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
                <button
                    onClick={handleAddMedicine}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Medicine
                </button>
                <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Save All
                </button>
            </div>
                    </form>
                </div>
                {/* Rest of your component (table, etc.) remains the same */}
            </div>
        </>
    );
};

export default withAuth(DischargeSummary, ['SUPERADMIN', 'ADMIN', 'RECEPTION']);