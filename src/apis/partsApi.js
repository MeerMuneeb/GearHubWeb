import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getParts = async () => {
    const response = await axios.get(`${API_URL}/parts`);
    return response.data;
};

// Updated createPart to handle file uploads
export const createPart = async (partData, imageFile) => {
    // Create a FormData object
    const formData = new FormData();
    
    // Append part data to FormData
    for (const key in partData) {
        formData.append(key, partData[key]);
    }

    // Append the image file
    if (imageFile) {
        formData.append('image', imageFile); // 'image' should match your backend expectation
    }

    const response = await axios.post(`${API_URL}/parts`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // Set the appropriate content type
        }
    });

    return response.data;
};

export const getPartById = async (id) => {
    const response = await axios.get(`${API_URL}/parts/${id}`);
    return response.data;
};

export const updatePart = async (id, partData) => {
    const response = await axios.put(`${API_URL}/parts/${id}`, partData);
    return response.data;
};

export const deletePart = async (id) => {
    const response = await axios.delete(`${API_URL}/parts/${id}`);
    return response.data;
};
