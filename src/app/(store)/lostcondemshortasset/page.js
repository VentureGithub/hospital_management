'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';

export function LostAssets() {
    return (
        <LayoutForm>
            <LostAssetsform />
        </LayoutForm>
    );
}

const LostAssetsform = () => {
    const [data, setData] = useState([]);
    const [item, setItem] = useState([]);
    const [floor, setFloor] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [inputs, setInputs] = useState({
        lostShortAssetId: 0,
        lostDate: "",
        itemGroup: "",
        itemId: 0,
        remark: "",
        lostCondem: "",
        lostQnty: 0,
        floorNo: 0,
        floorName: "",
        itemName: ""
    });


    // table
    const fetchApi = async () => {
        try {
            const response = await apiClient.get("LostCondem/getAllData");
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);




    const handleSupplierMaster = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                const response = await apiClient.put(
                    `supplyMaster/updateSupplierMaster`, // Fixed URL construction
                    inputs
                );
                if (response.status == 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false); // Reset edit state after update
                } else {
                    toast.error("Update failed! Please try again");
                }
            } else {
                // Save API call for new room type
                const response = await apiClient.post(
                    "LostCondem/saveData",
                    inputs
                );
                console.log(response.data.data)
                if (response.status == 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error("Save failed! Please try again");
                }
            }
            fetchApi();
            setInputs({
                lostShortAssetId: 0,
                lostDate: "",
                itemGroup: "",
                itemId: 0,
                remark: "",
                lostCondem: "",
                lostQnty: 0,
                floorNo: 0,
                floorName: "",
                itemName: ""
            });
        } catch (error) {
            console.error("Error handling :", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const handleUpdate = (lostShort) => {
        setInputs({
            lostShortAssetId: lostShort.lostShortAssetId,
            lostDate: lostShort.lostDate,
            itemGroup: lostShort.itemGroup,
            itemId: lostShort.itemId,
            remark: lostShort.remark,
            lostCondem: lostShort.lostCondem,
            lostQnty: lostShort.lostQnty,
            floorNo: lostShort.floorNo,
            floorName: lostShort.floorName,
            itemName: lostShort.itemName
        });
        setIsEdit(true);
    };

    //handle inputs
    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    };



  //get catagory all 
  const fetchItem = async () => {
    try {
        const response = await apiClient.get(`item/getAllItem`);
        console.log(response.data.data);
        setItem(response.data.data);
    } catch (error) {
        console.error("Error fetching data", error);
    }
};

useEffect(() => {
    fetchItem();
}, []);

const handleItem = (e) => {
    console.log(e.target.value);
    setInputs({ ...inputs, itemId: e.target.value })
};

  //get Floor all 
  const fetchFloor = async () => {
    try {
        const response = await apiClient.get(`PatientFloorNo/getFloor`);
        console.log(response.data.data);
        setFloor(response.data.data);
    } catch (error) {
        console.error("Error fetching data", error);
    }
};

useEffect(() => {
    fetchFloor();
}, []);

const handleFloor = (e) => {
    console.log(e.target.value);
    setInputs({ ...inputs, floorNo: e.target.value })
};



    return (
        <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
            <Heading headingText="Lost/Condem/Short Asset" />
            <div className="py-4">
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 m-2 ">
                        <div>
                            <label className="block text-gray-700 text-sm">Lost Date</label>
                            <input type="date"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none '

                                name="lostDate"
                                onChange={handleChange}
                                value={inputs.lostDate} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Item Group</label>
                            <select
                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                name="itemGroup"
                                onChange={handleChange}
                                value={inputs.itemGroup}>
                                <option value="select">--Select Item--</option>
                                <option value="Group A">Group A</option>
                                <option value="Group B">Group B</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">	Lost/Condem</label>
                            <select
                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                name="lostCondem"
                                onChange={handleChange}
                                value={inputs.lostCondem}>
                                <option value="select">--Select --</option>
                                <option value="Lost">Lost</option>
                                <option value="Condem">Condem</option>
                                <option value="Short">Short</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Floor Name</label>
                            <select onChange={handleFloor} className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none">
                                <option>select floor Name</option>
                                {floor?.map((floor ,index) => (
                                    <option key={index} value={floor.floorNo} >{floor.floorName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Return Type </label>
                            <select
                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                name="leaderCategory"
                                onChange={handleChange}
                                value={inputs.leaderCategory}>
                                <option value="select">--Select Return--</option>
                                <option value="Return">Return</option>
                                <option value="Damage">Damage</option>
                                <option value="Dirty Return">Dirty Return</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 text-sm">Item Name</label>
                            <select onChange={handleItem} className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none">
                                <option>select item Name</option>
                                {item?.map((item ,index) => (
                                    <option key={index} value={item.itemId} >{item.itemName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Lost Qty</label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none '
                                name="lostQnty"
                                onChange={handleChange}
                                value={inputs.lostQnty} />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Remark</label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none '

                                name="remark"
                                onChange={handleChange}
                                value={inputs.remark} />
                        </div>
                       
                        
                  
                    </div>
                    <div className="flex justify-start  w-full space-x-4 p-2 my-4">
                        <button className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900">Refresh</button>
                        <button
                            className="bg-green-600 text-white px-4 text-sm py-2 rounded-lg hover:bg-green-900"
                            onClick={handleSupplierMaster}
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="bg-white p-2 my-2 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Item Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Lost/Condemn</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Floor Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Quantity</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr
                                            key={index}
                                            className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button className="text-blue-400 hover:text-blue-800 flex items-center"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.itemName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.lostCondem}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.floorName}</td>

                                            <td className="px-4 py-3 border border-gray-200">{transaction.lostQnty}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.remark}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">No data available</td>
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

export default withAuth(LostAssets, ['DOCTOR', 'ADMIN', 'SUPERADMIN'])

