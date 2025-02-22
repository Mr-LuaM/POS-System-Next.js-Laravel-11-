import { fetchUser } from "@/services/auth";
import { fetchStoreName } from "@/services/stores"; // ✅ Assume this fetches store details

let cachedUser: { 
  id: number; 
  name: string; 
  email: string; 
  role: "admin" | "manager" | "cashier"; 
  store_id?: number 
} | null = null;

/**
 * ✅ Fetches user info (Cached for performance)
 */
export const getUser = async () => {
  if (!cachedUser) {
    cachedUser = await fetchUser();
  }
  return cachedUser;
};

/**
 * ✅ Returns the user's name
 */
export const getUserName = async (): Promise<string> => {
  const user = await getUser();
  return user.name;
};

/**
 * ✅ Returns the user's role
 */
export const getUserRole = async (): Promise<"admin" | "manager" | "cashier"> => {
  const user = await getUser();
  return user.role;
};

/**
 * ✅ Returns the user's store ID (or null if not assigned)
 */
export const getUserStoreId = async (): Promise<number | null> => {
  const user = await getUser();
  return user.store_id ?? null;
};

/**
 * ✅ Returns the user's store name (or "Unassigned" if no store)
 */
export const getStoreName = async (): Promise<string> => {
  const storeId = await getUserStoreId();
  if (!storeId) return "Unassigned";

  try {
    const store = await fetchStoreName(storeId);
   
    return store ?? "Unknown Store";
  } catch (error) {
    console.error("Failed to fetch store name:", error);
    return "Unknown Store";
  }
};

/**
 * ✅ Clears the cached user (Call on logout)
 */
export const clearCachedUser = () => {
  cachedUser = null;
};
