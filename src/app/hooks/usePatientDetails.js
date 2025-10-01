import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
// import { BaseUrl } from "../config";
import {BaseUrl} from "../config.js"
import { addIPDno, addOPDno } from "../redux/slice";


const usePatientDetails = (searchIpdId) => {
    const [IpdDetail, setIpdDetail] = useState([]);
    const [patientDetail, setPatientDetail] = useState([]);
    const [doctorDetails, setDoctorDetails] = useState({});
    const [departmentRecord, setDepartmentRecord] = useState({});
    const [roomDetails, setRoomDetails] = useState([]);
    const [roomAllotmentDetail, setRoomAllotmentDetail] = useState([]);
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchPatientDetail = async () => {
            if (!searchIpdId) return;
            try {
                const url = searchIpdId.includes('IPD') ?
                    `${BaseUrl}ipdregistration/getDetailById?ipdId=${searchIpdId}` :
                    `${BaseUrl}api/opdregistration/getDetailsByOpdId?opdId=${searchIpdId}`
                const response = await axios.get(url);
                if (response.status === 200) {
                    setIpdDetail(response.data.data);
                    const patId = response?.data?.data?.patId;
                    const response2 = await axios.get(`${BaseUrl}api/patId?patId=${patId}`);
                    if (response2.data.status === 200) {
                        setPatientDetail(response2.data.data);
                    }
                    const doctorResponse = await axios(`${BaseUrl}doc/getByDrId?drId=${response.data.data.drId}`);
                    if (doctorResponse.data.status === 200) {
                        setDoctorDetails(doctorResponse.data.data);
                    }

                    const departmentResponse = await axios(`${BaseUrl}dep/getDepId?deptId=${response.data.data.drId}`);
                    if (departmentResponse.data?.status === 200) {
                        setDepartmentRecord(departmentResponse.data.data);
                    }

                    if (searchIpdId.includes('IPD')) {
                        const roomResponse = await axios(`${BaseUrl}ipdroomAllotment/getDetailsByIpdNo?ipdNo=${searchIpdId}`);
                        if (roomResponse.data?.status === 200) {
                            const sortedData = [...roomResponse.data.data].sort((a, b) => a.allotmentId - b.allotmentId);
                            setRoomAllotmentDetail(sortedData[0]);
                            setRoomDetails(sortedData[0].master);
                        }
                        dispatch(addIPDno({ ipdNo: searchIpdId, patId: patId }));
                    } else {
                        dispatch(addOPDno({ opdNo: searchIpdId, patId: patId }));
                    }
                }
            } catch (error) {
                console.error('Error fetching room allotments:', error);
            }
        };

        fetchPatientDetail();
    }, [searchIpdId]);
    return { IpdDetail, patientDetail, doctorDetails, departmentRecord, roomDetails, roomAllotmentDetail };
};

export default usePatientDetails;