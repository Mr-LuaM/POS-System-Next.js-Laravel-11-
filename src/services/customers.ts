import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const getCustomers = async () => {
  return axios.get(`${API_URL}/api/customers`);
};

export const addCustomer = async (customerData: any) => {
  return axios.post(`${API_URL}/api/customers`, customerData);
};

export const updateCustomer = async (customerId: number, customerData: any) => {
  return axios.put(`${API_URL}/api/customers/${customerId}`, customerData);
};

export const deleteCustomer = async (customerId: number) => {
  return axios.delete(`${API_URL}/api/customers/${customerId}`);
};
