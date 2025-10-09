
'use client'
import LayoutForm from "../../layouts/layoutForm";
import Heading from "../../(components)/heding";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from 'sonner';
import { IoPrintOutline } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import apiClient from "@/app/config";
import withAuth from '@/app/(components)/WithAuth';

export function MedicalCertificate() {
  return (
    <LayoutForm>
      <MedicalCertificateForm />
    </LayoutForm>
  );
}


const MedicalCertificateForm = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState([]);
  const formikRef = useRef(); // Create a ref for Formik

  // Fetch all suppliers
  const fetchApi = async () => {
    try {
      const response = await apiClient.get(`api/patient-certificates`);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  const initialValues = {
    srNo: 0,
    patientName: "",
    patientAge: 0,
    gender: "",
    patientAddress: "",
    patientDiseases: "",
    patientOffice: "",
    consultantDoctor: "",
    doctorName: "",
    brFrom: "",
    brTo: ""
  };

  const validationSchema = Yup.object().shape({
    patientName: Yup.string().required('Name is required'),
    // patientAge: Yup.required('Age is required'),
    gender: Yup.string()
      .required('Gender is required'),
    patientAddress: Yup.string()
      .required('Patient Address Code is required'),
    patientDiseases: Yup.string().required('Diseases is required'),
    patientOffice: Yup.string().required('Office is required'),
    consultantDoctor: Yup.string()
      .required('Consultant Doctor is required'),
    doctorName: Yup.string().required('Dr Name is required'),
    brFrom: Yup.date()
      .required('Bf Date is required')
      .typeError('Bf Date must be a valid date'),
    brTo: Yup.date()
      .required('Bf To is required')
      .typeError('Bf To must be a valid date'),
  });

  const handleMedical = async (values) => {
    try {
      let response;

      if (isEdit) {
        // Update API call
        response = await apiClient.put(
          `api/patient-certificates/updateCertificate?srNo=${values.srNo}`, // Correct URL structure
          values
        );
        if (response.status === 200) {
          toast.success("Data updated successfully");
        } else {
          toast.error("Failed! Please try again");
        }
      } else {
        // Save API call
        response = await apiClient.post(
          `api/patient-certificates`,
          values
        );
        if (response.status === 201) {
          toast.success("Data saved successfully");
        } else {
          toast.error("Failed! Please try again");
        }
      }

      fetchApi(); // Refresh data after save
      formikRef.current.resetForm(); // Clear the form fields
      setIsEdit(false); // Reset edit mode
    } catch (error) {
      console.error("Error handling medical data:", error);
      toast.error("An error occurred. Please try again.");
    }
  };


  const handleUpdate = (supplier) => {
    setIsEdit(true);
    formikRef.current.setValues(supplier);
  };

  const handleRefresh = () => {
    fetchApi(); // Refresh data
    formikRef.current.resetForm(); // Clear the form fields
    setIsEdit(false); // Reset edit mode
  };


  //   // File download function

  //   const handleMedicalDownload = async (srNo) => {
  //     try {
  //         const response = await apiClient.get(`api/patient-certificates/generateMedicalCertificate`, {
  //             params: { srNo },
  //             responseType: 'blob', // Handle file response
  //         });

  //         // Check if the response is successful
  //         if (response.status === 200) {
  //             const blob = new Blob([response.data], { type: response.headers['content-type'] });
  //             const link = document.createElement('a');
  //             link.href = window.URL.createObjectURL(blob);
  //             link.download = `MedicalCertificate_${srNo}.pdf`; // Customize the file name
  //             document.body.appendChild(link); // Append link to body
  //             link.click(); // Trigger download
  //             document.body.removeChild(link); // Clean up
  //         } else {
  //             console.error('Failed to download receipt:', response.status);
  //             toast.error("Failed to download receipt. Please try again.");
  //         }
  //     } catch (error) {
  //         console.error('Error downloading the receipt:', error);
  //         toast.error("An error occurred while downloading the receipt. Please try again.");
  //     }
  // };


  const handleMedicalDownload = async (srNo) => {
    try {
      const response = await apiClient.get(`api/patient-certificates/generateMedicalCertificate`, {
        params: { srNo },
        responseType: 'blob',
      });
      // Check if the response is successful
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);

        // Open the PDF in a new tab
        const pdfWindow = window.open('');
        pdfWindow.document.write(`<iframe width='100%' height='100%' src='${url}'></iframe>`);

        // Optional: Clean up the URL after some time to release memory
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100); // Adjust timeout as needed
      } else {
        console.error('Failed to download Medical:', response.status);
        toast.error("Failed to download Medical. Please try again.");
      }
    } catch (error) {
      console.error('Error downloading the Medical:', error);
      toast.error("An error occurred while downloading the Medical. Please try again.");
    }
  };



  return (
    <div className='p-4 bg-gradient-to-br from-sky-50 via-white to-sky-50 mt-6 ml-6  rounded-xl shadow-2xl border border-sky-100'>
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <div className="flex items-center gap-3">
          <Heading headingText="Medical Certificate " />
        </div>
        <div className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-100">Reception • Records</div>
      </div>
      <div className='mt-4'>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleMedical}
        >
          {({ setFieldValue }) => (
            <Form className='lg:w-[100%] md:w-[100%] sm:w-[100%]'>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 ">
                <div>
                  <label className="block text-gray-700 text-sm">Name</label>
                  <Field type="text" name="patientName" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                  <ErrorMessage name="patientName" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm">Age</label>
                  <Field type="text" name="patientAge" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                  <ErrorMessage name="patientAge" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm">Gender</label>
                  <Field as="select" name="gender" className="w-full px-4 py-2 border rounded-lg focus:outline-none text-sm">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Field>
                  <ErrorMessage name="gender" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm">Address</label>
                  <Field type="text" name="patientAddress" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                  <ErrorMessage name="patientAddress" component="div" className="text-red-600 text-sm" />
                </div>



                <div>
                  <label className="block text-gray-700 text-sm">Diseases</label>
                  <Field type="text" name="patientDiseases" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                  <ErrorMessage name="patientDiseases" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm">Office</label>
                  <Field type="text" name="patientOffice" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                  <ErrorMessage name="patientOffice" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm">Consultant Dr</label>
                  <Field type="text" name="consultantDoctor" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                  <ErrorMessage name="consultantDoctor" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm">Dr. Name</label>
                  <Field type="text" name="doctorName" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                  <ErrorMessage name="doctorName" component="div" className="text-red-600 text-sm" />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm">Br From</label>
                  <Field type="date" name="brFrom" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                  <ErrorMessage name="brFrom" component="div" className="text-red-600 text-sm" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm">Br To</label>
                  <Field type="date" name="brTo" className='w-full px-4 py-2 border rounded-lg focus:outline-none text-sm' />
                  <ErrorMessage name="brTo" component="div" className="text-red-600 text-sm" />
                </div>


              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button type="button" onClick={handleRefresh} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-900 text-sm">Refresh</button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-900 text-sm"
                >
                  {isEdit ? "Update" : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="bg-white p-2 mt-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <div className="w-full" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="table-auto w-full border border-collapse shadow">
              <thead>
                <tr className="text-center" style={{ backgroundColor: "#CFE0E733" }}>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">Action</th>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">Name</th>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">Address</th>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">Gender</th>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">Dr Name</th>
                  <th className="px-4 py-2 border border-gray-200 text-sky-500">Age </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((transaction, index) => (
                    <tr key={index} className="border border-gray-200 text-center">
                      <td className="px-4 py-3 border border-gray-200 flex space-x-2">
                        <button
                          className="text-blue-500 hover:text-blue-700 flex items-center"
                          onClick={() => handleMedicalDownload(transaction.srNo)}
                        >
                          <IoPrintOutline className="mr-1" />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700 flex items-center"
                          onClick={() => handleUpdate(transaction)}
                        >
                          <FaPencilAlt className="mr-1" />
                        </button>
                      </td>
                      <td className="px-4 py-3 border border-gray-200">{transaction.patientName}</td>
                      <td className="px-4 py-3 border border-gray-200">{transaction.patientAddress}</td>
                      <td className="px-4 py-3 border border-gray-200">{transaction.gender}</td>
                      <td className="px-4 py-3 border border-gray-200">{transaction.doctorName}</td>
                      <td className="px-4 py-3 border border-gray-200">{transaction.patientAge}</td>

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
  );
};

export default withAuth(MedicalCertificate, ['SUPERADMIN', 'ADMIN', 'RECEPTION'])