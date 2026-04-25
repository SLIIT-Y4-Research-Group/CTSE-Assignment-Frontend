import axios from "axios";

const API_BASE = "http://event-system-alb-1954530717.ap-south-1.elb.amazonaws.com/api/tickets/api/tickets"; // ticket service


export const getAllTickets = async () => {
  return axios.get(API_BASE);
};

export const getTicketById = async (ticketId) => {
  return axios.get(`${API_BASE}/${ticketId}`);
};

export const createTicket = async (ticketData) => {
  return axios.post(API_BASE, ticketData);
};

export const updateTicket = async (ticketId, ticketData) => {
  return axios.put(`${API_BASE}/${ticketId}`, ticketData);
};


export const deleteTicket = async (ticketId) => {
  return axios.delete(`${API_BASE}/${ticketId}`);
};

export const searchTickets = async (params) => {
  return axios.get(API_BASE, { params });
};

export const getTicketsByEvent = async (eventId) => {
  return axios.get(`${API_BASE}/event/${eventId}`);
};