import api, { apiDelete, apiGet, apiPatch, apiPost } from "./client.js";

const EVENTS_BASE_PATH = "/api/events/api/events";

export async function createEvent(data) {
  return apiPost(EVENTS_BASE_PATH, data);
}

export async function uploadEventBanner(file) {
  const formData = new FormData();
  formData.append("banner", file);

  return apiPost(`${EVENTS_BASE_PATH}/upload-banner`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function getAllEvents() {
  return apiGet(EVENTS_BASE_PATH);
}

export async function getEventById(id) {
  return apiGet(`${EVENTS_BASE_PATH}/${id}`);
}

export async function updateEvent(id, data) {
  return api.put(`${EVENTS_BASE_PATH}/${id}`, data);
}

export async function deleteEvent(id) {
  return apiDelete(`${EVENTS_BASE_PATH}/${id}`);
}

export async function publishEvent(id, data) {
  return apiPatch(`${EVENTS_BASE_PATH}/${id}/publish`, data);
}

export async function cancelEvent(id, data) {
  return apiPatch(`${EVENTS_BASE_PATH}/${id}/cancel`, data);
}

export async function getFeaturedEvents() {
  return apiGet(`${EVENTS_BASE_PATH}/featured`);
}

export async function getUpcomingEvents() {
  return apiGet(`${EVENTS_BASE_PATH}/upcoming`);
}

export async function getEventsByOrganizer(organizerId) {
  return apiGet(`${EVENTS_BASE_PATH}/organizer/${organizerId}`);
}

export async function getManageAllEvents() {
  return apiGet(`${EVENTS_BASE_PATH}/manage/all`);
}

export async function searchEvents(params = {}) {
  return apiGet(`${EVENTS_BASE_PATH}/search`, { params });
}

export async function searchManagedEvents(params = {}) {
  return apiGet(`${EVENTS_BASE_PATH}/manage/search`, { params });
}

export async function validateEvent(id) {
  return apiGet(`${EVENTS_BASE_PATH}/${id}/validate`);
}
