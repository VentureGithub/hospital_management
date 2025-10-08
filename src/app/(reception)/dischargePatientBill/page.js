"use client";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';

export function DischargePatientBil() {
  return (
    <LayoutForm>
      <DischargeForm />
    </LayoutForm>
  );
}

const DischargeForm = () => {
  
  const [data, setData] = useState([]);
  const [ipdData, setIpdData] = useState({});
  const [serviceData, setServiceData] = useState([]);
  const [ids, setIds] = useState([]); // For serId array
  const [frequencies, setFrequencies] = useState([]); // For frequency array
  const [searchQuery, setSearchQuery] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [disres, setDisres] = useState("");
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [gst, setGst] = useState(0);
  // const [paidAmount, setPaidAmount] = useState(0);
  const [ipd, setIpd] = useState("");

  // Calculate amounts
  // Calculate amounts
  // const totalAmount = serviceData.reduce((total, service) => {
  //   const rate = service.serviceRate;
  //   const index = ids.indexOf(service.serId);
  //   const freq = index !== -1 ? frequencies[index] : 0;
  //   return total + rate * freq;
  // }, 0);


  const totalAmount = serviceData.reduce((acc,num) => acc+num.amount,0)

  

  const discountAmount = (totalAmount * selectedDiscount) / 100;
  const subtotalAfterDiscount = totalAmount - discountAmount;
  const gstAmount = (subtotalAfterDiscount * gst) / 100;
  const payableAmount = subtotalAfterDiscount + gstAmount;

  // Calculate balance considering advance payment
 

// Calculate balance considering advance payment
const paidAmount = ipdData?.advance || 0;
const balanceAmount = Math.max(payableAmount - paidAmount);

  // Fetch all data
  const fetchApi = async () => {
    try {
      const response = await apiClient.get(`ipdregistration/getAllRegistration`);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const response = await apiClient.get(`descount/getDescount`);
      console.log("All Discounts:", response.data.data);
      setDiscounts(response.data.data);
    } catch (error) {
      console.error("Error fetching discounts", error);
    }
  };

  useEffect(() => {
    fetchApi();
    fetchDiscounts();
  }, []);

  const filteredData = data.filter((transaction) => {
    const query = searchQuery.trim().toLowerCase(); // Convert search query to lowercase
    return (
        query === "" ||
  
        transaction.opdNo.toString().toLowerCase().includes(query) ||
        transaction.drName.toString().toLowerCase().includes(query) ||
        transaction.patientName.toString().toLowerCase().includes(query)
  
  
    );
  });

  const handleDiscountChange = (e) => {
    const selectedDiscountId = parseInt(e.target.value);
    const selectedDiscountObj = discounts.find(
      (discount) => discount.discountId === selectedDiscountId
    );
    
    // Set selected discount percentage or 0 if no selection
    setSelectedDiscount(selectedDiscountObj ? selectedDiscountObj.discountPercentage : 0);
  };

 const handleUpdate = async (id) => {
    try {
      // Fetch IPD data
      const response = await apiClient.get(`ipdregistration/getbyipdNo?ipdNo=${id}`);
      if (response.status === 200) {
        setIpdData(response.data.data);
        setIpd(id);
  
        // Fetch service data specific to the IPD number
        const serviceResponse = await apiClient.get(`demandDue/getAllDemandByIpdNo?ipdNo=${id}`);
        if (serviceResponse.status === 200) {
          setServiceData(serviceResponse.data.data); // Assuming the API response has a 'data' key
        }
      }
    } catch (error) {
      console.error("Error fetching IPD or service data:", error);
    }
  };
  

  const fetchServiceData = async () => {
    try {
      const response = await apiClient.get(`serviceMaster/getAllServiceMaster`);
      if (response.status === 200) {
        setServiceData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching service data:", error);
    }
  };

  const handleFrequencyChange = (serId, value) => {
    const newFrequency = parseFloat(value) || 0;
    const index = ids.indexOf(serId);
    
    if (index !== -1) {
      const updatedFrequencies = [...frequencies];
      updatedFrequencies[index] = newFrequency;
      setFrequencies(updatedFrequencies);
    } else {
      setIds(prev => [...prev, serId]);
      setFrequencies(prev => [...prev, newFrequency]);
    }
  };

  const handleSave = async () => {
    const dataToSend = {
      dichargeBillId: 0,
      ipdNo: ipdData.ipdNo,
      patientName: ipdData.patientName,
      disres,
      serId: ids,
      frequency: frequencies,
      discount:selectedDiscount,
      gst,
      totalAmount,
      discountAmount,
      gstAmount,
      payableAmt: payableAmount,
      balanceAmount,
      paidAmount,
      dischargeDate
    };
  
    try {
      // First, save the discharge data
      const saveResponse = await apiClient.post(`dischargePatient/bill/generate`, dataToSend);
      
      if (saveResponse.status === 200) {
        toast.success("Data saved successfully");
        
        // After successful save, generate and open PDF
        try {
          const pdfResponse = await apiClient.get(`dischargePatient/bill/generateHospitalBill`, {
            params: { ipdNo: ipdData.ipdNo },
            responseType: 'blob'
          });
  
          if (pdfResponse.status === 200) {
            // Create blob from response
            const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Open PDF in new window
            const pdfWindow = window.open('');
            pdfWindow.document.write(
              `<iframe width='100%' height='100%' src='${url}'></iframe>`
            );
  
            // Clean up
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
            }, 100);
          }
        } catch (pdfError) {
          console.error("Error generating PDF:", pdfError);
          toast.error("Data saved but there was an error generating the PDF");
        }
      } else {
        toast.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("An error occurred while saving data");
    }
  };

  return (
    <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
      <Heading headingText={"Discharge Patient Bill"} />
      
      {/* Search Section */}
      <div className="w-full lg:w-[25%] md:w-[60%] sm:w-[100%] flex justify-center items-center py-4">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
          placeholder="Search By IPD No"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white p-2 my-4 md:p-2 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
              <table className="table-auto w-full border border-collapse shadow">
                <thead>
                  <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr. No.</th>
                    <th className="px-4 py-2 border border-gray-200 text-sky-500">IPD No.</th>
                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Date</th>
                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Patient Name</th>
                    <th className="px-4 py-2 border border-gray-200 text-sky-500">DR. Name</th>
                    {/* <th className="px-4 py-2 border border-gray-200 text-sky-500">Room No.</th> */}
                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(filteredData) && filteredData.length > 0 ? (
                    filteredData.map((transaction, index) => (
                      <tr key={index} className="border border-gray-200 text-center">
                        <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                        <td className="px-4 py-3 border border-gray-200">{transaction.ipdNo}</td>
                        <td className="px-4 py-3 border border-gray-200">{transaction.admitDate}</td>
                        <td className="px-4 py-3 border border-gray-200">{transaction.patientName}</td>
                        <td className="px-4 py-3 border border-gray-200">{transaction.drName}</td>
                        {/* <td className="px-4 py-3 border border-gray-200">{transaction.roomTypeName}</td> */}
                        <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                          <button className="text-blue-400 hover:text-blue-800 flex items-center"
                            onClick={() => handleUpdate(transaction.ipdNo)}
                          >
                            <FaPencilAlt className="mr-1" />
                          </button>
                        </td>
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

      {/* Patient Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold text-sm">IPD No</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
            value={ipdData.ipdNo || ''}
            readOnly
          />
        </div>
        <div>
          <label className="block font-semibold text-sm">Patient Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
            value={ipdData.patientName || ''}
            readOnly
          />
        </div>
        <div>
          <label className="block font-semibold text-sm">Discharge Reason</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
            value={disres}
            onChange={(e) => setDisres(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold text-sm">Discharge Date</label>
          <input
            type="date"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
            value={dischargeDate}
            onChange={(e) => setDischargeDate(e.target.value)}
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white p-2 rounded-lg shadow-md mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-200 text-sky-500">Service Name</th>
              <th className="px-4 py-2 border border-gray-200 text-sky-500">Rate</th>
              <th className="px-4 py-2 border border-gray-200 text-sky-500">Frequency</th>
              <th className="px-4 py-2 border border-gray-200 text-sky-500">Amount</th>
            </tr>
          </thead>
          <tbody>
            {serviceData.map((service) => {
              const index = ids.indexOf(service.serId);
              const freq = index !== -1 ? frequencies[index] : 0;
              const amount = service.serviceRate * freq;

              return (
                
                <tr key={service.serId}>
                  <td className="px-4 py-2 border border-gray-200 ">{service.serName}</td>
                  <td className="px-4 py-2 border border-gray-200 ">{service.rate}</td>
                  <td className="px-4 py-2 border border-gray-200 ">{service.frequency}</td>
                  <td className="px-4 py-2 border border-gray-200 ">{service.amount}</td>
                  {/* <td className="px-4 py-2 border border-gray-200 ">
                    <input
                      type="number"
                      className="w-full px-2 py-1 border rounded"
                      value={frequency}
                      onChange={(e) => handleFrequencyChange(service.serId, e.target.value)}
                    />
                  </td> */}
                  {/* <td className="border p-2">{amount.toFixed(2)}</td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Billing Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div>
          <label className="block font-semibold text-sm">Discount (%)</label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
            value={discounts.find(d => d.discountPercentage === selectedDiscount)?.discountId || 0}
            onChange={handleDiscountChange}
          >
            <option value={0}>Select Discount</option>
            {discounts.map((discount) => (
              <option 
                key={discount.discountId} 
                value={discount.discountId}
              >
                {discount.discountPercentage}% Discount
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold text-sm">GST (%)</label>
          {/* <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
            value={gst}
            onChange={(e) => setGst(parseFloat(e.target.value) || 0)}
          /> */}

          <select            
          className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
            value={gst}
            onChange={(e) => setGst(parseFloat(e.target.value))}>
               <option>Select GST</option>
            <option value={12}>12</option>
            <option value={15}>15</option>
            <option value={18}>18</option>
          </select>
        </div>
        <div>
  <label className="block font-semibold text-sm">Advance Paid</label>
  <input
    type="number"
    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm"
    value={paidAmount}
    readOnly
  />
</div>
      </div>

      {/* Summary */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Total Amount:</div>
          <div className="text-right">{totalAmount.toFixed(2)}</div>
          <div>Discount Amount:</div>
          <div className="text-right">{discountAmount.toFixed(2)}</div>
          <div>GST Amount:</div>
          <div className="text-right">{gstAmount.toFixed(2)}</div>
          <div>Payable Amount:</div>
          <div className="text-right">{payableAmount.toFixed(2)}</div>
          <div>Balance Amount:</div>
          <div className="text-right">{balanceAmount.toFixed(2)}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default withAuth(DischargePatientBil, ['SUPERADMIN', 'ADMIN', 'RECEPTION']);

