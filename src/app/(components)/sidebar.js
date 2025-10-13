 'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  IoIosArrowDown
} from "react-icons/io";
import { 
  FaHospital, FaUserMd, FaUserNurse, FaStethoscope, FaPills, FaFileMedical,
  FaReceipt, FaClipboardList, FaChartLine, FaUserTie, FaCog, FaMicroscope,
  FaFilePdf, FaSignOutAlt
} from "react-icons/fa";
import { 
  MdStore, MdBuild, MdMenu, MdClose, MdLocalHospital, MdPeople, 
  MdAccountBalance, MdAccountCircle, MdNotifications, MdSecurity,MdScience
} from "react-icons/md";
import { 
  HiOutlineOfficeBuilding, HiOutlineDocumentReport, HiOutlineUserGroup
} from "react-icons/hi";
import { IoMdCalendar, IoMdCash, IoMdTime, IoMdDocument, IoMdMedical, IoMdFlask } from "react-icons/io";

const navigationConfig = {
  "Patient Care": {
    icon: FaHospital,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    roles: ["SUPERADMIN", "ADMIN", "RECEPTIONIST"],
    items: [
       { label: 'OPD Registration', path: '/opdregistrationform', icon: FaUserMd,roles: ["SUPERADMIN", "ADMIN", "RECEPTIONIST"], },
      { label: 'IPD Registration', path: '/ipdregistrationform', icon: FaUserNurse,roles: ["SUPERADMIN", "ADMIN", "RECEPTIONIST"], },
      { label: 'Patient Services', path: '/patientDemandDue', icon: FaStethoscope,roles: ["SUPERADMIN", "ADMIN", "RECEPTIONIST"], },
      { label: 'Medicine Chart', path: '/medicinechart', icon: FaPills,roles: ["SUPERADMIN", "ADMIN", "RECEPTIONIST"], },
      { label: 'Birth Certificate', path: '/birthcertificatee', icon: FaFileMedical,roles: ["SUPERADMIN", "ADMIN", "RECEPTIONIST"], },
      { label: 'Discharge Bill', path: '/dischargePatientBill', icon: FaReceipt,roles: ["SUPERADMIN", "ADMIN", "RECEPTIONIST"], },
      { label: 'Discharge Summary', path: '/dischargesummary', icon: FaClipboardList,roles: ["SUPERADMIN", "ADMIN", "RECEPTIONIST"], },
      { label: 'Medical Certificate', path: '/medicalCertificate', icon: FaFileMedical,roles: ["SUPERADMIN", "ADMIN", "RECEPTIONIST"], },
      { label: 'Patient History', path: '/patienthistory', icon: FaChartLine,roles: ["SUPERADMIN", "ADMIN", "RECEPTIONIST"], },
      { label: 'Ambulance Booking', path: '/ambulancebooking', icon: MdLocalHospital,roles: ["SUPERADMIN", "ADMIN", "RECEPTIONIST"], }
    
    ]
  },
  "Pharmacy": {
    icon: FaPills,
    color: "text-green-600",
    bgColor: "bg-green-50",
    roles: ["SUPERADMIN", "ADMIN"],
    items: [
     { label: 'Category Master', path: '/categorymaster', icon: FaCog,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Company Master', path: '/companymaster', icon: HiOutlineOfficeBuilding,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'HSN Master', path: '/hsnmaster', icon: MdBuild,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Supplier Master', path: '/suppliermasterstore', icon: MdPeople,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Purchase Invoice', path: '/purchase', icon: FaReceipt,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Purchase Return', path: '/purchasereturn', icon: IoMdDocument,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Item Master', path: '/itemmaster', icon: MdBuild,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Salt Master', path: '/saltmaster', icon: FaPills,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Opening Stock', path: '/openingstock', icon: MdStore,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Sale Invoice', path: '/saleinvoice', icon: FaReceipt,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Sale Return', path: '/salereturn', icon: IoMdDocument,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Sale Report', path: '/salereport', icon: FaChartLine,roles: ["SUPERADMIN", "ADMIN"], }
      
    ]
  },

   "Diagnostics": {
    icon: MdScience,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    roles: ["SUPERADMIN", "ADMIN"],
    items: [
      { label: 'Test Type Master', path: '/testtypemaster', icon: FaMicroscope,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Test Category Master', path: '/testcategorymaster', icon: IoMdFlask,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Test Master', path: '/testmaster', icon: MdScience,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Blood Purchase', path: '/bloodsugarstrippurchase', icon: IoMdMedical,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Lab Material Purchase', path: '/labmaterialpurchase', icon: MdStore,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'X-Ray Master', path: '/xraymaster', icon: IoMdMedical,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Ultrasound Master', path: '/ultrasoundmaster', icon: IoMdMedical,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Sub Test Master', path: '/subtestmaster', icon: FaMicroscope,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Test Booking', path: '/testbooking', icon: IoMdCalendar,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Blood Sugar Strip Pur.', path: '/bloodsugarstrippurreport', icon: FaChartLine,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Material Purchase', path: '/materialpurchasereport', icon: FaChartLine,roles: ["SUPERADMIN", "ADMIN"], }
    ]
  },
  "Store Management": {
    icon: MdStore,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    roles: ["SUPERADMIN", "ADMIN"],
    items: [
      { label: 'Supplier Master', path: '/suppliermaster', icon: MdPeople,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Item Master', path: '/itemmasterrr', icon: MdBuild,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Floor Master', path: '/floormaster', icon: HiOutlineOfficeBuilding,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Issue Assets', path: '/issueassets', icon: IoMdDocument,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Return Assets', path: '/returnassets', icon: IoMdDocument,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Purchase Invoice', path: '/purchaseinvoice', icon: FaReceipt,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Purchase Invoice Report', path: '/purchaseinvoicereport', icon: FaChartLine,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Lost/Condem/Short Asset', path: '/lostcondemshortasset', icon: MdNotifications,roles: ["SUPERADMIN", "ADMIN"], }
    ]
  },
  
  "HR Management": {
    icon: FaUserTie,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    roles: ["SUPERADMIN", "ADMIN"],
    items: [
     { label: 'Designation Master', path: '/designationmaster', icon: MdBuild, roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Employee Joining', path: '/employee', icon: MdPeople, roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Employee Attendance', path: '/employeeattendance', icon: IoMdCalendar, roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Employee Detail Report', path: '/employeedetailreport', icon: FaChartLine, roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Salary Addition', path: '/salaryaddition', icon: IoMdCash, roles: ["SUPERADMIN", "ADMIN"], },
       { label: 'Salary Deduction', path: '/salarydeduction', icon: IoMdCash, roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Salary Add/Deduction Report', path: '/salarydeductionreport', icon: FaChartLine, roles: ["SUPERADMIN", "ADMIN"], },
     
      
    ]
  },
    "Reports": {
    icon: HiOutlineDocumentReport,
    color: "text-red-600",
    bgColor: "bg-red-50",
    roles: ["SUPERADMIN", "ADMIN"],
    items: [
      { label: 'IPD Patient In Discharge', path: '/ipdpatientindischarge', icon: FaChartLine,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'OPD Patient Report', path: '/opdpatientreport', icon: FaChartLine,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Patient Room Report', path: '/patientroomreport', icon: FaChartLine,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Discharge Summary Report', path: '/dischargesummaryreport', icon: FaChartLine,roles: ["SUPERADMIN", "ADMIN"], }
    ]
  },
  "Accounts": {
    icon: MdAccountBalance,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    roles: ["SUPERADMIN", "ADMIN"],
    items: [
      { label: 'Account Group', path: '/accountgroup', icon: HiOutlineUserGroup,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Account Ledger', path: '/accountledger', icon: FaChartLine,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Bank Payment', path: '/bankpayment', icon: IoMdCash,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Cash Payment', path: '/cashpayment', icon: IoMdCash,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Journal Voucher', path: '/journalvoucher', icon: FaReceipt,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Journal Voucher Report', path: '/journalvoucherreport', icon: FaChartLine,roles: ["SUPERADMIN", "ADMIN"], }
    ]
  },
    "Master Data": {
    icon: MdBuild,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    roles: ["SUPERADMIN", "ADMIN"],
    items: [
      { label: 'Medicine Time', path: '/medicinetimemaster', icon: IoMdTime,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Department Master', path: '/departmentMaster', icon: HiOutlineOfficeBuilding,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Doctor Master', path: '/doctormasterr', icon: FaUserMd,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Service Type Master', path: '/servicetypemaster', icon: MdBuild,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Service Master', path: '/servicemaster', icon: MdBuild ,roles: ["SUPERADMIN", "ADMIN"],},
      { label: 'Room Type Master', path: '/roomtypemaster', icon: MdLocalHospital,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Room Master', path: '/roommasterr', icon: MdLocalHospital,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Shift Master', path: '/shiftmaster', icon: IoMdTime ,roles: ["SUPERADMIN", "ADMIN"],},
      { label: 'Diagnosis Master', path: '/diagnosismaster', icon: FaStethoscope,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Discount Master', path: '/discountmaster', icon: IoMdCash,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Tax Master', path: '/taxmaster', icon: IoMdCash,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Insurance Master', path: '/insurancemaster', icon: MdSecurity,roles: ["SUPERADMIN", "ADMIN"], },
      { label: 'Ambulance Master', path: '/ambulancemaster', icon: MdLocalHospital,roles: ["SUPERADMIN", "ADMIN"], }
    ]
  }
};

const SidebarItem = ({
  label, icon: Icon, children, isActive, color, bgColor, isOpen, onToggle
}) => (
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
      <div className="py-2 px-4 space-y-1 bg-gray-50/50">{children}</div>
    </div>
  </div>
);

const Sidebar = () => {
  const pathname = usePathname();
  // Mobile hamburger toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // User info & role
  const [name, setName] = useState("");
  const [loginTime, setLoginTime] = useState("");
  const [userRole, setUserRole] = useState("");
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    
    const storedName = localStorage.getItem('name') || localStorage.getItem('userName') || 'Guest';
    const role = localStorage.getItem('role') || 'ADMIN';
    const storedLoginTime = localStorage.getItem('loginTime');
    setName(storedName);
    setUserRole(role);
    setLoginTime(storedLoginTime ? new Date(storedLoginTime).toLocaleString() : "");
    // Restore navbar open state
    try {
      const saved = localStorage.getItem('sidebarOpenSections');
      if (saved) setOpenSections(JSON.parse(saved));
    } catch (_) {}
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => {
      const next = { ...prev, [section]: !prev[section] };
      try { localStorage.setItem('sidebarOpenSections', JSON.stringify(next)); } catch (_) {}
      return next;
    });
  };

  
  const navigationItems = Object.entries(navigationConfig)
    .filter(([_, sectionCfg]) => !sectionCfg.roles || sectionCfg.roles.includes(userRole))
    .map(([section, { icon, items, color, bgColor }]) => {
      // Only show items allowed for the role
      const filteredItems = items.filter(item => !item.roles || item.roles.includes(userRole));
      if (filteredItems.length === 0) return null; // hide section if no items
      return (
        <SidebarItem
          key={section}
          label={section}
          icon={icon}
          color={color}
          bgColor={bgColor}
          isActive={filteredItems.some((item) => item.path === pathname)}
          isOpen={!!openSections[section]}
          onToggle={() => toggleSection(section)}
        >
          {filteredItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 p-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-all duration-200 group
                ${pathname === item.path ? "bg-white text-blue-700 font-semibold shadow-sm border-l-2 border-l-blue-500" : ""}`}
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
      );
    })
    .filter(Boolean);

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
          </div>
        </div>

        {/* Navigation Items */}
        <div className="h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="p-4">{navigationItems}</div>
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

