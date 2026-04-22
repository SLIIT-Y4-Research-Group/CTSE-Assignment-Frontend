import { apiDelete, apiGet, apiPost } from "./client.js";

const BOOKINGS_BASE_PATH = "/api/bookings";

export const createBooking = async (bookingData) => {
  const { user_id, ...payload } = bookingData || {};
  return apiPost(BOOKINGS_BASE_PATH, payload);
};

export const getBookingById = async (bookingId) => {
  return apiGet(`${BOOKINGS_BASE_PATH}/${bookingId}`);
};

export const getUserBookings = async (userId) => {
  return apiGet(`${BOOKINGS_BASE_PATH}/user/${userId}`);
};

export const cancelBooking = async (bookingId) => {
  return apiDelete(`${BOOKINGS_BASE_PATH}/${bookingId}`);
};

export const confirmPayment = async (data) => {
  return apiPost(`${BOOKINGS_BASE_PATH}/confirm-payment`, data);
};
