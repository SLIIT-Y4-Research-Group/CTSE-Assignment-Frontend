import axios from "axios";

const API_BASE = "http://localhost:3003/api/bookings";

export const createBooking = async (bookingData) => {
  return axios.post(API_BASE, bookingData);
};

export const getBookingById = async (bookingId) => {
  return axios.get(`${API_BASE}/${bookingId}`);
};

export const getUserBookings = async (userId) => {
  return axios.get(`${API_BASE}/user/${userId}`);
};

export const cancelBooking = async (bookingId) => {
  return axios.delete(`${API_BASE}/${bookingId}`);
};

export const confirmPayment = async (data) => {
  return axios.post(`${API_BASE}/confirm-payment`, data);
};