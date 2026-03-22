import { apiDelete, apiGet, apiPatch, apiPost } from "./client.js";

export const authLogin = (payload) => apiPost("/api/users/api/auth/login", payload);
export const authRegister = (payload) => apiPost("/api/users/api/auth/register", payload);

export const getCurrentUser = () => apiGet("/api/users/api/users/me");
export const getUsers = () => apiGet("/api/users/api/users");
export const createUser = (payload) => apiPost("/api/users/api/users", payload);
export const updateUserRole = (userId, payload) => apiPatch(`/api/users/api/users/${userId}/role`, payload);
export const updateUserStatus = (userId, payload) => apiPatch(`/api/users/api/users/${userId}/status`, payload);
export const changeMyPassword = (payload) => apiPost("/api/users/api/users/me/change-password", payload);

export const getRoles = () => apiGet("/api/users/api/roles");
export const createRole = (payload) => apiPost("/api/users/api/roles", payload);
export const updateRole = (roleId, payload) => apiPatch(`/api/users/api/roles/${roleId}`, payload);
export const deleteRole = (roleId) => apiDelete(`/api/users/api/roles/${roleId}`);
