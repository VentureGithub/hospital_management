import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { BaseUrl } from '../config';

const useRoomMasterForm = (roomId) => {
    const DefaultFormData = {
        roomwardId : 0 || "",
        roomType : "",
        roomName : "",
        roomRate : 0,
        roomStatus : true
      }

    const [input, setInput] = useState(DefaultFormData);
     const [error, setError] = useState(false);
    const [roomWard, setRoomWard] = useState("R");
    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState(''); 
    const [roomTypeName, setRoomTypeName] = useState([]); 
    const router = useRouter();

    // const handleInput = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     if (type === "radio") {
    //         setRoomWard(value);
    //         setInput({ ...input, "roomWard": value });
    //     } else {
    //         setInput({ ...input, [name]: value });
    //     }
    // };

    const handleInput = (event) => {
        const { name, value } = event.target;
        setInput((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!input.roomNo) {
            setError(true);
        } else {
            try {
                const response = await axios.post(`${BaseUrl}patientRoom/admitRoom`, input);
                if (response.data.status === 202) {
                    Swal.fire({ text: "Data is saved successfully!", icon: "success" });
                    fetchRoom();
                    setInput(DefaultFormData);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleRefresh = () => {
        setInput(DefaultFormData);
    };

    const fetchRoom = async () => {
        try {
            const response = await axios.get(`${BaseUrl}patientRoom/getAllDetailofRoom`);
            if (response.data.status === 200) {
                setRoomData(response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemove = (roomwardId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to remove this room!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove it!",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (await removeRoom(roomwardId)) {
                    fetchRoom();
                    Swal.fire("Room has been removed successfully!", { icon: "success" });
                } else {
                    Swal.fire("Room couldn't be removed!", { icon: "error" });
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire("Cancelled", "Room is safe :)", "info");
            }
        });
    };

    const removeRoom = async (roomwardId) => {
        try {
            const response = await axios.delete(`${BaseUrl}patientRoom/delete?roomwardId=${roomwardId}`);
            return response.data.status === 200;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const handleEdit = (roomwardId) => {
        router.push(`/roomType?roomId=${roomwardId}`);
    };

    const handleUpdate = async () => {
        setInput({ ...input, roomId });
        await axios.put(`${BaseUrl}patientRoom/updateRoomMaster`, input)
            .then((response) => {
                if (response.data.status === 200) {
                    Swal.fire({ title: '', text: 'Record has been updated successfully!', icon: 'success', confirmButtonText: 'OK' });
                    fetchRoom();
                    setInput(DefaultFormData);
                }
            });
    };

    const getRoomDetailByID = async () => {
        try {
            const response = await axios.get(`${BaseUrl}patientRoom/getRoom?roomwardId=${roomId}`);
            if (response.data.status === 200) {
                setInput(response.data.data);
                setRoomWard(response.data.data.roomWard);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRoom();
        setLoading(false);
    }, []);

    useEffect(() => {
        if (roomId) {
            getRoomDetailByID();
        }
    }, [roomId]);


    const fetchApi = async () => {
        const response = await axios.get(`${BaseUrl}roomTypeMaster/getAllDetailofRoomTypeMaster`);
        console.log("response => ", response.data.data)
        setRoomTypeName(response.data.data);
        
    }

    useEffect(() => {
        fetchApi();
    }, [])

   



    return {
        input,
        roomData,
        error,
        loading,
        room,
        roomTypeName,
        handleInput,
        handleSave,
        handleRefresh,
        handleRemove,
        handleEdit,
        handleUpdate
    };
};

export default useRoomMasterForm;
