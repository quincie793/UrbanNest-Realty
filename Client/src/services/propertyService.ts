import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5000/api";

export const getProperties = async () => {
  const response = await axios.get(`${API_URL}/properties`);
  return response.data;
};