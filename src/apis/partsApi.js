import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getParts = async () => {
    const response = await axios.get(`${API_URL}/parts`);
    return response.data;
};

export const createPart = async (partData) => {
    const response = await axios.post(`${API_URL}/parts`, partData);
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



