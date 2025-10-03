
'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { BaseUrl } from "@/app/config";
import Swal from "sweetalert2";

export function TestBooking() {
    return (
        <LayoutForm>
            <TestBookingform />
        </LayoutForm>
    );
}


const TestBookingform = () => {
    const [allIpdData, setAllIpdData] = useState([])
    const [ipdPatient, setIpdPatient] = useState([])
    const [categoryData, setCategoryData] = useState({})
    const [allTest, setAllTest] = useState([])
    const [selectedTest, setSelectedTest] = useState({})
    const [charge, setCharge] = useState([])
    const [tests, setTests] = useState([]);
    const [data, setData] = useState([]);
    const [dataa, setDataa] = useState([]);
    const [ipd, setIpd] = useState("")
    const [inputs, setInputs] = useState({
        testBookId: 0,
        ipdNo: "",
        testId: 0,
        totalAmnt: 0,
        discount: 0,
        netAmnt: 0,
        paid: 0,
        discountReason: "",
        balance: 0,
        refund: 0,
        narration: "",
        cashType: "",
        recIncBank: "",
        payeeBank: "",
        txnNo: "",
        testPrice: 0,
        testName: "",

    });

    const handleSave = async (e) => {
        e.preventDefault();
        const testIds = tests.map(test => test.testId);
        console.log("test id", testIds)
        const data = {
            ipdNo: inputs.ipdNo,
            paybleAmnt: payableAmount,
            totalAmnt: totalAmount,
            discount: discountPercent,
            discountReason: inputs.discountReason,
            testId: testIds,
            voucherNo: "",
            voucherDate: ""
        }
        console.log("data to be save", data)

        const response = await apiClient.post(`test/book`, data)
        console.log("response by save", response.data.data)
        if (response.status === 200) {
            alert("data is saved successfully")
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    };

    const handleChange1 = (e) => {
        console.log(e.target.value);
        setInputs({ ...inputs, testCategoryId: e.target.value })
    };


    const fetchGetAllIpd = async () => {
        const response = await apiClient.get(`ipdregistration/getAllRegistration`)
        console.log("responseIpd", response.data.data)
        setAllIpdData(response.data.data)
    }


    const handleChangeIpdOpd = (event) => {
        const handleEvent = event.target.value
        console.log("hello", handleEvent)
        if (handleEvent === 'ipd') {
            fetchGetAllIpd();
        }
        else {
            console.log("hello")
        }
    }

    const fetchAllCategory = async () => {
        const response = await apiClient.get(`testCatagory/getTest/catagory`)
        if (response.status === 200) {
            console.log("response", response.data.data)
            setCategoryData(response?.data?.data)

        }

    }

    const fetchIpdDetail = async (id) => {
        const response = await apiClient.get(`ipdregistration/getbyipdNo?ipdNo=${id}`)
        console.log("response ipd patient", response.data.data)
        if (response.status === 200) {
            setIpdPatient(response.data.data)
            fetchAllCategory();
        }


    }
    const handleChangeAllIpd = (event) => {
        console.log(event.target.value)
        const id = event.target.value
        setInputs({ ...inputs, ipdNo: event.target.value })
        setIpd(id)
        fetchIpdDetail(id)

    }

    const handleTest = async (id) => {
        const response = await apiClient.get(`testmaster/getBy/catagoryId?catagorayId=${id}`)
        console.log("response", response.data.data)
        if (response.status === 200) {
            setAllTest(response.data.data)
        }
    }

    useEffect(() => {
      handleTest();
},[])
    

    const handleChangeCateg = (event) => {
        console.log("hello")
        console.log(event.target.value)
        const handleEvent = event.target.value
        handleTest(handleEvent)

    }



    const fetchByTestId = async (id) => {
        try {
            const response = await apiClient.get(`testmaster/gettestmasterByTestId?testId=${id}`);

            if (response.status === 200) {
                setCharge(response?.data?.data?.testPrice)
                setSelectedTest(response?.data?.data?.testId)
            }
        } catch (error) {
            console.error('Error fetching test data:', error);
            setCharge(0); // Reset charge on error
        }
    };

    const handleChangeTest = (event) => {
        console.log(event.target.value)
        const id = event.target.value
        fetchByTestId(id)
    }


    const handleAdd = async (id) => {
        try {
            const response = await apiClient.get(`testmaster/gettestmasterByTestId?testId=${id}`)
            setTests((prevTests) => [...prevTests, response.data.data]); // Add new test to the array
        } catch (error) {
            console.error('Error during API call:', error);
        }
    };

    const totalAmount = Array.isArray(tests) && tests.length > 0
        ? tests.reduce((acc, transaction) => acc + parseFloat(transaction.testPrice), 0)
        : 0;

    // Discount state (initially 0%)
    const [discountPercent, setDiscountPercent] = useState(0);

    // Handle discount percentage input change
    const handleDiscountChange = (e) => {
        const value = e.target.value;
        setDiscountPercent(value ? parseFloat(value) : 0);
    };

    // Calculate discount and payable amount based on user input
    const discountAmount = (totalAmount * discountPercent) / 100;
    const payableAmount = totalAmount - discountAmount;


    const handleDownload = async (ipdNo) => {
        console.log("ipd", ipdNo);
        try {
            const response = await apiClient.get(`test/generateTestBookingRecipit`, {
                params: { ipdNo },
                responseType: 'blob',
            });

            console.log('Response:', response); // Log the entire response

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `TestBooking${ipdNo}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('Failed to download Test Booking:', response.status);
                alert("Failed to download Test Booking. Please try again.");
            }
        } catch (error) {
            console.error('Error downloading the Test Booking:', error);
            alert("An error occurred while downloading the Test Booking. Please try again.");
        }
    };




    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
            <Heading headingText="Test Booking " />
            <div className='py-4'>
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-2 ">
                        <div>
                            <label className="block text-gray-700">Vou. No.</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none '
                                placeholder="voucher No"
                                name="voucherNo"
                                onChange={handleChange}
                                value={inputs.voucherNo} />
                        </div>
                        <div>
                            <label className="block text-gray-700">Vou. Date</label>
                            <input type="date"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none '
                                placeholder="Gaurdian name"
                                name="voucherDate"
                                onChange={handleChange}
                                value={inputs.voucherDate} />
                        </div>
                        <div>
                            <label className="block text-gray-700">Walk In</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                // name=""
                                onChange={handleChangeIpdOpd}
                            // value={inputs.}
                            >
                                <option>select an option</option>
                                <option value="opd" >OPD</option>
                                <option value="ipd" >IPD</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700">OPD/IPD</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                onChange={handleChangeAllIpd}
                            >
                                <option>Select an option</option>
                                {allIpdData.map((data,index) => (
                                    <option  key={index} value={data.ipdNo}>{data.ipdNo}</option>
                                ))}

                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700">Name</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none '
                                placeholder="Name"
                                // name=""
                                onChange={handleChange}
                                value={ipdPatient.patientName}
                                readOnly
                            // value={inputs.voucherDate} 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Age</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none '
                                placeholder="Age"
                                // name=""
                                onChange={handleChange}
                                value={ipdPatient.age}
                            // value={inputs.voucherDate} 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Gender</label>
<select
  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
  onChange={handleChange}
  name="gender"
  value={ipdPatient.gender}
>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Other">Other</option>
</select>
                        </div>
                        <div>
                            <label className="block text-gray-700">Guardian Name<span className='font-bold text-red-500'> *</span></label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none '
                                placeholder="Guardian name"
                                name="fatherName"
                                onChange={handleChange}
                                value={ipdPatient.fatherName} />
                        </div>
                        <div>
                            <label className="block text-gray-700">Marital Status<span className='font-bold text-red-500'> *</span></label>
                            <select type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none '
                                placeholder="Marital Status"
                               
                                onChange={handleChange}
                                value={ipdPatient.maritalStatus}
                          
                            >

                              <option value="">Select Status</option>
  <option value="Male">Married</option>
  <option value="Female">Unmarried</option>

</select>
                        </div>


                        <div>
                            <label className="block text-gray-700">Address</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none'
                                placeholder="Address"
                                name="address"
                                onChange={handleChange}
                                value={ipdPatient.address} />
                        </div>
                        <div>
                            <label className="block text-gray-700">Consultant Dr</label>
                            <select type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none'
                                placeholder="Dr."
                                onChange={handleChange}
                                value={ipdPatient.drName}
                            
                            />
                        
                        </div>

                    </div>
                    <h1 className="p-3 font-bold text-3xl text-sky-500">Detail</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-2 ">
                        <div>
                            <label className="block text-gray-700">Category</label>
                            <select onChange={handleChangeCateg} className="w-full px-4 py-2 border rounded-lg focus:outline-none">
                                <option>select an option</option>

                                {Array.isArray(categoryData) && categoryData.length > 0 ? (
                                    categoryData.map((dataa) => (
                                        <option key={dataa.categoryId} value={dataa.categoryId}>
                                            {dataa.categoryName}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No categories available</option>
                                )}
                            </select>

                        </div>
                        <div>
                            <label className="block text-gray-700 ">Test Name </label>
                            <select onChange={handleChangeTest} className="w-full px-4 py-2 border rounded-lg focus:outline-none">
                                <option>select an option</option>
                                {Array.isArray(allTest) && allTest.length > 0 ? (
                                    allTest.map((dataa) => (

                                        <option key={dataa.testId} value={dataa.testId}>
                                            {dataa.testName}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No categories available</option>
                                )}
                            </select>
                        </div>


                        <div>
                            <label className="block text-gray-700">Charge</label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none'
                                placeholder="Charge"
                                name=""
                                onChange={handleChange}
                                value={charge} />
                        </div>



                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2">

                        <button
                            type="button" // Prevents the default form submission
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900"
                            onClick={() => handleAdd(selectedTest)}
                        >
                            Add
                        </button>
                    </div>

                </form>
            </div>
            <div className="bg-white p-2 m-4 md:p-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Category Name</th>

                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Test Id</th>

                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Test Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(tests) && tests.length > 0 ? (
                                    tests.map((transaction, index) => (
                                        <tr
                                            key={index}
                                            className="border border-gray-200 text-center"
                                        >
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.testCategoryName}</td>

                                            <td className="px-4 py-3 border border-gray-200">{transaction.testId}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.testName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.testPrice}</td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Discount Input and Total Calculation Section */}
                    <div className="text-right font-bold px-4 py-3">
                        <div>
                            Amount: ₹{totalAmount.toFixed(2)}
                        </div>

                        {/* Input for dynamic discount */}
                        <div className="mt-2">
                            <label htmlFor="discount" className="mr-2 outline-none">Discount %:</label>
                            <input

                                id="discount"
                                value={discountPercent}
                                onChange={handleDiscountChange}
                                className="border outline-none px-2 py-1"
                                min="0"
                                max="100"
                                placeholder="Enter discount %"
                            />
                        </div>
                        <div className="mt-2">
                            <label className="mr-2 outline-none">Discount Reason:</label>
                            <input

                                type="text"

                                className="border outline-none px-2 py-1"

                                placeholder="Discount Reason"
                                value={inputs.discountReason}
                                onChange={(e) => setInputs({ ...inputs, discountReason: e.target.value })}
                            />
                        </div>

                        <div className="mt-2">
                            Discount Amount: ₹{discountAmount.toFixed(2)}
                        </div>
                        <div className="mt-2">
                            Payable Amount: ₹{payableAmount.toFixed(2)}
                        </div>
                        <button
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-900"
                            type="button"
                            onClick={() => handleDownload(ipd)}
                        >
                            Print
                        </button>
                        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900 ml-2" type="button" onClick={handleSave}>Save</button>

                    </div>
                </div>
            </div>

            <p className="text-red-600 font-medium">Note: A master could not be delete if used anywhere</p>
        </div>
    );
};



export default withAuth(TestBooking, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])
