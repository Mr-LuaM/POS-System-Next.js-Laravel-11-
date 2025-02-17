import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/api/login`, { email, password });

  // ✅ Store JWT Token & User Info in `sessionStorage`
  sessionStorage.setItem("token", response.data.token);
  sessionStorage.setItem("role", response.data.user.role);
  sessionStorage.setItem("userId", response.data.user.id);
  sessionStorage.setItem("userName", response.data.user.name);
  sessionStorage.setItem("userEmail", response.data.user.email);

  return response;
};

export const getUser = async () => {
  const token = sessionStorage.getItem("token");

  if (!token) throw new Error("Unauthorized");

  return axios.get(`${API_URL}/api/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const logout = () => {
  sessionStorage.clear();
};
