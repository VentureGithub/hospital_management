"use client";
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { useEffect, useState } from "react";
import { FaPencilAlt, FaPlus, FaTrash ,FaStethoscope,FaSync,FaSave ,FaExclamationCircle } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';
import { toast } from 'sonner';

export function DoctorMaster() {
    return (
        <LayoutForm>
            <DoctorMasterform />
           </LayoutForm>
    );
}

const DoctorMasterform = () => {
    const [data, setData] = useState([]);
    const [drdata, setDrData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [qualifications, setQualifications] = useState([{ value: '', isOther: false }]);

    // Validation schema with array of qualifications
    const validationSchema = Yup.object({
        // doctorRegNo: Yup.string().required("Registration number is required")
        //     .matches(/^[0-9]+$/, 'Registration number can only contain numbers'),
        deptId: Yup.number()
            .required("Department is required")
            .positive("Department ID must be a positive number")
            .integer("Department ID must be an integer"),
        drName: Yup.string().required("Doctor name is required")
            .matches(/^[a-zA-Z\s]+$/, 'Department Name should only contain letters and spaces'),
        consultancyCharge: Yup.number()
            .required("Consultancy charge is required")
            .positive("Must be a positive number"),
        gender: Yup.string().required("Gender is required"),
        address: Yup.string().required("Address is required")
            .matches(/^[a-zA-Z\s]+$/, 'Department Name should only contain letters and spaces'),
        joiningDt: Yup.date().required("Joining date is required"),
        contactNo: Yup.string().required("Contact number is required")
            .matches(/^[0-9]+$/, 'Registration number can only contain numbers'),
    });

    const formik = useFormik({
        initialValues: {
            drId: 0,
            deptId: 0,
            doctorRegNo: "",
            drName: "",
            gender: "",
            address: "",
            contactNo: "",
            consultancyCharge: "",
            doctorCharge: "",
            joiningDt: "",
            age: "",
            licenceNo: "",
            doctorSpecialization: "",
            relievingDt: "",
            qualification: []
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                // Get qualifications array from the qualifications state
                const qualificationsArray = qualifications
                    .map(q => q.isOther ? q.otherValue : q.value)
                    .filter(q => q); // Remove empty values
    
                // Create submission object with qualifications as array
                const submissionValues = {
                    ...values,
                    qualification: qualificationsArray  // Send as array, not joined string
                };
    
                if (isEdit) {
                    const response = await apiClient.put(
                        `doc/updateDocDetails?doctorId=${values.drId}`,
                        submissionValues
                    );
                    if (response.status === 200) {
                        toast.success("Data updated successfully");
                        setIsEdit(false);
                        formik.resetForm();
                        setQualifications([{ value: '', isOther: false }]);
                        fetchApi();
                    }
                } else {
                    const response = await apiClient.post("doc/saveDoc", submissionValues);
                    if (response.status === 200) {
                        toast.success("Data saved successfully");
                        formik.resetForm();
                        setQualifications([{ value: '', isOther: false }]);
                        fetchApi();
                    }
                }
            } catch (error) {
                console.error("Error:", error);
                toast.error("An error occurred. Please try again.");
            }
        }
    });

    const fetchApi = async () => {
        try {
            const response = await apiClient.get(`doc/getAllDoc`);
            setDrData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);


    useEffect(() => {
        const fetchRoomType = async () => {
            try {
                const response = await apiClient.get(`dep/getAllDepartmentByGrade?grade=A`);
                setData(response.data.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
        fetchRoomType();
    }, [])


const handleUpdate = (dr) => {
    try {
        console.log(dr)
        // Format joining date if it exists
        const formattedJoiningDate = dr.joiningDt ? new Date(dr.joiningDt).toISOString().split('T')[0] : '';


        // Update form values
        formik.setValues({
            drId: dr.drId || '',
            deptId: dr.deptId || '',
            doctorRegNo: dr.doctorRegNo || '',
            drName: dr.drName || '',
            gender: dr.gender || '',
            address: dr.address || '',
            contactNo: dr.contactNo || '',
            consultancyCharge: dr.consultancyCharge || '',
            doctorCharge: dr.doctorCharge || '',
            joiningDt: formattedJoiningDate,
            age: dr.age || '',
            licenceNo: dr.licenceNo || '',
            doctorSpecialization: dr.doctorSpecialization || '',
            // qualification: dr.qualification || '',
        });

        // Set edit mode
        setIsEdit(true);

        // Optionally scroll to form
        // window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error in handleUpdate:', error);
        // Optionally show error message to user
    }
};
    
    // Add new qualification field
    const addQualification = () => {
        setQualifications([...qualifications, { value: '', isOther: false }]);
    };

    // Remove qualification field
    const removeQualification = (index) => {
        const newQualifications = qualifications.filter((_, i) => i !== index);
        setQualifications(newQualifications);
    };

    // Handle qualification change
    const handleQualificationChange = (index, value) => {
        const newQualifications = [...qualifications];
        if (value === 'Other') {
            newQualifications[index] = { value: 'Other', isOther: true, otherValue: '' };
        } else {
            newQualifications[index] = { value, isOther: false };
        }
        setQualifications(newQualifications);
    };

    // Handle other qualification input
    const handleOtherQualificationChange = (index, value) => {
        const newQualifications = [...qualifications];
        newQualifications[index].otherValue = value;
        setQualifications(newQualifications);
    };


    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                 <div className="p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6 rounded-xl shadow-2xl border border-sky-100">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
            <FaStethoscope size={18} />
          </div>
          <Heading headingText="Doctor Master" />
        </div>
        <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">
          Master • Doctor
        </div>
      </div>
                   <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 lg:w-[100%] py-4">
  {/* Reg. No. */}
  <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
    <label className="block font-semibold text-sm mb-2 text-sky-800">Reg. No.</label>
    <input
      type="text"
      name="doctorRegNo"
      readOnly
      onChange={formik.handleChange}
      value={formik.values.doctorRegNo}
      className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
    />
    {formik.touched.doctorRegNo && formik.errors.doctorRegNo && (
      <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
        <FaExclamationCircle /> {formik.errors.doctorRegNo}
      </div>
    )}
  </div>

  {/* Department */}
  <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
    <label className="block font-semibold text-sm mb-2 text-sky-800">Department</label>
    <select
      name="deptId"
      onChange={formik.handleChange}
      value={formik.values.deptId}
      className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
    >
      <option value="">Select department</option>
      {data.map((dept) => (
        <option value={dept.deptId} key={dept.deptId}>{dept.depName}</option>
      ))}
    </select>
    {formik.touched.deptId && formik.errors.deptId && (
      <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
        <FaExclamationCircle /> {formik.errors.deptId}
      </div>
    )}
  </div>

  {/* Dr. Name */}
  <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
    <label className="block font-semibold text-sm mb-2 text-sky-800">Dr. Name</label>
    <input
      type="text"
      name="drName"
      onChange={formik.handleChange}
      value={formik.values.drName}
      className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
    />
    {formik.touched.drName && formik.errors.drName && (
      <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
        <FaExclamationCircle /> {formik.errors.drName}
      </div>
    )}
  </div>

  {/* Charges */}
  <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
    <label className="block font-semibold text-sm mb-2 text-sky-800">Charges</label>
    <input
      type="text"
      name="consultancyCharge"
      onChange={formik.handleChange}
      value={formik.values.consultancyCharge}
      className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
    />
    {formik.touched.consultancyCharge && formik.errors.consultancyCharge && (
      <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
        <FaExclamationCircle /> {formik.errors.consultancyCharge}
      </div>
    )}
  </div>

  {/* Dr. Charges */}
  <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
    <label className="block font-semibold text-sm mb-2 text-sky-800">Dr. Charges</label>
    <input
      type="text"
      name="doctorCharge"
      onChange={formik.handleChange}
      value={formik.values.doctorCharge}
      className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
    />
    {formik.touched.doctorCharge && formik.errors.doctorCharge && (
      <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
        <FaExclamationCircle /> {formik.errors.doctorCharge}
      </div>
    )}
  </div>

  {/* Age */}
  <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
    <label className="block font-semibold text-sm mb-2 text-sky-800">Age</label>
    <input
      type="text"
      name="age"
      onChange={formik.handleChange}
      value={formik.values.age}
      className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
    />
    {formik.touched.age && formik.errors.age && (
      <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
        <FaExclamationCircle /> {formik.errors.age}
      </div>
    )}
  </div>

  {/* licence No */}
  <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
    <label className="block font-semibold text-sm mb-2 text-sky-800">Licence No</label>
    <input
      type="text"
      name="licenceNo"
      onChange={formik.handleChange}
      value={formik.values.licenceNo}
      className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
    />
    {formik.touched.licenceNo && formik.errors.licenceNo && (
      <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
        <FaExclamationCircle /> {formik.errors.licenceNo}
      </div>
    )}
  </div>
                       <div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
                                <label className="block font-semibold text-sm mb-2 text-sky-800">Specialization</label>
                                <input
                                    type="text"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${formik.touched.doctorSpecialization && formik.errors.doctorSpecialization ? 'border-red-500' : ''}`}
                                    name="doctorSpecialization"
                                    onChange={formik.handleChange}
                                    value={formik.values.doctorSpecialization}
                                />
                                {formik.touched.doctorSpecialization && formik.errors.doctorSpecialization && (
                                    <div className="text-red-500 text-sm">{formik.errors.doctorSpecialization}</div>
                                )}
                        </div>
                       {/* Gender */}
<div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
  <label className="block font-semibold text-sm mb-2 text-sky-800">Gender</label>
  <select
    name="gender"
    onChange={formik.handleChange}
    value={formik.values.gender}
    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
  >
    <option value="">--select gender--</option>
    <option value="male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
  {formik.touched.gender && formik.errors.gender && (
    <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
      <FaExclamationCircle /> {formik.errors.gender}
    </div>
  )}
</div>

{/* Qualification */}
<div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
  <label className="block font-semibold text-sm mb-2 text-sky-800">Qualification</label>
  {qualifications.map((qual, index) => (
    <div key={index} className="flex items-center mb-2">
      <div className="flex-1">
        <select
          className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
          value={qual.value}
          onChange={(e) => handleQualificationChange(index, e.target.value)}
        >
          <option value="">Select Qualification</option>
          <option value="MBBS">MBBS</option>
          <option value="MD">MD</option>
          <option value="MS">MS</option>
          <option value="DM">DM</option>
          <option value="DNB">DNB</option>
          <option value="BDS">BDS</option>
          <option value="MDS">MDS</option>
          <option value="BAMS">BAMS</option>
          <option value="BHMS">BHMS</option>
          <option value="Other">Other</option>
        </select>
        {qual.isOther && (
          <input
            type="text"
            placeholder="Please specify qualification"
            value={qual.otherValue || ''}
            onChange={(e) => handleOtherQualificationChange(index, e.target.value)}
            className="w-full mt-2 text-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
          />
        )}
      </div>
      <div className="flex ml-2">
        {index === qualifications.length - 1 && (
          <button
            type="button"
            onClick={addQualification}
            className="bg-blue-500 text-white text-sm p-2 rounded-lg hover:bg-blue-700 mr-2"
          >
            <FaPlus />
          </button>
        )}
        {qualifications.length > 1 && (
          <button
            type="button"
            onClick={() => removeQualification(index)}
            className="bg-red-500 text-white p-2 text-sm rounded-lg hover:bg-red-700"
          >
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  ))}
</div>

{/* Address */}
<div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
  <label className="block font-semibold text-sm mb-2 text-sky-800">Address</label>
  <input
    type="text"
    name="address"
    onChange={formik.handleChange}
    value={formik.values.address}
    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
  />
  {formik.touched.address && formik.errors.address && (
    <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
      <FaExclamationCircle /> {formik.errors.address}
    </div>
  )}
</div>

{/* Joining Date */}
<div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
  <label className="block font-semibold text-sm mb-2 text-sky-800">Joining Date</label>
  <input
    type="date"
    name="joiningDt"
    onChange={formik.handleChange}
    value={formik.values.joiningDt}
    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
  />
  {formik.touched.joiningDt && formik.errors.joiningDt && (
    <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
      <FaExclamationCircle /> {formik.errors.joiningDt}
    </div>
  )}
</div>

{/* Relieving Date */}
<div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
  <label className="block font-semibold text-sm mb-2 text-sky-800">Relieving Date</label>
  <input
    type="date"
    name="relievingDt"
    onChange={formik.handleChange}
    value={formik.values.relievingDt}
    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
  />
  {formik.touched.relievingDt && formik.errors.relievingDt && (
    <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
      <FaExclamationCircle /> {formik.errors.relievingDt}
    </div>
  )}
</div>

{/* Contact No */}
<div className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm">
  <label className="block font-semibold text-sm mb-2 text-sky-800">Contact No.</label>
  <input
    type="text"
    name="contactNo"
    onChange={formik.handleChange}
    value={formik.values.contactNo}
    className="w-full px-4 py-2 border text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 border-gray-200"
  />
  {formik.touched.contactNo && formik.errors.contactNo && (
    <div className="mt-2 inline-flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-100 px-3 py-1 rounded-md">
      <FaExclamationCircle /> {formik.errors.contactNo}
    </div>
  )}
</div>

                    </div>
                   <div className="flex justify-start w-full gap-3 px-4 mt-2">
                                   <button
                                     type="button"
                                     onClick={() => {
                                       handleReset();
                                       setIsEdit(false);
                                     }}
                                     className="inline-flex items-center gap-2 bg-slate-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-slate-800 active:scale-[.99] transition"
                                   >
                                     <FaSync /> Refresh
                                   </button>
                   
                                   <button
                                     type="submit"
                                     className="inline-flex items-center gap-2 bg-emerald-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-emerald-800 active:scale-[.99] transition"
                                   >
                                     <FaSave /> {isEdit ? "Update" : "Save"}
                                   </button>
                                 </div>
           
<div className="bg-white  my-2  rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <div
                        className="w-full"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                        <table className="table-auto w-full border border-gray-100 border-collapse shadow-sm rounded-md overflow-hidden">
  <thead className="sticky top-0 z-10">
    <tr className="text-center bg-gradient-to-r from-sky-50 to-sky-100 backdrop-blur">


                                   <th className="px-3 py-2 border border-gray-100 text-sky-700 text-[11px] tracking-wide">
Action</th>
                                   <th className="px-3 py-2 border border-gray-100 text-sky-700 text-[11px] tracking-wide">
Reg. No.</th>
                                   <th className="px-3 py-2 border border-gray-100 text-sky-700 text-[11px] tracking-wide">
Department</th>
                                   <th className="px-3 py-2 border border-gray-100 text-sky-700 text-[11px] tracking-wide">
Name</th>
                                   <th className="px-3 py-2 border border-gray-100 text-sky-700 text-[11px] tracking-wide">
Gender</th>
                                   <th className="px-3 py-2 border border-gray-100 text-sky-700 text-[11px] tracking-wide">
Qualification</th>
                                   <th className="px-3 py-2 border border-gray-100 text-sky-700 text-[11px] tracking-wide">
Charges</th>
                                   <th className="px-3 py-2 border border-gray-100 text-sky-700 text-[11px] tracking-wide">
Contact No</th>
                                   <th className="px-3 py-2 border border-gray-100 text-sky-700 text-[11px] tracking-wide">
Joining Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(drdata) && drdata.length > 0 ? (
                                    drdata.map((data, index) => (
                                        <tr
                                            key={index}
                                            className="border border-gray-200 text-center">
        <td className="px-2 py-2 border border-gray-100 text-center w-[70px]">
  <button
    type="button"
    className="text-sky-600 hover:text-sky-800 flex items-center justify-center mx-auto"
    onClick={() => handleUpdate(data)}
  >
    <FaPencilAlt className="text-[12px]" />
  </button>
</td>
                                            <td className="px-3 py-2 border border-gray-100 text-[12px] text-gray-800 uppercase">
{data.doctorRegNo}</td>
                                            <td className="px-3 py-2 border border-gray-100 text-[12px] text-gray-800 uppercase">
{data.depName}</td>
                                            <td className="px-3 py-2 border border-gray-100 text-[12px] text-gray-800 uppercase">
{data.drName}</td>
                                            <td className="px-3 py-2 border border-gray-100 text-[12px] text-gray-800 uppercase">
{data.gender}</td>
                                            <td className="px-3 py-2 border border-gray-100 text-[12px] text-gray-800 uppercase">
{data.qualification}</td>
                                            <td className="px-3 py-2 border border-gray-100 text-[12px] text-gray-800 uppercase">
{data.consultancyCharge}</td>
                                            <td className="px-3 py-2 border border-gray-100 text-[12px] text-gray-800 uppercase">
{data.contactNo}</td>
                                            <td className="px-3 py-2 border border-gray-100 text-[12px] text-gray-800 uppercase">
{data.joiningDt}</td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="text-center">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            </div>
            </form>
            
           
        </>
    );
};


export default withAuth(DoctorMaster, ['SUPERADMIN', 'ADMIN', 'DOCTOR'])
