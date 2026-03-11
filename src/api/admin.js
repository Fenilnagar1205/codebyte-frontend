import { request } from "./client";

// ── Bytes ─────────────────────────────────────────────────────────────────────
export const adminGetAllBytes  = ()           => request("/bytes");
export const adminGetByte      = (id)         => request(`/admin/bytes/${id}`);
export const adminCreateByte   = (payload)    => request("/bytes", { method: "POST", body: JSON.stringify(payload) });
export const adminUpdateByte   = (id, payload)=> request(`/bytes/${id}`, { method: "PUT",  body: JSON.stringify(payload) });
export const adminDeleteByte   = (id)         => request(`/bytes/${id}`, { method: "DELETE" });

// ── Users ─────────────────────────────────────────────────────────────────────
export const adminGetAllUsers  = ()           => request("/admin/users");
export const adminDeleteUser   = (id)         => request(`/admin/users/${id}`, { method: "DELETE" });

// ── Stats ─────────────────────────────────────────────────────────────────────
export const adminGetStats     = ()           => request("/admin/stats");