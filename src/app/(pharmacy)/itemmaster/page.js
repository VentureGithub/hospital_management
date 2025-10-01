'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { BaseUrl } from "@/app/config";
import { toast } from 'sonner';
import { useState, useEffect } from "react";


export function ItemMaster() {
    return (
        <LayoutForm>
            <ItemMasterform />
        </LayoutForm>
    );
}

const ItemMasterform = () => {

    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState([]);
    const [category, setCategory] = useState([]);
    const [company, setCompany] = useState([]);
    const [hsn, setHSN] = useState([]);
    const [tax, setTax] = useState([]);
    const [inputs, setInputs] = useState({
        medicineId: 0,
        categoryName: "",
        companyName: "",
        medicineName: "",
        companyId: 0,
        medicineCategoryId: 0,
        purcaseDate: "",
        itmeStatus: true,
        rackNoString: "",
        hsnIdLong: 0,
        hsnCodeString: "",
        taxSlab: 0,
        conversion: "",
        mrp: 0,
        purchaseRate: 0,
        costPerPcs: 0,
        reOrderQty: 0,
        maxQty: 0,
        discountApplicable: "",
        itemDisc1: 0,
        itemDisc2: 0,
        maxDisc: 0,
        minMargin: 0
    });


    // Fetch all room types
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`PharmacyMedicine/getAllItemName`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);


    // Handle saving or updating the room type
    const handleOpening = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                // Corrected Update API call with room id
                const response = await apiClient.put(
                    `PharmacyMedicine/updateData`, // Fixed URL construction
                    inputs
                );
                if (response.status === 200) {
                    toast.success("Data updated successfully");
                    setIsEdit(false); // Reset edit state after update
                } else {
                    toast.error("Update failed! Please try again");
                }
            } else {
                // Save API call for new room type
                const response = await apiClient.post(
                    `PharmacyMedicine/saveData`,
                    inputs
                );
                if (response.status === 200) {
                    toast.success("Data saved successfully");
                } else {
                    toast.error("Save failed! Please try again");
                }
            }
            fetchApi(); // Refresh the list of room types after save or update
            setInputs({
                medicineId: 0,
                categoryName: "",
                companyName: "",
                medicineName: "",
                companyId: 0,
                medicineCategoryId: 0,
                purcaseDate: "",
                itmeStatus: true,
                rackNoString: "",
                hsnIdLong: 0,
                hsnCodeString: "",
                taxSlab: 0,
                conversion: "",
                mrp: 0,
                purchaseRate: 0,
                costPerPcs: 0,
                reOrderQty: 0,
                maxQty: 0,
                discountApplicable: "",
                itemDisc1: 0,
                itemDisc2: 0,
                maxDisc: 0,
                minMargin: 0
            });
        } catch (error) {
            console.error("Error handling room type:", error);
            toast.error("An error occurred. Please try again.");
        }
    };


    // Set the form fields for editing a room type
    const handleUpdate = (item) => {
        setInputs({
            medicineId: item.medicineId,
            categoryName: item.categoryName,
            companyName: item.companyName,
            medicineName: item.medicineName,
            companyId: item.companyId,
            medicineCategoryId: item.medicineCategoryId,
            purcaseDate: item.purcaseDate,
            itmeStatus: item.itmeStatus,
            rackNoString: item.rackNoString,
            hsnIdLong: item.hsnIdLong,
            hsnCodeString: item.hsnCodeString,
            taxSlab: item.taxSlab,
            conversion: item.conversion,
            mrp: item.mrp,
            purchaseRate: item.purchaseRate,
            costPerPcs: item.costPerPcs,
            reOrderQty: item.reOrderQty,
            maxQty: item.maxQty,
            discountApplicable: item.discountApplicable,
            itemDisc1: item.itemDisc1,
            itemDisc2: item.itemDisc2,
            maxDisc: item.maxDisc,
            minMargin: item.minMargin
        });
        setIsEdit(true);
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };



    const fetchCategory = async () => {
        const response = await apiClient.get(`mediceneCategory/getAllDataSimple`)
        if (response.status === 200) {
            setCategory(response.data.data)
        }
    }

    const handleCategory = (e) => {
        const id = e.target.value
        setInputs({ ...inputs, medicineCategoryId: id })
    }

    const fetchCompany = async () => {
        const response = await apiClient.get(`compny/getAllCompnyName`)
        if (response.status === 200) {
            setCompany(response.data.data)
        }
    }

    const handleCompany = (e) => {
        const id = e.target.value
        setInputs({ ...inputs, companyId: id })
    }

    const fetchHSN = async () => {
        const response = await apiClient.get(`hsnMaster/getAllData`)
        if (response.status === 200) {
            setHSN(response.data.data)
        }
    }

    const handleHSN = (e) => {
        const id = e.target.value
        setInputs({ ...inputs, hsnIdLong: id })
    }

    const fetchTax = async () => {
        const response = await apiClient.get(`tax/getAllTax`)
        if (response.status === 200) {
            setTax(response.data.data)
        }
    }

    const handleTax = (e) => {
        const id = e.target.value
        setInputs({ ...inputs, taxId: id })
    }


    useEffect(() => {
        fetchCategory();
        fetchCompany();
        fetchHSN();
        fetchTax();
    }, []);

    return (
        <div className='p-4 bg-gray-50 mt-6 ml-6  rounded-md shadow-xl'>
              <Heading headingText="Item Master" />
            <div className='py-4'>
                <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 m-2 ">


                        <div>
                            <label className="block text-gray-700 text-sm">Item status </label>
                            <select
                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                name="itmeStatus"
                                onChange={handleChange}
                                value={inputs.itmeStatus}>
                                <option value="">Select option</option>
                                <option value="true">Continue</option>
                                <option value="false">Closed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Item Name </label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="medicineName"
                                onChange={handleChange}
                                value={inputs.medicineName}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Category Name </label>
                            {/* <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none'
                                name="saltNameString"
                                onChange={handleChange}
                                value={inputs.saltNameString}
                            /> */}
                            <select onChange={handleCategory} className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none">
                                <option >select  Category</option>
                                {category?.map((Category) => (
                                    <option value={Category.medicineCategoryId}>{Category.categoryName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Company Name </label>
                            {/* <input type="text"
                                className='w-full px-4 py-2 border rounded-lg focus:outline-none'
                                name="saltNameString"
                                onChange={handleChange}
                                value={inputs.saltNameString}
                            /> */}
                            <select onChange={handleCompany} className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none">
                                <option >select  Company</option>
                                {company.map((Company) => (
                                    <option value={Company.companyId}>{Company.companyName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Rack No</label>
                            <select
                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                name="rackNoString"
                                onChange={handleChange}
                                value={inputs.rackNoString}>
                                <option value="">Select Rack</option>
                                <option value="Insert">Select/Insert Rack No</option>
                                <option value="12">12</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">HSN / SAC</label>
                            <select onChange={handleHSN} className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none">
                                <option >select  item</option>
                                {hsn.map((hsn) => (
                                    <option value={hsn.hsnIdLong}>{hsn.hsnCodeString}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Tax Slab </label>
                            <select onChange={handleTax} className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none">
                                <option >select  Tax</option>
                                {tax.map((hsn) => (
                                    <option value={hsn.taxId}>{hsn.tax}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Conversion  </label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="conversion"
                                onChange={handleChange}
                                value={inputs.conversion}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">MRP  </label>
                            <input type="text"
                                className='w-full px-4 py-2 border rounded-lg text-sm focus:outline-none'
                                name="mrp"
                                onChange={handleChange}
                                value={inputs.mrp}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">	Pur.Rate  </label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="purchaseRate"
                                onChange={handleChange}
                                value={inputs.purchaseRate}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">	Cost / PCS  </label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="costPerPcs"
                                onChange={handleChange}
                                value={inputs.costPerPcs}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Re-Order Qty  </label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="reOrderQty"
                                onChange={handleChange}
                                value={inputs.reOrderQty}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Max Qty  </label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="maxQty"
                                onChange={handleChange}
                                value={inputs.maxQty}
                            />
                        </div>

                        {/* <div>
                            <label className="block text-gray-700">Hide  </label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                name="payType"
                                onChange={handleChange}
                                value={inputs.payType}>
                                <option value="">Select Hide</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div> */}
                        <div>
                            <label className="block text-gray-700 text-sm">Discount Applicable  </label>
                            <select
                                className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none"
                                name="discountApplicable"
                                onChange={handleChange}
                                value={inputs.discountApplicable}>
                                <option value="">Select Discount</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm">Item Disc 1  </label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="itemDisc1"
                                onChange={handleChange}
                                value={inputs.itemDisc1}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Item Disc 2  </label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="itemDisc2"
                                onChange={handleChange}
                                value={inputs.itemDisc2}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Max Disc %  </label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="maxDisc"
                                onChange={handleChange}
                                value={inputs.maxDisc}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm">Max Margin %  </label>
                            <input type="text"
                                className='w-full px-4 py-2 border text-sm rounded-lg focus:outline-none'
                                name="minMargin"
                                onChange={handleChange}
                                value={inputs.minMargin}
                            />
                        </div>





                    </div>
                    <div className="flex justify-start w-full space-x-4 p-2">
                        <button className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900" type="button" >Refresh</button>
                        <button
                            className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
                            onClick={handleOpening}
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-2 my-4 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-collapse shadow">
                            <thead>
                                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                <th className="px-4 py-2 border border-gray-200 text-sky-500"></th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr No.</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Category Name</th>
                                    {/* <th className="px-4 py-2 border border-gray-200 text-sky-500">Company Name</th> */}
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Item Name</th>
                                    {/* <th className="px-4 py-2 border border-gray-200 text-sky-500">HSN / SAC</th> */}
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Tax (%)</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Cost / PCs</th>

                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.length > 0 ? (
                                    data.map((transaction, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(transaction)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{index+1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.categoryName}</td>
                                            {/* <td className="px-4 py-3 border border-gray-200">{transaction.companyName}</td> */}
                                            <td className="px-4 py-3 border border-gray-200">{transaction.medicineName}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.taxSlab}</td>
                                            <td className="px-4 py-3 border border-gray-200">{transaction.costPerPcs}</td>


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
            <p className="text-red-600 font-medium">Note: A master could not be deleted if used anywhere</p>
        </div>
    );
};
export default withAuth(ItemMaster, ['DOCTOR', 'ADMIN', 'SUPERADMIN'])
