import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 

export const getServices = async () => {
    const response = await axios.get(`${API_URL}/services`);
    return response.data;
};

export const createService = async (serviceData) => {
    const response = await axios.post(`${API_URL}/services`, serviceData);
    return response.data;
};

export const getServiceById = async (id) => {
    const response = await axios.get(`${API_URL}/services/${id}`);
    return response.data;
};

export const updateService = async (id, serviceData) => {
    const response = await axios.put(`${API_URL}/services/${id}`, serviceData);
    return response.data;
};

export const deleteService = async (id) => {
    const response = await axios.delete(`${API_URL}/services/${id}`);
    return response.data;
};


