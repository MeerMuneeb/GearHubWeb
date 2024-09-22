import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 

export const getMechanics = async () => {
    const response = await axios.get(`${API_URL}/mechanics`);
    return response.data;
};

export const createMechanic = async (mechanicData) => {
    const response = await axios.post(`${API_URL}/mechanics`, mechanicData);
    return response.data;
};

export const getMechanicById = async (id) => {
    const response = await axios.get(`${API_URL}/mechanics/${id}`);
    return response.data;
};

export const updateMechanic = async (id, mechanicData) => {
    const response = await axios.put(`${API_URL}/mechanics/${id}`, mechanicData);
    return response.data;
};

export const deleteMechanic = async (id) => {
    const response = await axios.delete(`${API_URL}/mechanics/${id}`);
    return response.data;
};


