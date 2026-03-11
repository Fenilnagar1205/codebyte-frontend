import { request } from "./client";

export const getAllBytes  = ()           => request("/bytes");
export const getByteById = (id)         => request(`/bytes/${id}`);
export const submitQuiz  = (id, answers) =>
  request(`/bytes/${id}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
export const createByte  = (payload)   =>
  request("/bytes", { method: "POST", body: JSON.stringify(payload) });
