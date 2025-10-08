'use client'
import { useState } from 'react';
import axios from 'axios';
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";


export default function SearchDoctor() {
  return (
    <LayoutForm>
        <Heading headingText={"Search Doctor"} />
        <SearchDoctorform />
    </LayoutForm>
  );
}

const SearchDoctorform = () => {
  // State variables to store form inputs
  const [drName, setDrName] = useState('');
  const [joiningDt, setJoiningDt] = useState('');
  const [drId, setDrId] = useState('');
  const [contactNo, setContactNo] = useState('');

  // State variable to store fetched data
  const [data, setData] = useState([]);

  // Function to fetch data from the API
  const fetchApi = async () => {
    try {
      const response = await axios.get(`doc/searchDoctor`, {
        params: {
          drName: drName,
          joiningDt: joiningDt,
          drId: drId,
          contactNo: contactNo,
        },
      });
      setData(response.data.data); // Set the fetched data to the state
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  // Function to handle the search button click
  const handleSearch = (e) => {
    e.preventDefault();
    fetchApi();
  };

  return (
    <>
      <div className='p-6'>
        <div className='p-7'>
          <form className='lg:w-[100%] md:w-[80%] sm:w-[100%]'>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 shadow-md"
                  placeholder="Enter doctor name"
                  value={drName}
                  onChange={(e) => setDrName(e.target.value)}
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                <input
                  type="date"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 shadow-md"
                  value={joiningDt}
                  onChange={(e) => setJoiningDt(e.target.value)}
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ID</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 shadow-md"
                  placeholder="Enter doctor ID"
                  value={drId}
                  onChange={(e) => setDrId(e.target.value)}
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mobile NO.</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 shadow-md"
                  placeholder="Enter mobile number"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                />
              </div>
              <div className="flex justify-start w-full space-x-4 p-2">
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-900"
                  onClick={handleSearch}
                >
                  Search
                </button>
                <button
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-900"
                  type="reset"
                  onClick={() => {
                    setDrName('');
                    setJoiningDt('');
                    setDrId('');
                    setContactNo('');
                    setData([]);  // Clear the table data
                  }}
                >
                  Refresh
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Table to display the search results */}
        <div className="bg-white p-2 md:p-2 rounded-lg shadow-md mt-3">
          <div className="overflow-x-auto">
            {data.length > -1 && (
              <div className="w-full" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table-auto w-full border border-collapse shadow">
                  <thead>
                    <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                    <th className="px-4 py-2 border border-gray-200 text-sky-500">Dr Id</th>
                      <th className="px-4 py-2 border border-gray-200 text-sky-500">Dr Name</th>
                      <th className="px-4 py-2 border border-gray-200 text-sky-500">Dep Name</th>
                      <th className="px-4 py-2 border border-gray-200 text-sky-500">Gender</th>
                      <th className="px-4 py-2 border border-gray-200 text-sky-500">Age</th>
                      <th className="px-4 py-2 border border-gray-200 text-sky-500">Joining Date</th>
                      <th className="px-4 py-2 border border-gray-200 text-sky-500">Contact No</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((doctor, index) => (
                      <tr key={index} className="text-center">
                         <td className="px-4 py-3 border border-gray-300">{doctor.drId}</td>
                        <td className="px-4 py-3 border border-gray-300">{doctor.drName}</td>
                        <td className="px-4 py-3 border border-gray-300">{doctor.depName}</td>
                        <td className="px-4 py-3 border border-gray-300">{doctor.gender}</td>
                        <td className="px-4 py-3 border border-gray-300">{doctor.age}</td>
                        <td className="px-4 py-3 border border-gray-300">{doctor.joiningDt}</td>
                        <td className="px-4 py-3 border border-gray-300">{doctor.contactNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            )}
          </div>
        </div>
      </div>
    </>
  );
};
