import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const ImageUploader = ({ setImageSrc, onCapture }) => {
    const webcamRef = useRef(null);
    const [webcamActive, setWebcamActive] = useState(false);

    const capture = useCallback(() => {
        debugger;
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            setImageSrc(imageSrc);
            setWebcamActive(false); // Hide webcam after capture
            onCapture(false);
        }
    }, [webcamRef, setImageSrc]);

    return (
        <>
            <div className="flex justify-center">
                <div className="text-center">
                    <div className="mb-3">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="100%"
                            videoConstraints={{ facingMode: 'user' }}
                        />
                    </div>
                    <button
                        className="bg-red-600 text-white px-4 py-2 hover:bg-red-900"
                        onClick={capture} >
                        Capture Image
                    </button>
                </div>
            </div>

        </>
    );
};

export default ImageUploader;
