'use client';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import { toast } from 'sonner';
import withAuth from '@/app/(components)/WithAuth';

export function IssueAssets() {
    return (
        <LayoutForm>
            <IssueAssetsForm />
        </LayoutForm>
    );
}

const IssueAssetsForm = () => {
    const [data, setData] = useState([]);
    const [items, setItems] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [options, setOptions] = useState([]);
    const [inputs, setInputs] = useState({
        issueId: 0,
        issueDate: "",
        itemGroup: "",
        itemId: 0,
        itemName: "",
        issueTo: "select",
        avilQty: 0,
        issueQty: 0,
        selectedOption: "", // New state to hold selected option from second dropdown
        floorNo:"",
        empCode:""
    });

    // Fetch all issue assets
    const fetchApi = async () => {
        try {
            const response = await apiClient.get("IssueAssets/getAllIssueAssets");
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    // Handle form submission
    const handleSupplierMaster = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!inputs.issueDate || !inputs.itemGroup || !inputs.issueTo || !inputs.selectedOption) {
            toast.error("Please fill all required fields");
            return;
        }
    
        try {
            const dataToSend = {
                ...inputs,
                // Ensure proper values are set based on issueTo selection
                floorNo: inputs.issueTo === 'Floor' ? inputs.selectedOption : 0,
                empCode: inputs.issueTo === 'Person' ? inputs.selectedOption : 0,
                issueId: isEdit ? inputs.issueId : 0
            };
    
            const response = isEdit
                ? await apiClient.put(`IssueAssets/updateAssets`, dataToSend)
                : await apiClient.post("IssueAssets/saveIssueAssets", dataToSend);
    
            if (response.status === (isEdit ? 200 : 201)) {
                toast.success(`${isEdit ? "Data updated" : "Data saved"} successfully`);
                setIsEdit(false);
                fetchApi();
                resetForm();
            } else {
                toast.error("Operation failed! Please try again");
            }
        } catch (error) {
            console.error("Error handling:", error);
            toast.error("An error occurred. Please try again.");
        }
    };
    

    const handleUpdate = (issue) => {
        setInputs({
            ...issue,
            selectedOption: issue.floorNo || issue.empCode // Set the correct selected option
        });
        setIsEdit(true);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'selectedOption') {
            if (inputs.issueTo === 'Floor') {
                setInputs(prev => ({
                    ...prev,
                    floorNo: value,
                    empCode: "0", // Set empCode to "0" when floor is selected
                    selectedOption: value
                }));
            } else if (inputs.issueTo === 'Person') {
                setInputs(prev => ({
                    ...prev,
                    empCode: value,
                    floorNo: "0", // Set floorNo to "0" when person is selected
                    selectedOption: value
                }));
            }
        } else if (name === 'issueTo') {
            setInputs(prev => ({
                ...prev,
                issueTo: value,
                selectedOption: '',
                floorNo: "0",  // Initialize with "0"
                empCode: "0"   // Initialize with "0"
            }));
        } else {
            setInputs(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };


    const resetForm = () => {
        setInputs({
            issueId: 0,
            issueDate: "",
            itemGroup: "",
            itemId: 0,
            itemName: "",
            issueTo: "select",
            avilQty: 0,
            issueQty: 0,
            selectedOption: "",
            floorNo: "",
            empCode: ""
        });
        setOptions([]);
    };

    // Fetch item categories
    const fetchItems = async () => {
        try {
            const response = await apiClient.get(`item/getAllItem`);
            setItems(response.data.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Fetch options based on "Issue To"
    useEffect(() => {
        const fetchData = async () => {
            if (inputs.issueTo === 'Floor') {
                try {
                    const response = await apiClient.get('PatientFloorNo/getFloor');
                    setOptions(response.data.data || []); // Assuming response.data.data contains the array of floors
                } catch (error) {
                    console.error("Error fetching floors:", error);
                }
            } else if (inputs.issueTo === 'Person') {
                try {
                    const response = await apiClient.get('emp/getAllEmployee');
                    setOptions(response.data.data || []); // Assuming response.data.data contains the array of employees
                } catch (error) {
                    console.error("Error fetching employees:", error);
                }
            } else {
                setOptions([]); // Clear options if "select" is chosen
            }
        };

        fetchData();
    }, [inputs.issueTo]);

    return (
        <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
            <Heading headingText="Issue Assets" />
            <div className="py-4">
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]' onSubmit={handleSupplierMaster}>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 m-2 ">
                        {/* <div>
                            <label className="block text-gray-700 text-sm">Issue Id</label>
                            <input type="text" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' name="issueId" onChange={handleChange} value={inputs.issueId} />
                        </div> */}
                        <div>
                            <label className="block text-gray-700 text-sm">Issue Date</label>
                            <input type="date" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm ' name="issueDate" onChange={handleChange} value={inputs.issueDate} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Item Group</label>
                            <select className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm" name="itemGroup" onChange={handleChange} value={inputs.itemGroup}>
                                <option value="select">--Select Item--</option>
                                <option value="Group A">Group A</option>
                                <option value="Group B">Group B</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Issue To</label>
                            <select className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none" name="issueTo" onChange={handleChange} value={inputs.issueTo}>
                                <option value="select">--Select Issue--</option>
                                <option value="Floor">Floor</option>
                                <option value="Person">Person</option>
                            </select>
                        </div>

                        <div className="flex justify-end items-end">
                            <select
                                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none"
                                name="selectedOption"
                                onChange={handleChange}
                                disabled={inputs.issueTo === 'select'}
                            >
                                <option value="">--Select--</option>
                              {options.map((option, index) => (
  <option key={index} value={option.floorNo || option.empCode}>
    {option.floorName || option.empName}
  </option>
))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Item Name</label>
                            <select onChange={handleChange} name="itemId" className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none">
                                <option value="">Select Item Name</option>
                                {items.map((item) => (
                                    <option key={item.itemId} value={item.itemId}>{item.itemName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Available Quantity</label>
                            <input type="text" className='w-full px-4 text-sm py-2 border rounded-lg focus:outline-none ' name="avilQty" onChange={handleChange} value={inputs.avilQty} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Issue Quantity</label>
                            <input type="text" className='w-full px-4 text-sm py-2 border rounded-lg focus:outline-none ' name="issueQty" onChange={handleChange} value={inputs.issueQty} />
                        </div>
                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2 my-4 ">
                        <button type="button" className="bg-gray-600 text-sm text-white px-6 py-2 rounded-lg hover:bg-gray-900">Refresh</button>
                        <button type="submit" className="bg-green-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-green-900">
                            {isEdit ? "Update" : "Save"}
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
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Item Group</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Item Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Floor No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Issue Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button className="text-blue-400 hover:text-blue-800 flex items-center" onClick={() => handleUpdate(transaction)}>
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.itemGroup}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.itemName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.floorNo}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.issueQty}</td>
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
                </div>
            </div>

        </div>
    );
};

export default withAuth(IssueAssets, ['DOCTOR', 'ADMIN', 'SUPERADMIN']);
