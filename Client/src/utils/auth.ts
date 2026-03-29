// src/utils/auth.ts
export const saveToken = (token: string) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const isLoggedIn = () => !!getToken();
export const logout = () => localStorage.removeItem("token");