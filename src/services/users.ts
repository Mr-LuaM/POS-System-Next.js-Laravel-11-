import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const BASE_URL = `${API_URL}/api/users`;

// ✅ Get token from storage
const getAuthToken = () => sessionStorage.getItem("token") || localStorage.getItem("token");

// ✅ Axios instance with Authorization
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach Authorization token
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Fetch all users
export const getUsers = async () => {
  const response = await axiosInstance.get("/");
  return response.data.users;
};

// ✅ Add a new user
export const addUser = async (userData: any) => {
  const response = await axiosInstance.post("/create", userData);
  return response.data.user;
};

// ✅ Update a user
export const updateUser = async (id: number, userData: any) => {
  const response = await axiosInstance.put(`/update/${id}`, userData);
  return response.data.user;
};

// ✅ Delete a user
export const deleteUser = async (id: number) => {
  await axiosInstance.delete(`/delete/${id}`);
};

// ✅ Update user role
export const updateUserRole = async (id: number, role: string) => {
  const response = await axiosInstance.put(`/update-role/${id}`, { role });
  return response.data.user;
};
