"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent, allowedRoles) => {
    const ComponentWithAuth = (props) => {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem('accessToken');
            const role = localStorage.getItem('role');

            if (!token) {
                router.push('/');
                return;
            }

            if (role && !allowedRoles.includes(role)) {
                router.push('/unauthorized');
                return;
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };

    // Set a readable display name for easier debugging
    const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || "Component";
    ComponentWithAuth.displayName = `withAuth(${wrappedComponentName})`;

    return ComponentWithAuth;
};

export default withAuth;
