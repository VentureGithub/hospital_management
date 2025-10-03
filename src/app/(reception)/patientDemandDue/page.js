
"use client";
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';


export function PatientDemandDue() {
  return (
    <LayoutForm>
      <PatientDemandDueform />
    </LayoutForm>
  );
}



const PatientDemandDueform = () => {
  const [ipdNo, setIpdNo] = useState('');
  const [patientName, setPatientName] = useState('');
  const [entryDt, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [rate, setRate] = useState(0);
  const [frequency, setFrequency] = useState('');
  const [amount, setAmount] = useState(0);

  const [serviceOptions, setServiceOptions] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [serId, setSerId] = useState(0);
  const [ratee, setRatee] = useState(0);
  const [demandData, setDemandData] = useState([]);

  // Fetch services when the component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiClient.get('serviceMaster/getAllServiceMaster');
        setServiceOptions(response.data.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);
  const fetchDemandData = async () => {
    try {
      const response = await apiClient.get('demandDue/getDemand');
      setDemandData(response.data.data);
    } catch (error) {
      console.error('Error fetching demand data:', error);
    }
  };
  // Fetch demand data when the component mounts
  useEffect(() => {


    fetchDemandData();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await apiClient.get(`ipdregistration/getbyipdNo`, {
        params: { ipdNo: searchTerm }
      });
      const data = response.data.data;

      if (data) {
        setIpdNo(data.ipdNo);
        setPatientName(data.patientName);
        setDate(data.admitDate.split('T')[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleServiceChange = async (event) => {
    const selectedServiceId = event.target.value;
    setSelectedService(selectedServiceId);
    setSerId(event.target.value)

    try {
      const response = await apiClient.get(`serviceMaster/getServiceMasterById?serId=${selectedServiceId}`);
      const serviceData = response.data.data;
      setRate(serviceData.serviceRate);
      setRatee(serviceData.id);
    } catch (error) {
      console.error('Error fetching service rate:', error);
    }
  };

  // Calculate amount whenever rate or frequency changes
  useEffect(() => {
    const calculatedAmount = rate * frequency;
    setAmount(calculatedAmount);
  }, [rate, frequency]);

  const handleSave = async () => {
    const payload = {
      ipdNo,
      patientName,
      entryDt,
      rate: ratee,
      frequency,
      amount,
      serId
    };

    try {
      await apiClient.post('demandDue/saveDemand', payload);
      setIpdNo('');
      setPatientName('');
      setRate(0);
      setFrequency(0);
      setAmount(0);
      setSelectedService(null);
      // Re-fetch demand data after saving
      const response = await apiClient.get('demandDue/getDemand');
      setDemandData(response.data.data);

    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleRefresh = () => {
    setIpdNo('');
    setPatientName('');
    setRate(0);
    setFrequency(0);
    setAmount(0);
    setSelectedService(null);
  };

  return (
    <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
      <Heading headingText={"IPD Patient service"} />
      <div className="w-full lg:w-[25%] md:w-[60%] sm:w-[100%] flex justify-center items-center ">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
          placeholder="Search By IPD"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-900 ml-2"
          onClick={handleSearch} // Connect search button to handler
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">

        <div>
          <label className="block text-gray-700 text-sm">IPD No.</label>
          <input
            type="text"
            placeholder="IPD No"
            value={ipdNo}
            readOnly
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm">Patient Name</label>
          <input
            type="text"
            placeholder="Patient Name"
            value={patientName}
            readOnly
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm">Date</label>
          <input
            type="date"
            value={entryDt}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm">Service</label>
          <select
            value={selectedService || ''}
            onChange={handleServiceChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
          >
            <option value="" disabled>Select Service</option>
            {serviceOptions.map((service) => (
              <option key={service.serId} value={service.serId}>
                {service.serviceName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm">Rate</label>
          <input
            type="text"
            placeholder="Rate"
            value={rate}
            readOnly
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm">Frequency</label>
          <input
            type="text"
            placeholder="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm">Amount</label>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            readOnly
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
          />
        </div>
      </div>
      <div className="flex p-4">
        <button onClick={handleRefresh} className="bg-gray-500 text-white rounded px-4 py-2 text-sm">
          Refresh
        </button>
        <button onClick={handleSave} className="bg-green-500 text-white rounded px-4 py-2 ml-4 text-sm">
          Save
        </button>

      </div>

      {/* Table to display demand data */}
      <div className="bg-white p-2 md:p-2 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <div
            className="w-full"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <table className="table-auto w-full border border-collapse shadow">

              <thead>
                <tr>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">IPD No</th>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">Patient Name</th>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">Service Name</th>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">Date</th>
                  {/* <th className="px-4 py-2 border border-gray-200 text-sky-500">Rate</th> */}
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">Frequency</th>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                {demandData?.map((demand) => (
                  <tr key={demand.dueId} className="hover:bg-gray-100">
                    <td className="px-4 py-3 border border-gray-200">{demand.ipdNo}</td>
                    <td className="px-4 py-3 border border-gray-200">{demand.patientName}</td>
                    <td className="px-4 py-3 border border-gray-200">{demand.serName}</td>
                    <td className="px-4 py-3 border border-gray-200">{demand.entryDt}</td>
                    {/* <td className="px-4 py-3 border border-gray-200">{demand.rate}</td> */}
                    <td className="px-4 py-3 border border-gray-200">{demand.frequency}</td>
                    <td className="px-4 py-3 border border-gray-200">{demand.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(PatientDemandDue, ['SUPERADMIN', 'ADMIN', 'RECEPTION'])

