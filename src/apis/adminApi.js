import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 

// Get the token from localStorage (or localStorage if you prefer)
const getAuthToken = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        throw new Error('No token found');
    }
    return token;
};


// Add a method to configure headers for protected routes
const authHeaders = () => {
    const token = getAuthToken();
    console.log('Authorization Header:', `Bearer ${token}`); // Log for debugging
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};


// Fetch all admins (Protected)
export const getAdmins = async () => {
    try {
        const response = await axios.get(`${API_URL}/admins`, authHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching admins:', error);
        throw error; // Rethrow or handle the error as needed
    }
};

// Create a new admin (Unprotected because admin creation can be open)
export const createAdmin = async (adminData) => {
    const response = await axios.post(`${API_URL}/admins`, adminData);
    return response.data;
};

// Get an admin by ID (Protected)
export const getAdminById = async (id) => {
    const response = await axios.get(`${API_URL}/admins/${id}`, authHeaders());
    return response.data;
};

// Update an admin by ID (Protected)
export const updateAdmin = async (id, adminData) => {
    const response = await axios.put(`${API_URL}/admins/${id}`, adminData, authHeaders());
    return response.data;
};

// Delete an admin by ID (Protected)
export const deleteAdmin = async (id) => {
    const response = await axios.delete(`${API_URL}/admins/${id}`, authHeaders());
    return response.data;
};

// Login admin (Unprotected)
export const loginAdmin = async (loginData) => {
    const response = await axios.post(`${API_URL}/login`, loginData);
    return response.data;
};
