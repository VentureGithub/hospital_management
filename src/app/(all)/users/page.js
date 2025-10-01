'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useState, useEffect } from "react";
import Icon from "../../(components)/icon";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { FaPlus } from "react-icons/fa";
import { useRouter } from 'next/navigation';


export function MedicineMaster() {
    return (
        <LayoutForm>
            <MedicineMasterform />
        </LayoutForm>
    );
}



const MedicineMasterform = () => {
    
    const router = useRouter();
    const newUser = () => {
        router.push('/newuser');
    };

    const [data, setData] = useState([]);

    // Fetch all medicines
    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`user/getAllUser`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);




    return (
        <div className="p-4 bg-gray-50 mt-6 ml-6 rounded-md shadow-xl relative">
            <Heading headingText="All Users" />

            {/* Add New Button */}
            <div className="flex justify-between items-center py-4">
                <h2 className="text-xl font-bold text-gray-700">User List</h2>
                <button
                    onClick={newUser}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                >
                    <FaPlus className="mr-2" />
                    Add New
                </button>
            </div>

            {/* Table Section */}
            <div className="py-4">
                <div className="bg-white p-2 rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <div className="w-full" style={{ maxHeight: "600px", overflowY: "auto" }}>
                            <table className="table-auto w-full border border-collapse shadow">
                                <thead>
                                    <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Sr No.</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Name</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Email</th>
                                        <th className="px-4 py-2 border border-gray-200 text-sky-500">Roles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(data) && data.length > 0 ? (
                                        data.map((item, index) => (
                                            <tr key={item.medId} className="border border-gray-200 text-center">
                                                <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                                <td className="px-4 py-3 border border-gray-200 uppercase">{item.userName}</td>
                                                <td className="px-4 py-3 border border-gray-200 uppercase">{item.email}</td>
                                                <td className="px-4 py-3 border border-gray-200 uppercase">{item.roles}</td>
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
        </div>
    );
};


export default withAuth(MedicineMaster, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])

