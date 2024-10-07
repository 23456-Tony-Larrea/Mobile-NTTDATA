import axios from "axios";
import { apiUrl } from "../url/url";
import { Product } from "../models/Product";
export type ProductsParams = Omit<Product, "id">;

export const GetProductsAction = async (): Promise<Product[]> => {
  const response = await axios.get(`${apiUrl}`);
  return response.data.data;
};

export const UpdateProductAction = async (data: Product): Promise<Product> => {
  const response = await axios.put(`${apiUrl}/${data.id}`, data);
  return response.data;
};

export const CreateProductAction = async (data: Product): Promise<any> => {
  const response = await axios.post(`${apiUrl}`, data);
  return response.data;
};

export const DeleteProductAction = async (id: string): Promise<void> => {
  await axios.delete(`${apiUrl}/${id}`);
};

export const verifyIdExists = async (id: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error verifying ID:", error);
    return false;
  }
};
