import { request } from "./client";

export const getMyProgress = () => request("/progress/me");