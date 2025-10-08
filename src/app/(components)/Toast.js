'use client'; // Ensures that this code runs on the client side (React)

import { useEffect } from 'react';
import { toast } from 'sonner'; // Import the toast function from Sonner

// Custom Toast Component
const CustomToast = ({ message, type }) => {
    useEffect(() => {
        // Customize toast appearance with Tailwind CSS
        toast[type](message, {
            // Use Tailwind utility classes for background color
            style: {
                backgroundColor: type === 'success' ? '#10B981' : '#EF4444', // Green for success, Red for error
                color: 'white', // text color
                borderRadius: '0.375rem', // rounded corners (Tailwind's 'rounded-md')
                padding: '0.75rem 1rem', // padding
                fontSize: '1rem', // font size (adjustable)
                maxWidth: '400px', // max width for toast
            },
            position: 'top-right', // Position toast at the top-right corner
            duration: 4000, // Duration of the toast (in ms)
            // Apply Tailwind utility classes for position and margin
            className: 'absolute top-4 right-4 z-50', // Fixed position at top-right
        });
    }, [message, type]);

    return null; // Sonner will handle the rendering
};

export default CustomToast;
