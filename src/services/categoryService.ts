import api from "./api";
import { Category } from "../types/category";

let path=import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:8080/api/";
export const getAllCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>(path+`categories/all`);
    return response.data;
}