// withAuth.js
"use client"; // This component is a client component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent, allowedRoles) => {
    return (props) => {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem('accessToken');
            const role = localStorage.getItem('role');

            // If no token, redirect to login
            if (!token) {
                router.push('/');
                return;
            }

            // If user role is not allowed, redirect to unauthorized page
            if (role && !allowedRoles.includes(role)) {
                router.push('/unauthorized');
                return;
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
