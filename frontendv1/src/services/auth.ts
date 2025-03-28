import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ Stores user session data
 */
const storeUserSession = (token: string, user: any) => {
  sessionStorage.clear();
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("role", user.role);
  sessionStorage.setItem("userId", user.id.toString());
  sessionStorage.setItem("userName", user.name);
  sessionStorage.setItem("userEmail", user.email);
  if (user.store_id) sessionStorage.setItem("storeId", user.store_id.toString());
};

/**
 * ✅ Login Function
 */
export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/login", { email, password });
    const { token, user } = response.data;

    // ✅ Store user session
    storeUserSession(token, user);

    return { success: true, user };
  } catch (error) {
    return { success: false, message: handleApiError(error) };
  }
};

/**
 * ✅ Fetch Authenticated User
 */
export const fetchUser = async () => {
  try {
    const response = await axiosInstance.get("/user");
    return response.data;
  } catch (error) {
    return null; // ✅ Return `null` if user fetch fails
  }
};

/**
 * ✅ Logout Function
 */
export const logout = async () => {
  try {
    await axiosInstance.post("/logout");
  } catch (error) {
    console.error("Logout failed:", handleApiError(error));
  } finally {
    sessionStorage.clear();
  }
};
