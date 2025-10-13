'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';

export function Medicinechart() {
  return (
    <LayoutForm>
      <Medicinechartform />
    </LayoutForm>
  );
}

const Medicinechartform = () => {
  const [data, setData] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [searchIpd, setSearchIpd] = useState(""); // New state for search input
  const [inputs, setInputs] = useState({
    patMedid: 0,
    ipdNo: "",
    patientName: "",
    date: "",
    medicineName: "",
    saltmasterIdLong: 0
  });

  // New function to handle search
  const handleSearch = async () => {
    if (!searchIpd) {
      toast.error("Please enter an IPD number to search");
      return;
    }

    try {
      const response = await apiClient.get(`ipdregistration/getbyipdNo?ipdNo=${searchIpd}`);
      if (response?.data && response?.data?.data) {
        const ipdData = response?.data?.data;
        setInputs(prev => ({
          ...prev,
          ipdNo: ipdData.ipdNo || "",
          patientName: ipdData.patientName || ""
        }));
      } else {
        toast.error("No patient found with this IPD number");
        setInputs(prev => ({
          ...prev,
          ipdNo: "",
          patientName: ""
        }));
      }
    } catch (error) {
      console.error("Error searching IPD:", error);
      toast.error("Error searching for IPD number");
    }
  };

  const handleDemandDue = async (e) => {
    e.preventDefault();
    try {
      if (inputs.id) {
        const response = await apiClient.put(
          `ipdregistration/getBy/ipdId?id=${inputs.id}`,
          inputs
        );

        if (response.status === 200) {
          toast.success("Data updated successfully");
        } else {
          toast.error("Update failed! Please try again");
        }
      } else {
        const response = await apiClient.post(
          `patientmedicinechart/saveMedicineChart`,
          inputs
        );

        if (response.status === 200) {
          toast.success("Data saved successfully");
          fetchtable();
        } else {
          toast.error("Save failed! Please try again");
        }
      }


      setInputs({
        id: 0,
        saltmasterIdLong: 0,
        ipdNo: "",
        patientName: "",
        date: "",
      });
      setSearchIpd(""); // Clear search input after save
    } catch (error) {
      console.error("Error handling demand:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const fetchtable = async () => {
    try {
      const response = await apiClient.get(`patientmedicinechart/getAll/medicineChart`);
      setData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchtable();
  }, []);

  
  const fetchMedicine = async () => {
    try {
      const response = await apiClient.get(`saltMaster/getAllData`);
      setMedicine(response?.data?.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchMedicine();
  }, []);

  const handleChange1 = (e) => {
    setInputs({ ...inputs, saltmasterIdLong: e.target.value });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  return (
    <>
     <div className='p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-9 ml-9  rounded-xl shadow-2xl border border-sky-100'>
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <div className="flex items-center gap-3">
          <Heading headingText={"Medicine Chart"} />
        </div>
        <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">Reception • IPD</div>
      </div>
        <div className="w-full lg:w-[25%] md:w-[60%] sm:w-[100%] flex justify-center items-center mt-3 ">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm bg-white/70 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-sky-300"
            placeholder="IPD No."
            value={searchIpd}
            onChange={(e) => setSearchIpd(e.target.value)}
          />
          <button
            className="bg-sky-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-sky-700 ml-2 shadow-sm"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
     
          <form className='lg:w-[100%] md:w-[80%] sm:w-[100%] mt-5'>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 ">
              <div className="flex flex-col sm:flex-row sm:items-center my-4">
                <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                  <label className="block font-semibold text-sm">IPD No.</label>
                </div>
                <div className="w-full sm:w-[80%]">
                  <input type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                    name="ipdNo"
                    value={inputs.ipdNo}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                  <label className="block font-semibold text-sm">Patient Name </label>
                </div>
                <div className="w-full sm:w-[80%]">
                  <input type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                    name="patientName"
                    value={inputs.patientName}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                  <label className="block font-semibold text-sm">Medicine Name</label>
                </div>
                <div className="w-full sm:w-[80%]">
                  <select onChange={handleChange1} className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm" defaultValue="opt">
                    <option value="opt">select Medicine</option>
                    {medicine?.map((data) => (
                      <option key={data.saltmasterIdLong} value={data.saltmasterIdLong}>{data.saltNameString}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                <div className="w-full sm:w-[20%] mb-2 sm:mb-0">
                  <label className="block font-semibold text-sm">Date</label>
                </div>
                <div className="w-full sm:w-[80%]">
                  <input type="date"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
                    name="date"
                    onChange={handleChange}
                    value={inputs.date}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-start w-full space-x-4 p-2">
           
              <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900 text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  setInputs({
                    patMedid: 0,
                    ipdNo: "",
                    patientName: "",
                    date: "",
                    medicineName: "",
                    saltmasterIdLong: 0
                  });
                  setSearchIpd("");
                }}
              >
                Refresh
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-900 text-sm" onClick={handleDemandDue}>Save</button>
            </div>
          </form>
    
        <div className="bg-white p-2  rounded-lg shadow-md mt-4">
          <div className="overflow-x-auto">
            <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
              <table className="table-auto w-full border border-collapse shadow">
                <thead>
                  <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr. No.</th>
                    <th className="px-4 py-2 border border-gray-200 text-sky-500">IPD No.</th>
                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Patient Name</th>
                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Medicine Name</th>
                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(data) && data?.length > 0 ? (
                    data?.map((Medicine, index) => (
                      <tr key={index} className="border border-gray-200 text-center">
                        <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                        <td className="px-4 py-3 border border-gray-200">{Medicine.ipdNo}</td>
                        <td className="px-4 py-3 border border-gray-200">{Medicine.patientName}</td>
                        <td className="px-4 py-3 border border-gray-200">{Medicine.medName}</td>
                        <td className="px-4 py-3 border border-gray-200">{Medicine.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
     
    </>
  );
};

export default withAuth(Medicinechart, ['SUPERADMIN', 'ADMIN', 'RECEPTION'])

