import { useState, useEffect } from 'react';

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if the token exists in localStorage (or sessionStorage)
        const token = localStorage.getItem('adminToken');
        if (token) {
            setIsAuthenticated(true); // If token exists, user is authenticated
        } else {
            setIsAuthenticated(false); // No token means not authenticated
        }
    }, []);

    return { isAuthenticated };
}

export default useAuth;
