'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";
import { toast } from 'sonner';

export function BloodSugarStripPurchase() {
  return (
    <LayoutForm>
      <BloodSugarStripPurchaseform />
    </LayoutForm>
  );
}

const BloodSugarStripPurchaseform = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState([]);
  const [inputs, setInputs] = useState({
    purchaseNo: 0,
    purchaseDate: "",     // YYYY-MM-DD
    supplierName: "",
    noOfStrip: 0,
    amount: 0,
    remark: "",
    rate: 0
  });

  const fetchApi = async () => {
    try {
      const response = await apiClient.get(`sugarStrip/getAllSugarStrip`);
      setData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const handleBlood = async (e) => {
    e.preventDefault();
    try {
      // Build payload matching API
      const payload = {
        purchaseNo: inputs.purchaseNo || 0,
        purchaseDate: inputs.purchaseDate || null,
        supplierName: inputs.supplierName || "",
        noOfStrip: Number(inputs.noOfStrip) || 0,
        amount: Number(inputs.amount) || 0,
        remark: inputs.remark || "",
        rate: Number(inputs.rate) || 0
      };

      let response;
      if (isEdit) {
        // PUT to updateSugarStrip
        response = await apiClient.put(`sugarStrip/updateSugarStrip`, payload);
        if (response.status === 200) {
          toast.success("Data updated successfully");
          setIsEdit(false);
        } else {
          toast.error("Update failed! Please try again");
        }
      } else {
        // POST to saveSugarStrip
        response = await apiClient.post(`sugarStrip/saveSugarStrip`, payload);
        if (response.status === 200) {
          toast.success("Data saved successfully");
        } else {
          toast.error("Save failed! Please try again");
        }
      }

      await fetchApi();
      resetInputs();
    } catch (error) {
      console.error("Error handling sugar strip:", error);
      const msg = error?.response?.data ?? error.message;
      toast.error(`An error occurred: ${JSON.stringify(msg)}`);
    }
  };

  const handleUpdate = (bloodPurchase) => {
    setInputs({
      purchaseNo: bloodPurchase.purchaseNo ?? 0,
      // API may return null purchaseDate; convert to YYYY-MM-DD or empty string
      purchaseDate: bloodPurchase.purchaseDate ? bloodPurchase.purchaseDate.split('T')[0] : "",
      supplierName: bloodPurchase.supplierName ?? "",
      noOfStrip: bloodPurchase.noOfStrip ?? 0,
      amount: bloodPurchase.amount ?? 0,
      remark: bloodPurchase.remark ?? "",
      rate: bloodPurchase.rate ?? 0
    });
    setIsEdit(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setInputs(prev => {
      const next = {
        ...prev,
        [name]: name === 'noOfStrip' || name === 'amount' ? (value === "" ? "" : Number(value)) : value
      };

      // recalc rate as amount * noOfStrip (based on API examples you provided)
      if (name === "noOfStrip" || name === "amount") {
        const noOfStrip = Number(next.noOfStrip) || 0;
        const amount = Number(next.amount) || 0;
        next.rate = noOfStrip && amount ? amount * noOfStrip : 0;
      }

      return next;
    });
  };

  const resetInputs = () => {
    setInputs({
      purchaseNo: 0,
      purchaseDate: "",
      supplierName: "",
      noOfStrip: 0,
      amount: 0,
      remark: "",
      rate: 0
    });
    setIsEdit(false);
  };

  return (
    <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
      <Heading headingText="Blood Sugar Strip Purchase" />
      <div className="py-4">
        <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]' onSubmit={handleBlood}>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2 m-2 ">
            <div>
              <label className="block text-sm">Pur. Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                name="purchaseDate"
                onChange={handleChange}
                value={inputs.purchaseDate}
              />
            </div>

            <div>
              <label className="block text-sm">Supplier Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                name="supplierName"
                onChange={handleChange}
                value={inputs.supplierName}
              />
            </div>

            <div>
              <label className="block text-sm">Remark </label>
              <input
                type="text"
                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                name="remark"
                onChange={handleChange}
                value={inputs.remark}
              />
            </div>

            <div>
              <label className="block text-sm">No. of Strip </label>
              <input
                type="number"
                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                name="noOfStrip"
                onChange={handleChange}
                value={inputs.noOfStrip}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm">Amount </label>
              <input
                type="number"
                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                name="amount"
                onChange={handleChange}
                value={inputs.amount}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm">Rate</label>
              <input
                type="text"
                className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none"
                name="rate"
                value={inputs.rate}
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-start w-full space-x-4 p-2">
            <button
              className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900"
              type="button"
              onClick={fetchApi}
            >
              Refresh
            </button>
            <button
              className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
              type="submit"
            >
              {isEdit ? "Update" : "Save"}
            </button>
            <button
              className="bg-white text-sm px-4 py-2 rounded-lg border"
              type="button"
              onClick={resetInputs}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-2 my-2 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="table-auto w-full border border-collapse shadow">
              <thead>
                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">No. of Strip</th>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">Amount</th>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">Rate</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((transaction, index) => (
                    <tr key={transaction.purchaseNo ?? index} className="border border-gray-200 text-center">
                      <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                        <button
                          className="text-blue-500 hover:text-blue-700 flex items-center"
                          onClick={() => handleUpdate(transaction)}
                        >
                          <FaPencilAlt className="mr-1" />
                        </button>
                      </td>
                      <td className="px-4 py-3 border border-gray-200">{transaction.noOfStrip}</td>
                      <td className="px-4 py-3 border border-gray-200">{transaction.amount}</td>
                      <td className="px-4 py-3 border border-gray-200">{transaction.rate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(BloodSugarStripPurchase, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
