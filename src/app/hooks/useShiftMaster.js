import axios from "axios";
import { BaseUrl } from "@/app/config"; // Assuming you have a BaseUrl in config
import { useState, useEffect } from "react";


const useShiftMaster = () => {
    const DefaultFormData = {
        shiftId: 0,
        shiftName: "",
        timeFrom: "",
        toTime: ""
    }


    const [data, setData] = useState([]);
    const [inputs, setInputs] = useState({ DefaultFormData });
    const [isEdit, setIsEdit] = useState(false);

    // Fetch all room types
    const fetchApi = async () => {
        try {
            const response = await axios.get(BaseUrl + "shiftMaster/getAllDetailsghiftMaster");
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    // Handle saving or updating the room type
    const handleShiftMaster = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                // Corrected Update API call with room id
                const response = await axios.put(
                    `${BaseUrl}shiftMaster/updateShiftMaster?shiftId=${inputs.shiftId}`, // Fixed URL construction
                    inputs
                );
                if (response.status === 200) {
                    alert("Data updated successfully");
                    setIsEdit(false); // Reset edit state after update
                } else {
                    alert("Update failed! Please try again");
                }
            } else {
                // Save API call for new room type
                const response = await axios.post(
                    BaseUrl + "shiftMaster/saveShiftMaster",
                    inputs
                );
                console.log(response.data.data)
                if (response.status === 202) {
                    alert("Data saved successfully");
                } else {
                    alert("Save failed! Please try again");
                }
            }
            fetchApi(); // Refresh the list of room types after save or update
            setInputs({ shiftId: 0, shiftName: "", timeFrom: "", toTime: "" }); // Reset input fields
        } catch (error) {
            console.error("Error handling :", error);
            alert("An error occurred. Please try again.");
        }
    };


    // Set the form fields for editing a room type
    const handleUpdate = (shift) => {
        setInputs({
            shiftId: shift.shiftId, // Set the id for updating
            shiftName: shift.shiftName,
            timeFrom: shift.timeFrom,
            toTime: shift.toTime
        });
        setIsEdit(true); // Set edit mode to true
    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    return {
        inputs,
        data,
        isEdit,
        handleShiftMaster,
        handleUpdate,
        handleChange
    };
};

export default useShiftMaster;