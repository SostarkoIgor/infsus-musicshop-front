import api from "./api";
import { Product } from "../types/product";
import { ProductUpdateCreateDto } from "../dto/productUpdateCreate.dto";
import { ProductGetDto } from "../dto/productGet.dto";


let path=import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "http://localhost:8080/api/";
export const getProductById = async (id: number): Promise<Product> => {
    const response = await api.get<ProductGetDto>(path+`products/product/${id}`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch product");
    }
    
    const product: Product = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        image: response.data.image,
        price: response.data.price,
        times_visited: response.data.times_visited,
        category_id: response.data.category_id
    }
    return product;
}

export const updateProduct = async (product: Product): Promise<Product> => {
    const productUpdateCreateDto: ProductUpdateCreateDto = {
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        times_visited: product.times_visited,
        category_id: product.category_id
    }
    const response = await api.put<Product>(path+`products/product/${product.id}`, productUpdateCreateDto);
    return response.data;
}

export const createProduct = async (product: Product): Promise<Product> => {
    const productUpdateCreateDto: ProductUpdateCreateDto = {
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        times_visited: product.times_visited,
        category_id: product.category_id
    }
    const response = await api.post<Product>(path+`products/product`, productUpdateCreateDto);
    return response.data;
}

export const deleteProduct = async (id: number): Promise<void> => {
    await api.delete(path+`products/product/${id}`);
}

