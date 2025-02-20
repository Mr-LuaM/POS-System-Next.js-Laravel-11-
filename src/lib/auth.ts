import { fetchUser } from "@/services/auth";

let cachedUser: { id: number; name: string; email: string; role: "admin" | "manager" | "cashier"; store_id?: number } | null = null;

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
 * ✅ Clears the cached user (Call on logout)
 */
export const clearCachedUser = () => {
  cachedUser = null;
};
