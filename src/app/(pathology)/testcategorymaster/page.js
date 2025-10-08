'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { useState, useEffect } from "react";


export function TestCategory() {
    return (
        <LayoutForm>
           <TestCategoryform />
        </LayoutForm>
    );
}

const TestCategoryform = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [testTypes, setTestTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [inputs, setInputs] = useState({
       categoryId: 0,
  typeId: 0,
  categoryName:"" ,
  description:"",
  active: "true",
  typeName: "",
    });

    const fetchCategories = async () => {
        try {
            const response = await apiClient.get(`testCatagory/getTest/catagory`);
            setCategories(response.data.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchTestTypes = async () => {
        try {
            const response = await apiClient.get(`testTypeMaster/getAllTestTypeMaster`);
            setTestTypes(response.data.data);
        } catch (error) {
            console.error("Error fetching test types:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchTestTypes();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (isEdit) {
                response = await apiClient.put(`testCategory/update`, inputs);
                if (response.status === 200) {
                    alert("Category updated successfully");
                    setIsEdit(false);
                } else {
                    alert(`Update failed! Status: ${response.status}`);
                }
            } else {
                response = await apiClient.post("testCatagory/save", inputs);
                if (response.status === 200) {
                    alert("Category saved successfully");
                } else {
                    alert(`Save failed! Status: ${response.status}`);
                }
            }

            fetchCategories();
            setInputs({
                   categoryId: 0,
  typeId: 0,
  categoryName:"" ,
  description:"",
  active: "true",
  typeName: "",
            });
        } catch (error) {
            console.error("Error handling save operation:", error);
            alert(`An error occurred: ${error.response ? error.response.data : error.message}`);
        }
    };

    const handleUpdate = (category) => {
        setInputs({
            categoryId: category.categoryId,
            typeId: category.typeId,
            categoryName: category.categoryName,
            typeName: category.typeName,

        });
        setIsEdit(true);
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prevInputs => ({
        ...prevInputs,
        [name]: name === 'typeId' ? parseInt(value) || "" : value
    }));
};


  

    return (
        <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl">
            <Heading headingText="Test Category Master" />
            <div className="py-4">
                <form className='lg:w-[50%] md:w-[100%] sm:w-[100%]'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 m-2">
                        <div>
                            <label className="block text-sm">Test Type</label>
                           <select 
  name="typeId"             
  onChange={handleChange} 
  value={inputs.typeId}     
  className="w-full text-sm px-4 py-2 border rounded-lg focus:outline-none"
>
  <option value="">Select Test Type</option>
  {testTypes?.map((type) => (
      <option key={type.typeId} value={type.typeId}>
          {type.typeName}
      </option>
  ))}
</select>
                        </div>
                        <div>
                            <label className="block text-sm">Category Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none"
                                name="categoryName"
                                value={inputs.categoryName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </form>
                <div className="flex justify-start w-full my-4 space-x-4 p-2">
                    <button
                        className="bg-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-900"
                        type="button"
                        onClick={fetchCategories}
                    >
                        Refresh
                    </button>
                    <button
                        className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
                        onClick={handleSave}
                        type="submit"
                    >
                        {isEdit ? "Update" : "Save"}
                    </button>
                </div>
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
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr</th>
                                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Category Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(categories) && categories.length > 0 ? (
                                    categories.map((category, index) => (
                                        <tr key={index} className="border border-gray-200 text-center">
                                            <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                                    onClick={() => handleUpdate(category)}
                                                >
                                                    <FaPencilAlt className="mr-1" />
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 border border-gray-200">{category.categoryName}</td>
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
            <p className="text-red-600 font-medium">Note: A master could not be deleted if used anywhere</p>
        </div>
    );
};

export default withAuth(TestCategory, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])
