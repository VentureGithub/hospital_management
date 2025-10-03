"use client";
import { useState } from "react";
import { FaRegEye, FaTimes } from "react-icons/fa";
import { TiInfoLarge } from "react-icons/ti";

const Icon = ({ message = "Button clicked! Here’s your centered message." }) => {
    const [showMessage, setShowMessage] = useState(false);

    const handleClick = () => {
        setShowMessage(true);
    };

    const handleClose = () => {
        setShowMessage(false);
    };

    return (
        <div className="flex flex-col items-center relative">
            <button 
                onClick={handleClick} 
                className="fixed bottom-16 right-16 flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none shadow-lg animate-bounce"
            >
                <TiInfoLarge className="text-2xl" />
            </button>

            {showMessage && (
                <div className="fixed inset-0 flex items-center justify-center animate-fadeIn">
                    <div className="relative p-6 bg-white text-gray-800 rounded-lg shadow-xl w-80 text-center border">
                        <button 
                            onClick={handleClose} 
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes className="text-lg" />
                        </button>
                      
                        <p className="text-blue-700 ">{message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Icon;
