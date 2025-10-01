
// import React, { useState } from "react";
// import { IoMdArrowDropdown } from "react-icons/io";
// import { MdMenu, MdClose } from "react-icons/md";
// import { IoIosArrowDown } from "react-icons/io";
// import { FaRegClipboard } from 'react-icons/fa';
// import { BsCapsulePill } from "react-icons/bs";
// import { FaFilePdf } from "react-icons/fa6";
// import { FaUserTie } from "react-icons/fa";
// import { BiSolidEdit } from "react-icons/bi";

// import { MdHeadset, MdDescription } from 'react-icons/md';
// import { GiMicroscope } from "react-icons/gi";
// import {
//   MdMedicalServices,
//   MdStore,
//   MdBook,
//   MdInsertChart,
//   MdAccountCircle,
// } from "react-icons/md";
// import { usePathname } from "next/navigation";
// import Link from "next/link";

// const navigationConfig = {
//   Reception: {
//     icon: FaRegClipboard,
//     items: [
//       { label: 'OPD Registration', path: '/opdregistrationform' },
//       { label: 'IPD Registration', path: '/ipdregistrationform' },
//       { label: 'IPD Patient service', path: '/patientDemandDue' },
//       { label: 'Medicine Chart', path: '/medicinechart' },
//       { label: 'Birth Certificate', path: '/birthcertificatee' },
//       { label: 'Discharge Patient Bill', path: '/dischargePatientBill' },
//       { label: 'Discharge Summary', path: '/dischargesummary' },
//       { label: 'Medical Certificate', path: '/medicalCertificate' },
//       { label: 'Patient History', path: '/patienthistory' },
//       { label: 'Ambulance Booking', path: '/ambulancebooking' }
//     ]
//   },
//   Pharmacy: {
//     icon: BsCapsulePill,
//     items: [
//       { label: 'Category Master', path: '/categorymaster' },
//       { label: 'Company Master', path: '/companymaster' },
//       { label: 'HSN Master', path: '/hsnmaster' },
//       { label: 'Supplier Master', path: '/suppliermasterstore' },
//       { label: 'Purchase Invoice', path: '/purchase' },
//       { label: 'Purchase Return', path: '/purchasereturn' },
//       { label: 'Item Master', path: '/itemmaster' },
//       { label: 'Salt Master', path: '/saltmaster' },
//       { label: 'Opening Stock', path: '/openingstock' },
//       { label: 'Sale Invoice', path: '/saleinvoice' },
//       { label: 'Sale Return', path: '/salereturn' },
//       { label: 'Sale Report', path: '/salereport' },
//       // { label: 'Medicine Master', path: '/medicinemasterstore' }
//     ]
//   },
//   Diagnostic: {
//     icon: GiMicroscope,
//     items: [
//       { label: 'Test Type Master', path: '/testtypemaster' },
//       { label: 'Test Category Master', path: '/testcategorymaster' },
//       { label: 'Test Master', path: '/testmaster' },
//       { label: 'Blood Purchase', path: '/bloodsugarstrippurchase' },
//       { label: 'Lab Material Purchase', path: '/labmaterialpurchase' },
//       { label: 'X-Ray Master', path: '/xraymaster' },
//       { label: 'Ultrasound Master', path: '/ultrasoundmaster' },
//       { label: 'Sub Test Master', path: '/subtestmaster' },
//       { label: 'Test Booking', path: '/testbooking' },
//       { label: 'Blood Sugar Strip Pur.', path: '/bloodsugarstrippurreport' },
//       { label: 'Material Purchase', path: '/materialpurchasereport' }
//     ]
//   },
//   Store: {
//     icon: MdStore,
//     items: [
//       { label: 'Supplier Master', path: '/suppliermaster' },
//       { label: 'Item Master', path: '/itemmasterrr' },
//       { label: 'Floor Master', path: '/floormaster' },
//       { label: 'Issue Assets', path: '/issueassets' },
//       { label: 'Return Assets', path: '/returnassets' },
//       { label: 'Purchase Invoice', path: '/purchaseinvoice' },
//       { label: 'Purchase Invoice Report', path: '/purchaseinvoicereport' },
//       { label: 'Lost/Condem/Short Asset', path: '/lostcondemshortasset' }
//     ]
//   },
//   "HR Management": {
//     icon: FaUserTie,
//     items: [
//       { label: 'Designation Master', path: '/designationmaster' },
//       { label: 'Employee Joining', path: '/employee' },
//       { label: 'Employee Attendance', path: '/employeeattendance' },
//       { label: 'Employee Detail Report', path: '/employeedetailreport' },
//       { label: 'Salary Deduction', path: '/salarydeduction' },
//       { label: 'Generate Salary', path: '/generatesalary' },
//       // { label: 'Detail Report', path: '/employeedetailreport' },
//       { label: 'Salary Add/Deduction Report', path: '/salarydeductionreport' },
//       { label: 'Salary Increment', path: '/employeesalaryincrement' }
//     ]
//   },
//   Report: {
//     icon: FaFilePdf,
//     items: [
//       { label: 'IPD Patient In Discharge', path: '/ipdpatientindischarge' },
//       { label: 'OPD Patient Report', path: '/opdpatientreport' },
//       { label: 'Patient Room Report', path: '/patientroomreport' },
//       { label: 'Discharge Summary Report', path: '/dischargesummaryreport' }
//     ]
//   },
//   Account: {
//     icon: MdAccountCircle,
//     items: [
//       { label: 'Account Group', path: '/accountgroup' },
//       { label: 'Account Ledger', path: '/accountledger' },
//       { label: 'Bank Payment', path: '/bankpayment' },
//       // { label: 'Bank Payment Report', path: '/bankpaymentreport' },
//       { label: 'Cash Payment', path: '/cashpayment' },
//       // { label: 'Cash Payment Report', path: '/cashpaymentreport' },
//       { label: 'Journal Voucher', path: '/journalvoucher' },
//       { label: 'Journal Voucher Report', path: '/journalvoucherreport' }
//     ]
//   },
//   Master: {
//     icon: BiSolidEdit,
//     items: [
//       // { label: 'Medicine Brand', path: '/medicinebrand' },
//       // { label: 'Medicine Category', path: '/medicinecategory' },
//       // { label: 'Medicine Master', path: '/medicinemaster' },
//       { label: 'Medicine Time', path: '/medicinetimemaster' },
//       { label: 'Department Master', path: '/departmentMaster' },
//       { label: 'Doctor Master', path: '/doctormasterr' },
//       { label: 'Service Type Master', path: '/servicetypemaster' },
//       { label: 'Service Master', path: '/servicemaster' },
//       { label: 'Room Type Master', path: '/roomtypemaster' },
//       { label: 'Room Master', path: '/roommasterr' },
//       { label: 'Shift Master', path: '/shiftmaster' },
//       { label: 'Diagnosis Master', path: '/diagnosismaster' },
//       { label: 'Discount Master', path: '/discountmaster' },
//       { label: 'Tax Master', path: '/taxmaster' },
//       { label: 'Insurance Master', path: '/insurancemaster' },
//       { label: 'Ambulance Master', path: '/ambulancemaster' }

//     ]
//   },
// };

// const SidebarItem = ({ label, icon: Icon, children, isActive }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="w-full  ">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`w-full flex items-center justify-between p-3 
//           text-gray-800 hover:bg-blue-100 transition-colors 
//           ${isActive ? "bg-blue-100 font-semibold" : "text-blue-600"}`}
//       >
//         <div className="flex items-center gap-2">
//           {Icon && <Icon className="w-5 h-5 text-gray-500" />}
//           <span className="text-sm">{label}</span>
//         </div>
//         <span
//           className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
//             }`}
//         >
//           <IoIosArrowDown />
//         </span>
//       </button>
//       <div
//         className={`ml-4 mt-1 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${isOpen ? "max-h-screen opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
//           }`}
//       >
//         {children}
//       </div>
//     </div>
//   );
// };

// const Sidebar = () => {
//   const pathname = usePathname();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const navigationItems = Object.entries(navigationConfig).map(
//     ([section, { icon: Icon, items }]) => (
//       <SidebarItem
//         key={section}
//         label={section}
//         icon={Icon}
//         isActive={items.some((item) => item.path === pathname)}
//       >
//         {items.map((item) => (
//           <Link
//             key={item.path}
//             href={item.path}
//             className={`block p-2 text-sm  text-gray-700 hover:text-blue-700
//               transition-colors ${pathname === item.path ? "" : "text-blue-600"}`}
//             prefetch={false}
//           >
//             {item.label}
//           </Link>
//         ))}
//       </SidebarItem>
//     )
//   );

//   return (
//     <div>
//       {/* Mobile Menu Button */}
//       <button
//         className="lg:hidden p-3 text-gray-800 "
//         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//       >
//         {isSidebarOpen ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
//       </button>
//       <div className=" gap-3 p-4 py-5 bg-white ">
//         <span className="flex items-center text-lg font-semibold">Tanu Singh Bora</span>
//         <span className=" flex items-center text-sm text-gray-700 font-normal">SUPERADMIN</span>
//       </div>
//       <div className="h-[1px] bg-gray-200 mb-3"></div>
//       {/* Sidebar */}
//       <div
//         className={`fixed lg:static top-0 left-0 h-full bg-white text-gray-800 shadow-lg transform transition-transform duration-300 z-50 
//         lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//       >
//         <div
//           className="w-60 h-full overflow-hidden overflow-y-auto 
//           scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
//         >
//           <div className="">{navigationItems}</div>
//         </div>
//       </div>

//       {/* Background Overlay for Mobile */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Sidebar;






// import React, { use, useEffect, useState } from "react";
// import { IoMdArrowDropdown } from "react-icons/io";
// import { MdMenu, MdClose } from "react-icons/md";
// import { IoIosArrowDown } from "react-icons/io";
// import apiClient from "@/app/config";
// import { FaRegClipboard } from 'react-icons/fa';
// import { BsCapsulePill } from "react-icons/bs";
// import { FaFilePdf } from "react-icons/fa6";
// import { FaUserTie } from "react-icons/fa";
// import { BiSolidEdit } from "react-icons/bi";

// import { MdHeadset, MdDescription } from 'react-icons/md';
// import { GiMicroscope } from "react-icons/gi";
// import {
//   MdMedicalServices,
//   MdStore,
//   MdBook,
//   MdInsertChart,
//   MdAccountCircle,
// } from "react-icons/md";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import apiClient from "../config";
// import { resolve } from "styled-jsx/css";

// const navigationConfig = {
//   Reception: {
//     icon: FaRegClipboard,
//     items: [
//       { label: 'OPD Registration', path: '/opdregistrationform' },
//       { label: 'IPD Registration', path: '/ipdregistrationform' },
//       { label: 'IPD Patient service', path: '/patientDemandDue' },
//       { label: 'Medicine Chart', path: '/medicinechart' },
//       { label: 'Birth Certificate', path: '/birthcertificatee' },
//       { label: 'Discharge Patient Bill', path: '/dischargePatientBill' },
//       { label: 'Discharge Summary', path: '/dischargesummary' },
//       { label: 'Medical Certificate', path: '/medicalCertificate' },
//       { label: 'Patient History', path: '/patienthistory' },
//       { label: 'Ambulance Booking', path: '/ambulancebooking' }
//     ]
//   },
//   Pharmacy: {
//     icon: BsCapsulePill,
//     items: [
//       { label: 'Category Master', path: '/categorymaster' },
//       { label: 'Company Master', path: '/companymaster' },
//       { label: 'HSN Master', path: '/hsnmaster' },
//       { label: 'Supplier Master', path: '/suppliermasterstore' },
//       { label: 'Purchase Invoice', path: '/purchase' },
//       { label: 'Purchase Return', path: '/purchasereturn' },
//       { label: 'Item Master', path: '/itemmaster' },
//       { label: 'Salt Master', path: '/saltmaster' },
//       { label: 'Opening Stock', path: '/openingstock' },
//       { label: 'Sale Invoice', path: '/saleinvoice' },
//       { label: 'Sale Return', path: '/salereturn' },
//       { label: 'Sale Report', path: '/salereport' },
//       // { label: 'Medicine Master', path: '/medicinemasterstore' }
//     ]
//   },
//   Diagnostic: {
//     icon: GiMicroscope,
//     items: [
//       { label: 'Test Type Master', path: '/testtypemaster' },
//       { label: 'Test Category Master', path: '/testcategorymaster' },
//       { label: 'Test Master', path: '/testmaster' },
//       { label: 'Blood Purchase', path: '/bloodsugarstrippurchase' },
//       { label: 'Lab Material Purchase', path: '/labmaterialpurchase' },
//       { label: 'X-Ray Master', path: '/xraymaster' },
//       { label: 'Ultrasound Master', path: '/ultrasoundmaster' },
//       { label: 'Sub Test Master', path: '/subtestmaster' },
//       { label: 'Test Booking', path: '/testbooking' },
//       { label: 'Blood Sugar Strip Pur.', path: '/bloodsugarstrippurreport' },
//       { label: 'Material Purchase', path: '/materialpurchasereport' }
//     ]
//   },
//   Store: {
//     icon: MdStore,
//     items: [
//       { label: 'Supplier Master', path: '/suppliermaster' },
//       { label: 'Item Master', path: '/itemmasterrr' },
//       { label: 'Floor Master', path: '/floormaster' },
//       { label: 'Issue Assets', path: '/issueassets' },
//       { label: 'Return Assets', path: '/returnassets' },
//       { label: 'Purchase Invoice', path: '/purchaseinvoice' },
//       { label: 'Purchase Invoice Report', path: '/purchaseinvoicereport' },
//       { label: 'Lost/Condem/Short Asset', path: '/lostcondemshortasset' }
//     ]
//   },
//   "HR Management": {
//     icon: FaUserTie,
//     items: [
//       { label: 'Designation Master', path: '/designationmaster' },
//       { label: 'Employee Joining', path: '/employee' },
//       { label: 'Employee Attendance', path: '/employeeattendance' },
//       { label: 'Employee Detail Report', path: '/employeedetailreport' },
//       { label: 'Salary Deduction', path: '/salarydeduction' },
//       { label: 'Generate Salary', path: '/generatesalary' },
//       // { label: 'Detail Report', path: '/employeedetailreport' },
//       { label: 'Salary Add/Deduction Report', path: '/salarydeductionreport' },
//       { label: 'Salary Increment', path: '/employeesalaryincrement' }
//     ]
//   },
//   Report: {
//     icon: FaFilePdf,
//     items: [
//       { label: 'IPD Patient In Discharge', path: '/ipdpatientindischarge' },
//       { label: 'OPD Patient Report', path: '/opdpatientreport' },
//       { label: 'Patient Room Report', path: '/patientroomreport' },
//       { label: 'Discharge Summary Report', path: '/dischargesummaryreport' }
//     ]
//   },
//   Account: {
//     icon: MdAccountCircle,
//     items: [
//       { label: 'Account Group', path: '/accountgroup' },
//       { label: 'Account Ledger', path: '/accountledger' },
//       { label: 'Bank Payment', path: '/bankpayment' },
//       // { label: 'Bank Payment Report', path: '/bankpaymentreport' },
//       { label: 'Cash Payment', path: '/cashpayment' },
//       // { label: 'Cash Payment Report', path: '/cashpaymentreport' },
//       { label: 'Journal Voucher', path: '/journalvoucher' },
//       { label: 'Journal Voucher Report', path: '/journalvoucherreport' }
//     ]
//   },
//   Master: {
//     icon: BiSolidEdit,
//     items: [
//       // { label: 'Medicine Brand', path: '/medicinebrand' },
//       // { label: 'Medicine Category', path: '/medicinecategory' },
//       // { label: 'Medicine Master', path: '/medicinemaster' },
//       { label: 'Medicine Time', path: '/medicinetimemaster' },
//       { label: 'Department Master', path: '/departmentMaster' },
//       { label: 'Doctor Master', path: '/doctormasterr' },
//       { label: 'Service Type Master', path: '/servicetypemaster' },
//       { label: 'Service Master', path: '/servicemaster' },
//       { label: 'Room Type Master', path: '/roomtypemaster' },
//       { label: 'Room Master', path: '/roommasterr' },
//       { label: 'Shift Master', path: '/shiftmaster' },
//       { label: 'Diagnosis Master', path: '/diagnosismaster' },
//       { label: 'Discount Master', path: '/discountmaster' },
//       { label: 'Tax Master', path: '/taxmaster' },
//       { label: 'Insurance Master', path: '/insurancemaster' },
//       { label: 'Ambulance Master', path: '/ambulancemaster' }

//     ]
//   },
// };

// const SidebarItem = ({ label, icon: Icon, children, isActive }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="w-full  ">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`w-full flex items-center justify-between p-3 
//           text-gray-800 hover:bg-blue-100 transition-colors 
//           ${isActive ? "bg-blue-100 font-semibold" : "text-blue-600"}`}
//       >
//         <div className="flex items-center gap-2">
//           {Icon && <Icon className="w-5 h-5 text-gray-500" />}
//           <span className="text-sm">{label}</span>
//         </div>
//         <span
//           className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
//             }`}
//         >
//           <IoIosArrowDown />
//         </span>
//       </button>
//       <div
//         className={`ml-4 mt-1 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${isOpen ? "max-h-screen opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
//           }`}
//       >
//         {children}
//       </div>
//     </div>
//   );
// };

// const Sidebar = () => {
//   const pathname = usePathname();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [name, setName] = useState(''); // Fixed: Properly initialize useState
//   const [loginTime, setLoginTime] = useState('');

//   const fetchApi = async () => {
//     try {
//       const response = await apiClient.get('user/loggedInUserInfo');
//       setName(response?.data?.username || '');
//       // Format and set login time if needed
//       setLoginTime(new Date(response?.data?.loginTime).toLocaleString());
//     } catch (error) {
//       console.log('Error fetching user info:', error);
//       setName(''); // Reset name on error
//       setLoginTime('');
//     }
//   };

//   useEffect(() => {
//     fetchApi();
//   }, []);

//   const navigationItems = Object.entries(navigationConfig).map(
//     ([section, { icon: Icon, items }]) => (
//       <SidebarItem
//         key={section}
//         label={section}
//         icon={Icon}
//         isActive={items.some((item) => item.path === pathname)}
//       >
//         {items.map((item) => (
//           <Link
//             key={item.path}
//             href={item.path}
//             className={`block p-2 text-sm  text-gray-700 hover:text-blue-700
//               transition-colors ${pathname === item.path ? "" : "text-blue-600"}`}
//             prefetch={false}
//           >
//             {item.label}
//           </Link>
//         ))}
//       </SidebarItem>
//     )
//   );

//   return (
//     <div>
//       {/* Mobile Menu Button */}
//       <button
//         className="lg:hidden p-3 text-gray-800 "
//         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//       >
//         {isSidebarOpen ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
//       </button>
//       <div className=" gap-3 p-4 py-5 bg-white ">
//         <span className="flex items-center text-lg font-semibold text-blue-600 uppercase">
//           {name }
//         </span>
//         <span className=" flex items-center text-sm text-blue-600 font-normal">SUPERADMIN</span>
//         <span className="flex items-center text-xs text-blue-600">
//           Login: {loginTime}
//         </span>
//       </div>
//       <div className="h-[1px] bg-gray-200 mb-3"></div>
//       {/* Sidebar */}
//       <div
//         className={`fixed lg:static top-0 left-0 h-full bg-white text-gray-800 shadow-lg transform transition-transform duration-300 z-50 
//         lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//           }`}
//       >
//         <div
//           className="w-60 h-full overflow-hidden overflow-y-auto 
//           scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
//         >
//           <div className="">{navigationItems}</div>
//         </div>
//       </div>

//       {/* Background Overlay for Mobile */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Sidebar;












'use client'


import { IoIosArrowDown } from "react-icons/io";

import { FaRegClipboard } from 'react-icons/fa';
import { BsCapsulePill } from "react-icons/bs";
import { FaFilePdf } from "react-icons/fa6";

import { BiSolidEdit } from "react-icons/bi";

import { GiMicroscope } from "react-icons/gi";
import {
  MdStore,
  MdAccountCircle,
} from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import apiClient from "@/app/config";

const navigationConfig = {
  "Reception": {
  icon: FaRegClipboard,
  items: [
    { label: 'OPD Registration', path: '/opdregistrationform' },
    { label: 'IPD Registration', path: '/ipdregistrationform' },
    { label: 'IPD Patient service', path: '/patientDemandDue' },
    { label: 'Medicine Chart', path: '/medicinechart' },
    { label: 'Birth Certificate', path: '/birthcertificatee' },
    { label: 'Discharge Patient Bill', path: '/dischargePatientBill' },
    { label: 'Discharge Summary', path: '/dischargesummary' },
    { label: 'Medical Certificate', path: '/medicalCertificate' },
    { label: 'Patient History', path: '/patienthistory' },
    { label: 'Ambulance Booking', path: '/ambulancebooking' }
  ]
},
Pharmacy: {
  icon: BsCapsulePill,
  items: [
    { label: 'Category Master', path: '/categorymaster' },
    { label: 'Company Master', path: '/companymaster' },
    { label: 'HSN Master', path: '/hsnmaster' },
    { label: 'Supplier Master', path: '/suppliermasterstore' },
    { label: 'Purchase Invoice', path: '/purchase' },
    { label: 'Purchase Return', path: '/purchasereturn' },
    { label: 'Item Master', path: '/itemmaster' },
    { label: 'Salt Master', path: '/saltmaster' },
    { label: 'Opening Stock', path: '/openingstock' },
    { label: 'Sale Invoice', path: '/saleinvoice' },
    { label: 'Sale Return', path: '/salereturn' },
    { label: 'Sale Report', path: '/salereport' },
    // { label: 'Medicine Master', path: '/medicinemasterstore' }
  ]
},
Diagnostic: {
  icon: GiMicroscope,
  items: [
    { label: 'Test Type Master', path: '/testtypemaster' },
    { label: 'Test Category Master', path: '/testcategorymaster' },
    { label: 'Test Master', path: '/testmaster' },
    { label: 'Blood Purchase', path: '/bloodsugarstrippurchase' },
    { label: 'Lab Material Purchase', path: '/labmaterialpurchase' },
    { label: 'X-Ray Master', path: '/xraymaster' },
    { label: 'Ultrasound Master', path: '/ultrasoundmaster' },
    { label: 'Sub Test Master', path: '/subtestmaster' },
    { label: 'Test Booking', path: '/testbooking' },
    { label: 'Blood Sugar Strip Pur.', path: '/bloodsugarstrippurreport' },
    { label: 'Material Purchase', path: '/materialpurchasereport' }
  ]
},
Store: {
  icon: MdStore,
  items: [
    { label: 'Supplier Master', path: '/suppliermaster' },
    { label: 'Item Master', path: '/itemmasterrr' },
    { label: 'Floor Master', path: '/floormaster' },
    { label: 'Issue Assets', path: '/issueassets' },
    { label: 'Return Assets', path: '/returnassets' },
    { label: 'Purchase Invoice', path: '/purchaseinvoice' },
    { label: 'Purchase Invoice Report', path: '/purchaseinvoicereport' },
    { label: 'Lost/Condem/Short Asset', path: '/lostcondemshortasset' }
  ]
},
"HR Management": {
  icon: FaUserTie,
  items: [
    { label: 'Designation Master', path: '/designationmaster' },
    { label: 'Employee Joining', path: '/employee' },
    { label: 'Employee Attendance', path: '/employeeattendance' },
    { label: 'Employee Detail Report', path: '/employeedetailreport' },
    { label: 'Salary Deduction', path: '/salarydeduction' },
    { label: 'Generate Salary', path: '/generatesalary' },
    // { label: 'Detail Report', path: '/employeedetailreport' },
    { label: 'Salary Add/Deduction Report', path: '/salarydeductionreport' },
    { label: 'Salary Increment', path: '/employeesalaryincrement' }
  ]
},
Report: {
  icon: FaFilePdf,
  items: [
    { label: 'IPD Patient In Discharge', path: '/ipdpatientindischarge' },
    { label: 'OPD Patient Report', path: '/opdpatientreport' },
    { label: 'Patient Room Report', path: '/patientroomreport' },
    { label: 'Discharge Summary Report', path: '/dischargesummaryreport' }
  ]
},
Account: {
  icon: MdAccountCircle,
  items: [
    { label: 'Account Group', path: '/accountgroup' },
    { label: 'Account Ledger', path: '/accountledger' },
    { label: 'Bank Payment', path: '/bankpayment' },
    { label: 'Cash Payment', path: '/cashpayment' },
    { label: 'Journal Voucher', path: '/journalvoucher' },
    { label: 'Journal Voucher Report', path: '/journalvoucherreport' }
  ]
},
Master: {
  icon: BiSolidEdit,
  items: [
    { label: 'Medicine Time', path: '/medicinetimemaster' },
    { label: 'Department Master', path: '/departmentMaster' },
    { label: 'Doctor Master', path: '/doctormasterr' },
    { label: 'Service Type Master', path: '/servicetypemaster' },
    { label: 'Service Master', path: '/servicemaster' },
    { label: 'Room Type Master', path: '/roomtypemaster' },
    { label: 'Room Master', path: '/roommasterr' },
    { label: 'Shift Master', path: '/shiftmaster' },
    { label: 'Diagnosis Master', path: '/diagnosismaster' },
    { label: 'Discount Master', path: '/discountmaster' },
    { label: 'Tax Master', path: '/taxmaster' },
    { label: 'Insurance Master', path: '/insurancemaster' },
    { label: 'Ambulance Master', path: '/ambulancemaster' }

  ]



  },
};

const SidebarItem = ({ label, icon: Icon, children, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
          isActive ? "bg-blue-50" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-gray-500" />}
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <IoIosArrowDown
          className={`w-4 h-4 text-gray-500 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out bg-gray-50 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="py-2 px-4 space-y-1">
          {children}
        </div>
      </div>
    </div>
  );
}

const Sidebar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [name,setName] = useState("");
  const [loginTime, setLoginTime] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await apiClient.get("user/loggedInUserInfo");
        setName(response?.data?.username || "Guest");
        setLoginTime(new Date(response?.data?.loginTime).toLocaleString());
      } catch (error) {
        console.error("Error fetching user info:", error);
        setName("Guest");
        setLoginTime("");
      }
    };

    fetchUserInfo();
  }, []);

  const navigationItems = Object.entries(navigationConfig).map(
    ([section, { icon, items }]) => (
      <SidebarItem
        key={section}
        label={section}
        icon={icon}
        isActive={items.some((item) => item.path === pathname)}
      >
        {items.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block p-2 text-sm text-gray-700 hover:text-blue-700 transition-colors ${
              pathname === item.path ? "font-semibold text-blue-700" : ""
            }`}
            prefetch
          >
            {item.label}
          </Link>
        ))}
      </SidebarItem>
    )
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 z-50 w-full bg-white shadow-md p-4">
        <button
          className="p-2 hover:bg-gray-100 rounded-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <MdClose className="w-6 h-6 text-gray-600" />
          ) : (
            <MdMenu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar Container */}
      <div
      className={`sidebar-container fixed inset-y-0 left-0 z-40 w-72 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-xl`}
      >
        {/* User Info Section */}
        <div className="sticky top-0 bg-white z-10 border-b">
          <div className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-blue-600 uppercase">
                {name}
              </span>
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
                onClick={() => setIsSidebarOpen(false)}
              >
                <MdClose className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <span className="block text-sm text-blue-600 font-normal">
              SUPERADMIN
            </span>
            <span className="block text-xs text-blue-600">
              Login: {loginTime}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="h-[calc(100vh-100px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-20">
          {navigationItems}
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;

