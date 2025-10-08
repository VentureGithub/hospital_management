
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

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import apiClient from "@/app/config";

// Healthcare-focused icons
import { 
  IoIosArrowDown, 
  IoMdMedical, 
  IoMdTime,
  IoMdCalendar,
  IoMdPerson,
  IoMdSettings,
  IoMdAnalytics,
  IoMdCash,
  IoMdClipboard,
  IoMdFlask,
  IoMdStore,
  IoMdPeople,
  IoMdDocument,
  IoMdBuild,
  IoMdHome,
  IoMdLogOut
} from "react-icons/io";

import { 
  FaUserMd, 
  FaUserNurse, 
  FaHospital, 
  FaStethoscope,
  FaPills,
  FaMicroscope,
  FaFileMedical,
  FaChartLine,
  FaReceipt,
  FaUserTie,
  FaClipboardList,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

import { 
  MdMenu, 
  MdClose, 
  MdDashboard,
  MdAccountCircle,
  MdLocalHospital,
  MdPharmacy,
  MdScience,
  MdStore,
  MdPeople,
  MdAssessment,
  MdAccountBalance,
  MdBuild,
  MdNotifications,
  MdSecurity
} from "react-icons/md";

import { 
  HiOutlineOfficeBuilding,
  HiOutlineDocumentReport,
  HiOutlineCog,
  HiOutlineUserGroup,
  HiOutlineClipboardList
} from "react-icons/hi";

const navigationConfig = {
  "Patient Care": {
    icon: FaHospital,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    items: [
      { label: 'OPD Registration', path: '/opdregistrationform', icon: FaUserMd },
      { label: 'IPD Registration', path: '/ipdregistrationform', icon: FaUserNurse },
      { label: 'Patient Services', path: '/patientDemandDue', icon: FaStethoscope },
      { label: 'Medicine Chart', path: '/medicinechart', icon: FaPills },
      { label: 'Birth Certificate', path: '/birthcertificatee', icon: FaFileMedical },
      { label: 'Discharge Bill', path: '/dischargePatientBill', icon: FaReceipt },
      { label: 'Discharge Summary', path: '/dischargesummary', icon: FaClipboardList },
      { label: 'Medical Certificate', path: '/medicalCertificate', icon: FaFileMedical },
      { label: 'Patient History', path: '/patienthistory', icon: FaChartLine },
      { label: 'Ambulance Booking', path: '/ambulancebooking', icon: MdLocalHospital }
    ]
  },
  "Pharmacy": {
    icon: FaPills,
    color: "text-green-600",
    bgColor: "bg-green-50",
    items: [
      { label: 'Category Master', path: '/categorymaster', icon: FaCog },
      { label: 'Company Master', path: '/companymaster', icon: HiOutlineOfficeBuilding },
      { label: 'HSN Master', path: '/hsnmaster', icon: MdBuild },
      { label: 'Supplier Master', path: '/suppliermasterstore', icon: MdPeople },
      { label: 'Purchase Invoice', path: '/purchase', icon: FaReceipt },
      { label: 'Purchase Return', path: '/purchasereturn', icon: IoMdDocument },
      { label: 'Item Master', path: '/itemmaster', icon: MdBuild },
      { label: 'Salt Master', path: '/saltmaster', icon: FaPills },
      { label: 'Opening Stock', path: '/openingstock', icon: MdStore },
      { label: 'Sale Invoice', path: '/saleinvoice', icon: FaReceipt },
      { label: 'Sale Return', path: '/salereturn', icon: IoMdDocument },
      { label: 'Sale Report', path: '/salereport', icon: FaChartLine }
    ]
  },
  "Diagnostics": {
    icon: MdScience,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    items: [
      { label: 'Test Type Master', path: '/testtypemaster', icon: FaMicroscope },
      { label: 'Test Category Master', path: '/testcategorymaster', icon: IoMdFlask },
      { label: 'Test Master', path: '/testmaster', icon: MdScience },
      { label: 'Blood Purchase', path: '/bloodsugarstrippurchase', icon: IoMdMedical },
      { label: 'Lab Material Purchase', path: '/labmaterialpurchase', icon: MdStore },
      { label: 'X-Ray Master', path: '/xraymaster', icon: IoMdMedical },
      { label: 'Ultrasound Master', path: '/ultrasoundmaster', icon: IoMdMedical },
      { label: 'Sub Test Master', path: '/subtestmaster', icon: FaMicroscope },
      { label: 'Test Booking', path: '/testbooking', icon: IoMdCalendar },
      { label: 'Blood Sugar Strip Pur.', path: '/bloodsugarstrippurreport', icon: FaChartLine },
      { label: 'Material Purchase', path: '/materialpurchasereport', icon: FaChartLine }
    ]
  },
  "Store Management": {
    icon: MdStore,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    items: [
      { label: 'Supplier Master', path: '/suppliermaster', icon: MdPeople },
      { label: 'Item Master', path: '/itemmasterrr', icon: MdBuild },
      { label: 'Floor Master', path: '/floormaster', icon: HiOutlineOfficeBuilding },
      { label: 'Issue Assets', path: '/issueassets', icon: IoMdDocument },
      { label: 'Return Assets', path: '/returnassets', icon: IoMdDocument },
      { label: 'Purchase Invoice', path: '/purchaseinvoice', icon: FaReceipt },
      { label: 'Purchase Invoice Report', path: '/purchaseinvoicereport', icon: FaChartLine },
      { label: 'Lost/Condem/Short Asset', path: '/lostcondemshortasset', icon: MdNotifications }
    ]
  },
  "HR Management": {
    icon: FaUserTie,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    items: [
      { label: 'Designation Master', path: '/designationmaster', icon: MdBuild },
      { label: 'Employee Joining', path: '/employee', icon: MdPeople },
      { label: 'Employee Attendance', path: '/employeeattendance', icon: IoMdCalendar },
      { label: 'Employee Detail Report', path: '/employeedetailreport', icon: FaChartLine },
      { label: 'Salary Deduction', path: '/salarydeduction', icon: IoMdCash },
      { label: 'Generate Salary', path: '/generatesalary', icon: FaReceipt },
      { label: 'Salary Add/Deduction Report', path: '/salarydeductionreport', icon: FaChartLine },
      { label: 'Salary Increment', path: '/employeesalaryincrement', icon: IoMdCash }
    ]
  },
  "Reports": {
    icon: HiOutlineDocumentReport,
    color: "text-red-600",
    bgColor: "bg-red-50",
    items: [
      { label: 'IPD Patient In Discharge', path: '/ipdpatientindischarge', icon: FaChartLine },
      { label: 'OPD Patient Report', path: '/opdpatientreport', icon: FaChartLine },
      { label: 'Patient Room Report', path: '/patientroomreport', icon: FaChartLine },
      { label: 'Discharge Summary Report', path: '/dischargesummaryreport', icon: FaChartLine }
    ]
  },
  "Accounts": {
    icon: MdAccountBalance,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    items: [
      { label: 'Account Group', path: '/accountgroup', icon: HiOutlineUserGroup },
      { label: 'Account Ledger', path: '/accountledger', icon: FaChartLine },
      { label: 'Bank Payment', path: '/bankpayment', icon: IoMdCash },
      { label: 'Cash Payment', path: '/cashpayment', icon: IoMdCash },
      { label: 'Journal Voucher', path: '/journalvoucher', icon: FaReceipt },
      { label: 'Journal Voucher Report', path: '/journalvoucherreport', icon: FaChartLine }
    ]
  },
  "Master Data": {
    icon: MdBuild,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    items: [
      { label: 'Medicine Time', path: '/medicinetimemaster', icon: IoMdTime },
      { label: 'Department Master', path: '/departmentMaster', icon: HiOutlineOfficeBuilding },
      { label: 'Doctor Master', path: '/doctormasterr', icon: FaUserMd },
      { label: 'Service Type Master', path: '/servicetypemaster', icon: MdBuild },
      { label: 'Service Master', path: '/servicemaster', icon: MdBuild },
      { label: 'Room Type Master', path: '/roomtypemaster', icon: MdLocalHospital },
      { label: 'Room Master', path: '/roommasterr', icon: MdLocalHospital },
      { label: 'Shift Master', path: '/shiftmaster', icon: IoMdTime },
      { label: 'Diagnosis Master', path: '/diagnosismaster', icon: FaStethoscope },
      { label: 'Discount Master', path: '/discountmaster', icon: IoMdCash },
      { label: 'Tax Master', path: '/taxmaster', icon: IoMdCash },
      { label: 'Insurance Master', path: '/insurancemaster', icon: MdSecurity },
      { label: 'Ambulance Master', path: '/ambulancemaster', icon: MdLocalHospital }
    ]
  }
};

const SidebarItem = ({ label, icon: Icon, children, isActive, color, bgColor, isOpen, onToggle }) => {

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-200 group ${
          isActive ? `${bgColor} border-l-4 border-l-blue-500` : ""
        }`}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`p-2 rounded-lg ${isActive ? 'bg-white shadow-sm' : 'bg-gray-100 group-hover:bg-white'} transition-all duration-200`}>
              <Icon className={`w-5 h-5 ${isActive ? color : 'text-gray-600'}`} />
            </div>
          )}
          <span className={`text-sm font-semibold ${isActive ? 'text-gray-800' : 'text-gray-700'} group-hover:text-gray-800 transition-colors`}>
            {label}
          </span>
        </div>
        <IoIosArrowDown
          className={`w-4 h-4 text-gray-400 transform transition-all duration-200 ${
            isOpen ? "rotate-180 text-gray-600" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="py-2 px-4 space-y-1 bg-gray-50/50">
          {children}
        </div>
      </div>
    </div>
  );
}

const Sidebar = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [name, setName] = useState("");
  const [loginTime, setLoginTime] = useState("");
  const [userRole, setUserRole] = useState("");
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    // Read user info from localStorage set during login
    const storedName = localStorage.getItem('name') || localStorage.getItem('userName') || 'Guest';
    const role = localStorage.getItem('role') || 'ADMIN';
    const storedLoginTime = localStorage.getItem('loginTime');
    setName(storedName);
    setUserRole(role);
    setLoginTime(storedLoginTime ? new Date(storedLoginTime).toLocaleString() : "");
    // Load open sections state to keep dropdowns open across navigation
    try {
      const saved = localStorage.getItem('sidebarOpenSections');
      if (saved) {
        setOpenSections(JSON.parse(saved));
      }
    } catch (_) {}
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => {
      const next = { ...prev, [section]: !prev[section] };
      try { localStorage.setItem('sidebarOpenSections', JSON.stringify(next)); } catch (_) {}
      return next;
    });
  };

  const navigationItems = Object.entries(navigationConfig).map(
    ([section, { icon, items, color, bgColor }]) => (
      <SidebarItem
        key={section}
        label={section}
        icon={icon}
        color={color}
        bgColor={bgColor}
        isActive={items.some((item) => item.path === pathname)}
        isOpen={!!openSections[section]}
        onToggle={() => toggleSection(section)}
      >
        {items.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 p-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-all duration-200 group ${
              pathname === item.path ? "bg-white text-blue-700 font-semibold shadow-sm border-l-2 border-l-blue-500" : ""
            }`}
            prefetch={false}
            onClick={() => setIsSidebarOpen(false)}
          >
            {item.icon && (
              <item.icon className={`w-4 h-4 ${pathname === item.path ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
            )}
            <span className="flex-1">{item.label}</span>
          </Link>
        ))}
      </SidebarItem>
    )
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 z-50 w-full bg-white shadow-lg border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <MdLocalHospital className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">HMS</span>
          </div>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
      </div>

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl border-r border-gray-200`}
      >
        {/* Header Section */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 z-10">
          <div className="px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <MdLocalHospital className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold leading-tight">Hospital Management</h1>
                  <p className="text-blue-100 text-xs">System Dashboard</p>
                </div>
              </div>
              <button
                className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <MdClose className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {/* User Info */}
            {/* Kept minimal per user's request; uncomment if needed
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <MdAccountCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">{name}</p>
                <p className="text-blue-100 text-sm">{userRole}</p>
              </div>
            </div>
            <div className="text-xs text-blue-100 mt-1">
              <IoMdTime className="inline w-3 h-3 mr-1" />
              Login: {loginTime}
            </div>
            */}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="p-4">
            {navigationItems}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              © 2024 HMS System
            </div>
            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <FaSignOutAlt className="w-4 h-4 text-gray-500" />
            </button>
          </div>
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

