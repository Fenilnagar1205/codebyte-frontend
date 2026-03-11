const BASE = "/api";

export const getToken  = () => localStorage.getItem("cb_token");
export const setToken  = (t) => localStorage.setItem("cb_token", t);
export const clearToken = () => localStorage.removeItem("cb_token");

export const request = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
};
