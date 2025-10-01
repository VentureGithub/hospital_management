import axios from "axios";
import { BaseUrl } from "@/app/config"; // Assuming you have a BaseUrl in config
import { useState, useEffect } from "react";


const useRoomTypeMasterForm = () => {
    const DefaultFormData = {
        roomTypeId: 0,
        roomTypeName: "",
        description: ""
    }


    const [data, setData] = useState([]);
    const [inputs, setInputs] = useState({ DefaultFormData });
    const [isEdit, setIsEdit] = useState(false);



    // Fetch all room types
    const fetchApi = async () => {
        try {
            const response = await axios.get(`${BaseUrl}roomTypeMaster/getAllDetailofRoomTypeMaster`);
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);


    // Handle saving or updating the room type
    const handleRoom = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                // Corrected Update API call with room id
                const response = await axios.put(
                    `${BaseUrl}roomTypeMaster/updateRoomTypeMaster?id=${inputs.roomTypeId}`, // Fixed URL construction
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
                    `${BaseUrl}roomTypeMaster/saveRoomType`,
                    inputs
                );
                if (response.status === 202) {
                    alert("Data saved successfully");
                } else {
                    alert("Save failed! Please try again");
                }
            }
            fetchApi(); // Refresh the list of room types after save or update
            setInputs({ roomTypeId : 0, roomTypeName : "", description : "" });
        } catch (error) {
            console.error("Error handling room type:", error);
            alert("An error occurred. Please try again.");
        }
    };


    // Set the form fields for editing a room type
    const handleUpdate = (roomType) => {
        setInputs({
            roomTypeId: roomType.roomTypeId,
            roomTypeName: roomType.roomTypeName,
            description: roomType.description
        });
        setIsEdit(true);
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
        handleRoom,
        handleUpdate,
        handleChange
    };
};

export default useRoomTypeMasterForm;