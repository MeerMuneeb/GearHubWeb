import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getTickets = async () => {
    const response = await axios.get(`${API_URL}/tickets`);
    return response.data;
};

export const createTicket = async (ticketData) => {
    const response = await axios.post(`${API_URL}/tickets`, ticketData);
    return response.data;
};

export const getTicketById = async (id) => {
    const response = await axios.get(`${API_URL}/tickets/${id}`);
    return response.data;
};

export const updateTicket = async (id, ticketData) => {
    const response = await axios.put(`${API_URL}/tickets/${id}`, ticketData);
    return response.data;
};

export const deleteTicket = async (id) => {
    const response = await axios.delete(`${API_URL}/tickets/${id}`);
    return response.data;
};


