import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const getSales = async () => {
  return axios.get(`${API_URL}/api/sales`);
};

export const addSale = async (saleData: any) => {
  return axios.post(`${API_URL}/api/sales`, saleData);
};
