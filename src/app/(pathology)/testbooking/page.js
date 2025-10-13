'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import Swal from "sweetalert2";

export function TestBooking() {
  return (
    <LayoutForm>
      <TestBookingForm />
    </LayoutForm>
  );
}

const TestBookingForm = () => {
  const [inputs, setInputs] = useState({
    testVoucherNo: "",
    ipdNo: "",
    opdNo: "",
    testCategoryId: "",
    testId: "",
    testDate: new Date().toISOString().split("T")[0],
  });

  const [allBookings, setAllBookings] = useState([]);
  const [testDetails, setTestDetails] = useState(null);
  const [voucherData, setVoucherData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🧠 Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  // 🧾 Fetch all booked tests
  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("test/getAll/BookTest");
      if (res.status === 200) {
        setAllBookings(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching test bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Fetch test details by Voucher Number
  const fetchByVoucher = async () => {
    if (!inputs.testVoucherNo) return Swal.fire("Error", "Enter Voucher Number", "warning");
    try {
      setLoading(true);
      const res = await apiClient.get(`test/getByVoucherNo?testVoucherNo=${inputs.testVoucherNo}`);
      if (res.status === 200) setVoucherData(res.data.data);
    } catch (error) {
      Swal.fire("Error", "Voucher not found", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🧑‍⚕️ Fetch tests by IPD/OPD Number
  const fetchByIpdOpd = async () => {
    if (!inputs.ipdNo && !inputs.opdNo)
      return Swal.fire("Error", "Enter IPD or OPD Number", "warning");
    try {
      setLoading(true);
      const res = await apiClient.get(
        `test/getByIpdOrOpdNumber?ipdNo=${inputs.ipdNo}&opdNo=${inputs.opdNo}`
      );
      if (res.status === 200) setTestDetails(res.data.data);
    } catch (error) {
      Swal.fire("Error", "Patient record not found", "error");
    } finally {
      setLoading(false);
    }
  };

  // 💾 Save test booking
  const handleSave = async () => {
    if (!inputs.ipdNo && !inputs.opdNo)
      return Swal.fire("Error", "Enter IPD or OPD Number", "warning");

    const payload = [
      {
        testBookId: 0,
        ipdNo: inputs.ipdNo,
        opdNo: inputs.opdNo,
        testCategoryId: Number(inputs.testCategoryId),
        testId: Number(inputs.testId),
        testVoucherNo: inputs.testVoucherNo || `TV-${Date.now()}`,
        testDate: inputs.testDate,
      },
    ];

    try {
      setLoading(true);
      const res = await apiClient.post("test/book", payload);
      if (res.status === 200) {
        Swal.fire("Success", "Test booked successfully!", "success");
        fetchAllBookings();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to book test", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Generate and Download PDF Receipt
  const handleDownload = async () => {
    if (!inputs.testVoucherNo)
      return Swal.fire("Error", "Enter Voucher Number", "warning");

    try {
      const response = await apiClient.get(
        `test/generateTestBookingRecipit?testVoucherNo=${inputs.testVoucherNo}`,
        { responseType: "blob" }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: response.headers["content-type"] });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `TestBooking_${inputs.testVoucherNo}.pdf`;
        link.click();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to generate receipt", "error");
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  return (
    <div className="p-6 bg-gray-50 rounded-md shadow-xl">
      <Heading headingText="Test Booking Management" />

      {/* 🧾 Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <input
          type="text"
          name="testVoucherNo"
          value={inputs.testVoucherNo}
          onChange={handleChange}
          placeholder="Enter Voucher No"
          className="border px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-sky-400 outline-none"
        />
        <input
          type="text"
          name="ipdNo"
          value={inputs.ipdNo}
          onChange={handleChange}
          placeholder="Enter IPD No"
          className="border px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-sky-400 outline-none"
        />
        <input
          type="text"
          name="opdNo"
          value={inputs.opdNo}
          onChange={handleChange}
          placeholder="Enter OPD No"
          className="border px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-sky-400 outline-none"
        />
        <input
          type="number"
          name="testCategoryId"
          value={inputs.testCategoryId}
          onChange={handleChange}
          placeholder="Test Category ID"
          className="border px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-sky-400 outline-none"
        />
        <input
          type="number"
          name="testId"
          value={inputs.testId}
          onChange={handleChange}
          placeholder="Test ID"
          className="border px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-sky-400 outline-none"
        />
        <input
          type="date"
          name="testDate"
          value={inputs.testDate}
          onChange={handleChange}
          className="border px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-sky-400 outline-none"
        />
      </div>

      {/* 🔘 Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition"
        >
          Save Booking
        </button>
        <button
          onClick={fetchByVoucher}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Get by Voucher
        </button>
        <button
          onClick={fetchByIpdOpd}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition"
        >
          Get by IPD/OPD
        </button>
        <button
          onClick={handleDownload}
          className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition"
        >
          Download Receipt
        </button>
      </div>

      {/* 🧾 All Bookings Table */}
      <div className="mt-10 bg-white rounded-md shadow overflow-x-auto">
        <h2 className="text-xl font-semibold text-sky-500 px-4 pt-4">All Test Bookings</h2>
        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : (
          <table className="w-full border border-collapse mt-3">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 border">Voucher No</th>
                <th className="p-3 border">IPD No</th>
                <th className="p-3 border">OPD No</th>
                <th className="p-3 border">Test ID</th>
                <th className="p-3 border">Category ID</th>
                <th className="p-3 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(allBookings) && allBookings.length > 0 ? (
                allBookings.map((item, index) => (
                  <tr key={index} className="text-center hover:bg-gray-50">
                    <td className="p-3 border">{item.testVoucherNo}</td>
                    <td className="p-3 border">{item.ipdNo || "--"}</td>
                    <td className="p-3 border">{item.opdNo || "--"}</td>
                    <td className="p-3 border">{item.testId}</td>
                    <td className="p-3 border">{item.testCategoryId}</td>
                    <td className="p-3 border">{item.testDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-red-600 text-sm mt-3">
        Note: Once a test is booked, it cannot be deleted if used elsewhere.
      </p>
    </div>
  );
};

export default withAuth(TestBooking, ['SUPERADMIN', 'ADMIN', 'DOCTOR']);
