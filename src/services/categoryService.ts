import api from "./api";
import { Category } from "../types/category";

export const getAllCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>(`category/all`);
    return response.data;
}