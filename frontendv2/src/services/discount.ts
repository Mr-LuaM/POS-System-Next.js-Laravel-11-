import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ Discount Type Definition
 */
export interface Discount {
  id: number;
  code: string;
  discount_value: number;
  discount_type: "fixed" | "percentage";
  valid_until: string;
}

/**
 * ✅ Fetch All Discounts
 */
export const fetchDiscounts = async (): Promise<Discount[]> => {
  try {
    const { data } = await axiosInstance.get("/discounts");
    return data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Create a New Discount
 */
export const createDiscount = async (discountData: Omit<Discount, "id">): Promise<Discount> => {
  try {
    const { data } = await axiosInstance.post("/discounts/add", discountData);
    return data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Update an Existing Discount
 */
export const updateDiscount = async (id: number, discountData: Omit<Discount, "id">): Promise<Discount> => {
  try {
    const { data } = await axiosInstance.put(`/discounts/update/${id}`, discountData);
    return data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Delete a Discount
 */
export const deleteDiscount = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/discounts/delete/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
