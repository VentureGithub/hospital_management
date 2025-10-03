"use client"
import axios from "axios";
import LayoutForm from "../../layouts/layoutForm";
import {  useState } from 'react';
import Heading from "../../(components)/heding";

export default function SearchPatient() {
  return (
    <LayoutForm>
      
     <Heading headingText="Search Patient" />
      <SearchTypeform />
      
    </LayoutForm>
  );
}


const SearchTypeform = () => {
  const [search, setSearch] = useState([]);
  const [name, setName] = useState();
  const [date, setDate] = useState();
  const [patientId, setPatientId] = useState();
  const [mobileNo, setMobileNo] = useState();

  const fetchPatient = async (e) => {
    e.preventDefault();
    debugger;
    if (patientId) {
      axios.get("api/patId/" + patientId).then((response) => {
        console.log("🚀 ~ axios.get ~ response:", response)
        if (response.data.status == "200" && response.data.message == "Success") {
          setSearch(response.data.data);
        }
      }).catch((error) => {
          alert('No patient record found with entered PatientId');
      });
    }
    else if (name) {
      axios.get("api/patients/byName?name=" + name).then((response) => {
        if (response.data.status == "200" && response.data.message == "Success") {
          setSearch(response.data.data);
        }
        else {
          alert('No patient record found with entered name');
        }
      }).catch((error) => {
          alert('No patient record found with entered name');
      });
    }

  }


  return (
    <>
      <div className='p-6'>
        <div className='p-7'>
          <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 ">
              <div class="mb-5">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Patient ID</label>
                <input type="text" id="patientid" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 shadow-md" placeholder="" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
              </div>
              <div class="mb-5">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                <input type="text" id="Pname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 shadow-md" placeholder="" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div class="mb-5">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Registration Date</label>
                <input type="date" id="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 shadow-md" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>

              <div class="mb-5">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mobile No.</label>
                <input type="text" id="contactno" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 shadow-md" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} />
              </div>


              <div className="flex justify-start  w-full space-x-4 p-2">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-900" onClick={fetchPatient}>Search</button>
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-900">Refresh</button>
              </div>
            </div>
          </form>
        </div>
        <br />
        <br />

      <div className="bg-white p-2 md:p-2 rounded-lg shadow-md mt-3">
        <div className="overflow-x-auto">
          <div className="w-full" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className='table-auto w-full border border-collapse shadow'>
              <thead>
                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                <th className='px-4 py-2 border border-gray-200 text-sky-500'>Patient ID</th>
                <th className='px-4 py-2 border border-gray-200 text-sky-500'>Patient Name</th>
                <th className='px-4 py-2 border border-gray-200 text-sky-500'>Gender</th>
                <th className='px-4 py-2 border border-gray-200 text-sky-500'>Contact no</th>
                <th className='px-4 py-2 border border-gray-200 text-sky-500'>Consulting Doctor</th>
                <th className='px-4 py-2 border border-gray-200 text-sky-500'>Action</th>
              </tr>
            </thead>
            <tbody>
              {patientId ? (
                <tr>
                  <td className='px-4 py-3 border border-gray-300'>{search.patId}</td>
                  <td className='px-4 py-3 border border-gray-300'>{search.patientName}</td>
                  <td className='px-4 py-3 border border-gray-300'>{search.gender}</td>
                  <td className='px-4 py-3 border border-gray-300'>{search.contactNumber}</td>
                  <td className='px-4 py-3 border border-gray-300'>{/* Assuming there should be a consulting doctor here */}</td>
                  <td className='px-4 py-3 border border-gray-300'>{/* Action buttons or links */}</td>
                </tr>
              ) : (
                search.map((data, index) => (
                  <tr key={index}>
                    <td className='px-4 py-3 border border-gray-300'>{data.patId}</td>
                    <td className='px-4 py-3 border border-gray-300'>{data.patientName}</td>
                    <td className='px-4 py-3 border border-gray-300'>{data.gender}</td>
                    <td className='px-4 py-3 border border-gray-300'>{data.contactNumber}</td>
                    <td className='px-4 py-3 border border-gray-300'>{/* Consulting doctor data */}</td>
                    <td className='px-4 py-3 border border-gray-300'>{/* Action buttons or links */}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      </div>
      
    </>
  );
};

