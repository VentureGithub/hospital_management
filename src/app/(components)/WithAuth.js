"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent, allowedRoles) => {
    const ComponentWithAuth = (props) => {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem('accessToken');
            const rawRole = localStorage.getItem('role');
            const role = rawRole ? rawRole.toString().trim().toUpperCase() : '';

            if (!token) {
                router.push('/');
                return;
            }

            if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
                const normalizedAllowed = allowedRoles.map(r => r.toString().trim().toUpperCase());
                if (role && !normalizedAllowed.includes(role)) {
                    router.push('/UnauthorisedPage.js');
                    return;
                }
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
