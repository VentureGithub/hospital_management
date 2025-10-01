import { BaseUrl } from "@/app/config";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react"

const IPDPatientDetails = ({ IPDID }) => {
    const [ipdDetail, setIpdDetail] = useState(null);
    const [patientDetails, setPatientDetails] = useState([]);
    const [doctorDetails, setDoctorDetails] = useState([]);
    const [departmentRecord, setDepartmentRecord] = useState([]);
    const [roomDetails, setRoomDetails] = useState([]);
    const [roomAllotmentDetail, setRoomAllotmentDetail] = useState([]);
    const [imgsrc, setImgSrc] = useState([]);
    useEffect(() => {
        const fetchIPDdetails = async (IPDID) => {
            try {
                debugger;
                const IPDResponse = await axios(`${BaseUrl}ipdregistration/getDetailById?ipdId=${IPDID}`);
                if (IPDResponse.data?.status == "200") {
                    const IPDData = IPDResponse.data.data;
                    setIpdDetail(IPDData);

                    const patientResponse = await axios(`${BaseUrl}api/patId?patId=${IPDData.patId}`);
                    if (patientResponse.data?.status == "200") {
                        setPatientDetails(patientResponse.data.data);
                    }

                    const doctorResponse = await axios(`${BaseUrl}doc/getByDrId?drId=${IPDData.drId}`);
                    if (doctorResponse.data?.status == "200") {
                        setDoctorDetails(doctorResponse.data.data);
                    }

                    const departmentResponse = await axios(`${BaseUrl}dep/getDepId?deptId=${IPDData.drId}`);
                    if (departmentResponse.data?.status == "200") {
                        setDepartmentRecord(departmentResponse.data.data);
                    }

                    const roomResponse = await axios(`${BaseUrl}ipdroomAllotment/getDetailsByPatid?ipdNo=${IPDID}`);
                    if (roomResponse.data?.status == "200") {
                        setRoomAllotmentDetail(roomResponse.data.data);
                        setRoomDetails(roomResponse.data.data[0].master);
                    }

                    const imgageResponse = await axios.get(`${BaseUrl}api/getImage?patId=${IPDData.patId}`, { responseType: 'blob' })
                    if (imgageResponse.status == "200") {
                        const blob = imgageResponse.data;
                        const url = URL.createObjectURL(blob);
                        setImgSrc(url);
                    }
                    console.log("IPD Details :" + JSON.stringify(IPDData));
                    console.log("Patient Details:" + JSON.stringify(patientResponse.data.data));
                    console.log("Room Details:" + JSON.stringify(roomResponse.data.data));
                    console.log("Room Master Details:" + JSON.stringify(roomResponse.data.data[0].master));

                }
                else {
                    alert("Something went wrong");
                }
            }
            catch (error) {
                console.log(`Error: ${error}`);
            }
        }
        fetchIPDdetails(IPDID);
    }, []);



    return (
        <>
            <div>
                {ipdDetail ?
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="6">Patient Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={6}>
                                    <img src={imgsrc} alt="Captured" className="mt-2 border rounded" style={{ width: "200px" }} />
                                </td>
                            </tr>
                            <tr>
                                <td>Patient ID:</td>
                                <td>{ipdDetail.patId}</td>
                                <td>IPD ID:</td>
                                <td>{ipdDetail.ipdNo}</td>
                                <td>Admission Date , Time :</td>
                                <td>
                                    {format(ipdDetail.admitTime, "dd-MM-yyyy")} , {format(parseISO(ipdDetail.admitTime), "hh:mm aa")}
                                </td>
                            </tr>
                            <tr>
                                <td>Patient Name:</td>
                                <td>{patientDetails.patientName}</td>
                                <td>Gaurdian Name:</td>
                                <td>{patientDetails.sonOf}</td>
                                <td>Age / Sex</td>
                                <td>{patientDetails.age + ' years / ' + patientDetails.gender}</td>
                            </tr>

                            <tr>
                                <td>Weight</td>
                                <td>{patientDetails.weight}</td>
                                <td>Maritial status:</td>
                                <td>{patientDetails.maritalStatus}</td>
                                <td>Occupation:</td>
                                <td>{patientDetails.occupation}</td>
                            </tr>
                            <tr>

                                <td>Contact No.:</td>
                                <td>{patientDetails.contactNumber}</td>
                                <td>Emergency Contact No.:</td>
                                <td>{patientDetails.contactNumber}</td>
                                <td>Email ID:</td>
                                <td>{patientDetails.email}</td>
                            </tr>
                            <tr>
                                <td>Address:</td>
                                <td colSpan={5}>{patientDetails.patientAddress}</td>
                            </tr>
                            <tr>
                                <td colSpan={6}>
                                    <br />
                                    Patient admitted in
                                </td>
                            </tr>
                            <tr>

                                <td>Room/Ward Type:</td>
                                <td>{roomDetails.roomType}</td>
                                <td>Floor No:</td>
                                <td>{roomDetails.roomWard}</td>
                                <td>Bed No:</td>
                                <td>{roomAllotmentDetail.bedNo}</td>
                            </tr>
                            <tr>
                                <td colSpan={6}>
                                    <br />
                                    Patient is being treated By
                                </td>
                            </tr>
                            <tr>
                                <td>Doctor's Name:</td>
                                <td colSpan={5}>
                                    Dr. {doctorDetails.drName} , {doctorDetails.qualification} , {departmentRecord.depName}
                                </td>

                            </tr>
                        </tbody>
                    </table> : ""
                }

            </div>
        </>
    )
}

export default IPDPatientDetails