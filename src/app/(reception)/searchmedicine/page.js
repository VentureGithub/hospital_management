"use client"
import { useEffect, useState } from 'react';
import LayoutForm from "../../layouts/layoutForm";
import axios from 'axios';
import { BaseUrl } from '../../config';
import Heading from '../../(components)/heding';

export default function SearchMedicine() {
  return (
    <LayoutForm>
      <Heading headingText={"Search Medicine"} />
      <SearchTypeform />
    </LayoutForm>
  );
}


const SearchTypeform = () => {
  const [search, setSearch] = useState([]);
  const [medName, setName] = useState();
  const [exp, setDate] = useState();
  const [itemNo, setItemno] = useState();


  // const formData = {

  //   medName: "",
  //   itemno:"",
  //   dateofexp:"",



  // };
  // const fetchMedicine = async () => {
  //   debugger;
  //   const url = 'http://localhost:8081/hms/';  // Replace with your API endpoint
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   };

  //   const response = await fetch(url, options);
  //   if (!response.ok) {
  //     console.log('Network response was not ok');
  //     return;
  //   }
  //   const data = await response.json();
  //   setMedicine(data.data);
  // };

  const fetchMedicine = async (e) => {
    e.preventDefault();
    debugger;

    axios.get("/api/medicines").then((response) => {    ///api/medicines/getMedicineById
      console.log("🚀 ~ axios.get ~ response:", response)
      if (response.data.status == "200" && response.data.message == "Success") {
        setSearch(response.data.data);
      }
    }).catch((error) => {
      alert('No  record found with entered Item No');
    });


    // if (dateofexp) {
    //   axios.get(BaseUrl + "api/dateofexp/byexp?exp" + exp).then((response) => {     ////api/medicines
    //     console.log("🚀 ~ axios.get ~ response:", response)
    //     if (response.data.status == "200" && response.data.message == "Success") {
    //       setSearch(response.data.data);
    //     }
    //   }).catch((error) => {
    //       alert('No  record found with entered Date Of Exp');
    //   });

    // }


    // else if (name) {
    //   axios.get(BaseUrl + "api/medicine/byName?name=" + name).then((response) => {
    //     if (response.data.status == "200" && response.data.message == "Success") {
    //       setSearch(response.data.data);
    //     }
    //     else {
    //       alert('No  record found with entered Medicine Name');
    //     }
    //   }).catch((error) => {
    //       alert('No  record found with entered Medicine Name');
    //   });
    // }

  }




  return (
    <>
      <div className='p-6'>
        <div className='p-7'>
          <form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 ">
              <div class="mb-5">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Medicine Name</label>
                <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 shadow-md" placeholder="" name="medName" onChange={(e) => setName(e.target.value)} />
              </div>
              <div class="mb-5">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date of Exp</label>
                <input type="date" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 shadow-md" name="exp" onChange={(e) => setDate(e.target.value)} />
              </div>
              <div class="mb-5">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item No</label>
                <input type="text" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 shadow-md" placeholder="" name="itemNo" onChange={(e) => setItemno(e.target.value)} />
              </div>


              <div className="flex justify-start  w-full space-x-4 p-2">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-900" onClick={fetchMedicine}>Search</button>
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-900">Refresh</button>
              </div>
            </div>
          </form>
        </div>


        <br />

        <div className="bg-white p-2 md:p-2 rounded-lg shadow-md mt-3">
          <div className="overflow-x-auto">
            <div className="w-full" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className='table-auto w-full border border-collapse shadow'>
                <thead>
                  <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                    <th className='px-4 py-2 border border-gray-200 text-sky-500'>Item Id</th>
                    <th className='px-4 py-2 border border-gray-200 text-sky-500'>Medicine Name</th>
                    <th className='px-4 py-2 border border-gray-200 text-sky-500'>Rate no</th>
                    <th className='px-4 py-2 border border-gray-200 text-sky-500'>Quantity</th>
                    <th className='px-4 py-2 border border-gray-200 text-sky-500'>Exp Date</th>

                  </tr>
                </thead>
                <tbody>
                  {itemNo ? (
                    <tr>
                      <td className='px-4 py-3 border border-gray-300'>{search.itemNo}</td>
                      <td className='px-4 py-3 border border-gray-300'>{search.medName}</td>
                      <td className='px-4 py-3 border border-gray-300'>{search.rate}</td>
                      <td className='px-4 py-3 border border-gray-300'>{search.qty}</td>
                      <td className='px-4 py-3 border border-gray-300'>{search.exp}</td>
                    </tr>
                  ) : (
                    search.map((data, index) => (
                      <tr key={index}>
                        <td className='px-4 py-3 border border-gray-300'>{data.itemNo}</td>
                        <td className='px-4 py-3 border border-gray-300'>{data.medName}</td>
                        <td className='px-4 py-3 border border-gray-300'>{data.rate}</td>
                        <td className='px-4 py-3 border border-gray-300'>{data.qty}</td>
                        <td className='px-4 py-3 border border-gray-300'>{data.exp}</td>
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

