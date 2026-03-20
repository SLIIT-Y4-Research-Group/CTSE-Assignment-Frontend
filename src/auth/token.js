const TOKEN_KEY = "ems_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const parseJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = parseJwt(token);
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000;
};

export { TOKEN_KEY };
